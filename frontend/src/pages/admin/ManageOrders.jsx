import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-slate-100 text-slate-400 border-black/5 dark:bg-white/5 dark:text-slate-500" },
  shipped:   { label: "Shipped",   color: "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" },
  completed: { label: "Completed", color: "bg-emerald-500 text-white border-emerald-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500 text-white border-red-500" },
};

// Admin can update order from: Pending <-> Shipped
const ADMIN_TRANSITIONS = {
  pending: ["pending", "shipped"],
  shipped: ["pending", "shipped"],
  completed: [],
  cancelled: [],
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setLastRefresh(new Date());
    } catch (err) {
      if (!silent) console.log(err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchOrders();
    // Real-time refresh every 5 seconds
    const interval = setInterval(() => fetchOrders(true), 5000);
    return () => clearInterval(interval);
  }, [fetchOrders, user, navigate]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 font-sans text-black dark:text-white transition-colors duration-1000 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <main className="max-w-[1600px] mx-auto px-8 lg:px-16 py-12 lg:py-16 border-x border-black/5 dark:border-white/5 bg-white dark:bg-apex-900 shadow-2xl">
        {/* 🔙 Back Navigation */}
        <div className="mb-12 animate-reveal">
          <button 
            onClick={() => navigate("/admin/dashboard")} 
            className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span className="mr-4 group-hover:-translate-x-2 transition-transform duration-500 text-lg">←</span>
            Return to Dashboard
          </button>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="animate-reveal">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.5em] mb-6">
              LOGISTICS_MONITOR / FULFILLMENT_QUEUE
            </p>
            <h2 className="text-5xl lg:text-7xl apex-text-headline tracking-tighter leading-none mb-6">
              Dispatch <br /> Ledger.
            </h2>
            <p className="text-slate-400 text-sm font-medium italic border-l border-black/10 dark:border-white/10 pl-8">
              Real-time synchronization of premium acquisitions and global dispatch states.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 font-mono text-[8px] uppercase tracking-widest">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 whitespace-nowrap">
                <div className={`w-1.5 h-1.5 rounded-full ${cfg.color.split(' ')[0]}`} />
                <span className="text-slate-500">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-40 text-center animate-pulse">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-400 font-black">Scanning Logistics Database...</p>
          </div>
        ) : (
          <div className="space-y-px bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 animate-slide-up">
            {orders.map((o) => {
              const status = o.status || "pending";
              const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
              
              return (
                <div key={o._id} className="bg-white dark:bg-apex-900 group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors p-8 lg:p-12 relative overflow-hidden">
                  <div className="flex flex-col lg:flex-row justify-between gap-12">
                    {/* Left Section: Order Data */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-6 mb-8">
                        <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-30">ORDER_REF_{o._id.slice(-8).toUpperCase()}</span>
                        <div className="h-px w-8 bg-black/10 dark:bg-white/10" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                          SYNC_DATE: {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row gap-12 mb-10">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Participant</p>
                          <h4 className="text-xl font-black tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors uppercase">{o.userId?.name || "ANONYMOUS"}</h4>
                          <p className="text-xs font-mono text-slate-400">{o.userId?.email}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Acquisition_Summary</p>
                          <div className="flex flex-wrap gap-3">
                            {o.products.map((item, i) => (
                              <span key={i} className="px-4 py-2 bg-black/5 dark:bg-white/5 text-[10px] font-mono uppercase tracking-widest">
                                {item.productId?.name} (x{item.quantity})
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 opacity-50 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 truncate max-w-md">{o.address}</span>
                      </div>
                    </div>

                    {/* Right Section: Fulfillment Controls */}
                    <div className="lg:w-[320px] flex flex-col justify-between items-end text-right">
                      <div className="mb-10">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-500 mb-2">Session_Value</p>
                        <h3 className="text-4xl lg:text-5xl font-black tracking-tighter font-mono">₹{o.totalAmount}</h3>
                      </div>

                      <div className="flex flex-col items-end gap-6 w-full">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-emerald-500' : status === 'shipped' ? 'bg-blue-500' : status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'}`} />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em]">{status}</span>
                        </div>

                        {(status === "pending" || status === "shipped") && (
                          <div className="w-full flex flex-col gap-2">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">State_Override</p>
                            <select
                              value={status}
                              onChange={(e) => updateStatus(o._id, e.target.value)}
                              className="w-full bg-slate-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 py-3 px-4 text-[10px] font-black uppercase tracking-[0.3em] outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer appearance-none text-right"
                            >
                              {ADMIN_TRANSITIONS[status].map(s => (
                                <option key={s} value={s}>{s.toUpperCase()}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Technical Registry Metadata Footer */}
        <div className="mt-40 pt-16 border-t-4 border-black dark:border-white flex flex-col md:flex-row justify-between gap-12 font-mono text-[9px] uppercase tracking-[0.5em] text-slate-400">
          <p>LOGISTICS_SYNC: STABLE</p>
          <p>TIMESTAMP: {lastRefresh.toLocaleTimeString()}</p>
          <p>ACTIVE_LOAD: {orders.filter(o => o.status !== 'completed').length} / {orders.length}</p>
        </div>
      </main>
    </div>
  );
};

export default ManageOrders;
