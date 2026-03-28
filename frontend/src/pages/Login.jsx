import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        form
      );
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
      }
      
      // Redirect to Home page after successful login
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-apex-900 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden">
      {/* 🎬 Cinematic Image Side (60% Desktop) */}
      <div className="hidden lg:block lg:w-[60%] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop" 
          alt="Login Aesthetic" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-[5000ms] ease-out scale-110 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white dark:to-apex-900" />
        
        {/* Floating Branding Section */}
        <div className="absolute bottom-20 left-20 z-10 animate-reveal">
          <h2 className="text-[12vw] font-black tracking-tighter text-black/10 dark:text-white/5 leading-none uppercase">
            ATELIER
          </h2>
          <div className="flex items-center mt-6 space-x-6">
            <div className="w-12 h-px bg-black dark:bg-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black dark:text-white">Professional Studio / 01</p>
          </div>
        </div>
      </div>

      {/* 🧾 Login Form Side (40% Desktop) */}
      <div className="w-full lg:w-[40%] min-h-screen flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-20 bg-white dark:bg-apex-900 z-20">
        <div className="max-w-md w-full mx-auto animate-slide-up">
          {/* 🔙 Back Navigation */}
          <div className="mb-12">
            <button 
              onClick={() => navigate("/")} 
              className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <span className="mr-4 group-hover:-translate-x-2 transition-transform duration-500 text-lg">←</span>
              Return to Shop
            </button>
          </div>

          <div className="mb-14">
            <div className="flex justify-between items-center mb-12">
              <div className="cursor-pointer" onClick={() => navigate("/")}>
                <h2 className="text-5xl font-black text-black dark:text-white tracking-widest uppercase">
                  MY SHOP<span className="text-slate-300 dark:text-slate-600">.</span>
                </h2>
              </div>
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
            </div>
            <h1 className="text-5xl lg:text-6xl apex-text-headline mb-4 tracking-tighter">
              Welcome <br /> Back.
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] leading-relaxed">
              Identify yourself to access the collection.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="group relative">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-1 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                Nexus Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 px-1 text-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-all duration-500 font-medium placeholder:text-slate-200 dark:placeholder:text-slate-800"
                placeholder="USER@MYSHOP.COM"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="group relative">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-1 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                Secure Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 px-1 text-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-all duration-500 font-medium placeholder:text-slate-200 dark:placeholder:text-slate-800"
                  placeholder="••••••••"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-300 hover:text-black dark:hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full apex-btn-primary py-6 text-sm flex items-center justify-center space-x-4 disabled:opacity-50"
              >
                {loading ? "Verifying..." : (
                  <>
                    <span>Enter Studio</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              New Member?
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="text-black dark:text-white text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-50 transition-opacity"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;