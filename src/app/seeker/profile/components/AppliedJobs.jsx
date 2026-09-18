"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

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

const AppliedJobs = ({ onUpdated }) => {
  const [applications, setApplications] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, reviewed: 0, interview: 0, offered: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawingId, setWithdrawingId] = useState(null);

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

  const handleWithdraw = async (applicationId) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    setWithdrawingId(applicationId);
    try {
      const res = await fetch(`/api/seeker/applied-jobs/${applicationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.application_id !== applicationId));
        setCounts((prev) => ({ ...prev, all: Math.max(0, prev.all - 1) }));
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      console.error("Error withdrawing application:", err);
    } finally {
      setWithdrawingId(null);
    }
  };

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
    <div className="applied-jobs-profile-section">
      {/* Section Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            <i className="bi bi-send-check-fill me-2" style={{ color: "#4f46e5" }}></i>
            Applied Jobs Tracker
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: "13.5px" }}>
            Track your applications, stages, and status updates in real-time.
          </p>
        </div>
        <Link
          href="/seeker/applied-jobs"
          className="btn btn-sm rounded-pill px-3 py-2 fw-semibold text-white d-inline-flex align-items-center gap-1.5 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
            border: "none",
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          <i className="bi bi-box-arrow-up-right" style={{ fontSize: "11px" }}></i>
          Full View
        </Link>
      </div>

      {/* Quick Metrics Row */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {[
          { label: "Total", count: counts.all, icon: "bi-send-fill", color: "#4f46e5", bg: "rgba(99, 102, 241, 0.1)" },
          { label: "Pending", count: counts.pending, icon: "bi-hourglass-split", color: "#d97706", bg: "rgba(245, 158, 11, 0.1)" },
          { label: "Review", count: counts.reviewed, icon: "bi-eye-fill", color: "#0284c7", bg: "rgba(14, 165, 233, 0.1)" },
          { label: "Interview", count: counts.interview, icon: "bi-calendar2-check-fill", color: "#7c3aed", bg: "rgba(139, 92, 246, 0.1)" },
          { label: "Offers", count: counts.offered, icon: "bi-award-fill", color: "#059669", bg: "rgba(16, 185, 129, 0.1)" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border flex-grow-1"
            style={{
              borderColor: "#e2e8f0",
              background: "#fff",
              minWidth: "110px",
              transition: "all 0.2s ease",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
              style={{ width: "32px", height: "32px", background: metric.bg, color: metric.color }}
            >
              <i className={`bi ${metric.icon}`} style={{ fontSize: "14px" }}></i>
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: "16px", color: "#0f172a", lineHeight: 1.2 }}>{metric.count}</div>
              <div className="text-muted" style={{ fontSize: "11px", fontWeight: 500 }}>{metric.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Search */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
        <div
          className="d-flex align-items-center gap-1.5 overflow-x-auto pb-1 pb-md-0"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {[
            { key: "all", label: "All", count: counts.all },
            { key: "pending", label: "Pending", count: counts.pending },
            { key: "reviewed", label: "Reviewed", count: counts.reviewed },
            { key: "interview", label: "Interview", count: counts.interview },
            { key: "offered", label: "Offers", count: counts.offered },
            { key: "rejected", label: "Archived", count: counts.rejected },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1.5 border-0 ${
                  isActive ? "text-white" : "text-secondary"
                }`}
                style={{
                  fontSize: "12.5px",
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
                    fontSize: "10px",
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

        {/* Search */}
        <div className="position-relative flex-shrink-0 w-100 w-md-auto" style={{ maxWidth: "260px" }}>
          <i
            className="bi bi-search position-absolute text-muted"
            style={{ left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "12px" }}
          ></i>
          <input
            type="text"
            className="form-control form-control-sm rounded-pill ps-5 pe-4 py-1.5"
            placeholder="Filter by title, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: "12.5px", border: "1px solid #cbd5e1" }}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn btn-sm btn-link text-muted position-absolute end-0 top-50 translate-middle-y text-decoration-none me-2"
              onClick={() => setSearchTerm("")}
              style={{ fontSize: "11px" }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted fw-semibold mb-0" style={{ fontSize: "13.5px" }}>Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        /* Empty State */
        <div className="text-center py-5 rounded-4 border" style={{ borderColor: "#e2e8f0", background: "#fafbfc" }}>
          <div
            className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "56px", height: "56px", background: "#eff6ff" }}
          >
            <i className="bi bi-send-check-fill text-primary fs-4"></i>
          </div>
          <h6 className="fw-bold text-dark mb-1">No Applications Yet</h6>
          <p className="text-muted small mb-3" style={{ maxWidth: "380px", margin: "0 auto" }}>
            Start applying to job openings and track your progress here.
          </p>
          <Link
            href="/job-listing"
            className="btn btn-primary btn-sm px-4 py-2 rounded-pill fw-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
              border: "none",
              fontSize: "13px",
            }}
          >
            <i className="bi bi-search me-1.5"></i>
            Browse Jobs
          </Link>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-4 rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
          <i className="bi bi-funnel text-muted fs-4 mb-2 d-block"></i>
          <h6 className="fw-bold text-dark mb-1" style={{ fontSize: "14px" }}>No matches</h6>
          <p className="text-muted small mb-0">
            {searchTerm ? "No applications match your search." : "No applications under this category."}
          </p>
        </div>
      ) : (
        /* Application Cards */
        <div className="d-flex flex-column gap-3">
          {filteredApplications.map((app) => {
            const companyName = app.job_company || "Company";
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
            const isWithdrawing = withdrawingId === app.application_id;

            return (
              <div
                key={app.application_id}
                className="bg-white rounded-3 p-3 border position-relative"
                style={{
                  borderColor: "#e2e8f0",
                  boxShadow: "0 1px 6px rgba(15, 23, 42, 0.03)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 6px 18px -3px rgba(15, 23, 42, 0.08)";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 6px rgba(15, 23, 42, 0.03)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                {/* Top: Avatar + Info + Status */}
                <div className="d-flex align-items-start gap-2.5 mb-2.5">
                  {/* Company Avatar */}
                  <div
                    className="flex-shrink-0 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: getAvatarGradient(companyName),
                      fontSize: "16px",
                    }}
                  >
                    {companyInitial}
                  </div>

                  {/* Job Info */}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                      <Link
                        href={`/job-listing/${app.job_id}`}
                        className="text-decoration-none fw-bold text-dark"
                        style={{ fontSize: "14.5px" }}
                        onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
                        onMouseLeave={(e) => (e.target.style.color = "#0f172a")}
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
                            fontSize: "11px",
                            padding: "2px 8px",
                          }}
                        >
                          {salaryText}
                        </span>
                      )}
                    </div>

                    {/* Compact meta */}
                    <div className="d-flex flex-wrap align-items-center gap-2 text-muted mb-2" style={{ fontSize: "12px" }}>
                      <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-building text-primary" style={{ fontSize: "11px" }}></i>
                        {companyName}
                      </span>
                      {app.job_cityid && (
                        <span className="d-flex align-items-center gap-1">
                          <i className="bi bi-geo-alt-fill text-danger" style={{ fontSize: "11px" }}></i>
                          {app.job_cityid}
                        </span>
                      )}
                      {app.job_type && (
                        <span className="d-flex align-items-center gap-1">
                          <i className="bi bi-clock-history text-info" style={{ fontSize: "11px" }}></i>
                          {app.job_type}
                        </span>
                      )}
                    </div>

                    {/* Date and Timing */}
                    <div className="d-flex flex-wrap align-items-center gap-2 pt-1.5" style={{ borderTop: "1px dashed #e2e8f0" }}>
                      {appliedInfo && (
                        <span
                          className="d-inline-flex align-items-center gap-1.5 px-2.5 py-0.5 rounded-pill"
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            color: "#475569",
                            fontSize: "11.5px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <i className="bi bi-calendar-check text-primary" style={{ fontSize: "11px" }}></i>
                          <span className="text-muted">Applied:</span>
                          <span className="fw-semibold text-dark">{appliedInfo.date}</span>
                          <span className="text-secondary" style={{ fontSize: "10.5px" }}>• {appliedInfo.time}</span>
                        </span>
                      )}
                      {hasUpdated && updatedInfo && (
                        <span
                          className="d-inline-flex align-items-center gap-1.5 px-2.5 py-0.5 rounded-pill"
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            color: "#475569",
                            fontSize: "11.5px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <i className="bi bi-arrow-repeat text-info" style={{ fontSize: "11px" }}></i>
                          <span className="text-muted">Updated:</span>
                          <span className="fw-semibold text-dark">{updatedInfo.date}</span>
                          <span className="text-secondary" style={{ fontSize: "10.5px" }}>• {updatedInfo.time}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="d-flex flex-column align-items-end gap-1.5 flex-shrink-0">
                    <span
                      className="d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill fw-semibold"
                      style={{
                        backgroundColor: statusDetails.badgeBg,
                        color: statusDetails.badgeColor,
                        border: `1px solid ${statusDetails.badgeBorder}`,
                        fontSize: "11.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <i className={`bi ${statusDetails.icon}`} style={{ fontSize: "11px" }}></i>
                      {statusDetails.label}
                    </span>

                    <div className="d-flex align-items-center gap-1">
                      <Link
                        href={`/job-listing/${app.job_id}`}
                        className="btn btn-outline-primary rounded-pill px-2 py-0.5 fw-semibold d-inline-flex align-items-center gap-1"
                        style={{ fontSize: "11px", whiteSpace: "nowrap" }}
                      >
                        View
                        <i className="bi bi-arrow-right" style={{ fontSize: "10px" }}></i>
                      </Link>
                      {(app.application_status || "Pending") === "Pending" && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary rounded-pill px-2 py-0.5 fw-semibold d-inline-flex align-items-center gap-1"
                          style={{ fontSize: "11px", whiteSpace: "nowrap" }}
                          disabled={isWithdrawing}
                          onClick={() => handleWithdraw(app.application_id)}
                        >
                          {isWithdrawing ? (
                            <span className="spinner-border spinner-border-sm" style={{ width: "10px", height: "10px" }}></span>
                          ) : (
                            <i className="bi bi-x-circle" style={{ fontSize: "10px" }}></i>
                          )}
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mini Pipeline Stepper */}
                <div className="pt-2 border-top" style={{ borderColor: "#f1f5f9 !important" }}>
                  <div className="position-relative">
                    <div className="d-flex justify-content-between align-items-center position-relative">
                      {/* Background track */}
                      <div
                        className="position-absolute start-0 end-0 top-50 translate-middle-y"
                        style={{ height: "2px", backgroundColor: "#e2e8f0", zIndex: 1, margin: "0 16px" }}
                      />
                      {/* Active track */}
                      <div
                        className="position-absolute start-0 top-50 translate-middle-y"
                        style={{
                          height: "2px",
                          backgroundColor: isRejected ? "#94a3b8" : "#4f46e5",
                          zIndex: 2,
                          margin: "0 16px",
                          width: isRejected ? "100%" : `${((Math.min(currentStep, 4) - 1) / 3) * 100}%`,
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
                          nodeIcon = <i className="bi bi-x-lg" style={{ fontSize: "8px" }} />;
                        } else if (isCompleted) {
                          nodeBg = "#4f46e5";
                          nodeBorder = "#4f46e5";
                          nodeColor = "#ffffff";
                          nodeIcon = <i className="bi bi-check-lg" style={{ fontSize: "10px" }} />;
                        }

                        return (
                          <div
                            key={step.id}
                            className="d-flex flex-column align-items-center position-relative"
                            style={{ zIndex: 3 }}
                          >
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: "22px",
                                height: "22px",
                                backgroundColor: nodeBg,
                                border: `2px solid ${nodeBorder}`,
                                color: nodeColor,
                                fontSize: "9px",
                                transition: "all 0.25s ease",
                              }}
                            >
                              {nodeIcon}
                            </div>
                            <span
                              className={`mt-1 text-nowrap fw-semibold ${isCurrent ? "text-dark" : "text-muted"}`}
                              style={{ fontSize: "10px" }}
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

      <style jsx>{`
        .applied-jobs-profile-section .form-control:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AppliedJobs;
