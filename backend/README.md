## Folder Structure

```
backend/
├── config/
│   └── db.js                 # MySQL connection pool
├── controllers/
│   ├── auth.controller.js     # register/login
│   ├── book.controller.js     # Books CRUD
│   ├── card.controller.js     # Homepage cards/videos CRUD
│   └── wishlist.controller.js # Wishlist (favorites)
├── middlewares/
│   ├── auth.middleware.js         # verifyToken, isAdmin
│   ├── validate.middleware.js     # express-validator nəticələri
│   └── errorHandler.middleware.js # qlobal error handler
├── routes/
│   ├── auth.routes.js
│   ├── book.routes.js
│   ├── card.routes.js
│   └── wishlist.routes.js
├── validations/
│   ├── auth.validation.js
│   ├── book.validation.js
│   ├── card.validation.js
│   └── wishlist.validation.js
├── utils/
│   ├── generateToken.js   # JWT yaratmaq
│   └── upload.js          # Multer (şəkil upload)
├── database/
│   ├── schema.sql          # cədvəllərin yaradılması
│   ├── seed.sql             # 30 kitab + 30 kart nümunə data
│   └── seedUsers.js         # admin + test user (bcrypt ilə)
├── uploads/                 # yüklənən şəkillər (statik serve olunur)
├── .env.example
├── .gitignore
├── package.json
└── server.js                # app giriş nöqtəsi
```

## Quraşdırma

1. **Asılılıqları yükləyin:**
   ```bash
   npm install
   ```

2. **MySQL database qurun:**
   MySQL-ə daxil olub aşağıdakı faylları ardıcıl işə salın:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```
   Bu, `kadr_fullstack` bazasını, `users/books/cards/wishlist` cədvəllərini
   və 30 kitab + 30 kart nümunə datasını yaradacaq.

3. **`.env` faylı yaradın** (`.env.example`-dən köçürüb doldurun):
   ```bash
   cp .env.example .env
   ```
   `DB_PASSWORD` və `JWT_SECRET` sahələrini özünüzə uyğun dəyişin.

4. **Admin və test user yaradın** (parollar bcrypt ilə hash olunur):
   ```bash
   node database/seedUsers.js
   ```
   - Admin → `username: admin` / `password: Admin123!`
   - User  → `username: testuser` / `password: User1234!`

   ⚠️ Bunlar nümunə parollardır — real layihədə mütləq dəyişin.

5. **Server-i işə salın:**
   ```bash
   npm run dev     # nodemon ilə
   # və ya
   npm start
   ```
   Server default olaraq `http://localhost:5000` ünvanında işləyir.

## API Endpoint-ləri

### Auth
| Method | Endpoint             | Açıqlama                          |
|--------|-----------------------|------------------------------------|
| POST   | `/api/auth/register`  | Yeni user qeydiyyatı (rol: user)  |
| POST   | `/api/auth/login`     | Login (admin və ya user)          |

Login cavabında JWT `token` qaytarılır. Digər bütün qorunan endpoint-lərə
sorğu göndərəndə header əlavə edin:
```
Authorization: Bearer <token>
```

### Books (Bookspage)
| Method | Endpoint          | İcazə         | Açıqlama            |
|--------|-------------------|----------------|----------------------|
| GET    | `/api/books`      | hər kəs        | bütün kitablar (30)  |
| GET    | `/api/books/:id`  | hər kəs        | tək kitab            |
| POST   | `/api/books`      | yalnız admin   | kitab əlavə et       |
| PUT    | `/api/books/:id`  | yalnız admin   | kitabı yenilə        |
| DELETE | `/api/books/:id`  | yalnız admin   | kitabı sil           |

`POST`/`PUT` `multipart/form-data` qəbul edir: `title, author, description,
price, picture` (şəkil faylı `picture` field-i ilə göndərilir; alternativ
olaraq JSON body-də `picture` sahəsinə birbaşa url da yazıla bilər).

### Cards / Videos (Homepage)
| Method | Endpoint          | İcazə         | Açıqlama            |
|--------|-------------------|----------------|----------------------|
| GET    | `/api/cards`      | hər kəs        | bütün kartlar (30)   |
| GET    | `/api/cards/:id`  | hər kəs        | tək kart             |
| POST   | `/api/cards`      | yalnız admin   | kart əlavə et        |
| PUT    | `/api/cards/:id`  | yalnız admin   | kartı yenilə         |
| DELETE | `/api/cards/:id`  | yalnız admin   | kartı sil            |

### Wishlist
| Method | Endpoint              | İcazə    | Açıqlama                              |
|--------|------------------------|-----------|-----------------------------------------|
| GET    | `/api/wishlist`        | login     | öz wishlist-imi gətir                  |
| POST   | `/api/wishlist`        | login     | `{ itemType: "book"|"card", itemId }` |
| DELETE | `/api/wishlist/:id`    | login     | wishlist-dən sil                       |

## Qeyd

- Parollar heç vaxt düz mətn (plain text) saxlanılmır — `bcrypt` ilə hash olunur.
- Admin rolu public register vasitəsilə yaradıla bilmir (təhlükəsizlik üçün);
  yalnız `database/seedUsers.js` və ya birbaşa DB-dən yaradılır.
- Frontend-də (React) sorğular üçün `axios`/`fetch` ilə yuxarıdakı endpoint-lərə
  müraciət edə, `token`-i `localStorage`-da saxlayıb hər sorğuda header-ə əlavə edə bilərsiniz.
