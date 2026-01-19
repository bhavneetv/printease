import React, { useState, useEffect } from 'react';

const ShopProfile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Shop data state
  const [shopData, setShopData] = useState({
    shopName: 'PrintEase Corner',
    description: 'Your trusted neighborhood print shop offering high-quality printing services at affordable rates.',
    address: '123 Main Street, Downtown, City - 110001',
    contactNumber: '+91 98765 43210',
    email: 'shop@printease.com',
    operatingHours: '9:00 AM - 9:00 PM',
    shopStatus: 'open',
    visibility: 'public',
    shopImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop',
    ownerName: 'Rajesh Kumar',
    totalOrders: 1247,
    rating: 4.8,
    bwPrice: 2,
    colorPrice: 8,
    upiId: 'printease@paytm',
    acceptCash: true,
    acceptUPI: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Simulate loading shop data
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const handleInputChange = (field, value) => {
    setShopData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password updated successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('shopImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-5xl text-purple-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Loading shop profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 md:p-6">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          🏪 Shop Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Manage your shop information and settings
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center">
          <i className="fas fa-check-circle text-green-600 dark:text-green-400 text-xl mr-3"></i>
          <span className="text-green-800 dark:text-green-400 font-medium">
            Changes saved successfully!
          </span>
        </div>
      )}

      {/* Shop Overview Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <i className="fas fa-store text-purple-600 mr-2"></i>
          Shop Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shop Image */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={shopData.shopImage}
                alt="Shop"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 dark:border-purple-900/20 shadow-lg"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <i className="fas fa-camera text-white text-2xl"></i>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click to change image</p>
          </div>

          {/* Shop Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {shopData.shopName}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  shopData.shopStatus === 'open'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  <i className="fas fa-circle text-xs mr-1"></i>
                  {shopData.shopStatus === 'open' ? 'Open' : 'Closed'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  shopData.visibility === 'public'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  <i className={`fas ${shopData.visibility === 'public' ? 'fa-eye' : 'fa-eye-slash'} text-xs mr-1`}></i>
                  {shopData.visibility === 'public' ? 'Public' : 'Private'}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {shopData.totalOrders.toLocaleString()}
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Shop Rating</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {shopData.rating} <i className="fas fa-star text-lg"></i>
                </p>
              </div>
            </div>

            {/* Quick Toggles */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleInputChange('shopStatus', shopData.shopStatus === 'open' ? 'closed' : 'open')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  shopData.shopStatus === 'open'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200'
                }`}
              >
                <i className={`fas ${shopData.shopStatus === 'open' ? 'fa-times-circle' : 'fa-check-circle'} mr-2`}></i>
                {shopData.shopStatus === 'open' ? 'Close Shop' : 'Open Shop'}
              </button>
              <button
                onClick={() => handleInputChange('visibility', shopData.visibility === 'public' ? 'private' : 'public')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  shopData.visibility === 'public'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200'
                }`}
              >
                <i className={`fas ${shopData.visibility === 'public' ? 'fa-eye-slash' : 'fa-eye'} mr-2`}></i>
                {shopData.visibility === 'public' ? 'Make Private' : 'Make Public'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Shop Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <i className="fas fa-info-circle text-blue-600 mr-2"></i>
            Shop Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                value={shopData.shopName}
                onChange={(e) => handleInputChange('shopName', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={shopData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <textarea
                value={shopData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows="2"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={shopData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Operating Hours
              </label>
              <input
                type="text"
                value={shopData.operatingHours}
                onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Payment Settings */}
        <div className="space-y-6">
          {/* Pricing Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <i className="fas fa-rupee-sign text-green-600 mr-2"></i>
              Pricing Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Black & White (per page)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={shopData.bwPrice}
                    onChange={(e) => handleInputChange('bwPrice', parseFloat(e.target.value))}
                    min="0"
                    step="0.5"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Print (per page)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={shopData.colorPrice}
                    onChange={(e) => handleInputChange('colorPrice', parseFloat(e.target.value))}
                    min="0"
                    step="0.5"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <p className="text-xs text-purple-800 dark:text-purple-400 flex items-start">
                  <i className="fas fa-info-circle mt-0.5 mr-2"></i>
                  <span>These prices will be displayed to customers when placing orders.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <i className="fas fa-credit-card text-indigo-600 mr-2"></i>
              Payment Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={shopData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                  placeholder="yourname@paytm"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-money-bill-wave text-orange-600 dark:text-orange-400"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Accept Cash</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Allow cash on delivery payments</p>
                  </div>
                </div>
                <button
                  onClick={() => handleInputChange('acceptCash', !shopData.acceptCash)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    shopData.acceptCash ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      shopData.acceptCash ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-mobile-alt text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Accept UPI</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Allow UPI/online payments</p>
                  </div>
                </div>
                <button
                  onClick={() => handleInputChange('acceptUPI', !shopData.acceptUPI)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    shopData.acceptUPI ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      shopData.acceptUPI ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account & Security */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <i className="fas fa-shield-alt text-red-600 mr-2"></i>
          Account & Security
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Owner Name
              </label>
              <input
                type="text"
                value={shopData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={shopData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Password Change */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
              />
            </div>

            <button
              onClick={handlePasswordUpdate}
              disabled={!passwordData.currentPassword || !passwordData.newPassword}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-key mr-2"></i>Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200">
              <i className="fas fa-pause-circle mr-2"></i>Deactivate Shop Temporarily
            </button>
            <button className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all duration-200">
              <i className="fas fa-moon mr-2"></i>Mark as Unavailable
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isSaving ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>Saving Changes...
            </>
          ) : (
            <>
              <i className="fas fa-save mr-2"></i>Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShopProfile;