import React, { useState, useEffect } from "react";

const ShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const API = import.meta.env.VITE_API || "https://your-api-endpoint.com/";

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Replace with your actual API endpoint and authentication
      const user_id = localStorage.getItem("shopkeeper_id") || "shop_123";

      const response = await fetch(`${API}api/shop/orders.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          action: "get_all_orders",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } else {
        // Fallback to dummy data if API fails
        setOrders(dummyOrders);
        setFilteredOrders(dummyOrders);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Use dummy data on error
      setOrders(dummyOrders);
      setFilteredOrders(dummyOrders);
      setLoading(false);
    }
  };

  // Dummy data for demonstration
  const dummyOrders = [
    {
      order_id: "ORD001",
      document_name: "Project Report.pdf",
      document_type: "PDF",
      customer_name: "Rahul Sharma",
      customer_phone: "+91 98765 43210",
      pages: 25,
      copies: 2,
      color_type: "Black & White",
      print_side: "Double Side",
      payment_method: "UPI",
      payment_status: "paid",
      status: "completed",
      amount: 150,
      created_date: "2025-12-27 10:30 AM",
      instructions: "Please staple the pages together",
    },
    {
      order_id: "ORD002",
      document_name: "Assignment.docx",
      document_type: "DOCX",
      customer_name: "Priya Patel",
      customer_phone: "+91 87654 32109",
      pages: 10,
      copies: 1,
      color_type: "Color",
      print_side: "Single Side",
      payment_method: "Cash",
      payment_status: "pending",
      status: "printing",
      amount: 120,
      created_date: "2025-12-27 11:15 AM",
      instructions: "High quality print needed",
    },
    {
      order_id: "ORD003",
      document_name: "Resume.pdf",
      document_type: "PDF",
      customer_name: "Amit Kumar",
      customer_phone: "+91 76543 21098",
      pages: 3,
      copies: 5,
      color_type: "Black & White",
      print_side: "Single Side",
      payment_method: "UPI",
      payment_status: "paid",
      status: "pending",
      amount: 45,
      created_date: "2025-12-27 12:00 PM",
      instructions: "Premium paper preferred",
    },
    {
      order_id: "ORD004",
      document_name: "Presentation.pptx",
      document_type: "PPTX",
      customer_name: "Sneha Desai",
      customer_phone: "+91 65432 10987",
      pages: 20,
      copies: 1,
      color_type: "Color",
      print_side: "Single Side",
      payment_method: "UPI",
      payment_status: "paid",
      status: "completed",
      amount: 200,
      created_date: "2025-12-27 09:45 AM",
      instructions: "None",
    },
    {
      order_id: "ORD005",
      document_name: "Study Notes.pdf",
      document_type: "PDF",
      customer_name: "Vikram Singh",
      customer_phone: "+91 54321 09876",
      pages: 50,
      copies: 1,
      color_type: "Black & White",
      print_side: "Double Side",
      payment_method: "Cash",
      payment_status: "pending",
      status: "pending",
      amount: 125,
      created_date: "2025-12-27 01:30 PM",
      instructions: "Spiral binding required",
    },
    {
      order_id: "ORD006",
      document_name: "Invoice Template.xlsx",
      document_type: "XLSX",
      customer_name: "Anjali Mehta",
      customer_phone: "+91 43210 98765",
      pages: 5,
      copies: 3,
      color_type: "Color",
      print_side: "Single Side",
      payment_method: "UPI",
      payment_status: "paid",
      status: "printing",
      amount: 90,
      created_date: "2025-12-27 02:15 PM",
      instructions: "None",
    },
  ];

  // Apply filters and search
  useEffect(() => {
    let result = orders;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.document_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((order) => order.status === filterStatus);
    }

    // Payment status filter
    if (filterPaymentStatus !== "all") {
      result = result.filter(
        (order) => order.payment_status === filterPaymentStatus
      );
    }

    // Payment method filter
    if (filterPaymentMethod !== "all") {
      result = result.filter(
        (order) => order.payment_method === filterPaymentMethod
      );
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [
    searchTerm,
    filterStatus,
    filterPaymentStatus,
    filterPaymentMethod,
    orders,
  ]);

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

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main className="p-3 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <style>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          📋 Orders Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          View and manage all print orders
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID, Document Name, or Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            />
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Order Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Order Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="printing">Printing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Status
            </label>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <select
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="all">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm ||
          filterStatus !== "all" ||
          filterPaymentStatus !== "all" ||
          filterPaymentMethod !== "all") && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            {searchTerm && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                Search: {searchTerm}
              </span>
            )}
            {filterStatus !== "all" && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm capitalize">
                Status: {filterStatus}
              </span>
            )}
            {filterPaymentStatus !== "all" && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm capitalize">
                Payment: {filterPaymentStatus}
              </span>
            )}
            {filterPaymentMethod !== "all" && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                Method: {filterPaymentMethod}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterPaymentStatus("all");
                setFilterPaymentMethod("all");
              }}
              className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{currentOrders.length}</span>{" "}
          of <span className="font-semibold">{filteredOrders.length}</span>{" "}
          orders
        </p>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      {/* Orders Table/Cards */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      ) : currentOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <i className="fas fa-inbox text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No orders found
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-slide-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {order.order_id}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {order.created_date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {order.document_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {order.document_type}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 dark:text-white">
                          {order.customer_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                          <div>
                            Pages: {order.pages} × {order.copies} copies
                          </div>
                          <div>{order.color_type}</div>
                          <div>{order.print_side}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white mb-2">
                          ₹{order.amount}
                        </div>
                        <div className="space-y-1">
                          <span
                            className={`${getPaymentStatusClass(
                              order.payment_status
                            )} text-xs px-2 py-1 rounded-full font-medium capitalize inline-block`}
                          >
                            {order.payment_status}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {order.payment_method}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${getStatusClass(
                            order.status
                          )} text-xs px-3 py-1.5 rounded-full font-medium capitalize inline-block`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                          <i className="fas fa-eye"></i>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {currentOrders.map((order, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-200 animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {order.order_id}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {order.created_date}
                    </p>
                  </div>
                  <span
                    className={`${getStatusClass(
                      order.status
                    )} text-xs px-3 py-1 rounded-full font-medium capitalize`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <i className="fas fa-file text-purple-600 w-4"></i>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {order.document_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="fas fa-user text-purple-600 w-4"></i>
                    <span className="text-gray-600 dark:text-gray-400">
                      {order.customer_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="fas fa-copy text-purple-600 w-4"></i>
                    <span className="text-gray-600 dark:text-gray-400">
                      {order.pages} pages × {order.copies} copies
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{order.amount}
                    </div>
                    <span
                      className={`${getPaymentStatusClass(
                        order.payment_status
                      )} text-xs px-2 py-1 rounded-full font-medium capitalize inline-block mt-1`}
                    >
                      {order.payment_status}
                    </span>
                  </div>
                  <button
                    onClick={() => openOrderDetails(order)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <i className="fas fa-eye"></i>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === index + 1
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-slide-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="gradient-bg p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Order Details</h2>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order ID and Status */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedOrder.order_id}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedOrder.created_date}
                  </p>
                </div>
                <span
                  className={`${getStatusClass(
                    selectedOrder.status
                  )} px-4 py-2 rounded-lg font-semibold capitalize`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {/* Document Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <i className="fas fa-file-alt"></i>
                  Document Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Document Name
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.document_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Document Type
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.document_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pages
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.pages}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Copies
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.copies}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Color Type
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.color_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Print Side
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.print_side}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <i className="fas fa-user"></i>
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Name
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.customer_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.customer_phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <i className="fas fa-credit-card"></i>
                  Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Amount
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{selectedOrder.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Payment Method
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrder.payment_method}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Payment Status
                    </p>
                    <span
                      className={`${getPaymentStatusClass(
                        selectedOrder.payment_status
                      )} text-xs px-3 py-1 rounded-full font-medium capitalize inline-block mt-1`}
                    >
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.instructions &&
                selectedOrder.instructions !== "None" && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <i className="fas fa-comment-alt"></i>
                      Special Instructions
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedOrder.instructions}
                    </p>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <i className="fas fa-print"></i>
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ShopOrders;
