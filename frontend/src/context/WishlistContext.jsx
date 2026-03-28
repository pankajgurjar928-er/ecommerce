import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();
  const toast = useToast();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data.products || []);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  useEffect(() => {
    if (user && !user.isAdmin) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      return "redirect_to_login";
    }

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/wishlist/toggle`,
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(res.data.products || []);
      const isNowWishlisted = res.data.products.some(p => p._id === product._id);
      toast.success(isNowWishlisted ? `Saved ${product.name} to wishlist` : `Removed ${product.name}`);
      return true;
    } catch (err) {
      toast.error("Wishlist update failed");
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(p => p._id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isInWishlist,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
