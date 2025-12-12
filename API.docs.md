# MoodBite API Documentation

Dokumentasi resmi endpoint MoodBite Server. Ringkasan ini mencakup Base URL, header otentikasi, contoh request/response, dan daftar endpoint utama.

## Base URLs

- Local: `http://localhost:3000`
- Production: `https://api.childstudio.web.id` (sesuaikan jika perlu)

## Autentikasi

- Skema: JWT Bearer token
- Header: `Authorization: Bearer <access_token>`

## Format Umum

- Semua request/response menggunakan `application/json`.
- Error mengembalikan objek JSON: `{ "message": "..." }` dan kode HTTP sesuai situasi.

## Contoh singkat (cURL)

```bash
# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@mail.com","password":"password123"}'

# Gunakan token untuk request terproteksi
curl -H "Authorization: Bearer <token>" http://localhost:3000/recipes
```

---

**1. Authentication**

### Register

- URL: `/register`
- Method: `POST`
- Body (JSON):

```json
{
  "username": "John Doe",
  "email": "john@mail.com",
  "password": "password123"
}
```

- Success: `201 Created`

```json
{
  "id": 1,
  "email": "john@mail.com"
}
```

### Login

- URL: `/login`
- Method: `POST`
- Body (JSON):

```json
{
  "email": "john@mail.com",
  "password": "password123"
}
```

- Success: `200 OK`

```json
{
  "access_token": "<jwt_token>",
  "username": "John Doe"
}
```

---

**2. AI Recommendation (Gemini)**

Menghasilkan rekomendasi resep berdasarkan mood dan konteks pengguna.

- URL: `/gemini-recommend`
- Method: `POST`
- Headers: `Authorization: Bearer <token>`
- Body (JSON):

```json
{
  "mood": "Sad. Context: Just broke up and need comfort food."
}
```

- Success: `200 OK`

```json
{
  "mood": "Sad...",
  "recipes": [
    {
      "title": "Creamy Chicken Soup",
      "ingredients": ["Chicken", "Cream", "Carrots"],
      "instructions": ["Boil water", "Add chicken..."],
      "image": "https://images.example/...",
      "calories": "350 kcal",
      "protein": "20 g",
      "fat": "15 g",
      "readyInMinutes": 30
    }
  ]
}
```

---

**3. Recipes (Favorites)**

Endpoints untuk menyimpan dan mengelola resep favorit pengguna.

### Get All Favorites

- URL: `/recipes`
- Method: `GET`
- Headers: `Authorization: Bearer <token>`
- Success: `200 OK` — Array objek resep.

### Get Recipe Detail

- URL: `/recipes/:id`
- Method: `GET`
- Headers: `Authorization: Bearer <token>`
- Success: `200 OK` — Object detail resep.

### Save Recipe

- URL: `/recipes`
- Method: `POST`
- Headers: `Authorization: Bearer <token>`
- Body (JSON):

```json
{
  "title": "Fried Rice",
  "ingredients": ["Rice", "Egg", "Soy Sauce"],
  "instructions": ["Fry egg", "Add rice..."],
  "imageUrl": "https://image.url/...",
  "mood": "Happy",
  "calories": "400 kcal",
  "protein": "10 g",
  "fat": "5 g",
  "readyInMinutes": 15
}
```

- Success: `201 Created`

```json
{
  "message": "Recipe saved to favorites",
  "recipe": {
    /* recipe object */
  }
}
```

### Delete Recipe

- URL: `/recipes/:id`
- Method: `DELETE`
- Headers: `Authorization: Bearer <token>`
- Success: `200 OK`

```json
{
  "message": "Recipe has been deleted"
}
```

---

**4. User Profile & Security**

### Get Profile

- URL: `/profile`
- Method: `GET`
- Headers: `Authorization: Bearer <token>`
- Success: `200 OK`

```json
{
  "id": 1,
  "username": "John Doe",
  "email": "john@mail.com",
  "phoneNumber": "08123456789",
  "address": "Jakarta, Indonesia"
}
```

### Update Profile

- URL: `/profile`
- Method: `PUT`
- Headers: `Authorization: Bearer <token>`
- Body (JSON): (email & password tidak dapat diubah di endpoint ini)

```json
{
  "username": "John New",
  "phoneNumber": "08999999",
  "address": "Bandung, Indonesia"
}
```

- Success: `200 OK`

```json
{
  "message": "Profile updated successfully",
  "user": {
    /* updated user */
  }
}
```

### Request OTP (untuk reset password)

- URL: `/request-otp`
- Method: `POST`
- Headers: `Authorization: Bearer <token>`
- Body: `{}` (kosong)
- Success: `200 OK`

```json
{
  "message": "OTP sent to john@mail.com"
}
```

### Reset Password (Verify OTP)

- URL: `/reset-password-otp`
- Method: `PATCH`
- Headers: `Authorization: Bearer <token>`
- Body (JSON):

```json
{
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

- Success: `200 OK`

```json
{
  "message": "Password successfully changed"
}
```

---

## Global Errors

Common HTTP status codes dan arti singkatnya:

- `400 Bad Request`: Validasi input gagal atau data tidak lengkap.
- `401 Unauthorized`: Token tidak ada atau tidak valid.
- `403 Forbidden`: Tidak memiliki hak akses.
- `404 Not Found`: Resource tidak ditemukan.
- `500 Internal Server Error`: Kesalahan server.

Format error:

```json
{
  "message": "Deskripsi error"
}
```

---
