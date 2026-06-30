import axiosInstance from "./axiosInstance";

export const orderApi = {
  // Membuat pesanan baru dari isi keranjang (dengan opsional kupon)
  createOrder: async (shippingAddress, couponCode = null) => {
    const response = await axiosInstance.post("/orders/checkout", {
      shipping_address: shippingAddress,
      coupon_code: couponCode || undefined,
    });
    return response.data;
  },

  // Mengambil riwayat pesanan (Untuk nanti di OrdersPage)
  getMyOrders: async () => {
    const response = await axiosInstance.get("/orders/my-orders");
    return response.data;
  },

  // [CUSTOMER] Konfirmasi pesanan sudah diterima
  completeOrder: async (orderId) => {
    const response = await axiosInstance.patch(`/orders/${orderId}/complete`);
    return response.data;
  },

  // [CUSTOMER] Ajukan permintaan pembatalan pesanan
  requestCancellation: async (orderId, reason) => {
    const response = await axiosInstance.post(`/orders/${orderId}/cancel-request`, { reason });
    return response.data;
  },

  // [ADMIN] Ambil semua pesanan toko
  getAllOrders: async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },

  // [ADMIN] Update status pesanan, nomor resi, dan kurir
  updateOrderStatus: async (orderId, statusData) => {
    // statusData: { status, tracking_number, courier }
    const response = await axiosInstance.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  },

  // [ADMIN] Setujui atau tolak permintaan pembatalan
  handleCancellation: async (orderId, action, note = '') => {
    const response = await axiosInstance.patch(`/orders/${orderId}/cancellation`, { action, note });
    return response.data;
  },
};