import React, { useState, useEffect } from "react";
import { isLoggedIn } from "../../assets/auth";
import { Navigate } from "react-router-dom";


const ShopDashboard = () => {
  // useEffect(() => {
  //   const user_id= isLoggedIn("shopkeeper");
  
  // }, []);

  const user_id = isLoggedIn("shopkeeper");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [shopInfo, setShopInfo] = useState({
    name: "PrintEase Shop",
    status: "open",
    queueSize: 0,
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingRequests: 0,
    printingOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
    totalEarnings: 0,
    earningsGrowth: 0,
    ordersGrowth: 0,
  });

  const API = import.meta.env.VITE_API;
  const [data, setdata] = useState()
  const [filteredOrders, setfilteredOrders] = useState()

  // Fetch shop data from API
  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      setLoading(true);

      // Replace with your actual API endpoint
      const response = await fetch(API + "api/shop/dashboard.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
        }),
      });

      const data = await response.json();

      console.log("Shop Dashboard Data:", data);
      setdata(data)
      setfilteredOrders(data.
recent_orders)

      // If API returns data, use it; otherwise use simulated data
      if (data.success) {
        setShopInfo(data.shop_info);
        setOrders(data.recent_orders);
        setStats(data.stats);
      } else {
        // Simulated data for demonstration
        const simulatedOrders = [
          {
            id: "#ORD-2850",
            document: "Assignment.pdf",
            pages: 24,
            amount: 96,
            payment_method: "UPI",
            payment_status: "paid",
            status: "printing",
            customer: "Rahul Sharma",
            time: "10 mins ago",
          },
          {
            id: "#ORD-2849",
            document: "Project Report.docx",
            pages: 45,
            amount: 180,
            payment_method: "Cash",
            payment_status: "pending",
            status: "pending",
            customer: "Priya Singh",
            time: "25 mins ago",
          },
          {
            id: "#ORD-2848",
            document: "Presentation.pptx",
            pages: 15,
            amount: 60,
            payment_method: "Card",
            payment_status: "paid",
            status: "completed",
            customer: "Amit Kumar",
            time: "1 hour ago",
          },
          {
            id: "#ORD-2847",
            document: "Notes.pdf",
            pages: 32,
            amount: 128,
            payment_method: "UPI",
            payment_status: "paid",
            status: "printing",
            customer: "Sneha Patel",
            time: "2 hours ago",
          },
          {
            id: "#ORD-2846",
            document: "Resume.pdf",
            pages: 8,
            amount: 32,
            payment_method: "Cash",
            payment_status: "paid",
            status: "completed",
            customer: "Vikram Mehta",
            time: "3 hours ago",
          },
          {
            id: "#ORD-2845",
            document: "Thesis.pdf",
            pages: 68,
            amount: 272,
            payment_method: "UPI",
            payment_status: "paid",
            status: "completed",
            customer: "Anjali Reddy",
            time: "4 hours ago",
          },
        ];

        setOrders(simulatedOrders);
        calculateStats(simulatedOrders);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching shop data:", error);

      // Fallback to simulated data on error
      const simulatedOrders = [
        {
          id: "#ORD-2850",
          document: "Assignment.pdf",
          pages: 24,
          amount: 96,
          payment_method: "UPI",
          payment_status: "paid",
          status: "printing",
          customer: "Rahul Sharma",
          time: "10 mins ago",
        },
        {
          id: "#ORD-2849",
          document: "Project Report.docx",
          pages: 45,
          amount: 180,
          payment_method: "Cash",
          payment_status: "pending",
          status: "pending",
          customer: "Priya Singh",
          time: "25 mins ago",
        },
        {
          id: "#ORD-2848",
          document: "Presentation.pptx",
          pages: 15,
          amount: 60,
          payment_method: "Card",
          payment_status: "paid",
          status: "completed",
          customer: "Amit Kumar",
          time: "1 hour ago",
        },
      ];

      setOrders(simulatedOrders);
      calculateStats(simulatedOrders);
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.length;
    const pendingRequests = ordersData.filter(
      (o) => o.status === "pending"
    ).length;
    const printingOrders = ordersData.filter(
      (o) => o.status === "printing"
    ).length;
    const completedOrders = ordersData.filter(
      (o) => o.status === "completed"
    ).length;

    // Calculate today's orders (simulated - in real app, check date)
    const todayOrders = Math.floor(totalOrders * 0.4);

    const totalEarnings = ordersData.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    const earningsGrowth = 15;
    const ordersGrowth = 12;

    const queueSize = pendingRequests + printingOrders;

    setStats({
      totalOrders,
      pendingRequests,
      printingOrders,
      completedOrders,
      todayOrders,
      totalEarnings,
      earningsGrowth,
      ordersGrowth,
    });

    setShopInfo((prev) => ({
      ...prev,
      queueSize,
    }));
  };

  const getStatusClass = (status) => {
    const classes = {
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      printing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return classes[status] || "";
  };

  const getPaymentStatusClass = (status) => {
    const classes = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return classes[status] || "";
  };

  const handleViewOrder = (orderId) => {
    alert(`Viewing order ${orderId}`);
    // Navigate to order details or open modal
  };

  const handlePrintOrder = (orderId) => {
    alert(`Starting print for order ${orderId}`);
    // Trigger print job
  };

  // const filteredOrders =
  //   filterStatus === "all"
  //     ? orders
  //     : orders.filter((order) => order.status === filterStatus);

  const toggleShopStatus = () => {
    setShopInfo((prev) => ({
      ...prev,
      status: prev.status === "open" ? "closed" : "open",
    }));
  };

  return (
    <main className="p-3 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <style>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>

      {/* Shop Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {shopInfo.name} 🏪
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Shop management and order overview
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Status:
            </span>
            <button
              onClick={toggleShopStatus}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                shopInfo.status === "open"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {shopInfo.status === "open" ? "🟢 Open" : "🔴 Closed"}
            </button>
          </div>
          {shopInfo.queueSize > 0 && (
            <div className="bg-purple-100 dark:bg-purple-900 px-3 py-2 rounded-lg">
              <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                Queue: {shopInfo.queueSize}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-8">
        {/* Total Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
              <i className="fas fa-shopping-cart text-white text-sm"></i>
            </div>
          </div>
          <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Total Orders
          </h3>
          <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : data.cards.total_orders
}
          </p>
          <p className="text-xs mt-1 text-green-500">
            <i className="fas fa-arrow-up"></i> {stats.ordersGrowth}%
          </p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-clock text-white text-sm"></i>
            </div>
          </div>
          <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Pending
          </h3>
          <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : data.cards.pending_orders}
          </p>
          <p className="text-xs mt-1 text-yellow-600">Awaiting action</p>
        </div>

        {/* Printing Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-print text-white text-sm"></i>
            </div>
          </div>
          <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Printing
          </h3>
          <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : data.cards.printing_orders}
          </p>
          <p className="text-xs mt-1 text-blue-600">In progress</p>
        </div>

        {/* Completed Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-white text-sm"></i>
            </div>
          </div>
          <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Completed
          </h3>
          <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : data.cards.completed_orders}
          </p>
          <p className="text-xs mt-1 text-green-600">Ready for pickup</p>
        </div>

        {/* Today's Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-calendar-day text-white text-sm"></i>
            </div>
          </div>
          <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Today
          </h3>
          <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : data.cards.today_orders}
          </p>
          <p className="text-xs mt-1 text-purple-600">Orders today</p>
        </div>

        {/* Total Earnings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-rupee-sign text-white text-sm"></i>
            </div>
          </div>
          <h3 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Earnings
          </h3>
          <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : `₹${data.cards.today_earnings.toLocaleString()}`}
          </p>
          <p className="text-xs mt-1 text-green-500">
            <i className="fas fa-arrow-up"></i> {stats.earningsGrowth}%
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            Recent Orders
          </h2>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterStatus === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterStatus === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("printing")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterStatus === "printing"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Printing
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterStatus === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Loading orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            No {filterStatus !== "all" ? filterStatus : ""} orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 md:px-6 py-3">Order ID</th>
                  <th className="px-4 md:px-6 py-3 hidden lg:table-cell">
                    Customer
                  </th>
                  <th className="px-4 md:px-6 py-3 hidden sm:table-cell">
                    Document
                  </th>
                  <th className="px-4 md:px-6 py-3">Pages</th>
                  <th className="px-4 md:px-6 py-3 hidden md:table-cell">
                    Payment
                  </th>
                  <th className="px-4 md:px-6 py-3 hidden md:table-cell">
                    Pay Status
                  </th>
                  <th className="px-4 md:px-6 py-3">Status</th>
                  <th className="px-4 md:px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 md:px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {order.order_id}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 lg:hidden">
                        {order.time}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden lg:table-cell text-gray-600 dark:text-gray-400">
                      {order.customer_name}
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {order.time}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell text-gray-600 dark:text-gray-400">
                      {order.original_file_name}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-600 dark:text-gray-400">
                      {order.pages}
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>{order.payment_type}</span>
                        <span className="text-gray-500">•</span>
                        <span className="font-semibold">₹{order.payment_amount}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                      <span
                        className={`${getPaymentStatusClass(
                          order.payment_status
                        )} text-xs px-2.5 py-1 rounded-full font-medium capitalize`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span
                        className={`${getStatusClass(
                          order.status
                        )} text-xs px-2.5 py-1 rounded-full text-blue-500 font-medium capitalize`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {order.status === "pending" && (
                          <button
                            onClick={() => handlePrintOrder(order.id)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Start Printing"
                          >
                            <i className="fas fa-play"></i>
                          </button>
                        )}
                      </div>
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
          © 2025 PrintEase | Shop Owner Dashboard
        </p>
      </footer>
    </main>
  );
};

export default ShopDashboard;
