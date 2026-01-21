import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaShoppingBag,
  FaMoneyBillWave,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
  FaEllipsisH,
  FaPlus,
  FaFileExport,
  FaCog,
  FaUserShield,
  FaSync
} from 'react-icons/fa';

import { isLoggedIn } from '../../assets/auth'; 

// --- CONFIGURATION ---
// TODO: Replace this with your actual Backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"; 

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // State for data, loading, and error
  const [data, setData] = useState({
    stats: [],
    recentOrders: [],
    recentActivity: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. REAL API CALL FUNCTION ---
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Retrieve the token from storage (Adjust 'authToken' to whatever key you use)
      const token = localStorage.getItem('authToken'); 

      if (!token) {
        throw new Error("No authentication token found. Please login.");
      }

      // Headers for authentication
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Standard JWT format
      };

      // Option A: If your backend returns everything in one endpoint
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`, { headers });
      
      // Option B: If you need to fetch multiple endpoints in parallel (Common pattern)
      /*
      const [statsRes, ordersRes, activityRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/stats`, { headers }),
        fetch(`${API_BASE_URL}/orders/recent`, { headers }),
        fetch(`${API_BASE_URL}/activity`, { headers }),
        fetch(`${API_BASE_URL}/products/top`, { headers })
      ]);
      // Check .ok for all, then await .json() for all...
      */

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          navigate('/login');
          throw new Error("Session expired");
        }
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const result = await response.json();
      
      // We set the state with the REAL data from the backend
      // Ensure your backend JSON structure matches what the UI expects, 
      // or map it here (e.g. result.data.orders)
      setData(result); 

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. INITIALIZATION ---
  useEffect(() => {
    // Check if user is theoretically logged in via your auth utility
    const isUserAuthenticated = isLoggedIn ? isLoggedIn("user") : true; 
    
    if (!isUserAuthenticated) {
      navigate("/login"); 
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  // --- HELPER FUNCTIONS ---

  const handleExport = () => {
    if (!data.recentOrders || data.recentOrders.length === 0) return;
    
    const headers = ["Order ID", "Product", "Customer", "Date", "Total", "Status"];
    const rows = data.recentOrders.map(order => [
      order.id,
      order.product,
      order.customer,
      new Date(order.date).toLocaleDateString(),
      order.total,
      order.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) => {
    // Check if amount is a valid number before formatting
    if (isNaN(amount) || amount === null) return "$0.00";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "";
    const timestamp = new Date(dateString).getTime();
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return "Just now";
  };

  // Icon Mapper
  const getStatIcon = (label) => {
    // Basic string matching to assign icons dynamically based on backend labels
    const l = label.toLowerCase();
    if (l.includes('revenue') || l.includes('money')) return <FaMoneyBillWave />;
    if (l.includes('user') || l.includes('customer')) return <FaUsers />;
    if (l.includes('order') || l.includes('sale')) return <FaShoppingBag />;
    return <FaClipboardList />;
  };

  // Color Mapper
  const getStatColor = (label) => {
    const l = label.toLowerCase();
    if (l.includes('revenue')) return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
    if (l.includes('user')) return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
    if (l.includes('order')) return "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400";
    return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400";
  };

  const getStatusStyle = (status) => {
    if (!status) return 'bg-gray-100 text-gray-700 border border-gray-200';
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'paid') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
    if (s === 'processing') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
    if (s === 'cancelled' || s === 'failed') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  // --- RENDER ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
        <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
        <p className="mb-4 text-red-500">{error}</p>
        <button onClick={fetchDashboardData} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time data from server.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchDashboardData} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FaSync />
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FaFileExport /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition shadow-md shadow-purple-500/20">
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {data.stats && data.stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {/* Handle formatting based on your backend data types */}
                  {stat.type === 'money' ? formatCurrency(stat.value) : stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${getStatColor(stat.label)}`}>
                {getStatIcon(stat.label)}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.trend === 'up' ? <FaArrowUp className="mr-1 text-xs" /> : <FaArrowDown className="mr-1 text-xs" />}
                {stat.change}%
              </span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Orders */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.recentOrders && data.recentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.product}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                            {order.customer ? order.customer.charAt(0) : "?"}
                          </div>
                          {order.customer}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          <FaEllipsisH />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Products</h2>
            <div className="space-y-4">
              {data.topProducts && data.topProducts.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.sales} sold</p>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(item.revenue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {data.recentActivity && data.recentActivity.map((act, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center gap-4 w-full">
                    <div className="absolute left-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 bg-purple-500"></div>
                    <div className="ml-8">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{act.action}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{act.user}</span> • {getRelativeTime(act.timestamp || act.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}