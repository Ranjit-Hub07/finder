"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

const RecruiterLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/recruiter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ REQUIRED for cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ Fetch authenticated user
      const profileRes = await fetch("/api/auth/check", {
        method: "GET",
        credentials: "include",
      });

      if (!profileRes.ok) {
        alert("Failed to fetch profile");
        return;
      }

      const profileData = await profileRes.json();

      const userWithRole = {
        ...profileData.user,
        role: "recruiter",
      };

      localStorage.setItem("loggedInUser", JSON.stringify(userWithRole));
      window.dispatchEvent(new Event("userUpdated"));

      alert("Login successful! Welcome " + profileData.user.full_name);
      router.push("/overview");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "120px" }}>
        <div className="container d-flex justify-content-center align-items-center vh-100">
          <div
            className="text-center w-100"
            style={{ maxWidth: "500px", padding: "40px", borderRadius: "12px" }}
          >
            <h6 className="text-primary">Welcome back!</h6>
            <h2 className="fw-bold mb-4" style={{ fontSize: "36px", color: "#05264e" }}>
              Recruiter Login
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label fw-semibold" style={{ fontSize: "14px" }}>
                  Email or Phone<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 text-start position-relative">
                <label className="form-label fw-semibold" style={{ fontSize: "14px" }}>
                  Password<span className="text-danger"> *</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="position-absolute"
                  style={{
                    right: "15px",
                    top: "70%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#05264e",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className="text-end mb-4">
                <Link
                  href="/recruiter/forgot-password"
                  className="text-muted"
                  style={{ fontSize: "14px", textDecoration: "none" }}
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn custom-login-btn btn-lg w-100 text-white fw-bold"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-4 text-muted" style={{ fontSize: "14px" }}>
              Don’t have a seeker account?{" "}
              <Link href="/recruiter-login/sign-up" className="text-primary fw-semibold">
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .custom-login-btn {
          background-color: #05264e;
          padding: 14px 0;
          font-size: 16px;
          border: none;
        }
        .custom-login-btn:hover {
          background-color: #4f46e5;
        }
      `}</style>

      <style jsx global>{`
        *:not(input):not(textarea):not(select) {
          caret-color: transparent !important;
        }

        input,
        textarea,
        select {
          caret-color: auto !important;
        }
      `}</style>
    </>
  );
};

export default RecruiterLogin;
