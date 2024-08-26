"use client";

import CardWrapper from "@/components/card-wrapper";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserPage = () => {
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      console.log(formData);

      if (data.success) {
        toast.success("You are registered successfully");
        router.push("/users/auth/login");
      } else if (data.error) {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async (id) => {
      if (!id) return;
      try {
        const response = await fetch(`/api/users/userById/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUser(data.user);
        setFormData({
          ...formData,
          email: data.user.email,
        });
        if (data.error) {
          toast.error("Something went wrong");
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUser(id);
  }, [id]);

  return (
    <CardWrapper>
      <h1 className=" text-white text-2xl font-semibold w-full text-center mb-3">
        Enter name and password
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full text-white">
          <div className="flex flex-col justify-start items-start gap-2 mb-4">
            <label htmlFor="name" className="w-full">
              Your Name
            </label>
            <input
              type="name"
              className="bg-slate-900 border-2 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
              placeholder="John Doe"
              name="name"
              required
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2 mb-4">
            <label htmlFor="password" className="w-full">
              Create Password
            </label>
            <input
              type="password"
              className="bg-slate-900 border-2 transition-all p-2 rounded-md w-full focus:outline-none focus:border-primary"
              placeholder="******"
              name="password"
              minLength={8}
              required
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-center items-center">
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
                  Registering
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </div>
      </form>
    </CardWrapper>
  );
};

export default UserPage;
