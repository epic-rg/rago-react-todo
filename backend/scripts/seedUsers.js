/**
 * Seed script: creates/updates demo admin + demo member in the database.
 * Run: npm run seed   (from the backend folder)
 * Make sure MongoDB is running and .env has MONGO_URI.
 */

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DEMO_ADMIN = {
  name: "Demo Admin",
  email: "demo.admin@example.com",
  password: "demoadmin123",
  role: "admin",
};

const DEMO_MEMBERS = [
  {
    name: "Demo Member",
    email: "demo.member@example.com",
    password: "demomember123",
    role: "member",
  },
];

async function createOrUpdateUser({ name, email, password, role, managedBy = null }) {
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ name, email, password, role, managedBy });
    await user.save();
    console.log("Created:", role, "—", email);
    return user;
  }

  user.name = name;
  user.role = role;
  user.managedBy = managedBy;
  user.password = password;
  await user.save();
  console.log("Updated:", role, "—", email);
  return user;
}

async function seed() {
  try {
    await connectDB();

    const admin = await createOrUpdateUser({ ...DEMO_ADMIN, managedBy: null });

    for (const member of DEMO_MEMBERS) {
      await createOrUpdateUser({
        ...member,
        managedBy: admin._id,
      });
    }

    console.log("\n--- Login details ---\n");
    console.log("  Admin:  email: demo.admin@example.com   password: demoadmin123");
    console.log("  Member: email: demo.member@example.com  password: demomember123");
    console.log("\nUse these on the app login page.\n");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
