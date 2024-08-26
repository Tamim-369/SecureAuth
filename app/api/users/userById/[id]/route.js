import { NextResponse } from "next/server";
import connectDB from "@/utils/db.js";
import User from "@/models/userModel.js";
export async function GET(request, context) {
  const { params } = context;
  const id = params.id;
  await connectDB();
  try {
    const user = await User.findById(id);
    if (!user)
      return NextResponse.json({
        error: true,
        message: "User not found",
      });

    return NextResponse.json({
      success: true,
      user,
      message: "user found successfully",
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "Something went wrong. Cannot get the user",
    });
  }
}
