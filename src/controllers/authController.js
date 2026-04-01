const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validasi input kosong
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi!" });
  }

  try {
    // 2. Cari pengguna berdasarkan email
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Email atau kata sandi salah." });
    }

    const user = users[0];

    // 3. Cocokkan kata sandi yang diketik dengan kata sandi acak di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau kata sandi salah." });
    }

    // 4. Buat tiket JWT jika login berhasil
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Data yang dititipkan di dalam token
      process.env.JWT_SECRET, // Kunci rahasia dari file .env
      { expiresIn: "24h" }, // Masa berlaku token (contoh: 24 jam)
    );

    // 5. Kirim balasan sukses beserta tokennya
    res.status(200).json({
      message: "Login berhasil.",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
