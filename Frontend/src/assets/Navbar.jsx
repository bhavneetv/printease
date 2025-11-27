// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaSearch,
  FaMoon,
  FaSun,
  FaBell,
  FaChevronDown,
  FaCreditCard,
  FaSignOutAlt,
} from "react-icons/fa";
import Sidebar from "./Sidebar";

export default function Navbar({ onToggleTheme, isDark, userName }) {
  const [open, setOpen] = useState(false); 
  const menuRef = useRef(null);

  // Close profile dropdown when clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sidebar state - collapsed on mobile by default, visible on desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        closeSidebar={() => setSidebarCollapsed(true)} 
      />

      {/* TOP NAVBAR */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 md:left-64 right-0 z-[4000]">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FaBars className="text-xl" />
              </button>

              {/* Search */}
              <div className="relative ml-3 w-64 hidden sm:block">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded-lg pl-10 p-2.5 text-gray-900 dark:text-white w-full focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* RIGHT SIDE ICONS */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon />}
              </button>

              {/* Bell */}
              <button className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <FaBell className="text-lg" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* USER DROPDOWN */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userName
                    )}&background=667eea&color=fff&bold=true`}
                    alt={userName}
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userName}
                  </span>
                  <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>

                {/* DROPDOWN MENU */}
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <a className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-t-lg transition-colors duration-200">
                      <FaCreditCard className="mr-2" /> Settings
                    </a>
                    <a className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer rounded-b-lg transition-colors duration-200">
                      <FaSignOutAlt className="mr-2" /> Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}