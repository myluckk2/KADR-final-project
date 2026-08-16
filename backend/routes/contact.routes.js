const express = require("express");
const router = express.Router();

const {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage,
} = require("../controllers/contact.controller");

const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");
const { contactValidation } = require("../validations/contact.validation");
const validateRequest = require("../middlewares/validate.middleware");

// Hər kəs (login olsun ya olmasın) əlaqə formunu göndərə bilər
router.post("/", contactValidation, validateRequest, createContactMessage);

// Yalnız admin: gələn mesajlara baxmaq / silmək
router.get("/", verifyToken, isAdmin, getAllContactMessages);
router.delete("/:id", verifyToken, isAdmin, deleteContactMessage);

module.exports = router;
