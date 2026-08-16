import api from "./api";

export const cardService = {
  // params: { page, limit } — ötürülməsə backend default (page=1, limit=12) istifadə edir
  async getAll(params = {}) {
    const { data } = await api.get("/cards", { params });
    return data; // { data: [...], meta: { page, limit, total, totalPages } }
  },

  async getById(id) {
    const { data } = await api.get(`/cards/${id}`);
    return data;
  },

  async create(payload) {
    // payload: FormData (title, description, video_url, picture)
    const { data } = await api.post("/cards", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async update(id, payload) {
    // payload: FormData (title, description, video_url, picture)
    const { data } = await api.put(`/cards/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/cards/${id}`);
    return data;
  },
};
