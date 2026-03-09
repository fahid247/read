"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaHeart,
  FaBookOpen,
  FaStar,
  FaLanguage,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";

import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import Loading from "@/app/Loading";
import Link from "next/link";

/* ================= Animations ================= */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const BookDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: book = {}, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!id) return {};
      const res = await axiosSecure.get(`/books/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  /* ================= Order Handler ================= */
  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire("You must be logged in to order");

    const form = e.target;
    const orderInfo = {
      bookId: book._id,
      bookName: book.name,
      bookImage: book.image,
      price: book.price,
      name: user.displayName,
      email: user.email,
      phone: form.phone.value,
      address: form.address.value,
      orderStatus: "pending",
      paymentStatus: "unpaid",
      orderedAt: new Date(),
      librarianEmail: book.librarianEmail,
    };

    await axiosSecure.post("/orders", orderInfo);

    Swal.fire({
      icon: "success",
      title: "Order placed successfully!",
      timer: 1500,
      showConfirmButton: false,
      background: "#1a1a1a",
      color: "#fff",
    });

    document.getElementById("order_modal").close();
    router.push("/dashboard/user/my-orders");
  };

  /* ================= Wishlist Handler ================= */
  const handleWishList = async () => {
    if (!user) return Swal.fire("You must be logged in to add to wishlist");

    const wishInfo = {
      bookId: book._id,
      BookImage: book.image,
      bookName: book.name,
      price: book.price,
      name: user.displayName,
      email: user.email,
      wishedAt: new Date(),
      librarianEmail: book.librarianEmail,
    };

    await axiosSecure.post("/wishList", wishInfo);

    Swal.fire({
      icon: "success",
      title: "Added to wishlist",
      timer: 1500,
      showConfirmButton: false,
      background: "#1a1a1a",
      color: "#fff",
    });

    document.getElementById("wish_modal").close();
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-base-200 to-base-300 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements - responsive positioning */}
      <div className="absolute top-0 left-0 w-full h-48 sm:h-64 bg-linear-to-r from-primary/5 to-secondary/5 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-0 w-40 sm:w-56 md:w-72 lg:w-80 h-40 sm:h-56 md:h-72 lg:h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Back button for mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-6 lg:hidden"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
          >
            <FaArrowLeft size={16} />
            <span>Back</span>
          </button>
        </motion.div>

        {/* Breadcrumb - hidden on mobile, visible on larger screens */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden sm:block mb-6 md:mb-8 text-sm breadcrumbs"
        >
          <ul className="text-base-content/80 dark:text-base-content/70 flex flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/books"
                className="hover:text-primary transition-colors"
              >
                Books
              </Link>
            </li>
            <li className="text-primary font-semibold truncate max-w-37.5 sm:max-w-50 md:max-w-75">
              {book.name}
            </li>
          </ul>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start">
          {/* Image Section */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
            className="relative order-1 lg:order-1"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-50 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative bg-base-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex justify-center"
                >
                  <div className="relative w-full max-w-75 sm:max-w-87.5 md:max-w-100 lg:max-w-112.5 mx-auto">
                    <Image
                      src={book.image}
                      width={450}
                      height={650}
                      alt={book.name}
                      className="rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl w-full h-auto object-cover"
                      priority={true}
                      loading="eager"
                      
                    />
                  </div>
                </motion.div>

                {/* Book status badge - responsive positioning */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`absolute top-3 sm:top-6 md:top-8 lg:top-10 right-3 sm:right-6 md:right-8 lg:right-10 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg ${
                    book.status === "Published"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {book.status === "Published" ? "📚 Available" : "📖 Borrowed"}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 order-2 lg:order-2"
          >
            {/* Title and Author */}
            <div className="space-y-2 sm:space-y-3">
              <motion.h1
                variants={fadeInUp}
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-base-content to-base-content/70 bg-clip-text text-transparent leading-tight"
              >
                {book.name}
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl md:text-2xl text-base-content/80 dark:text-base-content/70"
              >
                by {book.author}
              </motion.p>
            </div>

            {/* Rating */}
            <motion.div variants={fadeInUp} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-0.5 sm:gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-base sm:text-lg md:text-xl ${
                      i < Math.floor(book.rating)
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-base-content/75 dark:text-base-content/70">
                ({book.rating} / 5)
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-sm sm:text-base md:text-lg text-base-content/80 dark:text-base-content/60 leading-relaxed"
            >
              {book.description}
            </motion.p>

            {/* Book Details Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4"
            >
              {[
                { icon: FaBookOpen, label: "Category", value: book.category },
                { icon: FaLanguage, label: "Language", value: book.language },
                { icon: FaCalendarAlt, label: "Pages", value: book.pages },
                { icon: FaUser, label: "Publisher", value: book.publisher },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-base-200/50 dark:bg-base-300/50 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <item.icon className="text-lg sm:text-xl md:text-2xl text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-base-content/80 truncate">
                        {item.label}
                      </p>
                      <p className="font-semibold text-sm sm:text-base text-base-content truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Price and Actions */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-linear-to-r from-primary/10 to-base-content/10 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl"
            >
              <div>
                <p className="text-xs sm:text-sm text-base-content/90 mb-1">Price</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                  ৳{book.price}
                </p>
              </div>

              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn bg-linear-to-r from-primary to-primary/80 text-white border-none px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex-1 xs:flex-auto"
                  onClick={() =>
                    document.getElementById("order_modal").showModal()
                  }
                >
                  Order Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn bg-white dark:bg-gray-800 text-pink-500 border-2 border-pink-500 hover:bg-pink-500 hover:text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-sm sm:text-base flex-1 xs:flex-auto"
                  onClick={() =>
                    document.getElementById("wish_modal").showModal()
                  }
                >
                  <FaHeart className="mr-1 sm:mr-2 text-sm sm:text-base" /> Wishlist
                </motion.button>
              </div>
            </motion.div>

            {/* Additional Info - responsive grid */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full shrink-0"></div>
                <span className="truncate">In stock</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full shrink-0"></div>
                <span className="truncate">Free shipping</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-500 rounded-full shrink-0"></div>
                <span className="truncate">30-day returns</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Order Modal - Responsive Design */}
      <dialog id="order_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-full sm:max-w-md mx-0 sm:mx-auto p-0 sm:p-0">
          <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-linear-to-r from-primary to-secondary rounded-t-2xl"></div>

          <div className="p-4 sm:p-5 md:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Complete Your Order
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
              Please provide your delivery details
            </p>

            <form onSubmit={handleOrder} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                  <input
                    readOnly
                    value={user?.displayName || ""}
                    className="input input-bordered w-full pl-9 sm:pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-sm sm:text-base h-10 sm:h-12"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Email
                </label>
                <input
                  readOnly
                  value={user?.email || ""}
                  className="input input-bordered w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-sm sm:text-base h-10 sm:h-12"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                  <input
                    name="phone"
                    placeholder="+880 1XXXXXXXXX"
                    className="input input-bordered w-full pl-9 sm:pl-10 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-sm sm:text-base h-10 sm:h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Delivery Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 text-sm sm:text-base" />
                  <textarea
                    name="address"
                    placeholder="House, Road, Area, City"
                    className="textarea textarea-bordered w-full pl-9 sm:pl-10 pt-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-sm sm:text-base min-h-20 sm:min-h-24"
                    required
                  />
                </div>
              </div>

              <div className="modal-action flex flex-col xs:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  type="submit"
                  className="btn bg-linear-to-r from-primary to-secondary text-white border-none flex-1 rounded-lg sm:rounded-xl hover:shadow-lg transition-all text-sm sm:text-base h-10 sm:h-12"
                >
                  Confirm Order
                </button>
                <button
                  type="button"
                  className="btn bg-gray-200 dark:bg-gray-700 border-none flex-1 rounded-lg sm:rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm sm:text-base h-10 sm:h-12"
                  onClick={() => document.getElementById("order_modal").close()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Wishlist Modal - Responsive Design */}
      <dialog id="wish_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-full sm:max-w-md mx-0 sm:mx-auto p-0 sm:p-0">
          <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-linear-to-r from-pink-500 to-rose-500 rounded-t-2xl"></div>

          <div className="p-4 sm:p-5 md:p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-14 h-14 sm:w-16 md:w-20 sm:h-16 md:h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
            >
              <FaHeart className="text-2xl sm:text-3xl md:text-4xl text-pink-500" />
            </motion.div>

            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-gray-800 dark:text-white">
              Add to Wishlist
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 px-2">
              Would you like to add &quot;{book.name}&quot; to your wishlist?
            </p>

            <div className="modal-action flex flex-col xs:flex-row gap-2 sm:gap-3 mt-2 sm:mt-4">
              <button
                className="btn bg-linear-to-r from-pink-500 to-rose-500 text-white border-none flex-1 rounded-lg sm:rounded-xl hover:shadow-lg transition-all py-2 sm:py-3 text-sm sm:text-base"
                onClick={handleWishList}
              >
                <FaHeart className="mr-1 sm:mr-2 text-sm sm:text-base" /> Add to Wishlist
              </button>
              <button
                className="btn bg-gray-200 dark:bg-gray-700 border-none flex-1 rounded-lg sm:rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all py-2 sm:py-3 text-sm sm:text-base"
                onClick={() => document.getElementById("wish_modal").close()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </section>
  );
};

export default BookDetailsPage;