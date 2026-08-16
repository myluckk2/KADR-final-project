/**
 * Qlobal error handler - bütün route/controller-lərdə tutulmayan xətalar
 * bura düşür. Ən sonda app.use() ilə qoşulmalıdır.
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  // 4xx (bilərəkdən atılan, məs. "Kitab tapılmadı") mesajları client üçün təhlükəsizdir.
  // 5xx (gözlənilməz, məs. DB bağlantı xətası) zamanı isə daxili detalları client-ə göstərmirik.
  const message =
    statusCode < 500 ? err.message : "Serverdə xəta baş verdi.";

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
