"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const renderValue = (value) =>
  value != null && value !== "null" && value !== ""
    ? value
    : <span className="badge bg-light text-primary">NOT MENTIONED</span>;

const JobDetail = ({ job }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isFullPage = pathname.includes("/job-listing/");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("highlights");
  const [applyStatus, setApplyStatus] = useState("");

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

  useEffect(() => setApplyStatus(""), [job?.id]);

  if (!job) {
    return (
      <div className="card shadow-sm p-4 text-center" style={{ maxWidth: 650 }}>
        <h5>Select a Job</h5>
        <p>Apply filters and select a job to view full details.</p>
      </div>
    );
  }

  const scrollTo = (ref, tab) => {
    setActiveTab(tab);
    setTimeout(() => {
      if (ref.current && scrollBoxRef.current) {
        const topPos = ref.current.offsetTop - scrollBoxRef.current.offsetTop;
        scrollBoxRef.current.scrollTo({ top: topPos - 10, behavior: "smooth" });
      }
    }, 80);
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
      setApplyStatus("Failed");
    }
  };

  return (
    <div
      className="shadow-lg rounded-4 p-4 position-relative"
      style={{
        maxHeight: "90vh",
        overflow: "hidden",
        width: "90%",
        maxWidth: "780px",
        marginLeft: "15px",
        background: "white",
        border: "1px solid #e9eef5",
      }}
    >
      {/* HEADER */}
      <h4 className="fw-bold mb-1" style={{ color: "#1a3353" }}>
        {renderValue(job.job_title)}
      </h4>

      <p className="text-muted" style={{ fontSize: "14px" }}>
        <i className="bi bi-buildings me-1"></i>
        {renderValue(job.job_company)}
      </p>

      {/* APPLY BUTTON + Full-page link */}
      <div className="position-absolute top-0 end-0 mt-3 me-3 d-flex flex-column align-items-end gap-2">
        {isLoggedIn ? (
          <button
            className="btn btn-primary btn-sm shadow-sm"
            onClick={handleApply}
            disabled={applyStatus === "loading"}
            style={{
              background: "linear-gradient(to right, #5f85dfff, #0f59ecff)",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
            }}
          >
            {applyStatus === "loading" ? "Applying..." : "Quick Apply"}
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm shadow-sm"
            onClick={() => router.push("/seeker-login")}
            style={{
              background: "linear-gradient(to right, #5f85dfff,  #0f59ecff)",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Login to Apply
          </button>
        )}

        {!isFullPage && (
          <Link href={`/job-listing/${job.id}`} className="small text-primary">
            <i className="bi bi-box-arrow-up-right me-1"></i> Full Page
          </Link>
        )}

        {applyStatus === "success" && (
          <span className="text-success small">✔ Applied Successfully</span>
        )}
        {applyStatus !== "" &&
          applyStatus !== "success" &&
          applyStatus !== "loading" && (
            <span className="text-danger small">{applyStatus}</span>
          )}
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mt-3 mb-3">
        {[
          { key: "highlights", label: "Highlights" },
          { key: "description", label: "Description" },
          { key: "moreinfo", label: "More Info" },
        ].map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
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
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* SCROLLABLE DATA */}
      <div
        ref={scrollBoxRef}
        style={{
          height: "380px",
          overflowY: "auto",
          paddingRight: "8px",
        }}
      >
        {/* Highlights */}
        <section ref={highlightRef}>
          <h6 className="fw-bold mb-2">Highlights</h6>
          <div className="mb-2">
            <i className="bi bi-geo-alt-fill text-primary me-2"></i>
            <strong>Location:</strong> {renderValue(job.job_cityid)}
          </div>
          <div className="mb-2">
            <i className="bi bi-person-fill text-primary me-2"></i>
            <strong>Experience:</strong> {job.job_minexp} - {job.job_maxexp} Years
          </div>
          <div className="mb-2">
            <i className="bi bi-currency-rupee text-primary me-2"></i>
            <strong>Salary:</strong> ₹{job.job_minsalary} - ₹
            {job.job_maxsalary}
          </div>
        </section>

        {/* Description */}
        <section className="mt-4" ref={descRef}>
          <h6 className="fw-bold">Job Description</h6>
          <p style={{ fontSize: "14px" }}>{renderValue(job.job_desc)}</p>
        </section>

        {/* More Info */}
        <section className="mt-4" ref={moreInfoRef}>
          <h6 className="fw-bold mb-2">More Info</h6>

          <p><strong>Job Type:</strong> {renderValue(job.job_type)}</p>
          <p><strong>Industry:</strong> {renderValue(job.indus_name)}</p>
          <p><strong>Role:</strong> {renderValue(job.role_name)}</p>
          <p><strong>Skills:</strong> {renderValue(job.jskill_id)}</p>
          <p><strong>Education:</strong> {renderValue(job.educ_name)}</p>
        </section>
      </div>

      <hr />

      <p className="small text-secondary">
        <strong>Job ID:</strong> {job.id}
      </p>

      {/* ACTION BUTTONS */}
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-outline-primary btn-sm">
          <i className="bi bi-bookmark me-1"></i> Save
        </button>
        <button className="btn btn-outline-warning btn-sm">
          <i className="bi bi-star me-1"></i> Wishlist
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
