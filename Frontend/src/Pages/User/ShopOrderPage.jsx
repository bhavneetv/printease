import React, { useState, useEffect } from 'react';

export default function ShopOrderPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [settings, setSettings] = useState({
    copies: 1,
    color: 'bw',
    sides: 'single',
    payment: 'cash'
  });

  const API_URL = import.meta.env.VITE_API;

  // Extract shop code from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shopCode = params.get('shop');

    if (!shopCode) {
      setError('Invalid QR Code - No shop code provided');
      setLoading(false);
      return;
    }

    const fetchShopDetails = async (shop) => {

      const res = await fetch(`${API_URL}api/getShops.php?shop=${shop}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({  }),
      });

      const data = await res.json();
    }


    console.log("Nearby shops response:", data);
    // Simulate API fetch for shop details
    setTimeout(() => {
      // Dummy shop database
      const shops = {
        'ABC123': {
          name: 'Student Copy Center',
          code: 'ABC123',
          bwRate: 3.5,
          colorRate: 12,
          location: 'Campus Gate 1'
        },
        'XYZ789': {
          name: 'QuickPrint Express',
          code: 'XYZ789',
          bwRate: 4.5,
          colorRate: 14,
          location: 'Main Road'
        },
        'DEF456': {
          name: 'Print Hub Campus',
          code: 'DEF456',
          bwRate: 4,
          colorRate: 13,
          location: 'Library Building'
        }
      };

      if (shops[shopCode]) {
        setShopData(shops[shopCode]);
        setLoading(false);
      } else {
        setError('Invalid Shop Code - Shop not found');
        setLoading(false);
      }
    }, 1500);
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleFile = (file) => {
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setUploadedFile(file);
    // Simulate page count detection
    setPageCount(Math.floor(Math.random() * 50) + 5);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPageCount(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrice = () => {
    if (!shopData || !uploadedFile) return 0;

    const rate = settings.color === 'bw' ? shopData.bwRate : shopData.colorRate;
    return pageCount * settings.copies * rate;
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return;

    setProcessing(true);

    const totalPrice = calculatePrice();
    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;

    const order = {
      orderId,
      fileName: uploadedFile.name,
      fileSize: formatFileSize(uploadedFile.size),
      pages: pageCount,
      copies: settings.copies,
      totalPages: pageCount * settings.copies,
      colorMode: settings.color === 'bw' ? 'Black & White' : 'Color',
      printSides: settings.sides === 'single' ? 'Single-Sided' : 'Double-Sided',
      shop: shopData.name,
      shopLocation: shopData.location,
      paymentMethod: settings.payment === 'cash' ? 'Cash at Shop' : 'UPI Payment',
      ratePerPage: settings.color === 'bw' ? shopData.bwRate : shopData.colorRate,
      totalAmount: totalPrice,
      timestamp: new Date().toLocaleString()
    };

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (settings.payment === 'upi') {
      // Show UPI payment alert
      alert(`UPI Payment Required\n\nAmount: ₹${totalPrice.toFixed(2)}\nUPI ID: ${shopData.name.toLowerCase().replace(/\s+/g, '')}@paytm\n\nPlease complete the payment to proceed.`);
    }

    setOrderDetails(order);
    setProcessing(false);
    setShowSuccess(true);

    // Console log order details
    console.log('='.repeat(60));
    console.log('📄 SHOP ORDER DETAILS');
    console.log('='.repeat(60));
    console.log(JSON.stringify(order, null, 2));
    console.log('='.repeat(60));
  };

  const resetOrder = () => {
    setShowSuccess(false);
    setOrderDetails(null);
    removeFile();
    setSettings({
      copies: 1,
      color: 'bw',
      sides: 'single',
      payment: 'cash'
    });
  };

  const totalPrice = calculatePrice();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-400 text-lg">Loading shop details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-8">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-gray-400 hover:text-white transition"
              >
                <i className="fas fa-arrow-left text-xl"></i>
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  PrintEase
                </h1>
                <p className="text-sm text-purple-400">
                  <i className="fas fa-store mr-1"></i>
                  {shopData?.name} • {shopData?.location}
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-xs text-gray-500">Shop Code</p>
                <p className="text-sm font-mono text-purple-400">{shopData?.code}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Card */}
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                <i className="fas fa-cloud-upload-alt text-purple-600 mr-2"></i>
                Upload Document
              </h2>

              <div
                className={`border-2 ${isDragOver ? 'border-purple-600 bg-purple-900/20' : 'border-dashed border-gray-600'} rounded-lg p-8 text-center cursor-pointer transition-all`}
                onClick={() => !uploadedFile && document.getElementById('fileInput').click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="fileInput"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                {!uploadedFile ? (
                  <div>
                    <i className="fas fa-file-upload text-5xl text-gray-400 mb-4"></i>
                    <p className="text-gray-400 mb-2">
                      Drag and drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">Supports PDF and DOCX files (Max 50MB)</p>
                  </div>
                ) : (
                  <div>
                    <i className="fas fa-file-pdf text-5xl text-red-500 mb-4"></i>
                    <p className="text-white font-semibold mb-1">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500 mb-3">{formatFileSize(uploadedFile.size)} • {pageCount} pages</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      <i className="fas fa-times mr-1"></i> Remove File
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Print Settings */}
            {uploadedFile && (
              <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
                <h2 className="text-lg font-bold text-white mb-4">
                  <i className="fas fa-cog text-purple-600 mr-2"></i>
                  Print Settings
                </h2>

                <div className="space-y-6">
                  {/* Number of Copies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Copies
                    </label>
                    <input
                      type="number"
                      value={settings.copies}
                      onChange={(e) => updateSetting('copies', Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-700 text-white"
                    />
                  </div>

                  {/* Color Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Color Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${settings.color === 'bw'
                          ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                          : 'border-gray-700 hover:border-gray-600'
                          }`}
                        onClick={() => updateSetting('color', 'bw')}
                      >
                        <div className="text-center">
                          <i className="fas fa-palette text-2xl text-gray-400 mb-2"></i>
                          <p className="font-medium text-white">Black & White</p>
                          <p className="text-xs text-gray-500">₹{shopData?.bwRate}/page</p>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${settings.color === 'color'
                          ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                          : 'border-gray-700 hover:border-gray-600'
                          }`}
                        onClick={() => updateSetting('color', 'color')}
                      >
                        <div className="text-center">
                          <i className="fas fa-fill-drip text-2xl text-purple-600 mb-2"></i>
                          <p className="font-medium text-white">Color</p>
                          <p className="text-xs text-gray-500">₹{shopData?.colorRate}/page</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Print Sides */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Print Sides
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${settings.sides === 'single'
                          ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                          : 'border-gray-700 hover:border-gray-600'
                          }`}
                        onClick={() => updateSetting('sides', 'single')}
                      >
                        <div className="text-center">
                          <i className="fas fa-file text-2xl text-gray-400 mb-2"></i>
                          <p className="font-medium text-white">Single-Sided</p>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${settings.sides === 'double'
                          ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                          : 'border-gray-700 hover:border-gray-600'
                          }`}
                        onClick={() => updateSetting('sides', 'double')}
                      >
                        <div className="text-center">
                          <i className="fas fa-copy text-2xl text-purple-600 mb-2"></i>
                          <p className="font-medium text-white">Double-Sided</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${settings.payment === 'cash'
                          ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                          : 'border-gray-700 hover:border-gray-600'
                          }`}
                        onClick={() => updateSetting('payment', 'cash')}
                      >
                        <div className="text-center">
                          <i className="fas fa-money-bill-wave text-2xl text-green-600 mb-2"></i>
                          <p className="font-medium text-white text-sm">Cash at Shop</p>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${settings.payment === 'upi'
                          ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                          : 'border-gray-700 hover:border-gray-600'
                          }`}
                        onClick={() => updateSetting('payment', 'upi')}
                      >
                        <div className="text-center">
                          <i className="fas fa-qrcode text-2xl text-purple-600 mb-2"></i>
                          <p className="font-medium text-white text-sm">UPI Payment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">
                <i className="fas fa-calculator text-purple-600 mr-2"></i>
                Order Summary
              </h2>

              {uploadedFile ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Pages</span>
                      <span className="font-medium text-white">{pageCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Copies</span>
                      <span className="font-medium text-white">{settings.copies}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Pages</span>
                      <span className="font-medium text-white">{pageCount * settings.copies}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Color Mode</span>
                      <span className="font-medium text-white">
                        {settings.color === 'bw' ? 'B&W' : 'Color'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Print Sides</span>
                      <span className="font-medium text-white">
                        {settings.sides === 'single' ? 'Single' : 'Double'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rate per page</span>
                      <span className="font-medium text-white">
                        ₹{(settings.color === 'bw' ? shopData?.bwRate : shopData?.colorRate).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Total Amount</span>
                      <span className="text-2xl font-bold text-purple-600">₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle mr-2"></i>
                        Place Order
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-file-upload text-4xl text-gray-600 mb-3"></i>
                  <p className="text-gray-400 text-sm">Upload a document to continue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-green-500 text-3xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center">Order Placed Successfully!</h3>
            </div>

            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID</span>
                  <span className="font-semibold text-white">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shop</span>
                  <span className="font-semibold text-white">{orderDetails.shop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">File</span>
                  <span className="font-semibold text-white text-sm truncate max-w-[180px]">
                    {orderDetails.fileName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Pages</span>
                  <span className="font-semibold text-white">{orderDetails.totalPages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment</span>
                  <span className="font-semibold text-white">{orderDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-3 mt-3">
                  <span className="text-lg font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-purple-600">₹{orderDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  {settings.payment === 'cash'
                    ? 'Please collect your prints from the shop and pay the amount in cash.'
                    : 'Payment is required before printing. Please complete the UPI payment.'}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={resetOrder}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  New Order
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center pb-4">
        <p className="text-sm text-gray-400">
          © 2025 PrintEase | Designed by{' '}
          <span className="font-semibold text-purple-400">Bhavneet Verma</span>
        </p>
      </footer>
    </div>
  );
}