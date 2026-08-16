import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import StampButton from "../StampButton";
import { getImageUrl } from "../../utils/getImageUrl";
import styles from "./index.module.scss";

/**
 * Ortaq kataloq kartı. Həm Homepage-dəki video/kartlar, həm Bookspage-dəki
 * kitablar, həm də Wishlist-dəki elementlər üçün istifadə olunur.
 *
 * mode:
 *  "save"   -> sağ üst küncdə save/unsave stamp-i (Home/Books səhifələri)
 *  "remove" -> sol üst küncdə remove stamp-i (Wishlist səhifəsi)
 *
 * onOpen: verilibsə, kartın (stamp/admin-sil düymələri xaric) istənilən
 * yerinə klik detal səhifəsini açır (məs. navigate(`/books/${id}`)).
 */
function Card({
  title,
  meta,
  description,
  picture,
  price,
  mode = "save",
  isSaved = false,
  onToggleSave,
  onRemove,
  isAdmin = false,
  onDelete,
  onOpen,
}) {
  const [busy, setBusy] = useState(false);

  const handleStampClick = async (e) => {
    e.stopPropagation();
    setBusy(true);
    try {
      if (mode === "remove") {
        await onRemove?.();
      } else {
        await onToggleSave?.();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleCardClick = () => {
    onOpen?.();
  };

  const handleCardKeyDown = (e) => {
    if (onOpen && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      className={[styles.card, onOpen ? styles.clickable : ""].filter(Boolean).join(" ")}
      onClick={onOpen ? handleCardClick : undefined}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={onOpen ? handleCardKeyDown : undefined}
    >
      <div className={styles.mediaWrapper}>
        <img src={getImageUrl(picture)} alt={title} className={styles.media} loading="lazy" />

        <StampButton
          variant={mode === "remove" ? "remove" : "save"}
          active={isSaved}
          disabled={busy}
          onClick={handleStampClick}
        />

        {isAdmin && onDelete && (
          <button
            type="button"
            className={styles.adminDelete}
            onClick={handleDeleteClick}
            aria-label="Admin: sil"
            title="Admin: sil"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      <div className={styles.body}>
        {meta && <span className={styles.meta}>{meta}</span>}
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {price !== undefined && price !== null && (
          <span className={styles.price}>{Number(price).toFixed(2)} ₼</span>
        )}
      </div>
    </article>
  );
}

export default Card;
