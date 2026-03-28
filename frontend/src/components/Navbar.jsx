import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ImageWithFallback from './ImageWithFallback';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { cartItemsCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className={`sticky top-0 z-50 apex-glass ${isAdminPage ? 'border-b border-black/5 dark:border-white/5' : ''}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-black dark:text-white hover:opacity-50 transition-opacity"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-widest uppercase truncate max-w-[120px] sm:max-w-none">
                MY SHOP<span className="text-slate-300 dark:text-slate-600">.</span>
              </h2>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 justify-center px-8">
            {!isAdminPage && (
              <div className="flex items-center space-x-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Link to="/" className={`hover:text-black dark:hover:text-white transition-colors ${location.pathname === '/' ? 'text-black dark:text-white' : ''}`}>Home</Link>
                <Link to="/collection" className={`hover:text-black dark:hover:text-white transition-colors ${location.pathname === '/collection' ? 'text-black dark:text-white' : ''}`}>Collection</Link>
                {!user?.isAdmin && (
                  <Link to="/my-orders" className={`hover:text-black dark:hover:text-white transition-colors ${location.pathname === '/my-orders' ? 'text-black dark:text-white' : ''}`}>Logbook</Link>
                )}
                {user?.isAdmin && (
                  <Link to="/admin" className={`text-red-500 font-mono tracking-[0.3em] hover:opacity-50 transition-opacity ${location.pathname.startsWith('/admin') ? 'opacity-50' : ''}`}>Terminal_</Link>
                )}
              </div>
            )}
            {isAdminPage && (
              <div className="flex items-center space-x-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 font-mono">
                <Link to="/admin" className={`hover:text-black dark:hover:text-white py-2 ${location.pathname === '/admin' ? 'text-black dark:text-white border-b' : ''}`}>Terminal</Link>
                <Link to="/admin/products" className={`hover:text-black dark:hover:text-white py-2 ${location.pathname === '/admin/products' ? 'text-black dark:text-white border-b' : ''}`}>Inventory</Link>
                <Link to="/admin/orders" className={`hover:text-black dark:hover:text-white py-2 ${location.pathname === '/admin/orders' ? 'text-black dark:text-white border-b' : ''}`}>Logistics</Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {!isAdminPage && (
              <button 
                onClick={() => navigate("/collection?focusSearch=true")}
                className="p-2.5 text-slate-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
            )}
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>

            {/* Wishlist Button (Heart) */}
            {(!user || !user.isAdmin) && (
              <button
                onClick={() => user ? navigate("/wishlist") : navigate("/login")}
                className="relative p-2 text-black dark:text-white hover:opacity-50 transition-opacity"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-0 bg-red-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-black">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button (Always visible for non-admins) */}
            {(!user || !user.isAdmin) && (
              <button
                onClick={() => user ? setIsCartOpen(true) : navigate("/login")}
                className="relative p-2 text-black dark:text-white hover:opacity-50 transition-opacity"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-0 bg-black dark:bg-white text-white dark:text-black text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-black">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-4 sm:space-x-6">
                <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:opacity-60 transition-opacity">
                  Sign_Out
                </button>
                <div onClick={() => navigate("/profile")} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-black dark:group-hover:border-white transition-all overflow-hidden hidden sm:block">
                    <ImageWithFallback src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {user.name}
                    </span>
                    {user.isAdmin && (
                      <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">
                        System_Admin_ [Terminal_]
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <button onClick={() => navigate("/login")} className="text-[11px] font-black uppercase tracking-widest hover:opacity-60 transition-opacity">Login</button>
                <button onClick={() => navigate("/signup")} className="text-[11px] font-black uppercase tracking-widest px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity">Join Now</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📱 Mobile Navigation Drawer */}
      <div className={`fixed inset-0 z-[110] transition-all duration-500 lg:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-700 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`fixed left-0 top-0 h-full w-[80%] max-w-[400px] bg-white dark:bg-apex-900 shadow-2xl transition-transform duration-700 p-12 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center mb-20">
            <h3 className="text-3xl apex-text-headline tracking-tighter">Directory.</h3>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex flex-col space-y-12 text-2xl font-black uppercase tracking-[0.3em]">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`hover:text-slate-400 transition-colors ${location.pathname === '/' ? 'text-black dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>01. Home</Link>
            <Link to="/collection" onClick={() => setIsMobileMenuOpen(false)} className={`hover:text-slate-400 transition-colors ${location.pathname === '/collection' ? 'text-black dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>02. Collection</Link>
            {!user?.isAdmin && (
              <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className={`hover:text-slate-400 transition-colors ${location.pathname === '/my-orders' ? 'text-black dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>03. Logbook</Link>
            )}
            {user?.isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-red-500">04. Root_Terminal</Link>
            )}
          </div>

          <div className="mt-auto pt-12 border-t border-black/5 dark:border-white/5 space-y-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-400">SESSION_ACTIVE: {user?.name || "GUEST"}</p>
            {!user && (
              <div className="flex flex-col space-y-4">
                <button onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }} className="apex-btn-primary py-5">Login</button>
                <button onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }} className="text-[10px] font-black uppercase tracking-[0.3em] border border-black/10 dark:border-white/10 py-5">Join Now</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;