"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddUsersPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const decodedToken = jwtDecode(authToken);
        const { role } = decodedToken;

        if (role === "Admin") {
          setFormData((prevData) => ({ ...prevData, role: "Admin" }));
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) {
        toast.error("Something went wrong");
        return;
      }
      toast.success(
        "We have sent a link to the user's email so that they can enter a password and create their account."
      );
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center gap-2"
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-col justify-start items-start gap-2 mb-4">
            <label htmlFor="email" className="w-full">
              Enter Email
            </label>
            <input
              type="email"
              className="bg-slate-100 border-2 transition-all p-3 rounded-md w-full focus:outline-none focus:border-primary"
              placeholder="name@company.com"
              name="email"
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
                  Adding user
                </>
              ) : (
                "Add User"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUsersPage;
