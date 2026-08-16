const jwt = require("jsonwebtoken");

/**
 * İstifadəçi üçün JWT token yaradır.
 * Payload-a id, username və role qoyulur ki, middleware-lərdə rola görə
 * icazə yoxlanışı apara bilək.
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

module.exports = generateToken;
