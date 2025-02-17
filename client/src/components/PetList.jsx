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
import { FaChild, FaPaw } from "react-icons/fa";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="relative h-60 overflow-hidden rounded-t-2xl">
              <img
                src={pet.photos[0]}
                alt={pet.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                <p className="text-gray-200">{pet.breed}</p>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(pet)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow"
                >
                  <FiEdit className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={() => handleDelete(pet._id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow"
                >
                  <FiTrash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    pet.status === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {pet.status}
                </span>
                <span className="text-sm text-gray-600">
                  {pet.gender} • {pet.formattedAge}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {pet.temperament?.split(", ").map((temp) => (
                  <span
                    key={temp}
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                  >
                    {temp}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <FaChild className="text-gray-500" />
                  <span>Kids: {pet.goodWithKids ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaPaw className="text-gray-500" />
                  <span>Pets: {pet.goodWithPets ? "Yes" : "No"}</span>
                </div>
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
