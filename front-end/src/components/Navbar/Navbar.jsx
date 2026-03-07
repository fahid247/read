"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  IoBookOutline,
  IoHomeOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { MdOutlineConnectWithoutContact, MdOutlineDashboard } from "react-icons/md";
import { PiHandTap } from "react-icons/pi";
import Swal from "sweetalert2";
import Image from "next/image";
import ReadMartLogo from "../Logo/ReadMartLogo";
import UseAuth from "@/hooks/UseAuth";

const NavBar = () => {
  const pathname = usePathname();
  const { user, logOut } = UseAuth();

  // ================== Theme State ==================
  const [theme, setTheme] = useState("readmart");

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);

    // Apply theme to html
    document.documentElement.setAttribute("data-theme", savedTheme || theme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggle = (e) => {
    setTheme(e.target.checked ? "readmart-dark" : "readmart");
  };

  // ================== Nav Items ==================
  const navItem = (href, label, Icon) => {
    const active = pathname === href;
    return (
      <li key={label}>
        <Link
          href={href}
          className={`flex items-center gap-2 px-3 py-2 transition-all duration-300
          ${
            active
              ? "text-primary font-semibold border-b-2 border-primary"
              : "hover:text-primary"
          }`}
        >
          <Icon size={16} />
          {label}
        </Link>
      </li>
    );
  };

  // ================== Logout Handler ==================
  const handleLogOut = () => {
    logOut()
      .then(() =>
        Swal.fire({
          icon: "success",
          title: "Logged out successfully",
          timer: 1200,
          showConfirmButton: false,
        })
      )
      .catch((error) =>
        Swal.fire({
          icon: "error",
          title: "Logout failed",
          text: error.message,
        })
      );
  };

  return (
    <motion.nav
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="navbar sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300 px-6"
    >
      {/* Left */}
      <div className="navbar-start sm:gap-3">
        {/* Mobile Menu */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            ☰
          </div>
          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
            {navItem("/", "Home", IoHomeOutline)}
            {navItem("/allbooks", "Books", IoBookOutline)}
            {navItem("/aboutus", "About Us", IoInformationCircleOutline)}
            {navItem("/contactus", "Contact Us", MdOutlineConnectWithoutContact)}
            {navItem("/howtouse", "How to Use", PiHandTap)}
            {navItem("/dashboard", "Dashboard", MdOutlineDashboard)}
            {user ? (
              <li>
                <button onClick={handleLogOut} className="flex gap-2">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            ) : (
              <li>
                <Link href="/login" className="flex gap-2">
                  <FaUserCircle /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Logo */}
        <Link href="/">
          <ReadMartLogo />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2">
          {navItem("/", "Home", IoHomeOutline)}
          {navItem("/allbooks", "Books", IoBookOutline)}
          {navItem("/aboutus", "About Us", IoInformationCircleOutline)}
          {navItem("/contactus", "Contact Us", MdOutlineConnectWithoutContact)}
          {navItem("/howtouse", "How to Use", PiHandTap)}
          {navItem("/dashboard", "Dashboard", MdOutlineDashboard)}
        </ul>
      </div>

      {/* Right */}
      <div className="navbar-end flex items-center gap-3">
        {/* Theme toggle */}
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            checked={theme === "readmart-dark"}
            onChange={handleToggle}
          />
          <span className="swap-off text-xl">🌞</span>
          <span className="swap-on text-xl">🌙</span>
        </label>

        {/* User */}
        {user ? (
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="profile"
                width={36}
                height={36}
                className="rounded-full object-cover border"
              />
            ) : (
              <FaUserCircle size={32} />
            )}
            <button
              onClick={handleLogOut}
              className="btn btn-sm bg-primary text-primary-content rounded-md"
            >
              <FaSignOutAlt />
            </button>
          </motion.div>
        ) : (
          <Link
            href="/login"
            className="btn btn-sm bg-primary text-primary-content rounded-md"
          >
            Log In
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default NavBar;