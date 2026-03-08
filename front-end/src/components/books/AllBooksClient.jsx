"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/UseAxios";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Loading from "@/app/Loading";

const card = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const AllBooksClient = () => {
  const axios = useAxios();
  const router = useRouter();

  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allBooks"],
    queryFn: async () => {
      const res = await axios.get("/books");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return <Loading></Loading>;

  if (isError)
    return (
      <p className="text-center text-red-500 py-20">
        Failed to load books
      </p>
    );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"
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
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
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
                ⭐ {book.rating || 4.5}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 bg-base-100">
            <h3 className="text-xl font-bold text-base-content mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {book.name}
            </h3>

            <p className="text-base-content/90 text-sm mb-4 flex items-center gap-2">
              👤 {book.author}
            </p>

            {/* Book Details */}
            <div className="flex items-center justify-between py-4 border-t border-base-content/10">
              <div className="flex items-center gap-2 text-sm text-base-content/80">
                📖 {book.pages} pages
              </div>

              <div className="flex items-center gap-2 text-sm text-base-content/80">
                🆕 New
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => router.push(`/book-details/${book._id}`)}
              className="w-full mt-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 group/btn"
            >
              <span>View Details</span>

              <svg
                className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
};

export default AllBooksClient;