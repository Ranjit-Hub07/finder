"use client";

import React from "react";

const JobList = ({ jobs, onSelect, selectedJob, noFilters }) => {
  if (noFilters) {
    return (
      <p className="text-info text-center fw-bold fs-5 mt-4">
        ⚠ Apply filters to see jobs.
      </p>
    );
  }

  if (!jobs?.length) {
    return (
      <p className="text-danger text-center fw-bold fs-5 mt-4">
        ❌ No jobs match your filters.
      </p>
    );
  }

  return (
    <div className="pe-2 position-relative">
      {jobs.map((job) => {
        const createdAt = new Date(job.created_at);
        const daysAgo = Math.floor((new Date() - createdAt) / 86400000);
        const isSelected = selectedJob?.id === job.id;

        return (
          <div key={job.id} className="position-relative">
            <div
              className={`rounded-4 p-3 mb-3 shadow-sm job-card ${
                isSelected ? "border border-primary shadow" : ""
              }`}
              onClick={() => onSelect(job)}
              style={{
                cursor: "pointer",
                background: "#ffffff",
                transition: "0.25s",
                border: "1px solid #e6ecf5",
              }}
            >
              <h6 className="fw-bold mb-1" style={{ color: "#05264e" }}>
                {job.job_title}
              </h6>

              <p className="text-muted mb-2 small">
                <i className="bi bi-building me-1"></i>
                {job.job_company}
              </p>

              <div className="small mb-1">
                <i className="bi bi-geo-alt-fill text-primary me-1"></i>
                <strong>Location:</strong> {job.job_cityid}
              </div>

              <div className="small mb-1">
                <i className="bi bi-person-fill text-primary me-1"></i>
                <strong>Exp:</strong> {job.job_minexp}-{job.job_maxexp} yrs
              </div>

              <div className="small mb-2">
                <i className="bi bi-currency-rupee text-primary me-1"></i>
                <strong>Salary:</strong> ₹{job.job_minsalary}–{job.job_maxsalary}
              </div>

              <span className="badge bg-light text-dark">
                ⏳ {daysAgo} day{daysAgo !== 1 && "s"} ago
              </span>
            </div>

            {/* Arrow outside the card, only if selected */}
            {isSelected && (
              <div
                style={{
                  position: "absolute",
                  right: "-25px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.5rem",
                  color: "#0d6efd",
                }}
              >
                →
              </div>
            )}
          </div>
        );
      })}

      <style jsx>{`
        .job-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default JobList;

