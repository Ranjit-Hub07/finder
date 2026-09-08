"use client";

import React from "react";
import Link from "next/link";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const jobTypes = [
  {
    label: "Full Time",
    icon: "bi-briefcase-fill",
    color: "#4f46e5",
    bg: "#e8eeff",
    desc: "Permanent, salaried positions",
    query: "Full Time",
  },
  {
    label: "Part Time",
    icon: "bi-clock-fill",
    color: "#14b981",
    bg: "#dcfce7",
    desc: "Flexible hours, great for students",
    query: "Part Time",
  },
  {
    label: "Internship",
    icon: "bi-mortarboard-fill",
    color: "#f59e0b",
    bg: "#fef3c7",
    desc: "Learn on the job & build skills",
    query: "Internship",
  },
  {
    label: "Work From Home",
    icon: "bi-house-heart-fill",
    color: "#8b5cf6",
    bg: "#ede9fe",
    desc: "Remote-first opportunities",
    query: "Work From Home",
  },
  {
    label: "Walk-In Jobs",
    icon: "bi-person-walking",
    color: "#ef4444",
    bg: "#fee2e2",
    desc: "Direct interviews, no waiting",
    query: "Walk-In Jobs",
  },
  {
    label: "Government Job",
    icon: "bi-bank2",
    color: "#0891b2",
    bg: "#cffafe",
    desc: "PSU, central & state govt. posts",
    query: "Government Job",
  },
  {
    label: "Private Jobs",
    icon: "bi-building-fill",
    color: "#d97706",
    bg: "#fef9c3",
    desc: "Corporate & startup openings",
    query: "Private Jobs",
  },
  {
    label: "State Govt. Jobs",
    icon: "bi-flag-fill",
    color: "#059669",
    bg: "#d1fae5",
    desc: "Jobs in state public service",
    query: "State Govt. Jobs",
  },
  {
    label: "Contractual Jobs",
    icon: "bi-file-earmark-text-fill",
    color: "#7c3aed",
    bg: "#ede9fe",
    desc: "Fixed-term project-based roles",
    query: "Contractual Jobs",
  },
  {
    label: "Working Abroad",
    icon: "bi-globe2",
    color: "#e11d48",
    bg: "#ffe4e6",
    desc: "International career opportunities",
    query: "Working Abroad",
  },
];

const JobType = () => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* Banner */}
        <div className="page-banner">
          <Container>
            <h1 style={{ fontWeight: 800, fontSize: "40px" }}>Browse Jobs by Type</h1>
            <p style={{ opacity: 0.88, fontSize: "16px", marginTop: "8px" }}>
              Choose the employment type that fits your lifestyle and goals.
            </p>
          </Container>
          <div className="breadcrumb-pill">
            <Link href="/home">
              <i className="bi bi-house" /> Home
            </Link>
            <i className="bi bi-chevron-right" />
            <span>Job Type</span>
          </div>
        </div>

        {/* Job Type Grid */}
        <section style={{ background: "#f8f9fc", padding: "60px 0" }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-heading">Explore Employment Types</h2>
              <p className="section-subheading mt-2">
                From government to remote — find the kind of work that works for you.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "24px",
              }}
            >
              {jobTypes.map((job, idx) => (
                <Link
                  key={idx}
                  href={`/job-listing?jobType=${encodeURIComponent(job.query)}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="card-hover"
                    style={{
                      padding: "28px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = job.color;
                      e.currentTarget.style.background = job.bg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e5eaf3";
                      e.currentTarget.style.background = "#ffffff";
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: job.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 14px",
                      }}
                    >
                      <i
                        className={`bi ${job.icon}`}
                        style={{ fontSize: "26px", color: job.color }}
                      />
                    </div>
                    <h6 style={{ fontWeight: 700, color: "#05264e", marginBottom: "6px", fontSize: "15px" }}>
                      {job.label}
                    </h6>
                    <p style={{ fontSize: "13px", color: "#66789c", margin: 0 }}>
                      {job.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section style={{ background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)", padding: "60px 0" }}>
          <Container className="text-center text-white">
            <h3 style={{ fontWeight: 800, fontSize: "30px", marginBottom: "12px" }}>
              Not sure which type suits you?
            </h3>
            <p style={{ opacity: 0.88, fontSize: "16px", marginBottom: "28px" }}>
              Browse all active listings and use smart filters to narrow down your search.
            </p>
            <Link href="/job-listing" className="btn-portal-primary">
              <i className="bi bi-search" /> Explore All Jobs
            </Link>
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default JobType;
