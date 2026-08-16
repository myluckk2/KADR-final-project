const express = require("express");
const router = express.Router();

const {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlist.controller");

const { verifyToken } = require("../middlewares/auth.middleware");
const { wishlistValidation } = require("../validations/wishlist.validation");
const validateRequest = require("../middlewares/validate.middleware");

// Wishlist yalnız login olmuş istifadəçilər (admin da daxil olmaqla) üçündür
router.get("/", verifyToken, getMyWishlist);
router.post("/", verifyToken, wishlistValidation, validateRequest, addToWishlist);
router.delete("/:id", verifyToken, removeFromWishlist);

module.exports = router;
