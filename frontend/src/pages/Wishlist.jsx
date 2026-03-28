import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-1000">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 lg:py-24">
        <header className="mb-20 animate-reveal">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6">Curated_Archive_v2.0</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-[0.85] tracking-tighter">My Wishlist.</h1>
            <button onClick={() => navigate("/collection")} className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black dark:hover:text-white transition-colors flex items-center group">
              <span className="mr-3 group-hover:-translate-x-2 transition-transform duration-500">←</span> Back to Shop
            </button>
          </div>
        </header>

        {wishlist.length === 0 ? (
          <div className="aspect-[21/9] flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 group">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-12 animate-pulse">Zero_Assets_Saved</p>
            <button 
              onClick={() => navigate("/collection")} 
              className="apex-btn-primary px-16 py-6 text-[10px] uppercase font-black tracking-[0.4em]"
            >
              Browse Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 animate-slide-up">
            {wishlist.map((product) => (
              <ProductCard key={product._id} item={product} />
            ))}
          </div>
        )}

        <div className="mt-40 pt-16 border-t border-black/5 dark:border-white/5 font-mono text-[9px] text-slate-300 dark:text-slate-700 flex flex-col md:flex-row justify-between gap-8 uppercase tracking-[0.5em]">
          <p>STORES_CONNECTED: APEX_DELTA</p>
          <p>TOTAL_SAVED: {wishlist.length} ASSETS</p>
          <p>NODE: DISCOVERY_GATEWAY</p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
