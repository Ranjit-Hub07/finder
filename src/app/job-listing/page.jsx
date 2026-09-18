"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Filterbar from "./components/Filterbar";
import Joblist from "./components/Joblist";
import Jobdetails from "./components/Jobdetails";
import { Button } from "react-bootstrap";
import axios from "axios";

// ✅ Inner component that uses useSearchParams — must be inside Suspense
function JobListingContent() {
  const [jobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(5);

  const searchParams = useSearchParams();
  const router = useRouter();

  const company = searchParams.get("company");
  const experience = searchParams.get("experience");
  const location = searchParams.get("location");
  const keyword = searchParams.get("keyword");
  const jobType = searchParams.get("jobType");

  // ✅ Fetch jobs depending on params
  const fetchJobs = async () => {
    try {
      setLoading(true);
      let fetchedJobs = [];

      // 1️⃣ Company-based jobs
      if (company) {
        const res = await axios.get(`/api/recruiter/job/by-company?company=${company}`);
        fetchedJobs = res.data.jobs || [];
      }
      // 2️⃣ Filter-based jobs (experience / location / keyword / jobType)
      else if (experience || location || keyword || jobType) {
        const filters = {
          location: location ? [location] : [],
          experience: experience ? [experience] : [],
          jobType: jobType ? [jobType] : [],
        };
        const res = await axios.post("/api/recruiter/job/filter-job", filters);
        fetchedJobs = res.data || [];

        if (keyword) {
          const kw = keyword.toLowerCase();
          fetchedJobs = fetchedJobs.filter(
            (job) =>
              job.job_title?.toLowerCase().includes(kw) ||
              job.job_desc?.toLowerCase().includes(kw)
          );
        }
      }
      // 3️⃣ Default → fetch latest active jobs
      else {
        const res = await axios.get("/api/recruiter/job/latest");
        fetchedJobs = res.data.jobs || [];
      }

      setJobs(fetchedJobs);
      setVisibleJobs(fetchedJobs.slice(0, loadCount));
      setSelectedJob(fetchedJobs[0] || null);
      setFilterApplied(true);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setVisibleJobs([]);
      setSelectedJob(null);
      setFilterApplied(true);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch whenever filters/company/jobType changes
  useEffect(() => {
    fetchJobs();
  }, [company, experience, location, keyword, jobType]);

  const [mobileActiveView, setMobileActiveView] = useState("list");

  // ✅ Filterbar Apply handler
  const handleApplyFilters = (newJobs, filtersWereApplied = true) => {
    setJobs(newJobs);
    setVisibleJobs(newJobs.slice(0, loadCount));
    setSelectedJob(newJobs[0] || null);
    setFilterApplied(filtersWereApplied);
    setMobileActiveView("list");
  };

  // ✅ Reset All
  const handleResetAll = () => {
    setJobs([]);
    setVisibleJobs([]);
    setSelectedJob(null);
    setFilterApplied(false);
    setMobileActiveView("list");
    router.push("/job-listing");
  };

  // ✅ Load more jobs
  const handleLoadMore = () => {
    const newCount = loadCount + 5;
    setLoadCount(newCount);
    setVisibleJobs(jobs.slice(0, newCount));
  };

  return (
    <div className="job-listing-container" style={{ backgroundColor: "#f8fafc" }}>
      <Filterbar onApply={handleApplyFilters} onReset={handleResetAll} />
      <div className="job-listing-split-wrap">
        {/* Left: Job list */}
        <div
          className={`job-list-col ${mobileActiveView === "details" ? "d-none d-lg-block" : "w-100"}`}
        >
          {loading ? (
            <p className="text-center py-5 text-muted">Loading jobs...</p>
          ) : (
            <>
              <Joblist
                jobs={visibleJobs}
                onSelect={(job) => {
                  setSelectedJob(job);
                  setMobileActiveView("details");
                }}
                selectedJob={selectedJob}
                noFilters={!filterApplied}
              />
              {visibleJobs.length < jobs.length && (
                <div className="text-center my-3">
                  <Button onClick={handleLoadMore} variant="primary" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)", border: "none", borderRadius: "8px", padding: "8px 24px" }}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Job details */}
        <div
          className={`job-details-col ${mobileActiveView === "list" ? "d-none d-lg-block" : "w-100"}`}
        >
          {/* Mobile Back Button */}
          <div className="d-lg-none mb-3">
            <Button
              variant="light"
              size="sm"
              className="border shadow-sm rounded-pill px-3 py-1 fw-semibold text-primary d-inline-flex align-items-center gap-2"
              onClick={() => setMobileActiveView("list")}
            >
              <i className="bi bi-arrow-left"></i> Back to Job List
            </Button>
          </div>

          {filterApplied && selectedJob ? (
            <Jobdetails job={selectedJob} />
          ) : (
            <div className="card border-0 shadow-sm p-4 text-center d-none d-lg-block" style={{ maxWidth: 650, margin: "0 auto" }}>
              <h5 className="fw-bold text-dark">Select a Job</h5>
              <p className="text-muted mb-0">Choose a job from the list to preview full requirements and apply.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .job-listing-container {
          padding-top: 110px;
          overflow: visible !important;
          position: relative;
        }
        .job-listing-split-wrap {
          display: flex;
          min-height: calc(100vh - 210px);
          overflow: hidden;
        }
        @media (min-width: 992px) {
          .job-list-col {
            width: 38% !important;
            max-height: calc(100vh - 210px);
            overflow-y: auto;
            padding: 1rem 1.25rem;
            background-color: #f8fafc;
            border-right: 1px solid #e2e8f0;
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
          .job-list-col::-webkit-scrollbar {
            width: 5px;
          }
          .job-list-col::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .job-details-col {
            width: 62% !important;
            padding: 1rem 1.5rem;
            background-color: #f8fafc;
          }
        }
        @media (max-width: 991px) {
          .job-listing-container {
            padding-top: 60px !important;
          }
          .job-listing-split-wrap {
            flex-direction: column;
            min-height: auto;
            overflow: visible;
          }
          .job-list-col,
          .job-details-col {
            width: 100% !important;
            padding: 1rem 0.75rem !important;
            background-color: #f8fafc;
          }
        }
      `}</style>
    </div>
  );
}

// ✅ Page export wraps the content in Suspense (required for useSearchParams in Next.js 15)
export default function JobListingPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div style={{ paddingTop: "200px", textAlign: "center", color: "#66789c" }}>
            Loading jobs...
          </div>
        }
      >
        <JobListingContent />
      </Suspense>
      <Footer />
    </>
  );
}
