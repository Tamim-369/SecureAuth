import { NextResponse, userAgent } from "next/server";
import { logSaver } from "./utils/logSaver";

export default async function middleware(request) {
  const time = Date.now();
  const timeObj = new Date(time);

  const dateTimeStr = timeObj.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [dateStr, timeStr] = dateTimeStr.split(", ");

  const snedTime = `Date:${dateStr} Time:${timeStr}`;
  const logData = {
    time: snedTime,
    url: request.url,
    // headers: userAgent(request),
    // method: request.method,
  };
  if (
    logData.url !== `${process.env.SITEURL}/api/logs/getLogs` &&
    logData.url !== `${process.env.SITEURL}/api/logs`
  ) {
    logSaver(logData);
    console.log(logData);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/users/:path*"],
};
