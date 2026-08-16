import api from "./api";

export const wishlistService = {
  // params: { page, limit } — ötürülməsə backend default (page=1, limit=100) istifadə edir
  async getMine(params = {}) {
    const { data } = await api.get("/wishlist", { params });
    return data; // { data: [...], meta: { page, limit, total, totalPages } }
  },

  async add(itemType, itemId) {
    const { data } = await api.post("/wishlist", { itemType, itemId });
    return data;
  },

  async remove(wishlistId) {
    const { data } = await api.delete(`/wishlist/${wishlistId}`);
    return data;
  },
};
