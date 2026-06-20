const { Coupon } = require('../models');
const { Op } = require('sequelize');

// Validasi kupon saat checkout
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Kode kupon wajib diisi.' });

    const coupon = await Coupon.findOne({ where: { code: code.toUpperCase(), is_active: true } });
    if (!coupon) return res.status(404).json({ success: false, message: 'Kupon tidak ditemukan atau tidak aktif.' });

    if (new Date() > new Date(coupon.valid_until)) {
      return res.status(400).json({ success: false, message: 'Kupon sudah kedaluwarsa.' });
    }

    res.status(200).json({ success: true, message: 'Kupon valid.', data: coupon });
  } catch (error) { next(error); }
};

// Ambil semua kupon (admin)
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: coupons });
  } catch (e) {
    res.status(500).json({ message: 'Gagal mengambil data kupon.', error: e.message });
  }
};

// Buat kupon baru
exports.createCoupon = async (req, res) => {
  try {
    const { code, discount_percentage, max_discount, valid_until, is_active } = req.body;

    // Validasi field wajib
    if (!code || discount_percentage === undefined || discount_percentage === null || discount_percentage === '' || !valid_until) {
      return res.status(400).json({ message: 'Kode, persentase diskon, dan tanggal berlaku wajib diisi.' });
    }

    const pct = Number(discount_percentage);
    if (isNaN(pct) || pct < 1 || pct > 100) {
      return res.status(400).json({ message: 'Persentase diskon harus antara 1 dan 100.' });
    }

    // Cek duplikat kode
    const existing = await Coupon.findOne({ where: { code: code.toUpperCase() } });
    if (existing) return res.status(400).json({ message: 'Kode kupon sudah digunakan.' });

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount_percentage: pct,
      max_discount: max_discount ? Number(max_discount) : null,
      valid_until,
      is_active: is_active !== false && is_active !== 'false',
    });

    res.status(201).json({ success: true, message: 'Kupon berhasil dibuat.', data: coupon });
  } catch (e) {
    res.status(500).json({ message: 'Gagal membuat kupon.', error: e.message });
  }
};

// Update kupon
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_percentage, max_discount, valid_until, is_active } = req.body;

    if (!code || discount_percentage === undefined || discount_percentage === null || discount_percentage === '' || !valid_until) {
      return res.status(400).json({ message: 'Kode, persentase diskon, dan tanggal berlaku wajib diisi.' });
    }

    const pct = Number(discount_percentage);
    if (isNaN(pct) || pct < 1 || pct > 100) {
      return res.status(400).json({ message: 'Persentase diskon harus antara 1 dan 100.' });
    }

    const updateData = {
      code: code.toUpperCase(),
      discount_percentage: pct,
      max_discount: max_discount ? Number(max_discount) : null,
      valid_until,
      is_active,
    };

    const [rows] = await Coupon.update(updateData, { where: { id } });
    if (!rows) return res.status(404).json({ message: 'Kupon tidak ditemukan.' });

    const updated = await Coupon.findByPk(id);
    res.status(200).json({ success: true, message: 'Kupon berhasil diperbarui.', data: updated });
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui kupon.', error: e.message });
  }
};

// Hapus kupon
exports.deleteCoupon = async (req, res) => {
  try {
    const rows = await Coupon.destroy({ where: { id: req.params.id } });
    if (!rows) return res.status(404).json({ message: 'Kupon tidak ditemukan.' });
    res.status(200).json({ success: true, message: 'Kupon berhasil dihapus.' });
  } catch (e) {
    res.status(500).json({ message: 'Gagal menghapus kupon.' });
  }
};
