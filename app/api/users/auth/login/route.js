import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utils/mailSender";
import connectDB from "@/utils/db";

export async function POST(request) {
  await connectDB();
  try {
    const { email, password } = await request.json();
    const user = await User.findOne({ email }).lean().exec();

    if (
      !user ||
      (user.role !== "Admin" && user.role !== "User") ||
      !user.verified
    ) {
      const errorMessage = user
        ? user.verified
          ? "Invalid role"
          : "Please verify your account"
        : "User not found";
      return NextResponse.json(
        {
          error: true,
          message: errorMessage,
        },
        { status: user ? (user.verified ? 403 : 403) : 404 } // Set appropriate status code based on error
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid Password",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET);
    const sixDigitCode = Math.floor(100000 + Math.random() * 900000);

    // Update user with new verification code
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { verifyCode: sixDigitCode, LogInVerified: false } },
      { new: true, runValidators: true } // Return updated document
    );

    if (!updatedUser) {
      throw new Error("Failed to update user with verification code");
    }

    // Send email after successful save
    try {
      await sendEmail(
        updatedUser.email,
        "Verification Code",
        `Your verification code is ${sixDigitCode}`
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      throw new Error("Failed to send verification code email");
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "A verification code is sent to your email. Please verify your account",
        token,
        role: user.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    if (error.name === "MongoError" && error.message.includes("timed out")) {
      return NextResponse.json(
        {
          error: true,
          message: "Cannot find user",
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        {
          error: true,
          message: error.message || "An error occurred during login",
        },
        { status: 500 }
      );
    }
  }
}
