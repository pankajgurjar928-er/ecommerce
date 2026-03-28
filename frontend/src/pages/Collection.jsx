import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import ImageWithFallback from "../components/ImageWithFallback";

const Collection = () => {
  const [productsData, setProductsData] = useState([]);
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Default");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);
  const [isHighlighting, setIsHighlighting] = useState(false);

  // Parse search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    if (query !== null) {
      setSearchQuery(query);
    }

    if (params.get("focusSearch") === "true") {
      setShowMobileFilters(true);
      setIsHighlighting(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
        // Remove the flag from URL so it doesn't re-trigger on refresh
        params.delete("focusSearch");
        setSearchParams(params);
      }, 500); // Wait for mobile drawer transition
      
      setTimeout(() => setIsHighlighting(false), 3000);
    }
  }, [location.search, setSearchParams]);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        setProductsData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  // 🔍 FILTER & SORT
  const filtered = productsData.filter((p) => {
    const matchCategory =
      category === "All" ||
      p.category?.toLowerCase() === category.toLowerCase();
    const matchSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "LowToHigh") return (a.finalPrice || a.price) - (b.finalPrice || b.price);
    if (sortOrder === "HighToLow") return (b.finalPrice || b.price) - (a.finalPrice || a.price);
    if (sortOrder === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 pb-24 transition-colors duration-1000 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 mt-12 sm:mt-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* 📱 Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-12">
            <h2 className="text-4xl apex-text-headline tracking-tighter">Collection.</h2>
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="apex-btn-primary px-8 py-4 text-[10px] uppercase font-black tracking-[0.3em] flex items-center"
            >
              Filter_Inventory
              <svg className="ml-3 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </button>
          </div>

          {/* 🎛️ Sidebar Filters (Desktop) / Drawer (Mobile) */}
          <aside className={`fixed inset-0 z-[120] lg:relative lg:z-auto lg:block lg:w-1/4 transition-all duration-700 ${showMobileFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"}`}>
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-md lg:hidden transition-opacity duration-700 ${showMobileFilters ? "opacity-100" : "opacity-0"}`} onClick={() => setShowMobileFilters(false)} />
            <div className={`fixed right-0 top-0 h-full w-[85%] max-w-[400px] bg-white dark:bg-apex-900 shadow-2xl transition-transform duration-700 p-12 overflow-y-auto lg:relative lg:translate-x-0 lg:w-full lg:p-0 lg:bg-transparent lg:shadow-none lg:max-w-none ${showMobileFilters ? "translate-x-0" : "translate-x-full"}`}>
              <div className="flex justify-between items-center mb-16 lg:hidden">
                <h3 className="text-3xl apex-text-headline tracking-tighter">Adjust_Registry.</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-slate-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-16">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 ml-1">Search_Inventory</h3>
              <div className="relative">
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Type to filter..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent border-b-2 border-black/5 dark:border-white/5 py-3 px-1 font-black outline-none focus:border-black dark:focus:border-white transition-all ${isHighlighting ? 'animate-focus-highlight' : ''}`}
                />
                <svg className="absolute right-2 top-3 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 ml-1">Classification</h3>
              <div className="flex flex-col space-y-4">
                {["All", ...new Set(productsData.map(p => p.category).filter(Boolean))].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setShowMobileFilters(false); }}
                    className={`text-left text-sm font-black uppercase tracking-widest py-3 transition-all hover:translate-x-2 ${category === cat ? "text-black dark:text-white underline underline-offset-8 decoration-2" : "text-slate-400"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 ml-1">Sorting_Priority</h3>
              <div className="flex flex-col space-y-4">
                {[
                  { id: "Default", label: "Registry Default" },
                  { id: "LowToHigh", label: "Value: Ascending" },
                  { id: "HighToLow", label: "Value: Descending" },
                  { id: "Newest", label: "Deployment: Recent" }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSortOrder(s.id); setShowMobileFilters(false); }}
                    className={`text-left text-sm font-black uppercase tracking-widest py-3 transition-all hover:translate-x-2 ${sortOrder === s.id ? "text-black dark:text-white" : "text-slate-400"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            
              </div>
            </div>
          </aside>

          {/* 🛒 Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {sorted.map((item) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
            
            {sorted.length === 0 && (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center border border-black/5 dark:border-white/5">
                  <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest mb-2">Null_Results</h3>
                  <p className="text-sm text-slate-400">Your search criteria returned no active inventory units.</p>
                </div>
                <button 
                  onClick={() => {setCategory("All"); setSearchQuery("");}}
                  className="text-[10px] font-black uppercase tracking-[0.4em] underline underline-offset-8 decoration-2 hover:text-black dark:hover:text-white transition-colors"
                >
                  Clear_Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Collection;
