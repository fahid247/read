"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiBookAdd } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaParachuteBox, FaUsers } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { MdOutlinePayment } from "react-icons/md";
import { RiContactsBook2Fill } from "react-icons/ri";
import { FaBookBookmark } from "react-icons/fa6";
import { TbJewishStarFilled } from "react-icons/tb";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import useRole from "@/Hooks/UseRole";
import useAuth from "@/hooks/UseAuth";

const DashboardLayout = ({ children }) => {
  const { role, roleLoading } = useRole();
  const pathname = usePathname();

  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isActive = (path) => pathname === path;
  const {loading } = useAuth();
  if (roleLoading || loading) return <div className="text-primary flex flex-col justify-center items-center min-w-screen  min-h-screen">
    <span className="loading loading-spinner text-primary loading-xl "></span>
    <h1 className="text-5xl playfair">It take&apos;s only 10 seconds</h1>
    <h2 className="text-4xl playfair">Please be paitent</h2>
    
  </div>;
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Drawer Content */}
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300 flex justify-between">
          <div className="flex items-center gap-3">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              ☰
            </label>

            {roleLoading ? (
              <h1 className="text-base-content playfair capitalize text-[clamp(2rem,3.5vw,3.75rem)] font-bold">
                Dashboard
              </h1>
            ) : (
              <h1 className="text-base-content playfair capitalize text-[clamp(2rem,3.5vw,3.75rem)] font-bold">
                {role} Dashboard
              </h1>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() =>
              setTheme(theme === "readmart" ? "readmart-dark" : "readmart")
            }
            className="btn btn-ghost btn-circle mr-2"
          >
            {theme === "readmart" ? (
              <BsMoonStarsFill className="text-lg" />
            ) : (
              <BsSunFill className="text-lg" />
            )}
          </button>
        </nav>

        <div className="w-full h-1 bg-primary"></div>

        {/* Page Content */}
        {children}
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">
            {/* Home */}
            <li>
              <Link
                href="/"
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                  isActive("/") ? "active" : ""
                }`}
                data-tip="Homepage"
              >
                <IoHomeOutline></IoHomeOutline>
                <span className="is-drawer-close:hidden">Home page</span>
              </Link>
            </li>

            {/* Profile */}
            <li>
              <Link
                href="/dashboard/my-profile"
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                  isActive("/dashboard/my-profile") ? "active" : ""
                }`}
                data-tip="My profile"
              >
                <CgProfile />
                <span className="is-drawer-close:hidden">My profile</span>
              </Link>
            </li>

            {/* USER */}
            {role === "user" && (
              <>
                <li>
                  <Link
                    href="/dashboard/my-orders"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                      isActive("/dashboard/my-orders") ? "active" : ""
                    }`}
                    data-tip="My orders"
                  >
                    <FaParachuteBox />
                    <span className="is-drawer-close:hidden">My orders</span>
                  </Link>
                </li>
              </>
            )}

            {/* ADMIN */}
            {role === "admin" && (
              <>
                <li>
                  <Link
                    href="/dashboard/manageBooks"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                      isActive("/dashboard/manageBooks") ? "active" : ""
                    }`}
                    data-tip="Manage Books"
                  >
                    <RiContactsBook2Fill />
                    <span className="is-drawer-close:hidden">Manage Books</span>
                  </Link>
                </li>
              </>
            )}

            {/* LIBRARIAN */}
            {role === "librarian" && (
              <>
                <li>
                  <Link
                    href="/dashboard/addBooks"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                      isActive("/dashboard/addBooks") ? "active" : ""
                    }`}
                    data-tip="Add Books"
                  >
                    <BiBookAdd />
                    <span className="is-drawer-close:hidden">Add Books</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/addBooks"
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                      isActive("/dashboard/addBooks") ? "active" : ""
                    }`}
                    data-tip="Add Books"
                  >
                    <ImBooks></ImBooks>
                    <span className="is-drawer-close:hidden">My Books</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
