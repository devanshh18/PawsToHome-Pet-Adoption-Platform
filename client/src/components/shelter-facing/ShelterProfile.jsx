import { useSelector } from "react-redux";
import { FiMail, FiPhone, FiMapPin, FiEdit2, FiSettings } from "react-icons/fi";
import { useState } from "react";
import EditShelterProfileModal from "./EditShelterProfileModal";

export default function ShelterProfile() {
  const { user } = useSelector((state) => state.auth);
  const [shelterData, setShelterData] = useState(user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateProfile = (updatedUser) => {
    setShelterData(updatedUser);
  };

  return (
    <div className="h-full w-full">
      {/* Profile Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
        {/* Quick Info Card */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Contact Information
              </h2>
            </div>
            <div className="space-y-4">
              <ContactItem
                icon={<FiMail />}
                label="Email"
                value={shelterData?.email}
              />
              <ContactItem
                icon={<FiPhone />}
                label="Phone"
                value={shelterData?.phoneNo}
              />
              <ContactItem
                icon={<FiMapPin />}
                label="Location"
                value={`${shelterData?.city || ""}, ${shelterData?.state || ""}`}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Shelter Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <DetailField label="Legal Name" value={shelterData?.name} />
              <DetailField label="Shelter Name" value={shelterData?.shelterName} />
              <DetailField label="Address" value={shelterData?.address} fullWidth />
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <DetailField label="City" value={shelterData?.city} />
                <DetailField label="State" value={shelterData?.state} />
              </div>
            </div>
          </div>
          
          {/* Edit Button moved outside the shelter details box */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit2 size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditShelterProfileModal
          user={shelterData}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateProfile}
        />
      )}
    </div>
  );
}

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 text-gray-600">
    <span className="text-gray-400">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium ">{value || "Not provided"}</p>
    </div>
  </div>
);

const DetailField = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-500 mb-1.5">
      {label}
    </label>
    <div className="px-4 py-3 bg-gray-50 rounded-lg">
      <p className="text-gray-800">{value || "Not provided"}</p>
    </div>
  </div>
);