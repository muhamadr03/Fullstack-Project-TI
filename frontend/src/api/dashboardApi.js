import axiosInstance from "./axiosInstance";

export const dashboardApi = {
  getStats: async () => {
    return await axiosInstance.get("/dashboard/stats");
  },
};
