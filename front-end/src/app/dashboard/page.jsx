"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/Hooks/UseAuth";
import useRole from "@/hooks/UseRole";
import useAxiosSecure from "@/Hooks/UseAxiosSecure";

import {
  UserIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  BookmarkIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import { motion } from "framer-motion";
import { TbJewishStar } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import Loading from "../Loading";
import Image from "next/image";

const DashboardHome = () => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();

  // Fetch user's orders count and recent orders
  const {
    data: ordersData = { count: 0, recent: [] },
    isLoading: ordersLoading,
  } = useQuery({
    queryKey: ["user-orders-stats", user?.email],
    enabled: !!user?.email && role === "user",
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      const orders = res.data;
      return {
        count: orders.length,
        recent: orders.slice(0, 3).map((order) => ({
          id: order._id,
          bookName: order.bookName,
          status: order.orderStatus,
          date: order.orderedAt,
          amount: order.price,
        })),
      };
    },
  });

  // Fetch user's wishlist count
  const { data: wishlistCount = 0, isLoading: wishlistLoading } = useQuery({
    queryKey: ["user-wishlist-count", user?.email],
    enabled: !!user?.email && role === "user",
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist/${user.email}`);
      return res.data.length;
    },
  });

  // Fetch user's payment history count and total spent
  const {
    data: paymentData = { count: 0, total: 0, recent: [] },
    isLoading: paymentsLoading,
  } = useQuery({
    queryKey: ["user-payments-stats", user?.email],
    enabled: !!user?.email && role === "user",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments?customerEmail=${user.email}`,
      );
      const payments = res.data;
      return {
        count: payments.length,
        total: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        recent: payments.slice(0, 3).map((payment) => ({
          id: payment._id,
          amount: payment.amount,
          date: payment.paymentDate,
          status: payment.status,
        })),
      };
    },
  });

  // Fetch librarian's books count
  const { data: booksCount = 0, isLoading: booksLoading } = useQuery({
    queryKey: ["librarian-books-count", user?.email],
    enabled: !!user?.email && role === "librarian",
    queryFn: async () => {
      const res = await axiosSecure.get(`/books?librarianEmail=${user.email}`);
      return res.data.length;
    },
  });

  // Fetch librarian's orders count
  const { data: librarianOrdersCount = 0, isLoading: librarianOrdersLoading } =
    useQuery({
      queryKey: ["librarian-orders-count", user?.email],
      enabled: !!user?.email && role === "librarian",
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/orders?librarianEmail=${user.email}`,
        );
        return res.data.length;
      },
    });

  // Fetch admin stats
  const {
    data: adminStats = { users: 0, books: 0, orders: 0 },
    isLoading: adminStatsLoading,
  } = useQuery({
    queryKey: ["admin-stats"],
    enabled: role === "admin",
    queryFn: async () => {
      const [usersRes, booksRes, ordersRes] = await Promise.all([
        axiosSecure.get("/users"),
        axiosSecure.get("/books"),
        axiosSecure.get("/orders"),
      ]);
      return {
        users: usersRes.data.length,
        books: booksRes.data.length,
        orders: ordersRes.data.length,
      };
    },
  });

  // Fetch recent activities based on role
  const { data: recentActivities = [], isLoading: activitiesLoading } =
    useQuery({
      queryKey: ["recent-activities", role, user?.email],
      enabled: !!user?.email,
      queryFn: async () => {
        const activities = [];

        if (role === "user") {
          // Get recent orders
          const ordersRes = await axiosSecure.get(
            `/orders?email=${user.email}&limit=3&sort=-orderedAt`,
          );
          const orders = ordersRes.data.slice(0, 2).map((order) => ({
            type: "order",
            description: `Ordered "${order.bookName}"`,
            date: order.orderedAt,
            status: order.orderStatus,
            amount: order.price,
            icon: ShoppingBagIcon,
            color: "text-primary",
          }));
          activities.push(...orders);

          // Get recent wishlist additions
          const wishRes = await axiosSecure.get(
            `/wishlist/${user.email}?limit=2&sort=-wishedAt`,
          );
          const wishlist = wishRes.data.slice(0, 2).map((item) => ({
            type: "wishlist",
            description: `Added "${item.bookName}" to wishlist`,
            date: item.wishedAt,
            icon: HeartIcon,
            color: "text-accent",
          }));
          activities.push(...wishlist);

          // Get recent payments
          const payRes = await axiosSecure.get(
            `/payments?email=${user.email}&limit=2&sort=-paymentDate`,
          );
          const payments = payRes.data.slice(0, 2).map((payment) => ({
            type: "payment",
            description: `Payment of ৳${payment.amount}`,
            date: payment.paymentDate,
            status: payment.status,
            icon: CreditCardIcon,
            color: "text-success",
          }));
          activities.push(...payments);
        }

        if (role === "librarian") {
          // Get recent orders for librarian's books
          const ordersRes = await axiosSecure.get(
            `/orders?librarianEmail=${user.email}&limit=5&sort=-orderedAt`,
          );
          const orders = ordersRes.data.slice(0, 3).map((order) => ({
            type: "order",
            description: `New order for "${order.bookName}"`,
            date: order.orderedAt,
            status: order.orderStatus,
            icon: ShoppingBagIcon,
            color: "text-primary",
          }));
          activities.push(...orders);
        }

        if (role === "admin") {
          // Get recent user registrations
          const usersRes = await axiosSecure.get(
            "/users?limit=3&sort=-createdAt",
          );
          const users = usersRes.data.slice(0, 2).map((user) => ({
            type: "user",
            description: `New user registered: ${user.name}`,
            date: user.createdAt || new Date(),
            icon: UsersIcon,
            color: "text-info",
          }));
          activities.push(...users);

          // Get recent orders
          const ordersRes = await axiosSecure.get(
            "/orders?limit=3&sort=-orderedAt",
          );
          const orders = ordersRes.data.slice(0, 2).map((order) => ({
            type: "order",
            description: `New order placed`,
            date: order.orderedAt,
            icon: ShoppingBagIcon,
            color: "text-primary",
          }));
          activities.push(...orders);
        }

        // Sort by date and take latest 5
        return activities
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
      },
    });

  if (roleLoading || loading) return <Loading />;

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get role badge color
  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return { color: "from-rose-500 to-red-600", icon: ShieldCheckIcon };
      case "librarian":
        return { color: "from-indigo-500 to-purple-600", icon: BookOpenIcon };
      default:
        return { color: "from-primary to-accent", icon: UserIcon };
    }
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  // Get stats based on role
  const getStats = () => {
    if (role === "user") {
      return [
        {
          label: "Total Orders",
          value: ordersData.count.toString(),
          icon: ShoppingBagIcon,
          color: "text-primary",
          loading: ordersLoading,
        },
        {
          label: "Wishlist",
          value: wishlistCount.toString(),
          icon: HeartIcon,
          color: "text-accent",
          loading: wishlistLoading,
        },
        {
          label: "Payments",
          value: paymentData.count.toString(),
          icon: CreditCardIcon,
          color: "text-success",
          loading: paymentsLoading,
        },
        {
          label: "Total Spent",
          value: `৳${paymentData.total}`,
          icon: DocumentTextIcon,
          color: "text-info",
          loading: paymentsLoading,
        },
      ];
    }

    if (role === "librarian") {
      return [
        {
          label: "My Books",
          value: booksCount.toString(),
          icon: BookOpenIcon,
          color: "text-indigo-500",
          loading: booksLoading,
        },
        {
          label: "Orders",
          value: librarianOrdersCount.toString(),
          icon: ShoppingBagIcon,
          color: "text-blue-500",
          loading: librarianOrdersLoading,
        },
        {
          label: "Pending Orders",
          value: "0",
          icon: ClipboardDocumentListIcon,
          color: "text-amber-500",
        },
        {
          label: "Revenue",
          value: "৳0",
          icon: CreditCardIcon,
          color: "text-green-500",
        },
      ];
    }

    if (role === "admin") {
      return [
        {
          label: "Total Users",
          value: adminStats.users.toString(),
          icon: UsersIcon,
          color: "text-rose-500",
          loading: adminStatsLoading,
        },
        {
          label: "Total Books",
          value: adminStats.books.toString(),
          icon: BookOpenIcon,
          color: "text-indigo-500",
          loading: adminStatsLoading,
        },
        {
          label: "Total Orders",
          value: adminStats.orders.toString(),
          icon: ShoppingBagIcon,
          color: "text-primary",
          loading: adminStatsLoading,
        },
        {
          label: "Revenue",
          value: "৳0",
          icon: ChartBarIcon,
          color: "text-success",
        },
      ];
    }

    return [];
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section with Welcome Card */}
      <div className="relative overflow-hidden bg-linear-to-br from-base-200 to-base-300/50 rounded-3xl p-8 mb-8 border border-base-300">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-12 h-12 bg-linear-to-br from-primary to-green-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                 <span className="text-2xl text-white font-bold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </span>
              </motion.div>

              <div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-base-content/60 text-sm inter"
                >
                  {getGreeting()}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl font-bold playfair"
                >
                  {user?.displayName || user?.email?.split("@")[0] || "User"}!
                </motion.h1>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base-content/70 flex items-center gap-2 text-sm inter"
            >
              <SparklesIcon className="w-4 h-4 text-accent" />
              Welcome to your dashboard. Here&apos;s what&apos;s happening
              today.
            </motion.p>
          </div>

          {/* Role Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r ${roleBadge.color} text-white shadow-lg`}
          >
            <RoleIcon className="w-4 h-4" />
            <span className="text-sm font-semibold capitalize inter">
              {role}
            </span>
          </motion.div>
        </div>

        {/* Quick Stats - Dynamic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-base-100 rounded-xl p-4 border border-base-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-base-content/60 inter">
                  {stat.label}
                </span>
              </div>
              {stat.loading ? (
                <div className="h-6 w-16 bg-base-200 animate-pulse rounded"></div>
              ) : (
                <span className="text-xl font-bold text-base-content">
                  {stat.value}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold playfair text-base-content">
          Quick Actions
        </h2>
        <p className="text-sm text-base-content/40 inter">
          {role === "user" && "Manage your shopping experience"}
          {role === "librarian" && "Manage your books and orders"}
          {role === "admin" && "Control platform settings"}
        </p>
      </div>

      {/* USER DASHBOARD */}
      {role === "user" && (
        <DashboardGrid>
          <DashboardCard
            title="My Orders"
            desc="View your order history and track deliveries"
            icon={<ClipboardDocumentListIcon />}
            gradient="from-primary to-accent"
            link="/dashboard/user/my-orders"
            stat={ordersData.count.toString()}
            loading={ordersLoading}
          />

          <DashboardCard
            title="My Wishlist"
            desc="Books you've saved for later"
            icon={<TbJewishStar />}
            gradient="from-emerald-500 to-teal-500"
            link="/dashboard/user/my-wishlist"
            stat={wishlistCount.toString()}
            loading={wishlistLoading}
          />

          <DashboardCard
            title="Payment History"
            desc="Track all your transactions"
            icon={<MdOutlinePayments />}
            gradient="from-indigo-500 to-purple-500"
            link="/dashboard/user/Payment-history"
            stat={`৳${paymentData.total}`}
            loading={paymentsLoading}
          />

          <DashboardCard
            title="My Profile"
            desc="Manage your personal information"
            icon={<UserIcon />}
            gradient="from-amber-500 to-orange-500"
            link="/dashboard/my-profile"
          />
        </DashboardGrid>
      )}

      {/* LIBRARIAN DASHBOARD */}
      {role === "librarian" && (
        <DashboardGrid>
          <DashboardCard
            title="My Books"
            desc="Manage your book collection"
            icon={<BookOpenIcon />}
            gradient="from-indigo-500 to-violet-500"
            link="/dashboard/librarian/my-books"
            stat={booksCount.toString()}
            loading={booksLoading}
          />

          <DashboardCard
            title="Orders"
            desc="View orders for your books"
            icon={<ClipboardDocumentListIcon />}
            gradient="from-blue-500 to-cyan-500"
            link="/dashboard/librarian/librarian-orders"
            stat={librarianOrdersCount.toString()}
            loading={librarianOrdersLoading}
          />

          <DashboardCard
            title="Add Book"
            desc="Add a new book to collection"
            icon={<PlusCircleIcon />}
            gradient="from-emerald-500 to-green-500"
            link="/dashboard/librarian/addBooks"
          />

          <DashboardCard
            title="My Profile"
            desc="Manage your account"
            icon={<UserIcon />}
            gradient="from-amber-500 to-orange-500"
            link="/dashboard/my-profile"
          />
        </DashboardGrid>
      )}

      {/* ADMIN DASHBOARD */}
      {role === "admin" && (
        <DashboardGrid>
          <DashboardCard
            title="Manage Users"
            desc="Control user roles and permissions"
            icon={<UsersIcon />}
            gradient="from-rose-500 to-pink-500"
            link="/dashboard/all-users"
            stat={adminStats.users.toString()}
            loading={adminStatsLoading}
          />

          <DashboardCard
            title="Manage Books"
            desc="View and manage all books"
            icon={<BookOpenIcon />}
            gradient="from-indigo-500 to-purple-500"
            link="/dashboard/admin/manageBooks"
            stat={adminStats.books.toString()}
            loading={adminStatsLoading}
          />

          <DashboardCard
            title="All Orders"
            desc="Monitor all platform orders"
            icon={<ShoppingBagIcon />}
            gradient="from-yellow-500 to-amber-500"
            link="/dashboard/admin/orders"
            stat={adminStats.orders.toString()}
            loading={adminStatsLoading}
          />

          <DashboardCard
            title="Overview"
            desc="Platform statistics and insights"
            icon={<ChartBarIcon />}
            gradient="from-purple-500 to-pink-500"
            link="/dashboard/overview"
          />
        </DashboardGrid>
      )}

      {/* Recent Activity Section - Dynamic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-base-200/50 rounded-2xl p-6 border border-base-300"
      >
        <h3 className="text-lg font-semibold playfair text-base-content mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {activitiesLoading ? (
            // Loading skeletons
            [1, 2, 3].map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-base-300 rounded-full"></div>
                <div className="h-4 w-48 bg-base-300 animate-pulse rounded"></div>
              </div>
            ))
          ) : recentActivities.length > 0 ? (
            recentActivities.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm group hover:bg-base-100 p-2 rounded-lg transition-colors"
                >
                  <Icon
                    className={`w-4 h-4 ${activity.color} group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-base-content/80 inter flex-1">
                    {activity.description}
                  </span>
                  <span className="text-xs text-base-content/40">
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {activity.status && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : activity.status === "delivered"
                            ? "bg-success/10 text-success"
                            : activity.status === "cancelled"
                              ? "bg-error/10 text-error"
                              : "bg-primary/10 text-primary"
                      }`}
                    >
                      {activity.status}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-base-300 rounded-full"></div>
              <span className="text-base-content/60 inter">
                No recent activity to show
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* GRID - Modernized */
const DashboardGrid = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    {children}
  </motion.div>
);

/* CARD - Modernized with loading state */
const DashboardCard = ({
  title,
  desc,
  icon,
  gradient,
  link,
  stat,
  loading,
}) => (
  <Link href={link}>
    <motion.div
      whileHover={{
        y: -6,
        boxShadow:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative bg-base-100 rounded-2xl p-6 border border-base-300 hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex items-start gap-4">
        {/* Icon with gradient background */}
        <div
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center
            bg-linear-to-br ${gradient} text-white
            shadow-lg group-hover:scale-110 transition-transform duration-300
            relative overflow-hidden
          `}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          {React.cloneElement(icon, { className: "w-7 h-7 relative z-10" })}
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-base-content group-hover:text-primary transition-colors inter">
              {title}
            </h3>
            {stat &&
              (loading ? (
                <div className="h-5 w-12 bg-base-200 animate-pulse rounded-full"></div>
              ) : (
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {stat}
                </span>
              ))}
          </div>
          <p className="text-sm text-base-content/60 mt-1 inter">{desc}</p>

          {/* Arrow indicator */}
          <div className="flex items-center gap-1 mt-3 text-primary/60 group-hover:text-primary transition-colors">
            <span className="text-xs font-medium">View</span>
            <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

export default DashboardHome;
