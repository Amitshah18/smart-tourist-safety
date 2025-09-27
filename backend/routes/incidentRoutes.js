import express from "express";
import { getIncidents, reportIncident } from "../controllers/incidentController.js";
const router = express.Router();

router.get("/", getIncidents);
router.post("/", reportIncident);

export default router;
