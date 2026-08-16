## Folder Structure

```
frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── src/
    ├── main.jsx              # ReactDOM.render + Provider-lər
    ├── App.jsx                # AppRoutes-u render edir
    ├── styles/
    │   ├── _tokens.scss       # rənglər, fontlar, radius, kölgə dəyişənləri
    │   └── global.scss        # reset + baza tipoqrafiya
    │
    ├── layout/                # Header/Footer YALNIZ bu qovluqda
    │   ├── index.jsx          # MainLayout: Header + <Outlet/> + Footer
    │   ├── Header/
    │   │   ├── index.jsx
    │   │   └── index.module.scss
    │   └── Footer/
    │       ├── index.jsx
    │       └── index.module.scss
    │
    ├── routes/
    │   └── index.jsx          # Main route cədvəli (bütün path-lar burada)
    │
    ├── pages/                 # Hər səhifə öz qovluğunda
    │   ├── HomePage/
    │   │   ├── index.jsx
    │   │   └── index.module.scss
    │   ├── BooksPage/
    │   ├── AboutPage/
    │   ├── ContactPage/
    │   ├── WishlistPage/
    │   ├── LoginPage/
    │   └── NotFoundPage/
    │
    ├── components/            # Dəyişməyən, hər yerdə istifadə olunan hissələr
    │   ├── Button/
    │   ├── Card/               # Pinterest-tipli kataloq kartı (kitab+kart+wishlist üçün ortaq)
    │   ├── StampButton/         # kart küncündəki save/remove "möhür" düyməsi
    │   ├── MasonryGrid/         # CSS-columns əsaslı Pinterest grid
    │   ├── Container/
    │   ├── SectionTitle/
    │   ├── Loader/
    │   ├── EmptyState/
    │   ├── AdminItemForm/       # admin üçün yeni kitab/kart əlavə etmə modalı
    │   └── ProtectedRoute/      # login tələb edən route-lar üçün wrapper
    │
    ├── context/                 # Context API (qlobal state)
    │   ├── AuthContext.jsx       # login/register/logout + user/role
    │   └── WishlistContext.jsx   # wishlist siyahısı, əlavə/sil/toggle
    │
    └── services/                 # backend ilə əlaqə (axios)
        ├── api.js                 # axios instance + JWT interceptor
        ├── authService.js
        ├── bookService.js
        ├── cardService.js
        └── wishlistService.js
```

## Quraşdırma

1. **Asılılıqları yükləyin:**
   ```bash
   npm install
   ```

2. **`.env` faylı yaradın:**
   ```bash
   cp .env.example .env
   ```
   Backend fərqli portda işləyirsə, `VITE_API_URL`-i uyğunlaşdırın (default: `http://localhost:5000/api`).

3. **Backend-i işə salın** (əvvəlki mesajdakı `backend/` layihəsi):
   ```bash
   cd ../backend
   npm install
   node database/seedUsers.js
   npm run dev
   ```

4. **Frontend-i işə salın:**
   ```bash
   npm run dev
   ```
   Vite default olaraq `http://localhost:5173` ünvanında açılır.



## Qeyd

- `ContactPage`-dəki forma backend-ə bağlıdır: `services/contactService.js`
  `POST /api/contact` endpointinə müraciət edir, backend isə mesajı
  `contact_messages` cədvəlinə yazır (bax: `backend/controllers/contact.controller.js`).
- Admin login/register üçün backend-dəki `database/seedUsers.js` skriptini
  işə salmağı unutmayın (`admin / Admin123!`).
