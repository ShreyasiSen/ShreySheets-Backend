import { geminiController } from "../controllers/geminiController.js";
import express from "express";

const router = express.Router();

router.post("/gemini", geminiController);

export default router;