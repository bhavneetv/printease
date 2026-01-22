import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaStore,
  FaShoppingCart,
  FaRupeeSign,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheck,
  FaBan,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
  FaBox,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTruck,
} from "react-icons/fa";
import { isLoggedIn } from "../../assets/auth";

// Mock Data Generator
const generateMockUsers = () => {
  const statuses = ["Active", "Inactive"];
  const roles = ["user", "shopkeeper", "admin"];
  const names = ["Rahul Kumar", "Priya Sharma", "Amit Patel", "Sneha Gupta", "Vijay Singh", "Anita Desai", "Rajesh Verma", "Pooja Reddy"];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + ` ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joined: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-IN'),
    orders: Math.floor(Math.random() * 50),
  }));
};

const generateMockShops = () => {
  const statuses = ["Active", "Pending", "Inactive"];
  const shopNames = ["QuickPrint Hub", "Digital Press", "PrintMaster", "CopyZone", "Express Prints", "Smart Print Solutions"];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `${shopNames[i % shopNames.length]} ${i + 1}`,
    owner: `Owner ${i + 1}`,
    email: `shop${i + 1}@example.com`,
    phone: `+91 ${9000000000 + i}`,
    address: `Shop ${i + 1}, Market Street, Delhi`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    registered: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-IN'),
    totalOrders: Math.floor(Math.random() * 200),
    revenue: Math.floor(Math.random() * 100000),
  }));
};

const generateMockOrders = () => {
  const statuses = ["Pending", "Processing", "Completed", "Cancelled"];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `ORD${1000 + i}`,
    customer: `Customer ${i + 1}`,
    shop: `Shop ${(i % 10) + 1}`,
    items: Math.floor(Math.random() * 5) + 1,
    amount: Math.floor(Math.random() * 5000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(2025, 0, Math.floor(Math.random() * 22) + 1).toLocaleDateString('en-IN'),
    paymentMethod: Math.random() > 0.5 ? "Online" : "COD",
  }));
};

// Confirmation Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "warning" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          {type === "warning" && <FaBan className="text-red-500 text-2xl" />}
          {type === "success" && <FaCheckCircle className="text-green-500 text-2xl" />}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              type === "warning"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false });
  const userId = isLoggedIn("admin");
  const api = import.meta.env.VITE_API;
  const itemsPerPage = 10;

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });

  // Simulate API call to fetch data
 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${api}api/admin/dashboard.php`, {
        headers: {
          "X-USER-ID": userId, // admin id
        },
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load dashboard");
      }

      const users = data.users || [];
      const shops = data.shops || [];
      const orders = data.orders || [];

      setUsers(users);
      setShops(shops);
      setOrders(orders);

      // 📊 Stats (same logic as mock)
      setStats({
        totalUsers: users.length,
        totalShops: shops.filter(s => s.status === "Active").length,
        totalOrders: orders.length,
        activeOrders: orders.filter(
          o => o.status === "Processing" || o.status === "Pending"
        ).length,
        completedOrders: orders.filter(o => o.status === "Completed").length,
        totalRevenue: orders
          .filter(o => o.status === "Completed")
          .reduce((sum, o) => sum + Number(o.amount || 0), 0),
      });

    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Handle status toggle
  const handleStatusToggle = async (id, type, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    
    setModalConfig({
      isOpen: true,
      title: `${newStatus === "Active" ? "Activate" : "Deactivate"} ${type}`,
      message: `Are you sure you want to ${newStatus === "Active" ? "activate" : "deactivate"} this ${type.toLowerCase()}?`,
      type: "warning",
      onConfirm: async () => {
        setUpdatingId(id);
        setModalConfig({ isOpen: false });
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (type === "User") {
          setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        } else if (type === "Shop") {
          setShops(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        }
        
        setUpdatingId(null);
      },
    });
  };

  // Handle shop approval
  const handleShopApproval = async (id) => {
    setModalConfig({
      isOpen: true,
      title: "Approve Shop",
      message: "Are you sure you want to approve this shop?",
      type: "success",
      onConfirm: async () => {
        setUpdatingId(id);
        setModalConfig({ isOpen: false });
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setShops(prev => prev.map(s => s.id === id ? { ...s, status: "Active" } : s));
        setUpdatingId(null);
      },
    });
  };

  // Filter data based on active tab
  const getFilteredData = () => {
    let data = [];
    
    switch (activeTab) {
      case "users":
        data = users;
        break;
      case "shops":
        data = shops;
        break;
      case "orders":
        data = orders;
        break;
      default:
        data = [];
    }
    
    return data.filter(item => {
      const matchesSearch = activeTab === "orders"
        ? item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.customer.toLowerCase().includes(searchTerm.toLowerCase())
        : (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.email?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterStatus === "All" || item.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when changing tabs or filters
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, filterStatus]);

  const getStatusBadge = (status) => {
    const configs = {
      Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Inactive: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
      Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    
    return configs[status] || configs.Inactive;
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: <FaClock />,
      Processing: <FaTruck />,
      Completed: <FaCheckCircle />,
      Cancelled: <FaTimesCircle />,
    };
    return icons[status] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor and manage your PrintEase platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaUsers className="text-3xl opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
          <p className="text-sm opacity-90">Users</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaStore className="text-3xl opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalShops}</p>
          <p className="text-sm opacity-90">Shops</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaShoppingCart className="text-3xl opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">All</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-sm opacity-90">Orders</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaClock className="text-3xl opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-2xl font-bold">{stats.activeOrders}</p>
          <p className="text-sm opacity-90">Orders</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaCheckCircle className="text-3xl opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Done</span>
          </div>
          <p className="text-2xl font-bold">{stats.completedOrders}</p>
          <p className="text-sm opacity-90">Orders</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaRupeeSign className="text-3xl opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Total</span>
          </div>
          <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm opacity-90">Revenue</p>
        </div>
      </div>

      {/* Management Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === "users"
                  ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FaUsers className="inline mr-2" />
              Users Overview
            </button>
            <button
              onClick={() => setActiveTab("shops")}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === "shops"
                  ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FaStore className="inline mr-2" />
              Shops Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === "orders"
                  ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FaShoppingCart className="inline mr-2" />
              Orders Overview
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaFilter className="text-gray-400 text-xs" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none w-full sm:w-auto cursor-pointer"
              >
                <option value="All">All Status</option>
                {activeTab === "orders" ? (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </>
                ) : (
                  <>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    {activeTab === "shops" && <option value="Pending">Pending</option>}
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {paginatedData.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBox className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No data found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {activeTab === "users" && (
                      <>
                        <th className="px-6 py-4 text-left">User</th>
                        <th className="px-6 py-4 text-left">Role</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Joined</th>
                        <th className="px-6 py-4 text-left">Orders</th>
                        <th className="px-6 py-4 text-left">Actions</th>
                      </>
                    )}
                    {activeTab === "shops" && (
                      <>
                        <th className="px-6 py-4 text-left">Shop</th>
                        <th className="px-6 py-4 text-left">Owner</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Registered</th>
                        <th className="px-6 py-4 text-left">Revenue</th>
                        <th className="px-6 py-4 text-left">Actions</th>
                      </>
                    )}
                    {activeTab === "orders" && (
                      <>
                        <th className="px-6 py-4 text-left">Order ID</th>
                        <th className="px-6 py-4 text-left">Customer</th>
                        <th className="px-6 py-4 text-left">Shop</th>
                        <th className="px-6 py-4 text-left">Amount</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-left">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      {activeTab === "users" && (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                                {item.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{item.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status === "Active" ? "bg-green-500" : "bg-gray-500"}`}></span>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.joined}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.orders}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {updatingId === item.id ? (
                                <FaSpinner className="animate-spin text-purple-600" />
                              ) : (
                                <>
                                  <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                                    <FaEye />
                                  </button>
                                  <button
                                    onClick={() => handleStatusToggle(item.id, "User", item.status)}
                                    className={`${item.status === "Active" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}`}
                                  >
                                    {item.status === "Active" ? <FaBan /> : <FaCheck />}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === "shops" && (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                                {item.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.owner}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.registered}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">₹{item.revenue.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {updatingId === item.id ? (
                                <FaSpinner className="animate-spin text-purple-600" />
                              ) : (
                                <>
                                  <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                                    <FaEye />
                                  </button>
                                  {item.status === "Pending" ? (
                                    <button
                                      onClick={() => handleShopApproval(item.id)}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <FaCheck />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleStatusToggle(item.id, "Shop", item.status)}
                                      className={`${item.status === "Active" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}`}
                                    >
                                      {item.status === "Active" ? <FaBan /> : <FaCheck />}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === "orders" && (
                        <>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900 dark:text-white">{item.id}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.customer}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.shop}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">₹{item.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                              {getStatusIcon(item.status)}
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.date}</td>
                          <td className="px-6 py-4">
                            <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                              <FaEye />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
              {paginatedData.map((item) => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  {activeTab === "users" && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.email}</div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Role</p>
                          <p className="text-gray-900 dark:text-white font-medium capitalize">{item.role}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Orders</p>
                          <p className="text-gray-900 dark:text-white font-medium">{item.orders}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Joined</p>
                          <p className="text-gray-900 dark:text-white font-medium">{item.joined}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                        {updatingId === item.id ? (
                          <FaSpinner className="animate-spin text-purple-600" />
                        ) : (
                          <>
                            <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                              <FaEye /> View
                            </button>
                            <button
                              onClick={() => handleStatusToggle(item.id, "User", item.status)}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                item.status === "Active"
                                  ? "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
                                  : "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400"
                              }`}
                            >
                              {item.status === "Active" ? <><FaBan /> Deactivate</> : <><FaCheck /> Activate</>}
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "shops" && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.owner}</div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Revenue</p>
                          <p className="text-gray-900 dark:text-white font-medium">₹{item.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Orders</p>
                          <p className="text-gray-900 dark:text-white font-medium">{item.totalOrders}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Registered</p>
                          <p className="text-gray-900 dark:text-white font-medium">{item.registered}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                        {updatingId === item.id ? (
                          <FaSpinner className="animate-spin text-purple-600" />
                        ) : (
                          <>
                            <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                              <FaEye /> View
                            </button>
                            {item.status === "Pending" ? (
                              <button
                                onClick={() => handleShopApproval(item.id)}
                                className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <FaCheck /> Approve
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusToggle(item.id, "Shop", item.status)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                  item.status === "Active"
                                    ? "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
                                    : "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400"
                                }`}
                              >
                                {item.status === "Active" ? <><FaBan /> Deactivate</> : <><FaCheck /> Activate</>}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "orders" && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{item.id}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{item.customer}</div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Shop</p>
                          <p className="text-gray-900 dark:text-white font-medium">{item.shop}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Amount</p>
                          <p className="text-gray-900 dark:text-white font-medium">₹{item.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Date</p>
                          <p className="text-gray-900 dark:text-white font-medium">{item.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Payment</p>
                          <p className="text-gray-900 dark:text-white font-medium">{item.paymentMethod}</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                        <button className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <FaEye /> View Details
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FaChevronLeft />
                  </button>
                  <div className="hidden sm:flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <span className="sm:hidden text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
}