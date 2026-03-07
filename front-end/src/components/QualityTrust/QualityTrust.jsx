"use client";

import { ShieldCheck, Truck, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const promises = [
  {
    icon: <ShieldCheck className="w-12 h-12 text-primary" />,
    title: "Verified Books & Sellers",
    description:
      "We ensure that every book and librarian on our platform is verified for authenticity and quality.",
  },
  {
    icon: <Truck className="w-12 h-12 text-primary" />,
    title: "Fast & Secure Delivery",
    description:
      "Your books are delivered quickly and safely with real-time tracking at every step.",
  },
  {
    icon: <MapPin className="w-12 h-12 text-primary" />,
    title: "Nationwide Coverage",
    description:
      "We serve all 64 districts, connecting readers and librarians across Bangladesh.",
  },
  {
    icon: <Star className="w-12 h-12 text-primary" />,
    title: "Customer Satisfaction",
    description:
      "Our dedicated support team ensures that every reader and librarian has a hassle-free experience.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" },
};

const QualityTrust = () => {
  return (
    <section className="bg-base-200 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl playfair font-extrabold text-base-content">
            Our <span className="text-primary">Quality & Trust</span> Promise
          </h2>

          <p className="mt-4 text-base-content/70 inter text-lg max-w-2xl mx-auto">
            At Read Mart, we are committed to providing reliable service,
            verified books, and complete satisfaction for both readers and librarians.
          </p>
        </div>

        {/* Promises Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 inter"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              className="bg-base-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col items-center text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="mb-5 p-4 rounded-full bg-primary/10 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                {promise.icon}
              </motion.div>

              <h3 className="text-xl font-semibold text-base-content mb-3">
                {promise.title}
              </h3>

              <p className="text-base-content/70 text-sm">
                {promise.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div className="mt-16 text-center">
          <motion.p
            className="text-base-content/70 mb-4 text-lg inter"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join thousands of readers and librarians who trust ReadOnRoute.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/allbooks"
              className="btn btn-primary px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 playfair"
            >
              Explore Books
            </Link>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default QualityTrust;