const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, data: users });
  } catch (e) { res.status(500).json({ message: 'Gagal mengambil data pengguna.', error: e.message }); }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) return res.status(400).json({ message: 'Role tidak valid.' });
    const [rows] = await User.update({ role }, { where: { id } });
    if (!rows) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    res.status(200).json({ success: true, message: 'Role pengguna berhasil diperbarui.' });
  } catch (e) { res.status(500).json({ message: 'Gagal memperbarui role pengguna.', error: e.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const rows = await User.destroy({ where: { id: req.params.id } });
    if (!rows) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    res.status(200).json({ success: true, message: 'Pengguna berhasil dihapus.' });
  } catch (e) { res.status(500).json({ message: 'Gagal menghapus pengguna.' }); }
};
