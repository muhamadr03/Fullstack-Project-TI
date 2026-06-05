import axiosInstance from './axiosInstance';

export const reviewApi = {
  // [PUBLIK] Ambil semua ulasan sebuah produk
  getProductReviews: async (productId) => {
    const response = await axiosInstance.get(`/reviews/${productId}`);
    return response.data;
  },

  // [CUSTOMER - Login Required] Kirim ulasan untuk produk tertentu
  addReview: async (reviewData) => {
    // reviewData: { product_id, order_id, rating, comment }
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  },
};
