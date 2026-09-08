"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/recruiter/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => router.push("/recruiter-login"), 3000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const styles = {
    background: {
  backgroundImage: "url('/image/Bgmi.jpg')",
  backgroundSize: "cover",        // makes image cover full page
  backgroundPosition: "center",   // centers the image
  backgroundRepeat: "no-repeat",  // prevents repeating
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  position: "relative",
},
    container: {
      padding: "2rem",
      borderRadius: "10px",
      maxWidth: "400px",
      width: "100%",
      textAlign: "center",
    },
    heading: {
      marginBottom: "1.5rem",
      color: "#05264e",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    label: {
      textAlign: "left",
      fontWeight: "bold",
      color: "#05264e",
    },
    inputWrapper: {
      position: "relative",
    },
    input: {
      padding: "10px 40px 10px 10px", // right padding for the eye icon
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      width: "100%",
    },
    eyeIcon: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#666",
    },
    button: {
      marginTop: "1rem",
      padding: "12px",
      backgroundColor: "#05264e",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    error: {
      color: "red",
    },
    success: {
      color: "green",
    },
  };

  return (
    <>
      <Navbar />
      <div style={styles.background}>
        <div style={styles.container}>
          <h2 style={styles.heading}>Reset Your Password</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>New Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              {showPassword ? (
                <FaEye
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(false)}
                  aria-label="Hide password"
                />
              ) : (
                <FaEyeSlash
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(true)}
                  aria-label="Show password"
                />
              )}
            </div>

            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                required
              />
              {showConfirmPassword ? (
                <FaEye
                  style={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword(false)}
                  aria-label="Hide confirm password"
                />
              ) : (
                <FaEyeSlash
                  style={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword(true)}
                  aria-label="Show confirm password"
                />
              )}
            </div>

            {error && <p style={styles.error}>{error}</p>}
            {message && <p style={styles.success}>{message}</p>}

            <button type="submit" style={styles.button}>
              Continue
            </button>
          </form>
        </div>
      </div>
      <Footer />
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

export default ResetPasswordPage;
