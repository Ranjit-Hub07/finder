"use client";

import React from "react";
import Link from "next/link";
import { Container } from "react-bootstrap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
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
            {/* 404 Glow Badge */}
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
                border: "2px dashed #6366f1",
              }}
            >
              <span
                className="fw-bold"
                style={{
                  fontSize: "36px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                404
              </span>
            </div>

            <h1 className="fw-bold text-dark mb-2" style={{ fontSize: "32px", letterSpacing: "-0.5px" }}>
              Page Not Found
            </h1>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: "520px", fontSize: "16px", lineHeight: "1.6" }}>
              Sorry, the page, candidate profile, or job listing you are looking for might have expired, been removed, or is temporarily unavailable.
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link
                href="/home"
                className="btn fw-semibold rounded-pill px-4 py-2 text-white shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  border: "none",
                  fontSize: "14.5px",
                }}
              >
                <i className="bi bi-house me-1"></i> Return Home
              </Link>

              <Link
                href="/job-listing"
                className="btn btn-outline-primary fw-semibold rounded-pill px-4 py-2"
                style={{ fontSize: "14.5px" }}
              >
                <i className="bi bi-search me-1"></i> Search Jobs
              </Link>

              <Link
                href="/contact-us"
                className="btn btn-light fw-semibold rounded-pill px-4 py-2 border text-secondary"
                style={{ fontSize: "14.5px" }}
              >
                <i className="bi bi-question-circle me-1"></i> Help Center
              </Link>
            </div>
          </Container>
        </div>

        <Footer />
      </div>
    </>
  );
}
