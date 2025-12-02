import React, { useState, useEffect } from 'react';

export default function PrintUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  const API_URL = "http://localhost/printease";

  const [settings, setSettings] = useState({
    copies: 1,
    color: 'bw',
    sides: 'single',
    paperSize: 'A4',
    payment: 'upi',
    selectedShop: null
  });

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingShops(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        console.log("User location:", lat, lng);
        fetchNearbyShops(lat, lng);
      },
      (error) => {
        setIsLoadingShops(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location permission denied. Please enable location access to find nearby shops.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError("Location information unavailable.");
        } else if (error.code === error.TIMEOUT) {
          setLocationError("Location request timed out.");
        } else {
          setLocationError("An error occurred while fetching location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const submitOrderToServer = async () => {
    const formData = new FormData();

    formData.append("user_id", 2); // dynamic later
    formData.append("shop_id", settings.selectedShop);
    formData.append("payment_type", settings.payment);

    // File
    formData.append("file", uploadedFile);

    // Print details
    formData.append("total_pages", pageCount);
    formData.append("copies", settings.copies);
    formData.append("final_pages", pageCount * settings.copies);
    formData.append("color_mode", settings.color);
    formData.append("print_side", settings.sides);
    formData.append("paper_size", settings.paperSize);

    // Price
    formData.append("rate_per_page", finalRate);
    formData.append("total_amount", totalPrice);

    try {
      const response = await fetch(
        `${API_URL}/Backend/backend/upload.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.text();
      console.log("Order submission response:", data);

      if (data.success) {
        alert("Order Successful! Order ID: " + data.order_id);
      } else {
        alert("Order failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };


  const fetchNearbyShops = async (lat, lng) => {
    try {
      const res = await fetch(`${API_URL}/Backend/api/getShops.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });

      const data = await res.json();
      console.log("Nearby shops response:", data);

      if (data.success && data.shops && data.shops.length > 0) {
        setNearbyShops(data.shops);
        setLocationError('');
      } else {
        setNearbyShops([]);
        setLocationError("No nearby shops found within 10 km radius.");
      }
    } catch (err) {
      console.error("Error fetching shops:", err);
      setLocationError("Failed to fetch nearby shops. Please try again.");
      setNearbyShops([]);
    } finally {
      setIsLoadingShops(false);
    }
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
    setPageCount(Math.floor(Math.random() * 50) + 5);

    // Request location after file is uploaded
    if (!hasRequestedLocation) {
      setHasRequestedLocation(true);
      setTimeout(() => requestLocation(), 500);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPageCount(0);
    setSettings(prev => ({ ...prev, selectedShop: null }));
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

  const getSelectedShopData = () => {
    if (!settings.selectedShop) return null;
    return nearbyShops.find(shop => shop.shop_id === settings.selectedShop);
  };

  const calculatePrice = () => {
    const shopData = getSelectedShopData();
    if (!shopData) return 0;

    let baseRate = settings.color === 'bw' ? parseFloat(shopData.rate_bw) : parseFloat(shopData.rate_color);

    if (settings.paperSize === 'A3') {
      baseRate += 5;
    }

    return pageCount * settings.copies * baseRate;
  };

  const handleSubmit = () => {
    if (!uploadedFile || !settings.selectedShop) {
      alert('Please select a shop before submitting');
      return;
    }

    const shopData = getSelectedShopData();
    const totalPrice = calculatePrice();
    const baseRate = settings.color === 'bw' ? parseFloat(shopData.rate_bw) : parseFloat(shopData.rate_color);
    const finalRate = settings.paperSize === 'A3' ? baseRate + 5 : baseRate;

    const orderInfo = {
      fileName: uploadedFile.name,
      fileSize: formatFileSize(uploadedFile.size),
      pages: pageCount,
      copies: settings.copies,
      totalPages: pageCount * settings.copies,
      colorMode: settings.color === 'bw' ? 'Black & White' : 'Color',
      printSides: settings.sides === 'single' ? 'Single-Sided' : 'Double-Sided',
      paperSize: settings.paperSize,
      shop: shopData.shop_name,
      shopDistance: shopData.distance_km,
      paymentMethod: settings.payment === 'upi' ? 'UPI Payment' : 'Cash on Pickup',
      ratePerPage: `₹${finalRate.toFixed(2)}`,
      totalAmount: `₹${totalPrice.toFixed(2)}`,
      orderId: '#ORD-' + Math.floor(Math.random() * 9000 + 1000),
      timestamp: new Date().toLocaleString()
    };

    console.log('='.repeat(60));
    console.log('📄 PRINT REQUEST DETAILS');
    console.log('='.repeat(60));
    console.log('Order ID:', orderInfo.orderId);
    console.log('Timestamp:', orderInfo.timestamp);
    console.log('\n📁 FILE INFORMATION:');
    console.log('  • File Name:', orderInfo.fileName);
    console.log('  • File Size:', orderInfo.fileSize);
    console.log('  • Total Pages:', orderInfo.pages);
    console.log('\n🖨️ PRINT SETTINGS:');
    console.log('  • Number of Copies:', orderInfo.copies);
    console.log('  • Total Pages to Print:', orderInfo.totalPages);
    console.log('  • Color Mode:', orderInfo.colorMode);
    console.log('  • Print Sides:', orderInfo.printSides);
    console.log('  • Paper Size:', orderInfo.paperSize);
    console.log('\n🏪 SHOP DETAILS:');
    console.log('  • Shop Name:', orderInfo.shop);
    console.log('  • Distance:', orderInfo.shopDistance + ' km');
    console.log('\n💰 PAYMENT INFORMATION:');
    console.log('  • Rate per Page:', orderInfo.ratePerPage);
    console.log('  • Payment Method:', orderInfo.paymentMethod);
    console.log('  • TOTAL AMOUNT:', orderInfo.totalAmount);
    console.log('='.repeat(60));
    console.log('\n📋 JSON FORMAT:');
    console.log(JSON.stringify(orderInfo, null, 2));
    console.log('='.repeat(60));

    setShowModal(true);
  };

  const shopData = getSelectedShopData();
  const baseRate = shopData ? (settings.color === 'bw' ? parseFloat(shopData.rate_bw) : parseFloat(shopData.rate_color)) : 0;
  const finalRate = settings.paperSize === 'A3' ? baseRate + 5 : baseRate;
  const totalPrice = calculatePrice();

  return (
    <main className="p-3 md:p-6 mt-16 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Upload File for Printing 📄
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Upload your document and configure print settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: File Upload Card */}
          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                <span className="inline-block w-8 h-8 bg-purple-600 rounded-full text-center mr-2">1</span>
                Upload Document
              </h2>
              {uploadedFile && (
                <span className="text-green-500 text-sm">
                  <i className="fas fa-check-circle mr-1"></i>Uploaded
                </span>
              )}
            </div>

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
                  <p className="text-sm text-gray-500 mb-3">{formatFileSize(uploadedFile.size)}</p>
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

          {/* Step 2: Shop Selection */}
          {uploadedFile && (
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">
                  <span className="inline-block w-8 h-8 bg-purple-600 rounded-full text-center mr-2">2</span>
                  Select Print Shop
                </h2>
                {settings.selectedShop && (
                  <span className="text-green-500 text-sm">
                    <i className="fas fa-check-circle mr-1"></i>Selected
                  </span>
                )}
              </div>

              {isLoadingShops ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-gray-400">Finding nearby print shops...</p>
                  <p className="text-sm text-gray-500 mt-2">Please wait while we locate shops within 10km</p>
                </div>
              ) : locationError ? (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <i className="fas fa-exclamation-circle text-red-500 text-xl mr-3 mt-1"></i>
                    <div className="flex-1">
                      <p className="font-medium text-red-300 mb-2">{locationError}</p>
                      <button
                        onClick={requestLocation}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                      >
                        <i className="fas fa-redo mr-2"></i>Retry
                      </button>
                    </div>
                  </div>
                </div>
              ) : nearbyShops.length === 0 ? (
                <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 text-center">
                  <i className="fas fa-map-marker-alt text-yellow-500 text-3xl mb-3"></i>
                  <p className="text-yellow-300 mb-2">No shops found nearby</p>
                  <p className="text-sm text-yellow-400">Try allowing location access or check back later</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {nearbyShops.map((shop) => (
                    <div
                      key={shop.shop_id}
                      onClick={() => updateSetting('selectedShop', shop.shop_id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${settings.selectedShop === shop.shop_id
                        ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                        : 'border-gray-700 hover:border-gray-600'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{shop.shop_name}</h3>
                          <div className="flex items-center text-sm text-gray-400 space-x-4">
                            <span>
                              <i className="fas fa-map-marker-alt mr-1"></i>
                              ~{shop.distance_km} km away
                            </span>
                            <span>
                              <i className="fas fa-palette mr-1"></i>
                              B&W: ₹{shop.rate_bw}
                            </span>
                            <span>
                              <i className="fas fa-fill-drip mr-1"></i>
                              Color: ₹{shop.rate_color}
                            </span>
                          </div>
                        </div>
                        {settings.selectedShop === shop.shop_id && (
                          <i className="fas fa-check-circle text-purple-600 text-xl"></i>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Print Options */}
          {uploadedFile && settings.selectedShop && (
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                <span className="inline-block w-8 h-8 bg-purple-600 rounded-full text-center mr-2">3</span>
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
                    onChange={(e) => updateSetting('copies', parseInt(e.target.value) || 1)}
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
                        : 'border-gray-700'
                        }`}
                      onClick={() => updateSetting('color', 'bw')}
                    >
                      <div className="text-center">
                        <i className="fas fa-palette text-2xl text-gray-400 mb-2"></i>
                        <p className="font-medium text-white">Black & White</p>
                        <p className="text-xs text-gray-500">₹{shopData?.rate_bw}/page</p>
                      </div>
                    </div>
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${settings.color === 'color'
                        ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                        : 'border-gray-700'
                        }`}
                      onClick={() => updateSetting('color', 'color')}
                    >
                      <div className="text-center">
                        <i className="fas fa-fill-drip text-2xl text-purple-600 mb-2"></i>
                        <p className="font-medium text-white">Color</p>
                        <p className="text-xs text-gray-500">₹{shopData?.rate_color}/page</p>
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
                        : 'border-gray-700'
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
                        : 'border-gray-700'
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

                {/* Paper Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Paper Size
                  </label>
                  <select
                    value={settings.paperSize}
                    onChange={(e) => updateSetting('paperSize', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-700 text-white"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="A3">A3 (297 × 420 mm) +₹5/page</option>
                    <option value="Letter">Letter (215.9 × 279.4 mm)</option>
                    <option value="Legal">Legal (215.9 × 355.6 mm)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment Method */}
          {uploadedFile && settings.selectedShop && (
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                <span className="inline-block w-8 h-8 bg-purple-600 rounded-full text-center mr-2">4</span>
                Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${settings.payment === 'upi'
                    ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                    : 'border-gray-700'
                    }`}
                  onClick={() => updateSetting('payment', 'upi')}
                >
                  <div className="text-center">
                    <i className="fas fa-qrcode text-4xl text-purple-600 mb-3"></i>
                    <p className="font-medium text-white">UPI Payment</p>
                    <p className="text-xs text-gray-500 mt-1">Pay via QR code</p>
                  </div>
                </div>
                <div
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${settings.payment === 'cash'
                    ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                    : 'border-gray-700'
                    }`}
                  onClick={() => updateSetting('payment', 'cash')}
                >
                  <div className="text-center">
                    <i className="fas fa-money-bill-wave text-4xl text-green-600 mb-3"></i>
                    <p className="font-medium text-white">Cash on Pickup</p>
                    <p className="text-xs text-gray-500 mt-1">Pay at shop</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Price Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 sticky top-20">
            <h2 className="text-lg font-bold text-white mb-4">
              <i className="fas fa-calculator text-purple-600 mr-2"></i>
              Price Summary
            </h2>

            {!uploadedFile ? (
              <div className="text-center py-8">
                <i className="fas fa-file-upload text-5xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">Upload a document to see pricing</p>
              </div>
            ) : !settings.selectedShop ? (
              <div className="text-center py-8">
                <i className="fas fa-store text-5xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">Select a shop to see pricing</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Pages</span>
                    <span className="font-medium text-white">{pageCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Copies</span>
                    <span className="font-medium text-white">{settings.copies}</span>
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
                    <span className="text-gray-400">Paper Size</span>
                    <span className="font-medium text-white">{settings.paperSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Rate per page</span>
                    <span className="font-medium text-white">₹{finalRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shop</span>
                    <span className="font-medium text-white text-right text-xs">{shopData?.shop_name}</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-purple-600">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={submitOrderToServer}
                  disabled={!uploadedFile || !settings.selectedShop}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <i className="fas fa-print mr-2"></i>
                  Request Print
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  <i className="fas fa-shield-alt mr-1"></i>
                  Secure payment & data protection
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center pb-4">
        <p className="text-sm text-gray-400">
          © 2025 PrintEase | Designed by{' '}
          <span className="font-semibold text-purple-400">Bhavneet Verma</span>
        </p>
      </footer>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-fadeIn">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-t-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-purple-600 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Print Request Submitted!</h3>
                <p className="text-purple-100">Your order has been successfully placed</p>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 text-sm">Order ID</span>
                  <span className="font-mono font-semibold text-white">
                    {`#ORD-${Math.floor(Math.random() * 9000 + 1000)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Amount</span>
                  <span className="text-2xl font-bold text-purple-400">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <i className="fas fa-file-pdf text-purple-500 w-5"></i>
                  <span className="text-gray-400 ml-2">{uploadedFile.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-store text-purple-500 w-5"></i>
                  <span className="text-gray-400 ml-2">{shopData?.shop_name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-print text-purple-500 w-5"></i>
                  <span className="text-gray-400 ml-2">
                    {pageCount * settings.copies} pages • {settings.color === 'bw' ? 'B&W' : 'Color'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-wallet text-purple-500 w-5"></i>
                  <span className="text-gray-400 ml-2">
                    {settings.payment === 'upi' ? 'UPI Payment' : 'Cash on Pickup'}
                  </span>
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-200">
                  <i className="fas fa-info-circle mr-2"></i>
                  You will receive a confirmation email shortly with pickup details and instructions.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  removeFile();
                  setNearbyShops([]);
                  setHasRequestedLocation(false);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}