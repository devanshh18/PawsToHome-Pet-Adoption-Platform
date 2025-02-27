import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShelters } from "../../features/shelter/shelterSlice";
import {
  FiMapPin,
  FiSearch,
  FiX,
  FiExternalLink,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { toast } from "react-toastify";
import LoadingSpinner from "../shared/LoadingSpinner";
import { indianCities, indianStates } from "../../utils/location";

function Shelters() {
  const dispatch = useDispatch();
  const { shelters, isLoading, error, pagination } = useSelector(
    (state) => state.shelters
  );
  const [searchParams, setSearchParams] = useSearchParams();

  // Get city and state from URL params
  const cityFromUrl = searchParams.get("city");
  const stateFromUrl = searchParams.get("state");

  // Add search term state for location input
  const [searchTerm, setSearchTerm] = useState(
    cityFromUrl && stateFromUrl ? `${cityFromUrl}, ${stateFromUrl}` : ""
  );

  // Add selected location state
  const [selectedLocation, setSelectedLocation] = useState(
    cityFromUrl && stateFromUrl
      ? {
          city: cityFromUrl,
          state: stateFromUrl,
          label: `${cityFromUrl}, ${stateFromUrl}`,
        }
      : null
  );

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const [showDropdown, setShowDropdown] = useState(false);

  // Create refs for handling click outside to close dropdown
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

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
    if (!searchTerm) return [];
    return locationOptions.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, locationOptions]);

  // Load shelters when filters change
  useEffect(() => {
    // On initial mount or when filters change
    if (selectedLocation) {
      // If we have a selected location (from URL or user selection)
      const apiFilters = {
        ...filters,
        city: selectedLocation.city,
        state: selectedLocation.state,
      };
      dispatch(fetchShelters(apiFilters));
    } else if (filters.page > 1) {
      // If we're on a page other than the first
      dispatch(fetchShelters(filters));
    } else {
      // If no location selected and on page 1
      dispatch(fetchShelters({}));
    }
  }, [dispatch, selectedLocation, filters.page]);

  // Show error if any
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle location selection from dropdown
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchTerm(location.label);
    setShowDropdown(false);

    // Update URL params
    searchParams.set("city", location.city);
    searchParams.set("state", location.state);
    setSearchParams(searchParams);

    // Reset to first page when location changes
    setFilters({
      ...filters,
      page: 1,
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If user changes the selected location text, clear the selection
    if (selectedLocation && value !== selectedLocation.label) {
      setSelectedLocation(null);
    }

    // Show dropdown when typing
    setShowDropdown(value.length > 0);

    if (!value) {
      setSelectedLocation(null);
      setShowDropdown(false);

      // Clear URL params
      searchParams.delete("city");
      searchParams.delete("state");
      setSearchParams(searchParams);

      // Load all shelters when filter is cleared
      dispatch(fetchShelters({}));
    }
  };

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters({
        ...filters,
        page: newPage,
      });
      // Scroll to top when page changes
      window.scrollTo(0, 0);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
    });
    setSelectedLocation(null);
    setSearchTerm("");
    setShowDropdown(false);

    // Clear URL params
    searchParams.delete("city");
    searchParams.delete("state");
    searchParams.delete("location"); // For backward compatibility
    setSearchParams(searchParams);

    // Load all shelters when filter is cleared
    dispatch(fetchShelters({}));
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchTerm && !selectedLocation) {
      setShowDropdown(true);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Hero section with search - Styled like PetSearch */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Find Animal Shelters
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Connect with shelters in your area and discover pets waiting for
            their forever homes
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full shadow-lg">
              <FiMapPin className="absolute left-6 text-gray-400 text-xl" />

              {/* Location Search */}
              <div className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  id="location-search"
                  name="location"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleInputFocus}
                  placeholder="Search by city or state"
                  className="w-full pl-14 pr-6 py-4 bg-transparent outline-none text-gray-900 appearance-none border-none rounded-full"
                  autoComplete="off"
                />

                {/* Location Dropdown */}
                {showDropdown && !selectedLocation && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl max-h-60 overflow-auto z-50"
                  >
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleLocationSelect(location)}
                          className="w-full px-6 py-3 text-left hover:bg-gray-50 border-b last:border-0 text-gray-900"
                        >
                          {location.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-6 py-3 text-gray-500">
                        No locations found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Filter info bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            {isLoading ? (
              <p className="text-gray-500">Loading shelters...</p>
            ) : (
              <p className="text-gray-700">
                Found{" "}
                <span className="font-medium">
                  {pagination.totalShelters || 0}
                </span>{" "}
                shelter
                {pagination.totalShelters !== 1 ? "s" : ""}
                {selectedLocation && (
                  <span>
                    {" "}
                    in{" "}
                    <span className="font-medium">
                      "{selectedLocation.label}"
                    </span>
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {selectedLocation && (
              <button
                onClick={clearFilters}
                className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <FiX className="h-4 w-4" /> Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Results section */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : shelters.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100 my-8">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No shelters found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any shelters matching your search. Try adjusting
              your filters or search in a different location.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Shelter list */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              {shelters.map((shelter, index) => (
                <div
                  key={shelter._id}
                  className={`block hover:bg-blue-50 transition-colors ${
                    index !== shelters.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {shelter.shelterName}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                          <p className="flex items-center gap-1">
                            <FiMapPin className="h-4 w-4 text-gray-400" />
                            <span>{`${shelter.city}, ${shelter.state}`}</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <FiPhone className="h-4 w-4 text-gray-400" />
                            <span>{shelter.phoneNo}</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <FiMail className="h-4 w-4 text-gray-400" />
                            <span className="truncate max-w-[200px]">
                              {shelter.email}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Link
                          to={`/shelters/${shelter._id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details{" "}
                          <FiExternalLink className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    {shelter.description && (
                      <p className="text-gray-600 mt-3 line-clamp-2 text-sm">
                        {shelter.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        pagination.currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Shelters;
