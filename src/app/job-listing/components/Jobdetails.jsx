"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// Curated gradients for company avatar badges
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
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} Lakh`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  const periodText = period ? `/${period.replace("per ", "").replace("/month", "mo").replace("/year", "yr")}` : "/month";

  if (min && max) {
    return `${formatNum(min)} - ${formatNum(max)} ${periodText}`;
  }
  return `${formatNum(min || max)} ${periodText}`;
};

const JobDetail = ({ job }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isFullPage = pathname.includes("/job-listing/");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("highlights");
  const [applyStatus, setApplyStatus] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveToast, setSaveToast] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const highlightRef = useRef(null);
  const descRef = useRef(null);
  const moreInfoRef = useRef(null);
  const scrollBoxRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        setIsLoggedIn(res.ok && data.user?.role === "seeker");
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch saved status when selected job changes
  useEffect(() => {
    setApplyStatus("");
    setCopiedLink(false);
    setSaveToast("");

    const checkSavedStatus = async () => {
      if (!job?.id) return;
      try {
        const res = await fetch(`/api/seeker/saved-jobs?job_id=${job.id}`);
        if (res.ok) {
          const data = await res.json();
          setIsSaved(Boolean(data.isSaved));
        }
      } catch {
        // fail silently for guests
      }
    };

    checkSavedStatus();
  }, [job?.id]);

  const handleSaveToggle = async () => {
    if (!job?.id) return;

    if (!isLoggedIn) {
      router.push("/seeker-login");
      return;
    }

    setSaveLoading(true);
    try {
      const res = await fetch("/api/seeker/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: job.id, action: "toggle" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSaved(data.isSaved);
        setSaveToast(data.message);
        setTimeout(() => setSaveToast(""), 3000);
      } else if (res.status === 401 || data.requiresLogin) {
        setIsLoggedIn(false);
        router.push("/seeker-login");
      } else {
        setSaveToast(data.message || "Could not update saved job");
        setTimeout(() => setSaveToast(""), 3000);
      }
    } catch (err) {
      console.error("Error saving job:", err);
      setSaveToast("Something went wrong");
      setTimeout(() => setSaveToast(""), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-3 w-100" style={{ background: "#ffffff", maxWidth: "780px", margin: "0 auto" }}>
        <div
          className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "64px", height: "64px", background: "#f1f5f9" }}
        >
          <i className="bi bi-briefcase text-secondary fs-3"></i>
        </div>
        <h5 className="fw-bold text-dark mb-1">No Job Selected</h5>
        <p className="text-muted small mb-0">Select any position from the list on the left to preview complete details and apply.</p>
      </div>
    );
  }

  const scrollTo = (ref, tab) => {
    setActiveTab(tab);
    if (ref.current && scrollBoxRef.current) {
      const topPos = ref.current.offsetTop - scrollBoxRef.current.offsetTop;
      scrollBoxRef.current.scrollTo({ top: Math.max(0, topPos - 12), behavior: "smooth" });
    }
  };

  const handleApply = async () => {
    setApplyStatus("loading");
    try {
      const res = await fetch("/api/seeker/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: job.id, candidate_desc: "" }),
      });
      const data = await res.json();
      setApplyStatus(res.ok ? "success" : data.message || "Failed");
    } catch {
      setApplyStatus("Failed to submit application");
    }
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/job-listing/${job.id}` : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const companyName = job.job_company || "Dialurbano";
  const companyInitial = companyName.charAt(0).toUpperCase();
  const salaryDisplay = formatSalary(job.job_minsalary, job.job_maxsalary, job.salary_period);

  // Extract skills into array
  const skillsArray = typeof job.jskill_id === "string" && job.jskill_id.trim() && job.jskill_id !== "null"
    ? job.jskill_id.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="job-detail-card shadow-sm rounded-4 w-100 position-relative d-flex flex-column"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        maxWidth: "840px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* 1. HERO HEADER */}
      <div className="p-3 p-md-4 border-bottom" style={{ background: "linear-gradient(180deg, #fafcff 0%, #ffffff 100%)", borderColor: "#e2e8f0" }}>
        {/* Top Row: Avatar + Title + Quick Icon Actions */}
        <div className="d-flex align-items-center justify-content-between gap-3 mb-2.5">
          <div className="d-flex align-items-center gap-3 min-w-0">
            <div
              className="company-avatar-lg flex-shrink-0 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "14px",
                background: getAvatarGradient(companyName),
                fontSize: "20px",
              }}
            >
              {companyInitial}
            </div>

            <div className="min-w-0">
              <h4 className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: "1.3rem", letterSpacing: "-0.01em" }} title={job.job_title}>
                {job.job_title}
              </h4>
            </div>
          </div>

          {/* Quick Icon Actions: Save & Share */}
          <div className="d-flex align-items-center gap-1.5 flex-shrink-0">
            <div className="position-relative">
              <button
                type="button"
                className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center border ${
                  isSaved ? "btn-light text-primary border-primary shadow-sm" : "btn-light text-secondary"
                }`}
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: isSaved ? "#eff6ff" : "#ffffff",
                  transition: "all 0.18s ease",
                }}
                onClick={handleSaveToggle}
                disabled={saveLoading}
                title={isSaved ? "Saved (click to remove)" : "Save Job"}
              >
                {saveLoading ? (
                  <span
                    className="spinner-border spinner-border-sm text-primary"
                    style={{ width: "13px", height: "13px" }}
                  />
                ) : (
                  <i
                    className={`bi ${isSaved ? "bi-bookmark-fill text-primary" : "bi-bookmark"}`}
                    style={{ fontSize: "14px" }}
                  ></i>
                )}
              </button>

              {saveToast && (
                <span
                  className="position-absolute bg-dark text-white rounded px-2 py-1 shadow-sm"
                  style={{
                    bottom: "calc(100% + 6px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                    zIndex: 20,
                  }}
                >
                  {saveToast}
                </span>
              )}
            </div>

            <button
              type="button"
              className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center border text-secondary position-relative"
              style={{ width: "36px", height: "36px" }}
              onClick={handleShare}
              title="Share Job"
            >
              <i className="bi bi-share"></i>
              {copiedLink && (
                <span
                  className="position-absolute bg-dark text-white rounded px-2 py-0.5"
                  style={{ top: "-28px", fontSize: "10px", whiteSpace: "nowrap" }}
                >
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Second Row: Metadata Badge Pills (Each item is a chip so it NEVER wraps into lone dots) */}
        <div className="d-flex flex-wrap align-items-center gap-1.5 mb-3">
          <span className="badge-meta">
            <i className="bi bi-building text-primary"></i>
            <span className="fw-semibold text-dark">{companyName}</span>
          </span>

          <span className="badge-meta">
            <i className="bi bi-geo-alt-fill text-danger"></i>
            <span>{job.job_cityid || "Multiple Locations"}</span>
          </span>

          {job.created_at && (
            <span className="badge-meta">
              <i className="bi bi-calendar3 text-muted"></i>
              <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
            </span>
          )}

          {job.job_type && (
            <span className="badge-meta">
              <i className="bi bi-clock-history text-info"></i>
              <span>{job.job_type}</span>
            </span>
          )}
        </div>

        {/* Third Row: Prominent CTA Apply Bar */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          {isLoggedIn ? (
            <button
              className="btn btn-primary btn-sm px-4 py-2 rounded-pill fw-semibold shadow-sm text-white"
              onClick={handleApply}
              disabled={applyStatus === "loading" || applyStatus === "success"}
              style={{
                background: applyStatus === "success" ? "#059669" : "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                border: "none",
                fontSize: "13.5px",
                minWidth: "130px",
              }}
            >
              {applyStatus === "loading" ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                  Applying...
                </>
              ) : applyStatus === "success" ? (
                <>
                  <i className="bi bi-check-circle-fill me-1"></i> Applied
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill me-1"></i> Quick Apply
                </>
              )}
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm px-4 py-2 rounded-pill fw-semibold shadow-sm text-white"
              onClick={() => router.push("/seeker-login")}
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                border: "none",
                fontSize: "13.5px",
                minWidth: "130px",
              }}
            >
              Login to Apply
            </button>
          )}

          {!isFullPage && (
            <Link
              href={`/job-listing/${job.id}`}
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 fw-medium d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: "13px" }}
            >
              <span>Full Details</span>
              <i className="bi bi-box-arrow-up-right" style={{ fontSize: "11px" }}></i>
            </Link>
          )}
        </div>

        {/* Application Status Banner */}
        {applyStatus === "success" && (
          <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mt-3 mb-0 rounded-3 small">
            <i className="bi bi-check-circle-fill fs-6"></i>
            <span>Application submitted successfully! The recruiter will review your profile.</span>
          </div>
        )}
        {applyStatus && applyStatus !== "success" && applyStatus !== "loading" && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mt-3 mb-0 rounded-3 small">
            <i className="bi bi-exclamation-triangle-fill fs-6"></i>
            <span>{applyStatus}</span>
          </div>
        )}
      </div>

      {/* 2. SEGMENTED TABS */}
      <div className="px-3 px-md-4 pt-3 pb-2 border-bottom bg-white">
        <div className="segmented-tab-bar p-1 rounded-pill d-inline-flex gap-1" style={{ background: "#f1f5f9" }}>
          {[
            { key: "highlights", label: "Highlights", icon: "bi-lightning-charge" },
            { key: "description", label: "Description", icon: "bi-file-text" },
            { key: "moreinfo", label: "Details & Skills", icon: "bi-info-circle" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`btn btn-sm rounded-pill border-0 d-inline-flex align-items-center gap-1 px-3 py-1.5 fw-semibold ${
                activeTab === tab.key ? "bg-white text-primary shadow-sm" : "text-secondary"
              }`}
              onClick={() =>
                scrollTo(
                  tab.key === "highlights"
                    ? highlightRef
                    : tab.key === "description"
                    ? descRef
                    : moreInfoRef,
                  tab.key
                )
              }
              style={{ fontSize: "13px", transition: "all 0.15s ease" }}
            >
              <i className={`bi ${tab.icon}`} style={{ fontSize: "12px" }}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. SCROLLABLE CONTENT BODY */}
      <div
        ref={scrollBoxRef}
        className="detail-scroll-box flex-grow-1 p-3 p-md-4"
        style={{
          overflowY: "auto",
          maxHeight: "calc(90vh - 240px)",
        }}
      >
        {/* SECTION 1: HIGHLIGHTS BENTO GRID */}
        <section ref={highlightRef} className="mb-4">
          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-stars text-primary"></i>
            <span>Role Highlights</span>
          </h6>

          <div className="bento-grid">
            {/* Metric 1: Salary */}
            <div className="bento-card">
              <div className="bento-icon-box bg-emerald-subtle text-success">
                <i className="bi bi-cash-stack fs-5"></i>
              </div>
              <div>
                <span className="bento-label">COMPENSATION</span>
                <p className="bento-value mb-0 text-success fw-bold">{salaryDisplay}</p>
              </div>
            </div>

            {/* Metric 2: Experience */}
            <div className="bento-card">
              <div className="bento-icon-box bg-blue-subtle text-primary">
                <i className="bi bi-briefcase-fill fs-5"></i>
              </div>
              <div>
                <span className="bento-label">EXPERIENCE</span>
                <p className="bento-value mb-0">
                  {job.job_minexp != null || job.job_maxexp != null
                    ? `${job.job_minexp || 0} - ${job.job_maxexp || 0} Years`
                    : "Not Specified"}
                </p>
              </div>
            </div>

            {/* Metric 3: Location */}
            <div className="bento-card">
              <div className="bento-icon-box bg-rose-subtle text-danger">
                <i className="bi bi-geo-alt-fill fs-5"></i>
              </div>
              <div>
                <span className="bento-label">LOCATION</span>
                <p className="bento-value mb-0">{job.job_cityid || "Remote / Anywhere"}</p>
              </div>
            </div>

            {/* Metric 4: Job Type */}
            <div className="bento-card">
              <div className="bento-icon-box bg-indigo-subtle text-indigo">
                <i className="bi bi-clock-history fs-5"></i>
              </div>
              <div>
                <span className="bento-label">EMPLOYMENT TYPE</span>
                <p className="bento-value mb-0">{job.job_type || "Full Time"}</p>
              </div>
            </div>

            {/* Metric 5: Industry */}
            <div className="bento-card">
              <div className="bento-icon-box bg-amber-subtle text-warning">
                <i className="bi bi-buildings-fill fs-5"></i>
              </div>
              <div>
                <span className="bento-label">INDUSTRY</span>
                <p className="bento-value mb-0">{job.indus_name || "General IT / Software"}</p>
              </div>
            </div>

            {/* Metric 6: Education */}
            <div className="bento-card">
              <div className="bento-icon-box bg-purple-subtle text-purple">
                <i className="bi bi-mortarboard-fill fs-5"></i>
              </div>
              <div>
                <span className="bento-label">EDUCATION</span>
                <p className="bento-value mb-0">{job.educ_name || "Any Graduate"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: JOB DESCRIPTION */}
        <section ref={descRef} className="mb-4 pt-2">
          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-text-fill text-primary"></i>
            <span>Job Description</span>
          </h6>
          <div
            className="p-3.5 rounded-3"
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#334155",
              fontSize: "14.5px",
              lineHeight: "1.7",
              whiteSpace: "pre-line",
            }}
          >
            {job.job_desc ? (
              job.job_desc
            ) : (
              <p className="text-muted mb-0 fst-italic">
                The recruiter has not provided a full detailed description yet. Please refer to the highlights and role requirements above.
              </p>
            )}
          </div>
        </section>

        {/* SECTION 3: MORE INFO & SKILLS */}
        <section ref={moreInfoRef} className="pt-2">
          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-card-checklist text-primary"></i>
            <span>Requirements & Skills</span>
          </h6>

          {/* Skills Tag Cloud */}
          <div className="mb-3">
            <span className="text-muted small fw-semibold d-block mb-2 text-uppercase" style={{ letterSpacing: "0.5px" }}>
              Key Skills
            </span>
            {skillsArray.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {skillsArray.map((skill, idx) => (
                  <span
                    key={idx}
                    className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 fw-medium"
                    style={{ fontSize: "13px" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-muted small fst-italic p-2 rounded bg-light d-inline-block">
                No specific technical skills specified by the recruiter.
              </div>
            )}
          </div>

          {/* Role & Hierarchy Specs List */}
          <div className="p-3 rounded-3 mt-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div className="row g-2 small">
              <div className="col-sm-6">
                <span className="text-muted">Designation / Role:</span>
                <p className="fw-semibold text-dark mb-0">{job.role_name || job.job_title || "Standard Position"}</p>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Domain Sector:</span>
                <p className="fw-semibold text-dark mb-0">{job.indus_name || "Information Technology"}</p>
              </div>
              <div className="col-sm-6 pt-2">
                <span className="text-muted">Qualification:</span>
                <p className="fw-semibold text-dark mb-0">{job.educ_name || "Graduate / Degree"}</p>
              </div>
              <div className="col-sm-6 pt-2">
                <span className="text-muted">Working Mode:</span>
                <p className="fw-semibold text-dark mb-0">{job.job_type || "Full Time"}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. FOOTER META BAR */}
      <div
        className="p-3 border-top bg-light d-flex align-items-center justify-content-between text-muted small"
        style={{ borderColor: "#e2e8f0", fontSize: "12px" }}
      >
        <span>
          <strong>Job Reference ID:</strong> <code className="text-secondary bg-white px-2 py-0.5 rounded border">{job.id}</code>
        </span>
        <span className="text-muted">
          Secured by <span className="fw-bold text-primary">FINDER</span>
        </span>
      </div>

      {/* SCOPED STYLING */}
      <style jsx>{`
        .badge-meta {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12px;
          color: #475569;
          font-weight: 500;
          white-space: nowrap;
        }
        .badge-meta i {
          font-size: 12px;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
        }
        .bento-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: border-color 0.15s ease;
        }
        .bento-card:hover {
          border-color: #cbd5e1;
        }
        .bento-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bg-emerald-subtle {
          background-color: #ecfdf5;
        }
        .bg-blue-subtle {
          background-color: #eff6ff;
        }
        .bg-rose-subtle {
          background-color: #fff1f2;
        }
        .bg-indigo-subtle {
          background-color: #eef2ff;
        }
        .text-indigo {
          color: #4f46e5;
        }
        .bg-amber-subtle {
          background-color: #fffbeb;
        }
        .bg-purple-subtle {
          background-color: #faf5ff;
        }
        .text-purple {
          color: #9333ea;
        }
        .bento-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.5px;
        }
        .bento-value {
          font-size: 13.5px;
          font-weight: 600;
          color: #0f172a;
        }
        .detail-scroll-box::-webkit-scrollbar {
          width: 6px;
        }
        .detail-scroll-box::-webkit-scrollbar-track {
          background: transparent;
        }
        .detail-scroll-box::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .detail-scroll-box::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default JobDetail;
