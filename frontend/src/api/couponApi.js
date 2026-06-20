import axiosInstance from './axiosInstance';

export const couponApi = {
  validateCoupon: async (code) => {
    const response = await axiosInstance.post('/coupons/validate', { code });
    return response.data;
  },
  getAllCoupons: async () => {
    const response = await axiosInstance.get('/coupons');
    return response.data;
  },
  createCoupon: async (data) => {
    const response = await axiosInstance.post('/coupons', data);
    return response.data;
  },
  updateCoupon: async (id, data) => {
    const response = await axiosInstance.put(`/coupons/${id}`, data);
    return response.data;
  },
  deleteCoupon: async (id) => {
    const response = await axiosInstance.delete(`/coupons/${id}`);
    return response.data;
  },
};
