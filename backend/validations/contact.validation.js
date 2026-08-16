const { body } = require("express-validator");

const contactValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Ad Soyad tələb olunur.")
    .isLength({ max: 100 }).withMessage("Ad Soyad maksimum 100 simvol ola bilər."),
  body("email")
    .trim()
    .notEmpty().withMessage("E-poçt tələb olunur.")
    .isEmail().withMessage("Düzgün e-poçt ünvanı daxil edin.")
    .isLength({ max: 150 }).withMessage("E-poçt maksimum 150 simvol ola bilər."),
  body("message")
    .trim()
    .notEmpty().withMessage("Mesaj tələb olunur.")
    .isLength({ max: 2000 }).withMessage("Mesaj maksimum 2000 simvol ola bilər."),
];

module.exports = { contactValidation };
