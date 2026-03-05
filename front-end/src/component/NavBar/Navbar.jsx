import Image from "next/image";
import React from "react";
import brand from "../../../public/Screenshot_2026-03-02_191055-removebg-preview.png";


const Navbar = () => {
  return (
    <div className="navbar bg-base-100/70 sm:px-32 sticky top-0 z-50 max-w-360">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">
          <Image
            src={brand}
            width={120}
            height={50}
            alt="Picture of the Brand"
          />
        </a>
        <div className="hidden lg:flex ">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Find Jobsss</a>
            </li>
            <li>
              <a>Browse Companiesssss</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex"></div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <div className="lg:flex gap-4 hidden ">
          <a className="btn ">Login</a>
          <div className="border-l-2 border-[#D6DDEB] h-10 mx-4"></div>
          <a className="btn bg-primary">SignUp</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
