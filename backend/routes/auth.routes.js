const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../validations/auth.validation");
const validateRequest = require("../middlewares/validate.middleware");

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);

module.exports = router;
