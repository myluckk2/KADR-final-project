require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const cardRoutes = require("./routes/card.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const contactRoutes = require("./routes/contact.routes");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Yüklənmiş şəkillərin statik olaraq göstərilməsi
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.json({ message: "KADR Fullstack Backend işləyir 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tapılmadı." });
});

// Qlobal error handler (ən sonda olmalıdır)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} ünvanında işləyir`);
});
