const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Cek apakah email sudah terdaftar
    const [existingUser] = await db.execute(
      "SELECT email FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan." });
    }

    // 2. Enkripsi password (salt round 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Simpan ke database
    const query =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    await db.execute(query, [name, email, hashedPassword, role || "customer"]);

    res.status(201).json({
      message: "User berhasil didaftarkan.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
