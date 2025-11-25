import express from "express";
import { handleInstallation, syncUserRepositories, getInstallUrl } from "../controllers/githubControllers";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/install", handleInstallation);
router.get("/install-url", authenticateToken, getInstallUrl);
router.get("/sync-repos", authenticateToken, syncUserRepositories);

export default router;