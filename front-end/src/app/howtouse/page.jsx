// app/components/HowToUse.jsx
import { BookOpen, Search, UserCheck } from "lucide-react";

const HowToUse = () => {
  const steps = [
    {
      icon: UserCheck,
      title: "Create an Account",
      description:
        "Sign up as a reader or librarian to access all features and personalize your experience.",
    },
    {
      icon: Search,
      title: "Browse & Search Books",
      description:
        "Use the search bar and categories to find books that interest you, filter by price, pages, or category.",
    },
    {
      icon: BookOpen,
      title: "Read Details & Order or Wish",
      description:
        "Add books to your library, track reading progress, or order books from trusted librarians.",
    },
  ];

  return (
    <section className="py-20 bg-base-100 min-h-screen inter">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 playfair">
            How to <span className="text-primary">Use</span>
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Getting started with Read On Route is simple. Follow these steps to explore, borrow, and enjoy books seamlessly.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="group bg-base-200 rounded-2xl p-8 flex flex-col items-center text-center 
                         transition-all duration-300 ease-in-out
                         hover:scale-105 hover:shadow-xl hover:bg-base-300
                         hover:border-primary/20 border-2 border-transparent
                         cursor-default"
              >
                <div className="bg-primary/10 text-primary rounded-full p-5 mb-5 
                              transition-all duration-300 group-hover:bg-primary group-hover:text-white 
                              group-hover:scale-110 group-hover:rotate-3">
                  <IconComponent size={28} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="text-base-content/70 transition-colors duration-300 group-hover:text-base-content/90">
                  {step.description}
                </p>

                {/* Optional subtle indicator */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;