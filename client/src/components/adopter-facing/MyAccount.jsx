import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";
import PostCard from "./PostCard";
import {
  FiUser,
  FiHome,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";

export default function MyAccount() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "personal");
  const [userDetails, setUserDetails] = useState(null);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phoneNo: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch user details
        try {
          const userResponse = await axios.get(
            "http://localhost:5000/api/auth/me",
            { withCredentials: true }
          );
          setUserDetails(userResponse.data.user);
          setEditForm({
            name: userResponse.data.user.name || "",
            phoneNo: userResponse.data.user.phoneNo || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } catch (err) {
          console.log("Error fetching user details:", err);
        }

        // Fetch adoption requests
        try {
          const adoptionsResponse = await axios.get(
            "http://localhost:5000/api/adoptions/user",
            { withCredentials: true }
          );
          setAdoptionRequests(adoptionsResponse.data.applications || []);
        } catch (err) {
          console.log("Error fetching adoptions:", err);
          setAdoptionRequests([]);
        }

        // Fetch user posts
        try {
          const postsResponse = await axios.get(
            "http://localhost:5000/api/posts/user",
            { withCredentials: true }
          );
          console.log("Posts response:", postsResponse.data);
          setUserPosts(postsResponse.data.posts || []);
        } catch (err) {
          console.error("Error fetching posts:", err);
          console.error("Error details:", err.response?.data);
          setUserPosts([]);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error fetching account data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Password validation
    if (editForm.newPassword && !editForm.currentPassword) {
      setPasswordError("Current password is required to change password");
      return;
    }

    if (editForm.newPassword !== editForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Prepare update data
    const updateData = {
      name: editForm.name,
      phoneNo: editForm.phoneNo,
    };

    // Only include password fields if user is changing the password
    if (editForm.currentPassword && editForm.newPassword) {
      updateData.currentPassword = editForm.currentPassword;
      updateData.newPassword = editForm.newPassword;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        updateData,
        { withCredentials: true }
      );

      setUserDetails(response.data.user);
      setIsEditModalOpen(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("password")) {
          setPasswordError(error.response.data.message);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Error updating profile");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
            <FiClock className="h-3.5 w-3.5" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
            <FiCheckCircle className="h-3.5 w-3.5" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold border border-rose-200">
            <FiXCircle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatAge = (age) => {
    if (!age) return "Unknown";

    const { years, months } = age;

    if (years === 0) {
      return `${months} ${months === 1 ? "month" : "months"}`;
    } else if (months === 0) {
      return `${years} ${years === 1 ? "year" : "years"}`;
    } else {
      return `${years} ${years === 1 ? "year" : "years"}, ${months} ${
        months === 1 ? "month" : "months"
      }`;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <p className="text-gray-600 mt-2">
            Manage your profile, adoptions and posts
          </p>
        </div>

        {/* Account Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => handleTabChange("personal")}
                className={`px-6 py-4 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "personal"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiUser
                  className={`${
                    activeTab === "personal" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                Personal Information
              </button>
              <button
                onClick={() => handleTabChange("adoptions")}
                className={`px-6 py-4 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "adoptions"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiHome
                  className={`${
                    activeTab === "adoptions"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                Adoption Requests
              </button>
              <button
                onClick={() => handleTabChange("posts")}
                className={`px-6 py-4 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "posts"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiEdit2
                  className={`${
                    activeTab === "posts" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                My Posts
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "personal" && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="h-10 w-10 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {userDetails?.name}
                        </h2>
                        <p className="text-gray-500">Adopter Account</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-1">
                          <FiMail className="text-blue-600" />
                          <h3 className="font-medium text-gray-700">Email</h3>
                        </div>
                        <p className="ml-8 text-gray-800">
                          {userDetails?.email}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-1">
                          <FiPhone className="text-blue-600" />
                          <h3 className="font-medium text-gray-700">Phone</h3>
                        </div>
                        <p className="ml-8 text-gray-800">
                          {userDetails?.phoneNo || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-1">
                          <FiCalendar className="text-blue-600" />
                          <h3 className="font-medium text-gray-700">Joined</h3>
                        </div>
                        <p className="ml-8 text-gray-800">
                          {userDetails?.createdAt
                            ? format(
                                new Date(userDetails.createdAt),
                                "MMMM d, yyyy"
                              )
                            : "Not available"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-1">
                          <FiLock className="text-blue-600" />
                          <h3 className="font-medium text-gray-700">
                            Password
                          </h3>
                        </div>
                        <p className="ml-8 text-gray-800">••••••••</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiEdit2 size={16} />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "adoptions" && (
                <motion.div
                  key="adoptions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {adoptionRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <FiHome className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">
                        No adoption requests yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        When you apply to adopt a pet, your applications will
                        appear here.
                      </p>
                      <Link
                        to="/pets"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4"
                      >
                        Browse Pets
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {adoptionRequests.map((request) => (
                        <motion.div
                          key={request._id}
                          whileHover={{ scale: 1.01 }}
                          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 h-48 md:h-auto bg-gray-100 relative">
                              {request.petId.photos &&
                              request.petId.photos.length > 0 ? (
                                <img
                                  src={request.petId.photos[0]}
                                  alt={request.petId.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <FiHome className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="p-6 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                                    {request.petId.name}
                                  </h3>
                                  <p className="text-gray-600 text-sm mb-4">
                                    {request.petId.breed} •{" "}
                                    {formatAge(request.petId.age)} •{" "}
                                    {request.petId.gender}
                                  </p>
                                </div>
                                <div>{getStatusBadge(request.status)}</div>
                              </div>

                              <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">
                                  <span className="font-medium">
                                    Applied on:
                                  </span>{" "}
                                  {format(
                                    new Date(request.createdAt),
                                    "MMMM d, yyyy"
                                  )}
                                </p>
                                <p className="text-sm text-gray-500 mb-2">
                                  <span className="font-medium">Shelter:</span>{" "}
                                  {request.petId.shelterId.name}
                                </p>

                                {request.status === "rejected" &&
                                  request.rejectionReason && (
                                    <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                                      <p className="text-sm font-medium text-rose-700 mb-1">
                                        Reason for rejection:
                                      </p>
                                      <p className="text-sm text-rose-600">
                                        {request.rejectionReason}
                                      </p>
                                    </div>
                                  )}

                                <div className="mt-4">
                                  <Link
                                    to={`/pet/${request.petId._id}`}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                  >
                                    View Pet Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "posts" && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Your Posts
                    </h2>
                    <Link
                      to="/add-post"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Create New Post
                    </Link>
                  </div>

                  {userPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <FiEdit2 className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">
                        No posts yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Share your pet adoption journey or tips with the
                        community.
                      </p>
                      <Link
                        to="/add-post"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4"
                      >
                        Create First Post
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userPosts.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiEdit2 className="h-5 w-5" /> Edit Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
                aria-label="Close"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmitEdit}>
                <div className="space-y-6">
                  {/* Personal Details Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                      Personal Details
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiUser className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditFormChange}
                            className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiPhone className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="phoneNo"
                            value={editForm.phoneNo}
                            onChange={handleEditFormChange}
                            className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3 pt-2 border-t border-gray-200">
                      Change Password
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiLock className="text-gray-400" />
                          </div>
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={editForm.currentPassword}
                            onChange={handleEditFormChange}
                            className="w-full pl-10 pr-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <FiEyeOff size={18} />
                            ) : (
                              <FiEye size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiLock className="text-gray-400" />
                          </div>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={editForm.newPassword}
                            onChange={handleEditFormChange}
                            className="w-full pl-10 pr-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <FiEyeOff size={18} />
                            ) : (
                              <FiEye size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiLock className="text-gray-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={editForm.confirmPassword}
                            onChange={handleEditFormChange}
                            className="w-full pl-10 pr-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <FiEyeOff size={18} />
                            ) : (
                              <FiEye size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Password error message */}
                      {passwordError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                          <p className="flex items-center gap-2 text-sm text-red-700">
                            <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
                            {passwordError}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 italic">
                        Leave password fields empty if you don't want to change
                        it
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all shadow-sm hover:shadow"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
