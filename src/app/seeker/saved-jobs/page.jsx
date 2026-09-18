"use client";

import React from "react";
import Link from "next/link";
import { Container } from "react-bootstrap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SavedJobs from "@/app/seeker/profile/components/SavedJobs";
import useSeekerGuard from "@/hooks/useSeekerGuard";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function SeekerSavedJobsPage() {
  useSeekerGuard();

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "var(--header-offset, 70px)", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        {/* Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Saved Jobs</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Keep track of positions you are interested in and apply when you are ready.
              </p>
            </div>

            {/* Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <Link href="/seeker/profile" className="text-decoration-none text-muted">
                My Profile
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">Saved Jobs</span>
            </div>
          </Container>
        </div>

        {/* Saved Jobs Content Container */}
        <Container className="py-4 px-2 px-sm-3" style={{ maxWidth: "1140px" }}>
          <SavedJobs />
        </Container>
      </div>

      <Footer />
      <BackToTop />

      <style jsx global>{`
        .page-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 38px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .breadcrumb-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}
