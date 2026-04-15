// Fungsi ini akan mengecek req.body menggunakan skema Joi
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Jika data tidak valid, langsung tolak dengan status 400 Bad Request
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        status: "fail",
        message: "Data input tidak valid",
        errors: errorMessage,
      });
    }

    // Jika data valid, persilakan lanjut ke Controller
    next();
  };
};
