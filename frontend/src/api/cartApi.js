import axiosInstance from "./axiosInstance";

export const cartApi = {
  // Mengambil isi keranjang user yang sedang login
  getCart: async () => {
    const response = await axiosInstance.get("/cart");
    return response.data;
  },

  // Menambahkan barang ke keranjang
  addToCart: async (productId, quantity) => {
    const response = await axiosInstance.post("/cart", {
      product_id: productId,
      quantity: quantity,
    });
    return response.data;
  },

  // Mengubah jumlah barang di keranjang (opsional, jika backend Anda mendukung PUT /cart/:id)
  updateCartItem: async (cartId, quantity) => {
    const response = await axiosInstance.put(`/cart/${cartId}`, {
      quantity: quantity,
    });
    return response.data;
  },

  // Menghapus satu barang dari keranjang
  removeFromCart: async (cartId) => {
    const response = await axiosInstance.delete(`/cart/${cartId}`);
    return response.data;
  },
};
