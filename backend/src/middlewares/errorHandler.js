const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error Log:", err.message);

  // Jika error berasal dari Sequelize (misal: email sudah terdaftar)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      status: "fail",
      message: "Data sudah ada (Duplikat).",
    });
  }

  // Default Error (500 Internal Server Error)
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan internal pada server.",
  });
};

module.exports = errorHandler;
