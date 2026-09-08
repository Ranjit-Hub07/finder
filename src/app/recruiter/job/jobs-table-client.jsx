"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const formatStatus = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Open";

export default function JobsTableClient() {
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get("status");

  const [jobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(5);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (urlFilter) setFilterStatus(formatStatus(urlFilter));
  }, [urlFilter]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/recruiter/jobs");
      const updatedJobs = res.data.jobs.map((job) => ({
        ...job,
        status: formatStatus(job.status || "open"),
      }));
      setJobs(updatedJobs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await axios.put(`/api/recruiter/jobs/${jobId}`, { status: newStatus });
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: formatStatus(newStatus) } : job
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter(
    (job) => filterStatus === "All" || job.status.toLowerCase() === filterStatus.toLowerCase()
  );

  return (
    <>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold" style={{ color: "#05264e", fontSize: "22px" }}>
          🔍 Job Listings
        </h4>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm shadow-sm rounded-pill px-3"
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
            style={{ width: "160px" }}
          >
            <option value="All">Select Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Paused">Paused</option>
          </select>

          <Link href="/recruiter/job/post-job" className="btn btn-primary btn-sm rounded-pill px-3">
            + Post Job
          </Link>

          <Link href="/recruiter/job/upload-job" className="btn btn-outline-primary btn-sm rounded-pill px-3">
            Upload Job
          </Link>
        </div>
      </div>

      {/* JOB TABLE */}
      <div className="table-responsive">
        <table className="table align-middle custom-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Job Title</th>
              <th>Location</th>
              <th>Created</th>
              <th>Candidates</th>
              <th>Views</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.slice(0, visibleJobs).map((job, index) => (
              <tr key={job.id} className="table-row-hover">
                <td>{index + 1}</td>
                <td>
                  <Link href={`/recruiter/job/${job.id}`} className="fw-semibold text-decoration-none" style={{ color: "#4154f1" }}>
                    {job.job_title}
                  </Link>
                </td>
                <td>{job.location || job.job_cityid}</td>
                <td>{new Date(job.created_at).toLocaleDateString()}</td>
                <td>
                  <span className="badge bg-info text-dark px-3 py-2 rounded-pill">
                    {job.candidates || 0} Candidates
                  </span>
                </td>
                <td>{job.views || 0}</td>
                <td>
                  <select
                    className="form-select form-select-sm rounded-pill shadow-sm"
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Paused">Paused</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleJobs < filteredJobs.length && (
        <div className="text-center mt-4">
          <button className="btn btn-primary rounded-pill px-4" onClick={() => setVisibleJobs(visibleJobs + 5)}>
            Load More
          </button>
        </div>
      )}
    </>
  );
}
