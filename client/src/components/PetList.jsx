import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShelterPets,
  deletePetById,
  updateExistingPet,
} from "../features/pets/petSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";
import { FiTrash2, FiEdit } from "react-icons/fi";
import EditPetForm from "./EditPetForm";

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

  if (pets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">No pets listed yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={pet.photos[0]}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(pet)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Edit pet"
                >
                  <FiEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(pet._id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Delete pet"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {pet.name}
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {pet.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600">
                  {pet.breed} • {pet.gender} • {pet.formattedAge}
                </p>

                <div className="flex flex-wrap gap-2">
                  {pet.temperament?.split(", ").map((temp) => (
                    <span
                      key={temp}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize"
                    >
                      {temp}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span
                      className={`mr-1 ${
                        pet.goodWithKids ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      •
                    </span>
                    Good with kids: {pet.goodWithKids ? "Yes" : "No"}
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`mr-1 ${
                        pet.goodWithPets ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      •
                    </span>
                    Good with pets: {pet.goodWithPets ? "Yes" : "No"}
                  </div>
                </div>

                <p className="text-gray-700 line-clamp-2">{pet.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPet && (
        <EditPetForm
          pet={editingPet}
          onUpdate={handleUpdate}
          onCancel={() => setEditingPet(null)}
        />
      )}
    </>
  );
}