import React, { createContext, useState, useEffect, useContext } from "react";
import { wishlistApi } from "../api/wishlistApi";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Kita butuh AuthContext untuk tahu apakah user sudah login
  const { user } = useContext(AuthContext);

  // Ambil data wishlist dari backend setiap kali user login
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          setWishlistLoading(true);
          const response = await wishlistApi.getWishlist();
          setWishlistItems(response.data?.data || []);
        } catch (error) {
          console.error("Gagal memuat wishlist:", error);
        } finally {
          setWishlistLoading(false);
        }
      } else {
        // Kosongkan wishlist di frontend jika user logout
        setWishlistItems([]);
      }
    };

    fetchWishlist();
  }, [user]);

  // Fungsi untuk menambah/menghapus wishlist
  const toggleWishlist = async (productId) => {
    try {
      const response = await wishlistApi.toggleWishlist(productId);
      const action = response.data?.action;
      
      if (action === "added") {
        // Karena API toggle tidak me-return seluruh object produk,
        // kita bisa sekedar me-refresh wishlist dari backend untuk amannya.
        const res = await wishlistApi.getWishlist();
        setWishlistItems(res.data?.data || []);
        return { success: true, action: "added" };
      } else if (action === "removed") {
        setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
        return { success: true, action: "removed" };
      }
    } catch (error) {
      console.error("Gagal toggle wishlist:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Terjadi kesalahan",
      };
    }
  };

  // Helper untuk mengecek apakah sebuah produk ada di wishlist
  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistLoading,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
