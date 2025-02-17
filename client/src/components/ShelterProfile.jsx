import { useSelector } from 'react-redux';

export default function ShelterProfile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Shelter Profile</h1>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Information */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Account Information
              </h2>
              <div className="space-y-4">
                <InfoField label="Full Name" value={user?.name} />
                <InfoField label="Email Address" value={user?.email} />
                <InfoField label="Phone Number" value={user?.phoneNo} />
              </div>
            </section>

            {/* Shelter Information */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Shelter Information
              </h2>
              <div className="space-y-4">
                <InfoField label="Shelter Name" value={user?.shelterName} />
                <InfoField label="Address" value={user?.address} />
                <div className="grid grid-cols-2 gap-4">
                  <InfoField label="City" value={user?.city} />
                  <InfoField label="State" value={user?.state} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Field Component
const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
    <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-gray-800">{value || 'Not provided'}</p>
    </div>
  </div>
);