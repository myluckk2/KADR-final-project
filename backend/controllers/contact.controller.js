const pool = require("../config/db");

// POST /api/contact  (hər kəs, login tələb olunmur)
async function createContactMessage(req, res, next) {
  try {
    const { name, email, message } = req.body;

    const [result] = await pool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    res.status(201).json({
      message: "Mesajınız üçün təşəkkürlər — tezliklə əlaqə saxlayacağıq.",
      contact: { id: result.insertId, name, email, message },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/contact  (yalnız admin) — pagination: ?page=&limit=
async function getAllContactMessages(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM contact_messages");
    const [messages] = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.status(200).json({
      data: messages,
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

// DELETE /api/contact/:id  (yalnız admin)
async function deleteContactMessage(req, res, next) {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM contact_messages WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mesaj tapılmadı." });
    }

    res.status(200).json({ message: "Mesaj silindi." });
  } catch (err) {
    next(err);
  }
}

module.exports = { createContactMessage, getAllContactMessages, deleteContactMessage };
