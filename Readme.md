# Insurance Policy Management API

A backend REST API built using **Node.js, Express, MongoDB, and Worker Threads** that ingests policy data from XLSX/CSV files and provides powerful search and aggregation capabilities.

---

## 🚀 Features

* Upload large XLSX/CSV policy data using **Worker Threads** (non-blocking processing)
* Automatic creation of MongoDB collections
* Search policy details by username (partial & case-insensitive)
* Aggregated policies grouped per user
* Pagination support for aggregation API
* Duplicate-safe data ingestion (upsert based)
* Production-ready middlewares (Helmet, Rate Limit, Logging)
* Environment-based configuration

---

## 🛠 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **Worker Threads**
* **Multer** (File Upload)
* **XLSX** (File Parsing)
* **Express-Validator** (Validation)
* **Helmet / CORS / Morgan / Rate-Limit**

---

## 📂 Project Structure

```
src/
 ├── services/
 ├── routes/
 ├── models/
 ├── workers/
 ├── middlewares/
 ├── app.js
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```
git clone https://github.com/Akshay-Anilkumar/insurance-policy-api
cd insurance-policy-api
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

Create `.env` file:

Update values:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/insurance
```

(You may also use MongoDB Atlas connection string)

### 4. Start Server

```
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## 📤 API Endpoints

### Upload Policy File

Uploads XLSX/CSV and inserts data asynchronously using worker threads.

```
POST /api/policy/upload
Content-Type: multipart/form-data
Body: file=<xlsx/csv>
```

---

### Search Policies by Username

Case-insensitive & partial match search.

```
GET /api/policy/search?username=omar
```

Response:

```
{
  "count": 1,
  "users": [
    {
      "user": { ...userDetails },
      "totalPolicies": 3,
      "policies": [...]
    }
  ]
}
```

---

### Aggregated Policies (Paginated)

```
GET /api/policy/aggregate?page=1&limit=5
```

Response:

```
{
  "page": 1,
  "limit": 5,
  "totalUsers": 20,
  "totalPages": 4,
  "data": [...]
}
```

---

## 🔒 Security & Best Practices

* Helmet security headers
* Rate limiting to prevent abuse
* Centralized error handling
* Validation layer
* Worker thread for CPU-heavy processing
* Environment variables protected via `.env`

---

## 📊 Database Collections

* Agents
* Users
* Accounts
* Policy Categories (LOB)
* Carriers
* Policies

Collections are created automatically when data is uploaded.

---

## 🧠 Design Decisions

* Worker threads prevent blocking main event loop during file processing
* Aggregation pipeline avoids N+1 query problem
* Upsert logic prevents duplicate entries
* Layered architecture improves scalability and testability

---

## 👨‍💻 Author

Akshay Kumar K A

---
