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
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  HeartIcon,
  MapPinIcon,
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: "Ahmedabad, Gujarat",
    age: "Any",
    gender: "Any",
  });
  const [featuredPets, setFeaturedPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const sliderRef = useRef(null);
  const mobileSliderRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        setIsLoading(true);

        // Fetch different types of pets
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
          const remainingPets = allPets.filter(
            (pet) =>
              !selectedPets.some((selectedPet) => selectedPet._id === pet._id)
          );

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
      
      // Close mobile filter drawer if it's open
      setIsMobileFilterOpen(false);
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

  // Mobile-specific slider settings
  const mobileSettings = {
    dots: true,
    dotsClass: "slick-dots custom-dots",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: '24px',
    autoplay: true,
    autoplaySpeed: 4000,
    adaptiveHeight: true
  };

  // Desktop slider settings
  const desktopSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const cardColors = [
    "bg-teal-300", // Teal background
    "bg-blue-400", // Blue background
    "bg-yellow-400", // Yellow background
  ];

  if (isMobile) {
    // MOBILE VIEW
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Mobile Hero Section */}
        <div className="relative">
          <div className="h-[70vh] relative">
            {/* Hero Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url('/src/assets/hero-bg.jpg')` }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Hero Content */}
            <div className="relative h-full flex flex-col justify-between px-5 pt-10 pb-12 z-10">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-white text-4xl font-bold drop-shadow-lg"
                >
                  Find your <br />perfect companion
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-white mt-3 text-lg opacity-90"
                >
                  Adopt, don't shop. Give a pet a second chance.
                </motion.p>
              </div>
              
              {/* Search Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button 
                  onClick={() => setIsMobileFilterOpen(true)} 
                  className="w-full bg-white text-blue-600 rounded-xl py-4 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  Search for Pets
                </button>
                
                <div className="flex justify-between mt-5">
                  {["Dogs", "Cats", "Other"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setActiveTab(type.toLowerCase());
                        setIsMobileFilterOpen(true);
                      }}
                      className="flex-1 bg-white/20 backdrop-blur-sm text-white mx-1 py-3 rounded-lg flex flex-col items-center justify-center"
                    >
                      <span className="text-sm font-medium">{type}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Adoptions Counter Banner */}
        <div className="bg-blue-600 text-white py-4 px-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                <CountUp end={2468} duration={2.5} />+
              </div>
              <div className="text-sm font-medium text-blue-100">
                Adoptions
              </div>
            </div>
            <button
              onClick={() => navigate("/about-us")}
              className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center"
            >
              Learn more <ArrowRightIcon className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        
        {/* Featured Pets Section */}
        <section className="py-8 px-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Featured Pets
            </h2>
            <button
              onClick={() => navigate("/pets")}
              className="text-blue-600 font-medium text-sm flex items-center"
            >
              See all <ArrowRightIcon className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredPets.length > 0 ? (
            <div className="pet-carousel-container mb-8 -mx-5">
              <Slider ref={mobileSliderRef} {...mobileSettings}>
                {featuredPets.map((pet, index) => (
                  <div key={pet._id} className="px-1">
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/pet/${pet._id}`)}
                      className="bg-white rounded-xl overflow-hidden shadow-md h-[340px] relative"
                    >
                      {/* Pet Image */}
                      <div 
                        className="h-52 bg-cover bg-center"
                        style={{ backgroundImage: `url(${pet.photos[0]})` }}
                      />
                      
                      {/* Favorite Button */}
                      <button className="absolute top-3 right-3 bg-white/60 backdrop-blur-sm p-2 rounded-full">
                        <HeartIcon className="w-5 h-5 text-red-500" />
                      </button>
                      
                      {/* Available Badge */}
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Available
                      </div>
                      
                      {/* Pet Info */}
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                        <p className="text-gray-600 text-sm">{pet.breed}</p>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-gray-700 text-sm">
                            {pet.gender} • {formatPetAge(pet.age) || "Adult"}
                          </div>
                          
                          <div className="flex items-center text-gray-500 text-xs">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            {pet.shelterId?.city || "Unknown location"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-gray-500 mb-3">No featured pets available</p>
              <button
                onClick={() => navigate("/pets")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Browse All Pets
              </button>
            </div>
          )}
        </section>
        
        {/* Why Choose Adoption */}
        <section className="py-8 px-5 bg-gradient-to-b from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Why Choose Adoption?
          </h2>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500"
          >
            <p className="text-gray-700 leading-relaxed">
              Adopting a pet gives them a second chance at a loving home. 
              When you adopt, you're not just bringing home a pet; 
              you're saving a life and making room for another animal in need.
            </p>
            
            <div className="mt-4 flex justify-between">
              <div className="text-center flex-1">
                <div className="text-xl font-bold text-blue-600">6.5M</div>
                <div className="text-xs text-gray-500">Pets in shelters yearly</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl font-bold text-green-600">1.5M</div>
                <div className="text-xs text-gray-500">Euthanized yearly</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl font-bold text-amber-600">250₹</div>
                <div className="text-xs text-gray-500">Avg. adoption fee</div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-4">
            <button
              onClick={() => navigate("/about-us")}
              className="w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-medium"
            >
              Learn More About Adoption
            </button>
          </div>
        </section>
        
        {/* Share Your Story CTA */}
        <section className="py-8 px-5">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl p-5 shadow-lg">
            <h3 className="text-xl font-bold mb-2">Share Your Story</h3>
            <p className="text-blue-50 mb-4">
              Did you adopt a pet? Tell the community about your journey!
            </p>
            <button
              onClick={handleShareStory}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium"
            >
              Share Now
            </button>
          </div>
        </section>
        
        {/* Stats Section - Simplified for Mobile */}
        <section className="py-8 px-5 bg-blue-50">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Our Impact
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <HeartIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">
                <CountUp end={2468} duration={2.5} />
              </div>
              <div className="text-gray-500 text-sm">Pets Adopted</div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="w-10 h-10 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
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
              <div className="text-2xl font-bold text-gray-800">
                <CountUp end={183} duration={2.5} />
              </div>
              <div className="text-gray-500 text-sm">Shelter Partners</div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-green-600"
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
              <div className="text-2xl font-bold text-gray-800">
                <CountUp end={5743} duration={2.5} />
              </div>
              <div className="text-gray-500 text-sm">Community Members</div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="w-10 h-10 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-amber-600"
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
              <div className="text-2xl font-bold text-gray-800">
                <CountUp end={14} duration={2.5} />
              </div>
              <div className="text-gray-500 text-sm">Days to Forever Home</div>
            </div>
          </div>
        </section>
        
        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl max-h-[90vh] overflow-auto">
              <div className="p-5">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-bold text-gray-800">Find Pets</h3>
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-5">
                  {/* Pet Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Dogs", "Cats", "Other Pets"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab.toLowerCase())}
                          className={`py-3 rounded-lg text-sm whitespace-nowrap transition-colors ${
                            activeTab === tab.toLowerCase()
                              ? "bg-blue-600 text-white font-medium"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  </div>
                  
                  {/* Age and Gender */}
                  {["dogs", "cats"].includes(activeTab) && (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Age Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <select
                          value={filters.age}
                          onChange={(e) =>
                            setFilters({ ...filters, age: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Any">Any</option>
                          {["baby", "young", "adult", "senior"].map(
                            (opt) => (
                              <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* Gender Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={filters.gender}
                          onChange={(e) =>
                            setFilters({ ...filters, gender: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Any">Any</option>
                          {["Male", "Female"].map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 text-white rounded-lg py-4 font-medium text-lg flex items-center justify-center gap-2"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    {user ? "Search" : "Get Started"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Custom styles for mobile */}
        <style jsx>{`
          .custom-dots {
            margin-bottom: -15px !important;
            position: relative;
            bottom: 10px;
          }
          
          .custom-dots li button:before {
            color: #3b82f6;
            font-size: 8px;
            opacity: 0.5;
          }
          
          .custom-dots li.slick-active button:before {
            color: #3b82f6;
            opacity: 1;
          }
          
          .pet-carousel-container .slick-slide {
            height: inherit !important;
            padding: 5px 0;
          }
          
          .pet-carousel-container .slick-track {
            display: flex !important;
          }
          
          .pet-carousel-container .slick-slide > div {
            height: 100%;
          }
        `}</style>
      </div>
    );
  } else {
    // DESKTOP VIEW - Keep the original desktop code
    return (
      <div className="min-h-screen">
        {/* Hero Section - Adding responsive height and positioning */}
        <div
          className="relative h-[75vh] md:h-177.5 bg-[url('/src/assets/hero-bg.jpg')] bg-cover bg-no-repeat"
          style={{ backgroundPosition: "center top 75.5%" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-1/4 md:top-50 left-5 md:left-20 text-white max-w-full md:max-w-2xl px-4 md:px-0"
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-semibold mb-4 text-[Poppins] drop-shadow-md">
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
            <p className="text-base md:text-lg font-medium mb-6 text-gray-300 drop-shadow-md">
              Let's get started. Search pets from shelters, rescues, and
              individuals.
            </p>
          </motion.div>

          {/* Search Container - Mobile responsive adjustments */}
          <motion.div className="absolute bottom-0 w-full">
            <div className="mx-auto max-w-6xl px-4">
              <motion.div className="bg-blue-50 rounded-t-[35px] p-4 md:p-7 shadow-2xl">
                {/* Tabs - Mobile scrollable */}
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-0 mb-4 md:mb-6 scrollbar-hide">
                  {["Dogs", "Cats", "Other Pets", "Shelter/Rescues"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-3 md:px-5 py-2 text-base md:text-lg whitespace-nowrap relative transition-colors ${
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

                {/* Filters - Stack on mobile */}
                <div className="flex flex-col md:flex-row gap-4">
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
                    className="w-full md:w-48 bg-blue-600 text-white rounded-lg h-12 md:h-auto flex items-center justify-center gap-2 text-lg shadow-lg hover:bg-blue-700 mt-2 md:mt-0"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    {user ? "Search" : "Get Started"}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Story Sharing Box - Mobile responsive */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-100 w-full py-4 md:h-16 flex items-center justify-center px-4 md:px-0"
            >
              <div className="text-center flex flex-col md:flex-row items-center">
                <span className="text-base md:text-lg md:mr-4 text-blue-800 mb-3 md:mb-0">
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

        {/* Featured Pets Section - Mobile responsive slider */}
        <section className="py-12 md:py-16 px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
              Meet featured pets
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              We're spotlighting a few pets looking for homes.
            </p>
          </motion.div>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : featuredPets.length > 0 ? (
            <div className="relative flex items-center justify-center">
              {/* Custom Left Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="hidden md:block absolute -left-4 lg:-left-16 p-2 rounded-full bg-white shadow-lg hover:bg-blue-50 z-10"
                onClick={() => sliderRef.current.slickPrev()}
              >
                <ChevronLeftIcon className="w-6 h-6 text-blue-500" />
              </motion.button>

              <Slider ref={sliderRef} {...desktopSettings} className="w-full">
                {featuredPets.map((pet, index) => (
                  <div key={pet._id} className="px-2 md:px-4">
                    <div
                      onClick={() => navigate(`/pet/${pet._id}`)}
                      className={`w-full max-w-[300px] mx-auto md:w-72 ${
                        cardColors[index % cardColors.length]
                      } rounded-3xl overflow-hidden cursor-pointer transition-all hover:shadow-xl`}
                    >
                      {/* Image container with curved frame */}
                      <div className="p-4 pb-0 relative">
                        {/* Decorative corner accents */}
                        <div className="absolute top-6 left-6 w-6 h-6 border-t-4 border-l-4 border-white opacity-80 rounded-tl-lg z-10"></div>
                        <div className="absolute top-6 right-6 w-6 h-6 border-t-4 border-r-4 border-white opacity-80 rounded-tr-lg z-10"></div>
                        <div className="absolute bottom-2 left-6 w-6 h-6 border-b-4 border-l-4 border-white opacity-80 rounded-bl-lg z-10"></div>
                        <div className="absolute bottom-2 right-6 w-6 h-6 border-b-4 border-r-4 border-white opacity-80 rounded-br-lg z-10"></div>

                        {/* Main image container with enhanced styling */}
                        <div className="overflow-hidden rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
                          {/* Gradient overlay frame */}
                          <div className="relative">
                            <div
                              className="h-48 md:h-64 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                              style={{ backgroundImage: `url(${pet.photos[0]})` }}
                            />

                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70"></div>

                            {/* Paw print decorative element */}
                            <div className="absolute top-4 right-4">
                              <svg
                                className="w-6 h-6 text-white opacity-70"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8.25,2.25c-1.5,0-2.75,1.34-2.75,3s1.25,3,2.75,3s2.75-1.34,2.75-3S9.75,2.25,8.25,2.25z M15.75,2.25c-1.5,0-2.75,1.34-2.75,3s1.25,3,2.75,3s2.75-1.34,2.75-3S17.25,2.25,15.75,2.25z M4.5,9.75c-1.5,0-2.75,1.34-2.75,3s1.25,3,2.75,3s2.75-1.34,2.75-3S6,9.75,4.5,9.75z M19.5,9.75c-1.5,0-2.75,1.34-2.75,3s1.25,3,2.75,3s2.75-1.34,2.75-3S21,9.75,19.5,9.75z M12,11.25c-2.07,0-3.75,1.68-3.75,3.75v3.75c0,1.24,1.01,2.25,2.25,2.25h3c1.24,0,2.25-1.01,2.25-2.25v-3.75C15.75,12.93,14.07,11.25,12,11.25z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Available tag - optional */}
                        <div className="absolute -bottom-2 left-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          Available
                        </div>
                      </div>

                      {/* Pet information */}
                      <div className="p-4 pt-2">
                        <h3 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900">
                          {pet.name}
                        </h3>
                        <p className="text-base md:text-lg font-medium text-gray-800">
                          {pet.breed}
                        </p>
                        <div className="flex flex-col mt-2">
                          <p className="text-gray-800">
                            {pet.gender}, {formatPetAge(pet.age) || "Adult"}
                          </p>
                          <p className="text-gray-800">
                            {pet.shelterId && pet.shelterId.city
                              ? `${pet.shelterId.city}, ${pet.shelterId.state}`
                              : "Location not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>

              {/* Custom Right Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="hidden md:block absolute -right-4 lg:-right-16 p-2 rounded-full bg-white shadow-lg hover:bg-blue-50 z-10"
                onClick={() => sliderRef.current.slickNext()}
              >
                <ChevronRightIcon className="w-6 h-6 text-blue-500" />
              </motion.button>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">
                No featured pets available at the moment.
              </p>
              <button
                onClick={() => navigate("/pets")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Browse All Pets
              </button>
            </div>
          )}
        </section>

        {/* Statistics Impact Bar */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Our Impact
              </h2>
              <p className="text-gray-600 mt-2">
                Making a difference in the lives of pets and people
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
              {/* Pets Adopted Stat */}
              <motion.div
                className="bg-white rounded-2xl p-4 md:p-6 shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 md:w-8 md:h-8 text-blue-600"
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
                  className="block text-2xl md:text-4xl font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <CountUp end={2468} duration={2.5} />
                </motion.span>
                <span className="text-sm md:text-base text-gray-600 font-medium">
                  Pets Adopted
                </span>
              </motion.div>

              {/* Shelter Partners Stat */}
              <motion.div
                className="bg-white rounded-2xl p-4 md:p-6 shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 md:w-8 md:h-8 text-indigo-600"
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
                  className="block text-2xl md:text-4xl font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <CountUp end={183} duration={2.5} />
                </motion.span>
                <span className="text-sm md:text-base text-gray-600 font-medium">
                  Shelter Partners
                </span>
              </motion.div>

              {/* Active Users Stat */}
              <motion.div
                className="bg-white rounded-2xl p-4 md:p-6 shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 md:w-8 md:h-8 text-green-600"
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
                  className="block text-2xl md:text-4xl font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <CountUp end={5743} duration={2.5} />
                </motion.span>
                <span className="text-sm md:text-base text-gray-600 font-medium">
                  Community Members
                </span>
              </motion.div>

              {/* Avg Days to Adoption Stat */}
              <motion.div
                className="bg-white rounded-2xl p-4 md:p-6 shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 md:w-8 md:h-8 text-amber-600"
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
                  className="block text-2xl md:text-4xl font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <CountUp end={14} duration={2.5} />
                </motion.span>
                <span className="text-sm md:text-base text-gray-600 font-medium">
                  Days to Forever Home
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Adopt Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
              className="space-y-6 order-2 md:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Why Choose Adoption?
              </h2>
              <motion.div
                className="text-base md:text-lg leading-relaxed text-gray-700 bg-white p-6 md:p-8 rounded-xl shadow-sm border-l-4 border-blue-500"
                whileHover={{ scale: 1.02 }}
              >
                Adopting a pet is more than just finding a furry friend; it's
                about giving a second chance to a life in need. Every year,
                countless animals end up in shelters waiting for a loving home. By
                adopting, you're not only saving a life but also making space
                for another pet to be cared for.
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              className="h-64 md:h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg order-1 md:order-2"
            >
              <div className="w-full h-full bg-[url('/src/assets/why-adopt.jpg')] bg-cover bg-center" />
            </motion.div>
          </div>
        </section>
      </div>
    );
  }
}