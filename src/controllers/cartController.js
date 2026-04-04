const db = require("../config/db"); // Ini sekarang adalah pool.promise()

exports.addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  // 1. Validasi Input
  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    // 2. Cek apakah produk sudah ada di cart (Gunakan await)
    const checkQuery =
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
    const [rows] = await db.query(checkQuery, [user_id, product_id]);

    if (rows.length > 0) {
      // 3. JIKA ADA -> UPDATE (Gunakan await)
      const updateQuery =
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?";
      await db.query(updateQuery, [quantity, user_id, product_id]);

      return res.json({
        success: true,
        message: "Quantity berhasil diperbarui",
      });
    } else {
      // 4. JIKA BELUM ADA -> INSERT (Gunakan await)
      const insertQuery =
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
      await db.query(insertQuery, [user_id, product_id, quantity]);

      return res.status(201).json({
        success: true,
        message: "Produk berhasil ditambahkan ke keranjang",
      });
    }
  } catch (error) {
    // Jika ada error database, akan lari ke sini
    console.error("Database Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada database",
      error: error.message,
    });
  }
};
