import axiosInstance from "./axiosInstance";

export const categoryApi = {
  getAllCategories: async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },
  createCategory: async (categoryData) => {
    // categoryData can be FormData
    const response = await axiosInstance.post("/categories", categoryData, {
      headers: {
        "Content-Type": categoryData instanceof FormData ? "multipart/form-data" : "application/json"
      }
    });
    return response.data;
  },
  updateCategory: async (id, categoryData) => {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData, {
      headers: {
        "Content-Type": categoryData instanceof FormData ? "multipart/form-data" : "application/json"
      }
    });
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },
};
