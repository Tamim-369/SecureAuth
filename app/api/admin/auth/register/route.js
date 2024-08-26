import { NextResponse } from "next/server";
import User from "@/models/userModel.js";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/mailSender.js";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db.js";
export async function POST(request) {
  // connecting to database
  await connectDB();
  const { name, email, password, role } = await request.json();
  try {
    // validating form data
    if (role != "Admin") {
      return NextResponse.json({
        error: true,
        message: "You don't deserve to send request with this role",
      });
    }
    // checking if the data is empty
    if (name == "" || email == "" || password == "") {
      return NextResponse.json({
        error: true,
        message: "Fill all fields to continue",
      });
    }

    // checking if the password is too short
    if (password.length < 8) {
      return NextResponse.json({
        error: true,
        message: "Password must be at least 8 characters",
      });
    }

    // checking if the user email already exists
    const existUserEmail = await User.findOne({ email });
    if (existUserEmail) {
      return NextResponse.json({
        error: true,
        message: "Email already exists",
      });
    }
    // checking if the user name already exists if you need to use it
    // const existUserName = await User.findOne({ name });
    // if (existUserName) {
    //   return NextResponse.json({ error: true, message: "Name already exists" });
    // }

    // sending email to the user
    const token = await jwt.sign({ email, role }, process.env.JWT_SECRET);
    await sendEmail(
      email,
      "Verify Your Email",
      `<h1>Verify your email</h1>
       <p>Please verify your email by clicking on this link:</p>
       <a href="${process.env.SITEURL}/admin/auth/verify/${token}">Click here to verify</a>`
    );
    // hashing the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // creating a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verifyToken: token,
      role,
    });

    // saving the user
    const savedUser = await newUser.save();
    if (!savedUser) {
      return NextResponse.json({
        error: true,
        message: "Something went wrong. Please try again",
      });
    }
    return NextResponse.json({
      success: true,
      user: savedUser,
      message: "Register Successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({
      error: true,
      message: "An error occurred during registration. Please try again.",
    });
  }
}
