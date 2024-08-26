"use client";

import React, { useEffect, useState } from "react";
import BackButton from "./back-button";
import Link from "next/link";
import FormError from "../../form-error";
import FormSuccess from "../../form-success";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AdminRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Admin",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/admin/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.error) {
      setError(data.message);
      setLoading(false);
    }
    if (data.success) {
      setSuccess(data.message);
      setLoading(false);
      setFormData({ name: "", email: "", password: "", role: "Admin" });
      toast.success(
        "Your account is created. We have sent a verification link to your email please click that to verify your account."
      );
      router.push("/users/auth/login");
    }
    // console.log(data);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && token !== "") {
      router.push("/admin");
    }
  }, []);
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col mb-5 justify-center items-center">
        <h1 className="text-center  text-3xl font-bold">Create an account</h1>
        <p className="text-sm text-slate-800 mt-2">Welcome Back</p>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col justify-start items-start gap-2 mb-4">
          <label htmlFor="name" className="w-full">
            Your Name
          </label>
          <input
            type="text"
            className="bg-slate-100 border-2 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
            placeholder="John Doe"
            name="name"
            required
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col justify-start items-start gap-2 mb-4">
          <label htmlFor="email" className="w-full">
            Your Email
          </label>
          <input
            type="email"
            className="bg-slate-100 border-2 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
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
            className="bg-slate-100 border-2 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
            placeholder="******"
            name="password"
            required
            onChange={handleChange}
            minLength={8}
          />
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        {/* <BackButton>
          <button className="btn-secondary">Back</button>
        </BackButton> */}
        <button
          disabled={loading}
          type="submit"
          className="btn-primary flex justify-center items-center gap-2 w-full"
        >
          {loading ? (
            <>
              {/* loading icon */}
              <svg
                className="h-5 w-5 animate-spin fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M304 48a48 48 0 10-96 0 48 48 0 1096 0zm0 416a48 48 0 10-96 0 48 48 0 1096 0zM48 304a48 48 0 100-96 48 48 0 100 96zm464-48a48 48 0 10-96 0 48 48 0 1096 0zM142.9 437A48 48 0 1075 369.1a48 48 0 1067.9 67.9zm0-294.2A48 48 0 1075 75a48 48 0 1067.9 67.9zM369.1 437a48 48 0 1067.9-67.9 48 48 0 10-67.9 67.9z"></path>
              </svg>
              Creating account
            </>
          ) : (
            "Create admin account"
          )}
        </button>
      </div>
      <FormError message={error} />
      {/* <FormSuccess message={success} /> */}

      <div className=" mt-5 flex justify-center items-center text-sm">
        <p>
          Already have an account?{" "}
          <Link href="/admin/auth/login" className="text-primary">
            Log In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default AdminRegisterForm;
