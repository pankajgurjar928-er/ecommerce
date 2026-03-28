import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { useModal } from "../context/ModalContext";
import { useToast } from "../context/ToastContext";

const Home = () => {
  const [productsData, setProductsData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Admin Edit State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", discount: "", category: "", image: "" });

  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const modal = useModal();
  const toast = useToast();
  
  const itemsPerPage = 8;
  
  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProductsData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (prod) => {
    setEditingId(prod._id);
    setForm({ name: prod.name, price: prod.price, discount: prod.discount || 0, category: prod.category, image: prod.image || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API_BASE_URL}/api/products/${editingId}`, form, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      toast.success("Product updated successfully");
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update Failed");
    }
  };

  // 🔍 FILTER
  const filtered = productsData.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  // 📄 PAGINATION
  const start = (page - 1) * itemsPerPage;
  const selectedProducts = filtered.slice(start, start + itemsPerPage);

  // 🎠 CAROUSEL STATE
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "Discover Quality",
      highlight: "Elevate Style",
      desc: "Explore our curated collection of premium products designed for the modern lifestyle. Quality meets aesthetic perfection."
    },
    {
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "Smart Devices",
      highlight: "Smarter Life",
      desc: "Get the latest tech gadgets and stay ahead of the digital curve with our innovative electronics collection."
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "Latest Fashion",
      highlight: "Iconic Arrivals",
      desc: "Refresh your wardrobe with our stunning new arrivals. High-end fashion tailored for those who dare to stand out."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 pb-24 transition-colors duration-1000 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <main className="w-full pb-24">
        {/* 🎬 Apex Asymmetric Hero */}
        <div className="relative w-full min-h-[90vh] lg:h-screen flex flex-col lg:flex-row items-center bg-white dark:bg-apex-900 overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex flex-col lg:flex-row transition-all duration-2000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0 pointer-events-none"
              }`}
            >
              <div className="w-full lg:w-[60%] h-full relative overflow-hidden group">
                <img
                  src={slide.image}
                  alt="hero"
                  className={`w-full h-full object-cover transition-all duration-[4000ms] ease-out ${
                    index === currentSlide ? "scale-100 blur-0" : "scale-125 blur-sm"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-apex-900 via-transparent to-transparent lg:hidden" />
              </div>

              <div className="w-full lg:w-[40%] h-full flex flex-col justify-center px-8 lg:px-24 py-20 lg:py-0 bg-white dark:bg-apex-900 z-20">
                <div className="overflow-hidden mb-6">
                  <p className={`text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 ${index === currentSlide ? 'animate-reveal' : 'opacity-0'}`}>
                    0{index + 1} / 0{slides.length} — APEX COLLECTION
                  </p>
                </div>
                
                <div className="relative mb-10">
                  <h1 className={`text-6xl sm:text-7xl lg:text-[7vw] font-serif leading-[0.95] tracking-tightest ${index === currentSlide ? 'mask-reveal' : 'opacity-0'}`}>
                    {slide.title} <br />
                    <span className="italic font-light text-slate-300 dark:text-slate-700">{slide.highlight}</span>
                  </h1>
                </div>

                <p className={`text-slate-500 dark:text-slate-400 text-sm lg:text-base font-medium max-w-sm mb-12 leading-relaxed tracking-wide transition-all duration-1000 delay-500 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {slide.desc}
                </p>

                <div className={`flex transition-all duration-1000 delay-700 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <button onClick={() => navigate("/collection")} className="apex-btn-primary group flex items-center">
                    Explore Now
                    <span className="ml-4 group-hover:translate-x-2 transition-transform duration-500">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-0 z-40 flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="group relative flex items-center justify-center p-2"
                aria-label={`Slide ${idx + 1}`}
              >
                <div className={`transition-all duration-700 ${
                  currentSlide === idx 
                    ? "w-12 lg:w-px lg:h-12 bg-black dark:bg-white" 
                    : "w-2 lg:w-px lg:h-4 bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-400"
                }`} />
                {currentSlide === idx && (
                  <span className="absolute -top-6 lg:-top-auto lg:-left-12 text-[10px] font-black text-black dark:text-white transition-opacity duration-1000">
                    0{idx + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 mt-12 sm:mt-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 border-b border-black/5 dark:border-white/5 pb-10">
            <div>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif mb-4 leading-none">Curated.</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Seasonal Arrivals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {selectedProducts.map((item) => (
              <ProductCard key={item._id} item={item} onEdit={handleOpenModal} />
            ))}
          </div>

          {filtered.length > itemsPerPage && (
            <div className="mt-20 flex justify-center items-center space-x-4 animate-slide-up">
              {Array.from({
                length: Math.ceil(filtered.length / itemsPerPage),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 text-sm font-bold flex items-center justify-center transition-colors border ${
                    page === i + 1
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "text-slate-400 hover:text-black dark:hover:text-white border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 🧾 Quick Override Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-apex-900 w-full max-w-3xl h-full max-h-[85vh] flex flex-col p-10 lg:p-16 border border-black/10 dark:border-white/10 animate-reveal shadow-2xl overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
              <h3 className="text-4xl lg:text-5xl apex-text-headline tracking-tighter mb-16 uppercase font-black">
                Override_Asset
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="group relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Asset_Nomenclature</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 py-4 text-lg font-black outline-none focus:border-black dark:focus:border-white transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-16">
                  <div className="group relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Market_Valuation (₹)</label>
                    <input required type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 py-4 text-lg font-mono font-black outline-none focus:border-black dark:focus:border-white transition-colors" />
                  </div>
                  <div className="group relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Offload_Margin (%)</label>
                    <input type="number" min="0" max="100" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 py-4 text-lg font-mono font-black outline-none focus:border-black dark:focus:border-white transition-colors" />
                  </div>
                </div>

                <div className="group relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Category_Tag</label>
                  <input required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 py-4 text-lg font-black outline-none focus:border-black dark:focus:border-white transition-colors" placeholder="CORE_LOGISTICS" />
                </div>

                <div className="group relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Image_Reference_URL</label>
                  <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 py-4 text-sm font-medium outline-none focus:border-black dark:focus:border-white transition-colors" placeholder="https://..." />
                </div>

                <div className="flex items-center space-x-10 pt-10 pb-4">
                  <button type="button" onClick={() => setShowModal(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black dark:hover:text-white transition-colors">Abort_Task</button>
                  <button type="submit" className="flex-1 apex-btn-primary py-6 text-[10px] uppercase font-black tracking-[0.4em]">COMMIT_OVERRIDE</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;