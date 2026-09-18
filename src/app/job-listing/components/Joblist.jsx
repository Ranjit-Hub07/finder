"use client";

import React from "react";

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

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently";
  const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
};

const formatSalary = (min, max, period) => {
  if (!min && !max) return null;
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

const JobList = ({ jobs, onSelect, selectedJob, noFilters }) => {
  if (noFilters) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4 text-center my-3" style={{ background: "#ffffff" }}>
        <div
          className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "54px", height: "54px", background: "#f0fdf4" }}
        >
          <i className="bi bi-funnel text-success fs-4"></i>
        </div>
        <h6 className="fw-bold text-dark mb-1">Explore Open Positions</h6>
        <p className="text-muted small mb-0">Use the filter pills above to browse jobs by location, experience, salary and role.</p>
      </div>
    );
  }

  if (!jobs?.length) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4 text-center my-3" style={{ background: "#ffffff" }}>
        <div
          className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "54px", height: "54px", background: "#fef2f2" }}
        >
          <i className="bi bi-search text-danger fs-4"></i>
        </div>
        <h6 className="fw-bold text-dark mb-1">No Matching Jobs Found</h6>
        <p className="text-muted small mb-0">Try adjusting your filters or search keywords to discover more opportunities.</p>
      </div>
    );
  }

  return (
    <div className="job-list-wrapper">
      {jobs.map((job) => {
        const isSelected = selectedJob?.id === job.id;
        const companyName = job.job_company || "Dialurbano";
        const companyInitial = companyName.charAt(0).toUpperCase();
        const salaryText = formatSalary(job.job_minsalary, job.job_maxsalary, job.salary_period);
        const timeAgo = formatTimeAgo(job.created_at);

        return (
          <div
            key={job.id}
            className={`modern-job-card mb-3 position-relative ${isSelected ? "card-selected" : ""}`}
            onClick={() => onSelect(job)}
          >
            {/* Left Gradient Indicator Bar for Selected Card */}
            {isSelected && <div className="selected-indicator-bar" />}

            <div className="card-body-content p-3">
              {/* Header: Company Avatar + Title + Status/Time */}
              <div className="d-flex align-items-start gap-2.5 mb-2">
                {/* Company Squircle Avatar */}
                <div
                  className="company-avatar flex-shrink-0 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: getAvatarGradient(companyName),
                    fontSize: "18px",
                  }}
                >
                  {companyInitial}
                </div>

                {/* Job Title & Company Info */}
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-center justify-content-between gap-1">
                    <h6 className="job-title mb-0 text-truncate" title={job.job_title}>
                      {job.job_title}
                    </h6>
                    {isSelected ? (
                      <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5 fw-semibold flex-shrink-0" style={{ fontSize: "10.5px" }}>
                        <i className="bi bi-check2 me-0.5"></i> Viewing
                      </span>
                    ) : (
                      <span className="text-muted small flex-shrink-0" style={{ fontSize: "11px" }}>
                        <i className="bi bi-clock me-1"></i>{timeAgo}
                      </span>
                    )}
                  </div>
                  <p className="company-name text-muted text-truncate mb-0 mt-0.5" style={{ fontSize: "13px" }}>
                    <i className="bi bi-building me-1 opacity-75"></i>
                    {companyName}
                  </p>
                </div>
              </div>

              {/* Middle Section: Spec Tag Pills */}
              <div className="d-flex flex-wrap gap-1.5 my-2">
                {job.job_cityid && (
                  <span className="spec-tag">
                    <i className="bi bi-geo-alt-fill text-primary"></i>
                    <span>{job.job_cityid}</span>
                  </span>
                )}
                {(job.job_minexp != null || job.job_maxexp != null) && (
                  <span className="spec-tag">
                    <i className="bi bi-briefcase-fill text-primary"></i>
                    <span>{job.job_minexp || 0}-{job.job_maxexp || 0} yrs</span>
                  </span>
                )}
                {job.job_type && (
                  <span className="spec-tag">
                    <i className="bi bi-clock-history text-primary"></i>
                    <span>{job.job_type}</span>
                  </span>
                )}
              </div>

              {/* Bottom Footer: Salary + View Action */}
              <div className="d-flex align-items-center justify-content-between pt-2 mt-1 border-top" style={{ borderColor: "#f1f5f9" }}>
                <div>
                  {salaryText ? (
                    <span className="job-salary fw-bold" style={{ color: "#059669", fontSize: "13.5px" }}>
                      {salaryText}
                    </span>
                  ) : (
                    <span className="text-muted small" style={{ fontSize: "12px" }}>
                      Salary: Not disclosed
                    </span>
                  )}
                </div>

                <div className="card-action-hint d-flex align-items-center gap-1 small fw-semibold">
                  {isSelected ? (
                    <span className="text-primary" style={{ fontSize: "12px" }}>
                      Details open <i className="bi bi-chevron-right"></i>
                    </span>
                  ) : (
                    <span className="text-muted text-hover-primary" style={{ fontSize: "12px" }}>
                      View details <i className="bi bi-arrow-right"></i>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .modern-job-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03);
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        .modern-job-card:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
        }
        .modern-job-card.card-selected {
          background: #ffffff;
          border-color: #3b82f6 !important;
          box-shadow: 0 10px 25px -4px rgba(59, 130, 246, 0.16), 0 0 0 1px #3b82f6 !important;
        }
        .selected-indicator-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #4f46e5 0%, #06b6d4 100%);
          border-top-left-radius: 16px;
          border-bottom-left-radius: 16px;
        }
        .job-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          transition: color 0.15s ease;
        }
        .modern-job-card:hover .job-title {
          color: #2563eb;
        }
        .card-selected .job-title {
          color: #1d4ed8;
        }
        .spec-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12px;
          color: #334155;
          font-weight: 500;
        }
        .spec-tag i {
          font-size: 11px;
        }
        .card-selected .spec-tag {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #1e40af;
        }
      `}</style>
    </div>
  );
};

export default JobList;
