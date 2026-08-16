const { validationResult } = require("express-validator");

/**
 * Route-larda təyin olunmuş validation qaydalarının nəticəsini yoxlayır.
 * Xəta varsa, 400 statusu ilə bütün xətaları qaytarır.
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation xətası",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next();
}

module.exports = validateRequest;
