import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Hər sorğuya, əgər localStorage-da token varsa, avtomatik əlavə edirik
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 = token yoxdur / etibarsızdır / vaxtı bitib -> sessiyanı təmizləyib login-ə yönləndiririk.
// 403 = doğrulanmısan, amma icazən yoxdur (məs. admin əməliyyatına adi user cəhdi) ->
// bu zaman logout ETMİRİK, sadəcə xəta çağıran tərəfə ötürülür (məs. "admin icazəsi tələb olunur").
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = Boolean(localStorage.getItem("token"));
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Yalnız real sessiya idisə (əvvəllər login olunubsa) və artıq login
      // səhifəsində deyiliksə yönləndiririk ki, sonsuz loop/lazımsız reload olmasın.
      if (hadToken && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
