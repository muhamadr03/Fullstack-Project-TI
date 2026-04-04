// Import koneksi database
const db = require('../config/db');

/**
 * Mengambil riwayat pesanan berdasarkan user_id
 * Endpoint: GET /api/orders/:user_id
 */
const getOrdersByUserId = async (req, res) => {
  try {
    // Ambil user_id dari parameter URL
    const { user_id } = req.params;

    // Query ke database
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );

    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Tidak ada pesanan untuk user ini'
         });
        };

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil riwayat pesanan',
      data: rows
    });

  } catch (error) {
    console.error('Error fetching orders by user_id:', error);

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil riwayat pesanan',
      error: error.message
    });
  }
};



module.exports = {
  getOrdersByUserId
};