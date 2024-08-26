import { NextResponse } from "next/server";
import connectDB from "@/utils/db.js";
import User from "@/models/userModel.js";
export async function GET(request) {
  await connectDB();
  try {
    const users = await User.find({});
    if (!users)
      return NextResponse.json({
        error: true,
        message: "User not found",
      });

    return NextResponse.json({
      success: true,
      users,
      message: "users found successfully",
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "Something went wrong. Cannot get the users",
    });
  }
}
