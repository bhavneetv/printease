// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaSearch,
  FaMoon,
  FaSun,
  FaBell,
  FaChevronDown,
  FaCreditCard,
  FaSignOutAlt
} from "react-icons/fa";

export default function Navbar({ onToggleSidebar, onToggleTheme, isDark, userName }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 z-30 w-full md:w-[calc(100%-16rem)]">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={onToggleSidebar} className="p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaBars className="text-xl" />
            </button>

            <div className="relative ml-3 w-64 hidden sm:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded-lg pl-10 p-2.5 text-gray-900 dark:text-white w-full focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={onToggleTheme} className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>

            <button className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaBell className="text-lg" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <div className="relative" ref={ref}>
              <button onClick={() => setOpen(!open)} className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=667eea&color=fff&bold=true`}
                  className="w-9 h-9 rounded-full"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">{userName}</span>
                <FaChevronDown className="text-xs text-gray-500" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <a className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FaCreditCard className="mr-2" /> Settings
                  </a>
                  <a className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <FaSignOutAlt className="mr-2" /> Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
