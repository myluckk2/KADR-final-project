/**
 * Admin və nümunə User hesabı yaradır.
 * İstifadə: npm install etdikdən sonra -> node database/seedUsers.js
 *
 * Admin: username: admin   | password: Admin123!
 * User : username: testuser| password: User1234!
 * (Deploy zamanı bu parolları mütləq dəyişin)
 */

require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const SALT_ROUNDS = 10;

async function seedUsers() {
  try {
    const usersToCreate = [
      { username: "admin", password: "Admin123!", role: "admin" },
      { username: "testuser", password: "User1234!", role: "user" },
    ];

    for (const u of usersToCreate) {
      const [existing] = await pool.query(
        "SELECT id FROM users WHERE username = ?",
        [u.username]
      );

      if (existing.length > 0) {
        console.log(`"${u.username}" artıq mövcuddur, ötürülür...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(u.password, SALT_ROUNDS);

      await pool.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [u.username, hashedPassword, u.role]
      );

      console.log(`Yaradıldı -> username: ${u.username} | role: ${u.role}`);
    }

    console.log("Seed tamamlandı.");
    process.exit(0);
  } catch (err) {
    console.error("Seed xətası:", err);
    process.exit(1);
  }
}

seedUsers();
