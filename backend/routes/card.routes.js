const express = require("express");
const router = express.Router();

const {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
} = require("../controllers/card.controller");

const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");
const { cardValidation } = require("../validations/card.validation");
const validateRequest = require("../middlewares/validate.middleware");
const upload = require("../utils/upload");

// Hər kəs homepage kartlarına/videolarına baxa bilər
router.get("/", getAllCards);
router.get("/:id", getCardById);

// Yalnız admin: əlavə et / redaktə et / sil
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("picture"),
  cardValidation,
  validateRequest,
  createCard
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("picture"),
  cardValidation,
  validateRequest,
  updateCard
);

router.delete("/:id", verifyToken, isAdmin, deleteCard);

module.exports = router;
