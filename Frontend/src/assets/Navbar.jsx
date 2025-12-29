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
  FaCreditCard,
  FaSignOutAlt,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

export default function Navbar({ onToggleTheme, isDark, userName }) {
  const [open, setOpen] = useState(false); 
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

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

  // Fetch notifications (commented - using dummy data)
  useEffect(() => {
    // Uncomment below to fetch from backend
    /*
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
    */

    // Dummy data
    const dummyNotifications = [
      {
        id: 1,
        type: "success",
        title: "Payment Successful",
        message: "Your payment of $99.99 has been processed successfully",
        time: "2 min ago",
        read: false,
      },
      {
        id: 2,
        type: "warning",
        title: "Storage Almost Full",
        message: "You've used 95% of your storage space",
        time: "1 hour ago",
        read: false,
      },
      {
        id: 3,
        type: "info",
        title: "New Feature Available",
        message: "Check out our new dashboard analytics feature",
        time: "3 hours ago",
        read: false,
      },
      {
        id: 4,
        type: "success",
        title: "Profile Updated",
        message: "Your profile information has been updated successfully",
        time: "5 hours ago",
        read: true,
      },
      {
        id: 5,
        type: "info",
        title: "Maintenance Schedule",
        message: "System maintenance scheduled for tonight at 2 AM",
        time: "1 day ago",
        read: true,
      },
      {
        id: 6,
        type: "warning",
        title: "Password Expiring Soon",
        message: "Your password will expire in 7 days",
        time: "2 days ago",
        read: true,
      },
    ];
    setNotifications(dummyNotifications);
  }, []);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    
    // Uncomment to update backend
    /*
    fetch(`/api/notifications/${id}/read`, {
      method: 'PUT',
    }).catch(error => console.error('Error marking as read:', error));
    */
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    
    // Uncomment to update backend
    /*
    fetch('/api/notifications/mark-all-read', {
      method: 'PUT',
    }).catch(error => console.error('Error marking all as read:', error));
    */
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch(type) {
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "warning":
        return <FaExclamationCircle className="text-yellow-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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

                {/* NOTIFICATIONS DROPDOWN */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notifications List - Show first 3 */}
                    <div className="overflow-y-auto flex-1">
                      {notifications.slice(0, 3).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                            !notif.read ? 'bg-purple-50 dark:bg-purple-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notif.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {notif.time}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          setShowAllNotifications(true);
                          setNotificationsOpen(false);
                        }}
                        className="w-full text-center text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
                  <span className="hidden md:block text-sm font-medium text-red-700 dark:text-gray-300">
                    {userName}
                  </span>
                  <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>

                {/* DROPDOWN MENU */}
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

      {/* ALL NOTIFICATIONS MODAL */}
      {showAllNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[5000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                All Notifications
              </h2>
              <button
                onClick={() => setShowAllNotifications(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <FaBell className="text-5xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                        !notif.read ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-purple-600 rounded-full mt-1 ml-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={markAllAsRead}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Mark All as Read
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}