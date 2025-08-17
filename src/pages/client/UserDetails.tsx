// pages/account/AccountDetails.tsx
import React, { useState, useEffect, useRef } from "react";
import type { User } from "../../types/user.types";
import userService from "../../services/user.services";

interface EditingState {
  personalInfo: boolean;
  email: boolean;
  phone: boolean;
}

interface OtpState {
  email: {
    show: boolean;
    otp: string;
    loading: boolean;
    countdown: number;
  };
  phone: {
    show: boolean;
    otp: string;
    loading: boolean;
    countdown: number;
  };
}

interface FormErrors {
  Fullname?: string;
  email?: string;
  phone?: string;
  otp?: string;
}

const AccountDetails: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    Fullname: "",
    email: "",
    phone: "",
  });
  const [originalData, setOriginalData] = useState({
    Fullname: "",
    email: "",
    phone: "",
  });
  const [editing, setEditing] = useState<EditingState>({
    personalInfo: false,
    email: false,
    phone: false,
  });
  const [otpState, setOtpState] = useState<OtpState>({
    email: { show: false, otp: "", loading: false, countdown: 0 },
    phone: { show: false, otp: "", loading: false, countdown: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<keyof EditingState | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  
  const countdownIntervals = useRef<{ email?: ReturnType<typeof setInterval>; phone?: ReturnType<typeof setInterval> }>({});

  useEffect(() => {
    fetchUserData();
    return () => {
      // Cleanup intervals
      Object.values(countdownIntervals.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await userService.getUserProfile();
      setUser(userData);
      const formattedData = {
        Fullname: userData.name?.split(" ")[0] || "",
        email: userData.email || "",
        phone: userData.phone || "",
      };
      setFormData(formattedData);
      setOriginalData(formattedData);
    } catch (error: any) {
      setErrors({ email: error.message });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      return "Please enter a valid Indian phone number";
    }
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 3) return "Name must be at least 3 characters";
    return undefined;
  };

  const validateOtp = (otp: string): string | undefined => {
    if (!otp) return "OTP is required";
    if (otp.length !== 6) return "OTP must be 6 digits";
    if (!/^\d{6}$/.test(otp)) return "OTP must contain only numbers";
    return undefined;
  };

  const startCountdown = (type: 'email' | 'phone') => {
    setOtpState(prev => ({
      ...prev,
      [type]: { ...prev[type], countdown: 300 } // 5 minutes
    }));

    countdownIntervals.current[type] = setInterval(() => {
      setOtpState(prev => {
        const newCountdown = prev[type].countdown - 1;
        if (newCountdown <= 0) {
          if (countdownIntervals.current[type]) {
            clearInterval(countdownIntervals.current[type]);
            delete countdownIntervals.current[type];
          }
          return {
            ...prev,
            [type]: { ...prev[type], countdown: 0, show: false, otp: "" }
          };
        }
        return {
          ...prev,
          [type]: { ...prev[type], countdown: newCountdown }
        };
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setSuccessMessage("");
  };

  const handleOtpChange = (type: 'email' | 'phone', value: string) => {
    // Only allow digits and limit to 6 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    
    setOtpState(prev => ({
      ...prev,
      [type]: { ...prev[type], otp: numericValue }
    }));
    
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: undefined }));
    }
  };

  const handleEdit = (section: keyof EditingState) => {
    setEditing({
      personalInfo: false,
      email: false,
      phone: false,
      [section]: true,
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleCancel = (section: keyof EditingState) => {
    setFormData(originalData);
    setEditing({
      ...editing,
      [section]: false,
    });
    
    // Hide OTP if canceling email or phone
    if (section === 'email') {
      setOtpState(prev => ({ ...prev, email: { ...prev.email, show: false, otp: "" } }));
      if (countdownIntervals.current.email) {
        clearInterval(countdownIntervals.current.email);
        delete countdownIntervals.current.email;
      }
    } else if (section === 'phone') {
      setOtpState(prev => ({ ...prev, phone: { ...prev.phone, show: false, otp: "" } }));
      if (countdownIntervals.current.phone) {
        clearInterval(countdownIntervals.current.phone);
        delete countdownIntervals.current.phone;
      }
    }
    
    setErrors({});
    setSuccessMessage("");
  };

  const handleSave = async (section: keyof EditingState) => {
    setErrors({});
    setSuccessMessage("");
    
    try {
      if (section === "personalInfo") {
        const nameError = validateName(formData.Fullname);
        if (nameError) {
          setErrors({ Fullname: nameError });
          return;
        }
        
        setSaving(section);
        const updatedUser = await userService.updatePersonalInfo({
          name: formData.Fullname.trim()
        });
        
        setOriginalData(formData);
        setUser(updatedUser);
        setEditing({ ...editing, [section]: false });
        setSuccessMessage("Personal information updated successfully!");
        
      } else if (section === "email") {
        const emailError = validateEmail(formData.email);
        if (emailError) {
          setErrors({ email: emailError });
          return;
        }
        
        if (!otpState.email.show) {
          // Send OTP
          setSaving(section);
          await userService.sendEmailUpdateOtp({ email: formData.email });
          setOtpState(prev => ({ ...prev, email: { ...prev.email, show: true } }));
          startCountdown('email');
          setSuccessMessage("OTP sent to your phone number!");
        } else {
          // Verify OTP
          const otpError = validateOtp(otpState.email.otp);
          if (otpError) {
            setErrors({ otp: otpError });
            return;
          }
          
          setOtpState(prev => ({ ...prev, email: { ...prev.email, loading: true } }));
          const updatedUser = await userService.verifyEmailUpdateOtp({
            otp: otpState.email.otp
          });
          
          setOriginalData(formData);
          setUser(updatedUser);
          setEditing({ ...editing, [section]: false });
          setOtpState(prev => ({ ...prev, email: { show: false, otp: "", loading: false, countdown: 0 } }));
          if (countdownIntervals.current.email) {
            clearInterval(countdownIntervals.current.email);
            delete countdownIntervals.current.email;
          }
          setSuccessMessage("Email updated successfully!");
        }
        
      } else if (section === "phone") {
        const phoneError = validatePhone(formData.phone);
        if (phoneError) {
          setErrors({ phone: phoneError });
          return;
        }
        
        if (!otpState.phone.show) {
          // Send OTP
          setSaving(section);
          await userService.sendPhoneUpdateOtp({ phone: formData.phone });
          setOtpState(prev => ({ ...prev, phone: { ...prev.phone, show: true } }));
          startCountdown('phone');
          setSuccessMessage("OTP sent to your new phone number!");
        } else {
          // Verify OTP
          const otpError = validateOtp(otpState.phone.otp);
          if (otpError) {
            setErrors({ otp: otpError });
            return;
          }
          
          setOtpState(prev => ({ ...prev, phone: { ...prev.phone, loading: true } }));
          const updatedUser = await userService.verifyPhoneUpdateOtp({
            otp: otpState.phone.otp
          });
          
          setOriginalData(formData);
          setUser(updatedUser);
          setEditing({ ...editing, [section]: false });
          setOtpState(prev => ({ ...prev, phone: { show: false, otp: "", loading: false, countdown: 0 } }));
          if (countdownIntervals.current.phone) {
            clearInterval(countdownIntervals.current.phone);
            delete countdownIntervals.current.phone;
          }
          setSuccessMessage("Phone number updated successfully!");
        }
      }
    } catch (error: any) {
      setErrors({ [section]: error.message });
    } finally {
      setSaving(null);
      if (otpState.email.loading) {
        setOtpState(prev => ({ ...prev, email: { ...prev.email, loading: false } }));
      }
      if (otpState.phone.loading) {
        setOtpState(prev => ({ ...prev, phone: { ...prev.phone, loading: false } }));
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-gray-600 text-lg">Unable to load user data</p>
            <button 
              onClick={fetchUserData}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Personal Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
            </div>
            {!editing.personalInfo && (
              <button
                onClick={() => handleEdit("personalInfo")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="Fullname"
                value={formData.Fullname}
                onChange={handleChange}
                readOnly={!editing.personalInfo}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                  editing.personalInfo
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                } ${errors.Fullname ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter your full name"
              />
              {errors.Fullname && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.Fullname}
                </p>
              )}
            </div>

            {editing.personalInfo && (
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => handleCancel("personalInfo")}
                  className="px-6 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("personalInfo")}
                  disabled={saving === "personalInfo"}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving === "personalInfo" ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Address Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Address</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your email address</p>
            </div>
            {!editing.email && (
              <button
                onClick={() => handleEdit("email")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!editing.email}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                  editing.email
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                } ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* OTP Section for Email */}
            {otpState.email.show && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">
                    Enter 6-digit OTP sent to your phone
                  </span>
                </div>
                
                <div className="flex gap-2 mb-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otpState.email.otp[index] || ""}
                      onChange={(e) => {
                        const newOtp = otpState.email.otp.split("");
                        newOtp[index] = e.target.value;
                        handleOtpChange('email', newOtp.join(""));
                        
                        // Auto-focus next input
                        if (e.target.value && index < 5) {
                          const target = e.target as HTMLInputElement;
                          const parent = target.parentElement;
                          if (parent) {
                            const nextInput = parent.children[index + 1] as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Auto-focus previous input on backspace
                        if (e.key === 'Backspace' && !otpState.email.otp[index] && index > 0) {
                          const target = e.target as HTMLInputElement;
                          const parent = target.parentElement;
                          if (parent) {
                            const prevInput = parent.children[index - 1] as HTMLInputElement;
                            prevInput?.focus();
                          }
                        }
                      }}
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    />
                  ))}
                </div>
                
                {otpState.email.countdown > 0 && (
                  <p className="text-sm text-blue-600 mb-2">
                    OTP expires in: {formatTime(otpState.email.countdown)}
                  </p>
                )}
                
                {errors.otp && (
                  <p className="text-sm text-red-600 flex items-center mb-3">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.otp}
                  </p>
                )}
              </div>
            )}

            {editing.email && (
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => handleCancel("email")}
                  className="px-6 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("email")}
                  disabled={saving === "email" || otpState.email.loading}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving === "email" || otpState.email.loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {otpState.email.show ? "Verifying..." : "Sending OTP..."}
                    </span>
                  ) : (
                    otpState.email.show ? "Verify OTP" : "Send OTP"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phone Number Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Mobile Number</h2>
              <p className="text-sm text-gray-500 mt-1">Update your phone number</p>
            </div>
            {!editing.phone && (
              <button
                onClick={() => handleEdit("phone")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                readOnly={!editing.phone}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                  editing.phone
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                } ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* OTP Section for Phone */}
            {otpState.phone.show && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm4.5 5.5a.5.5 0 00-1 0v2a.5.5 0 001 0v-2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    Enter 6-digit OTP sent to your new phone number
                  </span>
                </div>
                
                <div className="flex gap-2 mb-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otpState.phone.otp[index] || ""}
                      onChange={(e) => {
                        const newOtp = otpState.phone.otp.split("");
                        newOtp[index] = e.target.value;
                        handleOtpChange('phone', newOtp.join(""));
                        
                        // Auto-focus next input
                        if (e.target.value && index < 5) {
                          const target = e.target as HTMLInputElement;
                          const parent = target.parentElement;
                          if (parent) {
                            const nextInput = parent.children[index + 1] as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Auto-focus previous input on backspace
                        if (e.key === 'Backspace' && !otpState.phone.otp[index] && index > 0) {
                          const target = e.target as HTMLInputElement;
                          const parent = target.parentElement;
                          if (parent) {
                            const prevInput = parent.children[index - 1] as HTMLInputElement;
                            prevInput?.focus();
                          }
                        }
                      }}
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                    />
                  ))}
                </div>
                
                {otpState.phone.countdown > 0 && (
                  <p className="text-sm text-green-600 mb-2">
                    OTP expires in: {formatTime(otpState.phone.countdown)}
                  </p>
                )}
                
                {errors.otp && (
                  <p className="text-sm text-red-600 flex items-center mb-3">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.otp}
                  </p>
                )}
              </div>
            )}

            {editing.phone && (
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => handleCancel("phone")}
                  className="px-6 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("phone")}
                  disabled={saving === "phone" || otpState.phone.loading}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving === "phone" || otpState.phone.loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {otpState.phone.show ? "Verifying..." : "Sending OTP..."}
                    </span>
                  ) : (
                    otpState.phone.show ? "Verify OTP" : "Send OTP"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
            <p className="text-sm text-gray-500 mt-1">View your account details</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Created
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                {new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="flex items-center text-green-800">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;