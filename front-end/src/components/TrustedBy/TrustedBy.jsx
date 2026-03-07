"use client";

import { Star, Users, MapPin, BookOpen, Truck } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: <Users className="w-8 h-8 text-primary" />, value: "15,000+", label: "Happy Readers" },
  { icon: <BookOpen className="w-8 h-8 text-primary" />, value: "4,000+", label: "Books Available" },
  { icon: <Truck className="w-8 h-8 text-primary" />, value: "12,000+", label: "Orders Delivered" },
  { icon: <MapPin className="w-8 h-8 text-primary" />, value: "64", label: "Districts Covered" },
];

const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "Reader",
    location: "Dhaka",
    message: "ReadOnRoute has completely changed how I buy books. Fast delivery and excellent service!",
  },
  {
    name: "Mahmud Hasan",
    role: "Librarian",
    location: "Chattogram",
    message: "Managing orders is simple and efficient. ReadOnRoute helps me reach readers nationwide.",
  },
  {
    name: "Nusrat Jahan",
    role: "Reader",
    location: "Rajshahi",
    message: "I received my books within two days. The tracking system is very accurate!",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" },
};

const TrustedBy = () => {
  return (
    <section className="bg-base-200 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content playfair">
            Trusted by <span className="text-primary">Readers & Librarians</span>
          </h2>

          <p className="mt-4 text-base-content/70 max-w-3xl mx-auto text-lg inter">
            Thousands of readers and librarians across Bangladesh trust
            Read Mart for reliable book delivery and seamless order management.
          </p>
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 inter"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-base-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-center mb-3 w-14 h-14 rounded-full bg-primary/10">
                {stat.icon}
              </div>

              <h3 className="text-2xl font-bold text-base-content">
                {stat.value}
              </h3>

              <p className="text-sm text-base-content/60 mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 inter"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {testimonials.map((review, index) => (
            <motion.div
              key={index}
              className="bg-base-100 rounded-2xl shadow-sm p-8 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              {/* Message */}
              <p className="text-base-content/70 text-sm leading-relaxed mb-6">
                “{review.message}”
              </p>

              {/* User */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {review.name.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold text-base-content">
                    {review.name}
                  </p>
                  <p className="text-xs text-base-content/50">
                    {review.role} • {review.location}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default TrustedBy;