import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiCheck,
  FiX,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiFilter,
  FiSearch,
  FiFileText,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  fetchAllUsers,
  fetchAllShelters,
  fetchPendingShelters,
  approveShelterRegistration,
  rejectShelterRegistration,
  removeUser,
  removeShelter,
  resetAdminState,
} from "../../features/admin/adminSlice";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";

function formatDate(dateString, formatPattern) {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "N/A";
    return format(date, formatPattern);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "N/A";
  }
}

export default function UserManagementTab() {
  const dispatch = useDispatch();
  const { users, shelters, pendingShelters, isLoading, isError, errorMessage } =
    useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedShelterId, setSelectedShelterId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Fetch users, shelters and pending shelters
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllShelters());
    dispatch(fetchPendingShelters());

    return () => {
      dispatch(resetAdminState());
    };
  }, [dispatch]);

  // Handle shelter approval
  const handleApprove = async (shelterId) => {
    await dispatch(approveShelterRegistration(shelterId));
  };

  // Open reject modal
  const openRejectModal = (shelterId) => {
    setSelectedShelterId(shelterId);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  // Handle shelter rejection
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await dispatch(
        rejectShelterRegistration({
          id: selectedShelterId,
          reason: rejectReason,
        })
      ).unwrap();

      // Only close the modal and clear state if rejection was successful
      setIsRejectModalOpen(false);
      setRejectReason("");
      setSelectedShelterId(null);
    } catch (error) {
      // Error is already displayed via toast in the slice
      // Don't close the modal so the user can try again
      console.error("Rejection failed:", error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    await dispatch(removeUser(userId));
  };

  // Handle shelter deletion
  const handleDeleteShelter = async (shelterId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this shelter? This action will remove all associated pets and adoption applications."
      )
    ) {
      return;
    }

    await dispatch(removeShelter(shelterId));
  };

  // Filter users and shelters based on search query and status filter
  const filteredShelters = shelters
    .filter(
      (shelter) => filterStatus === "all" || shelter.status === filterStatus
    )
    .filter(
      (shelter) =>
        shelter.shelterName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        shelter.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shelter.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shelter.state?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredUsers = users
    .filter((user) => user.role === "user")
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Show error state if any requests failed
  if (isError) {
    return (
      <ErrorAlert
        message={errorMessage || "Failed to load user management data"}
        retryAction={() => {
          dispatch(resetAdminState());
          dispatch(fetchAllUsers());
          dispatch(fetchAllShelters());
          dispatch(fetchPendingShelters());
        }}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        <p className="text-gray-500 mt-1">
          Manage users, shelters, and pending registrations
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200 px-6">
          <Tab
            className={({ selected }) => `
            py-3 px-5 text-md font-medium border-b-2 -mb-px
            ${
              selected
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-300"
            }
          `}
          >
            Users
          </Tab>
          <Tab
            className={({ selected }) => `
            py-3 px-5 text-md font-medium border-b-2 -mb-px
            ${
              selected
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-300"
            }
          `}
          >
            Shelters
          </Tab>
          <Tab
            className={({ selected }) => `
            py-3 px-5 text-md font-medium border-b-2 -mb-px
            ${
              selected
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-300"
            }
          `}
          >
            <div className="flex items-center">
              Pending Approvals
              {pendingShelters.length > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {pendingShelters.length}
                </span>
              )}
            </div>
          </Tab>
        </Tab.List>

        <Tab.Panels className="p-6">
          {/* Users Panel */}
          <Tab.Panel>
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Mobile
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Joined On
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.phoneNo || "Not provided"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(user.createdAt, "MMM dd, yyyy")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.role !== "admin" && (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900 mr-4"
                                title="Delete user"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        No users found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Tab.Panel>

          {/* Shelters Panel */}
          <Tab.Panel>
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search shelters..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="sm:w-64">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Shelter Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredShelters.map((shelter) => (
                        <tr key={shelter._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {shelter.shelterName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Since {formatDate(shelter.createdAt, "MMM yyyy")}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <FiMail className="mr-1.5 h-3.5 w-3.5" />
                              {shelter.email}
                            </div>
                            {shelter.phoneNo && (
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <FiPhone className="mr-1.5 h-3.5 w-3.5" />
                                {shelter.phoneNo}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <FiMapPin className="mr-1.5 h-3.5 w-3.5" />
                              {shelter.city}, {shelter.state}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                shelter.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : shelter.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {shelter.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteShelter(shelter._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete shelter"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredShelters.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        No shelters found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Tab.Panel>

          {/* Pending Approvals Panel */}
          <Tab.Panel>
            {isLoading ? (
              <LoadingSpinner />
            ) : pendingShelters.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <FiCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  All caught up!
                </h3>
                <p className="text-gray-500">
                  There are no pending shelter registrations to review.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingShelters.map((shelter) => (
                  <div
                    key={shelter._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {/* Shelter title header */}
                    <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {shelter.shelterName}
                      </h3>
                      <p className="text-gray-500">
                        Application submitted on{" "}
                        {formatDate(shelter.createdAt, "MMMM d, yyyy")}
                      </p>
                    </div>

                    {/* Shelter information */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <div className="mb-4">
                            <p className="text-gray-500 mb-1">Shelter Admin</p>
                            <p className="text-gray-900 font-medium">
                              {shelter.name || "Not provided"}
                            </p>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-500 mb-1">Email Address</p>
                            <p className="text-gray-900 font-medium">
                              {shelter.email}
                            </p>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-500 mb-1">Phone Number</p>
                            <p className="text-gray-900 font-medium">
                              {shelter.phoneNo || "Not provided"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="mb-4">
                            <p className="text-gray-500 mb-1">Address</p>
                            <p className="text-gray-900 font-medium">
                              {shelter.address || "Not provided"}
                            </p>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-500 mb-1">City, State</p>
                            <p className="text-gray-900 font-medium">
                              {shelter.city}, {shelter.state}
                            </p>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-500 mb-1">
                              License Document
                            </p>
                            {shelter.licenseDocument ? (
                              <div className="flex items-center justify-between py-3 px-4 bg-blue-50 border border-blue-100 rounded-lg">
                                <span className="font-medium text-blue-900 flex items-center">
                                  <FiFileText className="h-5 w-5 text-blue-500 mr-2" />
                                  License Available
                                </span>
                                <a
                                  href={shelter.licenseDocument}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-1.5 px-3 bg-white text-blue-600 rounded-md border border-blue-200 hover:bg-blue-50 text-sm font-medium"
                                >
                                  View
                                </a>
                              </div>
                            ) : (
                              <div className="py-3 px-4 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg">
                                No document provided
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons at bottom */}
                      <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => openRejectModal(shelter._id)}
                          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(shelter._id)}
                          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            {/* Header */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <FiX size={20} className="text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Reject Shelter Registration
                  </h2>
                </div>
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} className="text-gray-400" />
                </button>
              </div>
              <p className="text-gray-600 text-sm ml-13 pl-0.5">
                Please provide a detailed explanation for why this registration
                is being rejected
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-800 mb-3">
                  <span className="font-medium">Shelter Name:</span>
                  <span className="ml-2">
                    {
                      pendingShelters.find((s) => s._id === selectedShelterId)
                        ?.shelterName
                    }
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className={`w-full border ${
                      !rejectReason.trim() || rejectReason.trim().length < 10
                        ? "border-red-300"
                        : "border-gray-200"
                    } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                    rows="5"
                    placeholder="Enter your rejection reason..."
                    autoFocus
                  ></textarea>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      {(!rejectReason.trim() ||
                        rejectReason.trim().length < 10) && (
                        <div className="text-sm text-red-500 flex items-center">
                          <FiAlertCircle size={14} className="mr-1" />
                          {!rejectReason.trim()
                            ? "Rejection reason is required"
                            : "Reason must be at least 10 characters"}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-400">
                      {`${rejectReason.length} characters`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border-l-2 border-amber-500 pl-4 py-3 pr-3 mb-6">
                <div className="flex">
                  <FiAlertCircle className="text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <span className="block text-sm font-medium text-amber-800">
                      Important:
                    </span>
                    <span className="block text-sm text-amber-700">
                      The applicant will receive an email with this rejection
                      reason. Be professional and constructive with your
                      feedback.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className={`inline-flex items-center px-5 py-2.5 rounded-lg text-white font-medium ${
                  rejectReason.trim().length >= 10
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
                disabled={
                  !rejectReason.trim() || rejectReason.trim().length < 10
                }
              >
                <FiX className="mr-2" size={16} /> Reject Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

<style jsx>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes scaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out;
  }
`}</style>;
