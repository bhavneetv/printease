// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaSearch,
  FaMoon,
  FaSun,
  FaBell,
  FaUser,
  FaChevronDown,
  FaSignOutAlt,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaRedoAlt // Added for Reset Icon
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { requestPermission, onMessageListener } from '../firebase.js';
import toast from 'react-hot-toast';
import { isLoggedIn } from "./auth.jsx";

export default function Navbar({ onToggleTheme, isDark, userName }) {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  
  // State to track if token exists in backend (0 = no, 1 = yes)
  const [hasToken, setHasToken] = useState(false);
  const [loadingTokenCheck, setLoadingTokenCheck] = useState(true);

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

  // Close notifications dropdown when clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // --- EXISTING NOTIFICATION FETCHING LOGIC (Unchanged) ---
  useEffect(() => {
    // Dummy data
    const dummyNotifications = [
      { id: 1, type: "success", title: "Payment Successful", message: "Your payment of $99.99 has been processed successfully", time: "2 min ago", read: false },
      { id: 2, type: "warning", title: "Storage Almost Full", message: "You've used 95% of your storage space", time: "1 hour ago", read: false },
      { id: 3, type: "info", title: "New Feature Available", message: "Check out our new dashboard analytics feature", time: "3 hours ago", read: false },
    ];
    setNotifications(dummyNotifications);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success": return <FaCheckCircle className="text-green-500" />;
      case "warning": return <FaExclamationCircle className="text-yellow-500" />;
      case "info": return <FaInfoCircle className="text-blue-500" />;
      default: return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);


  // ==========================================
  //  NOTIFICATION TOKEN LOGIC (UPDATED)
  // ==========================================

  // 1. Check if token exists on Mount
  useEffect(() => {
    const performCheck = async () => {
      const user_idt = returnID();
      
      
      if (user_idt) {
        await checkTokenExists(user_idt);
      }
      setLoadingTokenCheck(false);
    };
    performCheck();
  }, []);

  const returnID = ()=>{
     const user = sessionStorage.getItem("user");
     if (user) {
      try {
        const userData = JSON.parse(atob(user));
        return userData.id;
      } catch (e) {
        return null;
      }
     }
     return null;
  }
  const checkTokenExists = async (user_idt) => {
    try {
      // Using VITE_API for consistency
      const response = await fetch(import.meta.env.VITE_API + "backend/send-not.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user_idt,
        }),
      });
      
      
      const data = await response.json();
      // Logic: If data is 1 (or contains 1), set true. Else false.
      // Adjust this condition based on exactly what your PHP returns (e.g. data.status === 1)
      if (data === 1 || data.status === 1 || data === "1") {
        setHasToken(true);
      } else {
        setHasToken(false);
      }
    } catch (err) {
      console.error("Failed to check token:", err);
      setHasToken(false);
    }
  };

  const saveTokenToBackend = async (token) => {
    try {
      const user_idt = isLoggedIn("user");
      
      await fetch(import.meta.env.VITE_API + "api/save_token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user_idt,
          fcm_token: token
        }),
      });
      console.log("Token saved/updated in database");
      
      // After saving, update local state so the button flips to 'Reset' (or stays 'Reset')
      setHasToken(true);
    } catch (err) {
      console.error("Failed to save token:", err);
      toast.error("Failed to save notification settings.");
    }
  };

  // Handles both Enabling and Resetting
  const handleNotificationAction = async () => {
    const loadingToast = toast.loading(hasToken ? "Resetting notifications..." : "Enabling notifications...");
    
    try {
      // requestPermission handles generating/retrieving the token
      const token = await requestPermission();

      if (token) {
        await saveTokenToBackend(token);
        toast.dismiss(loadingToast);
        toast.success(hasToken ? "Notifications Reset Successfully!" : "Notifications Enabled!");
      } else {
        toast.dismiss(loadingToast);
        toast.error("Permission denied or failed to get token.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    const unsubscribe = onMessageListener().then((payload) => {
      if (payload) {
        console.log('Foreground message received:', payload);
        toast((t) => (
          <span>
            <b>{payload.notification.title}</b>
            <br />
            {payload.notification.body}
          </span>
        ));
      }
    });
    return () => {};
  }, []);

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        closeSidebar={() => setSidebarCollapsed(true)}
      />

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 md:left-64 right-0 z-[4000]">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FaBars className="text-xl" />
              </button>

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

            {/* NOTIFICATION BUTTON LOGIC */}
            <div>
              {!loadingTokenCheck && (
                <>
                  {!hasToken ? (
                    // SHOW ENABLE BUTTON (If backend returned 0)
                    <button
                      onClick={handleNotificationAction}
                      className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition-colors flex items-center gap-2"
                    >
                      <FaBell /> Enable Notifications
                    </button>
                  ) : (
                    // SHOW RESET BUTTON (If backend returned 1)
                    <button
                      onClick={handleNotificationAction}
                      className="mt-4 md:mt-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition-colors flex items-center gap-2"
                    >
                      <FaRedoAlt className="text-xs" /> Reset Notifications
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleTheme}
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon />}
              </button>

              {/* NOTIFICATIONS BELL */}
              <div ref={notificationRef} className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <FaBell className="text-lg" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* DROPDOWN CONTENT (Unchanged) */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-purple-600 dark:text-purple-400 hover:underline">Mark all as read</button>
                      )}
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {notifications.slice(0, 3).map((notif) => (
                        <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${!notif.read ? 'bg-purple-50 dark:bg-purple-900/10' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">{getNotificationIcon(notif.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                            </div>
                            {!notif.read && <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button onClick={() => { setShowAllNotifications(true); setNotificationsOpen(false); }} className="w-full text-center text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium">View All Notifications</button>
                    </div>
                  </div>
                )}
              </div>

              {/* USER DROPDOWN (Unchanged) */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=667eea&color=fff&bold=true`}
                    alt={userName}
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="hidden md:block text-sm font-medium text-red-700 dark:text-gray-300">{userName}</span>
                  <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <Link to="/Profile">
                      <a className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-t-lg transition-colors duration-200">
                        <FaUser className="mr-2" /> Profile
                      </a>
                    </Link>
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

      {/* ALL NOTIFICATIONS MODAL (Unchanged) */}
      {showAllNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[5000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Notifications</h2>
              <button onClick={() => setShowAllNotifications(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"><FaTimes /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <FaBell className="text-5xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${!notif.read ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800' : ''}`}>
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">{getNotificationIcon(notif.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                            {!notif.read && <div className="w-2 h-2 bg-purple-600 rounded-full mt-1 ml-2"></div>}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                <button onClick={markAllAsRead} className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-medium">Mark All as Read</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}