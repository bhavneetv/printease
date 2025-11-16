// Minimal standalone React + Tailwind code for the exact UI shown in the screenshot
// Drop this inside src/pages/UploadUI.jsx or App.jsx

import React from "react";
import { FaUpload, FaFileUpload, FaShieldAlt } from "react-icons/fa";

export default function FileUpload() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Upload File for Printing
          <span className="text-gray-300 text-xl">📄</span>
        </h1>
        <p className="text-gray-400 text-sm">Upload your document and configure print settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Box */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <FaUpload className="text-purple-400" /> Upload Document
            </h2>

            <div className="mt-4 border-2 border-dashed border-slate-600 rounded-xl p-10 text-center">
              <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-4" />

              <p className="text-gray-300 text-sm mb-1">
                Drag and drop your file here or click to browse
              </p>
              <p className="text-gray-500 text-xs">Supports PDF and DOCX files (Max 50MB)</p>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-fit">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            📑 Price Summary
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <Row label="Pages" value="0" />
            <Row label="Copies" value="1" />
            <Row label="Color Mode" value="B&W" />
            <Row label="Print Sides" value="Single" />
            <Row label="Paper Size" value="A4" />
            <Row label="Rate per page" value="₹4.00" />
          </div>

          <div className="border-t border-slate-700 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total Amount</span>
              <span className="text-2xl font-bold text-purple-400">₹0.00</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-3 rounded-lg font-semibold flex items-center justify-center text-white opacity-50 cursor-not-allowed">
            Request Print
          </button>

          <p className="text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1">
            <FaShieldAlt /> Secure payment & data protection
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-xs mt-10">
        © 2025 PrintEase | Designed by <span className="text-purple-400 font-medium">Bhavneet Verma</span>
      </p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-gray-300">
      <span>{label}</span>
      <span className="text-gray-100 font-medium">{value}</span>
    </div>
  );
}