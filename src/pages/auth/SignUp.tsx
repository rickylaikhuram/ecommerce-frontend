import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Phone,
  Lock,
  Volleyball,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { OTPVerification } from "./OTPVerification"; // Import the OTP component
import instance from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

const SignUp = () => {
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null); // Store form data
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  // Watch all fields for real-time validation feedback
  const watchedFields = watch();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Store form data for later use
      setFormData(data);
      setUserPhone(data.phone);

      // Send OTP to phone number
      const response = await instance.post("/api/auth/signup/initiate", {
        email: data.email,
        phone: data.phone,
        name: data.fullName,
        password: data.password,
      });
      console.log("Sending OTP to:", `+91${data.phone}`);

      // Show OTP verification screen
      setShowOTPScreen(true);
    } catch (err) {
      console.error("Failed to send OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    if (!formData) return;

    try {
      // Simulate OTP verification and account creation
      const response = await instance.post("/api/auth/signup/confirm", {
        phone: formData.phone, // Don't prefix with +91 unless your backend expects it
        otp,
      });
      await refreshAuth();
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      throw err; // Re-throw to handle in OTP component
    }
  };

  const handleResendOTP = async () => {
    if (!userPhone) return;

    try {
      console.log("📲 Resending OTP to:", `+91${userPhone}`);

      await instance.post("/api/auth/signup/resend", {
        phone: userPhone,
      });

      console.log("✅ OTP resent successfully");
    } catch (error) {
      console.error("❌ Failed to resend OTP:", error);
      // Optionally show error to user (e.g. toast or alert)
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked");
    // Add Google OAuth logic here
  };

  // Helper function to determine field validation state
  const getFieldState = (fieldName: keyof FormData) => {
    if (!touchedFields[fieldName]) return "default";
    return errors[fieldName] ? "error" : "success";
  };

  // Helper function to get field border color
  const getFieldBorderClass = (fieldName: keyof FormData) => {
    const state = getFieldState(fieldName);
    switch (state) {
      case "error":
        return "border-red-300 focus:ring-red-400";
      case "success":
        return "border-emerald-300 focus:ring-emerald-400";
      default:
        return "border-gray-200 focus:ring-blue-400";
    }
  };

  // Show OTP verification screen
  if (showOTPScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-100/50 p-8 sm:p-10 border border-white/50">
            <OTPVerification
              phoneNumber={userPhone}
              onVerify={handleOTPVerify}
              onResend={handleResendOTP}
              onBack={() => setShowOTPScreen(false)}
              title="Verify Your Phone"
              subtitle="Please enter the OTP sent to"
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Decorative element */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <Sparkles className="relative text-blue-600 w-12 h-12" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-100/50 p-8 sm:p-10 border border-white/50">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Join us and start your journey
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name Input */}
            <div className="group">
              <label
                htmlFor="fullName"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    getFieldState("fullName") === "error"
                      ? "text-red-400"
                      : getFieldState("fullName") === "success"
                      ? "text-emerald-500"
                      : "text-gray-400 group-focus-within:text-blue-500"
                  }`}
                />
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${getFieldBorderClass(
                    "fullName"
                  )}`}
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Name can only contain letters and spaces",
                    },
                  })}
                />
                {touchedFields.fullName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {errors.fullName ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      watchedFields.fullName && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )
                    )}
                  </div>
                )}
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500 animate-fadeIn">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="group">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    getFieldState("email") === "error"
                      ? "text-red-400"
                      : getFieldState("email") === "success"
                      ? "text-emerald-500"
                      : "text-gray-400 group-focus-within:text-blue-500"
                  }`}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${getFieldBorderClass(
                    "email"
                  )}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {touchedFields.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {errors.email ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      watchedFields.email && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )
                    )}
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 animate-fadeIn">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div className="group">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    getFieldState("phone") === "error"
                      ? "text-red-400"
                      : getFieldState("phone") === "success"
                      ? "text-emerald-500"
                      : "text-gray-400 group-focus-within:text-blue-500"
                  }`}
                />
                {/* Fixed +91 prefix with better positioning */}
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                  <span className="text-gray-600 font-medium select-none border-r pr-2 mr-2">
                    +91
                  </span>
                </div>
                <input
                  id="phone"
                  type="text" // Changed from tel to text for better control
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="9876543210"
                  maxLength={10}
                  className={`w-full pl-20 pr-10 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${getFieldBorderClass(
                    "phone"
                  )}`}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[6-9][0-9]{9}$/,
                      message:
                        "Phone number must be 10 digits starting with 6-9",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number must be 10 digits",
                    },
                    maxLength: {
                      value: 10,
                      message: "Phone number must be 10 digits",
                    },
                    onChange: (e) => {
                      // Integrated onChange to work with register
                      const value = e.target.value.replace(/\D/g, "");
                      if (value !== e.target.value) {
                        e.target.value = value;
                        setValue("phone", value, { shouldValidate: true });
                      }
                    },
                  })}
                  onKeyDown={(e) => {
                    // Allow control keys
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (allowedKeys.includes(e.key) || /^[0-9]$/.test(e.key)) {
                      return;
                    }

                    // Prevent all other non-numeric input
                    e.preventDefault();
                  }}
                />
                {touchedFields.phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {errors.phone ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      watchedFields.phone &&
                      watchedFields.phone.length === 10 && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )
                    )}
                  </div>
                )}
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500 animate-fadeIn">
                  {errors.phone.message}
                </p>
              )}
              {watchedFields.phone &&
                !errors.phone &&
                watchedFields.phone.length > 0 &&
                watchedFields.phone.length < 10 && (
                  <p className="mt-1 text-xs text-gray-500">
                    {10 - watchedFields.phone.length} more digits required
                  </p>
                )}
            </div>

            {/* Password Input */}
            <div className="group">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    getFieldState("password") === "error"
                      ? "text-red-400"
                      : getFieldState("password") === "success"
                      ? "text-emerald-500"
                      : "text-gray-400 group-focus-within:text-blue-500"
                  }`}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-20 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${getFieldBorderClass(
                    "password"
                  )}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]/,
                      message:
                        "Password must contain uppercase, lowercase, number and special character",
                    },
                  })}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {touchedFields.password && (
                    <>
                      {errors.password ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        watchedFields.password && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 animate-fadeIn">
                  {errors.password.message}
                </p>
              )}
              {watchedFields.password && !errors.password && (
                <p className="mt-1 text-xs text-emerald-500">
                  Strong password!
                </p>
              )}
            </div>

            {/* Password strength indicator */}
            {watchedFields.password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        watchedFields.password.length > i * 3
                          ? watchedFields.password.length > 12
                            ? "bg-emerald-500"
                            : watchedFields.password.length > 8
                            ? "bg-yellow-500"
                            : "bg-red-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isValid}
              className={`w-full py-3.5 rounded-xl text-white font-medium transition-all duration-300 transform ${
                loading || !isValid
                  ? "bg-gradient-to-r from-blue-300 to-cyan-300 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
          >
            <Volleyball className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <span className="text-gray-700 font-medium">
              Sign up with Google
            </span>
          </button>

          {/* Sign In Link */}
          <p className="text-sm text-center text-gray-600 mt-8">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms and Privacy */}
        <p className="text-xs text-center text-gray-500 mt-6 px-4">
          By signing up, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
