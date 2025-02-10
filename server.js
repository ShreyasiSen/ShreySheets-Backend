import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import spreadsheetRouter from './routes/spreadsheetRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import geminiRouter from './routes/geminiRoute.js';

dotenv.config();
const app = express();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
        });
        console.log('Connected to the database');
    } catch (error) {
        console.log('Error connecting to the database');
    }
};

    const allowedOrigins = [
        'http://localhost:5173',
        'https://shrey-sheets-frontend.vercel.app',
        'http://shrey-sheets-frontend.vercel.app'
    ];

const corsOptions = { 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Origin not allowed by CORS: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ],
    credentials: true,
    maxAge: 86400 
};

app.use(cors(corsOptions));

app.use(express.json());
app.options('*', cors(corsOptions));
app.use('/api', userRoute);
app.use('/api', spreadsheetRouter);
app.use('/api', geminiRouter);

app.use(cookieParser());

app.listen(8000, () => {
    connect();
    console.log('Server is running on port 8000');
});


