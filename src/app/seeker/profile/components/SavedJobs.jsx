"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Curated avatar gradients
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

  if (min && max) {
    return `${formatNum(min)} - ${formatNum(max)} ${periodText}`;
  }
  return `${formatNum(min || max)} ${periodText}`;
};

const SavedJobs = ({ onUpdated }) => {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const fetchSavedJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seeker/saved-jobs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSavedJobs(data.savedJobs || []);
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const handleRemove = async (jobId) => {
    setRemovingId(jobId);
    try {
      const res = await fetch("/api/seeker/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, action: "unsave" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
        setToastMessage("Job removed from your saved list");
        setTimeout(() => setToastMessage(""), 3000);
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      console.error("Error removing saved job:", err);
    } finally {
      setRemovingId(null);
    }
  };

  const filteredJobs = savedJobs.filter((j) => {
    const term = searchTerm.toLowerCase();
    return (
      (j.job_title || "").toLowerCase().includes(term) ||
      (j.job_company || "").toLowerCase().includes(term) ||
      (j.job_cityid || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="saved-jobs-container">
      {/* Top Header Card */}
      <div
        className="bg-white rounded-4 p-3 p-md-4 mb-4 border"
        style={{
          boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
          borderColor: "#e2e8f0",
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h4 className="fw-bold text-dark mb-0" style={{ fontSize: "1.35rem" }}>
                Saved Jobs
              </h4>
              <span
                className="badge rounded-pill"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  color: "#ffffff",
                  fontSize: "12px",
                  padding: "4px 10px",
                }}
              >
                {savedJobs.length} Bookmarked
              </span>
            </div>
            <p className="text-muted small mb-0">
              Manage and quickly apply to positions you've saved for future reference.
            </p>
          </div>

          <Link
            href="/job-listing"
            className="btn btn-primary btn-sm rounded-pill px-3 py-2 fw-semibold text-white shadow-sm d-inline-flex align-items-center gap-1.5 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
              border: "none",
              fontSize: "13px",
            }}
          >
            <i className="bi bi-search"></i>
            <span>Browse More Jobs</span>
          </Link>
        </div>

        {/* Search Bar (if saved jobs exist) */}
        {savedJobs.length > 0 && (
          <div className="mt-3 pt-3 border-top position-relative" style={{ borderColor: "#f1f5f9" }}>
            <div className="position-relative" style={{ maxWidth: "420px" }}>
              <i
                className="bi bi-search position-absolute text-muted"
                style={{ left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px" }}
              ></i>
              <input
                type="text"
                className="form-control form-control-sm rounded-pill ps-5 pe-4 py-2"
                placeholder="Filter saved jobs by title, company, location..."
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
        )}
      </div>

      {/* Floating Toast Message */}
      {toastMessage && (
        <div
          className="alert alert-dark d-inline-flex align-items-center gap-2 py-2 px-3 rounded-pill shadow-sm mb-3"
          style={{ fontSize: "13px", background: "#1e293b", color: "#ffffff", border: "none" }}
        >
          <i className="bi bi-check-circle-fill text-success"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-4 p-5 text-center border" style={{ borderColor: "#e2e8f0" }}>
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted fw-semibold mb-0">Loading your saved jobs...</p>
        </div>
      ) : savedJobs.length === 0 ? (
        /* Empty State */
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
            <i className="bi bi-bookmark-heart text-primary fs-3"></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">No Saved Jobs Yet</h5>
          <p className="text-muted small mb-4" style={{ maxWidth: "420px", margin: "0 auto" }}>
            When you browse job listings, click the bookmark icon on any position to keep track of it here.
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
            Explore Open Opportunities
          </Link>
        </div>
      ) : filteredJobs.length === 0 ? (
        /* No Search Match */
        <div className="bg-white rounded-4 p-4 text-center border" style={{ borderColor: "#e2e8f0" }}>
          <i className="bi bi-funnel text-muted fs-3 mb-2 d-block"></i>
          <h6 className="fw-bold text-dark mb-1">No matching saved jobs</h6>
          <p className="text-muted small mb-0">Try searching for a different keyword or company name.</p>
        </div>
      ) : (
        /* List of Saved Job Cards */
        <div className="d-flex flex-column gap-3">
          {filteredJobs.map((job) => {
            const companyName = job.job_company || "Dialurbano";
            const companyInitial = companyName.charAt(0).toUpperCase();
            const salaryText = formatSalary(job.job_minsalary, job.job_maxsalary, job.salary_period);
            const isRemoving = removingId === job.id;

            return (
              <div
                key={job.id}
                className="saved-job-card bg-white rounded-4 p-3.5 p-md-4 border position-relative"
                style={{
                  borderColor: "#e2e8f0",
                  boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
                  transition: "all 0.22s ease-in-out",
                  opacity: isRemoving ? 0.5 : 1,
                }}
              >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                  {/* Left: Avatar + Details */}
                  <div className="d-flex align-items-start gap-3 w-100 min-w-0" style={{ flex: "1 1 auto" }}>
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
                          href={`/job-listing/${job.id}`}
                          className="job-title-link text-decoration-none fw-bold text-dark"
                          style={{ fontSize: "16.5px" }}
                        >
                          {job.job_title}
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

                      {/* Spec Badges Row */}
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2.5">
                        <span className="spec-badge">
                          <i className="bi bi-building text-primary"></i>
                          <span>{companyName}</span>
                        </span>
                        {job.job_cityid && (
                          <span className="spec-badge">
                            <i className="bi bi-geo-alt-fill text-danger"></i>
                            <span>{job.job_cityid}</span>
                          </span>
                        )}
                        {(job.job_minexp != null || job.job_maxexp != null) && (
                          <span className="spec-badge">
                            <i className="bi bi-briefcase-fill text-primary"></i>
                            <span>{job.job_minexp || 0}-{job.job_maxexp || 0} yrs</span>
                          </span>
                        )}
                        {job.job_type && (
                          <span className="spec-badge">
                            <i className="bi bi-clock-history text-info"></i>
                            <span>{job.job_type}</span>
                          </span>
                        )}
                      </div>

                      <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                        <i className="bi bi-bookmark-check-fill text-primary"></i>
                        <span>
                          Saved on{" "}
                          {new Date(job.saved_at || job.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="saved-job-actions d-flex align-items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/job-listing/${job.id}`}
                      className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
                      style={{ fontSize: "13px" }}
                    >
                      <span>View Details</span>
                      <i className="bi bi-arrow-right" style={{ fontSize: "12px" }}></i>
                    </Link>

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5"
                      onClick={() => handleRemove(job.id)}
                      disabled={isRemoving}
                      title="Remove from Saved Jobs"
                      style={{ fontSize: "13px" }}
                    >
                      {isRemoving ? (
                        <span className="spinner-border spinner-border-sm" style={{ width: "13px", height: "13px" }} />
                      ) : (
                        <i className="bi bi-trash3"></i>
                      )}
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scoped CSS */}
      <style jsx>{`
        .saved-job-card:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.09) !important;
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
          .saved-job-actions {
            width: 100%;
            justify-content: flex-end;
            padding-top: 12px;
            border-top: 1px solid #f1f5f9;
          }
        }
      `}</style>
    </div>
  );
};

export default SavedJobs;
