import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import spreadsheetRouter from './routes/spreadsheetRoute.js';

dotenv.config();
const app = express();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');
    } catch (error) {
        console.log('Error connecting to the database');
    }
};

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(express.json());
app.use('/api', userRoute);
app.use('/api', spreadsheetRouter);

app.listen(8000, () => {
    connect();
    console.log('Server is running on port 8000');
});


