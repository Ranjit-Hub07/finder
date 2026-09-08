"use client";
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/recruiter/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Reset link sent to your email.");
        setEmail(""); // optional: clear the form
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to send reset link. Try again later.");
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    position: 'relative',
    padding: '20px',
  };

  const cardStyle = {
    padding: '30px',
    maxWidth: '550px',
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 1,
  };

  const imageDivStyle = {
    position: 'absolute',
    bottom: '0',
    left: '10px',
    width: '563px',
    height: '450px',
    backgroundImage: 'url(/image/img-3.jpg)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    pointerEvents: 'none',
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div className="text-center mb-3">
            <div className="text-primary fw-semibold mb-1">Forgot Password?</div>
          </div>
          <div className="text-center mb-3">
            <div className="fw-bold" style={{ color: '#05264e', fontSize: '36px' }}>
              Reset Your Password
            </div>
            <div className="text-muted" style={{ fontSize: '14px' }}>
              Enter the email address associated with your account and we’ll <br />
              send you a link to reset your password.
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{ color: '#05264e', fontSize: '14px' }}>
                Email address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Please enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn custom-btn w-100 py-3"
              style={{ height: '60px' }}
            >
              Continue
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-muted">Don't have an Account? </span>
            <Link href="/recruiter-login/sign-up" className="text-primary fw-semibold">
              SIGN UP
            </Link>
          </div>
        </div>
        <div style={imageDivStyle}></div>
      </div>
      <Footer />

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

export default ResetPassword;
