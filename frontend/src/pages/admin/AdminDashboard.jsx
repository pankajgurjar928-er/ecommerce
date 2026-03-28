import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCarts, setExpandedCarts] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleCart = (userId) => {
    setExpandedCarts(prev => ({...prev, [userId]: !prev[userId]}));
  };

  const fetchStatsSilently = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [usersRes, ordersRes, productsRes, cartsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/products"), 
        axios.get("http://localhost:5000/api/admin/carts", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);

      setStats({
        users: usersRes.data.length,
        orders: ordersRes.data.length,
        products: productsRes.data.length,
        revenue: ordersRes.data.reduce((acc, order) => acc + order.totalAmount, 0)
      });

      const enrichedUsers = usersRes.data.map(user => {
         const userCart = cartsRes.data.find(c => c.userId?._id === user._id || c.userId === user._id);
         return {
           ...user,
           cartItems: userCart ? userCart.items : []
         };
      });
      setUsersData(enrichedUsers);
    } catch (err) {}
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const [usersRes, ordersRes, productsRes, cartsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/admin/carts", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);

      setStats({
        users: usersRes.data.length,
        orders: ordersRes.data.length,
        products: productsRes.data.length,
        revenue: ordersRes.data.reduce((acc, order) => acc + order.totalAmount, 0)
      });

      const enrichedUsers = usersRes.data.map(user => {
         const userCart = cartsRes.data.find(c => c.userId?._id === user._id || c.userId === user._id);
         return {
           ...user,
           cartItems: userCart ? userCart.items : []
         };
      });
      setUsersData(enrichedUsers);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchStats();
    const interval = setInterval(fetchStatsSilently, 3000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-apex-900 flex items-center justify-center p-8">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Loading_Terminal_Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 font-sans text-black dark:text-white transition-colors duration-1000 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <main className="max-w-[1600px] mx-auto px-8 lg:px-16 py-16 animate-fade-in">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="animate-reveal">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.5em] mb-6">
              SYSTEM_STATE / AGGREGATED_METRICS
            </p>
            <h1 className="text-6xl lg:text-8xl apex-text-headline tracking-tighter leading-none">
              Data <br /> Canvas.
            </h1>
          </div>
          <div className="flex flex-col items-end text-right space-y-4 font-mono text-xs text-slate-400 uppercase tracking-widest">
            <p>LAST_SYNC: {new Date().toLocaleTimeString()}</p>
            <p>NODES_ACTIVE: {(stats.users + stats.products).toString(16).toUpperCase()}</p>
          </div>
        </div>

        {/* 📊 High-Density Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 mb-24 animate-slide-up">
          <div className="p-12 bg-white dark:bg-apex-900 group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-700">
            <p className="text-xs font-black uppercase tracking-[0.5em] mb-8 text-slate-400">Gross_Revenue</p>
            <h3 className="text-5xl font-black tracking-tighter mb-4">₹{stats.revenue}</h3>
            <div className="w-12 h-px bg-black/10 dark:bg-white/10 group-hover:bg-current transition-colors" />
          </div>
          <div className="p-12 bg-white dark:bg-apex-900 group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-700">
            <p className="text-xs font-black uppercase tracking-[0.5em] mb-8 text-slate-400">Total_Sessions</p>
            <h3 className="text-5xl font-black tracking-tighter mb-4">{stats.users}</h3>
            <div className="w-12 h-px bg-black/10 dark:bg-white/10 group-hover:bg-current transition-colors" />
          </div>
          <div className="p-12 bg-white dark:bg-apex-900 group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-700">
            <p className="text-xs font-black uppercase tracking-[0.5em] mb-8 text-slate-400">Logistics_Count</p>
            <h3 className="text-5xl font-black tracking-tighter mb-4">{stats.orders}</h3>
            <div className="w-12 h-px bg-black/10 dark:bg-white/10 group-hover:bg-current transition-colors" />
          </div>
          <div className="p-12 bg-white dark:bg-apex-900 group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-700">
            <p className="text-xs font-black uppercase tracking-[0.5em] mb-8 text-slate-400">Catalog_Assets</p>
            <h3 className="text-5xl font-black tracking-tighter mb-4">{stats.products}</h3>
            <div className="w-12 h-px bg-black/10 dark:bg-white/10 group-hover:bg-current transition-colors" />
          </div>
        </div>

        {/* 👥 Advanced User Analytics Table */}
        <div className="animate-slide-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div>
              <h3 className="text-3xl apex-text-headline tracking-tighter">Active Registries.</h3>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mt-2 italic">Real-time memory map of user sessions.</p>
            </div>
            
            {/* 🛡️ Global Buffer Inspector */}
            <div className="flex flex-col items-end gap-3 min-w-[300px]">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Rapid_Buffer_Audit</label>
              <select 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) toggleCart(val);
                }}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-black dark:focus:border-white transition-all appearance-none cursor-pointer"
              >
                <option value="">Select_Participant_Registry</option>
                {usersData.filter(u => u.cartItems?.length > 0).map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.cartItems.length} Assets)</option>
                ))}
              </select>
            </div>

            <div className="h-px flex-1 mx-12 bg-black/5 dark:bg-white/5 hidden xl:block" />
            <div className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Filtered: All_Participants</div>
          </div>
          
          <div className="border border-black/5 dark:border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
                    <th className="px-10 py-6 text-sm font-black text-black dark:text-white uppercase tracking-[0.4em]">Participant_Det</th>
                    <th className="px-10 py-6 text-sm font-black text-black dark:text-white uppercase tracking-[0.4em]">Establishment_Date_Time</th>
                    <th className="px-10 py-6 text-sm font-black text-black dark:text-white uppercase tracking-[0.4em]">Permission_Lvl</th>
                    <th className="px-10 py-6 text-sm font-black text-black dark:text-white uppercase tracking-[0.4em]">Active_Buffer (Cart)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                   {usersData.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-base font-black tracking-tight uppercase group-hover:text-black dark:group-hover:text-white transition-colors">{u.name}</span>
                          <span className="text-xs font-mono text-slate-400 mt-1">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col font-mono text-sm text-slate-400">
                          <span className="uppercase font-black text-black dark:text-white mb-1">{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
                          <span className="opacity-50 text-[10px] uppercase font-black tracking-widest">{new Date(u.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`text-[10px] font-black px-4 py-2 rounded-none border ${u.isAdmin ? 'border-black text-black dark:border-white dark:text-white' : 'border-black/10 dark:border-white/10 text-slate-400'} uppercase tracking-[0.3em]`}>
                          {u.isAdmin ? 'ROOT_CMD' : 'STND'}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        {u.isAdmin ? (
                          <span className="font-mono text-xs text-slate-200 dark:text-slate-800 italic uppercase font-black">System_Immune</span>
                        ) : (
                          <div className="flex flex-col items-start gap-4">
                            {u.cartItems && u.cartItems.length > 0 ? (
                              <div className="w-full">
                                <button 
                                  type="button"
                                  onClick={() => toggleCart(u._id)}
                                  className={`w-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between border px-4 py-3 transition-all duration-300 ${expandedCarts[u._id] ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg' : 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-black/10 dark:border-white/10'}`}
                                >
                                  <span>{expandedCarts[u._id] ? "Collapse_Registry" : `Scan_Buffer (${u.cartItems.length})`}</span>
                                  <svg className={`w-3 h-3 transition-transform duration-300 ${expandedCarts[u._id] ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                
                                {expandedCarts[u._id] && (
                                  <div className="w-full mt-4 space-y-4 animate-fade-in bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 p-6 shadow-inner">
                                    {u.cartItems.map((item, i) => (
                                      <div key={i} className="flex justify-between items-center text-[10px] font-mono border-b border-black/5 dark:border-white/5 pb-3 last:border-0 hover:bg-black/10 dark:hover:bg-white/10 px-2 transition-colors">
                                        <div className="flex items-center space-x-4">
                                          <div className="w-1.5 h-1.5 rounded-none bg-black/20 dark:bg-white/20" />
                                          <div className="flex flex-col">
                                            <span className="text-black dark:text-white uppercase truncate max-w-[200px] font-black">{item.productId?.name || "Unknown_Asset"}</span>
                                            <span className="text-[8px] opacity-40">UID: {item.productId?._id?.slice(-6).toUpperCase() || "NULL"}</span>
                                          </div>
                                          <span className="text-black dark:text-white font-black px-2 py-1 bg-black/5 dark:bg-white/5">x{item.quantity}</span>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-slate-400 block text-[8px] mb-0.5 tracking-tighter">Value_</span>
                                          <span className="text-black dark:text-white font-black text-xs">₹{(item.productId?.finalPrice || item.productId?.price || 0) * item.quantity}</span>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="pt-6 mt-4 flex justify-between items-end text-xs font-black uppercase tracking-widest text-black dark:text-white border-t border-black/10 dark:border-white/10">
                                      <div className="flex flex-col">
                                        <span className="text-[8px] opacity-40 mb-1">Scanning_Protocol_Active</span>
                                        <span>Total_Buffer_Value</span>
                                      </div>
                                      <span className="text-2xl tracking-tighter">₹{u.cartItems.reduce((acc, item) => acc + ((item.productId?.finalPrice || item.productId?.price || 0) * item.quantity), 0)}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-300 dark:text-slate-700 uppercase tracking-widest pl-4">
                                <span className="w-2 h-px bg-current" />
                                <span>Empty_Buffer</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Technical Registry Metadata Footer */}
        <div className="mt-40 pt-16 border-t-4 border-black dark:border-white flex flex-col md:flex-row justify-between gap-12 font-mono text-xs uppercase tracking-[0.5em] text-slate-400">
          <div className="max-w-xl leading-relaxed opacity-50">
            THIS TERMINAL IS FOR AUTHORIZED ATELIER AGENTS ONLY. ACCESS TO DATA CANVAS REGISTRIES IS LOGGED AND EXPOSED TO ROOT_CMD.
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
