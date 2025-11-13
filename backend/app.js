import express from 'express';
import dotenv from 'dotenv';
import db from './db.js';
import router from './router/router.js';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

const app = express();
const HOST = process.env.HOST || 'localhost';

app.use(cors({
    origin: [
      `http://${HOST}:5173`
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('Welcome to Our Shelves API!'));
app.use('/', router);

app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books');
    res.json({ message: 'Database connected', books: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const startServer = async () => {
  try {
    await db.getConnection();
    console.log("Database connected successfully");
    
    app.listen(PORT, () => console.log(`Server running at http://${HOST}:${PORT}`));
    
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1);
  }
};

startServer();