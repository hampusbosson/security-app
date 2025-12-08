import express from "express";
import { runScan } from "../controllers/scanControllers";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.post("/run/:repositoryId", authenticateToken, runScan);

export default router;