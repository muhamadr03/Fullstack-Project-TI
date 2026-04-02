// Import koneksi database. Sesuaikan path dengan struktur folder Anda.
const db = require('../config/db');

/**
 * Mengambil seluruh daftar produk dari database
 * Endpoint: GET /api/products
 */
const getAllProducts = async (req, res) => {
  try {
    // Mengeksekusi query untuk mengambil semua data dari tabel products
    const [rows] = await db.query('SELECT * FROM products');

    // Mengembalikan response JSON dengan status 200 jika berhasil
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar produk',
      data: rows
    });

  } catch (error) {
    // Mencetak error ke console untuk keperluan debugging
    console.error('Error fetching products:', error);

    // Mengembalikan response 500 jika terjadi kesalahan pada server/database
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil data produk',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts
};