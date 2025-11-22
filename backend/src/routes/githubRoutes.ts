import express from "express";
import { handleInstallation, syncUserRepositories } from "../controllers/githubControllers";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/install", authenticateToken, handleInstallation);
router.get("/sync-repos", authenticateToken, syncUserRepositories);

export default router;