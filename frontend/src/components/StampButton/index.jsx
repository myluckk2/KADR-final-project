import React from "react";
import { FiBookmark, FiCornerUpLeft } from "react-icons/fi";
import styles from "./index.module.scss";

/**
 * Kataloq kartlarının küncündə görünən, kitabxana möhürü estetikasında
 * dairəvi düymə. Bu, sayt boyu "save/remove" hərəkəti üçün imza elementidir.
 *
 * variant: "save"   -> sağ üst küncdə, wishlist-ə əlavə/çıxar
 *          "remove" -> sol üst küncdə (yalnız Wishlist səhifəsində), rəfə qaytar
 */
function StampButton({ variant = "save", active = false, onClick, disabled = false, label }) {
  const isRemove = variant === "remove";

  const classes = [
    styles.stamp,
    isRemove ? styles.remove : styles.save,
    active ? styles.active : "",
  ]
    .filter(Boolean)
    .join(" ");

  const defaultLabel = isRemove ? "Rəfdən sil" : active ? "Wishlist-dən çıxar" : "Wishlist-ə əlavə et";

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={!isRemove ? active : undefined}
      aria-label={label || defaultLabel}
      title={label || defaultLabel}
    >
      <span className={styles.ring} aria-hidden="true" />
      {isRemove ? (
        <FiCornerUpLeft className={styles.icon} />
      ) : (
        <FiBookmark className={[styles.icon, active ? styles.iconFilled : ""].join(" ")} />
      )}
    </button>
  );
}

export default StampButton;
