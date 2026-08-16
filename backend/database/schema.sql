-- ============================================
-- KADR Fullstack - MySQL Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS kadr_fullstack
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE kadr_fullstack;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,      -- bcrypt hash saxlanılır
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- BOOKS (Bookspage üçün, 30 kitab) ----------
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  author VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  picture VARCHAR(255) NOT NULL,       -- şəklin url/path-i
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- CARDS (Homepage üçün, 30 video/kart) ----------
CREATE TABLE IF NOT EXISTS cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  video_url VARCHAR(255),
  picture VARCHAR(255) NOT NULL,       -- kartın thumbnail şəkli
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- WISHLIST (favorites) ----------
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type ENUM('book', 'card') NOT NULL,
  item_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist_item (user_id, item_type, item_id)
);

-- ---------- CONTACT MESSAGES (ContactPage formu) ----------
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
