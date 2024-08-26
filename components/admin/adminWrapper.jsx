"use client";

import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminWrapper({ children }) {
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
    <div className="w-full h-full flex sm:flex-row flex-col">
      <div className="w-full sm:w-3/12 bg-slate-900 sm:min-h-full flex flex-row sm:flex-col p-2 gap-2">
        <Link href="/admin" className="btn-secondary text-center border-none">
          Home
        </Link>
        <Link
          href="/admin/settings"
          className="btn-secondary text-center border-none"
        >
          Settings
        </Link>
        <Link
          href="/admin/logs"
          className="btn-secondary text-center border-none"
        >
          Logs
        </Link>
        <Link
          href="/admin/users/addUsers"
          className="btn-secondary text-center border-none"
        >
          Add Users
        </Link>
      </div>
      <div className="w-full sm:w-9/12 h-full bg-slate-950">{children}</div>
    </div>
  );
}
