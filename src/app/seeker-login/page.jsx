"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SeekerLogin = () => {
  const router = useRouter();
  const [hidePassword, setHidePassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailOrPhone || !formData.password) {
      alert("Please enter email/phone and password");
      return;
    }

    try {
      const res = await fetch("/api/seeker/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Token is set via HTTP-only cookie by server — no need to set it here
        window.dispatchEvent(new Event("userUpdated"));
        alert("Login successful! Welcome " + data.seeker.name);
        router.push("/jobs");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Something went wrong");
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <Navbar />
       <div style={{ paddingTop: "120px" }}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="text-center w-100" style={{ maxWidth: "500px", padding: "40px", borderRadius: "12px" }}>
          <h6 className="text-primary">Welcome back!</h6>
          <h2 className="fw-bold mb-4" style={{ fontSize: "36px", color: "#05264e" }}>Seeker Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label fw-semibold" style={{ fontSize: "14px" }}>
                Email or Phone<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter email or phone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 text-start position-relative">
              <label className="form-label fw-semibold" style={{ fontSize: "14px" }}>
                Password<span className="text-danger"> *</span>
              </label>
              <input
                type={hidePassword ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="Password"
                name="password"
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
                onClick={() => setHidePassword(!hidePassword)}
              >
                {hidePassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <div className="text-end mb-4">
              <a href="/seeker/forgot-password" className="text-muted" style={{ fontSize: "14px", textDecoration: "none" }}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn custom-login-btn btn-lg w-100 text-white fw-bold">
              Login
            </button>
          </form>

          <p className="mt-4 text-muted" style={{ fontSize: "14px" }}>
            Don’t have a seeker account?{" "}
            <Link href="/seeker-login/sign-up" className="text-primary fw-semibold">
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

export default SeekerLogin;
