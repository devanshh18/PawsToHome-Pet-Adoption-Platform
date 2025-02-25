import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { submitApplication } from "../features/adoptionProcess/adoptionSlice";
import LoadingSpinner from "./LoadingSpinner";

export default function AdoptionForm({ petId, onClose }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.adoption);
  const user = useSelector((state) => state.auth.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const applicationData = {
        petId,
        adopterId: user._id,
        livingArrangement: {
          homeType: data.homeType,
          hasYard: data.hasYard === "true",
          ownership: data.ownership,
        },
        householdInfo: {
          numberOfAdults: parseInt(data.numberOfAdults),
          hasChildren: data.hasChildren === "true",
        },
        petExperience: {
          hasOtherPets: data.hasOtherPets === "true",
          previousExperience: data.previousExperience,
        },
        adoptionDetails: {
          reason: data.reason,
          schedule: data.schedule,
        },
        agreementAccepted: data.agreementAccepted,
      };

      await dispatch(submitApplication(applicationData)).unwrap();
      toast.success("Application submitted successfully!");
      onClose();
    } catch (error) {
      toast.error(error || "Failed to submit application");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          Adoption Application
        </h2>
        <p className="text-gray-600">
          Please fill out all required information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
        {/* Living Arrangement Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Living Arrangement
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Home Type
            </label>
            <select
              {...register("homeType", { required: "Home type is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
            </select>
            {errors.homeType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.homeType.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Do you have a yard?
            </label>
            <select
              {...register("hasYard", { required: "This field is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {errors.hasYard && (
              <p className="mt-1 text-sm text-red-600">
                {errors.hasYard.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Housing Status
            </label>
            <select
              {...register("ownership", {
                required: "Housing status is required",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="own">Own</option>
              <option value="rent">Rent</option>
              <option value="live_with_family">Live with Family</option>
            </select>
            {errors.ownership && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ownership.message}
              </p>
            )}
          </div>
        </section>

        {/* Household Information Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Household Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Adults
            </label>
            <input
              type="number"
              {...register("numberOfAdults", {
                required: "Number of adults is required",
                min: { value: 1, message: "Must be at least 1" },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.numberOfAdults && (
              <p className="mt-1 text-sm text-red-600">
                {errors.numberOfAdults.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Do you have children?
            </label>
            <select
              {...register("hasChildren", {
                required: "This field is required",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {errors.hasChildren && (
              <p className="mt-1 text-sm text-red-600">
                {errors.hasChildren.message}
              </p>
            )}
          </div>
        </section>

        {/* Pet Experience Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Pet Experience
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Do you have other pets?
            </label>
            <select
              {...register("hasOtherPets", {
                required: "This field is required",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {errors.hasOtherPets && (
              <p className="mt-1 text-sm text-red-600">
                {errors.hasOtherPets.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Previous Pet Experience
            </label>
            <textarea
              {...register("previousExperience")}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe your experience with pets (if any)"
            />
          </div>
        </section>

        {/* Adoption Details Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Adoption Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Why do you want to adopt this pet?
            </label>
            <textarea
              {...register("reason", {
                required: "Please provide a reason for adoption",
              })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Share your reasons for wanting to adopt this pet"
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              What is your daily schedule like?
            </label>
            <textarea
              {...register("schedule", {
                required: "Schedule information is required",
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe your typical daily schedule"
            />
            {errors.schedule && (
              <p className="mt-1 text-sm text-red-600">
                {errors.schedule.message}
              </p>
            )}
          </div>
        </section>

        {/* Agreement Section */}
        <section className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register("agreementAccepted", {
                  required: "You must accept the adoption agreement",
                })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm text-gray-700">
                I agree to provide a loving home and proper care for this pet
              </label>
              {errors.agreementAccepted && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.agreementAccepted.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Update the buttons container */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Application
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}