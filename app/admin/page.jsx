"use client";

import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authToken, setAuthToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/admin/auth/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const { role } = decodedToken;
      if (role == "Admin") {
        setIsAdmin(true);
        router.push("/admin");
        return;
      } else {
        router.push("/users/auth/login");
      }
      setAuthToken(token);
      setIsAdmin(true);
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("authToken");
      router.push("/users/auth/login");
    }
  }, [router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <main
      className={` text-white flex h-full flex-col items-center justify-center `}
    >
      <div className={`space-y-6`}>
        <h1 className={`text-6xl font-semibold  drop-shadow-md`}>
          AdminWrapper
        </h1>
        <p>
          This is Admin Page click add user to add new user and view logs to
          view logs
        </p>
        <div className="flex gap-2">
          <Link href={"/admin/users/addUsers"} className="btn-primary">
            Add Users
          </Link>
          <Link href={"/admin/logs"} className="btn-secondary">
            View Logs
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              router.push("/users/auth/login");
            }}
            className="btn-secondary"
          >
            Log Out
          </button>
        </div>
      </div>
    </main>
  );
}
