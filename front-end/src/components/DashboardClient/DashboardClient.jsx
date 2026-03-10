"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiBookAdd } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaParachuteBox } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { MdOutlinePayment } from "react-icons/md";
import { RiContactsBook2Fill } from "react-icons/ri";
import { TbJewishStarFilled } from "react-icons/tb";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import useRole from "@/Hooks/UseRole";
import useAuth from "@/hooks/UseAuth";
import ReadMartLogo from "@/components/Logo/ReadMartLogo";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

const DashboardClient = ({ children }) => {
  const { role, roleLoading } = useRole();
  const pathname = usePathname();

  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "readmart"
      : "readmart",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isActive = (path) => pathname === path;
  const { loading } = useAuth();

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative">
            <span className="loading loading-spinner text-primary loading-xl"></span>
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl playfair font-bold text-base-content mt-8 text-center">
          It takes only 10 seconds
        </h1>
        <h2 className="text-xl md:text-4xl playfair text-base-content/70 mt-2 text-center">
          Please be patient
        </h2>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Drawer Content */}
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-100/80 backdrop-blur-xl border-b border-base-300 sticky top-0 z-30">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-3">
              {/* Drawer toggle button - PRESERVED EXACTLY */}
              <label 
                htmlFor="my-drawer-4" 
                aria-label="open sidebar" 
                className="btn btn-square btn-ghost"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                  <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                  <path d="M9 4v16"></path>
                  <path d="M14 10l2 2l-2 2"></path>
                </svg>
              </label>

              {/* Navbar Title - PRESERVED with styling */}
              <div className="px-4">
                <h1 className="text-2xl md:text-2xl font-bold playfair text-primary">
                  {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard` : 'Dashboard'}
                </h1>
              </div>
            </div>

            {/* Right section - modern additions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === "readmart" ? "readmart-dark" : "readmart")}
                className="btn btn-ghost btn-circle btn-sm"
                aria-label="Toggle theme"
              >
                {theme === "readmart" ? (
                  <BsMoonStarsFill className="text-lg" />
                ) : (
                  <BsSunFill className="text-lg" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Decorative line */}
        <div className="h-0.5 w-full bg-linear-to-r from-primary via-green-600 to-primary"></div>

        {/* Page content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="flex min-h-full flex-col items-start bg-base-200/95 backdrop-blur-xl border-r border-base-300 is-drawer-close:w-14 is-drawer-open:w-64 transition-all duration-300">
          
          {/* Sidebar header - visible when open */}
          <div className="w-full p-4 border-b border-base-300 is-drawer-close:hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg"><ReadMartLogo></ReadMartLogo></span>
              </div>
              <div>
                <h2 className="font-semibold text-base-content playfair">ReadMart</h2>
                <p className="text-xs text-base-content/60 inter">v2.0.0</p>
              </div>
            </div>
          </div>

          {/* Sidebar header - visible when closed */}
          <div className="w-full p-4 border-b border-base-300 is-drawer-open:hidden">
            <div className="flex justify-center">
              <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl"><ReadMartLogo></ReadMartLogo></span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="menu w-full grow px-2 py-4 space-y-1">
            {/* Home */}
            <li>
              <Link
                href="/"
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive("/") 
                    ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                    : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                }`}
                data-tip="Homepage"
              >
                <IoHomeOutline className={`text-lg ${isActive("/") ? "text-primary" : ""}`} />
                <span className="is-drawer-close:hidden inter text-sm">Homepage</span>
                {isActive("/") && (
                  <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive("/dashboard") 
                    ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                    : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                }`}
                data-tip="Dashboard homepage"
              >
                <MdOutlineSpaceDashboard className={`text-lg ${isActive("/dashboard") ? "text-primary" : ""}`} />
                <span className="is-drawer-close:hidden inter text-sm">Dashboard homepage</span>
                {isActive("/dashboard") && (
                  <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                )}
              </Link>
            </li>

            {/* Profile */}
            <li>
              <Link
                href="/dashboard/my-profile"
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive("/dashboard/my-profile") 
                    ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                    : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                }`}
                data-tip="My Profile"
              >
                <CgProfile className={`text-lg ${isActive("/dashboard/my-profile") ? "text-primary" : ""}`} />
                <span className="is-drawer-close:hidden inter text-sm">My Profile</span>
                {isActive("/dashboard/my-profile") && (
                  <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                )}
              </Link>
            </li>

            {/* USER MENU */}
            {role === "user" && (
              <>
                <li className="pt-2 is-drawer-close:hidden">
                  <div className="px-3 py-1">
                    <span className="text-xs font-semibold text-base-content/40 inter tracking-wider">USER</span>
                  </div>
                </li>
                
                <li>
                  <Link
                    href="/dashboard/user/my-orders"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive("/dashboard/user/my-orders") 
                        ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                        : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                    }`}
                    data-tip="My Orders"
                  >
                    <FaParachuteBox className={`text-lg ${isActive("/dashboard/user/my-orders") ? "text-primary" : ""}`} />
                    <span className="is-drawer-close:hidden inter text-sm">My Orders</span>
                    {isActive("/dashboard/user/my-orders") && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                    )}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/user/my-wishlist"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive("/dashboard/user/my-wishlist") 
                        ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                        : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                    }`}
                    data-tip="My Wishlist"
                  >
                    <TbJewishStarFilled className={`text-lg ${isActive("/dashboard/user/my-wishlist") ? "text-primary" : ""}`} />
                    <span className="is-drawer-close:hidden inter text-sm">My Wishlist</span>
                    {isActive("/dashboard/user/my-wishlist") && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                    )}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/user/Payment-history"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive("/dashboard/user/Payment-history") 
                        ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                        : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                    }`}
                    data-tip="Payment History"
                  >
                    <MdOutlinePayment className={`text-lg ${isActive("/dashboard/user/Payment-history") ? "text-primary" : ""}`} />
                    <span className="is-drawer-close:hidden inter text-sm">Payment History</span>
                    {isActive("/dashboard/user/Payment-history") && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                    )}
                  </Link>
                </li>
              </>
            )}

            {/* ADMIN MENU */}
            {role === "admin" && (
              <>
                <li className="pt-2 is-drawer-close:hidden">
                  <div className="px-3 py-1">
                    <span className="text-xs font-semibold text-base-content/40 inter tracking-wider">ADMIN</span>
                  </div>
                </li>
                
                <li>
                  <Link
                    href="/dashboard/admin/manageBooks"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive("/dashboard/admin/manageBooks") 
                        ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                        : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                    }`}
                    data-tip="Manage Books"
                  >
                    <RiContactsBook2Fill className={`text-lg ${isActive("/dashboard/admin/manageBooks") ? "text-primary" : ""}`} />
                    <span className="is-drawer-close:hidden inter text-sm">Manage Books</span>
                    {isActive("/dashboard/admin/manageBooks") && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                    )}
                  </Link>
                </li>
              </>
            )}

            {/* LIBRARIAN MENU */}
            {role === "librarian" && (
              <>
                <li className="pt-2 is-drawer-close:hidden">
                  <div className="px-3 py-1">
                    <span className="text-xs font-semibold text-base-content/40 inter tracking-wider">LIBRARIAN</span>
                  </div>
                </li>
                
                <li>
                  <Link
                    href="/dashboard/librarian/addBooks"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive("/dashboard/librarian/addBooks") 
                        ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                        : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                    }`}
                    data-tip="Add Books"
                  >
                    <BiBookAdd className={`text-lg ${isActive("/dashboard/librarian/addBooks") ? "text-primary" : ""}`} />
                    <span className="is-drawer-close:hidden inter text-sm">Add Books</span>
                    {isActive("/dashboard/librarian/addBooks") && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                    )}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/librarian/my-books"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive("/dashboard/librarian/my-books") 
                        ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                        : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                    }`}
                    data-tip="My Books"
                  >
                    <ImBooks className={`text-lg ${isActive("/dashboard/librarian/my-books") ? "text-primary" : ""}`} />
                    <span className="is-drawer-close:hidden inter text-sm">My Books</span>
                    {isActive("/dashboard/librarian/my-books") && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/librarian/librarian-orders"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive("/dashboard/librarian/librarian-orders") 
                        ? "bg-linear-to-r from-primary/20 to-primary/5 text-primary font-medium" 
                        : "hover:bg-base-300/50 text-base-content/70 hover:text-base-content"
                    }`}
                    data-tip="librarian-orders"
                  >
                    <ClipboardDocumentListIcon  className={`text-lg ${isActive("/dashboard/librarian/librarian-orders") ? "text-primary" : ""}`} />
                    <span className="is-drawer-close:hidden inter text-sm">Librarian Orders</span>
                    {isActive("/dashboard/librarian/librarian-orders") && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full is-drawer-close:hidden"></span>
                    )}
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Sidebar footer */}
          <div className="w-full p-4 border-t border-base-300">
            <div className={`flex items-center gap-3 ${!isActive && 'justify-center'}`}>
              <div className="avatar placeholder">
                <div className="bg-linear-to-br from-primary to-accent text-primary-content rounded-full w-8 h-8">
                  <span className="text-xs">U</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 is-drawer-close:hidden">
                <p className="text-sm font-medium text-base-content truncate inter">User Account</p>
                <p className="text-xs text-base-content/40 truncate inter capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;