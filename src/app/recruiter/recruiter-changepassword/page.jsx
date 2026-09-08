"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/recruiter/changepassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const text = await res.text(); // Read raw response
    let data;

    try {
      data = text ? JSON.parse(text) : {}; // Only parse if text exists
    } catch (jsonError) {
      console.error("JSON parsing failed:", jsonError, "\nResponse text:", text);
      alert("Server error: Could not parse response.");
      return;
    }

    if (res.ok) {
      alert(data.message || "Password changed successfully.");
    } else {
      alert(data.message || "Password change failed.");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Something went wrong. See console for details.");
  }
};

  return (
    <>
      <Navbar />
      <Head>
        <title>Change Password</title>
        <meta name="description" content="Change your password" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ paddingTop: "100px" }}>
        <div className="container vh-100 d-flex justify-content-center align-items-center">
          <div className="card p-4" style={{ width: "500px", border: "none" }}>
            <h3
              className="text-center mb-4"
              style={{ color: "#05264e", fontSize: "36px", fontWeight: "bold" }}
            >
              Recruiter Change Password
            </h3>
            <form onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="mb-3 position-relative">
                <label className="form-label" style={{ color: "#05264e", fontSize: "15px" }}>
                  Current Password<span className="text-danger"> *</span>
                </label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="form-control"
                  style={{ height: "50px", fontSize: "15px", color: "#343a40" }}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "15px",
                    color: "#05264e",
                  }}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEye/> : <FaEyeSlash  />}
                </span>
              </div>

              {/* New Password */}
              <div className="mb-3 position-relative">
                <label className="form-label" style={{ color: "#05264e", fontSize: "15px" }}>
                  New Password<span className="text-danger"> *</span>
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control"
                  style={{ height: "50px", fontSize: "15px", color: "#343a40" }}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "15px",
                    color: "#05264e",
                  }}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="mb-3 position-relative">
                <label className="form-label" style={{ color: "#05264e", fontSize: "15px" }}>
                  Confirm Password<span className="text-danger"> *</span>
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  style={{ height: "50px", fontSize: "15px", color: "#343a40" }}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "15px",
                    color: "#05264e",
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <button
                type="submit"
                className="btn custom-btn w-100"
                style={{ fontSize: "15px", height: "50px" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      {/* Custom button styles */}
      <style jsx>{`
        .custom-btn {
          background-color: #05264e;
          color: white;
          border: none;
        }

        .custom-btn:hover {
          background-color: #4f46e5;
        }
      `}</style>
    </>
  );
};

export default ChangePassword;




