import { useSelector } from "react-redux";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ShelterProfile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="h-full w-full">
      {/* Profile Content */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
        {/* Quick Info Card */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <ContactItem
                icon={<FiMail />}
                label="Email"
                value={user?.email}
              />
              <ContactItem
                icon={<FiPhone />}
                label="Phone"
                value={user?.phoneNo}
              />
              <ContactItem
                icon={<FiMapPin />}
                label="Location"
                value={`${user?.city}, ${user?.state}`}
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
              <DetailField label="Legal Name" value={user?.name} />
              <DetailField label="Shelter Name" value={user?.shelterName} />
              <DetailField label="Address" value={user?.address} fullWidth />
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <DetailField label="City" value={user?.city} />
                <DetailField label="State" value={user?.state} />
              </div>
            </div>
          </div>
        </div>
      </div>
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
