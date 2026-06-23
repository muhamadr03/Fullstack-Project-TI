const { Banner } = require('../models');

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({ order: [['created_at', 'DESC']] });
    res.status(200).json({ success: true, data: banners });
  } catch (e) { res.status(500).json({ message: 'Gagal mengambil banner.', error: e.message }); }
};

exports.createBanner = async (req, res) => {
  try {
    const { title, link_url, is_active } = req.body;
    if (!title) return res.status(400).json({ message: 'Judul banner wajib diisi.' });
    // Cloudinary: URL lengkap ada di req.file.path, bukan req.file.filename
    const image_url = req.file ? req.file.path : null;
    if (!image_url) return res.status(400).json({ message: 'Gambar banner wajib diupload.' });
    const banner = await Banner.create({ title, image_url, link_url: link_url || null, is_active: is_active !== 'false' });
    res.status(201).json({ success: true, message: 'Banner berhasil dibuat.', data: banner });
  } catch (e) { res.status(500).json({ message: 'Gagal membuat banner.', error: e.message }); }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link_url, is_active } = req.body;
    const updateData = { title, link_url: link_url || null, is_active: is_active !== 'false' && is_active !== false };
    // Cloudinary: URL lengkap ada di req.file.path
    if (req.file) updateData.image_url = req.file.path;
    const [rows] = await Banner.update(updateData, { where: { id } });
    if (!rows) return res.status(404).json({ message: 'Banner tidak ditemukan.' });
    const updated = await Banner.findByPk(id);
    res.status(200).json({ success: true, message: 'Banner berhasil diperbarui.', data: updated });
  } catch (e) { res.status(500).json({ message: 'Gagal memperbarui banner.', error: e.message }); }
};

exports.deleteBanner = async (req, res) => {
  try {
    const rows = await Banner.destroy({ where: { id: req.params.id } });
    if (!rows) return res.status(404).json({ message: 'Banner tidak ditemukan.' });
    res.status(200).json({ success: true, message: 'Banner berhasil dihapus.' });
  } catch (e) { res.status(500).json({ message: 'Gagal menghapus banner.' }); }
};
