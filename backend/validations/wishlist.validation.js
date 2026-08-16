const { body } = require("express-validator");

const wishlistValidation = [
  body("itemType")
    .notEmpty().withMessage("itemType tələb olunur.")
    .isIn(["book", "card"]).withMessage("itemType yalnız 'book' və ya 'card' ola bilər."),
  body("itemId")
    .notEmpty().withMessage("itemId tələb olunur.")
    .isInt({ min: 1 }).withMessage("itemId müsbət tam ədəd olmalıdır."),
];

module.exports = { wishlistValidation };
