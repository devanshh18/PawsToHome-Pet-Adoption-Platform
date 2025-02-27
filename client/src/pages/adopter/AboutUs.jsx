import { motion } from "framer-motion";
import {
  HeartIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/src/assets/adopted-dog.jpg')",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-blue-800/60" />
        <div className="container mx-auto h-full flex flex-col items-center justify-center text-center relative z-10 px-4">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-white text-5xl font-bold mb-6 leading-snug"
          >
            <span className="text-blue-400">#ChooseToAdopt</span>
            <br />
            Every Pet Deserves a Loving Home
          </motion.h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Transform lives by adopting a rescued animal. Our platform ensures
            every adoption is a step toward ending animal homelessness. <br />
            <b>Because every pet deserves love.</b>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700"
            onClick={() => (window.location.href = "/pets")}
          >
            Start Your Adoption Journey
          </motion.button>
        </div>
      </motion.section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Our Impact in Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  whileHover={{ y: -10 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dark Side of Buying */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            className="relative h-96 rounded-2xl overflow-hidden"
          >
            <img
              src="/src/assets/puppy-mill.jpg"
              alt="Unethical breeding conditions"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/40" />
          </motion.div>

          <motion.div initial={{ x: 50 }} whileInView={{ x: 0 }}>
            <h2 className="text-4xl font-bold mb-6">
              The Hidden Cost of Buying
            </h2>
            <div className="space-y-6">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Inbreeding Crisis
                </h3>
                <p className="text-gray-600">
                  68% of bred dogs suffer genetic disorders from reckless
                  inbreeding practices
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Puppy Mill Reality
                </h3>
                <p className="text-gray-600">
                  Over 10,000 illegal breeding facilities operate in India with
                  horrific conditions
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Adoption Benefits */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Adoption Wins</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Creating lasting change through ethical pet ownership
            </p>
          </div>

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

      {/* Quote Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-2xl italic mb-6">
            &quot;Adoption isn&apos;t just getting a pet - it&apos;s saving a life and making
            space to save another&quot;
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
