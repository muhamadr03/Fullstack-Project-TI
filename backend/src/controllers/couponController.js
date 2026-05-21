const { Coupon } = require("../models");
const { Op } = require("sequelize");

exports.validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Kode kupon wajib diisi." });
    }

    const coupon = await Coupon.findOne({ where: { code, is_active: true } });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Kupon tidak ditemukan atau tidak aktif." });
    }

    if (new Date() > new Date(coupon.valid_until)) {
      return res.status(400).json({ success: false, message: "Kupon sudah kedaluwarsa." });
    }

    res.status(200).json({ success: true, message: "Kupon valid", data: coupon });
  } catch (error) {
    next(error);
  }
};
