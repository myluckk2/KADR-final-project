import React from "react";
import { NavLink } from "react-router-dom";
import Container from "../../components/Container";
import styles from "./index.module.scss";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>R</span>
          <div>
            <p className={styles.brandName}>Rəf.</p>
            <p className={styles.tagline}>Kitab və kart kataloqu</p>
          </div>
        </div>

        <nav className={styles.links}>
          <NavLink to="/" end>
            Ana Səhifə
          </NavLink>
          <NavLink to="/books">Kitablar</NavLink>
          <NavLink to="/about">Haqqımızda</NavLink>
          <NavLink to="/contact">Əlaqə</NavLink>
          <NavLink to="/wishlist">Wishlist</NavLink>
        </nav>

        <p className={styles.copy}>© {year} Rəf. Bütün hüquqlar qorunur.</p>
      </Container>
    </footer>
  );
}

export default Footer;
