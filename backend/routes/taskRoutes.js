import express from "express";
import {
  createTask,
  getAllTasks,
  getTasksByUser,
  updateTask,
  deleteTask,
  getMyTasks,
  completeTask,
} from "../controllers/taskController.js";

import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ========== ADMIN ========== */
router.post("/", verifyToken, authorizeRoles("admin"), createTask);
router.get("/all", verifyToken, authorizeRoles("admin"), getAllTasks);
router.get("/user/:userId", verifyToken, authorizeRoles("admin"), getTasksByUser);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateTask);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteTask);

/* ========== MEMBER ========== */
router.get("/my", verifyToken, authorizeRoles("member"), getMyTasks);
router.patch("/:id/complete", verifyToken, authorizeRoles("member"), completeTask);

export default router;
