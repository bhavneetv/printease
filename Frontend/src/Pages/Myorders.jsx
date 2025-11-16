import React, { useState } from "react";
import {
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaRupeeSign,
} from "react-icons/fa";

export default function Myorders() {
  const tabs = ["All Orders", "Pending", "Printing", "Completed"];
  const [active, setActive] = useState("All Orders");

  const stats = [
    {
      icon: <FaShoppingBag className="text-purple-400 text-3xl" />,
      title: "Total Orders",
      value: 8,
    },
    {
      icon: <FaClock className="text-yellow-400 text-3xl" />,
      title: "Pending Orders",
      value: 2,
    },
    {
      icon: <FaCheckCircle className="text-green-400 text-3xl" />,
      title: "Completed Orders",
      value: 4,
    },
    {
      icon: <FaRupeeSign className="text-blue-400 text-3xl" />,
      title: "Total Spent",
      value: "₹1,652",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-gray-400 text-sm">Track and manage all your print orders</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col gap-3"
          >
            {s.icon}
            <p className="text-gray-300 text-sm">{s.title}</p>
            <h2 className="text-3xl font-bold">{s.value}</h2>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
              active === t
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-slate-800 text-gray-300 border-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl w-full overflow-x-auto">
        <table className="w-full text-sm text-gray-300">
          <thead className="border-b border-slate-600 text-gray-400 uppercase text-xs">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">File Name</th>
              <th className="py-3 px-4 text-left">Shop Name</th>
              <th className="py-3 px-4 text-left">Pages × Copies</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Payment</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* No Orders Placeholder */}
            <tr>
              <td colSpan={9} className="text-center py-10 text-gray-500">
                No orders found for <span className="text-purple-400">{active}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-6">
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold">
          Load More Orders
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-xs mt-10">
        © 2025 PrintEase | Designed by{" "}
        <span className="text-purple-400 font-medium">Bhavneet Verma</span>
      </p>
    </div>
  );
}
