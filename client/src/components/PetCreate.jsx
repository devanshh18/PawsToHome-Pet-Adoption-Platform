import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { addNewPet } from "../features/pets/petSlice";
import LoadingSpinner from "./LoadingSpinner";

export default function PetCreate() {
  const [photos, setPhotos] = useState([]);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.pets);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (photos.length < 2 || photos.length > 5) {
        toast.error("Please select 2-5 photos");
        return;
      }

      const formData = new FormData();

      // Process the data once
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

      // Append photos
      photos.forEach((photo) => formData.append("photos", photo));

      await dispatch(addNewPet(formData)).unwrap();
      toast.success("Pet added successfully!");
      reset();
      setPhotos([]);
    } catch (error) {
      console.error("Error details:", error);
      if (error.response?.data?.errors) {
        const errorMessage = error.response.data.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        toast.error(errorMessage);
      } else {
        toast.error(error?.message || "Failed to add pet");
      }
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Add New Pet</h2>

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
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
                  min: { value: 0, message: "Years must be a positive number" },
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
              {...register("weight", { required: "Weight is required",
                pattern: {
                    value: /^[0-9]+kg$/,
                    message: "Weight must be in format: 12kg"
                }
               })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., 12kg"
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

          {/* Good with Kids/Pets */}
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
            {errors.goodWithKids && (
              <p className="mt-1 text-sm text-red-600">
                {errors.goodWithKids.message}
              </p>
            )}
          </div>

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
            {errors.goodWithPets && (
              <p className="mt-1 text-sm text-red-600">
                {errors.goodWithPets.message}
              </p>
            )}
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
            {errors.vaccinationStatus && (
              <p className="mt-1 text-sm text-red-600">
                {errors.vaccinationStatus.message}
              </p>
            )}
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
              Photos (2-5)
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

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Pet
          </button>
        </div>
      </div>
    </form>
  );
}