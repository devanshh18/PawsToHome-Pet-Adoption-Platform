import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShelterById,
  clearSelectedShelter,
} from "../../features/shelter/shelterSlice";
import { searchPetsByLocation } from "../../features/pets/petSlice";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowLeft,
  FiCalendar,
  FiHome,
  FiFlag,
  FiFileText,
  FiCheckCircle,
  FiHeart,
} from "react-icons/fi";
import { toast } from "react-toastify";
import LoadingSpinner from "../shared/LoadingSpinner";

function ShelterDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedShelter, isLoading, error } = useSelector(
    (state) => state.shelters
  );
  const [shelterPets, setShelterPets] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchShelterById(id));
    }

    // Cleanup function to clear selected shelter when unmounting
    return () => {
      dispatch(clearSelectedShelter());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Fetch actual pets from the shelter
  useEffect(() => {
    const fetchShelterPets = async () => {
      if (selectedShelter) {
        try {
          setIsLoadingPets(true);
          // Use the searchPetsByLocation function but with shelterId parameter
          const response = await dispatch(
            searchPetsByLocation({
              city: selectedShelter.city,
              state: selectedShelter.state,
              shelterId: id, // Add this parameter to filter by shelter ID
            })
          ).unwrap();

          // Filter to only include available pets
          const availablePets = response.filter(
            (pet) => pet.status === "Available"
          );
          setShelterPets(availablePets);
        } catch (error) {
          toast.error("Failed to fetch shelter pets");
          console.error("Error fetching shelter pets:", error);
        } finally {
          setIsLoadingPets(false);
        }
      }
    };

    fetchShelterPets();
  }, [selectedShelter, dispatch, id]);

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-16 pb-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedShelter) {
    return (
      <div className="bg-gray-50 min-h-screen pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100 my-8">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Shelter not found
            </h3>
            <p className="text-gray-500 mb-6">
              The shelter you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/shelters"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiArrowLeft className="mr-2" /> Back to Shelters
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white">
                {selectedShelter.shelterName}
              </h1>
              <div className="flex items-center text-blue-100 mt-2">
                <FiMapPin className="mr-2" />
                <span>
                  {selectedShelter.city}, {selectedShelter.state}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to={`tel:${selectedShelter.phoneNo}`}
                className="inline-flex items-center px-4 py-2 bg-white rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                <FiPhone className="mr-2" /> Call Shelter
              </Link>
              <Link
                to={`mailto:${selectedShelter.email}`}
                className="inline-flex items-center px-4 py-2 bg-white rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                <FiMail className="mr-2" /> Email Shelter
              </Link>
              <Link
                to="/shelters"
                className="inline-flex items-center px-4 py-2 bg-blue-700 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-800"
              >
                <FiArrowLeft className="mr-2" /> Back to Shelters
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Shelter details */}
        <div className="md:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              About {selectedShelter.shelterName}
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                At {selectedShelter.shelterName}, we believe every pet deserves
                a loving and caring home. Our shelter is dedicated to rescuing,
                rehabilitating, and rehoming abandoned, stray, and surrendered
                animals. With a team of passionate animal lovers, we provide a
                safe environment, medical care, and socialization to ensure each
                pet is ready for their forever family.
              </p>

              <p className="font-medium flex items-center">
                <FiHeart className="mr-2 text-blue-600" /> What We Offer:
              </p>
              <ul className="list-none pl-5 space-y-1">
                <li className="flex items-center">
                  <FiCheckCircle className="mr-2 text-blue-600 flex-shrink-0" />
                  <span>Safe and comfortable temporary housing</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="mr-2 text-blue-600 flex-shrink-0" />
                  <span>
                    Veterinary care, vaccinations, and spaying/neutering
                  </span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="mr-2 text-blue-600 flex-shrink-0" />
                  <span>
                    Adoption services to match pets with the right owners
                  </span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="mr-2 text-blue-600 flex-shrink-0" />
                  <span>Community education on responsible pet ownership</span>
                </li>
              </ul>

              <p>
                Join us in making a difference—adopt, foster, or support our
                mission to give every pet a second chance at happiness!
              </p>
            </div>
          </div>

          {/* Adoption process Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiFileText className="mr-2 text-blue-600" /> Adoption Process
            </h2>
            <ol className="space-y-4 text-gray-700">
              <li className="flex items-center">
                <FiCheckCircle className="mr-2 text-blue-600 flex-shrink-0" />
                <span>
                  Browse our available pets and find a companion that matches
                  your lifestyle.
                </span>
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="mr-2 text-blue-600 flex-shrink-0" />
                <span>
                  Fill out an adoption application form and submit it to our
                  shelter.
                </span>
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="mr-2 text-blue-600 flex-shrink-0" />
                <span>
                  Meet your potential pet and interact to ensure a good match.
                </span>
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="mr-2 text-blue-600 flex-shrink-0" />
                <span>
                  Complete the adoption paperwork and welcome your new family
                  member home!
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* Right Column - Contact Info */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <FiPhone className="mt-1 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-800 font-medium">
                    {selectedShelter.phoneNo || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMail className="mt-1 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium break-all">
                    {selectedShelter.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMapPin className="mt-1 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">
                    {selectedShelter.address}
                    <br />
                    {selectedShelter.city}, {selectedShelter.state}
                  </p>
                </div>
              </div>
              {selectedShelter.website && (
                <div className="flex items-start">
                  <FiFlag className="mt-1 mr-3 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={
                        selectedShelter.website.startsWith("http")
                          ? selectedShelter.website
                          : `https://${selectedShelter.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selectedShelter.website}
                    </a>
                  </div>
                </div>
              )}
              {selectedShelter.establishedDate && (
                <div className="flex items-start">
                  <FiCalendar className="mt-1 mr-3 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Established</p>
                    <p className="text-gray-800">
                      {new Date(selectedShelter.establishedDate).getFullYear()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Get In Touch Card */}
          <div className="bg-blue-50 rounded-lg shadow-sm p-6 border border-blue-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-700 mb-4">
              Interested in adopting? Contact this shelter directly to learn
              more about their adoption process and available pets.
            </p>
            <div className="space-y-3">
              <a
                href={`tel:${selectedShelter.phoneNo}`}
                className="block w-full text-center py-2.5 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
              >
                Call Now
              </a>
              <a
                href={`mailto:${selectedShelter.email}`}
                className="block w-full text-center py-2.5 px-4 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition font-medium"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>

        {/* Shelter Pets Section */}
        <div className="md:col-span-3 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <FiHome className="mr-2 text-blue-600" /> Available Pets
              </h2>
              <p className="text-gray-600 mt-1">
                {shelterPets.length > 0
                  ? `This shelter currently has ${shelterPets.length} pets available for adoption`
                  : "This shelter currently has no pets available for adoption"}
              </p>
            </div>

            {isLoadingPets ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : shelterPets.length > 0 ? (
              <div className="relative">
                {/* Navigation buttons */}
                <div className="hidden md:block">
                  <button
                    onClick={scrollLeft}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg z-10 hover:bg-gray-50"
                    aria-label="Scroll left"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={scrollRight}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg z-10 hover:bg-gray-50"
                    aria-label="Scroll right"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Scrollable container */}
                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x"
                >
                  {shelterPets.map((pet) => (
                    <div
                      key={pet._id}
                      className="flex-none w-64 md:w-72 snap-start"
                    >
                      <Link to={`/pet/${pet._id}`}>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer h-full hover:shadow-lg transition-all">
                          <div className="h-48 relative overflow-hidden">
                            {pet.photos && pet.photos[0] ? (
                              <img
                                src={pet.photos[0]}
                                alt={pet.name}
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <FiHome className="h-10 w-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {pet.name}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <span>{pet.breed}</span>
                              <span className="mx-2">•</span>
                              <span>{pet.gender}</span>
                              <span className="mx-2">•</span>
                              <span>
                                {pet.age?.years > 0
                                  ? `${pet.age.years} yr`
                                  : `${pet.age?.months} mo`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FiHome className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500">
                  This shelter currently has no pets available for adoption.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShelterDetails;
