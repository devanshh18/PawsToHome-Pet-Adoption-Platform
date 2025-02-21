import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { indianStates, indianCities } from "../utils/location";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("dogs");
  const [filters, setFilters] = useState({
    location: "Ahmedabad, Gujarat",
    age: "Any",
    gender: "Any",
  });

  const featuredPets = [
    { id: 1, name: "Buddy", type: "Golden Retriever", age: "2 Years" },
    { id: 2, name: "Whiskers", type: "Persian Cat", age: "1.5 Years" },
    { id: 3, name: "Snowball", type: "Rabbit", age: "6 Months" },
    { id: 4, name: "Charlie", type: "Labrador", age: "3 Years" },
    { id: 5, name: "Mittens", type: "Siamese Cat", age: "2 Years" },
    { id: 6, name: "Fluffy", type: "Hamster", age: "8 Months" },
  ];

  const sliderRef = useRef(null);

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
                          ? "text-blue-600 font-bold"
                          : "text-gray-600 hover:text-blue-500"
                      }`}
                    >
                      {tab}
                      {activeTab === tab.toLowerCase() && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
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
                          className="w-full pt-5 pb-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
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
                      className="w-full pt-5 pb-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
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
                  className="w-48 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 text-lg shadow-lg hover:bg-blue-600"
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
                className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 shadow-md"
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
              <div key={pet.id} className="px-4">
                <div className="w-72 bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-xl transition-all mx-auto">
                  <div className="h-48 bg-[url('/src/assets/buddy.jpg')] bg-cover bg-center rounded-xl mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {pet.name}
                  </h3>
                  <p className="text-gray-600">{pet.type}</p>
                  <p className="text-gray-600">{pet.age}</p>
                </div>
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
              Adopting a pet is more than just finding a furry friend; it’s
              about giving a second chance to a life in need. Every year,
              countless animals end up in shelters waiting for a loving home. By
              adopting, you’re not only saving a life but also making space for
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
