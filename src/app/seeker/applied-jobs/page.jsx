"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import useSeekerGuard from "@/hooks/useSeekerGuard";
import "bootstrap-icons/font/bootstrap-icons.css";

// Avatar gradients
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
];

const getAvatarGradient = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

const formatSalary = (min, max, period) => {
  if (!min && !max) return "Not Disclosed";
  const formatNum = (num) => {
    if (!num) return "";
    const n = Number(num);
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
    return `₹${n.toLocaleString("en-IN")}`;
  };
  const periodText = period ? `/${period.replace("per ", "").replace("/month", "mo").replace("/year", "yr")}` : "/mo";
  if (min && max) return `${formatNum(min)} - ${formatNum(max)} ${periodText}`;
  return `${formatNum(min || max)} ${periodText}`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const dateFormatted = d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeFormatted = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date: dateFormatted, time: timeFormatted.toUpperCase() };
};

// Application status configurations
const STATUS_CONFIG = {
  Pending: {
    label: "Pending Review",
    badgeBg: "rgba(245, 158, 11, 0.12)",
    badgeColor: "#d97706",
    badgeBorder: "rgba(245, 158, 11, 0.25)",
    icon: "bi-hourglass-split",
    step: 1,
  },
  Reviewed: {
    label: "Application Reviewed",
    badgeBg: "rgba(14, 165, 233, 0.12)",
    badgeColor: "#0284c7",
    badgeBorder: "rgba(14, 165, 233, 0.25)",
    icon: "bi-eye-fill",
    step: 2,
  },
  "Phone Screened": {
    label: "Phone Screened",
    badgeBg: "rgba(139, 92, 246, 0.12)",
    badgeColor: "#7c3aed",
    badgeBorder: "rgba(139, 92, 246, 0.25)",
    icon: "bi-telephone-inbound",
    step: 2,
  },
  Interviewed: {
    label: "Interview Round",
    badgeBg: "rgba(99, 102, 241, 0.12)",
    badgeColor: "#4f46e5",
    badgeBorder: "rgba(99, 102, 241, 0.25)",
    icon: "bi-calendar2-check-fill",
    step: 3,
  },
  "Offer Made": {
    label: "Offer Received",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeColor: "#059669",
    badgeBorder: "rgba(16, 185, 129, 0.25)",
    icon: "bi-award-fill",
    step: 4,
  },
  Hired: {
    label: "Hired",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeColor: "#047857",
    badgeBorder: "rgba(16, 185, 129, 0.3)",
    icon: "bi-patch-check-fill",
    step: 4,
  },
  Rejected: {
    label: "Not Selected",
    badgeBg: "rgba(100, 116, 139, 0.12)",
    badgeColor: "#64748b",
    badgeBorder: "rgba(100, 116, 139, 0.25)",
    icon: "bi-x-circle-fill",
    step: 4,
    isRejected: true,
  },
};

const getStatusDetails = (statusStr) => {
  return STATUS_CONFIG[statusStr] || STATUS_CONFIG.Pending;
};

// Stepper stages
const PIPELINE_STEPS = [
  { id: 1, label: "Applied" },
  { id: 2, label: "Reviewed" },
  { id: 3, label: "Interview" },
  { id: 4, label: "Decision" },
];

