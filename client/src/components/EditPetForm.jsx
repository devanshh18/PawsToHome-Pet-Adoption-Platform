import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaTimes,
  FaPaw,
  FaInfoCircle,
  FaHeartbeat,
  FaSmile,
  FaFileAlt,
} from "react-icons/fa";

export default function EditPetForm({ pet, onUpdate, onCancel }) {
  const [photos, setPhotos] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      gender: pet.gender,
      age: pet.age,
      color: pet.color,
      weight: pet.weight,
      vaccinationStatus: String(pet.vaccinationStatus),
      temperament: pet.temperament ? pet.temperament.split(", ") : [],
      goodWithKids: String(pet.goodWithKids),
      goodWithPets: String(pet.goodWithPets),
      description: pet.description,
    },
  });

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const onSubmit = async (data) => {
    try {
      // Photo validation only if photos are selected (optional for edit)
      if (photos.length > 0 && (photos.length < 2 || photos.length > 5)) {
        toast.error("Please select 2-5 photos");
        return;
      }
      const formData = new FormData();
      const processedData = {
        ...data,
        age: {
          years: Math.max(0, parseInt(data.age.years, 10)),
          months: Math.min(11, Math.max(0, parseInt(data.age.months, 10))),
        },
        goodWithKids: data.goodWithKids === "true",
        goodWithPets: data.goodWithPets === "true",
        vaccinationStatus: data.vaccinationStatus === "true",
        temperament: data.temperament?.join(", ") || "",
      };

      // Append all fields at once
      Object.entries(processedData).forEach(([key, value]) => {
        if (key === "age") {
          formData.append("age.years", value.years);
          formData.append("age.months", value.months);
        } else {
          formData.append(key, value);
        }
      });

      // Append photos if any
      if (photos.length > 0) {
        photos.forEach((photo) => formData.append("photos", photo));
      }

      await onUpdate(pet._id, formData);
      onCancel(); // Close the edit form after successful update
    } catch (error) {
      console.error("Error details:", error);
      if (error.response?.data?.errors) {
        const errorMessage = error.response.data.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        toast.error(errorMessage);
      } else {
        toast.error(error?.message || "Failed to update pet");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Pet Details</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaInfoCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Basic Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Pet Name *
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Age *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      {...register("age.years", {
                        required: "Years is required",
                        min: { value: 0, message: "Years must be ≥ 0" },
                      })}
                      placeholder="Years"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {errors.age?.years && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.age.years.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      {...register("age.months", {
                        required: "Months is required",
                        min: { value: 0, message: "Months must be ≥ 0" },
                        max: { value: 11, message: "Months must be ≤ 11" },
                      })}
                      placeholder="Months"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {errors.age?.months && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.age.months.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Species */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Species *
                </label>
                <select
                  {...register("species", { required: "Species is required" })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.species ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                >
                  <option value="">Select species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </select>
                {errors.species && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.species.message}
                  </p>
                )}
              </div>

              {/* Breed */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Breed *
                </label>
                <input
                  {...register("breed", { required: "Breed is required" })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.breed ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                />
                {errors.breed && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.breed.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Gender *
                </label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Color *
                </label>
                <input
                  {...register("color", { required: "Color is required" })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.color ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                />
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.color.message}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Weight (kg) *
                </label>
                <input
                  {...register("weight", {
                    required: "Weight is required",
                    pattern: { value: /^[0-9]+kg$/, message: "Format: 12kg" },
                  })}
                  placeholder="e.g., 12kg"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.weight.message}
                  </p>
                )}
              </div>

              {/* Add Vaccination Status here */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Vaccination Status *
                </label>
                <select
                  {...register("vaccinationStatus", { required: "Required" })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.vaccinationStatus
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                >
                  <option value="">Select status</option>
                  <option value="true">Vaccinated</option>
                  <option value="false">Not Vaccinated</option>
                </select>
                {errors.vaccinationStatus && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.vaccinationStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Temperament Section */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaSmile className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Temperament
              </h3>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Calm",
                  "Energetic",
                  "Friendly",
                  "Shy",
                  "Independent",
                  "Playful",
                  "Affectionate",
                  "Gentle",
                ].map((temp) => (
                  <label
                    key={temp}
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300"
                  >
                    <input
                      type="checkbox"
                      value={temp.toLowerCase()}
                      {...register("temperament", {
                        validate: (v) => v?.length > 0 || "Select at least one",
                      })}
                      className="text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {temp}
                    </span>
                  </label>
                ))}
              </div>
              {errors.temperament && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.temperament.message}
                </p>
              )}
            </div>
          </div>

          {/* Behavior Section */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaHeartbeat className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Behavior</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Good with Kids */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Good with Kids? *
                </label>
                <div className="flex gap-4">
                  {["true", "false"].map((value) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={value}
                        {...register("goodWithKids", { required: "Required" })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-600">
                        {value === "true" ? "Yes" : "No"}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.goodWithKids && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.goodWithKids.message}
                  </p>
                )}
              </div>

              {/* Good with Pets */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Good with Other Pets? *
                </label>
                <div className="flex gap-4">
                  {["true", "false"].map((value) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={value}
                        {...register("goodWithPets", { required: "Required" })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-600">
                        {value === "true" ? "Yes" : "No"}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.goodWithPets && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.goodWithPets.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaFileAlt className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Description
              </h3>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaPaw className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Pet Photos
              </h3>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-600">
                Update Photos (2-5 required)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 bg-white">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-500">
                      Drag & drop or click to upload
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPEG, PNG (max 2MB each)
                    </span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              {photos.length > 0 && (
                <div className="text-sm text-gray-500">
                  Selected files: {photos.map((f) => f.name).join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:shadow-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
