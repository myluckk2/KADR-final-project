import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Container from "../../components/Container";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import DetailView from "../../components/DetailView";
import { bookService } from "../../services/bookService";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggleItem } = useWishlist();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveBusy, setSaveBusy] = useState(false);

  const loadBook = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getById(id);
      setBook(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Bu kitab tapılmadı.");
      } else {
        setError("Kitab yüklənərkən xəta baş verdi.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  const handleToggleSave = async () => {
    setSaveBusy(true);
    try {
      await toggleItem("book", book.id);
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <Container>
      {loading && <Loader label="Kitab yüklənir..." />}

      {!loading && error && (
        <EmptyState
          title="Bir xəta baş verdi"
          description={error}
          actionSlot={
            <Link to="/books">
              <Button variant="outline" size="sm">
                Kitablara qayıt
              </Button>
            </Link>
          }
        />
      )}

      {!loading && !error && book && (
        <DetailView
          title={book.title}
          meta={book.author}
          description={book.description}
          picture={book.picture}
          price={book.price}
          isAuthenticated={isAuthenticated}
          isSaved={isAuthenticated && isSaved("book", book.id)}
          onToggleSave={handleToggleSave}
          saveBusy={saveBusy}
          onBack={() => navigate(-1)}
        />
      )}
    </Container>
  );
}

export default BookDetailPage;
