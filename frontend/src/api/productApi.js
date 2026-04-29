import axiosInstance from './axiosInstance';

export const productApi = {
  // [CUSTOMER & ADMIN] Ambil semua produk (termasuk pagination jika ada)
  getAllProducts: async (params = {}) => {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  },

  // [CUSTOMER & ADMIN] Ambil detail 1 produk
  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // AREA KHUSUS ADMIN (Butuh Token & Role Admin)

  // [ADMIN] Tambah Produk Baru (Menggunakan FormData karena ada file gambar)
  createProduct: async (formData) => {
    const response = await axiosInstance.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 👈 WAJIB UNTUK MULTER
      },
    });
    return response.data;
  },

  // [ADMIN] Update Produk (Juga menggunakan FormData jika gambar diganti)
  updateProduct: async (id, formData) => {
    const response = await axiosInstance.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // [ADMIN] Hapus Produk
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  }
};