export default function SeekerAppliedJobsPage() {
  useSeekerGuard();

  const [applications, setApplications] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, reviewed: 0, interview: 0, offered: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seeker/applied-jobs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = applications.filter((app) => {
    const status = (app.application_status || "Pending").toLowerCase();

    // Tab filter
    if (activeTab === "pending" && status !== "pending") return false;
    if (activeTab === "reviewed" && status !== "reviewed" && status !== "phone screened") return false;
    if (activeTab === "interview" && !status.includes("interview")) return false;
    if (activeTab === "offered" && status !== "offer made" && status !== "hired") return false;
    if (activeTab === "rejected" && status !== "rejected") return false;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const titleMatch = (app.job_title || "").toLowerCase().includes(term);
      const companyMatch = (app.job_company || "").toLowerCase().includes(term);
      const cityMatch = (app.job_cityid || "").toLowerCase().includes(term);
      if (!titleMatch && !companyMatch && !cityMatch) return false;
    }

    return true;
  });

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "var(--header-offset, 70px)", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        {/* Header Hero Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Applied Jobs Tracker</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Track your job applications, recruitment stages, and status updates in real-time.
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
              <span className="text-primary fw-semibold">Applied Jobs</span>
            </div>
          </Container>
        </div>

        {/* Main Content Container */}
        <Container className="py-4 px-2 px-sm-3" style={{ maxWidth: "1140px" }}>
          {/* Quick Metrics Cards */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <div
                className="metric-card bg-white p-3 rounded-4 border d-flex align-items-center gap-3"
                style={{ borderColor: "#e2e8f0", boxShadow: "0 2px 10px rgba(15, 23, 42, 0.03)" }}
              >
                <div
                  className="metric-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "44px", height: "44px", background: "rgba(99, 102, 241, 0.1)", color: "#4f46e5" }}
                >
                  <i className="bi bi-send-fill fs-5"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">{counts.all}</h4>
                  <small className="text-muted fw-medium" style={{ fontSize: "12px" }}>Total Applied</small>
                </div>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <div
                className="metric-card bg-white p-3 rounded-4 border d-flex align-items-center gap-3"
                style={{ borderColor: "#e2e8f0", boxShadow: "0 2px 10px rgba(15, 23, 42, 0.03)" }}
              >
                <div
                  className="metric-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "44px", height: "44px", background: "rgba(14, 165, 233, 0.1)", color: "#0284c7" }}
                >
                  <i className="bi bi-eye-fill fs-5"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">{counts.reviewed}</h4>
                  <small className="text-muted fw-medium" style={{ fontSize: "12px" }}>Under Review</small>
                </div>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <div
                className="metric-card bg-white p-3 rounded-4 border d-flex align-items-center gap-3"
                style={{ borderColor: "#e2e8f0", boxShadow: "0 2px 10px rgba(15, 23, 42, 0.03)" }}
              >
                <div
                  className="metric-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "44px", height: "44px", background: "rgba(139, 92, 246, 0.1)", color: "#7c3aed" }}
                >
                  <i className="bi bi-calendar2-check-fill fs-5"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">{counts.interview}</h4>
                  <small className="text-muted fw-medium" style={{ fontSize: "12px" }}>Interview Calls</small>
                </div>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <div
                className="metric-card bg-white p-3 rounded-4 border d-flex align-items-center gap-3"
                style={{ borderColor: "#e2e8f0", boxShadow: "0 2px 10px rgba(15, 23, 42, 0.03)" }}
              >
                <div
                  className="metric-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "44px", height: "44px", background: "rgba(16, 185, 129, 0.1)", color: "#059669" }}
                >
                  <i className="bi bi-award-fill fs-5"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">{counts.offered}</h4>
                  <small className="text-muted fw-medium" style={{ fontSize: "12px" }}>Offers / Hired</small>
                </div>
              </div>
            </Col>
          </Row>

          {/* Filter Bar & Tabs Card */}
          <div
            className="bg-white rounded-4 p-3 p-md-4 mb-4 border"
            style={{
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
              borderColor: "#e2e8f0",
            }}
          >
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
              {/* Category Filter Tabs */}
              <div
                className="filter-tabs-wrapper d-flex align-items-center gap-1.5 overflow-x-auto w-100 pb-1 pb-lg-0"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {[
                  { key: "all", label: "All", count: counts.all },
                  { key: "pending", label: "Pending", count: counts.pending },
                  { key: "reviewed", label: "Reviewed", count: counts.reviewed },
                  { key: "interview", label: "Interviews", count: counts.interview },
                  { key: "offered", label: "Offers", count: counts.offered },
                  { key: "rejected", label: "Archived", count: counts.rejected },
                ].map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`filter-tab-pill btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 border-0 ${
                        isActive ? "text-white" : "text-secondary"
                      }`}
                      style={{
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                        background: isActive
                          ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                          : "#f1f5f9",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span>{tab.label}</span>
                      <span
                        className="badge rounded-pill"
                        style={{
                          fontSize: "10.5px",
                          backgroundColor: isActive ? "rgba(255, 255, 255, 0.25)" : "#e2e8f0",
                          color: isActive ? "#ffffff" : "#475569",
                        }}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="position-relative flex-shrink-0 w-100 w-lg-auto" style={{ minWidth: "260px" }}>
                <i
                  className="bi bi-search position-absolute text-muted"
                  style={{ left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px" }}
                ></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-pill ps-5 pe-4 py-2"
                  placeholder="Filter by title, company, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: "13px", border: "1px solid #cbd5e1" }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted position-absolute end-0 top-50 translate-middle-y text-decoration-none me-2"
                    onClick={() => setSearchTerm("")}
                    style={{ fontSize: "12px" }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-4 p-5 text-center border" style={{ borderColor: "#e2e8f0" }}>
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="text-muted fw-semibold mb-0">Loading your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            /* Empty State: Never Applied */
            <div
              className="bg-white rounded-4 p-5 text-center border"
              style={{
                borderColor: "#e2e8f0",
                boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div
                className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "64px", height: "64px", background: "#eff6ff" }}
              >
                <i className="bi bi-send-check-fill text-primary fs-3"></i>
              </div>
              <h5 className="fw-bold text-dark mb-1">No Applications Yet</h5>
              <p className="text-muted small mb-4" style={{ maxWidth: "440px", margin: "0 auto" }}>
                You haven&apos;t applied to any job openings yet. Discover relevant jobs matching your skills and start applying today!
              </p>
              <Link
                href="/job-listing"
                className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  border: "none",
                  fontSize: "14px",
                }}
              >
                <i className="bi bi-search me-1.5"></i>
                <span>Explore Open Opportunities</span>
              </Link>
            </div>
          ) : filteredApplications.length === 0 ? (
            /* No Filter Matches */
            <div className="bg-white rounded-4 p-4 text-center border" style={{ borderColor: "#e2e8f0" }}>
              <i className="bi bi-funnel text-muted fs-3 mb-2 d-block"></i>
              <h6 className="fw-bold text-dark mb-1">No applications found</h6>
              <p className="text-muted small mb-0">
                {searchTerm
                  ? "No applications match your search keyword. Try clearing your filter."
                  : "You have no applications under this category."}
              </p>
            </div>
          ) : (
            /* List of Applied Job Cards */
            <div className="d-flex flex-column gap-3.5">
              {filteredApplications.map((app) => {
                const companyName = app.job_company || "Dialurbano";
                const companyInitial = companyName.charAt(0).toUpperCase();
                const salaryText = formatSalary(app.job_minsalary, app.job_maxsalary, app.salary_period);
                const statusDetails = getStatusDetails(app.application_status);
                const currentStep = statusDetails.step || 1;
                const isRejected = statusDetails.isRejected;

                const appliedDate = app.job_apply_date || app.applied_at;
                const updatedDate = app.status_updated_at;
                const appliedInfo = formatDateTime(appliedDate);
                const updatedInfo = formatDateTime(updatedDate);
                const hasUpdated =
                  updatedDate &&
                  appliedDate &&
                  new Date(updatedDate).getTime() - new Date(appliedDate).getTime() > 60000;

                return (
                  <div
                    key={app.application_id}
                    className="applied-job-card bg-white rounded-4 p-3.5 p-md-4 border position-relative"
                    style={{
                      borderColor: "#e2e8f0",
                      boxShadow: "0 2px 12px rgba(15, 23, 42, 0.04)",
                      transition: "all 0.22s ease-in-out",
                    }}
                  >
                    {/* Top Row: Avatar + Role Info + Status Pill */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
                      {/* Left: Avatar + Title & Meta */}
                      <div className="d-flex align-items-start gap-3 flex-grow-1 min-w-0">
                        <div
                          className="company-avatar-sm flex-shrink-0 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            background: getAvatarGradient(companyName),
                            fontSize: "19px",
                          }}
                        >
                          {companyInitial}
                        </div>

                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex align-items-center gap-2 mb-1.5 flex-wrap">
                            <Link
                              href={`/job-listing/${app.job_id}`}
                              className="job-title-link text-decoration-none fw-bold text-dark"
                              style={{ fontSize: "16.5px" }}
                            >
                              {app.job_title}
                            </Link>
                            {salaryText && (
                              <span
                                className="badge rounded-pill fw-semibold"
                                style={{
                                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                                  color: "#059669",
                                  border: "1px solid rgba(16, 185, 129, 0.25)",
                                  fontSize: "12px",
                                  padding: "3px 9px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {salaryText}
                              </span>
                            )}
                          </div>

                          {/* Spec Pills */}
                          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                            <span className="spec-badge">
                              <i className="bi bi-building text-primary"></i>
                              <span>{companyName}</span>
                            </span>
                            {app.job_cityid && (
                              <span className="spec-badge">
                                <i className="bi bi-geo-alt-fill text-danger"></i>
                                <span>{app.job_cityid}</span>
                              </span>
                            )}
                            {(app.job_minexp != null || app.job_maxexp != null) && (
                              <span className="spec-badge">
                                <i className="bi bi-briefcase-fill text-primary"></i>
                                <span>{app.job_minexp || 0}-{app.job_maxexp || 0} yrs</span>
                              </span>
                            )}
                            {app.job_type && (
                              <span className="spec-badge">
                                <i className="bi bi-clock-history text-info"></i>
                                <span>{app.job_type}</span>
                              </span>
                            )}
                          </div>

                          {/* Date and Timing */}
                          <div className="d-flex flex-wrap align-items-center gap-2 mt-2 pt-2" style={{ borderTop: "1px dashed #e2e8f0" }}>
                            {appliedInfo && (
                              <span
                                className="applied-time-badge d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill"
                                style={{
                                  backgroundColor: "#f8fafc",
                                  border: "1px solid #e2e8f0",
                                  color: "#475569",
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <i className="bi bi-calendar-check text-primary" style={{ fontSize: "12px" }}></i>
                                <span className="text-muted">Applied:</span>
                                <span className="fw-semibold text-dark">{appliedInfo.date}</span>
                                <span className="text-secondary" style={{ fontSize: "11px" }}>• {appliedInfo.time}</span>
                              </span>
                            )}
                            {hasUpdated && updatedInfo && (
                              <span
                                className="applied-time-badge d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill"
                                style={{
                                  backgroundColor: "#f8fafc",
                                  border: "1px solid #e2e8f0",
                                  color: "#475569",
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <i className="bi bi-arrow-repeat text-info" style={{ fontSize: "12px" }}></i>
                                <span className="text-muted">Updated:</span>
                                <span className="fw-semibold text-dark">{updatedInfo.date}</span>
                                <span className="text-secondary" style={{ fontSize: "11px" }}>• {updatedInfo.time}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Badge & View Job Button */}
                      <div className="applied-card-actions d-flex flex-row flex-md-column align-items-md-end align-items-center justify-content-between gap-2 flex-shrink-0">
                        <span
                          className="status-pill d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill fw-semibold"
                          style={{
                            backgroundColor: statusDetails.badgeBg,
                            color: statusDetails.badgeColor,
                            border: `1px solid ${statusDetails.badgeBorder}`,
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <i className={`bi ${statusDetails.icon}`}></i>
                          <span>{statusDetails.label}</span>
                        </span>

                        <Link
                          href={`/job-listing/${app.job_id}`}
                          className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
                          style={{ fontSize: "12.5px", whiteSpace: "nowrap" }}
                        >
                          <span>View Job Details</span>
                          <i className="bi bi-arrow-right" style={{ fontSize: "11px" }}></i>
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Row: Visual Hiring Pipeline Stepper */}
                    <div className="pipeline-stepper-box pt-3 mt-2 border-top" style={{ borderColor: "#f1f5f9" }}>
                      <div className="stepper-progress-container position-relative">
                        <div className="d-flex justify-content-between align-items-center position-relative">
                          {/* Background connecting track */}
                          <div
                            className="stepper-track position-absolute start-0 end-0 top-50 translate-middle-y"
                            style={{
                              height: "3px",
                              backgroundColor: "#e2e8f0",
                              zIndex: 1,
                              margin: "0 20px",
                            }}
                          />

                          {/* Colored active track */}
                          <div
                            className="stepper-track-active position-absolute start-0 top-50 translate-middle-y"
                            style={{
                              height: "3px",
                              backgroundColor: isRejected ? "#94a3b8" : "#4f46e5",
                              zIndex: 2,
                              margin: "0 20px",
                              width: isRejected
                                ? "100%"
                                : `${((Math.min(currentStep, 4) - 1) / 3) * 100}%`,
                              transition: "width 0.4s ease",
                            }}
                          />

                          {/* Step Nodes */}
                          {PIPELINE_STEPS.map((step) => {
                            const isCompleted = currentStep >= step.id;
                            const isCurrent = currentStep === step.id;

                            let nodeBg = "#ffffff";
                            let nodeBorder = "#cbd5e1";
                            let nodeColor = "#64748b";
                            let nodeIcon = step.id;

                            if (isRejected && step.id === 4) {
                              nodeBg = "#fee2e2";
                              nodeBorder = "#ef4444";
                              nodeColor = "#dc2626";
                              nodeIcon = <i className="bi bi-x-lg" style={{ fontSize: "10px" }} />;
                            } else if (isCompleted) {
                              nodeBg = isCurrent ? "#4f46e5" : "#4f46e5";
                              nodeBorder = "#4f46e5";
                              nodeColor = "#ffffff";
                              nodeIcon = <i className="bi bi-check-lg" style={{ fontSize: "12px" }} />;
                            }

                            return (
                              <div
                                key={step.id}
                                className="stepper-node-item d-flex flex-column align-items-center position-relative"
                                style={{ zIndex: 3 }}
                              >
                                <div
                                  className="stepper-node rounded-circle d-flex align-items-center justify-content-center shadow-sm fw-bold"
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    backgroundColor: nodeBg,
                                    border: `2px solid ${nodeBorder}`,
                                    color: nodeColor,
                                    fontSize: "11px",
                                    transition: "all 0.25s ease",
                                  }}
                                >
                                  {nodeIcon}
                                </div>
                                <span
                                  className={`stepper-node-label mt-1 text-nowrap fw-semibold ${
                                    isCurrent ? "text-dark" : "text-muted"
                                  }`}
                                  style={{ fontSize: "11.5px" }}
                                >
                                  {step.id === 4 && isRejected ? "Not Selected" : step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </div>

      <Footer />
      <BackToTop />

      {/* Scoped CSS */}
      <style jsx>{`
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
        .metric-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06) !important;
        }
        .applied-job-card:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.08) !important;
        }
        .job-title-link:hover {
          color: #4f46e5 !important;
        }
        .spec-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12.5px;
          color: #334155;
          font-weight: 500;
          white-space: nowrap;
        }
        @media (max-width: 767.98px) {
          .applied-card-actions {
            width: 100% !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding-top: 12px;
            margin-top: 6px;
            border-top: 1px solid #f1f5f9;
          }
        }
        @media (min-width: 768px) {
          .applied-card-actions {
            width: auto !important;
          }
        }
        .applied-time-badge {
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }
        .applied-time-badge:hover {
          background-color: #f1f5f9 !important;
          border-color: #cbd5e1 !important;
        }
      `}</style>
    </>
  );
}
