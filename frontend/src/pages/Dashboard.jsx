import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import API_BASE_URL from "../config";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      const res = await axios.get(`${API_BASE_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      fetchOrders();
    }
  }, [navigate, fetchOrders]);

  const totalAcquisitions = orders.length;
  const pendingInventory = orders.filter(o => o.status === "pending" || o.status === "shipped").length;
  const recentOrders = orders.slice(0, 3); // Get last 3 orders

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 font-sans text-black dark:text-white transition-colors duration-1000 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <main className="max-w-[1500px] mx-auto px-8 lg:px-16 py-20 lg:py-32">
        <div className="mb-20 animate-reveal">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6">
            Private Suite / {user?.name?.toUpperCase() || "MEMBER"}
          </p>
          <h1 className="text-6xl lg:text-8xl apex-text-headline tracking-tighter leading-none mb-10">
            Personal <br /> Archive.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 lg:gap-2 animate-slide-up">
          <div className="p-12 lg:p-16 bg-slate-50 dark:bg-white/[0.02] flex flex-col justify-between group cursor-default hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-700">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-slate-400 group-hover:text-slate-500 transition-colors">Total Acquisitions</p>
              <h3 className="text-7xl font-black tracking-tighter leading-none">
                {loading ? "..." : totalAcquisitions.toString().padStart(2, '0')}
              </h3>
            </div>
            <button onClick={() => navigate("/my-orders")} className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] flex items-center group-hover:translate-x-4 transition-transform duration-700">
              View History <span className="ml-4">→</span>
            </button>
          </div>

          <div className="p-12 lg:p-16 bg-slate-50 dark:bg-white/[0.02] flex flex-col justify-between group cursor-default hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-700">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-slate-400 group-hover:text-slate-500 transition-colors">Inventory Pending</p>
              <h3 className="text-7xl font-black tracking-tighter leading-none">
                {loading ? "..." : pendingInventory.toString().padStart(2, '0')}
              </h3>
            </div>
            <p className="mt-12 text-[10px] font-mono text-slate-400 group-hover:text-slate-500 uppercase tracking-widest">Awaiting Dispatch</p>
          </div>

          <div className="p-12 lg:p-16 bg-slate-50 dark:bg-white/[0.02] flex flex-col justify-between group cursor-default hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-700">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-slate-400 group-hover:text-slate-500 transition-colors">Access Level</p>
              <h3 className="text-7xl font-black tracking-tighter leading-none">{user?.isAdmin ? "ROOT" : "GOLD"}</h3>
            </div>
            <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] flex items-center">
              Member Status: Active
            </p>
          </div>
        </div>

        {/* Recent Acquisitions Section */}
        {!loading && recentOrders.length > 0 && (
          <div className="mt-20 animate-slide-up">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10">Recent Acquisitions_</h3>
            <div className="space-y-px">
              {recentOrders.map((order) => (
                <div key={order._id} className="p-8 bg-slate-50 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500 group">
                  <div className="flex items-center space-x-8">
                    <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">#{order._id.slice(-8).toUpperCase()}</span>
                    <div>
                      <h4 className="text-lg font-black tracking-tight uppercase">
                        {order.products.length} {order.products.length === 1 ? "Premium Item" : "Premium Items"}
                      </h4>
                      <p className="text-[8px] font-mono opacity-50 uppercase tracking-widest mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-12">
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Status</p>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === "completed" ? "text-emerald-500" : "text-amber-500"}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Value</p>
                      <span className="text-xl font-black tracking-tight">₹{order.totalAmount}</span>
                    </div>
                    <button onClick={() => navigate("/my-orders")} className="p-4 border border-current opacity-20 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black">VIEW</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 flex space-x-12">
          <button 
            onClick={() => navigate("/profile")}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black dark:hover:text-white transition-colors underline underline-offset-8"
          >
            Management Profile
          </button>
          <button 
            onClick={() => { logout(); navigate("/login"); }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:opacity-50 transition-opacity underline underline-offset-8"
          >
            Terminate Session (Logout)
          </button>
        </div>

        {/* Technical Footer Decoration */}
        <div className="mt-32 pt-12 border-t border-black/5 dark:border-white/5 font-mono text-[8px] uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-2">
            <p>ID_SECURE: {user?._id?.toUpperCase() || "AUTH_PENDING"}</p>
            <p>LOC_SESSION: PORT_8080</p>
          </div>
          <div className="space-y-2 text-right">
            <p>ENCRYPTION: SH-256V2</p>
            <p>© 2026 APEX_ATELIER_SYSTEMS</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

