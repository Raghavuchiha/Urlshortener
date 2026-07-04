# 🔗 URL Shortener

A simple URL Shortener built using **FastAPI**, **PostgreSQL**, **SQLAlchemy**, and **Pydantic**. The application allows users to generate short URLs that redirect to the original website.

---

## 🚀 Features

- Generate unique short URLs
- Redirect to the original URL
- URL validation using Pydantic
- PostgreSQL database integration
- SQLAlchemy ORM
- RESTful API
- Simple HTML, CSS & JavaScript frontend
- Clean project structure using FastAPI Routers

---

## 🛠️ Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Uvicorn

### Frontend
- HTML
- CSS
- JavaScript

---



```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/url-shortener.git
```

### 2. Navigate to the project

```bash
cd url-shortener
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

### 5. Install dependencies

```bash
pip install -r requirements.txt
```

### 6. Configure PostgreSQL

Create a PostgreSQL database.

Update your `.env` file with your database credentials.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/url_shortener
```

### 7. Run the application

```bash
uvicorn main:app --reload
```

Backend will start on:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

---

## 📌 API Endpoints

### Home

```
GET /
```

Returns a simple health message.

---

### Shorten URL

```
POST /shorten
```

Request

```json
{
    "original_url": "https://www.google.com"
}
```

Response

```json
{
    "message": "Short URL created successfully",
    "short_url": "http://localhost:8000/abc12345"
}
```

---

### Redirect

```
GET /{short_code}
```

Redirects the user to the original URL.

---

## 💡 Concepts Learned

- FastAPI Routing
- APIRouter
- Dependency Injection
- SQLAlchemy ORM
- PostgreSQL Integration
- Database Sessions
- Pydantic Validation
- HTTP Redirects
- REST API Development
- CORS Middleware
- Frontend-Backend Communication using Fetch API


## 🔮 Future Improvements

- User Authentication (JWT)
- Custom Short URLs
- Click Analytics
- QR Code Generation
- URL Expiration
- Docker Support
- Deployment on AWS / Render

---

## 👨‍💻 Author

**Raghav Mandloi**

GitHub: https://github.com/your-github-username

---

⭐ If you found this project helpful, consider giving it a star!
