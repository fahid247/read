"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome, FaSearch, FaBook, FaArrowLeft, FaCompass } from "react-icons/fa";
import { useEffect, useState } from "react";

/* ================= Animations ================= */
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />
        
        {/* Floating Books Pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="absolute"
            >
              <FaBook className="text-4xl text-gray-400 dark:text-gray-600" />
            </motion.div>
          ))}
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number with Parallax */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="relative mb-8"
          >
            <motion.h1
              animate={{
                x: mousePosition.x,
                y: mousePosition.y,
              }}
              transition={{ type: "spring", stiffness: 50 }}
              className="text-[15rem] md:text-[20rem] font-bold bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-none select-none"
            >
              404
            </motion.h1>
            
            {/* Floating Elements */}
            <motion.div
              variants={floatingAnimation}
              animate="animate"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6 mb-12"
          >
            <motion.h2
              variants={slideUp}
              className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white"
            >
              Oops! Page Not Found
            </motion.h2>
            
            <motion.div
              variants={slideUp}
              className="max-w-2xl mx-auto"
            >
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                The page you&apos;re looking for seems to have vanished into thin air
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                It might have been moved, deleted, or never existed in the first place
              </p>
            </motion.div>

          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            <motion.div variants={slideInLeft}>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-linear-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2 text-lg font-semibold">
                    <FaHome className="group-hover:rotate-12 transition-transform" />
                    Back to Home
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div variants={slideInRight}>
              <Link href="/books">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-primary/20 hover:border-primary/40"
                >
                  <span className="flex items-center gap-2 text-lg font-semibold">
                    <FaBook className="group-hover:scale-110 transition-transform" />
                    Browse Books
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Decorative Compass */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-10 right-10 opacity-10 hidden lg:block"
          >
            <FaCompass className="text-8xl text-gray-400 dark:text-gray-600" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;