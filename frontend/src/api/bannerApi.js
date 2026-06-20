import axiosInstance from './axiosInstance';

export const bannerApi = {
  getAllBanners: async () => {
    const response = await axiosInstance.get('/banners');
    return response.data;
  },
  createBanner: async (formData) => {
    const response = await axiosInstance.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateBanner: async (id, formData) => {
    const response = await axiosInstance.put(`/banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteBanner: async (id) => {
    const response = await axiosInstance.delete(`/banners/${id}`);
    return response.data;
  },
};
