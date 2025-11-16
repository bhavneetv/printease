import React, { useState } from 'react';

const ShopOrders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Sample dummy data
  const orders = [
    {
      id: 'ORD-001',
      documentName: 'Project_Report.pdf',
      documentType: 'PDF Document',
      totalPages: 45,
      copies: 2,
      colorType: 'Black & White',
      sidedType: 'Double-sided',
      amount: 180,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Pending',
      ownerName: 'Rahul Sharma',
      specialNotes: 'Please bind after printing',
      timestamp: '2025-11-15 10:30 AM'
    },
    {
      id: 'ORD-002',
      documentName: 'Marketing_Presentation.pptx',
      documentType: 'PowerPoint',
      totalPages: 20,
      copies: 5,
      colorType: 'Color',
      sidedType: 'Single-sided',
      amount: 1000,
      paymentMethod: 'Cash',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      ownerName: 'Priya Singh',
      specialNotes: 'Urgent - needed by 2 PM',
      timestamp: '2025-11-15 11:15 AM'
    },
    {
      id: 'ORD-003',
      documentName: 'Resume_Final.docx',
      documentType: 'Word Document',
      totalPages: 3,
      copies: 10,
      colorType: 'Black & White',
      sidedType: 'Single-sided',
      amount: 60,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Completed',
      ownerName: 'Amit Kumar',
      specialNotes: '',
      timestamp: '2025-11-15 09:45 AM'
    },
    {
      id: 'ORD-004',
      documentName: 'Thesis_Chapter_3.pdf',
      documentType: 'PDF Document',
      totalPages: 68,
      copies: 1,
      colorType: 'Black & White',
      sidedType: 'Double-sided',
      amount: 136,
      paymentMethod: 'Cash',
      paymentStatus: 'Paid',
      orderStatus: 'Printing',
      ownerName: 'Sneha Patel',
      specialNotes: 'Handle with care',
      timestamp: '2025-11-15 10:00 AM'
    },
    {
      id: 'ORD-005',
      documentName: 'Brochure_Design.pdf',
      documentType: 'PDF Document',
      totalPages: 8,
      copies: 50,
      colorType: 'Color',
      sidedType: 'Double-sided',
      amount: 4000,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Completed',
      ownerName: 'Vikram Mehta',
      specialNotes: 'Glossy paper preferred',
      timestamp: '2025-11-14 04:30 PM'
    },
    {
      id: 'ORD-006',
      documentName: 'Assignment_Solutions.pdf',
      documentType: 'PDF Document',
      totalPages: 15,
      copies: 3,
      colorType: 'Black & White',
      sidedType: 'Single-sided',
      amount: 90,
      paymentMethod: 'Cash',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      ownerName: 'Anjali Verma',
      specialNotes: '',
      timestamp: '2025-11-15 11:45 AM'
    }
  ];

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'pending') return order.orderStatus === 'Pending';
    if (activeFilter === 'completed') return order.orderStatus === 'Completed';
    return true;
  });

  const metrics = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.orderStatus === 'Pending').length,
    completedOrders: orders.filter(o => o.orderStatus === 'Completed').length,
    totalEarnings: orders.reduce((sum, o) => sum + o.amount, 0)
  };

  const handlePrintClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDownloading(false);
    // Add actual download logic here
    console.log('Downloading:', selectedOrder.documentName);
  };

  const handlePrintNow = async () => {
    setIsPrinting(true);
    // Simulate print delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPrinting(false);
    // Trigger browser print or custom print logic
    window.print();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setIsDownloading(false);
    setIsPrinting(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      Printing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      Completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    return styles[status] || styles.Pending;
  };

  const getPaymentStatusBadge = (status) => {
    return status === 'Paid' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 md:p-6">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          📦 Order Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Manage and track all your print orders
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-shopping-bag text-white text-xl"></i>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {metrics.totalOrders}
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
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
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Pending Orders</p>
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
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Completed Orders</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-rupee-sign text-white text-xl"></i>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
            ₹{metrics.totalEarnings.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <i className="fas fa-list mr-2"></i>All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === 'pending'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <i className="fas fa-clock mr-2"></i>Pending ({metrics.pendingOrders})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === 'completed'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <i className="fas fa-check-circle mr-2"></i>Completed ({metrics.completedOrders})
          </button>
        </div>
      </div>

      {/* Orders Grid - Mobile: List View, Desktop: Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredOrders.map((order) => (
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
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <i className="far fa-clock mr-1"></i>{order.timestamp}
                </p>
              </div>

              {/* Order Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-file-alt text-purple-600 dark:text-purple-400 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Document</p>
                    <p className="font-medium text-sm text-gray-800 dark:text-white truncate">{order.documentName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-copy text-blue-600 dark:text-blue-400 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Specifications</p>
                    <p className="font-medium text-sm text-gray-800 dark:text-white">{order.totalPages} pages × {order.copies} copies</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-palette text-indigo-600 dark:text-indigo-400 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Print Type</p>
                    <p className="font-medium text-sm text-gray-800 dark:text-white">{order.colorType} • {order.sidedType}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-rupee-sign text-green-600 dark:text-green-400 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment</p>
                    <p className="font-bold text-green-600 dark:text-green-400">₹{order.amount} <span className="text-xs font-normal text-gray-600 dark:text-gray-400">via {order.paymentMethod}</span></p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-user text-orange-600 dark:text-orange-400 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                    <p className="font-medium text-sm text-gray-800 dark:text-white truncate">{order.ownerName}</p>
                  </div>
                </div>

                {order.specialNotes && (
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-sticky-note text-amber-600 dark:text-amber-400 text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Special Notes</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">{order.specialNotes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Print Button */}
              <button
                onClick={() => handlePrintClick(order)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <i className="fas fa-print mr-2"></i>Print Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-inbox text-gray-400 text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Orders Found</h3>
          <p className="text-gray-600 dark:text-gray-400">There are no orders matching your filter.</p>
        </div>
      )}

      {/* Print Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <i className="fas fa-print mr-3"></i>
                    Print Instructions
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <i className="fas fa-times text-2xl"></i>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                {/* Order ID Badge */}
                <div className="mb-6 text-center">
                  <span className="inline-block bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 px-6 py-2 rounded-full font-bold text-lg">
                    {selectedOrder.id}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Document Name</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.documentName}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Document Type</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.documentType}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Pages</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.totalPages} pages</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Number of Copies</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.copies} copies</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Color Type</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.colorType}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Print Side</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.sidedType}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.paymentMethod}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer Name</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.ownerName}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                    <p className="font-bold text-green-600 dark:text-green-400 text-lg">₹{selectedOrder.amount}</p>
                  </div>
                </div>

                {/* Special Notes */}
                {selectedOrder.specialNotes && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">
                      <i className="fas fa-sticky-note mr-2"></i>Special Instructions
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{selectedOrder.specialNotes}</p>
                  </div>
                )}

                {/* Estimated Cost */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                      <i className="fas fa-calculator mr-2"></i>Estimated Print Cost
                    </p>
                    <p className="text-lg font-bold text-blue-800 dark:text-blue-400">₹{selectedOrder.amount}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-download mr-2"></i>
                        Download File
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrintNow}
                    disabled={isPrinting}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPrinting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Printing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-print mr-2"></i>
                        Print Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopOrders;