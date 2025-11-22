import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { loginUser, authorizeUser, getCurrentUser } from "../controllers/authControllers";

const router = Router();

router.get("/login", loginUser)
router.get("/github/callback", authorizeUser);
router.get("/get-user", authenticateToken, getCurrentUser);

export default router;