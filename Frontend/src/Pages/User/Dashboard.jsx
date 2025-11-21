import React from "react";
import { FaShoppingCart, FaFileAlt, FaRupeeSign, FaClock } from "react-icons/fa";
import axios from "axios"
import { useEffect , useState } from "react";

export default function Dashboard() {
  const stats = [
    {
      icon: <FaShoppingCart className="text-purple-400 text-3xl" />,
      title: "Total Orders",
      value: "248",
      change: "↑ 12% from last month",
      color: "text-green-400",
    },
    {
      icon: <FaFileAlt className="text-blue-400 text-3xl" />,
      title: "Pages Printed",
      value: "3,847",
      change: "↑ 8% from last month",
      color: "text-green-400",
    },
    {
      icon: <FaRupeeSign className="text-green-500 text-3xl" />,
      title: "Total Spent",
      value: "₹4,285",
      change: "Average ₹17.28/order",
      color: "text-gray-400",
    },
    {
      icon: <FaClock className="text-yellow-400 text-3xl" />,
      title: "Pending Orders",
      value: "5",
      change: "2 ready for pickup",
      color: "text-yellow-400",
    },
  ];

  const rows = [
    { id: "#ORD-2847", doc: "Assignment.pdf", pages: 24, amount: "₹96", status: "Completed" },
    { id: "#ORD-2846", doc: "Notes.pdf", pages: 15, amount: "₹60", status: "Processing" },
    { id: "#ORD-2845", doc: "Report.docx", pages: 42, amount: "₹168", status: "Completed" },
    { id: "#ORD-2844", doc: "Presentation.pptx", pages: 8, amount: "₹32", status: "Pending" },
    { id: "#ORD-2843", doc: "Syllabus.pdf", pages: 6, amount: "₹24", status: "Completed" },
  ];

  const badge = (status) => {
    const colors = {
      Completed: "bg-green-200 text-green-700",
      Processing: "bg-blue-200 text-blue-700",
      Pending: "bg-yellow-200 text-yellow-700",
    };
    return (
      <span className={`px-3 py-1 text-xs rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };



  const fetching = async ()=>{
    await axios.get("").then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  }
  useEffect(() => {
fetching()
}, [])


  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Welcome, Bhavneet 👋
        </h1>
        <p className="text-gray-400 text-sm">
          Here's what's happening with your print orders today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col gap-4"
          >
            {s.icon}
            <p className="text-gray-400 text-sm">{s.title}</p>
            <h2 className="text-3xl font-bold">{s.value}</h2>
            <span className={`text-xs ${s.color}`}>{s.change}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300 text-sm">
            <thead className="border-b border-slate-600 text-gray-400 uppercase text-xs">
              <tr>
                <th className="py-3">Order ID</th>
                <th className="py-3">Document</th>
                <th className="py-3">Pages</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700/50">
                  <td className="py-4 font-medium text-white">{row.id}</td>
                  <td className="py-4">{row.doc}</td>
                  <td className="py-4">{row.pages}</td>
                  <td className="py-4">{row.amount}</td>
                  <td className="py-4">{badge(row.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-xs mt-10">
        © 2025 PrintEase | Designed by{" "}
        <span className="text-purple-400 font-medium">Bhavneet Verma</span>
      </p>

    </div>
  );
}
