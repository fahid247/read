"use client"; 
import { motion } from "framer-motion";
import { useState } from "react";
import Swal from "sweetalert2";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "success",
      title: "Subscribed!",
      text: "You are now subscribed to our newsletter.",
      confirmButtonColor: "#4f46e5",
    });

    setEmail("");
  };

  return (
    <section className="py-20 bg-base-200 inter">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl playfair md:text-5xl font-extrabold mb-8"
        >
          Subscribe to our <span className="text-primary">Newsletter</span>
        </motion.h2>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
        >
          <input
            type="email"
            placeholder="Your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:flex-1 rounded-full px-5 py-3 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="btn btn-primary px-8 py-3 rounded-full"
          >
            Subscribe
          </motion.button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;