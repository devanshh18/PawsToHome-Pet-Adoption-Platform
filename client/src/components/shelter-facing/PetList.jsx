import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { FaChild, FaPaw, FaSyringe } from "react-icons/fa";
import {
  fetchShelterPets,
  deletePetById,
  updateExistingPet,
} from "../../features/pets/petSlice";
import LoadingSpinner from "../shared/LoadingSpinner";
import EditPetForm from "./EditPetForm";
import { toast } from "react-toastify";

export default function PetList() {
  const dispatch = useDispatch();
  const { pets, isLoading } = useSelector((state) => state.pets);
  const [editingPet, setEditingPet] = useState(null);

  useEffect(() => {
    dispatch(fetchShelterPets());
  }, [dispatch]);

  const handleDelete = async (petId) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await dispatch(deletePetById(petId)).unwrap();
        toast.success("Pet deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete pet");
      }
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
  };

  const handleUpdate = async (petId, formData) => {
    try {
      await dispatch(
        updateExistingPet({ id: petId, petData: formData })
      ).unwrap();
      toast.success("Pet updated successfully");
      setEditingPet(null);
    } catch (error) {
      toast.error(error || "Failed to update pet");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {pets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="mb-4 text-6xl">🐾</div>
            <h3 className="text-xl font-semibold text-gray-800">
              No pets listed yet
            </h3>
            <p className="text-gray-500 mt-2">
              Start by adding your first pet for adoption
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={pet.photos[0]}
                  alt={pet.name}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover transform-gpu transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                  >
                    <FiEdit className="w-4 h-4 text-gray-800" />
                  </button>
                  <button
                    onClick={() => handleDelete(pet._id)}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {pet.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      pet.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {pet.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{pet.breed}</span>
                  <span>•</span>
                  <span>{pet.gender}</span>
                  <span>•</span>
                  <span>{pet.formattedAge}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {pet.temperament?.split(", ").map((temp) => (
                    <span
                      key={temp}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full capitalize"
                    >
                      {temp}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FaChild className="w-4 h-4 text-gray-500" />
                    <span
                      className={
                        pet.goodWithKids ? "text-green-600" : "text-red-600"
                      }
                    >
                      {pet.goodWithKids ? "Kid-friendly" : "Not kid-friendly"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPaw className="w-4 h-4 text-gray-500" />
                    <span
                      className={
                        pet.goodWithPets ? "text-green-600" : "text-red-600"
                      }
                    >
                      {pet.goodWithPets ? "Pet-friendly" : "Prefers solo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <FaSyringe className="w-4 h-4 text-gray-500" />
                    <span
                      className={
                        pet.vaccinationStatus
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {pet.vaccinationStatus ? "Vaccinated" : "Not vaccinated"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingPet && (
        <EditPetForm
          pet={editingPet}
          onUpdate={handleUpdate}
          onCancel={() => setEditingPet(null)}
        />
      )}
    </div>
  );
}
