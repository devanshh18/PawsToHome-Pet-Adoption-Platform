import { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchPetsByLocation } from "../features/pets/petSlice";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";
import { indianCities, indianStates } from "../utils/location";
import { useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaPaw,
  FaChild,
  FaSyringe,
  FaInfoCircle,
  FaHeartbeat,
  FaFileAlt,
} from "react-icons/fa";

export default function PetSearch() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults, isLoading, error } = useSelector(
    (state) => state.pets
  );

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
  // const [filters, setFilters] = useState({
  //   gender: searchParams.get("gender") || "",
  //   species: searchParams.get("species") || "Dog",
  //   ageRange: searchParams.get("ageRange") || "",
  //   goodWithKids: "",
  //   goodWithPets: "",
  //   vaccinationStatus: "",
  // });
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

  // Add this effect for automatic search
  // useEffect(() => {
  //   if (selectedLocation) {
  //     // Only trigger automatic search for location and species changes
  //     handleMainSearch();
  //   }
  // }, [selectedLocation, filters.species]); // Only depend on location and species

  // const handleMainSearch = useCallback(async () => {
  //   if (!selectedLocation) return;

  //   try {
  //     const newSearchParams = new URLSearchParams();
  //     newSearchParams.set("city", selectedLocation.city);
  //     newSearchParams.set("state", selectedLocation.state);
  //     newSearchParams.set("species", filters.species); // Only include main filters

  //     window.history.replaceState(
  //       {},
  //       "",
  //       `${window.location.pathname}?${newSearchParams}`
  //     );

  //     await dispatch(
  //       searchPetsByLocation({
  //         city: selectedLocation.city,
  //         state: selectedLocation.state,
  //         species: filters.species,
  //       })
  //     ).unwrap();
  //     setHasSearched(true);
  //   } catch (error) {
  //     toast.error(error || "Failed to search pets");
  //   }
  // }, [selectedLocation, filters.species, dispatch]);

  const handleSearch = useCallback(async (isMainSearch = false) => {
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
  
      window.history.replaceState({}, "", `${window.location.pathname}?${newSearchParams}`);
  
      // For API call, always include all non-empty filters
      const apiFilters = {
        city: selectedLocation.city,
        state: selectedLocation.state,
        species: filters.species,
        ...(filters.gender.length > 0 && { gender: filters.gender }),
        ...(filters.ageRange.length > 0 && { ageRange: filters.ageRange }),
        ...(filters.goodWithKids === "true" && { goodWithKids: "true" }),
        ...(filters.goodWithPets === "true" && { goodWithPets: "true" }),
        ...(filters.vaccinationStatus === "true" && { vaccinationStatus: "true" })
      };
  
      await dispatch(searchPetsByLocation(apiFilters)).unwrap();
      setHasSearched(true);
    } catch (error) {
      toast.error(error || "Failed to search pets");
    }
  }, [selectedLocation, filters, dispatch]);
  
  // Update automatic search effect
  useEffect(() => {
    if (selectedLocation) {
      handleSearch(true); // Pass true for main search
    }
  }, [selectedLocation, filters.species]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16 px-4">
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
          <div className="lg:w-80 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FaInfoCircle className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">
                      Basic Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {/* Age Range */}
                    <div>
                      <label className="text-sm text-gray-600">Age</label>
                      <div className="space-y-2 mt-1">
                        {["baby", "young", "adult", "senior"].map((age) => (
                          <label key={age} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="ageRange"
                              value={age}
                              checked={filters.ageRange.includes(age)}
                              onChange={handleFilterChange}
                              className="text-blue-600 rounded"
                            />
                            <span className="text-sm capitalize">{age}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="text-sm text-gray-600">Gender</label>
                      <div className="space-y-2 mt-1">
                        {["Male", "Female"].map((gender) => (
                          <label
                            key={gender}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              name="gender"
                              value={gender}
                              checked={filters.gender.includes(gender)}
                              onChange={handleFilterChange}
                              className="text-blue-600 rounded"
                            />
                            <span className="text-sm">{gender}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Behavior Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FaHeartbeat className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">
                      Behavior & Health
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Good with</label>
                      <div className="space-y-2 mt-1">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="goodWithKids"
                            value="true"
                            checked={filters.goodWithKids === "true"}
                            onChange={handleFilterChange}
                            className="text-blue-600 rounded"
                          />
                          <span className="text-sm">Kids</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="goodWithPets"
                            value="true"
                            checked={filters.goodWithPets === "true"}
                            onChange={handleFilterChange}
                            className="text-blue-600 rounded"
                          />
                          <span className="text-sm">Other Pets</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Health</label>
                      <div className="space-y-2 mt-1">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="vaccinationStatus"
                            value="true"
                            checked={filters.vaccinationStatus === "true"}
                            onChange={handleFilterChange}
                            className="text-blue-600 rounded"
                          />
                          <span className="text-sm">Vaccinated</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={handleSearch}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults?.map((pet) => (
                  <Link
                    key={pet._id}
                    to={`/pet/${pet._id}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={pet.photos[0]}
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40" />
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {pet.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPaw className="text-blue-600" />
                        <span>{pet.breed}</span>
                        <span>•</span>
                        <span>{pet.formattedAge}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaChild
                          className={`${
                            pet.goodWithKids ? "text-green-600" : "text-red-600"
                          }`}
                        />
                        <FaSyringe
                          className={`${
                            pet.vaccinationStatus
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pet.temperament?.split(", ").map((temp) => (
                          <span
                            key={temp}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full capitalize"
                          >
                            {temp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="mb-4 text-6xl">🐾</div>
                  <h3 className="text-xl font-semibold text-gray-800">
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
