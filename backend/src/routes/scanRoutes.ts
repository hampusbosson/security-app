import express from "express";
import { runScan, stopScan } from "../controllers/scanControllers";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.post("/run/:repositoryId", authenticateToken, runScan);
router.post("/stop/:scanId", authenticateToken, stopScan); 

export default router;