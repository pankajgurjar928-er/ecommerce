import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ImageWithFallback from "../components/ImageWithFallback";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    // Scroll to top automatically when entering page
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error("Failed to load product details.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, toast]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const success = await addToCart(product);
    setAddingToCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-apex-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 font-sans text-black dark:text-white transition-colors duration-1000 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 lg:py-16">
        {/* 🔙 Back Navigation */}
        <div className="mb-12 animate-reveal">
          <button 
            onClick={() => navigate("/collection")} 
            className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span className="mr-4 group-hover:-translate-x-2 transition-transform duration-500 text-lg">←</span>
            Return to Collection
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-start">
          
          {/* Aesthetic Product Canvas (70% width on Desktop) */}
          <div className="w-full lg:w-[65%] lg:sticky lg:top-40">
            <div className="relative aspect-[4/5] overflow-hidden bg-apex-100 dark:bg-apex-800 flex items-center justify-center group">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform transition-transform duration-[3000ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.02]" />
              
              {product.discount > 0 && (
                <div className="absolute top-10 left-10 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black tracking-[0.5em] uppercase px-6 py-3 shadow-2xl">
                  {product.discount}% OFF
                </div>
              )}

              {/* Technical Metadata Decoration */}
              <div className="absolute bottom-10 left-10 hidden lg:block">
                <div className="font-mono text-[8px] uppercase tracking-[0.4em] text-slate-400 space-y-1">
                  <p>REF. {product._id?.substring(0, 8).toUpperCase()}</p>
                  <p>LOC. STUDIO_STORAGE_A1</p>
                  <p>TYPE. {product.category?.toUpperCase() || "CORE"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Content Canvas (35% width on Desktop) */}
          <div className="w-full lg:w-[35%] flex flex-col pt-4">
            <div className="mb-12">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6 animate-reveal">
                Product / {product.category || "General"}
              </p>
              <h1 className="text-5xl lg:text-7xl apex-text-headline mb-10 leading-[0.9] tracking-tighter sm:whitespace-normal">
                {product.name}
              </h1>
              
              <div className="flex items-end space-x-6 mb-12">
                <span className="text-4xl font-black text-black dark:text-white">
                  ₹{product.finalPrice || product.price}
                </span>
                {product.finalPrice && product.finalPrice !== product.price && (
                  <span className="text-xl font-medium text-slate-300 dark:text-slate-700 line-through pb-1">
                    ₹{product.price}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-10">
              <div className="text-slate-400 dark:text-slate-400 text-lg leading-relaxed font-medium tracking-wide border-l-2 border-black/5 dark:border-white/5 pl-8 italic">
                {product.description || "An essential addition to your collection. This premium product blends visionary design with impeccable quality and craftsmanship. Perfectly engineered for those who demand nothing but absolute excellence."}
              </div>

              <div className="space-y-4 pt-6">
                {(!user || !user.isAdmin) && (
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full apex-btn-primary py-6 text-sm disabled:opacity-50"
                  >
                    {addingToCart ? "Adding to Collection..." : "Add to Bag"}
                  </button>
                )}
                <button className="w-full py-6 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500">
                  Wishlist Archival
                </button>
              </div>

              <div className="pt-10 space-y-6">
                <div className="group flex items-center p-4 border-b border-black/5 dark:border-white/5 cursor-default hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-black mr-6">D</div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Global Dispatch</h4>
                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Complimentary standard shipping</p>
                  </div>
                </div>
                <div className="group flex items-center p-4 border-b border-black/5 dark:border-white/5 cursor-default hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-black mr-6">Q</div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Studio Certified</h4>
                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Inspected for artisanal quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
