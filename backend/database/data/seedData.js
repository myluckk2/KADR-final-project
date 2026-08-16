const fs = require('fs');
const path = require('path');
const db = require('../../config/db'); // Baza bağlantınızın fayl yolu (config/db.js)

async function seedAll() {
  try {
    // ----------------------------------------------------
    // 1. KİTABLARIN (BOOKS) BAZAYA YAZILMASI
    // ----------------------------------------------------
    const booksPath = path.join(__dirname, 'books.json');
    if (fs.existsSync(booksPath)) {
      console.log('Kitab məlumatları oxunur...');
      const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf-8'));

      for (const book of booksData) {
        await db.query(
          `INSERT INTO books (id, title, author, description, price, picture) 
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           title = VALUES(title), 
           author = VALUES(author), 
           description = VALUES(description), 
           price = VALUES(price), 
           picture = VALUES(picture)`,
          [book.id, book.title, book.author, book.description, book.price, book.picture]
        );
      }
      console.log(' Kitablar uğurla bazaya əlavə olundu/yeniləndi.');
    } else {
      console.warn(` XƏBƏRDARLIQ: books.json tapılmadı (${booksPath}) — kitablar yazılmadı.`);
    }

    // ----------------------------------------------------
    // 2. VİDEO KARTLARININ (CARDS) BAZAYA YAZILMASI
    // ----------------------------------------------------
    const videoCardsPath = path.join(__dirname, 'video-card.json');
    if (fs.existsSync(videoCardsPath)) {
      console.log('Video kartı məlumatları oxunur...');
      const cardsData = JSON.parse(fs.readFileSync(videoCardsPath, 'utf-8'));

      for (const card of cardsData) {
        await db.query(
          `INSERT INTO cards (id, title, description, video_url, picture) 
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           title = VALUES(title), 
           description = VALUES(description), 
           video_url = VALUES(video_url), 
           picture = VALUES(picture)`,
          [card.id, card.title, card.description, card.video_url, card.picture]
        );
      }
      console.log(' Video kartları uğurla bazaya əlavə olundu/yeniləndi.');
    } else {
      console.warn(` XƏBƏRDARLIQ: video-card.json tapılmadı (${videoCardsPath}) — kartlar yazılmadı.`);
    }

    console.log(' Bütün məlumatlar bazaya yazıldı!');
  } catch (error) {
    console.error('Seeding zamanı xəta baş verdi:', error);
  } finally {
    // Əgər db kəsilməsini tələb edən strukturdursa (pool.end / connection.end) prosesi bitiririk:
    process.exit();
  }
}

seedAll();