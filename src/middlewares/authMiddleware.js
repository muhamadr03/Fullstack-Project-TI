const jwt = require("jsonwebtoken");

// Middleware 1: Mengecek Token JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Menyimpan data user (id & role) ke request
    next(); // Lanjut ke fungsi controller
  } catch (error) {
    res
      .status(401)
      .json({ message: "Token tidak valid atau telah kedaluwarsa." });
  }
};

// Middleware 2: Mengecek apakah user adalah Admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Lanjut jika admin
  } else {
    res.status(403).json({ message: "Akses ditolak. Fitur ini khusus Admin." });
  }
};
