import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, fetchProfile } = useAuth();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Other");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  const getPremiumAvatars = (g) => {
    if (g === "Male") {
      return [
        "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4",
        "https://api.dicebear.com/7.x/notionists/svg?seed=Milo&backgroundColor=ffd5dc",
        "https://api.dicebear.com/7.x/notionists/svg?seed=Jasper&backgroundColor=c0aede",
        "https://api.dicebear.com/7.x/notionists/svg?seed=Toby&backgroundColor=ffdfbf",
        "https://api.dicebear.com/7.x/notionists/svg?seed=Toby&backgroundColor=d1d4f9",
        "https://api.dicebear.com/7.x/notionists/svg?seed=Jasper&backgroundColor=b6e3f4",
        "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=ffdfbf",
        "https://api.dicebear.com/7.x/notionists/svg?seed=Milo&backgroundColor=c0aede"
      ];
    } else if (g === "Female") {
      return [
        "https://api.dicebear.com/7.x/lorelei/svg?seed=Aneka&backgroundColor=c0aede",
        "https://api.dicebear.com/7.x/lorelei/svg?seed=Sasha&backgroundColor=ffd5dc",
        "https://api.dicebear.com/7.x/lorelei/svg?seed=Willow&backgroundColor=b6e3f4",
        "https://api.dicebear.com/7.x/lorelei/svg?seed=Luna&backgroundColor=d1d4f9",
        "https://api.dicebear.com/7.x/lorelei/svg?seed=Aneka&backgroundColor=ffdfbf",
        "https://api.dicebear.com/7.x/lorelei/svg?seed=Sasha&backgroundColor=b6e3f4",
        "https://api.dicebear.com/7.x/lorelei/svg?seed=Willow&backgroundColor=ffdfbf",
        "https://api.dicebear.com/7.x/lorelei/svg?seed=Luna&backgroundColor=c0aede"
      ];
    } else {
      return [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&backgroundColor=ffd5dc",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha&backgroundColor=d1d4f9",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Toby&backgroundColor=ffdfbf",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Willow&backgroundColor=b6e3f4",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper&backgroundColor=c0aede",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=ffd5dc"
      ];
    }
  };

  const [avatar, setAvatar] = useState("");
  const premiumAvatars = getPremiumAvatars(gender);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setGender(user.gender || "Other");
      setAvatar(user.avatar || premiumAvatars[0]);
      setLoading(false);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(`${API_BASE_URL}/api/users/profile`, 
        { name, gender, avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchProfile(); // Update global auth context
      toast.success("Identity Parameters Updated Successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-apex-900 flex items-center justify-center">
      <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Loading_Registry...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-apex-900 font-sans text-black dark:text-white transition-colors duration-700">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 flex flex-col items-center">
            <div className="w-64 h-64 rounded-full bg-slate-100 dark:bg-white/5 p-4 border border-black/5 dark:border-white/5 overflow-hidden shadow-2xl relative group mb-12">
              <img src={avatar} alt="Profile" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Active_Registry_View</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-1 text-center">Visual_Registry_Update</label>
              <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5">
                {premiumAvatars.map((ava, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(ava)}
                    className={`aspect-square rounded-full overflow-hidden border-2 transition-all p-1 hover:scale-110 ${avatar === ava ? 'border-black dark:border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={ava} alt={`Avatar ${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-10 text-center">
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">{user.name}</h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.5em]">{user.isAdmin ? "Root_Agent" : "Authorized_User"}</p>
            </div>
          </div>

          {/* 📝 Profile Framework */}
          <div className="flex-1">
            <div className="mb-16">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter mb-4 italic underline underline-offset-8">Identity_Override.</h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">Modify your core session parameters and visual registry status.</p>
                </div>
                <div className="flex flex-col items-end space-y-4">
                  <button 
                    onClick={() => navigate("/my-orders")} 
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-black dark:text-white hover:opacity-70 transition-opacity underline underline-offset-4"
                  >
                    View_Order_Registry
                  </button>
                  <button 
                    onClick={() => navigate(-1)} 
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4"
                  >
                    Return_
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-1">Legal_Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-black/5 dark:border-white/5 py-4 px-1 font-black outline-none focus:border-black dark:focus:border-white transition-all text-xl"
                  />
                </div>
                <div className="space-y-4 opacity-50">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-1">Registry_Email (Locked)</label>
                  <input 
                    disabled 
                    type="email" 
                    value={user.email}
                    className="w-full bg-transparent border-b-2 border-black/5 dark:border-white/5 py-4 px-1 font-mono outline-none text-xl text-inherit"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-1">Vessel_Type (Gender)</label>
                <div className="grid grid-cols-3 gap-4">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-4 text-[10px] font-black uppercase tracking-[0.4em] border-2 transition-all ${gender === g ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'border-black/5 dark:border-white/5 text-slate-400 hover:border-black/20'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-10">
                <button 
                  type="submit" 
                  disabled={updating}
                  className={`w-full py-6 text-[10px] font-black uppercase tracking-[0.5em] transition-all bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] active:scale-[0.98] ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updating ? "Committing_Changes..." : "Authorize_Identity_Update"}
                </button>
              </div>
            </form>

            <div className="mt-20 pt-16 border-t border-black/5 dark:border-white/5 font-mono text-[9px] text-slate-400 flex flex-col md:flex-row justify-between gap-4 uppercase tracking-[0.3em]">
              <p>Member_Since: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Session_ID: {user._id.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
