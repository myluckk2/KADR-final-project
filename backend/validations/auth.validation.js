const { body } = require("express-validator");

const registerValidation = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username tələb olunur.")
    .isLength({ min: 3, max: 50 }).withMessage("Username 3-50 simvol olmalıdır."),
  body("password")
    .notEmpty().withMessage("Password tələb olunur.")
    .isLength({ min: 6 }).withMessage("Password ən azı 6 simvol olmalıdır."),
];

const loginValidation = [
  body("username").trim().notEmpty().withMessage("Username tələb olunur."),
  body("password").notEmpty().withMessage("Password tələb olunur."),
];

module.exports = { registerValidation, loginValidation };
