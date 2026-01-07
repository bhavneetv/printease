import React, { useState, useEffect } from "react";
import { isLoggedIn } from "../../assets/auth";

const PrintOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 9;
  const API = import.meta.env.VITE_API || "http://localhost:8080/";

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}api/shop/order-print.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accepted_by: isLoggedIn("shopkeeper"), // Replace with session user id
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data && Array.isArray(data)) {
        setOrders(data);
        setFilteredOrders(data);
      } else {
        // Fallback to dummy data if API fails
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      // Use dummy data on error
    } finally {
      setIsLoading(false);
    }
  }

  // Filter and search logic
  useEffect(() => {
    let result = [...orders];

    // Apply status filter
    if (activeFilter === "pending") {
      result = result.filter((o) => o.orderStatus === "Pending");
    } else if (activeFilter === "printing") {
      result = result.filter((o) => o.orderStatus === "Printing");
    } else if (activeFilter === "completed") {
      result = result.filter((o) => o.orderStatus === "Completed");
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.ownerName.toLowerCase().includes(query) ||
          o.documentName.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [activeFilter, searchQuery, orders]);

  // Metrics
  const metrics = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.orderStatus === "Pending").length,
    printingOrders: orders.filter((o) => o.orderStatus === "Printing").length,
    completedOrders: orders.filter((o) => o.orderStatus === "Completed").length,
    totalEarnings: orders.reduce((sum, o) => sum + o.amount, 0),
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Action Handlers
  const handleCollectCash = (order) => {
    setSelectedOrder(order);
    setIsCashModalOpen(true);
  };

  const confirmCashCollection = async () => {
    console.log(selectedOrder.id);
    setIsCollecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await fetch(`${API}backend/shop/payment-comp.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: selectedOrder.id,
        payment_type: "cash",
        action: "pay",
      }),
    });
    fetchOrders();

    setIsCollecting(false);
    setIsCashModalOpen(false);
  };

  const handleCheckPayment = (order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  const confirmPayment = async () => {
    setIsCollecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await fetch(`${API}backend/shop/payment-comp.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: selectedOrder.id,
        payment_type: "upi",
        action: "pay",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        fetchOrders();
      });

    setIsCollecting(false);
    setIsPaymentModalOpen(false);
  };

  const handlePrintDocument = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const res = await fetch(`${API}api/shop/getOrderFile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrder.id,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      const a = document.createElement("a");
      a.href = data.file_url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();

      console.log("Downloading:", data.file_url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintNow = async () => {
    try {
      setIsPrinting(true);

      // 1️⃣ Get file path from backend
      const res = await fetch(`${API}api/shop/getOrderFile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrder.id,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      await fetch(`${API}backend/shop/payment-comp.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          action: "print",
        }),
      });

      const isPDF = data.file_url.toLowerCase().endsWith(".pdf");

      if (isPDF) {
        const printWindow = window.open(
          data.file_url,
          "_blank",
          "width=900,height=700"
        );

        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      }
      // 5️⃣ NOT PDF → DOWNLOAD
      else {
        const a = document.createElement("a");
        a.href = data.file_url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      fetchOrders();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while printing");
    } finally {
      setIsPrinting(false);
    }
  };

  const markAsCompleted = async (orderId) => {
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, orderStatus: "Completed" } : o
    );
    setOrders(updatedOrders);
  };

  const getActionButton = (order) => {
    if (order.orderStatus === "Completed") {
      return (
        <button
          disabled
          className="w-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-4 py-2.5 rounded-lg font-medium cursor-not-allowed"
        >
          <i className="fas fa-check-circle mr-2"></i>Completed
        </button>
      );
    }

    if (order.orderStatus === "Printing") {
      return (
        <div className="space-y-2">
          <button
            disabled
            className="w-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2.5 rounded-lg font-medium cursor-not-allowed"
          >
            <i className="fas fa-spinner fa-spin mr-2"></i>Printing...
          </button>
          <button
            onClick={() => markAsCompleted(order.id)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            <i className="fas fa-check mr-2"></i>Mark Completed
          </button>
        </div>
      );
    }

    if (order.paymentMethod === "cash" && order.paymentStatus === "Pending") {
      return (
        <button
          onClick={() => handleCollectCash(order)}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <i className="fas fa-money-bill-wave mr-2"></i>Collect Cash
        </button>
      );
    }

    if (order.paymentMethod === "upi" && order.paymentStatus === "Pending") {
      return (
        <button
          onClick={() => handleCheckPayment(order)}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <i className="fas fa-mobile-alt mr-2"></i>Check Payment
        </button>
      );
    }

    return (
      <button
        onClick={() => handlePrintDocument(order)}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md"
      >
        <i className="fas fa-print mr-2"></i>Print Document
      </button>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      Printing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      Completed:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };
    return styles[status] || styles.Pending;
  };

  const getPaymentStatusBadge = (status) => {
    return status === "Paid"
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-5xl text-purple-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 md:p-6">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          📦 Order Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Process and manage all print orders
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-shopping-bag text-white text-xl"></i>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {metrics.totalOrders}
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Total Orders
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-clock text-white text-xl"></i>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {metrics.pendingOrders}
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Pending
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-print text-white text-xl"></i>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {metrics.printingOrders}
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Printing
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-white text-xl"></i>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {metrics.completedOrders}
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Completed
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-rupee-sign text-white text-xl"></i>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            ₹{metrics.totalEarnings.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Total Earnings
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeFilter === "all"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeFilter === "pending"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Pending ({metrics.pendingOrders})
            </button>
            <button
              onClick={() => setActiveFilter("printing")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeFilter === "printing"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Printing ({metrics.printingOrders})
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeFilter === "completed"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Completed ({metrics.completedOrders})
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6">
        {currentOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-5">
              {/* Order Header */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                      {order.id}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <i className="far fa-clock mr-1"></i>
                  {order.timestamp}
                </p>
              </div>

              {/* Order Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-file-alt text-purple-600 dark:text-purple-400 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Document
                    </p>
                    <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                      {order.documentName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-copy text-blue-600 dark:text-blue-400 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Specifications
                    </p>
                    <p className="font-medium text-sm text-gray-800 dark:text-white">
                      {order.totalPages} pages × {order.copies} copies
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-palette text-indigo-600 dark:text-indigo-400 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Print Type
                    </p>
                    <p className="font-medium text-sm text-gray-800 dark:text-white">
                      {order.colorType} • {order.sidedType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-rupee-sign text-green-600 dark:text-green-400 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Payment
                    </p>
                    <p className="font-bold text-green-600 dark:text-green-400">
                      ₹{order.amount}{" "}
                      <span className="text-xs font-normal text-gray-600 dark:text-gray-400">
                        via {order.paymentMethod}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-user text-orange-600 dark:text-orange-400 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Customer
                    </p>
                    <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                      {order.ownerName}
                    </p>
                  </div>
                </div>

                {order.specialNotes && (
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-sticky-note text-amber-600 dark:text-amber-400 text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Special Notes
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        {order.specialNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {getActionButton(order)}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {currentOrders.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-inbox text-gray-400 text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            No Orders Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? "No orders match your search criteria"
              : "No orders available for the selected filter"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            } else if (
              pageNum === currentPage - 2 ||
              pageNum === currentPage + 2
            ) {
              return (
                <span key={pageNum} className="text-gray-400">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Print Document Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Print Document
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Document
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {selectedOrder.documentName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Pages
                  </p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {selectedOrder.totalPages}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Copies
                  </p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {selectedOrder.copies}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Print Settings
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {selectedOrder.colorType} • {selectedOrder.sidedType}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Downloading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download mr-2"></i>Download
                  </>
                )}
              </button>
              <button
                onClick={handlePrintNow}
                disabled={isPrinting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50"
              >
                {isPrinting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Printing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-print mr-2"></i>Print Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Collection Modal */}
      {isCashModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-money-bill-wave text-white text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Collect Cash Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Confirm cash collection from customer
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Order ID
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {selectedOrder.id}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Customer
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {selectedOrder.ownerName}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-orange-200 dark:border-orange-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Amount to Collect
                </span>
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  ₹{selectedOrder.amount}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCashModalOpen(false)}
                disabled={isCollecting}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmCashCollection}
                disabled={isCollecting}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50"
              >
                {isCollecting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i>Confirm Collection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Check Modal */}
      {isPaymentModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mobile-alt text-white text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Verify UPI Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Check if payment has been received
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Order ID
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {selectedOrder.id}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Customer
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {selectedOrder.ownerName}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-blue-200 dark:border-blue-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Expected Amount
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{selectedOrder.amount}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
              <p className="text-xs text-amber-800 dark:text-amber-400 flex items-start">
                <i className="fas fa-info-circle mt-0.5 mr-2"></i>
                <span>
                  Please verify the payment in your UPI app before confirming
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                disabled={isCollecting}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                disabled={isCollecting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50"
              >
                {isCollecting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i>Payment Received
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintOrderManagement;
