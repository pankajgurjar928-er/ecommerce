import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ImageWithFallback from "../components/ImageWithFallback";

const Cart = () => {
  const { user } = useAuth();
  const { cart, removeItem, updateQuantity, cartTotal, cartItemsCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-1000 uppercase">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 lg:py-24">
        <header className="mb-20 lg:mb-32">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6 animate-reveal">Shopping_Archive_v1.0</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-[0.85] tracking-tighter">Your Collections.</h1>
            <button onClick={() => navigate("/")} className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black dark:hover:text-white transition-colors flex items-center group">
              <span className="mr-3 group-hover:-translate-x-2 transition-transform duration-500">←</span> Back to My Shop
            </button>
          </div>
        </header>

        {cart.length === 0 ? (
          <div className="aspect-[21/9] flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 group">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-12 animate-pulse">Zero_Assets_Found</p>
            <button 
              onClick={() => navigate("/")} 
              className="apex-btn-primary px-16 py-6 text-[10px] uppercase font-black tracking-[0.4em]"
            >
              Initialize Browsing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">
            {/* List Canvas */}
            <div className="lg:col-span-8 space-y-px bg-black/5 dark:bg-white/5">
              {cart.map((item) => (
                <div key={item.productId?._id} className="bg-white dark:bg-apex-900 p-8 lg:p-12 flex flex-col sm:flex-row items-center gap-12 hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-all duration-700 group">
                  {/* Asset Container */}
                  <div className="w-40 h-40 bg-slate-50 dark:bg-white/[0.02] p-4 flex items-center justify-center relative overflow-hidden border border-black/5 dark:border-white/5">
                    <ImageWithFallback 
                      src={item.productId?.image} 
                      alt={item.productId?.name} 
                      className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute top-2 left-2 font-mono text-[7px] text-slate-300 uppercase tracking-widest">ASM.{item.productId?._id?.slice(-4)}</div>
                  </div>
                  
                  {/* Data Content */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3">{item.productId?.category}</p>
                        <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight leading-none">{item.productId?.name}</h3>
                      </div>
                      <button onClick={() => removeItem(item.productId?._id)} className="text-slate-300 hover:text-black dark:hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
                      <div className="flex items-center bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 px-4 py-2">
                        <button onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white transition-colors">-</button>
                        <span className="w-10 text-center text-[10px] font-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white transition-colors">+</button>
                      </div>
                      <div className="font-mono text-sm tracking-tighter">₹{(item.productId?.finalPrice || item.productId?.price) * item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Canvas */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-40 space-y-16">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10 pb-6 border-b border-black/5 dark:border-white/5">Session_Financials</h3>
                  <div className="space-y-6 font-mono text-[11px] uppercase tracking-widest">
                    <div className="flex justify-between text-slate-400">
                      <span>Asset_Count</span>
                      <span className="text-black dark:text-white font-black">{cartItemsCount}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal_Value</span>
                      <span className="text-black dark:text-white font-black">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Logistic_Fee</span>
                      <span className="text-emerald-500 font-black">Null_Cost</span>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t-2 border-black dark:border-white">
                  <div className="flex flex-col gap-10">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Total_Investment:</span>
                      <span className="text-4xl lg:text-5xl font-black tracking-tighter">₹{cartTotal}</span>
                    </div>
                    <button
                      onClick={() => navigate("/checkout")}
                      className="apex-btn-primary w-full py-8 text-[12px] font-black uppercase tracking-[0.5em]"
                    >
                      Commit Registry Acquisition
                    </button>
                  </div>
                </div>

                <div className="opacity-30 pt-12 flex items-center justify-center space-x-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[8px] font-mono uppercase tracking-[0.4em]">Node: APEX_MAIN_GATEWAY</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
