import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cartItemsCount, setIsCartOpen } = useCart();

  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) return null; // No bottom nav on admin portal

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] lg:hidden">
      <div className="apex-glass border-t border-black/5 dark:border-white/5 px-2 py-3 flex items-center justify-around shadow-2xl">
        <button 
          onClick={() => navigate("/")}
          className={`flex flex-col items-center space-y-1 transition-colors ${location.pathname === '/' ? 'text-black dark:text-white' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
        </button>

        <button 
          onClick={() => navigate("/collection")}
          className={`flex flex-col items-center space-y-1 transition-colors ${location.pathname === '/collection' ? 'text-black dark:text-white' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span className="text-[8px] font-black uppercase tracking-widest">Catalog</span>
        </button>

        <button 
          onClick={() => user ? setIsCartOpen(true) : navigate("/login")}
          className="relative flex flex-col items-center space-y-1 text-slate-400"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-[7px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white dark:border-black animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest">Bag</span>
        </button>

        <button 
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center space-y-1 transition-colors ${location.pathname === '/profile' ? 'text-black dark:text-white' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
