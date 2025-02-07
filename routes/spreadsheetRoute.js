import express from 'express';
import { createSheet, getSheet ,getUserSheets, updateSheet,deleteSheet} from '../controllers/sheetController.js';

const router = express.Router();
router.post('/spreadsheet/:userId', createSheet);
router.get('/spreadsheet/:id', getSheet);
router.get('/spreadsheet/user/getsheet/:id', getUserSheets);
router.put('/spreadsheet/:id', updateSheet);
router.delete('/spreadsheet/:id', deleteSheet);

export default router;