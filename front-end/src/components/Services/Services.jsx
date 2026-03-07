"use client";

import { motion } from "framer-motion";
import { BookOpen, UserCheck, Heart } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <BookOpen size={28} />,
      title: "Book Borrowing",
      description: "Easily borrow books and keep track of your reading progress.",
    },
    {
      icon: <UserCheck size={28} />,
      title: "Reader Accounts",
      description: "Personalized accounts for managing your library and favorites.",
    },
    {
      icon: <Heart size={28} />,
      title: "Community Support",
      description: "Connect with librarians and other readers for recommendations.",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { scale: 1.05, boxShadow: "0px 12px 30px rgba(0,0,0,0.15)" },
  };

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-6 text-center">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl playfair md:text-5xl font-extrabold text-base-content"
        >
          Service<span className="text-primary text-5xl md:text-6xl">s</span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="bg-base-100 p-8 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="bg-primary/10 text-primary rounded-full p-5 mb-5">
                {s.icon}
              </div>

              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>

              <p className="text-base-content/70">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Services;