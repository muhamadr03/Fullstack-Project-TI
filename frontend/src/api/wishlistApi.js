import axiosInstance from "./axiosInstance";

export const wishlistApi = {
  // Ambil semua wishlist milik user (asumsikan token auth di header)
  getWishlist: async () => {
    return await axiosInstance.get("/wishlist");
  },
  // Toggle produk di wishlist (add/remove)
  toggleWishlist: async (productId) => {
    return await axiosInstance.post("/wishlist/toggle", { product_id: productId });
  },
};
