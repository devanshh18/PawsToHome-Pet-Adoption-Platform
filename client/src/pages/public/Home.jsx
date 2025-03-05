import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { indianStates, indianCities } from "../../utils/location";
import { searchPetsByLocation } from "../../features/pets/petSlice";

function CountUp({ end, duration = 2 }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <span ref={nodeRef}>{count.toLocaleString()}</span>;
}

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("dogs");
  const [filters, setFilters] = useState({
    location: "Ahmedabad, Gujarat",
    age: "Any",
    gender: "Any",
  });
  const [featuredPets, setFeaturedPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        setIsLoading(true);

        // Fetch different types of pets (dogs, cats, other pets) - increase limits
        const dogResponse = await dispatch(
          searchPetsByLocation({ species: "Dog", limit: 4 })
        ).unwrap();
        const catResponse = await dispatch(
          searchPetsByLocation({ species: "Cat", limit: 4 })
        ).unwrap();
        const otherResponse = await dispatch(
          searchPetsByLocation({ species: "Other", limit: 4 })
        ).unwrap();

        // Combine all pets
        let allPets = [...dogResponse, ...catResponse, ...otherResponse];

        // First prioritize shelter diversity by keeping one pet per shelter
        const shelterMap = new Map();
        allPets.forEach((pet) => {
          if (!shelterMap.has(pet.shelterId._id)) {
            shelterMap.set(pet.shelterId._id, pet);
          }
        });

        // Get the unique pets by shelter
        let selectedPets = Array.from(shelterMap.values());

        // If we have fewer than 6, add more pets from existing shelters
        if (selectedPets.length < 6) {
          // Get pets from shelters we already have but different pets
          const remainingPets = allPets.filter(
            (pet) =>
              !selectedPets.some((selectedPet) => selectedPet._id === pet._id)
          );

          // Add these to reach 6 total
          selectedPets = [
            ...selectedPets,
            ...remainingPets.slice(0, 6 - selectedPets.length),
          ];
        }

        // Shuffle and limit to exactly 6 pets
        const shuffledPets = selectedPets
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);

        setFeaturedPets(shuffledPets);
      } catch (error) {
        console.error("Error fetching featured pets:", error);
        setFeaturedPets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPets();
  }, [dispatch]);

  const handleSearch = () => {
    if (!user) {
      navigate("/login");
    } else {
      // If shelter/rescue tab is selected, navigate to shelters page
      if (activeTab === "shelter/rescues") {
        const searchParams = new URLSearchParams();
        if (filters.location !== "Any") {
          const [city, state] = filters.location.split(", ");
          searchParams.append("city", city);
          searchParams.append("state", state);
        }
        navigate(`/shelters?${searchParams.toString()}`);
        return;
      }

      // For pet searches
      const searchParams = new URLSearchParams();

      // Add species based on active tab
      const speciesMap = {
        dogs: "Dog",
        cats: "Cat",
        "other pets": "Other",
      };
      if (speciesMap[activeTab]) {
        searchParams.append("species", speciesMap[activeTab]);
      }

      // Add other filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "Any") {
          if (key === "location") {
            const [city, state] = value.split(", ");
            searchParams.append("city", city);
            searchParams.append("state", state);
          } else if (key === "age") {
            searchParams.append("ageRange", value);
          } else if (key === "gender") {
            searchParams.append("gender", value);
          }
        }
      });

      navigate(`/pets?${searchParams.toString()}`);
    }
  };

  const handleShareStory = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/add-post");
    }
  };

  // Format pet age to a readable string
  const formatPetAge = (age) => {
    if (!age) return "Unknown age";

    let ageText = "";
    if (age.years > 0) {
      ageText = `${age.years} ${age.years === 1 ? "Year" : "Years"}`;
      if (age.months > 0) {
        ageText += ` ${age.months} ${age.months === 1 ? "Month" : "Months"}`;
      }
    } else if (age.months > 0) {
      ageText = `${age.months} ${age.months === 1 ? "Month" : "Months"}`;
    }
    return ageText;
  };

  // Slider settings with default arrows disabled
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Adjust as needed
    slidesToScroll: 1,
    arrows: false, // Disable default arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-177.5 bg-[url('/src/assets/hero-bg.jpg')] bg-cover bg-no-repeat"
        style={{ backgroundPosition: "center top 75.5%" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent" />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-50 left-20 text-white max-w-2xl"
        >
          <h1 className="text-8xl font-semibold mb-4 text-[Poppins] drop-shadow-md">
            Ready to <br /> adopt a pet
            <motion.span
              animate={{
                rotate: [-1, 1, -1],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-white inline-block"
            >
              ?
            </motion.span>
          </h1>
          <p className="text-lg font-medium mb-6 text-gray-300 drop-shadow-md">
            Let&apos;s get started. Search pets from shelters, rescues, and
            individuals.
          </p>
        </motion.div>

        {/* Search Container */}
        <motion.div className="absolute bottom-0 w-full">
          <div className="mx-auto max-w-6xl px-4">
            <motion.div className="bg-blue-50 rounded-t-[35px] p-7 shadow-2xl">
              {/* Tabs */}
              <div className="flex gap-0 mb-6">
                {["Dogs", "Cats", "Other Pets", "Shelter/Rescues"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`px-5 py-2 text-lg relative transition-colors ${
                        activeTab === tab.toLowerCase()
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-600"
                      }`}
                    >
                      {tab}
                      {activeTab === tab.toLowerCase() && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                          layoutId="underline"
                        />
                      )}
                    </button>
                  )
                )}
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                {["dogs", "cats"].includes(activeTab) ? (
                  <>
                    {["location", "age", "gender"].map((field) => (
                      <motion.div
                        key={field}
                        className="flex-1 relative"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="absolute top-1 left-3 text-gray-500 text-sm">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </span>
                        <select
                          className="w-full pt-5 pb-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:outline-none"
                          value={filters[field]}
                          onChange={(e) =>
                            setFilters({ ...filters, [field]: e.target.value })
                          }
                        >
                          {field !== "location" && (
                            <option value="Any">Any</option>
                          )}
                          {field === "location"
                            ? indianStates.map((state) =>
                                indianCities[state].map((city) => (
                                  <option
                                    key={`${city}-${state}`}
                                    value={`${city}, ${state}`}
                                  >
                                    {`${city}, ${state}`}
                                  </option>
                                ))
                              )
                            : field === "age"
                            ? ["baby", "young", "adult", "senior"].map(
                                (opt) => (
                                  <option key={opt} value={opt}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                  </option>
                                )
                              )
                            : ["Male", "Female"].map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                        </select>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <motion.div
                    className="flex-1 relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="absolute top-1 left-3 text-gray-500 text-sm">
                      Location
                    </span>
                    <select
                      className="w-full pt-5 pb-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:outline-none"
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                    >
                      {indianStates.map((state) =>
                        indianCities[state].map((city) => (
                          <option
                            key={`${city}-${state}`}
                            value={`${city}, ${state}`}
                          >
                            {`${city}, ${state}`}
                          </option>
                        ))
                      )}
                    </select>
                  </motion.div>
                )}
                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-48 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 text-lg shadow-lg hover:bg-blue-700"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  {user ? "Search" : "Get Started"}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Story Sharing Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-100 w-full h-16 flex items-center justify-center"
          >
            <div className="text-center">
              <span className="text-lg mr-4 text-blue-800">
                Adopted a Pet? Share your story with the community!
              </span>
              <motion.button
                onClick={handleShareStory}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-md"
              >
                Share your story
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Featured Pets Section using react-slick */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-2 text-gray-800">
            Meet featured pets
          </h2>
          <p className="text-lg text-gray-600">
            Check out these adorable pets ready to find their forever homes.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Custom Left Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="absolute -left-16 p-2 rounded-full bg-white shadow-lg hover:bg-blue-50 z-10"
              onClick={() => sliderRef.current.slickPrev()}
            >
              <ChevronLeftIcon className="w-6 h-6 text-blue-500" />
            </motion.button>
            <Slider ref={sliderRef} {...settings} className="w-full">
              {featuredPets.map((pet) => (
                <div key={pet._id} className="px-4 py-2">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="group relative w-72 h-96 mx-auto cursor-pointer"
                    onClick={() => navigate(`/pet/${pet._id}`)}
                  >
                    {/* Glass Card Container */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md shadow-lg border border-white/20 transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-300/30">
                      {/* Content Container */}
                      <div className="relative h-full flex flex-col">
                        {/* Full Image Container - Aspect ratio approach */}
                        <div className="relative overflow-hidden rounded-t-2xl pt-[80%] bg-gray-100">
                          <img
                            src={pet.photos[0]}
                            alt={pet.name}
                            className="absolute top-0 left-0 w-full h-full object-fill"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/src/assets/pet-placeholder.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"></div>

                          {/* Pet Name Overlay */}
                          <motion.div
                            initial={{ opacity: 0.8, y: 5 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute bottom-0 left-0 right-0 p-4 text-white"
                          >
                            <h3 className="text-xl font-bold tracking-wide drop-shadow-md">
                              {pet.name}
                            </h3>
                          </motion.div>
                        </div>

                        {/* Pet Details with Modern Layout */}
                        <div className="flex-1 p-5 flex flex-col">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">
                              Breed
                            </span>
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                              {pet.gender}
                            </span>
                          </div>

                          <div className="text-gray-700 mb-2 font-medium">
                            {pet.breed}
                          </div>

                          <div className="flex items-center ">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-gray-600 text-sm">
                              {formatPetAge(pet.age)}
                            </span>
                          </div>

                          <div className="mt-auto flex items-center pt-3 border-t border-gray-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-400 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-gray-500 text-sm">
                              {pet.shelterId?.city}, {pet.shelterId?.state}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>

            {/* Custom Right Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="absolute -right-16 p-2 rounded-full bg-white shadow-lg hover:bg-blue-50 z-10"
              onClick={() => sliderRef.current.slickNext()}
            >
              <ChevronRightIcon className="w-6 h-6 text-blue-500" />
            </motion.button>
          </div>
        )}
      </section>

      {/* Statistics Impact Bar */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-800">Our Impact</h2>
            <p className="text-gray-600 mt-2">
              Making a difference in the lives of pets and people
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {/* Pets Adopted Stat */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <motion.span
                className="block text-4xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <CountUp end={2468} duration={2.5} />
              </motion.span>
              <span className="text-gray-600 font-medium">Pets Adopted</span>
            </motion.div>

            {/* Shelter Partners Stat */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <motion.span
                className="block text-4xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <CountUp end={183} duration={2.5} />
              </motion.span>
              <span className="text-gray-600 font-medium">
                Shelter Partners
              </span>
            </motion.div>

            {/* Active Users Stat */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <motion.span
                className="block text-4xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <CountUp end={5743} duration={2.5} />
              </motion.span>
              <span className="text-gray-600 font-medium">
                Community Members
              </span>
            </motion.div>

            {/* Avg Days to Adoption Stat */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <motion.span
                className="block text-4xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <CountUp end={14} duration={2.5} />
              </motion.span>
              <span className="text-gray-600 font-medium">
                Days to Forever Home
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Adopt Section */}
      <section className="py-16 px-4 ">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-gray-800">
              Why Choose Adoption?
            </h2>
            <motion.div
              className="text-lg leading-relaxed text-gray-700 bg-white p-8 rounded-xl shadow-sm border-l-4 border-blue-500"
              whileHover={{ scale: 1.02 }}
            >
              Adopting a pet is more than just finding a furry friend; it's
              about giving a second chance to a life in need. Every year,
              countless animals end up in shelters waiting for a loving home. By
              adopting, you're not only saving a life but also making space for
              another pet to be cared for.
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="w-full h-full bg-[url('/src/assets/why-adopt.jpg')] bg-cover bg-center" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
