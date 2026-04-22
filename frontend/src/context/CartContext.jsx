import React, { createContext, useState, useEffect, useContext } from "react";
import { cartApi } from "../api/cartApi";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Kita butuh AuthContext untuk tahu apakah user sudah login
  const { user } = useContext(AuthContext);

  // Ambil data keranjang dari backend setiap kali user login
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          setCartLoading(true);
          const response = await cartApi.getCart();
          setCartItems(response || []);
        } catch (error) {
          console.error("Gagal memuat keranjang:", error);
        } finally {
          setCartLoading(false);
        }
      } else {
        // Kosongkan keranjang di frontend jika user logout
        setCartItems([]);
      }
    };

    fetchCart();
  }, [user]);

  // Fungsi untuk menambah ke keranjang (Bisa dipanggil dari ProductDetailPage)
  const addToCart = async (productId, quantity) => {
    try {
      await cartApi.addToCart(productId, quantity);
      // Refresh keranjang dari backend agar datanya akurat
      const response = await cartApi.getCart();
      setCartItems(response.data || []);
      return { success: true };
    } catch (error) {
      console.error("Gagal menambah ke keranjang:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Terjadi kesalahan",
      };
    }
  };

  // Fungsi untuk menghapus dari keranjang
  const removeFromCart = async (cartId) => {
    try {
      await cartApi.removeFromCart(cartId);
      // Update state lokal tanpa harus nembak backend lagi biar UI terasa cepat
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
    } catch (error) {
      console.error("Gagal menghapus item:", error);
    }
  };

  // Hitung total item untuk badge di Navbar
  const totalItems = cartItems.reduce(
    (total, item) => total + parseInt(item.quantity || 0, 10),
    0,
  );

  // Hitung total harga
  const totalPrice = cartItems.reduce((total, item) => {
    // Pastikan relasi tabel Product di Backend ikut terbawa (item.Product.price)
    const price = item.Product?.price || item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        addToCart,
        removeFromCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
