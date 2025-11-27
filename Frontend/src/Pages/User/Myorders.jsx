import React, { useState, useEffect } from 'react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedOrders, setDisplayedOrders] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Simulated API call - Replace with your actual API endpoint
      // const response = await fetch('https://your-api.com/api/orders');
      // const data = await response.json();
      
      const simulatedData = [
        { id: 'ORD-3847', fileName: 'Machine_Learning_Assignment.pdf', shopName: 'Print Hub', pages: 45, copies: 2, amount: 360, paymentMethod: 'UPI', paymentStatus: 'paid', orderStatus: 'completed', date: '2025-10-28' },
        { id: 'ORD-3846', fileName: 'Data_Structures_Notes.pdf', shopName: 'Quick Print', pages: 32, copies: 1, amount: 128, paymentMethod: 'Cash', paymentStatus: 'unpaid', orderStatus: 'printing', date: '2025-10-29' },
        { id: 'ORD-3845', fileName: 'Project_Report_Final.docx', shopName: 'Print Hub', pages: 68, copies: 1, amount: 272, paymentMethod: 'UPI', paymentStatus: 'paid', orderStatus: 'completed', date: '2025-10-27' },
        { id: 'ORD-3844', fileName: 'Presentation_Slides.pptx', shopName: 'Express Print', pages: 15, copies: 3, amount: 180, paymentMethod: 'UPI', paymentStatus: 'paid', orderStatus: 'pending', date: '2025-10-30' },
        { id: 'ORD-3843', fileName: 'Research_Paper.pdf', shopName: 'Quick Print', pages: 24, copies: 2, amount: 192, paymentMethod: 'Cash', paymentStatus: 'unpaid', orderStatus: 'printing', date: '2025-10-29' },
        { id: 'ORD-3842', fileName: 'Study_Material.pdf', shopName: 'Print Hub', pages: 38, copies: 1, amount: 152, paymentMethod: 'UPI', paymentStatus: 'paid', orderStatus: 'completed', date: '2025-10-26' },
        { id: 'ORD-3841', fileName: 'Lab_Manual.pdf', shopName: 'Express Print', pages: 52, copies: 1, amount: 208, paymentMethod: 'UPI', paymentStatus: 'paid', orderStatus: 'completed', date: '2025-10-25' },
        { id: 'ORD-3840', fileName: 'Syllabus_2025.pdf', shopName: 'Quick Print', pages: 8, copies: 5, amount: 160, paymentMethod: 'Cash', paymentStatus: 'unpaid', orderStatus: 'pending', date: '2025-10-30' },
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(simulatedData);
      calculateStats(simulatedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(o => o.orderStatus === 'pending').length;
    const completedOrders = ordersData.filter(o => o.orderStatus === 'completed').length;
    const totalSpent = ordersData.reduce((sum, o) => sum + o.amount, 0);

    setStats({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSpent
    });
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Apply status filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === currentFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shopName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusClass = (status) => {
    const classes = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      printing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return classes[status] || '';
  };

  const getPaymentStatusClass = (status) => {
    const classes = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return classes[status] || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const showQRCode = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const filteredOrders = getFilteredOrders();
  const ordersToShow = filteredOrders.slice(0, displayedOrders);
  const hasMore = displayedOrders < filteredOrders.length;

  return (
    <main className="p-3 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <style>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      `}</style>

      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          My Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Track and manage all your print orders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-4 md:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 gradient-bg rounded-lg flex items-center justify-center">
              <i className="fas fa-shopping-bag text-white text-base md:text-lg"></i>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Orders
          </h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? '...' : stats.totalOrders}
          </p>
        </div>

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
            {loading ? '...' : stats.pendingOrders}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-white text-base md:text-lg"></i>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
            Completed Orders
          </h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? '...' : stats.completedOrders}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-rupee-sign text-white text-base md:text-lg"></i>
            </div>
          </div>
          <h3 className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Spent
          </h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? '...' : `₹${stats.totalSpent.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4 md:mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4 md:mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentFilter === 'all' ? 'active' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => {
              setCurrentFilter('all');
              setDisplayedOrders(5);
            }}
          >
            All Orders
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentFilter === 'pending' ? 'active' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => {
              setCurrentFilter('pending');
              setDisplayedOrders(5);
            }}
          >
            Pending
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentFilter === 'printing' ? 'active' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => {
              setCurrentFilter('printing');
              setDisplayedOrders(5);
            }}
          >
            Printing
          </button>
          <button
            className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentFilter === 'completed' ? 'active' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => {
              setCurrentFilter('completed');
              setDisplayedOrders(5);
            }}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Orders List - Desktop Table */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading orders...</p>
          </div>
        ) : ordersToShow.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            <i className="fas fa-search text-4xl mb-2"></i>
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">File Name</th>
                  <th className="px-6 py-3">Shop Name</th>
                  <th className="px-6 py-3">Pages × Copies</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {ordersToShow.map((order, index) => (
                  <tr
                    key={index}
                    className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {order.fileName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {order.shopName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {order.pages} × {order.copies}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${getPaymentStatusClass(order.paymentStatus)} text-xs px-2.5 py-1 rounded-full font-medium`}>
                        {order.paymentMethod} - {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${getStatusClass(order.orderStatus)} text-xs px-2.5 py-1 rounded-full font-medium capitalize`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => showQRCode(order.id)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        <i className="fas fa-qrcode"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders List - Mobile Cards */}
      <div className="lg:hidden space-y-4 mb-6">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading orders...</p>
          </div>
        ) : ordersToShow.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <i className="fas fa-search text-4xl mb-2"></i>
            <p>No orders found</p>
          </div>
        ) : (
          ordersToShow.map((order, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{order.id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.fileName}</p>
                </div>
                <span className={`${getStatusClass(order.orderStatus)} text-xs px-2.5 py-1 rounded-full font-medium capitalize`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shop:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pages × Copies:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.pages} × {order.copies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{order.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment:</span>
                  <span className={`${getPaymentStatusClass(order.paymentStatus)} text-xs px-2.5 py-1 rounded-full font-medium`}>
                    {order.paymentMethod} - {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatDate(order.date)}</span>
                </div>
              </div>
              <button
                onClick={() => showQRCode(order.id)}
                className="mt-4 w-full gradient-bg text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <i className="fas fa-qrcode mr-2"></i>View QR Code
              </button>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center items-center space-x-2 mb-6">
          <button
            onClick={() => setDisplayedOrders(displayedOrders + 5)}
            className="gradient-bg text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Load More Orders
          </button>
        </div>
      )}

      {/* QR Code Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Order QR Code</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-4">
                <i className="fas fa-qrcode text-6xl text-purple-600"></i>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Show this QR code at the shop to collect your order
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {selectedOrderId}
              </p>
              <button className="gradient-bg text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                <i className="fas fa-download mr-2"></i>Download QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center pb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2025 PrintEase | Designed by{' '}
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            Bhavneet Verma
          </span>
        </p>
      </footer>
    </main>
  );
};

export default MyOrders;