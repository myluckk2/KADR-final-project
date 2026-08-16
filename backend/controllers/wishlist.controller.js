const pool = require("../config/db");

/**
 * GET /api/wishlist
 * Giriş etmiş istifadəçinin öz wishlist-i (həm kitab, həm kart məlumatları ilə birgə).
 * Pagination: ?page=&limit=
 * Response şəkli: { data: [...], meta: { page, limit, total, totalPages } }
 */
async function getMyWishlist(req, res, next) {
  try {
    const userId = req.user.id;

    // Qeyd: wishlist hər istifadəçi üçün fərdi (public kataloq deyil), ona görə
    // limit tavanı books/cards-a nisbətən bir az yuxarıdır (default 100, max 500) —
    // WishlistContext "isSaved" yoxlaması üçün adətən bütün siyahını bir sorğuda alır.
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
    const offset = (page - 1) * limit;

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM wishlist WHERE user_id = ?",
      [userId]
    );

    const [rows] = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );

    // Hər wishlist elementi üçün əsl kitab/kart məlumatını gətiririk
    const detailed = await Promise.all(
      rows.map(async (item) => {
        const table = item.item_type === "book" ? "books" : "cards";
        const [details] = await pool.query(
          `SELECT * FROM ${table} WHERE id = ?`,
          [item.item_id]
        );
        return {
          wishlistId: item.id,
          itemType: item.item_type,
          item: details[0] || null,
        };
      })
    );

    res.status(200).json({
      data: detailed,
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

/**
 * POST /api/wishlist
 * body: { itemType: 'book' | 'card', itemId: number }
 */
async function addToWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const { itemType, itemId } = req.body;

    const table = itemType === "book" ? "books" : "cards";
    const [itemExists] = await pool.query(`SELECT id FROM ${table} WHERE id = ?`, [itemId]);

    if (itemExists.length === 0) {
      return res.status(404).json({ message: `${itemType === "book" ? "Kitab" : "Kart/Video"} tapılmadı.` });
    }

    const [alreadyExists] = await pool.query(
      "SELECT id FROM wishlist WHERE user_id = ? AND item_type = ? AND item_id = ?",
      [userId, itemType, itemId]
    );

    if (alreadyExists.length > 0) {
      return res.status(409).json({ message: "Bu element artıq wishlist-dədir." });
    }

    const [result] = await pool.query(
      "INSERT INTO wishlist (user_id, item_type, item_id) VALUES (?, ?, ?)",
      [userId, itemType, itemId]
    );

    res.status(201).json({ message: "Wishlist-ə əlavə olundu.", wishlistId: result.insertId });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/wishlist/:id
 * :id -> wishlist cədvəlindəki qeydin id-si.
 * İstifadəçi yalnız öz wishlist elementini silə bilər.
 */
async function removeFromWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM wishlist WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Wishlist elementi tapılmadı." });
    }

    res.status(200).json({ message: "Wishlist-dən silindi." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyWishlist, addToWishlist, removeFromWishlist };
