"use client";

import React from "react";
import Link from "next/link";
import useAuth from "@/Hooks/UseAuth";
import useRole from "@/hooks/UseRole";


import {
  UserIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

import { motion } from "framer-motion";
import { TbJewishStar } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import Loading from "../Loading";


const DashboardHome = () => {
  const { user ,loading } = useAuth();
  const { role, roleLoading } = useRole();
  if (roleLoading || loading) return <Loading />;

  return (
    <section className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-10 text-base-content playfair"
      >
        Welcome back,{" "}
        <span className="text-primary">
          {user?.displayName || "User"}
        </span>{" "}
        👋
      </motion.h2>

      {/* USER DASHBOARD */}
      {role === "user" && (
        <DashboardGrid>
          <DashboardCard
            title="My Orders"
            desc="View your order history"
            icon={<ClipboardDocumentListIcon />}
            gradient="from-primary to-indigo-500"
            link="/dashboard/my-orders"
          />

          <DashboardCard
            title="My Wishlist"
            desc="View your wishlist"
            icon={<TbJewishStar />}
            gradient="from-emerald-500 to-yellow-500"
            link="/dashboard/my-wishlist"
          />

          <DashboardCard
            title="Payment History"
            desc="Look at your payments"
            icon={<MdOutlinePayments />}
            gradient="from-indigo-400 to-indigo-600"
            link="/dashboard/payment"
          />

          <DashboardCard
            title="My Profile"
            desc="Manage your account"
            icon={<UserIcon />}
            gradient="from-emerald-500 to-green-600"
            link="/dashboard/my-profile"
          />
        </DashboardGrid>
      )}

      {/* LIBRARIAN DASHBOARD */}
      {role === "librarian" && (
        <DashboardGrid>
          <DashboardCard
            title="My Books"
            desc="Books you added"
            icon={<BookOpenIcon />}
            gradient="from-indigo-500 to-violet-600"
            link="/dashboard/my-books"
          />

          <DashboardCard
            title="Orders"
            desc="Orders for your books"
            icon={<ClipboardDocumentListIcon />}
            gradient="from-blue-500 to-sky-600"
            link="/dashboard/librarian-orders"
          />

          <DashboardCard
            title="Add Book"
            desc="Add a new book"
            icon={<PlusCircleIcon />}
            gradient="from-indigo-400 to-indigo-600"
            link="/dashboard/add-books"
          />

          <DashboardCard
            title="My Profile"
            desc="Manage your account"
            icon={<UserIcon />}
            gradient="from-emerald-500 to-green-600"
            link="/dashboard/my-profile"
          />
        </DashboardGrid>
      )}

      {/* ADMIN DASHBOARD */}
      {role === "admin" && (
        <DashboardGrid>
          <DashboardCard
            title="Manage Users"
            desc="Control user roles"
            icon={<UsersIcon />}
            gradient="from-rose-500 to-red-600"
            link="/dashboard/all-users"
          />

          <DashboardCard
            title="Manage Books"
            desc="View & manage books"
            icon={<BookOpenIcon />}
            gradient="from-indigo-500 to-purple-600"
            link="/dashboard/manage-books"
          />

          <DashboardCard
            title="Overview"
            desc="Platform statistics"
            icon={<ChartBarIcon />}
            gradient="from-yellow-400 to-amber-500"
            link="/dashboard/overview"
          />
        </DashboardGrid>
      )}
    </section>
  );
};

/* GRID */
const DashboardGrid = ({ children }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

/* CARD */
const DashboardCard = ({ title, desc, icon, gradient, link }) => (
  <Link href={link}>
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="
        bg-base-100 rounded-2xl p-6 flex items-center gap-5
        shadow-md hover:shadow-xl
        dark:border dark:border-base-300
        transition inter
        cursor-pointer
      "
    >
      {/* Icon */}
      <div
        className={`
          w-14 h-14 rounded-xl flex items-center justify-center
          bg-linear-to-br ${gradient} text-white
          shadow-md
        `}
      >
        {React.cloneElement(icon, { className: "w-7 h-7" })}
      </div>

      {/* Text */}
      <div>
        <h3 className="text-lg font-semibold text-base-content">
          {title}
        </h3>
        <p className="text-sm text-base-content/70">
          {desc}
        </p>
      </div>
    </motion.div>
  </Link>
);

export default DashboardHome;