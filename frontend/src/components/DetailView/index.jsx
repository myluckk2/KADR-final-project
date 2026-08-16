import React from "react";
import { FiArrowLeft, FiBookmark, FiExternalLink } from "react-icons/fi";
import Button from "../Button";
import { getImageUrl } from "../../utils/getImageUrl";
import styles from "./index.module.scss";

/**
 * Kitab/Kart detal səhifələri üçün ortaq görünüş.
 * BookDetailPage və CardDetailPage bu komponentə fərqli props ötürür
 * (məs. price yalnız kitablarda, videoUrl yalnız kartlarda olur).
 */
function DetailView({
  title,
  meta,
  description,
  picture,
  price,
  videoUrl,
  isAuthenticated,
  isSaved,
  onToggleSave,
  saveBusy,
  onBack,
}) {
  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.backLink} onClick={onBack}>
        <FiArrowLeft /> Geri qayıt
      </button>

      <div className={styles.layout}>
        <div className={styles.mediaWrapper}>
          <img src={getImageUrl(picture)} alt={title} className={styles.media} />
        </div>

        <div className={styles.info}>
          {meta && <span className={styles.meta}>{meta}</span>}
          <h1 className={styles.title}>{title}</h1>

          {price !== undefined && price !== null && (
            <span className={styles.price}>{Number(price).toFixed(2)} ₼</span>
          )}

          {description && <p className={styles.description}>{description}</p>}

          {videoUrl && (
            <a href={videoUrl} target="_blank" rel="noreferrer" className={styles.videoLink}>
              <FiExternalLink /> Videoya bax
            </a>
          )}

          <div className={styles.actions}>
            <Button
              variant={isSaved ? "outline" : "primary"}
              disabled={saveBusy}
              onClick={() => {
                if (!isAuthenticated) {
                  window.alert("Wishlist-ə əlavə etmək üçün əvvəlcə giriş edin.");
                  return;
                }
                onToggleSave?.();
              }}
            >
              <FiBookmark /> {isSaved ? "Wishlist-dən çıxar" : "Wishlist-ə əlavə et"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailView;
