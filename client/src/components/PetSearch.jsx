import { useState, useMemo, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { searchPetsByLocation } from "../features/pets/petSlice";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";
import { indianCities, indianStates } from "../utils/location";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaPaw,
  FaChild,
  FaSyringe,
  FaInfoCircle,
  FaHeart,
  FaDog,
  FaVenusMars,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function PetSearch() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults, isLoading, error } = useSelector(
    (state) => state.pets
  );
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 21;
  const [displayedPets, setDisplayedPets] = useState([]);
  const [totalPets, setTotalPets] = useState(0);

  // Get city from URL params
  const cityFromUrl = searchParams.get("city");

  // Declare searchTerm state first
  const [searchTerm, setSearchTerm] = useState(
    cityFromUrl ? `${cityFromUrl}, ${searchParams.get("state") || ""}` : ""
  );

  // Then declare other states that depend on it
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(
    cityFromUrl
      ? {
          city: cityFromUrl,
          state: searchParams.get("state") || "",
          label: `${cityFromUrl}, ${searchParams.get("state") || ""}`,
        }
      : null
  );

  // Initialize filters with URL params
  const [filters, setFilters] = useState({
    species: searchParams.get("species") || "Dog",
    gender: searchParams.get("gender")?.split(",") || [],
    ageRange: searchParams.get("ageRange")?.split(",") || [],
    goodWithKids: searchParams.get("goodWithKids") || "",
    goodWithPets: searchParams.get("goodWithPets") || "",
    vaccinationStatus: searchParams.get("vaccinationStatus") || "",
  });

  // Create array of all valid location combinations
  const locationOptions = useMemo(() => {
    const options = [];
    indianStates.forEach((state) => {
      indianCities[state].forEach((city) => {
        options.push({
          label: `${city}, ${state}`,
          city,
          state,
        });
      });
    });
    return options;
  }, []);

  // Filter locations based on search term
  const filteredLocations = useMemo(() => {
    return locationOptions.filter((location) =>
      location.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, locationOptions]);

  const handleLocationSelect = (location) => {
    // Update the selected location and search term
    setSelectedLocation(location);
    setSearchTerm(location.label);

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("city", location.city);
    newSearchParams.set("state", location.state);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${newSearchParams}`
    );
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "gender" || name === "ageRange") {
      setFilters((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (checked ? value : "") : value,
      }));
    }
  };

  // Add this function to handle pagination logic
  const paginatePets = useCallback(
    (results) => {
      setTotalPets(results.length);
      const indexOfLastPet = currentPage * petsPerPage;
      const indexOfFirstPet = indexOfLastPet - petsPerPage;
      return results.slice(indexOfFirstPet, indexOfLastPet);
    },
    [currentPage, petsPerPage]
  );

  const handleSearch = useCallback(
    async (isMainSearch = false) => {
      if (!selectedLocation) return;

      try {
        const newSearchParams = new URLSearchParams();

        // Always include main search params
        newSearchParams.set("city", selectedLocation.city);
        newSearchParams.set("state", selectedLocation.state);
        newSearchParams.set("species", filters.species);

        // Handle all other filters regardless of search type
        if (filters.gender.length > 0) {
          newSearchParams.set("gender", filters.gender.join(","));
        }
        if (filters.ageRange.length > 0) {
          newSearchParams.set("ageRange", filters.ageRange.join(","));
        }
        if (filters.goodWithKids === "true") {
          newSearchParams.set("goodWithKids", "true");
        }
        if (filters.goodWithPets === "true") {
          newSearchParams.set("goodWithPets", "true");
        }
        if (filters.vaccinationStatus === "true") {
          newSearchParams.set("vaccinationStatus", "true");
        }

        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${newSearchParams}`
        );

        // For API call, always include all non-empty filters
        const apiFilters = {
          city: selectedLocation.city,
          state: selectedLocation.state,
          species: filters.species,
          ...(filters.gender.length > 0 && { gender: filters.gender }),
          ...(filters.ageRange.length > 0 && { ageRange: filters.ageRange }),
          ...(filters.goodWithKids === "true" && { goodWithKids: "true" }),
          ...(filters.goodWithPets === "true" && { goodWithPets: "true" }),
          ...(filters.vaccinationStatus === "true" && {
            vaccinationStatus: "true",
          }),
        };

        await dispatch(searchPetsByLocation(apiFilters)).unwrap();
        setHasSearched(true);

        const response = await dispatch(
          searchPetsByLocation(apiFilters)
        ).unwrap();
        setDisplayedPets(paginatePets(response));
        setHasSearched(true);
        setCurrentPage(1); // Reset to first page on new search
      } catch (error) {
        toast.error(error || "Failed to search pets");
      }
    },
    [selectedLocation, filters, dispatch]
  );

  // Add this function to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setDisplayedPets(paginatePets(searchResults));
  };

  // Add this function to generate page numbers
  const getPageNumbers = () => {
    const totalPages = Math.ceil(totalPets / petsPerPage);
    const current = currentPage;
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Update automatic search effect
  useEffect(() => {
    if (selectedLocation) {
      handleSearch(true); // Pass true for main search
    }
  }, [selectedLocation, filters.species]);

  useEffect(() => {
    if (searchResults) {
      setDisplayedPets(paginatePets(searchResults));
    }
  }, [currentPage, searchResults, paginatePets]);

  return (
    <div className="min-h-screen">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Find Your Perfect Pet
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Search through thousands of pets waiting for their forever home
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full shadow-lg">
              <FaSearch className="absolute left-6 text-gray-400 text-xl" />

              {/* Pet Type Dropdown */}
              <div className="relative w-1/3">
                <select
                  name="species"
                  value={filters.species}
                  onChange={handleFilterChange}
                  className="w-full pl-14 pr-6 py-4 bg-transparent outline-none text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="w-px h-8 bg-gray-200" />

              {/* Location Search */}
              <div className="relative flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedLocation(null);
                    }}
                    placeholder="Location"
                    className="w-full px-6 py-4 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  </div>
                </div>

                {/* Location Dropdown */}
                {searchTerm && !selectedLocation && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl max-h-60 overflow-auto z-50">
                    {filteredLocations.map((location, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleLocationSelect(location)}
                        className="w-full px-6 py-3 text-left hover:bg-gray-50 border-b last:border-0 text-gray-900"
                      >
                        {location.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Filters
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Refine your search
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setFilters({
                        species: "Dog",
                        gender: [],
                        ageRange: [],
                        goodWithKids: "",
                        goodWithPets: "",
                        vaccinationStatus: "",
                      })
                    }
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset all
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Age Range */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaInfoCircle className="text-blue-600" />
                      <label className="font-medium text-gray-700">Age</label>
                    </div>
                    <span className="text-xs text-gray-500">
                      {filters.ageRange.length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["baby", "young", "adult", "senior"].map((age) => (
                      <label
                        key={age}
                        className={`flex items-center justify-center px-4 py-3 rounded-xl cursor-pointer transition-all
                ${
                  filters.ageRange.includes(age)
                    ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
                      >
                        <input
                          type="checkbox"
                          name="ageRange"
                          value={age}
                          checked={filters.ageRange.includes(age)}
                          onChange={handleFilterChange}
                          className="hidden"
                        />
                        <span className="text-sm capitalize font-medium">
                          {age}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender - Keeping as is */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaVenusMars className="text-blue-600" />
                      <label className="font-medium text-gray-700">
                        Gender
                      </label>
                    </div>
                    <span className="text-xs text-gray-500">
                      {filters.gender.length} selected
                    </span>
                  </div>
                  <div className="flex gap-4">
                    {["Male", "Female"].map((gender) => (
                      <label
                        key={gender}
                        className={`flex-1 flex items-center justify-center px-4 py-3.5 rounded-xl cursor-pointer transition-all
                ${
                  filters.gender.includes(gender)
                    ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
                      >
                        <input
                          type="checkbox"
                          name="gender"
                          value={gender}
                          checked={filters.gender.includes(gender)}
                          onChange={handleFilterChange}
                          className="hidden"
                        />
                        <span className="text-sm font-medium">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Behaviour & Health */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FaHeart className="text-blue-600" />
                    <label className="font-medium text-gray-700">
                      Behaviour & Health
                    </label>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        name: "goodWithKids",
                        label: "Good with Kids",
                        icon: <FaChild className="text-lg" />,
                      },
                      {
                        name: "goodWithPets",
                        label: "Good with Pets",
                        icon: <FaDog className="text-lg" />,
                      },
                      {
                        name: "vaccinationStatus",
                        label: "Vaccinated",
                        icon: <FaSyringe className="text-lg" />,
                      },
                    ].map((option) => (
                      <label
                        key={option.name}
                        className={`flex items-center justify-between w-full px-5 py-4 rounded-xl cursor-pointer transition-all
                ${
                  filters[option.name] === "true"
                    ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
                      >
                        <div className="flex items-center gap-3">
                          {option.icon}
                          <span className="text-sm font-medium">
                            {option.label}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          name={option.name}
                          value="true"
                          checked={filters[option.name] === "true"}
                          onChange={handleFilterChange}
                          className="w-4 h-4 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="p-6 pt-2">
                <button
                  onClick={handleSearch}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 
          transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
          {/* Results Section */}
          <div className="flex-1">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
                {error}
              </div>
            ) : hasSearched ? (
              <>
                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-gray-600">
                    Showing{" "}
                    {Math.min((currentPage - 1) * petsPerPage + 1, totalPets)} -{" "}
                    {Math.min(currentPage * petsPerPage, totalPets)} of{" "}
                    {totalPets} available pets
                  </div>
                </div>
                {/* Pet Grid */}
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {displayedPets?.map((pet) => (
                    <Link
                      key={pet._id}
                      to={`/pet/${pet._id}`}
                      className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* Image Container */}
                      <div className="h-[280px] overflow-hidden">
                        <img
                          src={pet.photos[0]}
                          alt={pet.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>

                      {/* Content Container */}
                      <div className="p-4 flex-1">
                        {/* Pet Name */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 font-display">
                          {pet.name}
                        </h3>

                        {/* Breed */}
                        <p className="text-gray-600 text-sm mb-2">
                          {pet.breed}
                        </p>

                        {/* Details */}
                        <div className="space-y-1.5 text-sm text-gray-500">
                          {/* Gender & Age */}
                          <div className="flex flex-col">
                            <span>
                              {pet.gender}, {pet.formattedAge.split(",")[0]}
                            </span>
                            <span className="text-gray-800 font-medium">
                              {pet.formattedAge.split(",")[1].trim()}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1.5">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span>
                              {pet.shelterId.city}, {pet.shelterId.state}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
                {/* Pagination */}
                {totalPets > petsPerPage && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft className="text-gray-600" />
                    </button>

                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof page === "number" && handlePageChange(page)
                        }
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : typeof page === "number"
                            ? "hover:bg-gray-100 text-gray-600"
                            : "text-gray-400 cursor-default"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage === Math.ceil(totalPets / petsPerPage)
                      }
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight className="text-gray-600" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-25 bg-white rounded-xl shadow-sm h-full">
                <div className="max-w-md mx-auto">
                  <div className="mb-4 text-7xl">🐾</div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Start Your Pet Search
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Select location and species to find pets near you
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
