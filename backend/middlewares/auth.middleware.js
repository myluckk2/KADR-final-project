const jwt = require("jsonwebtoken");

/**
 * Authorization header-dən (Bearer token) JWT-ni yoxlayır.
 * Doğrudursa, req.user-ə decode olunmuş məlumatı yazır.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tapılmadı. Giriş edin." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    // 401 = "sən doğrulanmamısan" (token yoxdur/etibarsızdır/vaxtı bitib).
    // isAdmin-dəki 403-dən (= "doğrulanmısan, amma icazən yoxdur") fərqləndirmək üçün
    // qəsdən 401 saxlanılır ki, frontend bu ikisini ayırd edə bilsin.
    return res.status(401).json({ message: "Token yanlış və ya vaxtı bitib." });
  }
}

/**
 * Yalnız admin rolu olan istifadəçilərə icazə verir.
 * verifyToken-dan SONRA istifadə olunmalıdır.
 */
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Bu əməliyyat üçün admin icazəsi tələb olunur." });
}

module.exports = { verifyToken, isAdmin };
