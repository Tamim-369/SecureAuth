import User from "@/models/userModel";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"; // Import bcrypt for password hashing

export async function POST(request) {
  const { name, email, password } = await request.json();

  // Validate input
  if (!name || !email || !password) {
    return NextResponse.json({
      error: true,
      message: "Missing required fields",
    });
  }

  if (password.length < 8) {
    return NextResponse.json({
      error: true,
      message: "Password must be at least 8 characters",
    });
  }

  await connectDB(); // Connect to the database

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        error: true,
        message: "Email doesn't exist",
      });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10); // 10 is the salt rounds

    // Update user with new name and hashed password
    await User.findOneAndUpdate(
      { email },
      { name, password: hashedPassword, verified: true }, // Update with hashed password
      {
        new: true, // Return the updated document
      }
    );

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error); // Log the error for debugging
    return NextResponse.json({
      error: true,
      message: "Something went wrong. Cannot update the user",
    });
  }
}
