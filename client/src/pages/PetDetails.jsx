import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetById } from "../features/pets/petSlice";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PetDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedPet, isLoading, error } = useSelector((state) => state.pets);

  useEffect(() => {
    if (id) {
      dispatch(fetchPetById(id));
    }
  }, [dispatch, id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!selectedPet) return <div className="text-center">Pet not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {selectedPet.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${selectedPet.name} - ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Pet Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedPet.name}
            </h1>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {selectedPet.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                About {selectedPet.name}
              </h2>
              <dl className="grid grid-cols-2 gap-4">
                {/* Species & Breed */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Species</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedPet.species}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Breed</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedPet.breed}
                  </dd>
                </div>

                {/* Age & Gender */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Age</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedPet.formattedAge}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedPet.gender}
                  </dd>
                </div>

                {/* Color & Weight */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Color</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedPet.color}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Weight</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedPet.weight}
                  </dd>
                </div>

                {/* Characteristics */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Good with Kids
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedPet.goodWithKids ? "Yes" : "No"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Good with Other Pets
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedPet.goodWithPets ? "Yes" : "No"}
                  </dd>
                </div>

                {/* Vaccination Status */}
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Vaccination Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedPet.vaccinationStatus
                      ? "Vaccinated"
                      : "Not Vaccinated"}
                  </dd>
                </div>
              </dl>

              {/* Temperament Tags */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Temperament
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPet.temperament.split(", ").map((temp) => (
                    <span
                      key={temp}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {temp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{selectedPet.description}</p>
              </div>
            </div>

            {/* Shelter Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Shelter Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">
                  {selectedPet.shelterId.shelterName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Contact Person: {selectedPet.shelterId.name}
                </p>
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-500">
                    Location
                  </h4>
                  <p className="text-gray-600 mt-1">
                    {selectedPet.shelterId.address}
                  </p>
                  <p className="text-gray-600">
                    {selectedPet.shelterId.city}, {selectedPet.shelterId.state}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                  <div className="mt-1 space-y-1">
                    <p>
                      <a
                        href={`mailto:${selectedPet.shelterId.email}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {selectedPet.shelterId.email}
                      </a>
                    </p>
                    <p>
                      <a
                        href={`tel:${selectedPet.shelterId.phoneNo}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {selectedPet.shelterId.phoneNo}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {selectedPet.status === "Available" && (
              <div className="px-6 py-4 border-t">
                <button
                  onClick={() => navigate(`/adopt/${selectedPet._id}`)}
                  className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Adoption Process
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}