"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Candidates = ({ title }) => {
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [status, setStatus] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load job roles
  useEffect(() => {
    axios
      .get("/api/recruiter/job/job-role")
      .then((res) => setJobRoles(res.data || []))
      .catch((err) => console.error("Error fetching job roles:", err));
  }, []);

  // Fetch candidates when filters change
  useEffect(() => {
    if (!selectedJob && !status) {
      setCandidates([]);
      return;
    }

    fetchCandidates();
  }, [selectedJob, status]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      // ✅ Send ONLY valid params
      const params = {};
     if (selectedJob) params.role = selectedJob;
     if (status) params.status = status;

      const res = await axios.get("/api/recruiter/candidate", { params });
      setCandidates(res.data || []);
    } catch (error) {
      console.error("Error loading candidates:", error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Topbar />

      <div
        style={{
          paddingTop: "175px",
          background: "linear-gradient(135deg, #f5f8ff 0%, #ebf1ff 100%)",
          minHeight: "100vh",
          paddingBottom: "40px",
        }}
      >
        <div
          className="mx-auto p-4 p-md-4"
          style={{
            maxWidth: "90%",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "14px",
            border: "1px solid #e6e9f2",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.08)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* Header & Filters */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <h4 className="fw-bold" style={{ color: "#05264e", fontSize: "22px" }}>
              {title || "Candidate Applications"}
            </h4>

            <div className="d-flex flex-column flex-md-row gap-2">
              <select
                className="form-select shadow-sm"
                style={{ width: "260px", height: "47px" }}
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option value="">Choose Job</option>
                {jobRoles.map((job) => (
                 <option key={job.role_id} value={job.role_name}>
                   {job.role_name}
                   </option>

                ))}
              </select>

              <select
                className="form-select shadow-sm"
                style={{ width: "260px", height: "47px" }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Choose Status</option>
                <option value="Pending">Awaiting Review</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Phone Screened">Phone Screened</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Offer Made">Offer Made</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  {["SL", "NAME", "MESSAGE", "JOB", "STATUS", "LOCATION", "EDUCATION", "DATE"].map(
                    (head) => (
                      <th key={head}>{head}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-3">
                      Loading candidates...
                    </td>
                  </tr>
                ) : candidates.length ? (
                  candidates.map((c, index) => {
                    const jobId = c.jobId || c.job_id;
                    const seekerId = c.seeker_id;

                    return (
                      <tr key={c.apply_id}>
                        <td>{index + 1}</td>
                        <td>
                          <Link
                            href={`/recruiter/candidate-detail/${jobId}/${seekerId}`}
                            className="fw-semibold"
                          >
                            {c.name}
                          </Link>
                        </td>
                        <td>{c.candidate_desc || "—"}</td>
                        <td>{c.role_name}</td>
                        <td className="fw-bold">{c.status}</td>
                        <td>{c.location || "—"}</td>
                        <td>{c.education || "—"}</td>
                        <td>
                          {c.job_apply_date
                            ? new Date(c.job_apply_date).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-danger fw-bold py-3">
                      No candidates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
     <style jsx global>{`
  *:not(input):not(textarea):not(select) {
    caret-color: transparent !important;
  }

  input,
  textarea,
  select {
    caret-color: auto !important;
  }

  /* ✅ TABLE HEADER TEXT COLOR ONLY */
  .table thead th {
    color: rgba(93, 106, 126, 0.6) !important;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    background: transparent !important;
    border-bottom: 1px solid #e5e7eb;
  }
`}</style>

    </>
  );
};

export default Candidates;
