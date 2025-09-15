// ForgotPasswordPhoneOnly.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Phone,
  KeyRound,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { OTPVerification } from "./OTPVerification";
import { SetNewPassword } from "./SetNewPassword";
import instance from "../../utils/axios";
import { toast } from "sonner";

type FormData = {
  phone: string;
};

type Step = "contact" | "otp" | "password";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("contact");
  const [phoneNumber, setPhoneNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  const watchedPhone = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("phone", value, { shouldValidate: true });
  };

  const onSubmitPhone = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await instance.post("/auth/forgot-password/initiate", {
        phone: data.phone,
      });

      if (response.data.success) {
        setPhoneNumber(data.phone);
        toast.success("Sent OTP to phone");
        setCurrentStep("otp");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      const response = await instance.post("/auth/forgot-password/verify-otp", {
        phone: phoneNumber,
        otp,
      });

      if (response.data.success) {
        toast.success("OTP verified ");
        // Store reset token temporarily (in memory, not localStorage)
        sessionStorage.setItem("resetToken", response.data.resetToken);
        setCurrentStep("password");
      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await instance.post("/auth/forgot-password/resend", {
        phone: phoneNumber,
      });

      if (response.data.success) {
        toast.success("OTP resent successfully ");
        console.log("Resending OTP to:", `+91${phoneNumber}`);
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      console.error("Resend OTP failed:", err);
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    }
  };

  const handlePasswordReset = async (newPassword: string) => {
    try {
      const resetToken = sessionStorage.getItem("resetToken");

      const response = await instance.post("/auth/forgot-password/reset", {
        resetToken,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Password reset successful");

        // Clear the reset token
        sessionStorage.removeItem("resetToken");

        // Redirect to sign-in
        navigate("/signin");
      } else {
        toast.error(response.data.message || "Password reset failed");
      }
    } catch (err: any) {
      console.error("Password reset failed:", err);
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    }
  };

  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("contact");
      reset();
    } else if (currentStep === "password") {
      setCurrentStep("otp");
    }
  };

  const getValidationRules = () => {
    return {
      required: "Phone number is required",
      pattern: {
        value: /^[6-9][0-9]{9}$/,
        message: "Phone number must be 10 digits starting with 6-9",
      },
    };
  };

  // OTP Screen
  if (currentStep === "otp") {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-8 pb-10">
        <div className="w-full max-w-md">
          <div className="bg-white backdrop-blur-sm rounded-3xl shadow-2xl shadow-gray-100/50 p-8 border border-gray-200">
            <OTPVerification
              phoneNumber={phoneNumber}
              onVerify={handleOTPVerify}
              onResend={handleResendOTP}
              onBack={handleBack}
              title="Verify Identity"
              subtitle="We've sent a 6-digit code to your phone"
            />
          </div>
        </div>
      </div>
    );
  }

  // Set New Password Screen
  if (currentStep === "password") {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-8 pb-10">
        <div className="w-full max-w-md">
          <div className="bg-white backdrop-blur-sm rounded-3xl shadow-2xl shadow-gray-100/50 p-8 border border-gray-200">
            <SetNewPassword
              onSubmit={handlePasswordReset}
              onBack={handleBack}
            />
          </div>
        </div>
      </div>
    );
  }

  // Phone Input Screen (default)
  return (
    <div className="flex items-center justify-center bg-white px-4 py-8 pb-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <KeyRound className="relative text-emerald-600 w-12 h-12" />
          </div>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-3xl shadow-2xl shadow-gray-100/50 p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 py-1">
            Forgot Password
          </h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Enter your phone number to reset your password
          </p>

          <form onSubmit={handleSubmit(onSubmitPhone)} className="space-y-5">
            <div className="group">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                    errors.phone
                      ? "text-red-400"
                      : touchedFields.phone && !errors.phone
                      ? "text-emerald-500"
                      : "text-gray-400 group-focus-within:text-emerald-500"
                  }`}
                />
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                  <span className="text-gray-600 font-medium select-none border-r pr-2 mr-2">
                    +91
                  </span>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234567890"
                  maxLength={10}
                  className={`w-full pl-20 pr-10 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-400"
                      : touchedFields.phone && !errors.phone
                      ? "border-emerald-300 focus:ring-emerald-400"
                      : "border-gray-200 focus:ring-emerald-400"
                  }`}
                  {...register("phone", {
                    ...getValidationRules(),
                    onChange: handlePhoneChange,
                  })}
                />

                {touchedFields.phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {errors.phone ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      watchedPhone.length === 10 && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )
                    )}
                  </div>
                )}
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
              {watchedPhone && (
                <p className="mt-1 text-xs text-gray-500">
                  We'll send an OTP to your phone number
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isValid}
              className={`w-full py-3.5 rounded-xl text-white font-medium transition-all duration-300 transform ${
                loading || !isValid
                  ? "bg-gradient-to-r from-emerald-300 to-teal-300 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Sending OTP..." : "Send Reset Code"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/signin"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
              <span className="text-gray-700 font-medium">Back to Sign In</span>
            </Link>
          </div>

          <p className="text-sm text-center text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
