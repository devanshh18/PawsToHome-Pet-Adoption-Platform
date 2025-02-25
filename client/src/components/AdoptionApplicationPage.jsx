import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetById } from "../features/pets/petSlice";
import AdoptionForm from "../components/AdoptionForm";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdoptionApplicationPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedPet, isLoading, error } = useSelector((state) => state.pets);

  useEffect(() => {
    if (petId) {
      dispatch(fetchPetById(petId));
    }
  }, [dispatch, petId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!selectedPet) return <div className="text-center">Pet not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Pet Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={selectedPet.photos[0]}
              alt={selectedPet.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Adopt {selectedPet.name}
              </h1>
              <p className="text-gray-600">
                {selectedPet.breed} • {selectedPet.formattedAge}
              </p>
              <p className="text-gray-600">
                From: {selectedPet.shelterId.shelterName}
              </p>
            </div>
          </div>
        </div>

        {/* Adoption Form */}
        <AdoptionForm
          petId={petId}
          onClose={() => navigate(`/pet/${petId}`)}
        />
      </div>
    </div>
  );
}