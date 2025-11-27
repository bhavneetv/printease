import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function PrintUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [settings, setSettings] = useState({
    copies: 1,
    color: 'bw',
    sides: 'single',
    paperSize: 'A4',
    shopRate: 4,
    shopType: 'manual',
    payment: 'upi',
    selectedShop: ''
  });

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
    let baseRate = settings.shopRate;
    
    if (settings.color === 'color') {
      baseRate = 12;
    }
    
    if (settings.paperSize === 'A3') {
      baseRate += 5;
    }
    
    return pageCount * settings.copies * baseRate;
  };

  const handleSubmit = () => {
    if (!uploadedFile) return;
    
    // Console log all information
    const orderInfo = {
      fileName: uploadedFile.name,
      fileSize: formatFileSize(uploadedFile.size),
      pages: pageCount,
      copies: settings.copies,
      totalPages: pageCount * settings.copies,
      colorMode: settings.color === 'bw' ? 'Black & White' : 'Color',
      printSides: settings.sides === 'single' ? 'Single-Sided' : 'Double-Sided',
      paperSize: settings.paperSize,
      shop: getShopName(),
      shopType: settings.shopType === 'auto' ? 'Auto-Assigned' : 'Manual Selection',
      paymentMethod: settings.payment === 'upi' ? 'UPI Payment' : 'Cash on Pickup',
      ratePerPage: `₹${finalRate.toFixed(2)}`,
      totalAmount: `₹${totalPrice.toFixed(2)}`,
      orderId: '#ORD-2848',
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
    console.log('  • Selection Type:', orderInfo.shopType);
    console.log('\n💰 PAYMENT INFORMATION:');
    console.log('  • Rate per Page:', orderInfo.ratePerPage);
    console.log('  • Payment Method:', orderInfo.paymentMethod);
    console.log('  • TOTAL AMOUNT:', orderInfo.totalAmount);
    console.log('='.repeat(60));
    
    // Also log as JSON for easy copy-paste
    console.log('\n📋 JSON FORMAT:');
    console.log(JSON.stringify(orderInfo, null, 2));
    console.log('='.repeat(60));
    
    setShowModal(true);
  };

  const getShopName = () => {
    if (settings.shopType === 'auto') {
      return 'Student Copy Center (Auto-assigned)';
    }
    const select = document.querySelector('#shopSelect');
    return select?.selectedOptions[0]?.text.split(' (')[0] || 'Not selected';
  };

  const baseRate = settings.color === 'color' ? 12 : settings.shopRate;
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

          {/* Print Options */}
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
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        settings.color === 'bw'
                          ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                          : 'border-gray-700'
                      }`}
                      onClick={() => updateSetting('color', 'bw')}
                    >
                      <div className="text-center">
                        <i className="fas fa-palette text-2xl text-gray-400 mb-2"></i>
                        <p className="font-medium text-white">Black & White</p>
                        <p className="text-xs text-gray-500">₹4/page</p>
                      </div>
                    </div>
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        settings.color === 'color'
                          ? 'border-purple-600 bg-gradient-to-br from-purple-900/20 to-purple-800/20'
                          : 'border-gray-700'
                      }`}
                      onClick={() => updateSetting('color', 'color')}
                    >
                      <div className="text-center">
                        <i className="fas fa-fill-drip text-2xl text-purple-600 mb-2"></i>
                        <p className="font-medium text-white">Color</p>
                        <p className="text-xs text-gray-500">₹12/page</p>
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
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        settings.sides === 'single'
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
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        settings.sides === 'double'
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

          {/* Shop Selection */}
          {uploadedFile && (
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                <i className="fas fa-store text-purple-600 mr-2"></i>
                Select Print Shop
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => updateSetting('shopType', 'manual')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                      settings.shopType === 'manual'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Manual Selection
                  </button>
                  <button
                    onClick={() => {
                      updateSetting('shopType', 'auto');
                      updateSetting('shopRate', 3.5);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                      settings.shopType === 'auto'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Auto-Assign
                  </button>
                </div>

                {settings.shopType === 'manual' ? (
                  <select
                    id="shopSelect"
                    value={settings.selectedShop}
                    onChange={(e) => {
                      updateSetting('selectedShop', e.target.value);
                      const rate = parseFloat(e.target.selectedOptions[0].dataset.rate);
                      if (rate) updateSetting('shopRate', rate);
                    }}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-700 text-white"
                  >
                    <option value="">Choose a shop...</option>
                    <option value="shop1" data-rate="4">Print Hub - Campus (₹4/page) • 2 orders</option>
                    <option value="shop2" data-rate="4.5">QuickPrint - Gate 2 (₹4.5/page) • 5 orders</option>
                    <option value="shop3" data-rate="3.5">Student Copy Center (₹3.5/page) • 8 orders</option>
                    <option value="shop4" data-rate="5">Express Prints - Main Road (₹5/page) • 1 order</option>
                  </select>
                ) : (
                  <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-green-600 text-xl mr-3 mt-1"></i>
                      <div>
                        <p className="font-medium text-green-300">
                          Auto-Assignment Enabled
                        </p>
                        <p className="text-sm text-green-400 mt-1">
                          We'll assign your order to the shop with the least queue for fastest service
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Method */}
          {uploadedFile && (
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                <i className="fas fa-credit-card text-purple-600 mr-2"></i>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    settings.payment === 'upi'
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
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    settings.payment === 'cash'
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
            </div>
            
            <div className="border-t border-gray-700 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total Amount</span>
                <span className="text-2xl font-bold text-purple-600">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!uploadedFile}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <i className="fas fa-print mr-2"></i>
              Request Print
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              <i className="fas fa-shield-alt mr-1"></i>
              Secure payment & data protection
            </p>
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
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-green-500 text-3xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center">Print Request Submitted!</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID</span>
                  <span className="font-semibold text-white">#ORD-2848</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">File Name</span>
                  <span className="font-semibold text-white">{uploadedFile?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Pages</span>
                  <span className="font-semibold text-white">
                    {pageCount} × {settings.copies} = {pageCount * settings.copies}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shop</span>
                  <span className="font-semibold text-white">{getShopName()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="font-semibold text-white">
                    {settings.payment === 'upi' ? 'UPI Payment' : 'Cash on Pickup'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-4">
                  <span className="text-lg font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-purple-600">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              {settings.payment === 'upi' && (
                <div className="bg-gray-900 rounded-lg p-6 mb-6 text-center">
                  <p className="text-sm text-gray-400 mb-3">Scan QR Code for UPI Payment</p>
                  <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center border-2 border-gray-200">
                    <i className="fas fa-qrcode text-gray-400 text-6xl"></i>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">UPI ID: printease@paytm</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    removeFile();
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition">
                  Track Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}