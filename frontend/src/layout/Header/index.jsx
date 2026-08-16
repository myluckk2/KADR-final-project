import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiBookmark, FiLogOut, FiUser, FiShield } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Container from "../../components/Container";
import Button from "../../components/Button";
import styles from "./index.module.scss";

const NAV_LINKS = [
  { to: "/", label: "Ana Səhifə", end: true },
  { to: "/books", label: "Kitablar" },
  { to: "/about", label: "Haqqımızda" },
  { to: "/contact", label: "Əlaqə" },
];

function Header() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const linkClass = ({ isActive }) => [styles.navLink, isActive ? styles.active : ""].join(" ");

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <NavLink to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoMark}>R</span>
          <span className={styles.logoText}>
            Rəf<span className={styles.logoDot}>.</span>
          </span>
        </NavLink>

        <nav className={[styles.nav, menuOpen ? styles.navOpen : ""].join(" ")}>
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClass} onClick={closeMenu}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/wishlist" className={linkClass} onClick={closeMenu}>
                <FiBookmark className={styles.navIcon} />
                Wishlist
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink to="/admin" className={linkClass} onClick={closeMenu}>
                  <FiShield className={styles.navIcon} />
                  Admin Panel
                </NavLink>
              </li>
            )}
          </ul>

          <div className={styles.authArea}>
            {isAuthenticated ? (
              <>
                <span className={styles.userChip}>
                  <FiUser />
                  {user?.username}
                  {isAdmin && <span className={styles.adminBadge}>admin</span>}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <FiLogOut /> Çıxış
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  closeMenu();
                  navigate("/login");
                }}
              >
                Giriş et
              </Button>
            )}
          </div>
        </nav>

        <button
          type="button"
          className={styles.burger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Menyunu bağla" : "Menyunu aç"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </Container>
    </header>
  );
}

export default Header;
