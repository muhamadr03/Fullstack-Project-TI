import axiosInstance from './axiosInstance';

export const bannerApi = {
  /** Returns array of banners */
  getAllBanners: async () => {
    const response = await axiosInstance.get('/banners');
    const payload = response.data;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
  },

  createBanner: async (formData) => {
    const response = await axiosInstance.post('/banners', formData);
    return response.data;
  },

  updateBanner: async (id, formData) => {
    const response = await axiosInstance.put(`/banners/${id}`, formData);
    return response.data;
  },

  deleteBanner: async (id) => {
    const response = await axiosInstance.delete(`/banners/${id}`);
    return response.data;
  },
};
