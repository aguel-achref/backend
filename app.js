import express from 'express';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import cors from 'cors';
import banksRoutes from './routes/bank.js';
import beneficiaryRoutes from './routes/beneficiary.js';
import settingsRoutes from './routes/settings.js';
import transferRoutes from './routes/transfer.js';

dotenv.config();

const app = express();

/* =========================
   Middleware
========================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* =========================
   MySQL Connection Pool
========================= */

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

/* =========================
   MySQL Connection Test
========================= */

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL database');
        connection.release();
    }
});

/* =========================
   MySQL Keep Alive
========================= */

setInterval(() => {
    db.query('SELECT 1', (err) => {
        if (err) {
            console.error('Keep-alive ping failed:', err.message);
        }
    });
}, 30000);

/* =========================
   Routes
========================= */

app.use('/api/banks', banksRoutes);
app.use('/api/beneficiary', beneficiaryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/transfer', transferRoutes);


/* =========================
   Health Check
========================= */

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Leo Minor API is running'
    });
});

/* =========================
   Base Route
========================= */

app.get('/', (req, res) => {
    res.send('Welcome to Leo Minor API');
});

/* =========================
   404 Handler
========================= */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

/* =========================
   Error Handler
========================= */

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

/* =========================
   Start Server
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});