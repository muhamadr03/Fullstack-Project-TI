const { Banner } = require('../models');
const { uploadToCloudinary } = require('../config/cloudinaryHelper');

/* ── helpers ─────────────────────────────────────────────── */
const toFloat  = (v, def = 0.35) => { const n = parseFloat(v); return isNaN(n) ? def : n; };
const toInt    = (v, def = 0)    => { const n = parseInt(v);   return isNaN(n) ? def : n; };
const toBool   = (v)             => v !== 'false' && v !== false;

/* ── GET ALL ─────────────────────────────────────────────── */
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['order', 'ASC'], ['created_at', 'DESC']],
    });
    res.status(200).json({ success: true, data: banners });
  } catch (e) {
    res.status(500).json({ message: 'Gagal mengambil banner.', error: e.message });
  }
};

/* ── CREATE ──────────────────────────────────────────────── */
exports.createBanner = async (req, res) => {
  try {
    const {
      title, link_url, is_active,
      badge, heading, description,
      button_text, button_link,
      button2_text, button2_link,
      sale_price, original_price,
      text_position, overlay_opacity, order,
    } = req.body;

    if (!title) return res.status(400).json({ message: 'Judul banner wajib diisi.' });

    const files = req.files || {};

    // Upload background image (required)
    const bgFile = files.image?.[0];
    if (!bgFile) return res.status(400).json({ message: 'Gambar background banner wajib diupload.' });
    const image_url = await uploadToCloudinary(bgFile);

    // No product_image used anymore, just background
    const product_image = null;

    const banner = await Banner.create({
      title,
      image_url,
      product_image,
      badge:           badge           || null,
      heading:         heading         || null,
      description:     description     || null,
      button_text:     button_text     || 'Belanja Sekarang',
      button_link:     button_link     || null,
      button2_text:    button2_text    || null,
      button2_link:    button2_link    || null,
      sale_price:      sale_price      || null,
      original_price:  original_price  || null,
      text_position:   text_position   || 'left',
      overlay_opacity: toFloat(overlay_opacity),
      order:           toInt(order),
      link_url:        link_url        || null,
      is_active:       toBool(is_active),
    });

    res.status(201).json({ success: true, message: 'Banner berhasil dibuat.', data: banner });
  } catch (e) {
    res.status(500).json({ message: 'Gagal membuat banner.', error: e.message });
  }
};

/* ── UPDATE ──────────────────────────────────────────────── */
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, link_url, is_active,
      badge, heading, description,
      button_text, button_link,
      button2_text, button2_link,
      sale_price, original_price,
      text_position, overlay_opacity, order,
    } = req.body;

    const files = req.files || {};
    const updateData = {
      title,
      badge:           badge           || null,
      heading:         heading         || null,
      description:     description     || null,
      button_text:     button_text     || 'Belanja Sekarang',
      button_link:     button_link     || null,
      button2_text:    button2_text    || null,
      button2_link:    button2_link    || null,
      sale_price:      sale_price      || null,
      original_price:  original_price  || null,
      text_position:   text_position   || 'left',
      overlay_opacity: toFloat(overlay_opacity),
      order:           toInt(order),
      link_url:        link_url        || null,
      is_active:       toBool(is_active),
    };

    const bgFile   = files.image?.[0];
    if (bgFile)   updateData.image_url     = await uploadToCloudinary(bgFile);

    const [rows] = await Banner.update(updateData, { where: { id } });
    if (!rows) return res.status(404).json({ message: 'Banner tidak ditemukan.' });

    const updated = await Banner.findByPk(id);
    res.status(200).json({ success: true, message: 'Banner berhasil diperbarui.', data: updated });
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui banner.', error: e.message });
  }
};

/* ── DELETE ──────────────────────────────────────────────── */
exports.deleteBanner = async (req, res) => {
  try {
    const rows = await Banner.destroy({ where: { id: req.params.id } });
    if (!rows) return res.status(404).json({ message: 'Banner tidak ditemukan.' });
    res.status(200).json({ success: true, message: 'Banner berhasil dihapus.' });
  } catch (e) {
    res.status(500).json({ message: 'Gagal menghapus banner.' });
  }
};
