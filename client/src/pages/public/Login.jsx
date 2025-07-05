import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../features/auth/authService";
import { setUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";
// Import images to avoid 404 errors
import loginIllustration from "../../assets/login-illustration.avif";
import googleIcon from "../../assets/google-icon.svg";
import facebookIcon from "../../assets/facebook-icon.svg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this line
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true); // Set loading to true when submission starts
      const response = await login(data);
      dispatch(setUser(response.user));

      if (response.user.role === "admin") {
        navigate("/admin");
      } else if (response.user.role === "shelter") {
        navigate("/shelter-panel");
      } else {
        navigate("/");
      }
    } catch (error) {
      setIsSubmitting(false); // Reset loading state on error
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex"
      >
        {/* Illustration Section */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 p-8">
          <div className="h-full flex flex-col justify-center items-center text-white">
            <img
              src={loginIllustration}
              alt="Login Illustration"
              className="w-64 mb-8"
            />
            <h3 className="text-2xl font-bold mb-4">Welcome Back!</h3>
            <p className="text-center text-blue-100">
              Connect with loving pets waiting for their forever homes
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to PawsToHome
            </h1>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <FiAlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2.5 text-gray-700 hover:bg-gray-50"
              >
                <img src={googleIcon} className="w-5 h-5" alt="Google" />
                Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2.5 text-gray-700 hover:bg-gray-50"
              >
                <img src={facebookIcon} className="w-6 h-6" alt="Facebook" />
                Facebook
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-500"
            >
              Get started
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
