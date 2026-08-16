const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// API_URL "http://localhost:5000/api" formatındadır; şəkillər isə backend-in
// kök ünvanından ("http://localhost:5000") servis olunur (bax: server.js -> app.use("/uploads", ...)).
const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, "");

/**
 * Şəkil path-ini tam URL-ə çevirir.
 * - Tam URL-dirsə (http/https, məs. şəkil linki ilə əlavə olunub və ya seed data-dandır) -> olduğu kimi qaytarır.
 * - Backend-dən gələn nisbi path-dirsə (məs. multer ilə yüklənmiş "/uploads/xxx.jpg") ->
 *   backend origin-i ilə birləşdirir, əks halda şəkil frontend portundan (məs. :5173) axtarılır və 404 verir.
 */
export function getImageUrl(picture) {
  if (!picture) return picture;
  if (/^https?:\/\//i.test(picture)) return picture;
  return `${SERVER_ORIGIN}${picture.startsWith("/") ? "" : "/"}${picture}`;
}

export default getImageUrl;
