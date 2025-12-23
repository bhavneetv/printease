import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Search, Bell } from 'lucide-react';
import { useEffect , useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, change, isPositive }) => (
  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <div className="flex items-baseline gap-2 mt-2">
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? '↑' : '↓'} {change}
      </span>
    </div>
  </div>
);

const ShopDashboard = () => {

    const navigate = useNavigate()

useEffect(() => {

// yaha pa role ma sessionStorage ma te role likh diye 

// ar terminal ma npm i axios run krdie 

// chl yo to ma krdunnga to response leka ajiye bs bavkend ma te 

    const role = sessionStorage.getItem("")
    const doublechecking = async ()=>{
        await axios.post("" , role).then((res)=>{
            if (!res.data){
                console.log("no data came")
            }
            else{
                if (res.data.role !== "shop"){
                    navigate("/Dashboard")
                }
                else{
                    console.log("Uer verified")
                }
            }
        })
    .catch((err)=>{
        console.log(err)

    })
    }
    // doublechecking()
}, [])


  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 font-bold text-xl text-indigo-600">ShopFlow</div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, active: true },
            { name: 'Orders', icon: ShoppingCart },
            { name: 'Products', icon: Package },
            { name: 'Customers', icon: Users },
            { name: 'Analytics', icon: BarChart3 },
          ].map((item) => (
            <a key={item.name} href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${item.active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <item.icon size={18} /> {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search orders, products..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600"><Bell size={20} /></button>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">JD</div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Store Overview</h1>
            <p className="text-slate-500">Welcome back, here is what's happening today.</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Revenue" value="$42,390.00" change="12.5%" isPositive={true} />
            <StatCard title="Active Orders" value="156" change="3.1%" isPositive={true} />
            <StatCard title="Total Customers" value="2,420" change="0.4%" isPositive={false} />
            <StatCard title="Conversion Rate" value="3.24%" change="2.1%" isPositive={true} />
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Recent Orders</h2>
              <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">View all</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { id: '#ORD-7421', user: 'Alex Rivera', status: 'Shipped', total: '$124.00' },
                  { id: '#ORD-7422', user: 'Sarah Chen', status: 'Processing', total: '$89.50' },
                  { id: '#ORD-7423', user: 'Mike Ross', status: 'Delivered', total: '$210.00' },
                ].map((order) => (
                  <tr key={order.id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                    <td className="px-6 py-4 text-slate-600">{order.user}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopDashboard;