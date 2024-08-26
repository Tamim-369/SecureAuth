import User from "@/models/userModel";
import connectDB from "@/utils/db";
import { sendEmail } from "@/utils/mailSender";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, role } = await request.json();
  if (role !== "Admin") {
    return NextResponse.json({
      error: true,
      message: "You don't have permission to access this resource",
    });
  }
  if (!email) {
    return NextResponse.json({
      error: true,
      message: "Invalid Data",
    });
  }
  await connectDB();
  try {
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({
        error: true,
        message: "User already exists",
      });
    }
    const newUser = new User({
      name: "",
      email,
    });
    await newUser.save();
    sendEmail(
      email,
      "Create account",
      `Click <a href="${process.env.SITEURL}/users/auth/continue/${newUser._id}">here</a> to continue create your account.`
    );
    return NextResponse.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: true,
      message: "Something went wrong",
    });
  }
}
