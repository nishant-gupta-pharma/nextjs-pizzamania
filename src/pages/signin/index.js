import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { z } from "zod";

// Define Zod schema
const SignInSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  geolocation: z.string().min(1, "Address is required"),
});

function SignIn() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validation = SignInSchema.safeParse(credentials);

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const response = await fetch("api/userSignIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation,
      }),
    });

    const res = await response.json();
    if (res.success) {
      localStorage.setItem("token", res.authToken);
      localStorage.setItem("userEmail", credentials.email);
      localStorage.setItem("isAdmin", false);
      router.push("/login");
    } else {
      alert("There is something wrong. Please try again");
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        height: "90vh",
        backgroundImage:
          'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        backgroundSize: "cover",
      }}
      className="flex justify-center items-center"
    >
      <div className="container w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 dark:bg-gray-900 dark:text-gray-100 border-gradient rounded-lg shadow-2xl px-8 pt-6 pb-8 mb-4"
        >
          {["name", "email", "password", "geolocation"].map((field) => (
            <div className="mb-4" key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 capitalize"
              >
                {field === "geolocation" ? "Address" : field}
              </label>
              <input
                placeholder={`Enter your ${
                  field === "geolocation" ? "address" : field
                }`}
                name={field}
                type={
                  field === "email"
                    ? "email"
                    : field === "password"
                    ? "password"
                    : "text"
                }
                onChange={handleChange}
                value={credentials[field]}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 focus:border-indigo-700 text-gray-700 dark:text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors[field] && (
                <p className="text-red-500 text-sm italic mt-1">
                  {errors[field]}
                </p>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between"> </div>
          <button
            type="submit"
            className="border font-bold text-gray-900 dark:text-gray-100 dark:border-gray-400 border-gray-900 rounded p-2 mr-2 hover:bg-gradient-to-r from-indigo-700 via-violet-700 to-orange-700 hover:text-gray-100"
          >
            Sign In
          </button>
          <Link href="/login" style={{ all: "unset" }}>
            <button className="border text-gray-900 dark:text-gray-100 font-bold dark:border-gray-400 border-gray-900 rounded mr-2 p-2 hover:bg-gradient-to-r from-indigo-700 via-violet-700 to-orange-700 hover:text-gray-100">
              Already a user?
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
