"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormError from "../../form-error";
import FormSuccess from "../../form-success";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const VerifyCode = ({ formData, responseToken }) => {
  const router = useRouter();
  const [codeData, setCodeData] = useState({
    code: "",
    email: formData.email,
  });
  const [codeLoading, setCodeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCodeChange = (e) => {
    setCodeData({ ...codeData, [e.target.name]: e.target.value });
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setCodeLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users/auth/verifyCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${responseToken}`,
        },
        body: JSON.stringify(codeData),
      });
      const data = await response.json();
      if (data.success) {
        console.log(data.role);
        localStorage.setItem(`authToken`, responseToken);
        setSuccess(data.message);
        const { role } = jwtDecode(localStorage.getItem("authToken"));
        if (role === "Admin") {
          router.push("/admin");
        } else if (role === "User") {
          router.push("/");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again.");
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleCodeSubmit} className="w-full">
        <div className="flex flex-col mb-5 justify-center items-center">
          <h1 className="text-center text-3xl font-bold">
            Enter verification code
          </h1>
        </div>
        <input
          type="number"
          className="bg-slate-900 text-white border-2 border-slate-800 transition-all p-3 rounded-md w-full focus:outline-none focus:border-primary"
          placeholder="000000"
          name="code"
          minLength={6}
          maxLength={6}
          required
          onChange={handleCodeChange}
        />
        <div className="flex justify-center items-center mt-2">
          <button
            type="submit"
            className="btn-primary flex justify-center items-center gap-2 w-full"
          >
            {codeLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M304 48a48 48 0 10-96 0 48 48 0 1096 0zm0 416a48 48 0 10-96 0 48 48 0 1096 0zM48 304a48 48 0 100-96 48 48 0 100 96zm464-48a48 48 0 10-96 0 48 48 0 1096 0zM142.9 437A48 48 0 1075 369.1a48 48 0 1067.9 67.9zm0-294.2A48 48 0 1075 75a48 48 0 1067.9 67.9zM369.1 437a48 48 0 1067.9-67.9 48 48 0 10-67.9 67.9z"></path>
                </svg>
                Verifying
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </>
  );
};

export default VerifyCode;
