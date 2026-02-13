import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // 🔥 NEVER returned unless explicitly selected
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving (Mongoose 9: no next callback)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

// 🔐 Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

export default model("User", userSchema);
