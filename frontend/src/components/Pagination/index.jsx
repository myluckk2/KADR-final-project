import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./index.module.scss";

/**
 * Ümumi pagination komponenti.
 * page: cari səhifə (1-dən başlayır)
 * totalPages: ümumi səhifə sayı
 * onChange: (yeniSəhifə) => void
 */
function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Səhifələmə">
      <button
        type="button"
        className={styles.navBtn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Əvvəlki səhifə"
      >
        <FiChevronLeft />
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className={styles.dots}>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={[styles.pageBtn, p === page ? styles.active : ""].join(" ")}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        className={styles.navBtn}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Növbəti səhifə"
      >
        <FiChevronRight />
      </button>
    </nav>
  );
}

// Səhifə nömrələrini "1 ... 4 5 6 ... 12" formatında hazırlayır
function getPageList(current, total) {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let last;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (last) {
      if (i - last === 2) rangeWithDots.push(last + 1);
      else if (i - last > 2) rangeWithDots.push("...");
    }
    rangeWithDots.push(i);
    last = i;
  }

  return rangeWithDots;
}

export default Pagination;
