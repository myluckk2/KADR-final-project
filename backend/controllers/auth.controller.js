const bcrypt = require("bcrypt");
const pool = require("../config/db");
const generateToken = require("../utils/generateToken");

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Yalnız 'user' rolu ilə qeydiyyat aparır (admin manual olaraq DB-də yaradılır,
 * bax: database/seedUsers.js). Bu, kənar şəxslərin özlərini admin qeyd etməsinin
 * qarşısını alır.
 */
async function register(req, res, next) {
  try {
    const { username, password } = req.body;

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Bu username artıq istifadə olunub." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')",
      [username, hashedPassword]
    );

    const newUser = { id: result.insertId, username, role: "user" };
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Qeydiyyat uğurludur.",
      user: newUser,
      token,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Həm admin, həm də user eyni endpoint-dən daxil olur;
 * fərq token içindəki "role" sahəsi ilə idarə olunur.
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Username və ya password yanlışdır." });
    }

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Username və ya password yanlışdır." });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Giriş uğurludur.",
      user: { id: user.id, username: user.username, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
