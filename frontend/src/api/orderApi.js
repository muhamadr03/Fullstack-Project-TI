import axiosInstance from "./axiosInstance";

export const orderApi = {
  // Membuat pesanan baru dari isi keranjang
  createOrder: async (shippingAddress) => {
    const response = await axiosInstance.post("/orders/checkout", {
      shipping_address: shippingAddress,
    });
    return response.data; // Harus mengembalikan snap_token dari backend
  },

  // Mengambil riwayat pesanan (Untuk nanti di OrdersPage)
  getMyOrders: async () => {
    const response = await axiosInstance.get("/orders/my-orders");
    return response.data;
  },

// [ADMIN] Ambil semua pesanan toko
  getAllOrders: async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },

  // [ADMIN] Update status pesanan & nomor resi
  updateOrderStatus: async (orderId, statusData) => {
    // statusData berisi object: { status: "shipped", tracking_number: "RESI123" }
    const response = await axiosInstance.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  }
};