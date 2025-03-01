import {
  CheckCircleIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const HowToPage = () => {
  // Step-by-step guide (6 steps)
  const steps = [
    {
      title: "Step 1: Browse Available Pets",
      content:
        "Use our intuitive search filters to find pets that match your lifestyle. Filter by species, age, size, and location to discover your perfect companion.",
    },
    {
      title: "Step 2: Get to Know the Pet",
      content:
        "Explore detailed profiles with high-quality photos, personality traits, medical history, and special needs. Read stories from foster families and view videos of pets in action.",
    },
    {
      title: "Step 3: Apply for Adoption",
      content:
        "Submit our digital adoption form with required documents (ID proof, residence verification). Our team will review your application within 48 hours.",
    },
    {
      title: "Step 4: Meet & Greet",
      content:
        "Schedule in-person or virtual meetings with the pet and shelter staff. Get professional advice on introducing the pet to your home environment.",
    },
    {
      title: "Step 5: Finalize Adoption",
      content:
        "Complete the adoption agreement, receive the pet’s medical records, and benefit from post-adoption support including a free initial vet consultation.",
    },
    {
      title: "Step 6: Enjoy Ongoing Support",
      content:
        "After adoption, our platform continues to provide guidance through community resources and updates. We ensure you have access to additional advice and information, helping you and your new pet thrive together.",
    },
  ];

  // Essential Pet Care Guides – Expanded to 5 items with longer answers
  const howToItems = [
    {
      question: "How to prepare your home for a new pet?",
      answer:
        "Start by creating a designated space that is safe and comfortable for your new pet. Invest in quality bedding, appropriate toys, and ensure that all hazardous items or breakables are secured. Establish feeding and watering stations and gradually introduce your pet to different areas of your home so that they feel safe and acclimated. A well-prepared home sets the foundation for a smooth transition.",
    },
    {
      question: "How to transition a pet to new food?",
      answer:
        "Begin by mixing a small portion of the new food with the current food and gradually increase the ratio over a period of 7-10 days. This slow transition minimizes digestive upset. Monitor your pet closely for any signs of discomfort or allergies, and consult your veterinarian if you notice any adverse reactions. A careful transition helps maintain your pet’s health during dietary changes.",
    },
    {
      question: "How to socialize a shy pet?",
      answer:
        "Socializing a shy pet requires patience and gentle encouragement. Start with short, controlled interactions with family members and gradually introduce new people and environments. Use positive reinforcement—such as treats and praise—to reward friendly behavior, and create safe spaces where your pet can retreat if overwhelmed. Over time, these gradual exposures help build confidence and ease anxiety.",
    },
    {
      question: "How to ensure proper training for your pet?",
      answer:
        "Establish a consistent training routine that incorporates clear commands and positive reinforcement. Consider enrolling in professional obedience classes or seeking advice from experienced trainers. Consistency is key—reward good behavior and gently correct undesired actions. With time, your pet will learn essential commands and good manners, strengthening the bond between you both.",
    },
    {
      question: "How to handle a pet's health emergencies effectively?",
      answer:
        "Keep a well-stocked pet first aid kit and educate yourself on basic pet first aid procedures. In case of a health emergency, contact your veterinarian immediately. Regular check-ups and proactive care are essential for early detection of potential issues. Being prepared ensures that you can act quickly to provide your pet with the best possible care during emergencies.",
    },
  ];

  // Adoption FAQs – Expanded to 5 items with updated questions and detailed answers
  const faqItems = [
    {
      question: "What are the costs involved in adoption?",
      answer:
        "There are no adoption fees on our platform. The only expenses you might incur are related to vaccinations, routine check-ups, or pet care products if you choose to have these services performed at the shelter or by an independent veterinarian. Our mission is to promote pet adoption over buying, ensuring that more pets find loving homes without the burden of unnecessary fees. Ultimately, the financial commitment is minimal compared to the lifelong joy of adopting a pet.",
    },
    {
      question: "Can I return a pet if it doesn't work out?",
      answer:
        "Our platform does not facilitate returns. Once a pet is adopted, the process is final. However, if you encounter challenges or have concerns, you are encouraged to contact the shelter or rescue center directly. They can offer guidance or address issues on a case-by-case basis. We are here solely as a connecting platform, providing you with the information needed to make an informed decision.",
    },
    {
      question: "What is the role of our platform in the adoption process?",
      answer:
        "We serve as a bridge between potential adopters and reputable shelters or rescue centers. Our platform compiles comprehensive profiles and information provided by our partners, ensuring you have all the details needed to make the right choice. We do not conduct medical or behavioral evaluations ourselves; our focus is on connecting you with the right shelter and providing guidance throughout your adoption journey.",
    },
    {
      question: "What happens after I submit my adoption application?",
      answer:
        "Once you submit your adoption application, our platform connects you with the appropriate shelter or rescue center. We do not contact the shelters on your behalf; instead, we guide you through the next steps by providing updates on your application progress. You will receive further communication directly from the shelter, ensuring a smooth transition from application to adoption.",
    },
    {
      question: "How long does the adoption process take?",
      answer:
        "The duration of the adoption process varies depending on several factors such as the pet's unique needs, scheduling of home visits, and completion of necessary paperwork. Typically, it ranges from a few days to several weeks. We strive to keep you informed at every stage, ensuring a transparent process from application submission to final adoption, so that you feel confident and supported throughout your journey.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-21.5 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your Complete Pet Adoption Guide
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Master the adoption process with our step-by-step guide, expert
            tips, and detailed answers to your most common questions.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold text-gray-800">
              6-Step Adoption Process
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Follow our proven roadmap to successful pet adoption.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="bg-blue-100 w-fit p-3 rounded-lg mb-4">
                <span className="text-blue-600 font-bold text-xl">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Essential Pet Care Guides Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpenIcon className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Essential Pet Care Guides
            </h2>
          </div>
          <div className="grid max-w-5xl mx-auto mt-6 divide-y divide-gray-200">
            {howToItems.map((item, index) => (
              <details
                key={index}
                className="group py-4 transition-all duration-500"
              >
                <summary className="flex items-center justify-between font-medium list-none cursor-pointer">
                  <span>{item.question}</span>
                  <span className="transition-transform duration-300 group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 group-open:animate-fadeIn text-lg">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Adoption FAQs Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex items-center gap-3 mb-8">
          <QuestionMarkCircleIcon className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">Adoption FAQs</h2>
        </div>
        <div className="grid max-w-5xl mx-auto mt-6 divide-y divide-gray-200">
          {faqItems.map((item, index) => (
            <details
              key={index}
              className="group py-4 transition-all duration-500"
            >
              <summary className="flex items-center justify-between font-medium list-none cursor-pointer">
                <span>{item.question}</span>
                <span className="transition-transform duration-300 group-open:rotate-180">
                  <svg
                    fill="none"
                    height="24"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-gray-600 group-open:animate-fadeIn text-lg">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HowToPage;
