// src/Applayout/Applayout.jsx
import React, { useState } from "react";
import Sidebar from "../assets/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import Navbar from "../assets/Navbar.jsx";

function Applayout() {
  const [isDark, setIsDark] = useState(false);
  const user = sessionStorage.getItem("user") || null;
  let name;
  if (!user) {
    name = "Guest";
  } else {
    const userData = JSON.parse(atob(user));
    name = userData.name;
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navbar with Sidebar integrated */}
        <Navbar
          onToggleTheme={() => setIsDark(!isDark)}
          isDark={isDark}
          userName={name}
        />

        {/* Main Content */}
        <div className="md:ml-64 pt-16">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Applayout;
