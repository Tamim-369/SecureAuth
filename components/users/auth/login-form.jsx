"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import FormError from "../../form-error";
import FormSuccess from "../../form-success";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import VerifyCode from "./verify-code";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [codeSent, setCodeSent] = useState(false);
  const [responseToken, setResponseToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.message);
        setCodeSent(false);
      } else if (data.success) {
        setSuccess(data.message);
        toast.success(data.message);
        setResponseToken(data.token);
        setCodeSent(true);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const { role } = jwtDecode(authToken);
      if (role) {
        router.push(role == "Admin" ? "/admin" : "/");
      } else {
        router.push("/users/auth/login");
      }
    }
  }, []);

  return (
    <>
      {codeSent ? (
        <VerifyCode formData={formData} responseToken={responseToken} />
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col mb-5 justify-center items-center">
            <h1 className="text-center text-3xl font-bold">
              Log In to continue
            </h1>
            <p className="text-sm text-slate-800 mt-2">Welcome Back</p>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col justify-start items-start gap-2 mb-4">
              <label htmlFor="email" className="w-full">
                Your Email
              </label>
              <input
                type="email"
                className="bg-slate-900 border-2 border-slate-800 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
                placeholder="name@company.com"
                name="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col justify-start items-start gap-2 mb-4">
              <label htmlFor="password" className="w-full">
                Your Password
              </label>
              <input
                type="password"
                className="bg-slate-900 border-2 border-slate-800 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
                placeholder="******"
                name="password"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex w-full justify-between items-center">
            <button
              type="submit"
              className="btn-primary flex justify-center items-center gap-2 w-full"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M304 48a48 48 0 10-96 0 48 48 0 1096 0zm0 416a48 48 0 10-96 0 48 48 0 1096 0zM48 304a48 48 0 100-96 48 48 0 100 96zm464-48a48 48 0 10-96 0 48 48 0 1096 0zM142.9 437A48 48 0 1075 369.1a48 48 0 1067.9 67.9zm0-294.2A48 48 0 1075 75a48 48 0 1067.9 67.9zM369.1 437a48 48 0 1067.9-67.9 48 48 0 10-67.9 67.9z"></path>
                  </svg>
                  Logging In
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
        </form>
      )}
    </>
  );
};

export default LoginForm;
