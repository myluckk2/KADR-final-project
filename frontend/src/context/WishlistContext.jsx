import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { wishlistService } from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]); // [{ wishlistId, itemType, item }]
  const [meta, setMeta] = useState({ page: 1, limit: 100, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // limit yüksək saxlanılır ki, "isSaved" yoxlaması bütün app boyu (Home/Books
  // səhifələrindəki kartlar üçün) doğru işləsin — bax: backend max=500.
  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, meta: responseMeta } = await wishlistService.getMine({ limit: 500 });
      setItems(data);
      setMeta(responseMeta);
    } catch (err) {
      setError("Wishlist yüklənərkən xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Verilmiş item wishlist-də varsa, onun qeydini qaytarır (yoxdursa undefined)
  const findEntry = useCallback(
    (itemType, itemId) =>
      items.find((entry) => entry.itemType === itemType && entry.item?.id === itemId),
    [items]
  );

  const isSaved = useCallback(
    (itemType, itemId) => Boolean(findEntry(itemType, itemId)),
    [findEntry]
  );

  const addItem = useCallback(
    async (itemType, itemId) => {
      await wishlistService.add(itemType, itemId);
      await refresh();
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (wishlistId) => {
      await wishlistService.remove(wishlistId);
      setItems((prev) => prev.filter((entry) => entry.wishlistId !== wishlistId));
    },
    []
  );

  // Kart üzərindəki tək "save" düyməsi üçün rahat toggle funksiyası
  const toggleItem = useCallback(
    async (itemType, itemId) => {
      const existing = findEntry(itemType, itemId);
      if (existing) {
        await removeItem(existing.wishlistId);
      } else {
        await addItem(itemType, itemId);
      }
    },
    [findEntry, addItem, removeItem]
  );

  const value = {
    items,
    meta,
    loading,
    error,
    refresh,
    isSaved,
    findEntry,
    addItem,
    removeItem,
    toggleItem,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist mütləq <WishlistProvider> daxilində istifadə olunmalıdır.");
  }
  return ctx;
}
