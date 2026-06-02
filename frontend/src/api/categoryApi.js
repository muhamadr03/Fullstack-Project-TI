import axiosInstance from "./axiosInstance";

export const categoryApi = {
  getAllCategories: async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },
};
