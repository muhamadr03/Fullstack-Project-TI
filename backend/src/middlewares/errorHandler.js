const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error Log:", err.message);

  // Jika error berasal dari Sequelize (misal: email sudah terdaftar)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      status: "fail",
      message: "Data sudah ada (Duplikat).",
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      status: "fail",
      message: "Validasi data gagal",
      errors: err.errors.map(e => e.message)
    });
  }

  // Error JWT
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Sesi telah berakhir (Token Expired). Silakan login kembali.",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Token tidak valid.",
    });
  }

  // Error Multer (Upload File)
  if (err.name === "MulterError") {
    return res.status(400).json({
      status: "fail",
      message: "Gagal mengunggah file. Pastikan ukuran dan tipe file sesuai.",
    });
  }

  // Default Error (500 Internal Server Error)
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Terjadi kesalahan internal pada server.",
  });
};

module.exports = errorHandler;
