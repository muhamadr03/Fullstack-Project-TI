import axiosInstance from "./axiosInstance";

export const couponApi = {
  validateCoupon: async (code) => {
    return await axiosInstance.post("/coupons/validate", { code });
  },
};
