const pool = require("../config/db");

// GET /api/cards  (hər kəs baxa bilər) — pagination: ?page=&limit=
// Response şəkli həmişə eynidir: { data: [...], meta: { page, limit, total, totalPages } }
async function getAllCards(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100);
    const offset = (page - 1) * limit;

    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM cards");
    const [cards] = await pool.query(
      "SELECT * FROM cards ORDER BY id ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.status(200).json({
      data: cards,
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

// GET /api/cards/:id
async function getCardById(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM cards WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Kart/Video tapılmadı." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/cards  (yalnız admin)
async function createCard(req, res, next) {
  try {
    const { title, description, video_url } = req.body;

    const picture = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.picture;

    if (!picture) {
      return res.status(400).json({ message: "Kart üçün şəkil (picture) tələb olunur." });
    }

    const [result] = await pool.query(
      "INSERT INTO cards (title, description, video_url, picture) VALUES (?, ?, ?, ?)",
      [title, description || null, video_url || null, picture]
    );

    res.status(201).json({
      message: "Kart/Video əlavə olundu.",
      card: { id: result.insertId, title, description, video_url, picture },
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/cards/:id  (yalnız admin)
async function updateCard(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, video_url } = req.body;

    const [existing] = await pool.query("SELECT * FROM cards WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Kart/Video tapılmadı." });
    }

    const picture = req.file ? `/uploads/${req.file.filename}` : (req.body.picture || existing[0].picture);

    await pool.query(
      "UPDATE cards SET title = ?, description = ?, video_url = ?, picture = ? WHERE id = ?",
      [
        title || existing[0].title,
        description ?? existing[0].description,
        video_url ?? existing[0].video_url,
        picture,
        id,
      ]
    );

    res.status(200).json({ message: "Kart/Video yeniləndi." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cards/:id  (yalnız admin)
async function deleteCard(req, res, next) {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM cards WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kart/Video tapılmadı." });
    }

    res.status(200).json({ message: "Kart/Video silindi." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllCards, getCardById, createCard, updateCard, deleteCard };
