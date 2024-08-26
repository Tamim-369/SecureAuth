"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const VerifyPage = () => {
  const params = useParams();
  const token = params?.token;
  const [verificationStatus, setVerificationStatus] = useState("Verifying...");
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setVerificationStatus("No token provided");
        return;
      }

      try {
        const { email } = jwtDecode(token);
        if (!email) {
          setVerificationStatus("Invalid token");
          return;
        }

        const response = await fetch("/api/admin/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, token, role: "Admin" }),
        });

        const data = await response.json();

        if (data.success) {
          setVerificationStatus("Verified successfully");
          toast.success(data.message);
          setTimeout(() => router.push("/admin/auth/login"), 2000);
        } else {
          setVerificationStatus(data.message || "Verification failed");
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("An error occurred during verification");
        toast.error("Verification failed. Please try again.");
      }
    };

    verifyUser();
  }, [token, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Account Verification</h1>
        <p>{verificationStatus}</p>
      </div>
    </div>
  );
};

export default VerifyPage;
