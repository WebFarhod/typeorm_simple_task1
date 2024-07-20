import { Router } from "express";
import { login, protectedRoute } from "../controllers/authController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", login);
router.get("/protected", authenticateJWT, protectedRoute);

export default router;
