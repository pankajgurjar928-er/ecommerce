import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import ImageWithFallback from "../../components/ImageWithFallback";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({ name: "", price: "", discount: "", category: "", image: "" });
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const modal = useModal();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditingId(prod._id);
      setForm({ name: prod.name, price: prod.price, discount: prod.discount || 0, category: prod.category, image: prod.image || "" });
    } else {
      setEditingId(null);
      setForm({ name: "", price: "", discount: 0, category: "", image: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Product updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/products", form, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Product created successfully");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action Failed");
    }
  };

  const handleDelete = (id) => {
    modal.confirm({
      title: "Delete Product",
      message: "Are you sure you want to permanently delete this product? This action cannot be undone and will remove it from the catalog.",
      confirmText: "Delete Product",
      cancelText: "Cancel",
      isDestructive: true,
      onConfirm: async () => {
        const token = localStorage.getItem("token");
        try {
          await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          fetchProducts();
          toast.success("Product deleted successfully");
        } catch (err) {
          toast.error("Failed to delete product");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 font-sans text-black dark:text-white transition-colors duration-1000 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <main className="max-w-[1600px] mx-auto px-8 lg:px-16 py-12 lg:py-16 border-x border-black/5 dark:border-white/5 bg-white dark:bg-apex-900 shadow-2xl">
        {/* 🔙 Back Navigation */}
        <div className="mb-12 animate-reveal">
          <button 
            onClick={() => navigate("/admin/dashboard")} 
            className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span className="mr-4 group-hover:-translate-x-2 transition-transform duration-500 text-lg">←</span>
            Return to Dashboard
          </button>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="animate-reveal">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.5em] mb-6">
              ASSET_MANAGEMENT / CATALOG_OVERRIDE
            </p>
            <h2 className="text-6xl lg:text-7xl apex-text-headline tracking-tighter leading-none mb-6">
              Inventory <br /> Matrix.
            </h2>
            <p className="text-slate-400 text-sm font-medium italic border-l border-black/10 dark:border-white/10 pl-8">
              Full control over the Studio catalog assets and their deployment states.
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            className="apex-btn-primary px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Deploy New Asset
          </button>
        </div>

        {loading ? (
          <div className="py-40 text-center animate-pulse">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-400 font-black">Scanning Assets...</p>
          </div>
        ) : (
          <div className="border border-black/5 dark:border-white/5 animate-slide-up bg-white dark:bg-apex-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em]">Resource_Identity</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em]">Category_Tag</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em]">Valuation</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em]">Status_Markers</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-right">Actions_</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {products.map((p) => (
                    <tr 
                      key={p._id} 
                      onClick={() => handleOpenModal(p)}
                      className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group cursor-pointer border-b border-black/5 dark:border-white/5"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-6">
                          <div className="w-20 h-20 bg-slate-100 dark:bg-apex-800 p-3 flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/5">
                            <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-black tracking-tight uppercase group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">{p.name}</span>
                            <span className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-widest">ID: {p._id.slice(-12).toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors">{p.category || "UNIDENTIFIED"}</span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col font-mono text-base">
                          <span className="font-black">₹{p.price}</span>
                          {p.discount > 0 && <span className="text-[10px] text-red-500 uppercase font-black">-{p.discount}% OFF</span>}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Node_Active</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="w-10 h-10 flex items-center justify-center bg-transparent hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group/btn">
                            <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-black dark:group-hover/btn:text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </label>
                          <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow-2xl bg-white dark:bg-apex-800 border border-black/10 dark:border-white/10 w-52 rounded-none uppercase text-[9px] font-black tracking-widest">
                            <li>
                              <button onClick={() => handleOpenModal(p)} className="py-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-none transition-colors">
                                Update_Archive
                              </button>
                            </li>
                            <li>
                              <button onClick={() => handleDelete(p._id)} className="py-4 text-red-500 hover:bg-red-500 hover:text-white rounded-none transition-colors">
                                Decommission_
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-40 pt-16 border-t-4 border-black dark:border-white flex flex-col md:flex-row justify-between gap-12 font-mono text-[9px] uppercase tracking-[0.5em] text-slate-400">
          <p>MATRIX_VERIFIED: CAT_01</p>
          <p>ASSETS_TOTAL: {products.length}</p>
        </div>
      </main>

      {/* 🧾 Deployment Modal (Minimalist) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-apex-900 w-full max-w-3xl h-full max-h-[85vh] flex flex-col p-10 lg:p-16 border border-black/10 dark:border-white/10 animate-reveal shadow-2xl overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
              <h3 className="text-4xl lg:text-5xl apex-text-headline tracking-tighter mb-16">
                {editingId ? "Override_Asset" : "Deploy_Asset"}
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

              <div className="flex items-center space-x-10 pt-10">
                <button type="button" onClick={() => setShowModal(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black dark:hover:text-white transition-colors">Abort_Task</button>
                <button type="submit" className="flex-1 apex-btn-primary py-6 text-[10px] uppercase font-black tracking-[0.4em]">{editingId ? "COMMIT_OVERRIDE" : "AUTHORIZE_DEPLOY"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default ManageProducts;
