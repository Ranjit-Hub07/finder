"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import CandidatesAwaitingReview from "./Components/CandidatesAwaitingReview";
import Reviewed from "./Components/Reviewed";
import PhoneScreened from "./Components/PhoneScreened";
import Interviewed from "./Components/Interviewed";
import OfferMade from "./Components/OfferMade";
import Hired from "./Components/Hired";
import Rejected from "./Components/Rejected";
import BackToTop from "@/components/BackToTop";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useRecruiterGuard from "@/hooks/useRecruiterGuard";

const OverviewPage = () => {
  useRecruiterGuard();
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeStageFilter, setActiveStageFilter] = useState("all");
  const [subscription, setSubscription] = useState(null);
  const [jobSummary, setJobSummary] = useState({
    open: 0,
    paused: 0,
    closed: 0,
  });

  // -----------------------
  // 🔥 REFS FOR SCROLLING
  // -----------------------
  const awaitingRef = useRef(null);
  const reviewedRef = useRef(null);
  const phoneRef = useRef(null);
  const interviewedRef = useRef(null);
  const offerRef = useRef(null);
  const hiredRef = useRef(null);
  const rejectedRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const statusMap = {
    Pending: "Awaiting Review",
    Reviewed: "Reviewed",
    "Phone Screened": "Phone Screened",
    Interviewed: "Interviewed",
    "Offer Made": "Offer Made",
    Hired: "Hired",
    Rejected: "Rejected",
  };

  // ✅ SAFE CANDIDATE FETCH
  const refreshCandidates = async () => {
    try {
      const res = await fetch("/api/recruiter/candidate", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();

      if (!Array.isArray(data)) {
        setCandidates([]);
        return;
      }

      const normalized = data.map((c) => ({
        ...c,
        status: statusMap[c.status] || c.status,
      }));

      setCandidates(normalized);
    } catch (err) {
      console.error("Candidates fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFE JOB SUMMARY FETCH
  const refreshJobs = async () => {
    try {
      const res = await fetch("/api/recruiter/job/summary", {
        credentials: "include",
      });
      const data = await res.json();
      setJobSummary(data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    }
  };

  // ✅ FETCH SUBSCRIPTION
  const refreshSubscription = async () => {
    try {
      const res = await fetch("/api/subscriptions/active", {
        credentials: "include",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (err) {
      console.error("Failed to load subscription:", err);
    }
  };

  useEffect(() => {
    refreshCandidates();
    refreshJobs();
    refreshSubscription();
  }, []);

  // Filter candidates by search term if typed
  const filteredCandidates = useMemo(() => {
    if (!searchFilter.trim()) return candidates;
    const q = searchFilter.toLowerCase();
    return candidates.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.job && c.job.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [candidates, searchFilter]);

  const awaiting = filteredCandidates.filter((c) => c.status === "Awaiting Review");
  const reviewed = filteredCandidates.filter((c) => c.status === "Reviewed");
  const phoneScreened = filteredCandidates.filter((c) => c.status === "Phone Screened");
  const interviewed = filteredCandidates.filter((c) => c.status === "Interviewed");
  const offerMade = filteredCandidates.filter((c) => c.status === "Offer Made");
  const hired = filteredCandidates.filter((c) => c.status === "Hired");
  const rejected = filteredCandidates.filter((c) => c.status === "Rejected");

  const totalActivePipeline = awaiting.length + reviewed.length + phoneScreened.length + interviewed.length + offerMade.length;

  const goToJobs = (status) => {
    router.push(`/recruiter/job?status=${status}`);
  };

  const stageOptions = [
    { id: "all", label: "All Candidates", count: filteredCandidates.length, icon: "bi-people" },
    { id: "awaiting", label: "Awaiting Review", count: awaiting.length, icon: "bi-hourglass-split", ref: awaitingRef },
    { id: "reviewed", label: "Reviewed", count: reviewed.length, icon: "bi-check2-circle", ref: reviewedRef },
    { id: "phone", label: "Phone Screened", count: phoneScreened.length, icon: "bi-telephone-inbound", ref: phoneRef },
    { id: "interviewed", label: "Interviewed", count: interviewed.length, icon: "bi-camera-video", ref: interviewedRef },
    { id: "offer", label: "Offer Made", count: offerMade.length, icon: "bi-file-earmark-check", ref: offerRef },
    { id: "hired", label: "Hired", count: hired.length, icon: "bi-person-check", ref: hiredRef },
    { id: "rejected", label: "Rejected", count: rejected.length, icon: "bi-x-circle", ref: rejectedRef },
  ];

  return (
    <>
      <Navbar />
      <Topbar />

      <div
        style={{
          paddingTop: "175px",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          paddingBottom: "60px",
        }}
      >
        <div className="container-fluid py-4 px-lg-5 px-3">
          {/* ===================== HERO / HEADER BANNER ===================== */}
          <div
            className="p-4 mb-4 rounded-4"
            style={{
              background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 55%, #0e7490 100%)",
              color: "#ffffff",
              boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span
                    className="badge rounded-pill"
                    style={{
                      backgroundColor: "rgba(56, 189, 248, 0.15)",
                      color: "#38bdf8",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      fontSize: "12px",
                      padding: "5px 12px",
                    }}
                  >
                    <i className="bi bi-speedometer2 me-1"></i> Executive Recruitment Hub
                  </span>
                </div>
                <h2 className="fw-bold mb-1" style={{ letterSpacing: "-0.5px" }}>
                  Hiring & Pipeline Overview
                </h2>
                <p className="text-white-50 mb-0" style={{ fontSize: "14.5px" }}>
                  Real-time visibility across all applicant stages, hiring quotas, and job requisitions.
                </p>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <Link
                  href="/recruiter/job/post-job"
                  className="btn fw-semibold px-3 py-2 rounded-3 text-white shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                    border: "none",
                    fontSize: "14px",
                    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                  }}
                >
                  <i className="bi bi-plus-circle me-1"></i> Post New Job
                </Link>

                <Link
                  href="/recruiter/candidate-search"
                  className="btn btn-outline-light fw-semibold px-3 py-2 rounded-3"
                  style={{ fontSize: "14px", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <i className="bi bi-search me-1"></i> Search Talent
                </Link>
              </div>
            </div>
          </div>

          {/* ===================== KPI METRIC CARDS ===================== */}
          <div className="row g-3 mb-4">
            {/* KPI 1: Total Candidates */}
            <div className="col-xl-3 col-sm-6">
              <div
                className="kpi-card p-3 rounded-4 bg-white h-100"
                style={{
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: "0.5px" }}>
                      Total Applicants
                    </span>
                    <h3 className="fw-bold my-1" style={{ color: "#0f172a" }}>
                      {candidates.length}
                    </h3>
                    <span className="badge bg-primary-subtle text-primary fw-semibold" style={{ fontSize: "11px" }}>
                      All active applications
                    </span>
                  </div>
                  <div
                    className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(79, 70, 229, 0.1)", color: "#4f46e5", fontSize: "20px" }}
                  >
                    <i className="bi bi-people-fill"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI 2: Active Pipeline */}
            <div className="col-xl-3 col-sm-6">
              <div
                className="kpi-card p-3 rounded-4 bg-white h-100"
                style={{
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: "0.5px" }}>
                      In Active Pipeline
                    </span>
                    <h3 className="fw-bold my-1" style={{ color: "#0f172a" }}>
                      {totalActivePipeline}
                    </h3>
                    <span className="badge bg-warning-subtle text-warning-emphasis fw-semibold" style={{ fontSize: "11px" }}>
                      {awaiting.length} awaiting review
                    </span>
                  </div>
                  <div
                    className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#d97706", fontSize: "20px" }}
                  >
                    <i className="bi bi-funnel-fill"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI 3: Hired */}
            <div className="col-xl-3 col-sm-6">
              <div
                className="kpi-card p-3 rounded-4 bg-white h-100"
                style={{
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: "0.5px" }}>
                      Hired Candidates
                    </span>
                    <h3 className="fw-bold my-1" style={{ color: "#059669" }}>
                      {hired.length}
                    </h3>
                    <span className="badge bg-success-subtle text-success fw-semibold" style={{ fontSize: "11px" }}>
                      {offerMade.length} offer(s) pending
                    </span>
                  </div>
                  <div
                    className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669", fontSize: "20px" }}
                  >
                    <i className="bi bi-person-check-fill"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI 4: Active Open Jobs */}
            <div className="col-xl-3 col-sm-6">
              <div
                className="kpi-card p-3 rounded-4 bg-white h-100"
                style={{
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: "0.5px" }}>
                      Open Positions
                    </span>
                    <h3 className="fw-bold my-1" style={{ color: "#0f172a" }}>
                      {jobSummary.open}
                    </h3>
                    <span className="badge bg-info-subtle text-info fw-semibold" style={{ fontSize: "11px" }}>
                      {jobSummary.paused} paused · {jobSummary.closed} closed
                    </span>
                  </div>
                  <div
                    className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(6, 182, 212, 0.1)", color: "#0891b2", fontSize: "20px" }}
                  >
                    <i className="bi bi-briefcase-fill"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================== FILTER & SEARCH CONTROLS ===================== */}
          <div
            className="p-3 mb-4 rounded-4 bg-white"
            style={{
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
              {/* Quick Jump Buttons */}
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="text-muted small fw-bold me-1 text-uppercase" style={{ fontSize: "11px" }}>
                  Filter / Jump:
                </span>
                {stageOptions.map((stage) => (
                  <button
                    key={stage.id}
                    type="button"
                    className={`btn btn-sm rounded-pill fw-semibold d-inline-flex align-items-center gap-1 ${
                      activeStageFilter === stage.id ? "text-white" : "text-secondary bg-light"
                    }`}
                    style={{
                      fontSize: "12.5px",
                      padding: "6px 14px",
                      border: "1px solid",
                      borderColor: activeStageFilter === stage.id ? "#4f46e5" : "#e2e8f0",
                      background:
                        activeStageFilter === stage.id
                          ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                          : "#f8fafc",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => {
                      setActiveStageFilter(stage.id);
                      if (stage.ref) scrollToSection(stage.ref);
                    }}
                  >
                    <i className={`bi ${stage.icon}`}></i>
                    <span>{stage.label}</span>
                    <span
                      className="badge rounded-pill ms-1"
                      style={{
                        backgroundColor:
                          activeStageFilter === stage.id ? "rgba(255, 255, 255, 0.25)" : "#e2e8f0",
                        color: activeStageFilter === stage.id ? "#ffffff" : "#475569",
                        fontSize: "10.5px",
                      }}
                    >
                      {stage.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Instant Search Bar */}
              <div style={{ minWidth: "260px" }}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="Search candidate, job, email..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{ fontSize: "13px" }}
                  />
                  {searchFilter && (
                    <button
                      className="btn btn-outline-secondary border-start-0"
                      type="button"
                      onClick={() => setSearchFilter("")}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===================== MAIN GRID (TABLES + SIDEBAR) ===================== */}
          <div className="d-flex flex-lg-row flex-column gap-4 align-items-start">
            {/* ---------------- LEFT SECTION (TABLES) ---------------- */}
            <div className="flex-grow-1 w-100">
              {(activeStageFilter === "all" || activeStageFilter === "awaiting") && (
                <div ref={awaitingRef}>
                  <CandidatesAwaitingReview data={awaiting} />
                </div>
              )}

              {(activeStageFilter === "all" || activeStageFilter === "reviewed") && (
                <div ref={reviewedRef}>
                  <Reviewed data={reviewed} />
                </div>
              )}

              {(activeStageFilter === "all" || activeStageFilter === "phone") && (
                <div ref={phoneRef}>
                  <PhoneScreened data={phoneScreened} />
                </div>
              )}

              {(activeStageFilter === "all" || activeStageFilter === "interviewed") && (
                <div ref={interviewedRef}>
                  <Interviewed data={interviewed} />
                </div>
              )}

              {(activeStageFilter === "all" || activeStageFilter === "offer") && (
                <div ref={offerRef}>
                  <OfferMade data={offerMade} />
                </div>
              )}

              {(activeStageFilter === "all" || activeStageFilter === "hired") && (
                <div ref={hiredRef}>
                  <Hired data={hired} />
                </div>
              )}

              {(activeStageFilter === "all" || activeStageFilter === "rejected") && (
                <div ref={rejectedRef}>
                  <Rejected data={rejected} />
                </div>
              )}
            </div>

            {/* ---------------- RIGHT SIDEBAR ---------------- */}
            <div style={{ width: "340px", minWidth: "300px", flexShrink: 0 }}>
              {/* -------- SUBSCRIPTION SUMMARY CARD -------- */}
              <div
                className="sidebar-card mb-4"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="heading-text mb-0" style={{ color: "#0f172a" }}>
                    <i className="bi bi-award-fill me-2 text-primary"></i> Current Plan
                  </h6>
                  <span
                    className="badge"
                    style={{
                      background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                      color: "#fff",
                      fontSize: "11px",
                      padding: "5px 10px",
                    }}
                  >
                    {subscription?.package_name || "Active"}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Job Posts Remaining</span>
                    <span className="fw-bold text-dark">
                      {subscription?.posts_remaining ?? 0} / {subscription?.job_post_count ?? 0}
                    </span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          subscription?.job_post_count
                            ? Math.min(
                                100,
                                ((subscription.posts_remaining || 0) / subscription.job_post_count) * 100
                              )
                            : 0
                        }%`,
                        background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="d-flex justify-content-between py-2 border-top border-bottom my-2 small">
                  <span className="text-muted">Profile Views</span>
                  <span className="fw-bold text-dark">{subscription?.profile_view_count ?? 0}</span>
                </div>

                <div className="d-flex justify-content-between py-2 border-bottom mb-3 small">
                  <span className="text-muted">Email Quota</span>
                  <span className="fw-bold text-dark">{subscription?.email_count ?? 0}</span>
                </div>

                <Link
                  href="/recruiter/package"
                  className="btn btn-outline-primary btn-sm w-100 fw-semibold rounded-pill py-2"
                  style={{ borderColor: "#4f46e5", color: "#4f46e5" }}
                >
                  <i className="bi bi-stars me-1 text-warning"></i> Upgrade Plan
                </Link>
              </div>

              {/* -------- JOB SUMMARY CARD -------- */}
              <div className="sidebar-card mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="heading-text mb-0" style={{ color: "#0f172a" }}>
                    <i className="bi bi-briefcase-fill me-2 text-primary"></i> Jobs Overview
                  </h6>
                  <Link
                    href="/recruiter/job"
                    className="text-decoration-none small text-primary fw-semibold"
                  >
                    View All
                  </Link>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => goToJobs("open")}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle d-inline-block"
                      style={{ width: "8px", height: "8px", backgroundColor: "#10b981" }}
                    ></span>
                    <span className="fw-medium text-dark">Open Jobs</span>
                  </div>
                  <span className="badge-modern bg-success-subtle text-success">{jobSummary.open}</span>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => goToJobs("paused")}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle d-inline-block"
                      style={{ width: "8px", height: "8px", backgroundColor: "#f59e0b" }}
                    ></span>
                    <span className="fw-medium text-dark">Paused Jobs</span>
                  </div>
                  <span className="badge-modern bg-warning-subtle text-warning-emphasis">
                    {jobSummary.paused}
                  </span>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => goToJobs("closed")}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle d-inline-block"
                      style={{ width: "8px", height: "8px", backgroundColor: "#ef4444" }}
                    ></span>
                    <span className="fw-medium text-dark">Closed Jobs</span>
                  </div>
                  <span className="badge-modern bg-danger-subtle text-danger">{jobSummary.closed}</span>
                </div>

                <Link
                  href="/recruiter/job/post-job"
                  className="btn btn-primary btn-sm w-100 fw-semibold rounded-pill py-2 mt-3"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                    border: "none",
                  }}
                >
                  <i className="bi bi-plus-lg me-1"></i> Post New Job
                </Link>
              </div>

              {/* -------- CANDIDATE FUNNEL CARD -------- */}
              <div className="sidebar-card">
                <h6 className="heading-text mb-3" style={{ color: "#0f172a" }}>
                  <i className="bi bi-funnel me-2 text-primary"></i> Pipeline Funnel
                </h6>

                <div
                  className="d-flex justify-content-between hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => scrollToSection(awaitingRef)}
                >
                  <span className="text-secondary fw-medium">Awaiting Review</span>
                  <span className="badge-modern">{awaiting.length}</span>
                </div>

                <div
                  className="d-flex justify-content-between hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => scrollToSection(reviewedRef)}
                >
                  <span className="text-secondary fw-medium">Reviewed</span>
                  <span className="badge-modern">{reviewed.length}</span>
                </div>

                <div
                  className="d-flex justify-content-between hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => scrollToSection(phoneRef)}
                >
                  <span className="text-secondary fw-medium">Phone Screened</span>
                  <span className="badge-modern">{phoneScreened.length}</span>
                </div>

                <div
                  className="d-flex justify-content-between hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => scrollToSection(interviewedRef)}
                >
                  <span className="text-secondary fw-medium">Interviewed</span>
                  <span className="badge-modern">{interviewed.length}</span>
                </div>

                <div
                  className="d-flex justify-content-between hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => scrollToSection(offerRef)}
                >
                  <span className="text-secondary fw-medium">Offer Made</span>
                  <span className="badge-modern">{offerMade.length}</span>
                </div>

                <div
                  className="d-flex justify-content-between hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => scrollToSection(hiredRef)}
                >
                  <span className="text-success fw-semibold">Hired</span>
                  <span className="badge-modern bg-success-subtle text-success">{hired.length}</span>
                </div>

                <div
                  className="d-flex justify-content-between hover-row px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => scrollToSection(rejectedRef)}
                >
                  <span className="text-muted">Rejected</span>
                  <span className="badge-modern bg-light text-muted">{rejected.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />

      {/* ✅ MODERN STYLING */}
      <style jsx global>{`
        .kpi-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px -2px rgba(79, 70, 229, 0.12) !important;
          border-color: rgba(99, 102, 241, 0.3) !important;
        }

        .sidebar-card {
          background: white;
          border-radius: 16px;
          padding: 22px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
          transition: all 0.25s ease;
        }

        .sidebar-card:hover {
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .hover-row {
          padding: 9px 8px;
          transition: all 0.2s ease;
          border-radius: 8px;
        }

        .hover-row:hover {
          background: rgba(99, 102, 241, 0.06);
          padding-left: 12px;
        }

        .heading-text {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .badge-modern {
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 11.5px;
          font-weight: 600;
          background: #f1f5f9;
          color: #475569;
        }
      `}</style>
    </>
  );
};

export default OverviewPage;
