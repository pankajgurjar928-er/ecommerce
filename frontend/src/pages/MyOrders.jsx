import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import ImageWithFallback from "../components/ImageWithFallback";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      const res = await axios.get(`${API_BASE_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { 
    fetchOrders(); 
  }, [fetchOrders, user]);

  const handleAction = async (orderId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE_URL}/api/orders/${orderId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(action === "complete" ? "Order marked as completed!" : "Order cancelled successfully.");
      setConfirmingId(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 font-sans text-black dark:text-white transition-colors duration-1000 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 lg:py-16">
        {/* 🔙 Back Navigation */}
        <div className="mb-12 animate-reveal">
          <button 
            onClick={() => navigate("/profile")} 
            className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span className="mr-4 group-hover:-translate-x-2 transition-transform duration-500 text-lg">←</span>
            Return to Profile
          </button>
        </div>

        <div className="mb-20 animate-reveal">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6">
            Registry / History
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tighter leading-none mb-10">
            Acquisition <br /> Registry.
          </h1>
          <p className="text-slate-400 text-sm font-medium italic max-w-xl border-l border-black/10 dark:border-white/10 pl-8">
            An archival record of your sessions and premium acquisitions within the Studio.
          </p>
        </div>

        {loading ? (
          <div className="space-y-1 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-slate-50 dark:bg-white/[0.02]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-40 text-center border-y border-black/5 dark:border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Registry Empty</p>
            <button onClick={() => navigate("/")} className="mt-12 apex-btn-primary px-12 py-5 text-[10px] font-black uppercase tracking-widest">Initiate Search</button>
          </div>
        ) : (
          <div className="space-y-1 animate-slide-up">
            {orders.map(order => (
              <div key={order._id} className="p-8 lg:p-12 bg-slate-50 dark:bg-white/[0.02] hover:bg-black dark:hover:bg-white text-black dark:text-white hover:text-white dark:hover:text-black transition-all duration-700 group cursor-default border border-black/5 dark:border-white/5">
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                  <div className="flex-1 text-inherit">
                    <div className="flex items-center space-x-6 mb-8">
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 text-inherit">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className="w-2 h-2 rounded-full bg-current opacity-20" />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-70 text-inherit">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-baseline border-b border-black/5 dark:border-white/5 group-hover:border-white/10 dark:group-hover:border-black/10 pb-2">
                          <h4 className="text-lg font-black tracking-tight">{item.productId?.name || "Premium Item"} <span className="text-[10px] font-mono opacity-40 ml-4 italic">x{item.quantity}</span></h4>
                          <span className="font-mono text-xs opacity-60 italic">₹{item.productId?.finalPrice || item.productId?.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-[350px] flex flex-col justify-between items-end text-right">
                    <div className="mb-8">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-2">Total Value</p>
                      <h3 className="text-4xl font-black tracking-tighter">₹{order.totalAmount}</h3>
                    </div>

                    <div className="flex flex-col items-end space-y-6 w-full">
                      <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-current opacity-80">
                        <div className={`w-2.5 h-2.5 rounded-full ${order.status === "completed" ? "bg-emerald-500" : order.status === "shipped" ? "bg-blue-500" : order.status === "pending" ? "bg-amber-500" : "bg-red-500"} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{order.status}</span>
                      </div>
                      
                      {order.status === "shipped" && confirmingId !== order._id && (
                        <button
                          onClick={() => setConfirmingId(order._id)}
                          className="text-[10px] font-black uppercase tracking-[0.2em] border border-current px-8 py-4 hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all shadow-xl"
                        >
                          Confirm Receipt
                        </button>
                      )}

                      {confirmingId === order._id && (
                        <div className="animate-reveal space-y-4 w-full">
                          <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">
                            Warning: This will finalize the registry entry.
                          </p>
                          <div className="flex space-x-4 justify-end">
                            <button
                              onClick={() => setConfirmingId(null)}
                              className="text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAction(order._id, "complete")}
                              className="text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black dark:bg-black dark:text-white px-6 py-3 hover:scale-105 transition-all shadow-2xl"
                            >
                              Finalize
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Technical Footer Decoration */}
        <div className="mt-32 pt-12 border-t border-black/5 dark:border-white/5 font-mono text-[8px] uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700 flex flex-col md:flex-row justify-between gap-8">
          <p>REGISTRY_VERIFIED: SYST_04</p>
          <p>NODE: APEX_DELTA_SESSION</p>
          <p>TIMESTAMP: {new Date().toISOString()}</p>
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
