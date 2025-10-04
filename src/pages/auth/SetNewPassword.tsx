// SetNewPassword.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, XCircle, Shield } from "lucide-react";

interface SetNewPasswordProps {
  onSubmit: (password: string) => Promise<void>;
  onBack?: () => void;
}

type PasswordFormData = {
  password: string;
  confirmPassword: string;
};

export const SetNewPassword = ({ onSubmit, onBack }: SetNewPasswordProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
  } = useForm<PasswordFormData>({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

  const onSubmitForm = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      await onSubmit(data.password);
    } finally {
      setLoading(false);
    }
  };

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "text-red-500";
    if (strength <= 3) return "text-yellow-500";
    return "text-emerald-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="max-w-7xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="text-sm">Back</span>
        </button>
      )}

      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <Shield className="relative text-emerald-600 w-12 h-12" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
        Set New Password
      </h2>
      <p className="text-center text-gray-600 text-sm mb-6 sm:mb-8">
        Create a strong password for your account
      </p>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 sm:space-y-5">
        {/* New Password Field */}
        <div className="group">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                errors.password
                  ? "text-red-400"
                  : touchedFields.password && !errors.password
                  ? "text-emerald-500"
                  : "text-gray-400 group-focus-within:text-emerald-500"
              }`}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className={`w-full pl-12 pr-12 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-300 focus:ring-red-400"
                  : touchedFields.password && !errors.password
                  ? "border-emerald-300 focus:ring-emerald-400"
                  : "border-gray-200 focus:ring-emerald-400"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Password must contain uppercase, lowercase, and number",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {watchedPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Password strength:</span>
                <span className={`font-medium ${getStrengthColor(passwordStrength)}`}>
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    passwordStrength <= 2
                      ? "bg-red-500"
                      : passwordStrength <= 3
                      ? "bg-yellow-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="group">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                errors.confirmPassword
                  ? "text-red-400"
                  : touchedFields.confirmPassword && !errors.confirmPassword
                  ? "text-emerald-500"
                  : "text-gray-400 group-focus-within:text-emerald-500"
              }`}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className={`w-full pl-12 pr-12 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-300 focus:ring-red-400"
                  : touchedFields.confirmPassword && !errors.confirmPassword
                  ? "border-emerald-300 focus:ring-emerald-400"
                  : "border-gray-200 focus:ring-emerald-400"
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watchedPassword || "Passwords do not match",
              })}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {touchedFields.confirmPassword && (
                <div>
                  {errors.confirmPassword ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    watchedConfirmPassword === watchedPassword && watchedConfirmPassword && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
          <p className="font-medium mb-2">Password requirements:</p>
          <ul className="space-y-1">
            <li className={`flex items-center ${watchedPassword?.length >= 8 ? 'text-emerald-600' : ''}`}>
              <div className={`w-1 h-1 rounded-full mr-2 ${watchedPassword?.length >= 8 ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
              At least 8 characters
            </li>
            <li className={`flex items-center ${/[a-z]/.test(watchedPassword || '') ? 'text-emerald-600' : ''}`}>
              <div className={`w-1 h-1 rounded-full mr-2 ${/[a-z]/.test(watchedPassword || '') ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
              One lowercase letter
            </li>
            <li className={`flex items-center ${/[A-Z]/.test(watchedPassword || '') ? 'text-emerald-600' : ''}`}>
              <div className={`w-1 h-1 rounded-full mr-2 ${/[A-Z]/.test(watchedPassword || '') ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
              One uppercase letter
            </li>
            <li className={`flex items-center ${/[0-9]/.test(watchedPassword || '') ? 'text-emerald-600' : ''}`}>
              <div className={`w-1 h-1 rounded-full mr-2 ${/[0-9]/.test(watchedPassword || '') ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
              One number
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || !isValid}
          className={`w-full py-3.5 rounded-xl text-white font-medium transition-all duration-300 transform ${
            loading || !isValid
              ? "bg-gradient-to-r from-emerald-300 to-green-300 cursor-not-allowed opacity-60"
              : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Updating Password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};