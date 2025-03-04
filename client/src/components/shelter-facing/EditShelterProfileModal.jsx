import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import {
  FiUser,
  FiHome,
  FiX,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditShelterProfileModal({ user, onClose, onUpdate }) {
  const dispatch = useDispatch();
  // Form state
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phoneNo: user?.phoneNo || "",
    shelterName: user?.shelterName || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Error states
  const [passwordError, setPasswordError] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: "",
    phoneNo: "",
    shelterName: "",
    address: "",
    city: "",
    state: "",
  });

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });

    // Clear error for this field as user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate required fields
    if (!editForm.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (editForm.phoneNo && !/^\d{10}$/.test(editForm.phoneNo)) {
      errors.phoneNo = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!editForm.shelterName.trim()) {
      errors.shelterName = "Shelter name is required";
      isValid = false;
    }

    if (!editForm.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    if (!editForm.city.trim()) {
      errors.city = "City is required";
      isValid = false;
    }

    if (!editForm.state.trim()) {
      errors.state = "State is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Client-side validation
    if (!validateForm()) {
      // If on profile tab but there are errors, show the tab with errors
      if (activeTab === "profile") {
        toast.error("Please fix the errors in the form");
        return;
      }
    }

    // Password validation
    if (editForm.newPassword && !editForm.currentPassword) {
      setPasswordError("Current password is required to change password");
      if (activeTab !== "security") setActiveTab("security");
      return;
    }

    if (editForm.newPassword !== editForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      if (activeTab !== "security") setActiveTab("security");
      return;
    }

    // Prepare update data
    const updateData = {
      name: editForm.name,
      phoneNo: editForm.phoneNo,
      shelterName: editForm.shelterName,
      address: editForm.address,
      city: editForm.city,
      state: editForm.state,
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

      onUpdate(response.data.user);
      dispatch(setUser(response.data.user));
      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.data?.errors) {
        // Handle field-specific errors from server
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setFormErrors({ ...formErrors, ...serverErrors });

        // Switch to appropriate tab if needed
        const hasProfileErrors = [
          "name",
          "phoneNo",
          "shelterName",
          "address",
          "city",
          "state",
        ].some((field) => serverErrors[field]);

        const hasSecurityErrors = [
          "currentPassword",
          "newPassword",
          "confirmPassword",
        ].some((field) => serverErrors[field]);

        if (hasProfileErrors && activeTab !== "profile") {
          setActiveTab("profile");
        } else if (hasSecurityErrors && activeTab !== "security") {
          setActiveTab("security");
        }
      } else if (error.response?.data?.message) {
        if (error.response.data.message.includes("password")) {
          setPasswordError(error.response.data.message);
          if (activeTab !== "security") setActiveTab("security");
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Error updating profile");
      }
    }
  };

  // Function to render error for any field
  const renderError = (fieldName) => {
    if (!formErrors[fieldName]) return null;

    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded-md mt-1">
        <div className="flex items-center">
          <FiAlertCircle className="text-red-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-700">{formErrors[fieldName]}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl w-full max-w-3xl">
        {/* Modal Header */}
        <div className="relative bg-white border-b border-gray-100">
          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Shelter Profile
            </h2>
            <p className="text-gray-500 mt-1">
              Update your shelter information and account settings
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>

          {/* Tabs */}
          <div className="px-8 flex space-x-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Shelter Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "security"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Password & Security
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 max-h-[calc(100vh-250px)] overflow-y-auto">
          <form onSubmit={handleSubmitEdit}>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <FiUser className="mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Legal Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          formErrors.name ? "border-red-500" : "border-gray-200"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                        placeholder="Enter legal name"
                        required
                      />
                      {renderError("name")}
                    </div>
                    <div>
                      <label
                        htmlFor="phoneNo"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phoneNo"
                        name="phoneNo"
                        value={editForm.phoneNo}
                        onChange={handleEditFormChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          formErrors.phoneNo
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                        placeholder="Enter phone number"
                      />
                      {renderError("phoneNo")}
                    </div>
                  </div>
                </div>

                {/* Shelter Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <FiHome className="mr-2 text-blue-600" />
                    Shelter Details
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="shelterName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Shelter Name
                      </label>
                      <input
                        type="text"
                        id="shelterName"
                        name="shelterName"
                        value={editForm.shelterName}
                        onChange={handleEditFormChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          formErrors.shelterName
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                        placeholder="Enter shelter name"
                        required
                      />
                      {renderError("shelterName")}
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editForm.address}
                        onChange={handleEditFormChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          formErrors.address
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                        placeholder="Enter address"
                        required
                      />
                      {renderError("address")}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={editForm.city}
                          onChange={handleEditFormChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            formErrors.city
                              ? "border-red-500"
                              : "border-gray-200"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                          placeholder="Enter city"
                          required
                        />
                        {renderError("city")}
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={editForm.state}
                          onChange={handleEditFormChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            formErrors.state
                              ? "border-red-500"
                              : "border-gray-200"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                          placeholder="Enter state"
                          required
                        />
                        {renderError("state")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <FiLock className="mr-2 text-blue-600" />
                    Change Password
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          name="currentPassword"
                          value={editForm.currentPassword}
                          onChange={handleEditFormChange}
                          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          name="newPassword"
                          value={editForm.newPassword}
                          onChange={handleEditFormChange}
                          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={editForm.confirmPassword}
                          onChange={handleEditFormChange}
                          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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

                    {passwordError && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <div className="flex items-center">
                          <FiAlertCircle className="text-red-500 mr-2 flex-shrink-0" />
                          <p className="text-sm text-red-700">
                            {passwordError}
                          </p>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-gray-500">
                      Leave password fields empty if you don't want to change
                      your password.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
