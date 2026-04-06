import express from "express";
import {
  getLatestRepositoryScan,
  getScanById,
  runScan,
  stopScan,
} from "../controllers/scanControllers";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/repository/:repositoryId/latest", authenticateToken, getLatestRepositoryScan);
router.get("/:scanId", authenticateToken, getScanById);
router.post("/run/:repositoryId", authenticateToken, runScan);
router.post("/stop/:scanId", authenticateToken, stopScan); 

export default router;
