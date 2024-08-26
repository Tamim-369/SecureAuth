import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { email, code } = await request.json();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: true, message: "User not found" });
    }

    if (user.verifyCode !== Number(code)) {
      return NextResponse.json({ error: true, message: "Invalid code" });
    }

    user.LogInVerified = true;
    user.verifyCode = null;
    await user.save();
    return NextResponse.json({ success: true, message: "Code verified" });
  } catch (error) {
    return NextResponse.json({ error: true, message: "Something went wrong" });
  }
}
