import axiosInstance from "./axiosInstance";

export const categoryApi = {
  getAllCategories: async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },
  createCategory: async (categoryData) => {
    const response = await axiosInstance.post("/categories", categoryData);
    return response.data;
  },
  updateCategory: async (id, categoryData) => {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },
};
