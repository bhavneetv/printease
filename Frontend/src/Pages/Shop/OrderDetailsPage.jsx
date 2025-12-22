import React from 'react';
import { ChevronLeft, Printer, Truck, Mail, Phone, MapPin, PackageCheck } from 'lucide-react';

export const OrderDetailsPage = () => {
  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Order #ORD-8824</h1>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded uppercase">Paid</span>
              </div>
              <p className="text-slate-500 text-sm">Placed on Dec 22, 2025 at 10:45 PM</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Printer size={18} /> Print Invoice
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 shadow-sm">
              <Truck size={18} /> Mark as Shipped
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Items & History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-bold text-slate-900">Items Summary</h3>
              </div>
              <div className="p-6 space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center justify-between py-2">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 bg-slate-100 rounded-lg border border-slate-200 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">Technical Shell Jacket</p>
                        <p className="text-sm text-slate-500 font-medium">Size: XL • Color: Matte Black</p>
                        <p className="text-xs text-slate-400 mt-1">SKU: TS-JK-12</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">$210.00</p>
                      <p className="text-sm text-slate-500">Qty: 1</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-slate-50/50 rounded-b-xl border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>$420.00</span></div>
                <div className="flex justify-between text-sm text-slate-600"><span>Shipping (Expedited)</span><span>$15.00</span></div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span><span>$435.00</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-6">Order Timeline</h3>
                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                        <p className="text-sm font-bold text-slate-900">Order Paid</p>
                        <p className="text-xs text-slate-500">Dec 22, 2025 • 10:47 PM</p>
                    </div>
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white" />
                        <p className="text-sm font-medium text-slate-500">Awaiting Fulfillment</p>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Customer Profile */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-6">Customer Details</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                  SC
                </div>
                <div>
                  <p className="font-bold text-slate-900">Sarah Chen</p>
                  <p className="text-sm text-slate-500">Customer since 2023</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-slate-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-slate-400 font-medium uppercase text-[10px]">Email</p>
                    <p className="text-slate-900">sarah.chen@example.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-slate-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-slate-400 font-medium uppercase text-[10px]">Phone</p>
                    <p className="text-slate-900">+1 (555) 012-3456</p>
                  </div>
                </div>
                <hr className="border-slate-100" />
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-slate-400 font-medium uppercase text-[10px]">Shipping Address</p>
                    <p className="text-slate-900">123 Tech Valley Dr.<br/>Palo Alto, CA 94301</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <PackageCheck size={20} className="text-indigo-300" />
                    <h3 className="font-bold">Staff Note</h3>
                </div>
                <p className="text-indigo-100 text-sm leading-relaxed">
                    Customer requested recycled packaging. Please ensure the eco-friendly kit is used for this shipment.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};