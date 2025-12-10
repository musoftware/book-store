import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Navbarr = () => {
  const favorites = useSelector((state) => state.favorite);
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-white font-semibold text-lg hover:text-blue-200 transition-colors duration-200 ${
                  isActive ? "text-blue-200 underline decoration-2 underline-offset-4" : ""
                }`
              }
            >
              Home
            </NavLink>
            <div className="relative">
              <NavLink
                to="/favorite"
                className={({ isActive }) =>
                  `text-white font-semibold text-lg hover:text-blue-200 transition-colors duration-200 ${
                    isActive ? "text-blue-200 underline decoration-2 underline-offset-4" : ""
                  }`
                }
              >
                Favorite
              </NavLink>
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-6 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {favorites.length}
                </span>
              )}
            </div>
          </div>
          <div className="text-white font-bold text-xl">
            📚 Book Store
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbarr;
