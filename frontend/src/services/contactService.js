import api from "./api";

export const contactService = {
  // payload: { name, email, message }
  async send(payload) {
    const { data } = await api.post("/contact", payload);
    return data;
  },

  // yalnız admin — params: { page, limit }
  async getAll(params = {}) {
    const { data } = await api.get("/contact", { params });
    return data; // { data: [...], meta: { page, limit, total, totalPages } }
  },

  // yalnız admin
  async remove(id) {
    const { data } = await api.delete(`/contact/${id}`);
    return data;
  },
};
