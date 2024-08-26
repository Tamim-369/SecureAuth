import { NextResponse } from "next/server";
import connectDB from "@/utils/db.js";
import User from "@/models/userModel.js";
import Log from "@/models/logsModel";
export async function POST(request) {
  const { time, url, headers, method } = await request.json();
  await connectDB();
  const newLog = new Log({
    time,
    url,
    headers,
    method,
  });
  await newLog.save();
  return NextResponse.json({ success: true });
}
