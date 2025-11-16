// src/components/Sidebar.jsx
import React from "react";
import {
  FaPrint,
  FaHome,
  FaUpload,
  FaShoppingBag,
  FaCreditCard,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar({ collapsed }) {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ${
        collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
      }`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaPrint className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">PrintEase</span>
          </div>
        </div>

        <nav className="space-y-2">
       <Link to="/">
          <div className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <FaHome className="w-5" />
            <span className="ml-3">Dashboard</span>
          </div>
       </Link>

      <Link to="/FileUpload">
          <div className="flex items-center px-4 py-3 text-white bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
            <FaUpload className="w-5" />
            <span className="ml-3 font-medium">Upload File</span>
          </div>
      </Link>

       <Link to="/Myorders">
       
          <div className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <FaShoppingBag className="w-5" />
            <span className="ml-3">My Orders</span>
          </div>
       </Link>

          <a className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <FaCreditCard className="w-5" />
            <span className="ml-3">Payments</span>
          </a>

        <Link to="/Profile">
          <div className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <FaUser className="w-5" />
            <span className="ml-3">Profile</span>
          </div>
        </Link>

          <a className="flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <FaSignOutAlt className="w-5" />
            <span className="ml-3">Logout</span>
          </a>
        </nav>
      </div>
    </aside>
  );
}
