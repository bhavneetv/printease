import React, { useState, useEffect } from "react";

const ProfileSettings = () => {
  let api = import.meta.env.VITE_API;
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    paymentMode: "upi",
    upiId: "",
    profileImage: "",
    totalOrders: 0,
    totalSpent: 0,
    crea: "",
    user_id: 0,
  });
  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch profile data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const checkSession = () => {
    let user = sessionStorage.getItem("user") || 0;
    if (user == 0) {
      window.location.href = "/login";
      return false;
    }
    user = atob(user);
    user = JSON.parse(user).id;
    return user;
    // console.log("User ID from session:", user);
  };
  profileData.user_id = checkSession();

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("user_id", checkSession());

      const res = await fetch(`${api}api/fetchProfile.php`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Raw profile data:", data);
      // Debugging line

      //handle the issue
      handelPasshide(data.data.pass);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setProfileData(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handelPasshide = (val) => {
    console.log(val ? " pass" : "no");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,5}[)]?[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone.replace(/\s/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Full Name
    if (profileData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters long";
    }

    // Validate Email
    if (!validateEmail(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate Phone
    if (!validatePhone(profileData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const response = await fetch(api + "backend/update-profile.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    showToast("Profile updated successfully!", "success");
  };

  const handleCancel = () => {
    fetchProfileData();
    setErrors({});
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({ ...prev, profileImage: e.target.result }));
        showToast("Profile picture updated successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    // API call to change password
    // await fetch('https://your-api.com/api/change-password', {
    //   method: 'POST',
    //   body: JSON.stringify(passwordData)
    // });

    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    showToast("Password changed successfully!", "success");
  };

  const handleDeleteAccount = () => {
    // API call to delete account
    // await fetch('https://your-api.com/api/delete-account', {
    //   method: 'DELETE'
    // });

    setShowDeleteModal(false);
    showToast(
      "Account deletion initiated. You will receive a confirmation email.",
      "success"
    );
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  return (
    <main className="p-3 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <style>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .toast-enter {
          animation: slideInRight 0.3s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .error-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-24 right-5 z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 toast-enter`}
        >
          <i
            className={`fas ${
              toast.type === "success"
                ? "fa-check-circle"
                : "fa-exclamation-circle"
            }`}
          ></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          👤 Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-8">
        {/* Profile Overview Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="gradient-bg p-6 pb-16"></div>
            <div className="px-6 pb-6 -mt-12">
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative w-30 h-30 mb-4">
                  <img
                    src={profileData.profileImage}
                    className="w-30 h-30 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                    alt="Profile"
                  />

                  <input
                    type="file"
                    id="imageUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                  {loading ? "..." : profileData.fullName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Premium Member
                </p>

                <div className="w-full space-y-3">
                  <div className="flex items-center text-sm">
                    <i className="fas fa-envelope w-5 text-gray-400"></i>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">
                      {loading ? "..." : profileData.email}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-phone w-5 text-gray-400"></i>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">
                      {loading ? "..." : profileData.phone}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-calendar w-5 text-gray-400"></i>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">
                      {profileData.crea}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-map-marker-alt w-5 text-gray-400"></i>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">
                      {loading ? "..." : profileData.address}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {loading ? "..." : profileData.totalOrders}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Total Orders
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {loading ? "..." : `₹${profileData.totalSpent}`}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Total Spent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                Personal Information
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update your account details and preferences
              </p>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-user mr-2 text-gray-400"></i>Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                    errors.fullName
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1 error-shake">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-envelope mr-2 text-gray-400"></i>Email
                  Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 error-shake">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-phone mr-2 text-gray-400"></i>Phone
                  Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 error-shake">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                  Address
                </label>
                <textarea
                  id="address"
                  rows="3"
                  value={profileData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                ></textarea>
              </div>

              {/* Save Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 gradient-bg text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-105"
                >
                  <i className="fas fa-save mr-2"></i>Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  <i className="fas fa-times mr-2"></i>Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-4 md:mt-6">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Account Actions
              </h2>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
              >
                <span>
                  <i className="fas fa-key mr-2"></i>Change Password
                </span>
                <i className="fas fa-chevron-right"></i>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              >
                <span>
                  <i className="fas fa-trash-alt mr-2"></i>Delete Account
                </span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Change Password
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 gradient-bg text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                Delete Account
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete your account? This action cannot
                be undone and all your data will be permanently removed.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  <i className="fas fa-exclamation-triangle mr-2"></i>Warning:
                  This action is irreversible!
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Yes, Delete My Account
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default ProfileSettings;
