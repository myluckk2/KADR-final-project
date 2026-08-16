import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import Button from "../Button";
import styles from "./index.module.scss";
import { bookService } from "../../services/bookService";
import { cardService } from "../../services/cardService";
import { getImageUrl } from "../../utils/getImageUrl";

/**
 * type: "book" | "card"
 * item: redaktə üçün mövcud element (verilməsə "yaratma" rejimi, verilsə "redaktə" rejimi)
 * Admin rolunda Home/Books və Admin Panel səhifələrində istifadə olunur.
 */
function AdminItemForm({ type, item = null, onClose, onCreated, onUpdated }) {
  const isBook = type === "book";
  const isEditMode = Boolean(item);

  const [title, setTitle] = useState(item?.title || "");
  const [author, setAuthor] = useState(item?.author || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price ?? "");
  const [videoUrl, setVideoUrl] = useState(item?.video_url || "");
  const [pictureFile, setPictureFile] = useState(null);
  const [pictureUrl, setPictureUrl] = useState(isEditMode ? "" : "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || (isBook && !author.trim())) {
      setError("Zəhmət olmasa məcburi sahələri doldurun.");
      return;
    }
    // Yaratma zamanı şəkil məcburidir; redaktədə mövcud şəkil saxlanıla bilər
    if (!isEditMode && !pictureFile && !pictureUrl.trim()) {
      setError("Şəkil faylı seçin və ya şəkil linki daxil edin.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());

    if (isBook) {
      formData.append("author", author.trim());
      formData.append("price", price || 0);
    } else {
      formData.append("video_url", videoUrl.trim());
    }

    if (pictureFile) {
      formData.append("picture", pictureFile);
    } else if (pictureUrl.trim()) {
      formData.append("picture", pictureUrl.trim());
    }

    setSubmitting(true);
    try {
      const service = isBook ? bookService : cardService;
      if (isEditMode) {
        await service.update(item.id, formData);
        onUpdated?.();
      } else {
        await service.create(formData);
        onCreated?.();
      }
      onClose?.();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isEditMode ? "Yenilənərkən xəta baş verdi." : "Əlavə edilərkən xəta baş verdi.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Bağla">
          <FiX />
        </button>

        <span className={styles.eyebrow}>Admin panel</span>
        <h3 className={styles.heading}>
          {isEditMode
            ? isBook
              ? "Kitabı redaktə et"
              : "Video/kartı redaktə et"
            : isBook
            ? "Yeni kitab əlavə et"
            : "Yeni video/kart əlavə et"}
        </h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Başlıq *</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlıq daxil edin" />
          </label>

          {isBook && (
            <label className={styles.field}>
              <span>Müəllif *</span>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Müəllif adı" />
            </label>
          )}

          <label className={styles.field}>
            <span>Təsvir</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Qısa təsvir"
            />
          </label>

          {isBook ? (
            <label className={styles.field}>
              <span>Qiymət (₼)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </label>
          ) : (
            <label className={styles.field}>
              <span>Video linki</span>
              <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
            </label>
          )}

          {isEditMode && item?.picture && (
            <div className={styles.currentPicture}>
              <span>Hazırkı şəkil</span>
              <img src={getImageUrl(item.picture)} alt={title} />
            </div>
          )}

          <label className={styles.field}>
            <span>{isEditMode ? "Yeni şəkil (fayl yüklə, istəyə bağlı)" : "Şəkil (fayl yüklə)"}</span>
            <input type="file" accept="image/*" onChange={(e) => setPictureFile(e.target.files?.[0] || null)} />
          </label>

          <div className={styles.divider}>və ya</div>

          <label className={styles.field}>
            <span>Şəkil linki (URL)</span>
            <input
              value={pictureUrl}
              onChange={(e) => setPictureUrl(e.target.value)}
              placeholder="https://..."
              disabled={Boolean(pictureFile)}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Ləğv et
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Yadda saxlanılır..." : isEditMode ? "Yadda saxla" : "Əlavə et"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminItemForm;
