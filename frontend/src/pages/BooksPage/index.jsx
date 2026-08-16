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
import { bookService } from "../../services/bookService";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import styles from "./index.module.scss";

// Laptop breakpointdə (5 sütunlu grid) hər səhifədə tam 5 sətir (5 x 5 = 25) göstərilsin
// ki, son sətir yarımçıq qalıb yanında boş yer görünməsin.
const PAGE_SIZE = 25;

function BooksPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { isSaved, toggleItem } = useWishlist();

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const loadBooks = useCallback(async (targetPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await bookService.getAll({ page: targetPage, limit: PAGE_SIZE });
      setBooks(data);
      setPage(meta.page);
      setTotalPages(meta.totalPages);
    } catch (err) {
      setError("Kitablar yüklənərkən xəta baş verdi. Backend serveri işlək olduğundan əmin olun.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks(1);
  }, [loadBooks]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kitabı silmək istədiyinizə əminsiniz?")) return;
    try {
      await bookService.remove(id);
      const nextPage = books.length === 1 && page > 1 ? page - 1 : page;
      loadBooks(nextPage);
    } catch (err) {
      window.alert("Silinərkən xəta baş verdi.");
    }
  };

  return (
    <Container>
      <div className={styles.sectionHeaderRow}>
        <SectionTitle
          eyebrow="Kataloq"
          title="Kitab rəfi"
          description="Bütün kitab kolleksiyasına ümumi baxış — sevdiyini wishlist-ə əlavə et."
        />
        {isAdmin && (
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <FiPlus /> Yeni kitab
          </Button>
        )}
      </div>

      {loading && <Loader label="Kitablar yüklənir..." />}

      {!loading && error && <EmptyState title="Bir xəta baş verdi" description={error} />}

      {!loading && !error && books.length === 0 && (
        <EmptyState
          title="Hələ heç bir kitab yoxdur"
          description={
            isAdmin
              ? "Yuxarıdakı düymədən ilk kitabı əlavə et."
              : "Admin tərəfindən kitablar əlavə olunduqda burada görünəcək."
          }
        />
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <MasonryGrid>
            {books.map((book) => (
              <Card
                key={book.id}
                title={book.title}
                meta={book.author}
                description={book.description}
                picture={book.picture}
                price={book.price}
                mode="save"
                isSaved={isAuthenticated && isSaved("book", book.id)}
                onToggleSave={() => {
                  if (!isAuthenticated) {
                    window.alert("Wishlist-ə əlavə etmək üçün əvvəlcə giriş edin.");
                    return;
                  }
                  return toggleItem("book", book.id);
                }}
                isAdmin={isAdmin}
                onDelete={() => handleDelete(book.id)}
                onOpen={() => navigate(`/books/${book.id}`)}
              />
            ))}
          </MasonryGrid>

          <Pagination page={page} totalPages={totalPages} onChange={loadBooks} />
        </>
      )}

      {formOpen && (
        <AdminItemForm type="book" onClose={() => setFormOpen(false)} onCreated={() => loadBooks(page)} />
      )}
    </Container>
  );
}

export default BooksPage;
