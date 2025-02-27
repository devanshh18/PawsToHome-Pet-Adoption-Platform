import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingShelters,
  approveShelter,
  rejectShelter,
} from "../../features/admin/adminService";
import { endLoading, setPendingShelters, startLoading } from "../../features/admin/adminSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { pendingShelters, isLoading } = useSelector((state) => state.admin);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedShelterId, setSelectedShelterId] = useState(null);

  const fetchPendingShelters = useCallback(async () => {
    try {
      dispatch(startLoading());
      const response = await getPendingShelters();
      dispatch(setPendingShelters(response.shelters));
    } catch (error) {
      dispatch(endLoading());
      const errorMessage =
        error.response?.data?.message || "Failed to load pending shelters";
      toast.error(errorMessage);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPendingShelters();
  }, [fetchPendingShelters]);

  const handleApprove = async (id) => {
    try {
      dispatch(startLoading());
      await approveShelter(id);
      toast.success("Shelter approved successfully");
      fetchPendingShelters();
    } catch (error) {
      dispatch(endLoading());
      const errorMessage =
        error.response?.data?.message || "Failed to approve shelter";
      toast.error(errorMessage);
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      dispatch(startLoading());
      await rejectShelter(id, rejectReason);
      toast.success("Shelter rejected");
      setRejectReason("");
      setSelectedShelterId(null);
      fetchPendingShelters();
    } catch (error) {
      dispatch(endLoading());
      const errorMessage =
        error.response?.data?.message || "Failed to reject shelter";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pending Shelter Approvals</h1>

      {pendingShelters.length === 0 ? (
        <p className="text-gray-600">No pending shelter applications</p>
      ) : (
        <div className="space-y-4">
          {pendingShelters.map((shelter) => (
            <div key={shelter._id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{shelter.shelterName}</h2>
              {/* <div className="mt-2 space-y-1">
                <p>
                  <span className="font-medium">Contact:</span> {shelter.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {shelter.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {shelter.phoneNo}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {shelter.address}
                </p>
                <a
                  href={shelter.licenseDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View License Document
                </a>
              </div> */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">
                    <strong>Shelter Name:</strong> {shelter.name}
                  </p>
                  <p className="text-gray-600">
                    <strong>Email:</strong> {shelter.email}
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> {shelter.phoneNo}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600">
                    <strong>State:</strong> {shelter.state}
                  </p>
                  <p className="text-gray-600">
                    <strong>City:</strong> {shelter.city}
                  </p>
                  <p className="text-gray-600">
                    <strong>Address:</strong> {shelter.address}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <a
                  href={shelter.licenseDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  View License Document
                </a>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleApprove(shelter._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => setSelectedShelterId(shelter._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>

              {selectedShelterId === shelter._id && (
                <div className="mt-4">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection"
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleReject(shelter._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => {
                        setSelectedShelterId(null);
                        setRejectReason("");
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}