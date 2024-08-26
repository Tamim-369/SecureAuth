"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

const UserSettings = () => {
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    existingPassword: "",
    newPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.existingPassword) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    const authToken = localStorage.getItem("authToken");
    const { role } = jwtDecode(authToken);
    if (role !== "Admin" && formData.role === "Admin") {
      setError("Admin token not found. Please log in again.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      _id: formData._id,
      name: formData.name,
      email: formData.email,
      existingPassword: formData.existingPassword,
      role: formData.role,
    };

    if (formData.newPassword) {
      dataToSend.newPassword = formData.newPassword;
    }
    try {
      const response = await fetch(`/api/users/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.message);
      }
      if (data.success) {
        setSuccess(data.message);
        if (formData.role === "Admin") {
          if (data.token) {
            const token = data.token;
            localStorage.setItem("authToken", token);
            setFormData({
              _id: "",
              name: "",
              email: "",
              existingPassword: "",
              newPassword: "",
              role: "",
            });
          }
        }
      }
      console.log("Sending data:", dataToSend);
      console.log("Response:", data);
    } catch (error) {
      setError("An error occurred while updating user information");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (localStorage.getItem("authToken") === null) {
      router.push("/admin/auth/login");
      return;
    }
    const { role, email } = jwtDecode(authToken); // Move this inside useEffect
    if (window.location.pathname === "/admin/settings") {
      if (role !== "Admin") {
        setError("Invalid role");
        router.push("/admin/auth/login");
        return;
      }
    } else if (window.location.pathname === "/settings") {
      if (role !== "User") {
        setError("Invalid role");
        router.push("/admin/auth/login");
        return;
      }
    }

    const getUserData = async (email, role) => {
      try {
        const response = await fetch(`/api/users/${email}`);
        const data = await response.json();
        if (data.error) {
          setError(data.message);
        } else if (data.success) {
          setFormData({ ...data.user, role: role });
        }
      } catch (error) {
        setError("Failed to fetch user data");
      }
    };

    if (window.location.pathname === "/admin/settings") {
      if (role === "Admin") {
        getUserData(email, "Admin");
      } else {
        setError("Admin token not found");
      }
    } else {
      if (role === "User") {
        getUserData(email, "User");
      } else {
        setError("User token not found");
      }
    }
  }, [router]); // Add router to the dependency array

  return (
    <div className="mx-auto text-white my-auto w-full flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col mb-5 justify-center items-center">
          <h1 className="text-center text-3xl font-bold">Update information</h1>
          <p className="text-sm text-slate-800 mt-2">Welcome Back</p>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col justify-start items-start gap-2 mb-4">
            <label htmlFor="name" className="w-full">
              Your Name
            </label>
            <input
              type="text"
              className="bg-slate-900 border-2 border-slate-700 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
              placeholder="John Doe"
              name="name"
              id="name"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          {formData.role == "Admin" && (
            <div
              className={`flex flex-col justify-start items-start gap-2 mb-4`}
            >
              <label htmlFor="email" className="w-full">
                Your Email
              </label>
              <input
                type="email"
                className="bg-slate-900 border-2 border-slate-700 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
                placeholder="name@company.com"
                name="email"
                id="email"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
          )}

          <div className="flex flex-col justify-start items-start gap-2 mb-4">
            <label htmlFor="existingPassword" className="w-full">
              Password
            </label>
            <input
              type="password"
              className="bg-slate-900 border-2 border-slate-700 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
              placeholder="******"
              name="existingPassword"
              id="existingPassword"
              minLength={8}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2 mb-4">
            <label htmlFor="newPassword" className="w-full">
              New Password
            </label>
            <input
              type="password"
              className="bg-slate-900 border-2 border-slate-700 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
              placeholder="******"
              name="newPassword"
              id="newPassword"
              minLength={8}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <Link
            href={`${formData.role == "Admin" ? "/admin" : "/"}`}
            className="btn-secondary flex justify-center items-center gap-2 "
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn-primary flex justify-center items-center gap-2"
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
                Updating
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </div>
  );
};

export default UserSettings;
