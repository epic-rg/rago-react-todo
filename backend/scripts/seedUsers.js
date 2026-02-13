/**
 * Seed script: creates sample admin and member in the database.
 * Run: npm run seed   (from the backend folder)
 * Make sure MongoDB is running and .env has MONGO_URI.
 */

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const SEED_USERS = [
  { name: "Admin User", email: "admin@example.com", password: "admin123", role: "admin" },
  { name: "Jane Member", email: "member@example.com", password: "member123", role: "member" },
];

async function seed() {
  try {
    await connectDB();

    for (const u of SEED_USERS) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log("Already exists:", u.email);
        continue;
      }
      await User.create(u);
      console.log("Created:", u.role, "—", u.email);
    }

    console.log("\n--- Login details ---\n");
    console.log("  Admin:  email: admin@example.com   password: admin123");
    console.log("  Member: email: member@example.com  password: member123");
    console.log("\nUse these on the app login page.\n");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
