
# Our Shelves

A reading tracker web application that allows users to search for books using the **Open Library API**, save them to their personal digital shelf, and manage their book collection.

## Team Members

**Sprint 1/2:**
- Alston
- Danny

**Sprint 3:**
- Kim
- Maddie

**Sprint 4:**
- Tav
- Tia

**Sprint 5:**
- Alston
- Danny

---

## Project Description

**Our Shelves** lets users:
- Search for books by title using the Open Library API.
- Add books to their personal shelf stored in a MySQL database.
- View their saved books.
- Delete books from their library.
- Use a React frontend + Express backend via REST API.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Database | MySQL |
| External API | Open Library API |
| Packaging | Docker |
| Deployment | Ubuntu Server + Docker Compose |

---

## Project Structure

```
Our-Shelves/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── db.js
│   ├── init/sql/
│   └── __tests__/
│
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/hooks/
│   ├── cypress/
│   └── src/setupTests.js
│
├── docker-compose.yml
├── .github/workflows/
└── README.md
```

---

## Environment Variables

```
MYSQL_USER=username
MYSQL_PASSWORD=superSecurePassword
MYSQL_DATABASE=my_favorite_db
DB_PORT=3306
PORT=3000
HOST=localhost
VITE_API_URL=http://${HOST}:${PORT}
```

---

## Local Development Setup

```
git clone https://github.com/your-username/our-shelves.git
cd our-shelves
```

Install dependencies:

```
cd backend && npm install
cd ../frontend && npm install
```

---

## Running the Application

```
docker compose up -d
```

Frontend: http://localhost:5173  
Backend: http://localhost:3000

---

## Testing Strategy

### Backend Unit Tests
```
cd backend
npm test
```

### Backend Integration Tests
```
cd backend
npm run test:integration
```

### Frontend Unit Tests
```
cd frontend
npm test
```

### Cypress E2E Tests
```
cd frontend
npm run dev
npx cypress open
```

---

## Running Tests Locally

```
cd backend && npm test
cd backend && npm run test:integration
cd frontend && npm test
```

---

## CI/CD (Sprint 5)

### Continuous Integration  
Workflow: `.github/workflows/ci.yml`

Runs automatically on every push or pull request. Includes:

1. Backend unit tests  
2. Backend integration tests (Testcontainers)  
3. Frontend unit tests  
4. Full Cypress E2E tests using Docker Compose  

### Continuous Deployment  
Workflow: `.github/workflows/deploy.yml`

Triggered on push to `main`. Steps:

1. SSH into VM  
2. Pull latest code  
3. Rebuild containers  
4. Restart services  
5. Health-check frontend  
6. Mark deployment successful  

---

## Deployment Instructions (Ubuntu VM)

Install Git, Docker, and Docker Compose. Then:

```
git clone https://github.com/your-username/our-shelves.git
cd our-shelves
nano .env
docker compose up -d
```

---

## System Architecture

```
Frontend (React, port 5173)
        │
        ▼
Backend (Express API, port 3000)
        │
        ▼
MySQL Database (3306)
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /books | Fetch all saved books |
| POST | /books | Add a new book |
| DELETE | /books/:id | Delete a book |
| GET | /books/search/:bookName | Search via Open Library API |

---

## Useful Commands

```
docker compose up --build
docker compose down
git pull
```

---

## License  
This project is for educational use as part of a student project at Green River College.