"use client";

import { Truck, BookOpen, MapPin, Clock, ShieldCheck, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: <Truck className="w-10 h-10 text-primary" />,
    title: "Doorstep Delivery",
    description:
      "Get your favorite books delivered straight to your home, no matter where you are in Bangladesh.",
  },
  {
    icon: <MapPin className="w-10 h-10 text-primary" />,
    title: "Nationwide Coverage",
    description:
      "Available in all 64 districts with reliable local service centers ensuring fast delivery.",
  },
  {
    icon: <Clock className="w-10 h-10 text-primary" />,
    title: "Fast & Reliable",
    description:
      "Our optimized delivery routes ensure timely and dependable book delivery every time.",
  },
  {
    icon: <BookOpen className="w-10 h-10 text-primary" />,
    title: "Curated Book Selection",
    description:
      "Choose from a wide range of books added by trusted librarians and sellers.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Secure Payments",
    description:
      "Multiple safe payment options with full transaction protection and order tracking.",
  },
  {
    icon: <Headphones className="w-10 h-10 text-primary" />,
    title: "Dedicated Support",
    description:
      "Our friendly support team is always ready to help you with orders and delivery.",
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

const WhyChoose = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 bg-base-200">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl playfair md:text-5xl font-extrabold text-base-content">
          Why Choose <span className="text-primary">Read Mart</span>?
        </h2>

        <p className="mt-4 text-base-content/70 text-lg inter max-w-3xl mx-auto">
          ReadOnRoute connects readers, librarians, and sellers with a fast,
          reliable, and nationwide book delivery experience.
        </p>
      </div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 inter"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-base-100 rounded-2xl p-8 cursor-pointer hover:bg-base-200 transition-all duration-300 flex flex-col items-start shadow-sm hover:shadow-lg"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              {feature.icon}
            </div>

            <h3 className="text-xl font-semibold text-base-content mb-2">
              {feature.title}
            </h3>

            <p className="text-base-content/70 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <motion.h3
          className="text-2xl playfair md:text-3xl font-semibold text-base-content/90 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Start Your Reading Journey Today
        </motion.h3>

        <motion.p
          className="text-base-content/70 inter mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join thousands of readers who trust ReadOnRoute for their book deliveries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/allbooks"
            className="btn btn-primary px-8 py-3 playfair rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Explore Books
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChoose;