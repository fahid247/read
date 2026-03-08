"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Thank you for contacting us. We'll get back to you soon.",
      confirmButtonColor: "#4f46e5",
    });

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-base-200 p-8 shadow-lg"
    >
      <h2 className="mb-6 text-2xl font-semibold">Send us a message</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full border border-base-300 bg-base-100 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-base-300 bg-base-100 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea
            rows="4"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-2xl border border-base-300 bg-base-100 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 playfair"
        >
          Send Message
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ContactForm;