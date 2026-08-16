import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import SectionTitle from "../../components/SectionTitle";
import MasonryGrid from "../../components/MasonryGrid";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import { useWishlist } from "../../context/WishlistContext";
import styles from "./index.module.scss";

function WishlistPage() {
  const navigate = useNavigate();
  const { items, loading, error, removeItem } = useWishlist();

  return (
    <Container className={styles.wrapper}>
      <SectionTitle
        eyebrow="Şəxsi rəf"
        title="Wishlist"
        description="Möhürlədiyin bütün kitab və kartlar burada toplanır. Sol üst küncdəki düymə ilə rəfindən çıxara bilərsən."
      />

      {loading && <Loader label="Wishlist yüklənir..." />}

      {!loading && error && <EmptyState title="Bir xəta baş verdi" description={error} />}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Rəfin hələ boşdur"
          description="Homepage və ya Kitablar səhifəsindəki kartların üzərindəki möhürə basaraq buraya əlavə et."
          actionSlot={
            <div className={styles.emptyActions}>
              <Link to="/">
                <Button variant="outline" size="sm">
                  Homepage-ə get
                </Button>
              </Link>
              <Link to="/books">
                <Button variant="primary" size="sm">
                  Kitablara bax
                </Button>
              </Link>
            </div>
          }
        />
      )}

      {!loading && !error && items.length > 0 && (
        <MasonryGrid>
          {items.map((entry) => {
            const { item, itemType, wishlistId } = entry;
            if (!item) return null;

            return (
              <Card
                key={wishlistId}
                title={item.title}
                meta={itemType === "book" ? item.author : "Video / Kart"}
                description={item.description}
                picture={item.picture}
                price={itemType === "book" ? item.price : undefined}
                mode="remove"
                onRemove={() => removeItem(wishlistId)}
                onOpen={() => navigate(itemType === "book" ? `/books/${item.id}` : `/cards/${item.id}`)}
              />
            );
          })}
        </MasonryGrid>
      )}
    </Container>
  );
}

export default WishlistPage;
