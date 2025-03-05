import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScaleIcon, ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const LegalPage = () => {
  const [openSection, setOpenSection] = useState(null);

  const legalSections = [
    {
      title: "Terms of Service",
      icon: ScaleIcon,
      content: [
        {
          heading: "User Responsibilities",
          text: "By using PawsToHome, you agree to provide accurate information and treat all animals and community members with respect."
        },
        {
          heading: "Content Ownership",
          text: "Users retain ownership of uploaded content but grant PawsToHome license to use it for platform operations."
        },
        {
          heading: "Payment Terms",
          text: "All adoption fees are non-refundable and directly support our animal welfare programs."
        }
      ]
    },
    {
      title: "Privacy Policy",
      icon: ShieldCheckIcon,
      content: [
        {
          heading: "Data Collection",
          text: "We collect only essential information required for successful adoptions and platform security."
        },
        {
          heading: "Information Usage",
          text: "Personal data is never sold; used solely for matching pets with adopters and service improvements."
        },
        {
          heading: "User Rights",
          text: "You may request data access, corrections, or deletion at any time through your account settings."
        }
      ]
    },
    {
      title: "Animal Welfare Compliance",
      icon: DocumentTextIcon,
      content: [
        {
          heading: "Adoption Standards",
          text: "All partner shelters meet strict animal care guidelines verified by our inspection team."
        },
        {
          heading: "Reporting Protocol",
          text: "Any welfare concerns must be immediately reported through our verified channels."
        },
        {
          heading: "Legal Compliance",
          text: "We adhere to all Prevention of Cruelty to Animals Act (1960) regulations and local municipal laws."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="inline-block mb-6"
          >
            <ScaleIcon className="w-12 h-12 text-white mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Legal Transparency Center</h1>
          <p className="text-xl text-blue-100">Committed to Ethical Operations and Clear Communication</p>
        </div>
      </motion.section>

      {/* Legal Documents */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid gap-8 md:grid-cols-3 mb-12"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Legal Compliance</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Legal Support</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Legal Audits Conducted</div>
          </div>
        </motion.div>

        {/* Accordion Sections */}
        <div className="space-y-6">
          {legalSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              className="border rounded-xl overflow-hidden"
            >
              <button
                className="w-full p-6 bg-blue-50 flex justify-between items-center hover:bg-blue-100 transition-colors"
                onClick={() => setOpenSection(openSection === index ? null : index)}
              >
                <div className="flex items-center gap-4">
                  <section.icon className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-800">{section.title}</h2>
                </div>
                <div className={`transform transition-transform ${openSection === index ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {openSection === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-6 space-y-6"
                >
                  {section.content.map((item, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold mb-2">{item.heading}</h3>
                      <p className="text-gray-600">{item.text}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Legal Inquiries</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> legal@pawstohome.com
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Registered Office: </span>
              123 Animal Welfare Lane, Ahmedabad - 380001
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Grievance Officer: </span>
              Ms. Priya Sharma (available Mon-Fri, 10AM-6PM IST)
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LegalPage;
