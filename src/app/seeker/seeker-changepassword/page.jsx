"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cookies from "js-cookie";
import useSeekerGuard from "@/hooks/useSeekerGuard";

const ChangePassword = () => {
  useSeekerGuard();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch("/api/seeker/changepassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Password change failed.");
        return;
      }

      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred. Please try again.");
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
            <h3 className="text-center mb-4" style={{ color: "#05264e", fontSize: "36px", fontWeight: "bold" }}>
              Seeker Change Password
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
                  style={{ height: "50px", fontSize: "15px", color: "#a0abb8" }}
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
                    fontSize: "18px",
                    color: "#a0abb8",
                  }}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
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
                  style={{ height: "50px", fontSize: "15px", color: "#a0abb8" }}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#a0abb8",
                  }}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
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
                  style={{ height: "50px", fontSize: "15px", color: "#a0abb8" }}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#a0abb8",
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="submit"
                className="btn w-100 mt-3"
                style={{
                  height: "50px",
                  backgroundColor: "#4f46e5",
                  fontSize: "15px",
                  color: "white",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ChangePassword;
