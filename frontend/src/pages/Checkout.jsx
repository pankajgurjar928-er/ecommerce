import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { cart, cartTotal, cartItemsCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!user) return navigate("/login");
    if (user.isAdmin) return navigate("/");
    if (cart.length === 0) navigate("/collection");
  }, [user, cart, navigate]);

  const deliveryCharge = 0; 
  const bulkDiscount = cartItemsCount > 5 ? Math.floor(cartTotal * 0.05) : 0;
  const finalTotal = cartTotal + deliveryCharge - bulkDiscount;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) return toast.error("Logistics Address Required.");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const productsPayload = cart.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          products: productsPayload,
          totalAmount: finalTotal,
          address: address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Registry Acquisition Successful.");
      await fetchCart(); // Clear cart after successful order
      navigate("/my-orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol Overload: Failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-1000">
      <div className="flex flex-col lg:flex-row min-h-screen pt-12 lg:pt-0">
        
        {/* Left Canvas: Fulfillment Logistics (70%) */}
        <div className="w-full lg:w-[65%] p-8 lg:p-24 border-r border-black/5 dark:border-white/5 relative">
          <header className="mb-20">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6 animate-reveal">Step_01: Fulfillment_Registry</p>
            <h1 className="text-6xl lg:text-8xl apex-text-headline leading-none tracking-tighter mb-12">Logistics.</h1>
            <button 
              onClick={() => navigate("/cart")} 
              className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <span className="mr-3 group-hover:-translate-x-2 transition-transform duration-500 text-lg">←</span>
              Return to Cart
            </button>
          </header>

          <form id="checkout-form" onSubmit={handleCheckout} className="max-w-xl space-y-16">
            <div className="space-y-8">
              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 block pb-4 border-b border-black/5 dark:border-white/5">Shipping_Coordinates</label>
              <textarea
                required
                rows="4"
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-8 text-lg font-medium outline-none focus:border-black dark:focus:border-white transition-all placeholder:text-slate-300 resize-none font-mono"
                placeholder="INPUT_FULL_DELIVERY_ADDRESS_KEY"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="bg-emerald-50/30 dark:bg-emerald-500/5 p-8 border border-emerald-500/10">
              <div className="flex items-center space-x-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Standard_Logistics: Complimentary_Active</p>
              </div>
            </div>
          </form>
        </div>

        {/* Right Canvas: Acquisition Summary (35%) */}
        <div className="w-full lg:w-[35%] bg-slate-50 dark:bg-white/[0.01] p-8 lg:p-24 flex flex-col justify-between">
          <div className="space-y-20">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-12">Registry_Acquisitions</p>
              <div className="space-y-8 max-h-[40vh] overflow-y-auto hide-scrollbar">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center group">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-white dark:bg-apex-900 border border-black/5 dark:border-white/5 p-1 flex items-center justify-center">
                        <img src={item.productId?.image} alt="asset" className="w-full h-full object-contain grayscale" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tight leading-none mb-1">{item.productId?.name}</p>
                        <p className="text-[8px] font-mono text-slate-400">QTY: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-mono text-[10px]">₹{(item.productId?.finalPrice || item.productId?.price) * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-12 border-t border-black/5 dark:border-white/5 font-mono text-[10px] uppercase tracking-widest">
              <div className="flex justify-between text-slate-400">
                <span>Sum_Total</span>
                <span className="text-black dark:text-white">₹{cartTotal}</span>
              </div>
              {bulkDiscount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Loyalty_Override</span>
                  <span>-₹{bulkDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Logistic_Surcharge</span>
                <span className="text-emerald-500">NULL</span>
              </div>
            </div>
          </div>

          <div className="pt-20">
            <div className="flex justify-between items-baseline mb-12">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Grand_Total</span>
              <span className="text-5xl lg:text-7xl font-black tracking-tighter">₹{finalTotal}</span>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="apex-btn-primary w-full py-10 text-[12px] font-black uppercase tracking-[0.5em]"
            >
              {loading ? "PROCESSING_COMMITMENT..." : "COMMIT_REGISTRY_ACQUISITION"}
            </button>
            <p className="mt-8 text-[8px] font-mono text-center text-slate-300 uppercase tracking-widest">Encryption: AES-256_ACTIVE // NODE: APEX_DELTA</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
