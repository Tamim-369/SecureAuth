import Log from "@/models/logsModel";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { role } = await request.json();

    if (role !== "Admin") {
      return NextResponse.json(
        {
          error: true,
          message: "You don't have permission to access this resource",
        },
        { status: 403 }
      );
    }

    await connectDB();
    const logs = await Log.find({});

    return NextResponse.json({ logs, success: true });
  } catch (error) {
    console.error("Error in POST /api/logs/getLogs:", error);
    return NextResponse.json(
      {
        error: true,
        message: "An error occurred while fetching logs",
      },
      { status: 500 }
    );
  }
}
