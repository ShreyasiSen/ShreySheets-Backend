import express from 'express';
import { createSheet, getSheet } from '../controllers/sheetController.js';

const router = express.Router();
router.post('/spreadsheet/:userId', createSheet);
router.get('/spreadsheet/:id', getSheet);

export default router;