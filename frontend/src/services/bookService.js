import api from "./api";

export const bookService = {
  // params: { page, limit } — ötürülməsə backend default (page=1, limit=12) istifadə edir
  async getAll(params = {}) {
    const { data } = await api.get("/books", { params });
    return data; // { data: [...], meta: { page, limit, total, totalPages } }
  },

  async getById(id) {
    const { data } = await api.get(`/books/${id}`);
    return data;
  },

  async create(payload) {
    // payload: FormData (title, author, description, price, picture)
    const { data } = await api.post("/books", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async update(id, payload) {
    // payload: FormData (title, author, description, price, picture)
    const { data } = await api.put(`/books/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/books/${id}`);
    return data;
  },
};
