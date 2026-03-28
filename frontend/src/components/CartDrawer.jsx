import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ImageWithFallback from './ImageWithFallback';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeItem, updateQuantity, cartTotal, cartItemsCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 transition-all duration-500 ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-xl transition-opacity duration-700 ${isCartOpen ? "opacity-100" : "opacity-0"}`} 
        onClick={() => setIsCartOpen(false)}
      ></div>
 
      {/* Bag Modal */}
      <div className={`relative w-full max-w-4xl h-full max-h-[85vh] bg-white dark:bg-apex-900 border border-black/10 dark:border-white/10 shadow-2xl transition-all duration-700 flex flex-col overflow-hidden shrink-0 ${isCartOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-10"}`}>
        {/* Header */}
        <div className="p-8 lg:p-12 flex justify-between items-center border-b border-black/5 dark:border-white/5 bg-white dark:bg-apex-900 z-10">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-2">Acquisition_Summary</p>
            <h2 className="text-4xl lg:text-5xl apex-text-headline tracking-tighter">Current Bag.</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 transition-all">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
 
        {/* Content Area with Internal Scroll */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-px bg-black/5 dark:bg-white/5 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-apex-900">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-12 animate-pulse">Inventory_Ref_Empty</p>
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/collection");
                }} 
                className="apex-btn-primary px-12 py-5 text-[10px]"
              >
                Scan Collection
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={item.productId?._id || idx} className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-12 bg-white dark:bg-apex-900 p-10 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                <div className="w-40 h-40 bg-slate-50 dark:bg-apex-800 p-4 flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/5 shrink-0">
                  <ImageWithFallback src={item.productId?.image} alt="asset" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="flex-1 w-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tight line-clamp-1">{item.productId?.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400 mt-2 uppercase tracking-widest">{item.productId?.category}</p>
                    </div>
                    <button onClick={() => removeItem(item.productId?._id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Item_Value</span>
                      <span className="font-mono text-2xl font-black text-black dark:text-white">₹{item.productId?.finalPrice || item.productId?.price}</span>
                    </div>
                    <div className="flex items-center space-x-8 border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] px-6 py-3">
                      <button onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)} className="text-lg font-black text-slate-400 hover:text-black dark:hover:text-white transition-colors">-</button>
                      <span className="text-xs font-black w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)} className="text-lg font-black text-slate-400 hover:text-black dark:hover:text-white transition-colors">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer Area */}
        {cart.length > 0 && (
          <div className="p-8 lg:p-12 bg-white dark:bg-apex-900 border-t border-black/10 dark:border-white/10">
            <div className="max-w-xl ml-auto space-y-10">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Acquisition_Total</p>
                  <h3 className="text-5xl lg:text-7xl font-black tracking-tighter">₹{cartTotal}</h3>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/checkout");
                  }} 
                  className="apex-btn-primary px-16 py-6 text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl"
                >
                  Confirm_Registry
                </button>
              </div>
              
              <div className="flex items-center justify-between opacity-30 pt-4 border-t border-black/5 dark:border-white/5">
                <p className="text-[8px] font-mono uppercase tracking-[0.5em]">Session_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[8px] font-mono uppercase tracking-widest">ENCRYPTION: ACTIVE</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
