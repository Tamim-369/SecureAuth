"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const AllLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const getLogs = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("No auth token found");
      }

      const decodedToken = jwtDecode(authToken);
      const { role } = decodedToken;

      const response = await fetch("/api/logs/getLogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(
          data.message || "An error occurred while fetching logs"
        );
      }

      const sortedLogs =
        data.logs?.sort((a, b) => b._id.localeCompare(a._id)) || [];
      setLogs(sortedLogs);
      setError(null);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    getLogs(); // Fetch logs immediately on mount
    const interval = setInterval(getLogs, 5000); // Then every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const requestTypeIdentifier = (url) => {
    if (url?.includes("login")) return "Login";
    if (url?.includes("register")) return "Register";
    if (url?.includes("auth")) return "Auth";
    return "Other";
  };

  const typeColors = {
    API: "text-blue-500",
    Login: "text-green-500",
    Other: "text-red-500",
    Register: "text-purple-500",
    Auth: "text-yellow-500",
  };

  if (error) {
    return <div className="text-black">Loading ...</div>;
  }

  return (
    <div className="flex flex-col justify-start py-8 items-center h-[100dvh] overflow-y-auto bg-slate-950 text-white my-auto mx-auto">
      {logs.length > 0 ? (
        logs.map((log) => (
          <div
            className="flex w-11/12 mx-2 bg-slate-900 py-2 px-3 rounded-sm my-2 justify-between "
            key={log?._id}
          >
            <p>{log?.time}</p>
            <p>{log?.url}</p>
            <p className={typeColors[requestTypeIdentifier(log?.url)]}>
              {requestTypeIdentifier(log?.url)}
            </p>
          </div>
        ))
      ) : (
        <div>No logs available</div>
      )}
    </div>
  );
};

export default AllLogsPage;
