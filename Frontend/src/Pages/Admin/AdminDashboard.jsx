// src/pages/Dashboard.jsx
import React from 'react';
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
  FaUserShield 
} from 'react-icons/fa';

export default function AdminDashboard() {

  // --- MOCK DATA ---
  const stats = [
    { label: "Total Revenue", value: "$45,231.89", change: "+20.1%", trend: "up", icon: <FaMoneyBillWave />, color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" },
    { label: "Active Users", value: "2,345", change: "+15.2%", trend: "up", icon: <FaUsers />, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
    { label: "New Orders", value: "574", change: "-2.4%", trend: "down", icon: <FaShoppingBag />, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" },
    { label: "Pending Issues", value: "12", change: "+4.1%", trend: "down", icon: <FaClipboardList />, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" },
  ];

  const recentOrders = [
    { id: "#ORD-5501", product: "MacBook Pro 16", customer: "Esther Howard", date: "Jan 19, 2026", total: "$2,599", status: "Completed" },
    { id: "#ORD-5502", product: "iPhone 15 Pro", customer: "Wade Warren", date: "Jan 19, 2026", total: "$999", status: "Processing" },
    { id: "#ORD-5503", product: "Sony WH-1000XM5", customer: "Brooklyn Simmons", date: "Jan 18, 2026", total: "$348", status: "Cancelled" },
    { id: "#ORD-5504", product: "Samsung S24 Ultra", customer: "Guy Hawkins", date: "Jan 17, 2026", total: "$1,299", status: "Completed" },
    { id: "#ORD-5505", product: "iPad Air 5", customer: "Robert Fox", date: "Jan 17, 2026", total: "$599", status: "Pending" },
  ];

  const recentActivity = [
    { user: "Jane Doe", action: "Updated product listing", time: "2 mins ago" },
    { user: "Admin System", action: "Automatic backup completed", time: "1 hour ago" },
    { user: "Mike Smith", action: "Requested a refund", time: "3 hours ago" },
    { user: "Sarah Connor", action: "New user registration", time: "5 hours ago" },
  ];

  const topProducts = [
    { name: "Wireless Headphones", sales: "1,204 sold", revenue: "$45k" },
    { name: "Smart Watch Series 7", sales: "890 sold", revenue: "$28k" },
    { name: "Gaming Mouse", sales: "650 sold", revenue: "$12k" },
  ];

  // Helper for Status Badge Colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="p-4   min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of your store's performance and recent activities.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FaFileExport /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition shadow-md shadow-purple-500/20">
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.trend === 'up' ? <FaArrowUp className="mr-1 text-xs" /> : <FaArrowDown className="mr-1 text-xs" />}
                {stat.change}
              </span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MAIN CONTENT GRID (Tables & Lists) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3 width on large screens) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Recent Orders Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
              <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">View All</button>
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
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.product}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                {order.customer.charAt(0)}
                            </div>
                            {order.customer}
                         </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.total}</td>
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

        {/* RIGHT COLUMN (1/3 width on large screens) */}
        <div className="space-y-8">

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
               <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition text-center flex flex-col items-center gap-2">
                 <FaUserShield className="text-blue-500 text-xl" />
                 <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Manage Roles</span>
               </button>
               <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition text-center flex flex-col items-center gap-2">
                 <FaCog className="text-gray-500 text-xl" />
                 <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Settings</span>
               </button>
               <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition text-center flex flex-col items-center gap-2">
                 <FaFileExport className="text-green-500 text-xl" />
                 <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Reports</span>
               </button>
               <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition text-center flex flex-col items-center gap-2">
                 <FaPlus className="text-purple-500 text-xl" />
                 <span className="text-xs font-medium text-gray-700 dark:text-gray-300">New User</span>
               </button>
            </div>
          </div>

          {/* Top Products List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Products</h2>
            <div className="space-y-4">
              {topProducts.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                   <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.sales}</p>
                   </div>
                   <span className="text-sm font-bold text-green-600 dark:text-green-400">{item.revenue}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-purple-600 dark:text-purple-400 font-medium border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition">
              View Inventory
            </button>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {recentActivity.map((act, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                   <div className="flex items-center gap-4 w-full">
                      {/* Dot */}
                      <div className="absolute left-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 bg-purple-500"></div>
                      <div className="ml-8">
                         <p className="text-sm font-medium text-gray-900 dark:text-white">{act.action}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400">
                           <span className="font-semibold text-gray-700 dark:text-gray-300">{act.user}</span> • {act.time}
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