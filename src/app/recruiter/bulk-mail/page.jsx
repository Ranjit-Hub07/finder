"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import axios from "axios";

const BulkMail = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch Recruiter's Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/recruiter/jobs");
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.log("Error fetching jobs", err);
      }
    };

    fetchJobs();
  }, []);

  // Send Bulk Email
  const sendBulkMail = async () => {
    if (!selectedJob) {
      setMsg("Please select a job first.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post("/api/recruiter/bulk-mail", {
        jobId: selectedJob,
      });

      setMsg(res.data.message || "Emails sent successfully!");
    } catch (err) {
      setMsg("Failed to send emails.");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <Topbar />

      <div
        style={{
          paddingTop: "175px",
          background: "linear-gradient(135deg, #f5f9ff 0%, #eef3ff 100%)",
          minHeight: "100vh",
        }}
      >
        <div className="container py-5">
          <div
            className="mx-auto p-4 p-md-5"
            style={{
              maxWidth: "840px",
              background: "#fff",
              borderRadius: "15px",
              border: "1px solid #e6e9f2",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <h4
              className="fw-bold text-center mb-4"
              style={{ color: "#05264e", letterSpacing: "0.5px" }}
            >
              📩 Send Bulk Emails to Candidates
            </h4>

            <p
              className="text-center"
              style={{
                fontSize: "15px",
                color: "rgba(93, 106, 126, 0.8)",
                marginTop: "-10px",
              }}
            >
              Select the job post and send emails to phone-screened candidates.
            </p>

            <div className="mt-4 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
              <div className="w-100">
                <label
                  htmlFor="jobSelect"
                  className="form-label fw-semibold"
                  style={{
                    fontSize: "15px",
                    color: "rgba(93, 106, 126, 0.8)",
                  }}
                >
                  Select Job Post
                </label>

                <select
                  id="jobSelect"
                  className="form-select shadow-sm"
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  style={{
                    height: "50px",
                    borderRadius: "12px",
                    borderColor: "#cdd6f3",
                  }}
                >
                  <option value="">-- Select a Job --</option>

                  {jobs.length === 0 ? (
                    <option>No Jobs Found</option>
                  ) : (
                    jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.job_title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <button
                type="button"
                className="btn btn-primary shadow-sm"
                onClick={sendBulkMail}
                disabled={loading}
                style={{
                  height: "50px",
                  padding: "0 28px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #0052cc 0%, #006aff 100%)",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "Sending..." : "🚀 Send Emails"}
              </button>
            </div>

            {msg && (
              <p
                className="text-center mt-4"
                style={{ fontSize: "14px", color: "#444" }}
              >
                {msg}
              </p>
            )}
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
      `}</style>
    </>
  );
};

export default BulkMail;
