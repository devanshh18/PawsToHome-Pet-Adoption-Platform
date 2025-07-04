import { motion } from "framer-motion";
import {
  HeartIcon,
  ShieldCheckIcon,
  UsersIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
// Import images to avoid 404 errors
import aboutUsImg from "../../assets/about-us-img.jpg";
import puppyMillImg from "../../assets/puppy-mill.jpg";

const AboutUs = () => {
  const stats = [
    { id: 1, name: "Pets Adopted", value: "12K+" },
    { id: 2, name: "Rescue Partners", value: "200+" },
    { id: 3, name: "Cities Active", value: "50" },
  ];

  const adoptionBenefits = [
    {
      title: "End Animal Homelessness",
      content: "Every adoption creates space for another rescue in shelters",
      icon: HeartIcon,
    },
    {
      title: "Combat Cruelty",
      content: "We expose and report unethical breeding practices",
      icon: ShieldCheckIcon,
    },
    {
      title: "Build Community",
      content: "Join our network of 50k+ responsible pet parents",
      icon: UsersIcon,
    },
  ];

  const testimonials = [
    {
      quote:
        "PawsToHome connected me with my best friend. The process was seamless, transparent and joyful.",
      name: "Ananya D.",
      pet: "adopted Bruno, a Labrador mix",
      image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8",
    },
    {
      quote:
        "As a first-time pet parent, I appreciated the guidance and support throughout the adoption journey.",
      name: "Ranbir S.",
      pet: "adopted Luna, a Persian cat",
      image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
    },
  ];
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      
      <section className="min-h-[700px] bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-blue-50 md:w-1/2 right-0" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100 rounded-full opacity-30 -mt-20 -mr-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 -mb-20 -ml-10" />

        <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Content Column */}
            <div className="z-10 pr-4 md:pr-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center mb-6">
                  <div className="h-1 bg-blue-600 w-12 mr-4"></div>
                  <span className="font-medium text-blue-600 uppercase tracking-wider text-sm">
                    PawsToHome
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900">
                  <span className="block text-blue-600">#ChooseToAdopt</span>
                  Give a Pet a Second Chance
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-lg">
                  Every adoption creates{" "}
                  <span className="text-blue-600 font-semibold">
                    ripples of change
                  </span>
                  . Our platform connects loving homes with pets who need them
                  most.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700 text-lg"
                    onClick={() => (window.location.href = "/pets")}
                  >
                    Find Your New Companion
                  </motion.button>

                  <Link
                    to="/guide"
                    className="inline-flex items-center justify-center text-blue-600 py-4 px-8 font-semibold hover:text-blue-800 rounded-lg border-2 border-blue-200 hover:border-blue-300"
                  >
                    Learn About Adoption
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full border-2 border-white bg-blue-${
                          i * 100 + 200
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-gray-600 font-medium">
                    Join{" "}
                    <span className="text-blue-600 font-bold">12,000+</span> pet
                    parents who chose adoption
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Image Column with Floating Elements */}
            <div className="relative z-10 md:h-[550px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative h-full"
              >
                {/* Main image */}
                <div className="relative z-20 md:absolute md:top-0 md:right-0 md:w-5/6 h-[350px] md:h-5/6 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={aboutUsImg}
                    alt="Happy adopted dog with owner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                </div>

                {/* Floating stats card */}
                <motion.div
                  initial={{ x: 40, y: 40 }}
                  animate={{ x: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute bottom-10 left-0 bg-white p-4 rounded-xl shadow-xl z-30 max-w-[220px]"
                >
                  <div className="flex items-center mb-2">
                    <HeartIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="font-semibold text-gray-900">
                      Adoption Impact
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 h-3 rounded-full">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: "68%" }}
                      ></div>
                    </div>
                    <span className="ml-2 text-blue-700 font-bold">68%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Reducing animal homelessness since 2020
                  </p>
                </motion.div>

                {/* Color block for visual interest */}
                <div className="hidden md:block absolute top-1/4 -left-12 w-24 h-24 bg-blue-600/20 rounded-xl -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            className="w-full"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20  relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full opacity-50" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-50 rounded-full opacity-30" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full font-medium text-sm mb-4 inline-block">
              Making a Difference
            </span>
            <h2 className="text-4xl font-bold mb-6">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every adoption creates a ripple effect of positive change in
              animal welfare
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full opacity-50 -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="mx-auto mb-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <HeartIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {stats[0].value}
                </div>
                <div className="text-gray-600 font-medium">{stats[0].name}</div>
                <div className="w-20 h-1 bg-blue-200 mx-auto mt-4" />
                <p className="mt-4 text-sm text-gray-500">
                  Finding forever homes one pet at a time
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden border-t-4 border-blue-600"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full opacity-50 -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="mx-auto mb-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {stats[1].value}
                </div>
                <div className="text-gray-600 font-medium">{stats[1].name}</div>
                <div className="w-20 h-1 bg-blue-200 mx-auto mt-4" />
                <p className="mt-4 text-sm text-gray-500">
                  Working together for animal welfare
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full opacity-50 -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="mx-auto mb-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {stats[2].value}
                </div>
                <div className="text-gray-600 font-medium">{stats[2].name}</div>
                <div className="w-20 h-1 bg-blue-200 mx-auto mt-4" />
                <p className="mt-4 text-sm text-gray-500">
                  Growing our reach nationwide
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dark Side of Buying */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              The Hidden Cost of Buying
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Behind the pet shop windows lies a disturbing reality most buyers
              never see
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
              className="relative rounded-2xl overflow-hidden shadow-xl h-[450px]"
            >
              <img
                src={puppyMillImg}
                alt="Unethical breeding conditions"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="px-3 py-1 bg-blue-600 rounded-full text-sm font-medium mb-2 inline-block">
                  The Reality
                </span>
                <h3 className="text-2xl font-bold mb-1">Behind Closed Doors</h3>
                <p className="text-blue-100">
                  The conditions many bred animals endure
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50 }}
              whileInView={{ x: 0 }}
              className="space-y-8"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Inbreeding Crisis
                    </h3>
                    <p className="text-gray-600">
                      68% of bred dogs suffer genetic disorders from reckless
                      inbreeding practices
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="h-2 bg-gray-200 rounded-full flex-grow">
                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ width: "68%" }}
                        ></div>
                      </div>
                      <span className="ml-3 text-blue-700 font-bold">68%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Puppy Mill Reality
                    </h3>
                    <p className="text-gray-600">
                      Over 10,000 illegal breeding facilities operate in India
                      with horrific conditions
                    </p>
                    <div className="mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      10,000+ illegal facilities nationwide
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/guide"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
              >
                Learn How You Can Help
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Adoption Benefits */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full opacity-30 -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full opacity-30 -ml-48 -mb-48" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-15"
          >
            <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full font-medium text-sm mb-4 inline-block">
              Choose Compassion
            </span>
            <h2 className="text-4xl font-bold mb-6">Why Adoption Wins</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Creating lasting change through ethical pet ownership
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {adoptionBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <benefit.icon className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add this testimonials section right before your Quote Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="px-4 py-1.5 bg-cyan-100 text-cyan-800 rounded-full font-medium text-sm mb-4 inline-block">
              Success Stories
            </span>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Hear From Our Community
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Real stories from pet parents who found their perfect companions
              through PawsToHome.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 relative"
              >
                <div className="absolute -top-6 -left-6">
                  <div className="bg-blue-600 rounded-full p-4 shadow-lg">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-gray-700 text-lg italic mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-500 text-sm">{testimonial.pet}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Read More Stories
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-2xl italic mb-6">
            &quot;Adoption isn&apos;t just getting a pet - it&apos;s saving a
            life and making space to save another&quot;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-400" />
            <div>
              <p className="font-semibold">Devansh Patil</p>
              <p className="text-blue-200">Founder, PawsToHome</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
