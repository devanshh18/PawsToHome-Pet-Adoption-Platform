import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { fetchPetById } from "../../features/pets/petSlice";
import { submitApplication } from "../../features/adoptionProcess/adoptionSlice";
import LoadingSpinner from "../shared/LoadingSpinner";
import {
  FaHome,
  FaUsers,
  FaPaw,
  FaClipboardList,
  FaArrowLeft,
  FaCheckCircle,
  FaLongArrowAltRight,
  FaHeart,
  FaInfoCircle,
} from "react-icons/fa";

export default function AdoptionApplicationPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedPet,
    isLoading: petLoading,
    error: petError,
  } = useSelector((state) => state.pets);
  const { isLoading: formLoading } = useSelector((state) => state.adoption);
  const user = useSelector((state) => state.auth.user);
  const [activeSection, setActiveSection] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm();

  const formValues = watch();

  useEffect(() => {
    if (petId) {
      dispatch(fetchPetById(petId));
    }
  }, [dispatch, petId]);

  const validateSection = async (sectionIndex) => {
    let isValid = false;

    switch (sectionIndex) {
      case 0: // Living Arrangement
        isValid = await trigger(["homeType", "hasYard", "ownership"]);
        break;
      case 1: // Household Info
        isValid = await trigger(["numberOfAdults", "hasChildren"]);
        break;
      case 2: // Pet Experience
        isValid = await trigger(["hasOtherPets"]);
        break;
      case 3: // Adoption Details
        isValid = await trigger(["reason", "schedule", "agreementAccepted"]);
        break;
      default:
        return false;
    }

    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateSection(activeSection);
    if (!isValid) return;

    if (activeSection < 3) {
      setActiveSection(activeSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      window.scrollTo(0, 0);
    }
  };

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
      navigate(`/pet/${petId}`);
    } catch (error) {
      toast.error(error || "Failed to submit application");
    }
  };

  if (petLoading || formLoading) return <LoadingSpinner />;
  if (petError)
    return <div className="text-red-600 text-center">{petError}</div>;
  if (!selectedPet) return <div className="text-center">Pet not found</div>;

  const sections = [
    {
      name: "Living Arrangement",
      icon: FaHome,
    },
    {
      name: "Household Info",
      icon: FaUsers,
    },
    {
      name: "Pet Experience",
      icon: FaPaw,
    },
    {
      name: "Adoption Details",
      icon: FaClipboardList,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation header */}
      <div className="bg-blue-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white  transition-colors"
          >
            <FaArrowLeft size={14} /> Back to pet details
          </button>
          <div className="ml-auto text-sm text-white">
            {user?.name} • Applying to adopt
          </div>
        </div>
      </div>

      {/* Main content - Side by side layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Pet info and process overview */}
          <div className="w-full lg:w-1/3 space-y-8">
            {/* Pet info banner */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="h-[250px] relative bg-gradient-to-br from-blue-100 to-indigo-50">
                {selectedPet.photos && selectedPet.photos.length > 0 && (
                  <img
                    src={selectedPet.photos[0]}
                    alt={selectedPet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <FaHeart className="text-rose-500" />
                    <span>Adopt {selectedPet.name}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedPet.name}
                </h1>
                <p className="text-gray-600 mb-4">
                  {selectedPet.breed} • {selectedPet.formattedAge} •{" "}
                  {selectedPet.shelterId.shelterName}
                </p>
              </div>
            </div>

            {/* Adoption Process Steps */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-blue-600" />
                Adoption Process
              </h2>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Complete Application</p>
                    <p className="text-sm text-gray-500">
                      Fill out all required information
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Application Review</p>
                    <p className="text-sm text-gray-500">
                      The shelter reviews your application
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Meet and Greet</p>
                    <p className="text-sm text-gray-500">
                      Visit the shelter to meet {selectedPet.name}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Adoption Finalization</p>
                    <p className="text-sm text-gray-500">
                      Complete paperwork and take {selectedPet.name} home
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Application Tips Card - Only visible on larger screens */}
            <div className="hidden lg:block bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">
                Tips for Success
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Be thorough and honest in your responses</li>
                <li>• Include details about your living situation</li>
                <li>
                  • Explain why you're a good match for {selectedPet.name}
                </li>
                <li>• Show your understanding of pet care requirements</li>
              </ul>
            </div>
          </div>

          {/* Right column - Application form */}
          <div className="w-full lg:w-2/3">
            {/* Form section with current step indicator */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b px-6 py-4">
                <h1 className="text-xl font-bold text-gray-800">
                  Adoption Application
                </h1>
                <p className="text-sm text-gray-500">
                  Complete all sections below to apply. Fields marked with * are
                  required.
                </p>
              </div>

              {/* Progress tracker */}
              <div className=" px-6 py-4">
                <div className="flex justify-between items-center relative">
                  {sections.map((section, index) => {
                    const isActive = index === activeSection;
                    const isCompleted = index < activeSection;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                            ${
                              isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : isCompleted
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                        >
                          {isCompleted ? (
                            <FaCheckCircle className="w-5 h-5" />
                          ) : (
                            <section.icon className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium whitespace-nowrap
                          ${
                            isActive
                              ? "text-blue-700"
                              : isCompleted
                              ? "text-blue-700"
                              : "text-gray-500"
                          }`}
                        >
                          {section.name}
                        </span>
                      </div>
                    );
                  })}

                  {/* Progress lines */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{
                        width: `${
                          (activeSection / (sections.length - 1)) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6">
                  {/* Living Arrangement Section */}
                  {activeSection === 0 && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                          <FaHome className="text-blue-600" />
                          Living Arrangement
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Tell us about where you live
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Home Type <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { value: "house", label: "House" },
                              { value: "apartment", label: "Apartment" },
                              { value: "condo", label: "Condo" },
                            ].map((option) => (
                              <label
                                key={option.value}
                                className={`
                                  border rounded-xl p-4 flex flex-col items-center cursor-pointer transition
                                  ${
                                    formValues.homeType === option.value
                                      ? "border-blue-500 bg-blue-50 shadow-sm"
                                      : "border-gray-200 hover:border-blue-300"
                                  }
                                `}
                              >
                                <input
                                  type="radio"
                                  value={option.value}
                                  {...register("homeType", {
                                    required: "Home type is required",
                                  })}
                                  className="sr-only"
                                />
                                <span className="text-gray-800 font-medium">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                          {errors.homeType && (
                            <p className="mt-2 text-red-600 text-sm">
                              {errors.homeType.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Do you have a yard?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { value: "true", label: "Yes" },
                              { value: "false", label: "No" },
                            ].map((option) => (
                              <label
                                key={option.value}
                                className={`
                                  border rounded-xl p-4 flex flex-col items-center cursor-pointer transition
                                  ${
                                    formValues.hasYard === option.value
                                      ? "border-blue-500 bg-blue-50 shadow-sm"
                                      : "border-gray-200 hover:border-blue-300"
                                  }
                                `}
                              >
                                <input
                                  type="radio"
                                  value={option.value}
                                  {...register("hasYard", {
                                    required: "Please select yes or no",
                                  })}
                                  className="sr-only"
                                />
                                <span className="text-gray-800 font-medium">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                          {errors.hasYard && (
                            <p className="mt-2 text-red-600 text-sm">
                              {errors.hasYard.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Housing Status{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { value: "own", label: "Own" },
                              { value: "rent", label: "Rent" },
                              {
                                value: "live_with_family",
                                label: "Live with Family",
                              },
                            ].map((option) => (
                              <label
                                key={option.value}
                                className={`
                                  border rounded-xl p-4 flex flex-col items-center cursor-pointer transition
                                  ${
                                    formValues.ownership === option.value
                                      ? "border-blue-500 bg-blue-50 shadow-sm"
                                      : "border-gray-200 hover:border-blue-300"
                                  }
                                `}
                              >
                                <input
                                  type="radio"
                                  value={option.value}
                                  {...register("ownership", {
                                    required: "Housing status is required",
                                  })}
                                  className="sr-only"
                                />
                                <span className="text-gray-800 font-medium">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                          {errors.ownership && (
                            <p className="mt-2 text-red-600 text-sm">
                              {errors.ownership.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Household Information Section */}
                  {activeSection === 1 && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                          <FaUsers className="text-blue-600" />
                          Household Information
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Tell us about the people in your home
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Number of Adults{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full md:w-1/3">
                            <input
                              type="number"
                              min="1"
                              {...register("numberOfAdults", {
                                required: "Number of adults is required",
                                min: {
                                  value: 1,
                                  message: "Must be at least 1",
                                },
                              })}
                              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                            />
                          </div>
                          {errors.numberOfAdults && (
                            <p className="mt-2 text-red-600 text-sm">
                              {errors.numberOfAdults.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Do you have children?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-4 md:w-2/3">
                            {[
                              { value: "true", label: "Yes" },
                              { value: "false", label: "No" },
                            ].map((option) => (
                              <label
                                key={option.value}
                                className={`
                                  border rounded-xl p-4 flex flex-col items-center cursor-pointer transition
                                  ${
                                    formValues.hasChildren === option.value
                                      ? "border-blue-500 bg-blue-50 shadow-sm"
                                      : "border-gray-200 hover:border-blue-300"
                                  }
                                `}
                              >
                                <input
                                  type="radio"
                                  value={option.value}
                                  {...register("hasChildren", {
                                    required: "Please select yes or no",
                                  })}
                                  className="sr-only"
                                />
                                <span className="text-gray-800 font-medium">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                          {errors.hasChildren && (
                            <p className="mt-2 text-red-600 text-sm">
                              {errors.hasChildren.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pet Experience Section */}
                  {activeSection === 2 && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                          <FaPaw className="text-blue-600" />
                          Pet Experience
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Tell us about your experience with pets
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Do you have other pets?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-4 md:w-2/3">
                            {[
                              { value: "true", label: "Yes" },
                              { value: "false", label: "No" },
                            ].map((option) => (
                              <label
                                key={option.value}
                                className={`
                                  border rounded-xl p-4 flex flex-col items-center cursor-pointer transition
                                  ${
                                    formValues.hasOtherPets === option.value
                                      ? "border-blue-500 bg-blue-50 shadow-sm"
                                      : "border-gray-200 hover:border-blue-300"
                                  }
                                `}
                              >
                                <input
                                  type="radio"
                                  value={option.value}
                                  {...register("hasOtherPets", {
                                    required: "Please select yes or no",
                                  })}
                                  className="sr-only"
                                />
                                <span className="text-gray-800 font-medium">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                          {errors.hasOtherPets && (
                            <p className="mt-2 text-red-600 text-sm">
                              {errors.hasOtherPets.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Previous Pet Experience
                          </label>
                          <textarea
                            {...register("previousExperience")}
                            rows={4}
                            disabled={formValues.hasOtherPets === "false"}
                            className={`w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 
      ${
        formValues.hasOtherPets === "false" ? "bg-gray-100 text-gray-500" : ""
      }`}
                            placeholder={
                              formValues.hasOtherPets === "false"
                                ? "Select 'Yes' above to share your pet experience"
                                : "Tell us about your past experience with pets"
                            }
                          />
                          <p className="mt-1 text-gray-500 text-sm">
                            {formValues.hasOtherPets === "false"
                              ? "This field is disabled because you selected 'No' above"
                              : "This field is optional"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Adoption Details Section */}
                  {activeSection === 3 && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                          <FaClipboardList className="text-blue-600" />
                          Adoption Details
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Tell us why you want to adopt {selectedPet.name}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Why do you want to adopt {selectedPet.name}?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            {...register("reason", {
                              required:
                                "Please tell us why you want to adopt this pet",
                            })}
                            rows={4}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                            placeholder="Share your reasons for wanting to adopt this pet"
                          />
                          {errors.reason && (
                            <p className="mt-2 text-red-600 text-sm">
                              {errors.reason.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            What is your daily schedule like?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            {...register("schedule", {
                              required: "Please describe your daily schedule",
                            })}
                            rows={3}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                            placeholder="Describe your typical daily schedule"
                          />
                          {errors.schedule && (
                            <p className="mt-2 text-red-600 text-sm">
                              {errors.schedule.message}
                            </p>
                          )}
                        </div>

                        <div className="pt-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                {...register("agreementAccepted", {
                                  required:
                                    "You must accept the adoption agreement",
                                })}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                            <div className="ml-3">
                              <label className="text-gray-700">
                                I agree to provide a loving home and proper care
                                for {selectedPet.name}
                                <span className="text-red-500"> *</span>
                              </label>
                              {errors.agreementAccepted && (
                                <p className="mt-1 text-red-600 text-sm">
                                  {errors.agreementAccepted.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Navigation and Submit */}
                <div className="p-6 bg-gray-50 flex flex-col md:flex-row justify-between items-center">
                  <div>
                    {activeSection > 0 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 font-medium flex items-center gap-2"
                      >
                        <FaArrowLeft size={14} /> Back
                      </button>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 w-full md:w-auto">
                    {activeSection < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors text-white font-medium flex items-center gap-2 justify-center"
                      >
                        Continue <FaLongArrowAltRight />
                      </button>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/pet/${petId}`)}
                          className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors text-white font-medium flex items-center gap-2 justify-center"
                        >
                          <FaCheckCircle /> Submit Application
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
