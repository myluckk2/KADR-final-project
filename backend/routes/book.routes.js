const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");

const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");
const { bookValidation } = require("../validations/book.validation");
const validateRequest = require("../middlewares/validate.middleware");
const upload = require("../utils/upload");

// Hər kəs (login olsun ya olmasın) kitablara baxa bilər
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Yalnız admin: əlavə et / redaktə et / sil
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("picture"),
  bookValidation,
  validateRequest,
  createBook
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("picture"),
  bookValidation,
  validateRequest,
  updateBook
);

router.delete("/:id", verifyToken, isAdmin, deleteBook);

module.exports = router;
