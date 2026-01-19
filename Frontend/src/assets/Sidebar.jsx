// src/components/Sidebar.jsx
import React from "react";
import { logout } from "./logout";
import { useState, useEffect } from "react";
import {
  FaPrint,
  FaHome,
  FaUpload,
  FaShoppingBag,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaUsers, // Added for User Management
  FaChartLine // Added for Admin Dashboard
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ collapsed, closeSidebar }) {
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      setUser(null);
      setRole(null);
      return;
    }

    try {
      setUser(storedUser);
      const decoded = atob(storedUser);
      const info = JSON.parse(decoded);
      setRole(info?.role);
    } catch (err) {
      console.error("Invalid user data", err);
      sessionStorage.removeItem("user");
      setUser(null);
      setRole(null);
    }
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 z-[5000] w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 shadow-2xl transform transition-transform duration-300 ease-in-out
      ${collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <FaPrint className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-white">PrintEase</span>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="md:hidden text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Logic */}
        {role === "admin" ? (
          // --- ADMIN NAVIGATION ---
          <nav className="space-y-2">
            <NavItem
              to="/AdminDashboard"
              icon={FaChartLine}
              label="Dashboard"
              isActive={location.pathname === "/AdminDashboard"}
              onClick={closeSidebar}
            />
            <NavItem
              to="/UserManagement"
              icon={FaUsers}
              label="User Management"
              isActive={location.pathname === "/UserManagement"}
              onClick={closeSidebar}
            />
             <NavItem
              to="/Profile"
              icon={FaUser}
              label="Profile"
              isActive={location.pathname === "/Profile"}
              onClick={closeSidebar}
            />
            <NavItem
              style={{ display: user ? "none" : "block" }}
              to="/login"
              icon={FaSignOutAlt}
              label={user ? "Logout" : "Login"}
              isActive={location.pathname === "/Login"}
              onClick={logout}
            />
          </nav>
        ) : role === "shopkeeper" ? (
          // --- SHOPKEEPER NAVIGATION ---
          <nav className="space-y-2">
            <NavItem
              to="/ShopDashboard"
              icon={FaHome}
              label="Shop Dashboard"
              isActive={location.pathname === "/ShopDashboard"}
              onClick={closeSidebar}
            />
            <NavItem
              to="/PrintOrders"
              icon={FaHome}
              label="Print Orders"
              isActive={location.pathname === "/PrintOrders"}
              onClick={closeSidebar}
            />
            <NavItem
              to="/OrderDetailsPage"
              icon={FaHome}
              label="Order Details Page"
              isActive={location.pathname === "/OrderDetailsPage"}
              onClick={closeSidebar}
            />
            <NavItem
              to="/ShopOrders"
              icon={FaHome}
              label="Shop Orders"
              isActive={location.pathname === "/ShopOrders"}
              onClick={closeSidebar}
            />
            <NavItem
              to="/ShopProfile"
              icon={FaUser}
              label="Profile"
              isActive={location.pathname === "/Profile"}
              onClick={closeSidebar}
            />
            <NavItem
              style={{ display: user ? "none" : "block" }}
              to="/login"
              icon={FaSignOutAlt}
              label={user ? "Logout" : "Login"}
              isActive={location.pathname === "/Login"}
              onClick={logout}
            />
          </nav>
        ) : (
          // --- USER (DEFAULT) NAVIGATION ---
          <nav className="space-y-2">
            <NavItem
              to="/"
              icon={FaHome}
              label="Dashboard"
              isActive={location.pathname === "/"}
              onClick={closeSidebar}
            />
            <NavItem
              to="/FileUpload"
              icon={FaUpload}
              label="Upload File"
              isActive={location.pathname === "/FileUpload"}
              onClick={closeSidebar}
            />
            <NavItem
              to="/Myorders"
              icon={FaShoppingBag}
              label="My Orders"
              isActive={location.pathname === "/Myorders"}
              onClick={closeSidebar}
            />
            <NavItem
              style={{ display: user ? "none" : "block" }}
              to="/login"
              icon={FaSignOutAlt}
              label={user ? "Logout" : "Login"}
              isActive={location.pathname === "/Login"}
              onClick={logout}
            />
            <NavItem
              to="/ShopOrderPage"
              icon={FaSignOutAlt}
              label="Shop Order Page"
              isActive={location.pathname === "/ShopOrderPage"}
              onClick={closeSidebar}
            />
          </nav>
        )}
      </div>
    </aside>
  );
}

// Reusable Navigation Item Component
function NavItem({ to, icon: Icon, label, isActive, onClick, style }) {
  return (
    <Link to={to} style={style}>
      <div
        onClick={onClick}
        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer ${
          isActive
            ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
            : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="ml-3 font-medium">{label}</span>

        {/* Hover indicator bar */}
        {!isActive && (
          <div className="ml-auto w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 group-hover:w-2 transition-all duration-200 rounded-full" />
        )}
      </div>
    </Link>
  );
}