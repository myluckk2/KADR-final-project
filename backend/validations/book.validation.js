const { body } = require("express-validator");

const bookValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Kitabın adı (title) tələb olunur.")
    .isLength({ max: 150 }).withMessage("Title maksimum 150 simvol ola bilər."),
  body("author")
    .trim()
    .notEmpty().withMessage("Müəllif adı (author) tələb olunur."),
  body("description")
    .optional({ checkFalsy: true })
    .isString().withMessage("Description mətn olmalıdır."),
  body("price")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage("Qiymət (price) mənfi olmayan rəqəm olmalıdır."),
];

module.exports = { bookValidation };
