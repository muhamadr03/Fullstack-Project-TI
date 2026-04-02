const db = require('../config/db'); // pastikan koneksi MySQL kamu di sini

// Add to Cart
exports.addToCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  // Validasi input
  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  // 1. Cek apakah produk sudah ada di cart user
  const checkQuery = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';

  db.query(checkQuery, [user_id, product_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // 2. Kalau SUDAH ADA → update quantity
    if (result.length > 0) {
      const updateQuery = 'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';

      db.query(updateQuery, [quantity, user_id, product_id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.json({ message: 'Quantity berhasil diupdate' });
      });

    } else {
      // 3. Kalau BELUM ADA → insert baru
      const insertQuery = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';

      db.query(insertQuery, [user_id, product_id, quantity], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.json({ message: 'Produk berhasil ditambahkan ke cart' });
      });
    }
  });
};