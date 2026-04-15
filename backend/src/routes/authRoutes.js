const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const Joi = require("joi");
const { validate } = require("../middlewares/validator");
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("customer", "admin").optional()
});

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", authController.login);

module.exports = router;
