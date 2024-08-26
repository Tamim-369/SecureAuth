import User from "@/models/userModel";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();
  try {
    const { email, token, role } = await request.json();
    if (!email || !token || !role) {
      return NextResponse.json({ error: true, message: "Invalid Data" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: true, message: "admin not found" });
    }

    if (user.verified) {
      return NextResponse.json({
        error: true,
        message: "admin already verified",
      });
    }

    if (user.verifyToken !== token) {
      return NextResponse.json({
        error: true,
        message: "Invalid token",
      });
    }

    user.verified = true;
    user.verifyToken = "";
    await user.save();
    return NextResponse.json({
      success: true,
      message: "email verified",
      token,
    });
  } catch (error) {
    return NextResponse.json({ error: true, message: "Failed to verify" });
  }
}
