import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Shield, Clock, CheckCircle2 } from "lucide-react";

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

type OTPFormData = {
  otp: string;
};

export const OTPVerification = ({
  phoneNumber,
  onVerify,
  onResend,
  onBack,
  title = "Enter OTP",
  subtitle = "We've sent a 6-digit code to"
}: OTPVerificationProps) => {
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue
  } = useForm<OTPFormData>({
    mode: "onChange",
    defaultValues: {
      otp: "",
    }
  });

  // Start resend timer on mount
  useEffect(() => {
    startResendTimer();
  }, []);

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setValue('otp', value, { shouldValidate: true });
  };

  const onSubmit = async (data: OTPFormData) => {
    setLoading(true);
    try {
      await onVerify(data.otp);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await onResend();
      startResendTimer();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <Shield className="relative text-blue-600 w-12 h-12" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
        {title}
      </h2>
      <p className="text-center text-gray-600 text-sm mb-2">
        {subtitle}
      </p>
      <p className="text-center text-gray-800 font-medium mb-6 sm:mb-8">
        +91 {phoneNumber}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            One-Time Password
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className={`w-full px-4 py-3 text-center text-lg font-medium tracking-widest bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${
              errors.otp ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400'
            }`}
            {...register("otp", {
              required: "OTP is required",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "OTP must be 6 digits"
              },
              onChange: handleOTPChange
            })}
          />
          {errors.otp && (
            <p className="mt-1 text-xs text-red-500 text-center">{errors.otp.message}</p>
          )}
        </div>

        <div className="flex items-center justify-center">
          {resendTimer > 0 ? (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>Resend OTP in {resendTimer}s</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Resend OTP
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isValid}
          className={`w-full py-3.5 rounded-xl text-white font-medium transition-all duration-300 transform ${
            loading || !isValid
              ? "bg-gradient-to-r from-blue-300 to-cyan-300 cursor-not-allowed opacity-60"
              : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};