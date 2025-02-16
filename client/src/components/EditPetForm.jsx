/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit Pet Details</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Years
                </label>
                <input
                  type="number"
                  {...register("age.years", {
                    required: "Years is required",
                    min: {
                      value: 0,
                      message: "Years must be a positive number",
                    },
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.age?.years && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.age.years.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Months
                </label>
                <input
                  type="number"
                  {...register("age.months", {
                    required: "Months is required",
                    min: { value: 0, message: "Months must be 0 or greater" },
                    max: { value: 11, message: "Months must be less than 12" },
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.age?.months && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.age.months.message}
                  </p>
                )}
              </div>
            </div>

            {/* Species */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Species
              </label>
              <select
                {...register("species", { required: "Species is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
              {errors.species && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.species.message}
                </p>
              )}
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Breed
              </label>
              <input
                type="text"
                {...register("breed", { required: "Breed is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.breed && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.breed.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                {...register("color", { required: "Color is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.color && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.color.message}
                </p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="text"
                {...register("weight", {
                  required: "Weight is required",
                  pattern: {
                    value: /^[0-9]+kg$/,
                    message: "Weight must be in format: 12kg",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., 12 kg"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.weight.message}
                </p>
              )}
            </div>

            {/* Temperament */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperament
              </label>
              <div className="grid grid-cols-2 gap-4">
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
                  <div key={temp} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("temperament", {
                        validate: (value) =>
                          (value && value.length > 0) ||
                          "Select at least one temperament",
                      })}
                      value={temp.toLowerCase()}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">{temp}</label>
                  </div>
                ))}
              </div>
              {errors.temperament && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.temperament.message}
                </p>
              )}
            </div>

            {/* Good with Kids */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Good with Kids?
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("goodWithKids", {
                      required: "Please select an option",
                    })}
                    value="true"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("goodWithKids")}
                    value="false"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {/* Good with Other Pets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Good with Other Pets?
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("goodWithPets", {
                      required: "Please select an option",
                    })}
                    value="true"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("goodWithPets")}
                    value="false"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {/* Vaccination Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vaccination Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("vaccinationStatus", {
                      required: "Please select vaccination status",
                    })}
                    value="true"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">Vaccinated</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("vaccinationStatus")}
                    value="false"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">Not Vaccinated</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Photos */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Update Photos (optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-1 block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload 2-5 photos (max 2MB each)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}