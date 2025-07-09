import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Phone,
  Lock,
  LogIn,
  CheckCircle2,
  XCircle,
  Volleyball,
} from "lucide-react";

type FormData = {
  emailOrPhone: string;
  password: string;
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState<'email' | 'phone' | null>(null);
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
      emailOrPhone: "",
      password: ""
    }
  });

  const watchedFields = watch();

  // Detect if input is email or phone
  const detectInputType = (value: string) => {
    const cleanValue = value.replace(/\s/g, '');
    
    if (!cleanValue) {
      setInputType(null);
      return value;
    }
    
    // Check if it starts with a number or +
    if (/^[+0-9]/.test(cleanValue)) {
      setInputType('phone');
      // Remove any non-digits and limit to 10 digits
      const digitsOnly = cleanValue.replace(/\D/g, '').slice(-10);
      return digitsOnly;
    } else if (cleanValue.includes('@') || /^[a-zA-Z]/.test(cleanValue)) {
      setInputType('email');
      return value;
    } else {
      setInputType(null);
      return value;
    }
  };

  const handleEmailOrPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const processedValue = detectInputType(e.target.value);
    setValue('emailOrPhone', processedValue, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      
      // Prepare data for backend
      const loginData = {
        [inputType === 'phone' ? 'phone' : 'email']: 
          inputType === 'phone' ? `+91${data.emailOrPhone}` : data.emailOrPhone,
        password: data.password,
        loginType: inputType
      };
      
      console.log("Login data:", loginData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Sign in failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked");
  };

  // Custom validation for email or phone
  const validateEmailOrPhone = (value: string) => {
    if (!value) return "Email or phone number is required";
    
    const cleanValue = value.replace(/\s/g, '');
    
    // Check if it looks like a phone number
    if (/^[0-9]+$/.test(cleanValue)) {
      if (cleanValue.length !== 10) {
        return "Phone number must be 10 digits";
      }
      if (!/^[6-9]/.test(cleanValue)) {
        return "Phone number must start with 6-9";
      }
      return true;
    }
    
    // Otherwise validate as email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    
    return true;
  };

  const getFieldState = (fieldName: keyof FormData) => {
    if (!touchedFields[fieldName]) return "default";
    return errors[fieldName] ? "error" : "success";
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Decorative element */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <LogIn className="relative text-blue-600 w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-100/50 p-6 sm:p-8 lg:p-10 border border-white/50">
          <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6 sm:mb-8">
            Sign in to continue to your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            {/* Email or Phone Input */}
            <div className="group">
              <label
                htmlFor="emailOrPhone"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email or Phone Number
              </label>
              <div className="relative">
                {/* Dynamic icon based on input type - only show when user has typed */}
                {watchedFields.emailOrPhone && (
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-200 ${
                    getFieldState("emailOrPhone") === "error" ? "text-red-400" : 
                    getFieldState("emailOrPhone") === "success" ? "text-emerald-500" : 
                    "text-gray-400 group-focus-within:text-blue-500"
                  }`}>
                    {inputType === 'phone' && <Phone />}
                    {inputType === 'email' && <Mail />}
                  </div>
                )}
                
                {/* Show +91 prefix when phone is detected */}
                {inputType === 'phone' && watchedFields.emailOrPhone && (
                  <div className="absolute left-10 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none animate-fadeIn">
                    <span className="text-gray-600 font-medium select-none border-r pr-2 mr-2">+91</span>
                  </div>
                )}
                
                <input
                  id="emailOrPhone"
                  type="text"
                  placeholder="you@example.com or 9876543210"
                  className={`w-full ${
                    inputType === 'phone' && watchedFields.emailOrPhone ? 'pl-20' : 
                    watchedFields.emailOrPhone ? 'pl-10' : 
                    'pl-4'
                  } pr-10 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${getFieldBorderClass("emailOrPhone")}`}
                  {...register("emailOrPhone", {
                    validate: validateEmailOrPhone,
                    onChange: handleEmailOrPhoneChange
                  })}
                />
                
                {touchedFields.emailOrPhone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {errors.emailOrPhone ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : watchedFields.emailOrPhone && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.emailOrPhone && (
                <p className="mt-1 text-xs text-red-500 animate-fadeIn">{errors.emailOrPhone.message}</p>
              )}
              {inputType === 'phone' && watchedFields.emailOrPhone && !errors.emailOrPhone && watchedFields.emailOrPhone.length > 0 && watchedFields.emailOrPhone.length < 10 && (
                <p className="mt-1 text-xs text-gray-500">{10 - watchedFields.emailOrPhone.length} more digits required</p>
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
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  getFieldState("password") === "error" ? "text-red-400" : 
                  getFieldState("password") === "success" ? "text-emerald-500" : 
                  "text-gray-400 group-focus-within:text-blue-500"
                }`} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:border-transparent focus:bg-white transition-all duration-200 outline-none focus:ring-2 ${getFieldBorderClass("password")}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {touchedFields.password && (
                    <>
                      {errors.password ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : watchedFields.password && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 animate-fadeIn">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isValid}
              className={`w-full py-3 sm:py-3.5 rounded-xl text-white font-medium transition-all duration-300 transform ${
                loading || !isValid
                  ? "bg-gradient-to-r from-blue-300 to-cyan-300 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

                    {/* Divider */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div className="space-y-3">
            <Link
              to="/signinwithotp"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 group"
            >
              <Lock className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-gray-700 font-medium">Sign in without Password</span>
            </Link>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Volleyball className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-600 mt-6 sm:mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Help text */}
        <p className="text-xs text-center text-gray-500 mt-4 sm:mt-6 px-4">
          You can sign in using your email address or phone number registered with us
        </p>
      </div>

    </div>
  );
};

export default SignIn;