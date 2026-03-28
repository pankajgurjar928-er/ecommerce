import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || token === "undefined" || token === "null") return;
      
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  useEffect(() => {
    if (user && !user.isAdmin) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return false;
    }
    if (user.isAdmin) {
      toast.error("Admins cannot add items to the user cart.");
      return false;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Optimistic update or refetch
      await fetchCart();
      toast.success(`Added ${product.name} to bag`);
      setIsCartOpen(true);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
      return false;
    }
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data?.items || []);
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return removeItem(productId);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put("http://localhost:5000/api/cart", 
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data?.items || []);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const cartTotal = Array.isArray(cart) ? cart.reduce((acc, item) => {
    if (!item?.productId) return acc;
    const price = item.productId.finalPrice || item.productId.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0) : 0;

  const cartItemsCount = Array.isArray(cart) ? cart.reduce((acc, item) => acc + (item?.quantity || 0), 0) : 0;

  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeItem,
      updateQuantity,
      cartTotal,
      cartItemsCount,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
