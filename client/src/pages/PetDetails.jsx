import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetById, searchPetsByLocation } from "../features/pets/petSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  ScaleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PetDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedPet, isLoading, error } = useSelector((state) => state.pets);
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [similarPets, setSimilarPets] = useState([]);
  const [isSimilarPetsLoading, setIsSimilarPetsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchPetById(id));
    }

    window.scrollTo(0, 0);
  }, [dispatch, id]);

  useEffect(() => {
    const fetchSimilarPets = async () => {
      if (!selectedPet?.shelterId?.city) return;

      try {
        setIsSimilarPetsLoading(true);
        // Search for pets in the same city, but don't filter by species
        const response = await dispatch(
          searchPetsByLocation({
            city: selectedPet.shelterId.city,
            state: selectedPet.shelterId.state,
            // Removed species filter to show all species
          })
        ).unwrap();

        // Filter out the current pet
        const filteredPets = response.filter(
          (pet) => pet._id !== selectedPet._id
        );

        // Shuffle the pets array for random display
        const shuffledPets = [...filteredPets].sort(() => Math.random() - 0.5);

        // Limit to 10 pets
        setSimilarPets(shuffledPets.slice(0, 10));
      } catch (error) {
        console.error("Error fetching similar pets:", error);
      } finally {
        setIsSimilarPetsLoading(false);
      }
    };

    if (selectedPet) {
      fetchSimilarPets();
    }
  }, [selectedPet, dispatch]);

  // Add these scroll functions
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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    fade: true,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md">
          <div className="text-red-600 text-xl mb-2">Error</div>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate("/pets")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Browse Other Pets
          </button>
        </div>
      </div>
    );

  if (!selectedPet)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-gray-50 rounded-xl max-w-md">
          <div className="text-gray-600 text-xl mb-2">Pet Not Found</div>
          <p className="text-gray-500">This pet may no longer be available</p>
          <button
            onClick={() => navigate("/pets")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Browse Available Pets
          </button>
        </div>
      </div>
    );

  const shareOptions = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${
        window.location.href
      }&quote=${encodeURIComponent(
        `Meet ${selectedPet.name}, an adorable ${selectedPet.breed} looking for a loving home! #ChooseToAdopt #AdoptDontShop #PawsToHome`
      )}`,
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${
        window.location.href
      }&text=${encodeURIComponent(
        `Meet ${selectedPet.name}, an adorable ${selectedPet.breed} looking for a loving home! #ChooseToAdopt #AdoptDontShop #PawsToHome`
      )}`,
    },
    {
      name: "Instagram",
      url: `https://www.instagram.com/`,
      customHandler: (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(
          `Meet ${selectedPet.name}, an adorable ${selectedPet.breed} looking for a loving home! #ChooseToAdopt #AdoptDontShop #PawsToHome ${window.location.href}`
        );
        alert(
          `Message copied! Open Instagram and paste in your story or DM to share ${selectedPet.name}'s profile.`
        );
        setShowShareOptions(false);
      },
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(
        `Meet ${selectedPet.name}, an adorable ${selectedPet.breed} looking for a loving home! #ChooseToAdopt #AdoptDontShop #PawsToHome ${window.location.href}`
      )}`,
    },
    {
      name: "Email",
      url: `mailto:?subject=Meet ${selectedPet.name}, an adorable ${
        selectedPet.breed
      }!&body=${encodeURIComponent(
        `Hello,\n\nI thought you might like to meet ${selectedPet.name}, an adorable ${selectedPet.breed} looking for a loving home!\n\nCheck out their profile: ${window.location.href}\n\n#ChooseToAdopt #AdoptDontShop #PawsToHome\n`
      )}`,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="absolute top-25 left-6 z-40">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="hidden md:inline">Back</span>
        </button>
      </div>

      {/* Hero Section with Image Gallery */}
      <div className="relative h-[60vh] md:h-[80vh] bg-gradient-to-b from-gray-900 to-gray-800">
        <Slider ref={sliderRef} {...settings} className="h-full">
          {selectedPet.photos.map((photo, index) => (
            <div
              key={index}
              className="h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800"
            >
              <img
                src={photo}
                alt={`${selectedPet.name} - ${index + 1}`}
                className="h-full w-full object-contain max-h-[80vh]"
                loading="lazy"
              />
            </div>
          ))}
        </Slider>

        {/* Image Navigation Controls */}
        <div className="absolute inset-x-0 bottom-10 flex justify-center items-center gap-4 z-10">
          <div className="flex gap-2">
            {selectedPet.photos.map((_, index) => (
              <button
                key={index}
                onClick={() => sliderRef.current?.slickGoTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === index ? "bg-white scale-125" : "bg-white/50"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 md:px-10 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
            onClick={() => sliderRef.current?.slickPrev()}
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
            onClick={() => sliderRef.current?.slickNext()}
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-24 pb-8 px-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {selectedPet.name}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-white/90">
                  <span>{selectedPet.breed}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  <span>{selectedPet.gender}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  <span>{selectedPet.formattedAge.split(",")[0]}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div
                  className="relative z-50 share-dropdown-container"
                  // onMouseLeave={() => setShowShareOptions(false)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShareOptions(!showShareOptions);
                    }}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none z-50"
                    aria-label="Share"
                  >
                    <ShareIcon className="w-5 h-5 text-white" />
                  </button>

                  {/* Share dropdown */}
                  {showShareOptions && (
                    <div
                      className="absolute right-0 bottom-14 bg-white rounded-lg shadow-xl overflow-hidden w-48 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {shareOptions.map((option) => (
                        <a
                          key={option.name}
                          href={option.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            if (option.name === "Email") return;
                            if (option.customHandler) {
                              option.customHandler(e);
                              return;
                            }
                            e.preventDefault();
                            window.open(
                              option.url,
                              "_blank",
                              "width=600,height=400"
                            );
                            setShowShareOptions(false);
                          }}
                        >
                          {option.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8">
            {/* Left content - Pet Details */}
            <div className="lg:col-span-2 p-6 md:p-8">
              {/* Status Badge */}
              <div className="flex justify-between items-center mb-8">
                <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {selectedPet.status}
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  <span>ID: #{selectedPet._id.substring(0, 8)}</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="px-1 py-1 -mx-1 -my-1 overflow-auto scrollbar-hide mb-8">
                <div className="flex gap-3">
                  {selectedPet.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => sliderRef.current?.slickGoTo(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                        currentSlide === index ? "ring-2 ring-blue-600" : ""
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`${selectedPet.name} - ${index + 1}`}
                        className={`w-full h-full object-cover ${
                          currentSlide === index ? "opacity-75" : "opacity-100"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  About {selectedPet.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {selectedPet.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-blue-600 mb-1.5">Species</div>
                  <div className="font-medium">{selectedPet.species}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-blue-600 mb-1.5">Breed</div>
                  <div className="font-medium">{selectedPet.breed}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-blue-600 mb-1.5">Age</div>
                  <div className="font-medium">{selectedPet.formattedAge}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-blue-600 mb-1.5">Gender</div>
                  <div className="font-medium">{selectedPet.gender}</div>
                </div>
              </div>

              {/* Additional Characteristics */}
              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800">
                  Characteristics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-4 items-center">
                    {selectedPet.goodWithKids ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-red-500" />
                    )}
                    <span className="text-gray-700">Good with kids</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    {selectedPet.goodWithPets ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-red-500" />
                    )}
                    <span className="text-gray-700">Good with other pets</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    {selectedPet.vaccinationStatus ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-red-500" />
                    )}
                    <span className="text-gray-700">Vaccinated</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <ScaleIcon className="w-6 h-6 text-blue-600" />
                    <span className="text-gray-700">{selectedPet.weight}</span>
                  </div>
                </div>
              </div>

              {/* Temperament */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Temperament
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPet.temperament.split(", ").map((temp) => (
                    <span
                      key={temp}
                      className="px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm"
                    >
                      {temp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Shelter & Adoption Info */}
            <div className="lg:border-l lg:border-gray-100">
              <div className="sticky top-6 p-6 md:p-8 space-y-8">
                {/* Shelter Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Shelter Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedPet.shelterId.shelterName}
                      </div>
                      <p className="text-gray-600 text-sm">
                        Contact Person: {selectedPet.shelterId.name}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <MapPinIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700">
                          {selectedPet.shelterId.address}
                        </p>
                        <p className="text-gray-700">
                          {selectedPet.shelterId.city},{" "}
                          {selectedPet.shelterId.state}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <a
                          href={`mailto:${selectedPet.shelterId.email}`}
                          className="flex justify-center items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-gray-700">Email</span>
                        </a>
                        <a
                          href={`tel:${selectedPet.shelterId.phoneNo}`}
                          className="flex justify-center items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-gray-700">Call</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adoption Process */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Adoption Process
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-blue-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Submit Application
                        </h4>
                        <p className="text-sm text-gray-600">
                          Fill out the adoption form
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-blue-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Application Review
                        </h4>
                        <p className="text-sm text-gray-600">
                          The shelter reviews your application{" "}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-blue-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Meet and Greet
                        </h4>
                        <p className="text-sm text-gray-600">
                          Schedule a time to meet {selectedPet.name} in person
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-blue-600">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Take Me Home
                        </h4>
                        <p className="text-sm text-gray-600">
                          Complete the adoption and welcome {selectedPet.name}{" "}
                          to your family
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedPet.status === "Available" && (
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={() => navigate(`/adopt/${selectedPet._id}`)}
                      className="w-full px-6 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Apply to Adopt
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `tel:${selectedPet.shelterId.phoneNo}`)
                      }
                      className="flex items-center justify-center w-full px-6 py-3.5 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      <PhoneIcon className="w-5 h-5 mr-2" />
                      Call About {selectedPet.name}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Pets Section - Optional */}
        <div className="my-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              You May Also Like
            </h2>
            <p className="text-gray-600">
              Meet other pets from {selectedPet.shelterId.city} that might be a
              good match
            </p>
          </div>

          {isSimilarPetsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : similarPets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No similar pets found in this area.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Navigation buttons (only shown on larger screens) */}
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
                {similarPets.map((pet) => (
                  <div
                    key={pet._id}
                    className="flex-none w-64 md:w-72 snap-start"
                    onClick={() => (window.location.href = `/pet/${pet._id}`)}
                  >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer h-full hover:shadow-lg transition-all">
                      <div className="h-48 relative overflow-hidden">
                        <img
                          src={pet.photos[0]}
                          alt={pet.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <p className="text-white font-medium truncate">
                            {pet.name}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-gray-600 text-sm">{pet.breed}</p>
                            <p className="text-gray-500 text-sm mt-1">
                              {pet.gender} • {pet.formattedAge.split(",")[0]}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {pet.status}
                          </span>
                        </div>

                        <button className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
