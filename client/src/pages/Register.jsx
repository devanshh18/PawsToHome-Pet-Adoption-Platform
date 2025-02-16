/*import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser, registerShelter } from "../features/auth/authService";
import { toast } from "react-toastify";

export default function Register() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("adopter");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (userType === "shelter" && step === 1) {
        setStep(2);
        return;
      }

      if (userType === "shelter") {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === "licenseDocument") {
            formData.append(key, data[key][0]);
          } else {
            formData.append(key, data[key]);
          }
        });
        await registerShelter(formData);
        toast.success("Registration submitted for approval!");
      } else {
        await registerUser(data);
        toast.success("Registration successful! Please login.");
      }
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Register as
              </label>
              <select
                className="w-full p-2 border rounded"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="adopter">Pet Adopter</option>
                <option value="shelter">Pet Shelter</option>
              </select>
            </div>

            <div>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full p-2 border rounded"
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full p-2 border rounded"
                placeholder="Email"
                type="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("phoneNo", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                })}
                className="w-full p-2 border rounded"
                placeholder="Phone Number"
              />
              {errors.phoneNo && (
                <p className="text-red-500 text-sm">{errors.phoneNo.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message:
                      "Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char",
                  },
                })}
                className="w-full p-2 border rounded"
                placeholder="Password"
                type="password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {userType === "shelter" ? "Next" : "Register"}
            </button>
          </>
        )}

        {step === 2 && userType === "shelter" && (
          <>
            <div>
              <input
                {...register("shelterName", {
                  required: "Shelter name is required",
                })}
                className="w-full p-2 border rounded"
                placeholder="Shelter Name"
              />
              {errors.shelterName && (
                <p className="text-red-500 text-sm">
                  {errors.shelterName.message}
                </p>
              )}
            </div>

            <div>
              <textarea
                {...register("address", { required: "Address is required" })}
                className="w-full p-2 border rounded"
                placeholder="Shelter Address"
                rows="3"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                License Document
              </label>
              <input
                type="file"
                {...register("licenseDocument", {
                  required: "License document is required",
                })}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
              {errors.licenseDocument && (
                <p className="text-red-500 text-sm">
                  {errors.licenseDocument.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Register Shelter
              </button>
            </div>
          </>
        )}
      </form>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link to="/" className="text-blue-500">
          Login
        </Link>
      </p>
    </div>
  );
} */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser, registerShelter } from "../features/auth/authService";
import { toast } from "react-toastify";
import {
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { endLoading, setUser, startLoading } from "../features/auth/authSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { indianCities, indianStates } from "../utils/location";

export default function Register() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("adopter");
  const [selectedState, setSelectedState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [licenseFile, setLicenseFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed");
        return;
      }
      setLicenseFile(file);
      setValue("licenseDocument", [file]); // Set value for react-hook-form
      trigger("licenseDocument"); // Trigger validation
    }
  };

  // Handle drag-and-drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  // Remove uploaded file
  const removeFile = () => {
    setLicenseFile(null);
    setValue("licenseDocument", null); // Clear form value
    trigger("licenseDocument"); // Trigger validation
  };

  // Submit function
  const onSubmit = async (data) => {
    try {
      if (userType === "shelter" && step === 1) {
        setStep(2);
        return;
      }

      dispatch(startLoading());

      if (userType === "shelter") {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === "licenseDocument") {
            formData.append(key, data[key][0]); // Use the file from form data
          } else {
            formData.append(key, data[key]);
          }
        });
        await registerShelter(formData);
        dispatch(endLoading());
        toast.success("Registration submitted for approval!");
        navigate("/login");
      } else {
        const response = await registerUser(data);
        dispatch(setUser(response.user));
        toast.success("Registration successful! Welcome!");
        navigate("/"); // Redirect to home
      }
    } catch (error) {
      dispatch(endLoading());
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex"
      >
        {/* Left Section - Image */}
        <div className="hidden lg:block w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 p-8">
          <div className="h-full flex flex-col justify-center items-center text-white">
            <img
              src="/src/assets/register-illustration.svg" // Replace with your image
              alt="Register Illustration"
              className="w-64 mb-8"
            />
            <h3 className="text-2xl font-bold mb-4">Welcome to PawsToHome</h3>
            <p className="text-center text-blue-100">
              Join our community of pet lovers and find your perfect match!
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Progress Steps */}
          {userType === "shelter" && (
            <div className="mb-8">
              <div className="flex justify-between relative">
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      step >= 1
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm mt-2 text-gray-600">
                    Account Info
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      step === 2
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm mt-2 text-gray-600">
                    Shelter Details
                  </span>
                </div>
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 -z-10">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: step === 1 ? "50%" : "100%" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            {step === 1 ? "Join PawsToHome" : "Shelter Information"}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {step === 1
              ? "Create your account in 30 seconds"
              : "Tell us about your shelter"}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                {/* User Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setUserType("adopter")}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      userType === "adopter"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-lg font-semibold text-gray-800">
                      Adopter
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Looking to adopt a pet
                    </p>
                  </div>
                  <div
                    onClick={() => setUserType("shelter")}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      userType === "shelter"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-lg font-semibold text-gray-800">
                      Shelter
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Animal shelter or rescue
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <FiAlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

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
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        {...register("phoneNo", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^\d{10}$/,
                            message: "Phone number must be 10 digits",
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                      {errors.phoneNo && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <FiAlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.phoneNo && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.phoneNo.message}
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
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                            message:
                              "Password must contain at least 6 characters, including uppercase, lowercase, number and special character",
                          },
                        })}
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? (
                          <FiEyeOff className="w-5 h-5" />
                        ) : (
                          <FiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shelter Name
                  </label>
                  <div className="relative">
                    <input
                      {...register("shelterName", {
                        required: "Shelter name is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Happy Paws Shelter"
                    />
                    {errors.shelterName && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <FiAlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.shelterName && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {errors.shelterName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <textarea
                      {...register("address", {
                        required: "Address is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter full address..."
                    />
                    {errors.address && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <FiAlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <div className="relative">
                    <select
                      {...register("state", { required: "State is required" })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setValue("city", ""); // Reset city when state changes
                      }}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <FiAlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <select
                      {...register("city", { required: "City is required" })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={!selectedState}
                    >
                      <option value="">Select City</option>
                      {selectedState &&
                        indianCities[selectedState].map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                    {errors.city && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <FiAlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Document
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300"
                    }`}
                  >
                    {licenseFile ? (
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">
                          {licenseFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FiUploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Drag and drop or{" "}
                          <label className="text-indigo-600 cursor-pointer hover:text-indigo-500">
                            browse files
                            <input
                              type="file"
                              {...register("licenseDocument")}
                              onChange={handleFileChange}
                              className="hidden"
                              accept="image/jpeg,image/png,image/jpg"
                            />
                          </label>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, JPEG, PNG up to 2MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all ${
                  step === 2 ? "w-1/2" : "w-full"
                }`}
              >
                {userType === "shelter" && step === 1
                  ? "Continue"
                  : "Create Account"}
              </button>
            </div>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
