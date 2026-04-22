import axiosInstance from "./axiosInstance";

export const productApi = {
  // Mengambil semua produk dengan parameter (page, limit, search, category)
  getAllProducts: async (params) => {
    const response = await axiosInstance.get("/products", { params });
    return response.data; // Mengembalikan data.data dan data.pagination
  },

  // Mengambil satu produk untuk halaman Detail
  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },
};
