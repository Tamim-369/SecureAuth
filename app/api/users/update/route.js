import { NextResponse } from "next/server";
import connectDB from "@/utils/db.js";
import User from "@/models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
export async function POST(request) {
  const { name, email, existingPassword, newPassword, role, _id } =
    await request.json();
  await connectDB();

  if (!name || !email || !existingPassword || !role) {
    return NextResponse.json({
      error: true,
      message: "Missing required fields",
    });
  }

  if (role !== "Admin" && role !== "User") {
    return NextResponse.json({
      error: true,
      message: "Invalid role",
    });
  }
  let token = null;
  try {
    const user = await User.findOne({ _id, role });
    if (!user) {
      return NextResponse.json({
        error: true,
        message: "User not found",
      });
    }

    const isMatch = await bcryptjs.compare(existingPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({
        error: true,
        message: "Invalid password",
      });
    }

    let updated = false;

    if (name !== user.name) {
      user.name = name;
      updated = true;
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return NextResponse.json({
          error: true,
          message: "Email already in use",
        });
      }
      user.email = email;
      token = jwt.sign({ email, role: "Admin" }, process.env.JWT_SECRET);
      updated = true;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({
          error: true,
          message: "New password must be at least 8 characters",
        });
      }
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;
      updated = true;
    }

    if (updated) {
      await user.save();
      if (token == null) {
        return NextResponse.json({
          success: true,
          message: "Changes saved successfully",
        });
      } else {
        return NextResponse.json({
          success: true,
          token: token,
          message: "Changes saved successfully",
        });
      }
    } else {
      return NextResponse.json({
        error: true,
        message: "No changes were made",
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({
      error: true,
      message: "Something went wrong. Cannot update the user information",
    });
  }
}
