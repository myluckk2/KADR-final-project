import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import Container from "../../components/Container";
import SectionTitle from "../../components/SectionTitle";
import MasonryGrid from "../../components/MasonryGrid";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import AdminItemForm from "../../components/AdminItemForm";
import { cardService } from "../../services/cardService";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import styles from "./index.module.scss";

// Laptop breakpointdə (5 sütunlu grid) hər səhifədə tam 5 sətir (5 x 5 = 25) göstərilsin
// ki, son sətir yarımçıq qalıb yanında boş yer görünməsin.
const PAGE_SIZE = 25;

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { isSaved, toggleItem } = useWishlist();

  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const loadCards = useCallback(async (targetPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await cardService.getAll({ page: targetPage, limit: PAGE_SIZE });
      setCards(data);
      setPage(meta.page);
      setTotalPages(meta.totalPages);
    } catch (err) {
      setError("Kartlar yüklənərkən xəta baş verdi. Backend serveri işlək olduğundan əmin olun.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards(1);
  }, [loadCards]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kartı silmək istədiyinizə əminsiniz?")) return;
    try {
      await cardService.remove(id);
      // Cari səhifədə son element idisə, bir səhifə geri qayıdırıq
      const nextPage = cards.length === 1 && page > 1 ? page - 1 : page;
      loadCards(nextPage);
    } catch (err) {
      window.alert("Silinərkən xəta baş verdi.");
    }
  };

  return (
    <>
      <section className={styles.hero}>
        <Container className={styles.heroInner}>
          <span className={styles.heroEyebrow}>Kolleksiya № 01 — Video dərslər</span>
          <h1 className={styles.heroTitle}>
            Rəfindəki hər kart, <br />
            öyrənməyə açılan bir qapı.
          </h1>
          <p className={styles.heroText}>
            Aşağıdakı kataloqdan xoşuna gələn video və kartları kəşf et, sağ üst
            küncdəki möhürə basaraq şəxsi rəfinə (wishlist) əlavə et.
          </p>
        </Container>
      </section>

      <Container>
        <div className={styles.sectionHeaderRow}>
          <SectionTitle
            eyebrow="Kataloq"
            title="Homepage kartları"
            description="Bütün video/kart kolleksiyasına ümumi baxış."
          />
          {isAdmin && (
            <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
              <FiPlus /> Yeni əlavə et
            </Button>
          )}
        </div>

        {loading && <Loader label="Kartlar yüklənir..." />}

        {!loading && error && (
          <EmptyState title="Bir xəta baş verdi" description={error} />
        )}

        {!loading && !error && cards.length === 0 && (
          <EmptyState
            title="Hələ heç bir kart yoxdur"
            description={
              isAdmin
                ? "Yuxarıdakı düymədən ilk kartı əlavə et."
                : "Admin tərəfindən kartlar əlavə olunduqda burada görünəcək."
            }
          />
        )}

        {!loading && !error && cards.length > 0 && (
          <>
            <MasonryGrid>
              {cards.map((card) => (
                <Card
                  key={card.id}
                  title={card.title}
                  meta="Video / Kart"
                  description={card.description}
                  picture={card.picture}
                  mode="save"
                  isSaved={isAuthenticated && isSaved("card", card.id)}
                  onToggleSave={() => {
                    if (!isAuthenticated) {
                      window.alert("Wishlist-ə əlavə etmək üçün əvvəlcə giriş edin.");
                      return;
                    }
                    return toggleItem("card", card.id);
                  }}
                  isAdmin={isAdmin}
                  onDelete={() => handleDelete(card.id)}
                  onOpen={() => navigate(`/cards/${card.id}`)}
                />
              ))}
            </MasonryGrid>

            <Pagination page={page} totalPages={totalPages} onChange={loadCards} />
          </>
        )}
      </Container>

      {formOpen && (
        <AdminItemForm type="card" onClose={() => setFormOpen(false)} onCreated={() => loadCards(page)} />
      )}
    </>
  );
}

export default HomePage;
