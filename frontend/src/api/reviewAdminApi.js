import axiosInstance from './axiosInstance';

export const reviewAdminApi = {
  getAllReviews: async () => {
    const response = await axiosInstance.get('/reviews/admin/all');
    return response.data;
  },
  deleteReview: async (id) => {
    const response = await axiosInstance.delete(`/reviews/admin/${id}`);
    return response.data;
  },
};
