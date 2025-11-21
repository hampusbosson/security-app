import express from "express";
import { installRedirect, installationCallback } from "../controllers/githubControllers";

const router = express.Router();

// send user to GitHub App installation page
router.get("/install", installRedirect);
// GitHub redirects back here after installation
router.get("/callback", installationCallback);

export default router;