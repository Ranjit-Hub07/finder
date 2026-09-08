"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container } from "react-bootstrap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <>
      <Navbar />

      <div
        style={{
          paddingTop: "110px",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="py-5 my-auto">
          <Container className="text-center py-5">
            {/* Error Icon */}
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontSize: "36px",
              }}
            >
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>

            <h2 className="fw-bold text-dark mb-2" style={{ fontSize: "28px" }}>
              Something Went Wrong
            </h2>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: "500px", fontSize: "15px", lineHeight: "1.6" }}>
              An unexpected error occurred while processing your request. Please try again or return to the home page.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                onClick={() => reset()}
                className="btn fw-semibold rounded-pill px-4 py-2 text-white shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  border: "none",
                  fontSize: "14.5px",
                }}
              >
                <i className="bi bi-arrow-clockwise me-1"></i> Try Again
              </button>

              <Link
                href="/home"
                className="btn btn-outline-secondary fw-semibold rounded-pill px-4 py-2"
                style={{ fontSize: "14.5px" }}
              >
                <i className="bi bi-house me-1"></i> Go to Homepage
              </Link>
            </div>
          </Container>
        </div>

        <Footer />
      </div>
    </>
  );
}
