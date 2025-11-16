import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendar,
  FaMapMarkerAlt,
  FaLock,
} from "react-icons/fa";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaUser className="text-purple-400" />
          Profile Settings
        </h1>
        <p className="text-gray-400 text-sm">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PROFILE CARD */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">

          {/* Cover Banner */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-lg mb-6 text-center">
            <div className="relative w-28 h-28 bg-indigo-300 text-indigo-900 rounded-full mx-auto flex items-center justify-center text-4xl font-bold">
              BV
              <FaLock className="absolute bottom-0 right-0 bg-white rounded-full text-purple-500 p-1 text-sm" />
            </div>

            <h2 className="text-xl font-bold mt-4">Bhavneet Verma</h2>
            <p className="text-gray-200 text-sm">Premium Member</p>
          </div>

          {/* Info List */}
          <div className="space-y-4 text-sm">
            <InfoRow icon={<FaEnvelope />} text="bhavneet@email.com" />
            <InfoRow icon={<FaPhoneAlt />} text="+91 98765 43210" />
            <InfoRow icon={<FaCalendar />} text="Joined Jan 2024" />
            <InfoRow icon={<FaMapMarkerAlt />} text="Ambala, Haryana" />
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">248</p>
              <p className="text-gray-400 text-xs mt-1">Total Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold">₹4,285</p>
              <p className="text-gray-400 text-xs mt-1">Total Spent</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <p className="text-gray-400 text-sm mb-6">
            Update your account details and preferences
          </p>

          <form className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Full Name</label>
              <Input value="Bhavneet Verma" />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Email Address</label>
              <Input value="bhavneet@email.com" />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Phone Number</label>
              <Input value="+91 98765 43210" />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Address</label>
              <textarea
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-gray-300"
                rows="3"
                defaultValue="Ambala, Haryana, India"
              />
            </div>

            {/* Payment Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Preferred Payment Mode
                </label>
                <select className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-gray-300">
                  <option>UPI</option>
                  <option>Cash on Delivery</option>
                </select>
              </div>

              {/* UPI ID */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">UPI ID</label>
                <Input value="yourname@upi" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 py-3 rounded-lg font-semibold"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold text-gray-300 hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

// COMPONENTS
function InfoRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-gray-300">
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Input({ value }) {
  return (
    <input
      type="text"
      defaultValue={value}
      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-gray-300"
    />
  );
}
