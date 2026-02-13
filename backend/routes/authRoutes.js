import express from "express";
import {
  registerAdmin,
  createMember,
  login,
} from "../controllers/authController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login", login);

router.post("/create-member", verifyToken, isAdmin, createMember);

export default router;
