import express from "express";
import { triggerSOS } from "../controllers/sosController.js";

const router = express.Router();

router.post("/", triggerSOS);

export default router;
