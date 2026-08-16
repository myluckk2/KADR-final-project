import React from "react";
import styles from "./index.module.scss";

/**
 * Səhifə/bölmə başlıqları üçün ortaq komponent.
 * eyebrow: kataloq etiketi kimi kiçik üst mətn (məs. "№ 01 — Kolleksiya")
 */
function SectionTitle({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={[styles.wrapper, styles[align]].join(" ")}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}

export default SectionTitle;
