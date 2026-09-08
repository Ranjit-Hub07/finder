"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function JobDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [tab, setTab] = useState("highlights");
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  function renderValue(value) {
    if (!value) return "N/A";
    if (Array.isArray(value)) return value.join(", ");
    return value;
  }

  useEffect(() => {
    if (!id) return;

    async function fetchJob() {
      try {
        const res = await fetch(`/api/recruiter/job/${id}`);
        if (!res.ok) throw new Error("Failed to fetch job");

        const data = await res.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center mt-5">Loading...</div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="container text-center mt-5 text-danger">Job not found.</div>
      </>
    );
  }

  const experience = `${job.job_minexp ?? 0} - ${job.job_maxexp ?? 0} Years`;
  const salary = `₹${job.job_minsalary ?? 0} - ₹${job.job_maxsalary ?? 0} ${job.salary_period ?? ""}`;

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "120px", minHeight: "100vh", background: "linear-gradient(135deg, #f5f9ff 0%, #eef3ff 100%)" }}>
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <div
                className="card shadow-lg border-0 rounded-4"
                style={{
                  background: "linear-gradient(to bottom, #ffffff, #f7f9fc)",
                }}
              >
                <div className="card-body p-4">

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h3 className="mb-1 fw-bold text-dark">{job.job_title}</h3>
                      <p className="text-muted mb-0 fs-6">
                        <i className="bi bi-building me-1"></i> {job.job_company}
                      </p>
                    </div>

                    <button
                      className="btn btn-primary px-4 py-2 rounded-3 shadow-sm fw-semibold"
                      onClick={() => router.push(`/recruiter/job/job-edit/${id}`)}
                    >
                      <i className="bi bi-pencil-square me-2"></i> Edit Post
                    </button>
                  </div>

                  {/* 🚀 Modern Rounded Pills Tabs */}
                  <div className="d-flex gap-2 mb-4 pb-2 border-bottom">
                    <button
                      className={`px-4 py-2 rounded-pill fw-semibold ${
                        tab === "highlights"
                          ? "bg-primary text-white shadow-sm"
                          : "bg-light text-secondary"
                      }`}
                      onClick={() => setTab("highlights")}
                    >
                      Highlights
                    </button>

                    <button
                      className={`px-4 py-2 rounded-pill fw-semibold ${
                        tab === "description"
                          ? "bg-primary text-white shadow-sm"
                          : "bg-light text-secondary"
                      }`}
                      onClick={() => setTab("description")}
                    >
                      Description
                    </button>

                    <button
                      className={`px-4 py-2 rounded-pill fw-semibold ${
                        tab === "info"
                          ? "bg-primary text-white shadow-sm"
                          : "bg-light text-secondary"
                      }`}
                      onClick={() => setTab("info")}
                    >
                      More Info
                    </button>
                  </div>

                  {/* Content */}
                  <div className="mt-4 px-2">

                    {/* Highlights */}
                    {tab === "highlights" && (
                      <div className="row text-secondary">
                        <div className="col-12 mb-3">
                          <strong className="text-dark me-2">
                            <i className="bi bi-geo-alt-fill text-primary me-1"></i>
                            Location:
                          </strong>
                          {renderValue(job.job_cityid)}
                        </div>

                        <div className="col-12 mb-3">
                          <strong className="text-dark me-2">
                            <i className="bi bi-briefcase-fill text-primary me-1"></i>
                            Experience:
                          </strong>
                          {experience}
                        </div>

                        <div className="col-12 mb-3">
                          <strong className="text-dark me-2">
                            <i className="bi bi-cash-stack text-primary me-1"></i>
                            Salary:
                          </strong>
                          {salary}
                        </div>

                        <div className="col-12 mb-3">
                          <strong className="text-dark me-2">
                            <i className="bi bi-lightning-fill text-warning me-1"></i>
                            Skills:
                          </strong>
                          {renderValue(job.job_skills)}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {tab === "description" && (
                      <div className="p-3 rounded" style={{ background: "#f8faff" }}>
                        <p className="text-muted mb-0">{job.job_desc || "No description provided."}</p>
                      </div>
                    )}

                    {/* More Info */}
                    {tab === "info" && (
                      <div className="text-muted">
                        <p>
                          <i className="bi bi-briefcase-fill text-primary me-2"></i>
                          <strong>Job Type:</strong> {renderValue(job.job_type)}
                        </p>

                        <p>
                          <i className="bi bi-building text-primary me-2"></i>
                          <strong>Industry:</strong> {renderValue(job.industry_name)}
                        </p>

                        <p>
                          <i className="bi bi-person-workspace text-primary me-2"></i>
                          <strong>Job Role:</strong> {renderValue(job.job_role_name)}
                        </p>

                        <p>
                          <i className="bi bi-mortarboard-fill text-primary me-2"></i>
                          <strong>Minimum Education:</strong> {renderValue(job.education_name)}
                        </p>

                        <p>
                          <strong>Website:</strong>{" "}
                          <a href={job.website_link} target="_blank" rel="noreferrer" className="text-primary">
                            {job.website_link || "N/A"}
                          </a>
                        </p>

                        <p>
                          <strong>Email:</strong> {job.job_reqemail || "N/A"}
                        </p>

                        <p>
                          <strong>Phone:</strong> {job.job_reqmob || "N/A"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <hr className="mt-4" />
                  <p className="text-muted mt-2 mb-0 small">
                    <strong>Job ID:</strong> {id}
                  </p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
      <style jsx global>{`
        *:not(input):not(textarea):not(select) {
          caret-color: transparent !important;
        }
        input,
        textarea,
        select {
          caret-color: auto !important;
        }
      `}</style>
    </>
  );
}
