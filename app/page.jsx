"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      router.push("/users/auth/login");
    }
  }, []);
  return (
    <main
      className={`flex bg-slate-950 text-white h-full flex-col items-center justify-center `}
    >
      <div className={`space-y-6`}>
        <h1 className={`text-6xl font-semibold  drop-shadow-md`}>Auth</h1>
        <p className={`  text-lg`}>
          User authentication and authorization system
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              router.push("/users/auth/login");
            }}
            className="btn-secondary"
          >
            Log out
          </button>
          <Link href={"/settings"} className="btn-secondary">
            Settings
          </Link>
        </div>
      </div>
    </main>
  );
}
