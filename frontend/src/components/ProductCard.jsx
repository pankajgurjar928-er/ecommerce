import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import ImageWithFallback from './ImageWithFallback';
import axios from 'axios';
import API_BASE_URL from '../config';

const ProductCard = ({ item, onEdit }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const modal = useModal();
  const toast = useToast();

  const isSaved = isInWishlist(item._id);

  const handleDelete = (e) => {
    e.stopPropagation();
    modal.confirm({
      title: "Decommission Asset",
      message: `Are you sure you want to permanently remove "${item.name}" from the active inventory matrix?`,
      confirmText: "Decommission",
      cancelText: "Abort",
      isDestructive: true,
      onConfirm: async () => {
        const token = localStorage.getItem("token");
        try {
          await axios.delete(`${API_BASE_URL}/api/products/${item._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success("Asset decommissioned successfully");
          window.location.reload(); // Refresh to reflect changes
        } catch (err) {
          toast.error("Process Failed: Decommissioning aborted");
        }
      }
    });
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(item);
    } else {
      // Fallback: Navigate to admin products with edit intent
      navigate(`/admin/products?edit=${item._id}`);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${item._id}`)}
      className="group flex flex-col h-full bg-white dark:bg-apex-800 rounded-xl border border-black/5 dark:border-white/5 shadow-retail hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-slide-up relative overflow-hidden"
    >
      {/* 🖼️ Studio Image Container */}
      <div className="relative aspect-[1/1] overflow-hidden bg-slate-50 dark:bg-white/5 flex items-center justify-center p-6 sm:p-8">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain transform transition-transform duration-500 ease-out group-hover:scale-110"
        />
        
        {/* Wishlist Button (Heart) */}
        {!user?.isAdmin && (
          <button 
            onClick={async (e) => { 
              e.stopPropagation(); 
              const result = await toggleWishlist(item);
              if (result === "redirect_to_login") navigate("/login");
            }}
            className={`absolute top-4 right-4 z-40 w-10 h-10 flex items-center justify-center backdrop-blur-md rounded-full shadow-md transition-all group/heart ${isSaved ? "bg-red-500 text-white" : "bg-white/80 dark:bg-black/40 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/20"}`}
          >
            <svg className={`w-5 h-5 transition-transform group-hover/heart:scale-125 ${isSaved ? "fill-current" : "fill-none"}`} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}

        {/* 🏷️ Discount Badge Top-Left */}
        {item.discount > 0 && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-md z-20 shadow-md">
            {item.discount}% OFF
          </div>
        )}

        {/* Admin 3-Dot Menu (Repositioned to bottom-right of image) */}
        {user?.isAdmin && (
          <div className="absolute bottom-4 right-4 z-30" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-sm border border-black/5 dark:border-white/10 cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </label>
              <ul tabIndex={0} className="dropdown-content z-[40] menu p-1.5 shadow-2xl bg-white dark:bg-apex-800 border border-black/10 dark:border-white/10 w-48 rounded-xl uppercase text-[10px] font-black tracking-widest mt-2">
                <li><button onClick={handleEditClick} className="py-3.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg transition-colors">Modify_Asset</button></li>
                <li><button onClick={handleDelete} className="py-3.5 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors">Delete_Permanent_</button></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 📦 Retail Content Container */}
      <div className="p-5 flex flex-col flex-1 bg-white dark:bg-apex-800">
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{item.category}</p>
          <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug tracking-tight line-clamp-2 min-h-[2.5rem] group-hover:text-black dark:group-hover:text-white transition-colors">
            {item.name}
          </h3>
        </div>

        <div className="mt-auto pt-4 flex flex-col space-y-5">
          {/* Flipkart-style Pricing Row */}
          <div className="flex items-baseline flex-wrap gap-2">
            <span className="text-xl font-bold text-black dark:text-white tracking-tight">₹{item.finalPrice || item.price}</span>
            {item.discount > 0 && (
              <>
                <span className="text-xs text-slate-400 line-through tracking-tighter">₹{item.price}</span>
                <span className="text-xs font-bold text-emerald-500">{item.discount}% off</span>
              </>
            )}
          </div>

          {(!user || !user.isAdmin) && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (!user) { navigate("/login"); return; }
                addToCart(item);
              }}
              className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:opacity-85 shadow-lg active:scale-95 transition-all"
            >
              Add to Bag
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
