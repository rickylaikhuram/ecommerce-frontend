// pages/Security.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaLock, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { userService } from "../../services/user.services";
import toast from "react-hot-toast";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Security: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<ChangePasswordForm>({
    mode: "onChange",
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Custom validation functions
  const validateCurrentPassword = (value: string) => {
    if (!value) return "Current password is required";
    return true;
  };

  const validateNewPassword = (value: string) => {
    if (!value) return "New password is required";
    if (value.length < 6) return "Password must be at least 6 characters long";
    if (value.length > 30) return "Password must be at most 30 characters long";
    
    const currentPassword = getValues("currentPassword");
    if (value === currentPassword) return "New password must be different from current password";
    
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Please confirm your new password";
    const newPassword = getValues("newPassword");
    if (value !== newPassword) return "New password and confirmation don't match";
    return true;
  };

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);
    setServerError(""); // Clear any previous server errors
    try {
      const response = await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      toast.success(response || "Password changed successfully!");
      reset();
      setShowPasswordForm(false);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to change password";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setShowPasswordForm(false);
    setServerError(""); // Clear server errors when canceling
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "", color: "" };
    
    let strength = 0;
    const checks = [
      password.length >= 6,
      password.length >= 12,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    
    strength = checks.filter(Boolean).length;
    
    if (strength <= 2) return { strength, text: "Weak", color: "text-red-500" };
    if (strength <= 4) return { strength, text: "Medium", color: "text-yellow-500" };
    return { strength, text: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword || "");

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        Security Settings
      </h1>

      <div className="space-y-6">
        {/* Password Section */}
        <div className="border-b pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="flex items-center space-x-3">
              <FaLock className="w-6 h-6 text-gray-600" />
              <div>
                <h3 className="font-semibold text-lg">Password</h3>
                <p className="text-gray-600 text-sm">
                  Last changed 3 months ago
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                if (!showPasswordForm) {
                  setServerError(""); // Clear server errors when opening form
                }
              }}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors w-full sm:w-auto"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form 
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg"
            >
              {/* Server Error Display */}
              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        {serverError}
                      </div>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          onClick={() => setServerError("")}
                          className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    {...register("currentPassword", {
                      validate: validateCurrentPassword,
                    })}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.currentPassword ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    {...register("newPassword", {
                      validate: validateNewPassword,
                    })}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.newPassword ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.strength <= 2
                              ? "bg-red-500"
                              : passwordStrength.strength <= 4
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${(passwordStrength.strength / 6) * 100}%`,
                          }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}
                
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    {...register("confirmPassword", {
                      validate: validateConfirmPassword,
                    })}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  
                  {/* Check mark when passwords match */}
                  {confirmPassword && newPassword && confirmPassword === newPassword && (
                    <div className="absolute inset-y-0 right-8 pr-3 flex items-center text-green-500">
                      <FaCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${newPassword && newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>At least 6 characters long</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${newPassword && newPassword.length <= 30 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Maximum 30 characters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${newPassword && /[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Contains uppercase letter (recommended)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${newPassword && /[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Contains number (recommended)</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                    isLoading 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:bg-blue-700"
                  }`}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Security;