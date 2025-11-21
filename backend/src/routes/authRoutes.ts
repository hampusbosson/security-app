import { Router } from "express";
import { loginUser, authorizeUser } from "../controllers/authControllers";

const router = Router();

router.get("/login", loginUser)
router.get("/github/callback", authorizeUser);

export default router;