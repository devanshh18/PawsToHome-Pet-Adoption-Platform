import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShelterApplications, updateApplication } from "../features/adoptionProcess/adoptionSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";
import { format } from "date-fns"; // Add this for date formatting

export default function AdoptionRequestsTab() {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state) => state.adoption);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    dispatch(fetchShelterApplications());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(updateApplication({
        id,
        statusData: { status: "approved" }
      })).unwrap();
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
      await dispatch(updateApplication({
        id,
        statusData: { status: "rejected", rejectionReason }
      })).unwrap();
      toast.success("Application rejected successfully");
      setRejectionReason("");
      setSelectedId(null);
    } catch (error) {
      toast.error(error || "Failed to reject application");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Adoption Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No adoption applications yet</p>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application._id} className="bg-white rounded-lg shadow-sm border p-6">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {application.petId.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}>
                      {application.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{application.petId.formattedAge}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Submitted on {format(new Date(application.createdAt), 'PPP')}
                  </p>
                </div>
              </div>

              {/* Applicant Information */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Applicant Information</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{application.adopterId.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{application.adopterId.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{application.adopterId.phoneNo}</p>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-6">
                {/* Living Arrangement */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Living Arrangement</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Home Type</p>
                      <p className="font-medium capitalize">{application.livingArrangement.homeType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Has Yard</p>
                      <p className="font-medium">{application.livingArrangement.hasYard ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ownership</p>
                      <p className="font-medium capitalize">{application.livingArrangement.ownership.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Household Information */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Household Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Number of Adults</p>
                      <p className="font-medium">{application.householdInfo.numberOfAdults}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Has Children</p>
                      <p className="font-medium">{application.householdInfo.hasChildren ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>

                {/* Pet Experience */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Pet Experience</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Has Other Pets</p>
                      <p className="font-medium">{application.petExperience.hasOtherPets ? "Yes" : "No"}</p>
                    </div>
                    {application.petExperience.previousExperience && (
                      <div>
                        <p className="text-sm text-gray-600">Previous Experience</p>
                        <p className="font-medium">{application.petExperience.previousExperience}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Adoption Details */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Adoption Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Reason for Adoption</p>
                      <p className="font-medium">{application.adoptionDetails.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Daily Schedule</p>
                      <p className="font-medium">{application.adoptionDetails.schedule}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {application.status === "pending" && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(application._id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedId(application._id)}
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>

                  {selectedId === application._id && (
                    <div className="mt-4">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a reason for rejection"
                        className="w-full p-3 border rounded-lg"
                        rows={3}
                      />
                      <div className="mt-3 flex gap-3">
                        <button
                          onClick={() => handleReject(application._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(null);
                            setRejectionReason("");
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}