import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// DB
connectDB();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Error Fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
