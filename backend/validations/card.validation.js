const { body } = require("express-validator");

const cardValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Kartın/videonun adı (title) tələb olunur.")
    .isLength({ max: 150 }).withMessage("Title maksimum 150 simvol ola bilər."),
  body("description")
    .optional({ checkFalsy: true })
    .isString().withMessage("Description mətn olmalıdır."),
  body("video_url")
    .optional({ checkFalsy: true })
    .isURL().withMessage("video_url düzgün bir link olmalıdır."),
];

module.exports = { cardValidation };
