import React from "react";
import logo from "./../assets/todo.webp";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <nav className="relative w-full flex items-center justify-between py-4 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg">
        <div className="container-fluid w-full flex items-center justify-between px-6">
          <div className="container-fluid">
            <Link
              className="flex items-center text-gray-900 hover:text-gray-900 focus:text-gray-900 mt-2 lg:mt-0 mr-1"
              to="/"
            >
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-cyan-600">
                ToDo{" "}
              </span>
              <img
                src={logo}
                alt="logo"
                style={{ display: "inline-block ", width: 40, height: 40 }}
                loading="lazy"
              />
            </Link>
          </div>
          <button className="uppercase">logout</button>
        </div>
      </nav>
    </>
  );
};

export default Header;
