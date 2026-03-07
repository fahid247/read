"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import useAxios from "../../Hooks/UseAxios";
import Loading from "@/app/Loading";

const LatestBooks = () => {
  const axios = useAxios();
  const router = useRouter();

  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["latestBooks"],
    queryFn: async () => {
      const res = await axios.get("/public/books?limit=8");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  /* Framer Motion Animations */
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const card = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 px-4 bg-base-200">
      <div className="container mx-auto max-w-410">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold bg-base-content from-primary to-accent bg-clip-text text-transparent">
              Latest Books
            </h2>
          </div>

          <button
            onClick={() => router.push("/allbooks")}
            className=" mt-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 group/btn"
          >
            <span className="relative z-10">View All Books</span>
            <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-100">
            <Loading />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">Failed to load books. Please try again.</p>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && !isError && (
          <motion.div
            className="lg:px-20 2xl:px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
          >
            {books.map((book) => (
              <motion.article
                key={book._id}
                variants={card}
                whileHover={{ y: -8 }}
                className="group relative bg-base-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={book.image}
                    alt={book.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-base-100/80 backdrop-blur-sm text-primary text-xs font-semibold rounded-full shadow-lg">
                      {book.category}
                    </span>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-2 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-lg shadow-lg flex items-center gap-1">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                      {book.rating}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 bg-base-100">
                  <h3 className="text-xl font-bold text-base-content mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {book.name}
                  </h3>
                  
                  <p className="text-base-content/90 text-sm mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {book.author}
                  </p>
                  
                  {/* Book Details */}
                  <div className="flex items-center justify-between py-4 border-t border-base-content/50">
                    <div className="flex items-center gap-2 text-sm text-base-content/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{book.pages} pages</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-base-content/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>New</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => router.push(`/book-details/${book._id}`)}
                    className="w-full mt-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 group/btn"
                  >
                    <span>View Details</span>
                    <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestBooks;