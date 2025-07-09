// SignInOTP.tsx - Simplified for phone-only
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Phone, LogIn, CheckCircle2, XCircle, Lock, Chrome ,Volleyball} from "lucide-react";
import { OTPVerification } from "./OTPVerification";

type FormData = {
  phone: string;
};

const SignInOTP = () => {
  const [loading, setLoading] = useState(false);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
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
      phone: "",
    }
  });

  const watchedPhone = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setValue('phone', value, { shouldValidate: true });
  };

  const onSubmitPhone = async (data: FormData) => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      // Send OTP via SMS
      console.log("Sending OTP to:", `+91${data.phone}`);
      setPhoneNumber(data.phone);
      setShowOTPScreen(true);
    } catch (err) {
      console.error("Failed to send OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    // Verify OTP with backend
    console.log("Verifying OTP:", { phone: `+91${phoneNumber}`, otp });
    // On success, navigate to dashboard
    navigate("/dashboard");
  };

  const handleResendOTP = async () => {
    // Resend OTP logic
    console.log("Resending OTP to:", `+91${phoneNumber}`);
  };

  if (showOTPScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-100/50 p-8 border border-white/50">
            <OTPVerification
              phoneNumber={phoneNumber}
              onVerify={handleOTPVerify}
              onResend={handleResendOTP}
              onBack={() => setShowOTPScreen(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <LogIn className="relative text-blue-600 w-12 h-12" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-100/50 p-8 border border-white/50">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Sign In with OTP
          </h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Enter your phone number to receive OTP
          </p>

          <form onSubmit={handleSubmit(onSubmitPhone)} className="space-y-5">
            <div className="group">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                  errors.phone ? "text-red-400" : 
                  touchedFields.phone && !errors.phone ? "text-emerald-500" : 
                  "text-gray-400 group-focus-within:text-blue-500"
                }`} />
                
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                  <span className="text-gray-600 font-medium select-none border-r pr-2 mr-2">+91</span>
                </div>
                
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="9876543210"
                  maxLength={10}
                  className={`w-full pl-20 pr-10 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${
                    errors.phone ? 'border-red-300 focus:ring-red-400' : 
                    touchedFields.phone && !errors.phone ? 'border-emerald-300 focus:ring-emerald-400' : 
                    'border-gray-200 focus:ring-blue-400'
                  }`}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[6-9][0-9]{9}$/,
                      message: "Phone number must be 10 digits starting with 6-9"
                    },
                    onChange: handlePhoneChange
                  })}
                />
                
                {touchedFields.phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {errors.phone ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : watchedPhone.length === 10 && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isValid}
              className={`w-full py-3.5 rounded-xl text-white font-medium transition-all duration-300 transform ${
                loading || !isValid
                  ? "bg-gradient-to-r from-blue-300 to-cyan-300 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
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
              <Lock className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-gray-700 font-medium">Sign in with Password</span>
            </Link>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Volleyball className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
          </div>

          <p className="text-sm text-center text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInOTP;