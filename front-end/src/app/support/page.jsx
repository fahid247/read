"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HiOutlineQuestionMarkCircle,
  HiOutlineMail,
  HiOutlineChat,
  HiOutlinePhone,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineCreditCard,
  HiOutlineTruck,
  HiOutlineCog
} from "react-icons/hi";

const Support = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", contactForm);
    setFormSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 3000);
  };

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section in your dashboard. Each order has a tracking number that you can use to monitor your delivery status.",
      icon: HiOutlineTruck
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets. All payments are processed securely through our payment partners.",
      icon: HiOutlineCreditCard
    },
    {
      question: "How can I return an item?",
      answer: "Returns are accepted within 30 days of purchase. Simply go to your orders page, select the item you wish to return, and follow the return instructions. You'll receive a return label via email.",
      icon: HiOutlineShoppingBag
    },
    {
      question: "What is your refund policy?",
      answer: "Refunds are processed within 5-7 business days after we receive your returned item. The amount will be credited back to your original payment method.",
      icon: HiOutlineCheckCircle
    },
    {
      question: "How do I change my account information?",
      answer: "You can update your account information by going to your profile settings in the dashboard. There you can change your name, email, password, and shipping addresses.",
      icon: HiOutlineUser
    },
    {
      question: "What should I do if I receive a damaged item?",
      answer: "If you receive a damaged item, please contact us immediately within 48 hours of delivery. Take photos of the damage and email them to our support team for quick resolution.",
      icon: HiOutlineCog
    }
  ];

  const quickHelpTopics = [
    { icon: HiOutlineUser, title: "Account Issues", description: "Login, password, profile updates" },
    { icon: HiOutlineShoppingBag, title: "Orders", description: "Track, modify, cancel orders" },
    { icon: HiOutlineCreditCard, title: "Payments", description: "Billing, refunds, transactions" },
    { icon: HiOutlineTruck, title: "Shipping", description: "Delivery, tracking, rates" }
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="border-b border-base-300 bg-base-200/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors group"
            >
              <HiOutlineArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="inter">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-base-content playfair">Support Center</h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-base-300">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block bg-primary/20 rounded-full p-4 mb-6">
            <HiOutlineQuestionMarkCircle className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4 playfair">
            How can we help you?
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto inter">
            Find answers to common questions or reach out to our support team
          </p>
        </div>
      </div>

      {/* Quick Help Topics */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-base-content mb-8 playfair text-center">
          Quick Help Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickHelpTopics.map((topic, index) => (
            <div 
              key={index}
              className="bg-base-200 rounded-2xl p-6 border border-base-300 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group cursor-pointer"
            >
              <div className="bg-primary/10 rounded-xl p-3 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <topic.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base-content mb-2 inter">
                {topic.title}
              </h3>
              <p className="text-sm text-base-content/60 inter">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-base-content mb-8 playfair text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-base-200 rounded-xl border border-base-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-base-300/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <faq.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-base-content inter">
                      {faq.question}
                    </span>
                  </div>
                  <HiOutlineChevronDown 
                    className={`w-5 h-5 text-base-content/60 transition-transform duration-300 ${
                      activeFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    activeFaq === index ? 'pb-4' : 'h-0'
                  }`}
                >
                  <p className="text-base-content/70 inter border-t border-base-300 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-base-content mb-8 playfair text-center">
            Still Need Help?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-linear-to-br from-primary to-green-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 playfair">Contact Us</h3>
                <p className="text-white/80 mb-6 inter">
                  Our support team is available 24/7 to assist you
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <HiOutlineMail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60 inter">Email</p>
                      <p className="font-medium inter">support@readmart.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <HiOutlinePhone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60 inter">Phone</p>
                      <p className="font-medium inter">+1 (888) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <HiOutlineClock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60 inter">Hours</p>
                      <p className="font-medium inter">24/7 Support</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-secondary rounded-lg p-2">
                    <HiOutlineChat className="w-5 h-5 text-secondary-content" />
                  </div>
                  <h3 className="font-semibold text-base-content inter">Live Chat</h3>
                </div>
                <p className="text-base-content/70 text-sm mb-4 inter">
                  Chat with our support team in real-time
                </p>
                <button className="w-full bg-primary text-primary-content py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors inter">
                  Start Chat
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
                <h3 className="text-xl font-bold text-base-content mb-6 playfair">
                  Send us a Message
                </h3>
                
                {formSubmitted ? (
                  <div className="bg-success/20 border border-success rounded-xl p-6 text-center">
                    <HiOutlineCheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <p className="text-base-content font-semibold inter">Message Sent Successfully!</p>
                    <p className="text-base-content/70 text-sm inter">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-base-content/70 mb-2 inter">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:border-primary transition-colors inter"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-base-content/70 mb-2 inter">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:border-primary transition-colors inter"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-base-content/70 mb-2 inter">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:border-primary transition-colors inter"
                        placeholder="How can we help?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-base-content/70 mb-2 inter">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:border-primary transition-colors inter resize-none"
                        placeholder="Tell us more about your issue..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-primary text-primary-content py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors inter text-lg"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-base-200 border-t border-base-300 mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineBookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-base-content inter">Guides & Tutorials</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-base-content/60 hover:text-primary text-sm inter transition-colors">
                    Getting Started Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base-content/60 hover:text-primary text-sm inter transition-colors">
                    How to Place an Order
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base-content/60 hover:text-primary text-sm inter transition-colors">
                    Understanding Your Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineCog className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-base-content inter">Policies</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-base-content/60 hover:text-primary text-sm inter transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base-content/60 hover:text-primary text-sm inter transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base-content/60 hover:text-primary text-sm inter transition-colors">
                    Return Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-base-content inter">Community</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-base-content/60 hover:text-primary text-sm inter transition-colors">
                    Forum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base-content/60 hover:text-primary text-sm inter transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base-content/60 hover:text-primary text-sm inter transition-colors">
                    Community Events
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;