import express from "express";
import {
  registerAdmin,
  createMember,
  login,
  getMe,
  getMembers,
} from "../controllers/authController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.get("/me", verifyToken, getMe);

router.post("/create-member", verifyToken, isAdmin, createMember);
router.get("/members", verifyToken, isAdmin, getMembers);

export default router;
