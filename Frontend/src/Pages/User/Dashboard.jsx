import React, { useState, useEffect } from "react";
import { isLoggedIn } from "../../assets/auth";

const Dashboard = ({}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pagesPrinted: 0,
    totalSpent: 0,
    pendingOrders: 0,
    readyForPickup: 0,
    ordersGrowth: 0,
    pagesGrowth: 0,
  });

  const API = import.meta.env.VITE_API;
  
  if (!isLoggedIn("user")) {
    window.location.href = "/login";
    // console.log("f")
  }
  const user_idt = isLoggedIn("user");
  
    const username = sessionStorage.getItem("user");
    const name = JSON.parse(atob(username)).name;

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const [lenght, setlenght] = useState();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API + "api/dashboard.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_idt,
        }),
      });

      const data = await response.json(); // use json, not text
      // console.log(data);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setlenght(data.cards);
      setOrders(data.recent_activity);
      calculateStats(data.cards);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  // Calculate statistics from orders
  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.total_Orders|| 0;
    const pagesPrinted = ordersData.pages || 0 
  
    const totalSpent = ordersData.total_spent || 0
    const pendingOrders = ordersData.pending_orders || 0
    
    // Simulated growth percentages (replace with actual calculation from database)
    const ordersGrowth = 12;
    const pagesGrowth = 8;

    setStats({
      totalOrders,
      pagesPrinted,
      totalSpent,
      pendingOrders,
      
      ordersGrowth,
      pagesGrowth,
    });
  };

  const getStatusClass = (status) => {
    const classes = {
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return classes[status] || "";
  };

  const averagePerOrder =
    stats.totalOrders > 0
      ? (stats.totalSpent / stats.totalOrders).toFixed(2)
      : 0;

  return (
    <main className="p-3 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <style>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>

      {/* Welcome Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Welcome, {name} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Here's what's happening with your print orders today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-4 md:mb-8">
        {/* Total Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 gradient-bg rounded-lg flex items-center justify-center">
              <i className="fas fa-shopping-cart text-white text-base md:text-lg"></i>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Orders
          </h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : lenght?.total_orders}
          </p>
         
        </div>

        {/* Pages Printed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-file-alt text-white text-base md:text-lg"></i>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
            Pages Printed
          </h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : stats?.pagesPrinted}
          </p>
         
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-rupee-sign text-white text-base md:text-lg"></i>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Spent
          </h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : `₹${lenght?.total_spent.toLocaleString()}`}
          </p>
         
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-clock text-white text-base md:text-lg"></i>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
            Pending Orders
          </h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : lenght?.pending_orders}
          </p>
          
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            Recent Activity
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 md:px-6 py-3">Order ID</th>
                  <th className="px-4 md:px-6 py-3 hidden sm:table-cell">
                    Document
                  </th>
                  <th className="px-4 md:px-6 py-3">Pages</th>
                  <th className="px-4 md:px-6 py-3 hidden md:table-cell">
                    Amount
                  </th>
                  <th className="px-4 md:px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 md:px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {order.order_code}
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell text-gray-600 dark:text-gray-400">
                      {order.original_file_name}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-600 dark:text-gray-400">
                      {order.pages}
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell text-gray-600 dark:text-gray-400">
                      ₹{order.payment_amount}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span
                        className={`${getStatusClass(
                          order.status
                        )} text-xs px-2.5 text-yellow-600 py-1 rounded-full font-medium capitalize`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center pb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2025 PrintEase | Designed by{" "}
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            Bhavneet Verma
          </span>
        </p>
      </footer>
    </main>
  );
};

export default Dashboard;
