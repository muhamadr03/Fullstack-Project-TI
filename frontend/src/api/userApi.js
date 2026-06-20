import axiosInstance from './axiosInstance';

export const userApi = {
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await axiosInstance.put(`/users/${id}/role`, { role });
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};
