import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShelterApplications,
  updateApplication,
} from "../../features/adoptionProcess/adoptionSlice";
import { toast } from "react-toastify";
import { format } from "date-fns";
import LoadingSpinner from "../shared/LoadingSpinner";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiFilter,
  FiHome,
  FiMail,
  FiPhone,
  FiSearch,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

export default function AdoptionRequestsTab() {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state) => state.adoption);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);

  useEffect(() => {
    dispatch(fetchShelterApplications());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(
        updateApplication({
          id,
          statusData: { status: "approved" },
        })
      ).unwrap();
      toast.success("Application approved successfully");
    } catch (error) {
      toast.error(error || "Failed to approve application");
    }
  };

  const handleReject = async (id) => {
    try {
      if (!rejectionReason) {
        toast.error("Please provide a reason for rejection");
        return;
      }
      await dispatch(
        updateApplication({
          id,
          statusData: { status: "rejected", rejectionReason },
        })
      ).unwrap();
      toast.success("Application rejected successfully");
      setRejectionReason("");
      setSelectedId(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error || "Failed to reject application");
    }
  };

  const openRejectModal = (application) => {
    setCurrentApplication(application);
    setSelectedId(application._id);
    setIsModalOpen(true);
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

  const filteredApplications = applications.filter((app) => {
    // Filter by status
    if (filterStatus !== "all" && app.status !== filterStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        app.petId?.name?.toLowerCase()?.includes(query) ||
        app.adopterId?.name?.toLowerCase()?.includes(query) ||
        app.adopterId?.email?.toLowerCase()?.includes(query)
      );
    }

    return true;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with filters and search */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Adoption Applications
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                <FiFilter className="ml-3 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-transparent py-2.5 pl-2 pr-8 focus:outline-none text-gray-700"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <FiChevronDown className="mr-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Showing {filteredApplications.length}{" "}
            {filteredApplications.length === 1 ? "application" : "applications"}
          </p>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No applications found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {filterStatus !== "all"
              ? `There are no ${filterStatus} applications to display.`
              : searchQuery
              ? "No applications match your search criteria."
              : "When potential adopters apply for your pets, they'll appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <div
              key={application._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
            >
              {/* Application header */}
              <div className="bg-gradient-to-r from-blue-600/5 to-blue-700/5 p-5 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-center gap-5">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-14 h-14 rounded-lg flex items-center justify-center shadow-md shadow-blue-200/50">
                      <FaPaw className="w-7 h-7 text-white" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          {application.petId?.name || "Unknown Pet"}
                        </h3>
                        {getStatusBadge(application.status)}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                        <FiCalendar className="h-3.5 w-3.5" />
                        <span>
                          Applied{" "}
                          {format(
                            new Date(application.createdAt),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === application._id
                            ? null
                            : application._id
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      {expandedId === application._id ? (
                        <>
                          <FiChevronUp />
                          <span>Hide Details</span>
                        </>
                      ) : (
                        <>
                          <FiChevronDown />
                          <span>View Details</span>
                        </>
                      )}
                    </button>

                    {application.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(application._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-sm transition-colors"
                        >
                          <FiCheckCircle />
                          <span className="hidden sm:inline">Approve</span>
                        </button>
                        <button
                          onClick={() => openRejectModal(application)}
                          className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-colors"
                        >
                          <FiXCircle />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Applicant summary (always visible) */}
              <div className="p-5 bg-white border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-blue-500" />
                    <span className="text-gray-500">Applicant:</span>
                    <span className="font-medium text-gray-800">
                      {application.adopterId?.name || "Unknown Applicant"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-blue-500" />
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-800">
                      {application.adopterId?.email || "No email provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-blue-500" />
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-800">
                      {application.adopterId?.phoneNo || "No phone provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed information (expandable) */}
              {expandedId === application._id && (
                <div className="px-5 pt-2 pb-5 space-y-6 bg-gray-50 animate-fadeIn">
                  {/* Living Arrangement */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiHome className="text-blue-500" />
                      Living Arrangement
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Home Type</p>
                        <p className="font-medium capitalize text-gray-800">
                          {application.livingArrangement?.homeType || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Has Yard</p>
                        <p className="font-medium text-gray-800">
                          {application.livingArrangement?.hasYard ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Ownership</p>
                        <p className="font-medium capitalize text-gray-800">
                          {application.livingArrangement?.ownership?.replace?.("_", " ") || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Household Information */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiUser className="text-blue-500" />
                      Household Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          Number of Adults
                        </p>
                        <p className="font-medium text-gray-800">
                          {application.householdInfo?.numberOfAdults || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          Has Children
                        </p>
                        <p className="font-medium text-gray-800">
                          {application.householdInfo?.hasChildren ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pet Experience */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiUser className="text-blue-500" />
                      Pet Experience
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          Has Other Pets
                        </p>
                        <p className="font-medium text-gray-800">
                          {application.petExperience?.hasOtherPets ? "Yes" : "No"}
                        </p>
                      </div>
                      {application.petExperience?.previousExperience && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Previous Experience
                          </p>
                          <p className="font-medium text-gray-800">
                            {application.petExperience?.previousExperience}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Adoption Details */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiAlertCircle className="text-blue-500" />
                      Adoption Details
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          Reason for Adoption
                        </p>
                        <p className="font-medium text-gray-800">
                          {application.adoptionDetails?.reason || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          Daily Schedule
                        </p>
                        <p className="font-medium text-gray-800">
                          {application.adoptionDetails?.schedule || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Reject Application
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setRejectionReason("");
                }}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-1">
                Please provide a reason for rejecting this application for:
              </p>
              <p className="font-semibold text-blue-600">
                {currentApplication?.petId?.name || "Unknown Pet"} (by{" "}
                {currentApplication?.adopterId?.name || "Unknown Applicant"})
              </p>
            </div>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter a reason for rejection..."
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleReject(selectedId)}
                className="flex-1 py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <FiXCircle />
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setRejectionReason("");
                }}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
      `}</style>
    </div>
  );
}