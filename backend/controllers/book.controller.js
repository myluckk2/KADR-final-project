const pool = require("../config/db");

// GET /api/books  (hər kəs - admin və user - baxa bilər) — pagination: ?page=&limit=
// Response şəkli həmişə eynidir: { data: [...], meta: { page, limit, total, totalPages } }
async function getAllBooks(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100);
    const offset = (page - 1) * limit;

    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM books");
    const [books] = await pool.query(
      "SELECT * FROM books ORDER BY id ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.status(200).json({
      data: books,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/books/:id
async function getBookById(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Kitab tapılmadı." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/books  (yalnız admin)
async function createBook(req, res, next) {
  try {
    const { title, author, description, price } = req.body;

    // Şəkil ya multer ilə fayl kimi (req.file), ya da body-də url kimi gələ bilər
    const picture = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.picture;

    if (!picture) {
      return res.status(400).json({ message: "Kitab üçün şəkil (picture) tələb olunur." });
    }

    const [result] = await pool.query(
      "INSERT INTO books (title, author, description, price, picture) VALUES (?, ?, ?, ?, ?)",
      [title, author, description || null, price || 0, picture]
    );

    res.status(201).json({
      message: "Kitab əlavə olundu.",
      book: { id: result.insertId, title, author, description, price, picture },
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/books/:id  (yalnız admin)
async function updateBook(req, res, next) {
  try {
    const { id } = req.params;
    const { title, author, description, price } = req.body;

    const [existing] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Kitab tapılmadı." });
    }

    const picture = req.file ? `/uploads/${req.file.filename}` : (req.body.picture || existing[0].picture);

    await pool.query(
      "UPDATE books SET title = ?, author = ?, description = ?, price = ?, picture = ? WHERE id = ?",
      [
        title || existing[0].title,
        author || existing[0].author,
        description ?? existing[0].description,
        price ?? existing[0].price,
        picture,
        id,
      ]
    );

    res.status(200).json({ message: "Kitab yeniləndi." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/books/:id  (yalnız admin)
async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM books WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kitab tapılmadı." });
    }

    res.status(200).json({ message: "Kitab silindi." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
