import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Container from "../../components/Container";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import DetailView from "../../components/DetailView";
import { cardService } from "../../services/cardService";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

function CardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggleItem } = useWishlist();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveBusy, setSaveBusy] = useState(false);

  const loadCard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cardService.getById(id);
      setCard(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Bu kart/video tapılmadı.");
      } else {
        setError("Kart yüklənərkən xəta baş verdi.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  const handleToggleSave = async () => {
    setSaveBusy(true);
    try {
      await toggleItem("card", card.id);
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <Container>
      {loading && <Loader label="Kart yüklənir..." />}

      {!loading && error && (
        <EmptyState
          title="Bir xəta baş verdi"
          description={error}
          actionSlot={
            <Link to="/">
              <Button variant="outline" size="sm">
                Homepage-ə qayıt
              </Button>
            </Link>
          }
        />
      )}

      {!loading && !error && card && (
        <DetailView
          title={card.title}
          meta="Video / Kart"
          description={card.description}
          picture={card.picture}
          videoUrl={card.video_url}
          isAuthenticated={isAuthenticated}
          isSaved={isAuthenticated && isSaved("card", card.id)}
          onToggleSave={handleToggleSave}
          saveBusy={saveBusy}
          onBack={() => navigate(-1)}
        />
      )}
    </Container>
  );
}

export default CardDetailPage;
