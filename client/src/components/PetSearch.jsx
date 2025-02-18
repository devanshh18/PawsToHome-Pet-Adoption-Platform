import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchPetsByLocation } from "../features/pets/petSlice";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";
import { indianCities, indianStates } from "../utils/location";

export default function PetSearch() {
  const dispatch = useDispatch();
  const { searchResults, isLoading, error } = useSelector(
    (state) => state.pets
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filters, setFilters] = useState({
    gender: "",
    species: "",
    ageRange: "",
    goodWithKids: "",
    goodWithPets: "",
    vaccinationStatus: "",
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

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      toast.error("Please select a location");
      return;
    }
    try {
      await dispatch(
        searchPetsByLocation({
          city: selectedLocation.city,
          state: selectedLocation.state,
          ...filters,
        })
      ).unwrap();
    } catch (error) {
      toast.error(error || "Failed to search pets");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="relative mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by location
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedLocation(null);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                     focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Type city or state..."
          />

          {/* Dropdown for filtered locations */}
          {searchTerm && !selectedLocation && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredLocations.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedLocation(location);
                    setSearchTerm(location.label);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                >
                  {location.label}
                </button>
              ))}
              {filteredLocations.length === 0 && (
                <div className="px-4 py-2 text-gray-500">
                  No locations found
                </div>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* Species Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Species
            </label>
            <select
              name="species"
              value={filters.species}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Age Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Range
            </label>
            <select
              name="ageRange"
              value={filters.ageRange}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Age</option>
              <option value="baby">Baby (0-1 year)</option>
              <option value="young">Young (1-3 years)</option>
              <option value="adult">Adult (3-8 years)</option>
              <option value="senior">Senior (8+ years)</option>
            </select>
          </div>

          {/* Good with Kids Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Good with Kids
            </label>
            <select
              name="goodWithKids"
              value={filters.goodWithKids}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Good with Pets Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Good with Pets
            </label>
            <select
              name="goodWithPets"
              value={filters.goodWithPets}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Vaccination Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vaccination Status
            </label>
            <select
              name="vaccinationStatus"
              value={filters.vaccinationStatus}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any</option>
              <option value="true">Vaccinated</option>
              <option value="false">Not Vaccinated</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full md:w-auto px-6 py-2 bg-indigo-600 text-white
                   rounded-md hover:bg-indigo-700 transition-colors"
        >
          Search Pets
        </button>
      </form>

      {/* Results Section */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults?.map((pet) => (
            <Link
              key={pet._id}
              to={`/pet/${pet._id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={pet.photos[0]}
                  alt={pet.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {pet.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {pet.breed} • {pet.formattedAge}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {pet.shelterId.city}, {pet.shelterId.state}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {pet.temperament?.split(", ").map((temp) => (
                    <span
                      key={temp}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {temp}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {!isLoading && searchResults?.length === 0 && (
        <p className="text-center text-gray-600">
          No pets found matching your criteria.
        </p>
      )}
    </div>
  );
}