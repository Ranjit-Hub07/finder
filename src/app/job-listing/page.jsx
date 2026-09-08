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

  // ✅ Filterbar Apply handler
  const handleApplyFilters = (newJobs, filtersWereApplied = true) => {
    setJobs(newJobs);
    setVisibleJobs(newJobs.slice(0, loadCount));
    setSelectedJob(newJobs[0] || null);
    setFilterApplied(filtersWereApplied);
  };

  // ✅ Reset All
  const handleResetAll = () => {
    setJobs([]);
    setVisibleJobs([]);
    setSelectedJob(null);
    setFilterApplied(false);
    router.push("/job-listing");
  };

  // ✅ Load more jobs
  const handleLoadMore = () => {
    const newCount = loadCount + 5;
    setLoadCount(newCount);
    setVisibleJobs(jobs.slice(0, newCount));
  };

  return (
    <div style={{ paddingTop: "120px", backgroundColor: "#f8fafc" }}>
      <Filterbar onApply={handleApplyFilters} onReset={handleResetAll} />
      <div style={{ display: "flex", minHeight: "calc(100vh - 230px)", overflow: "hidden" }}>
        {/* Left: Job list */}
        <div
          style={{
            width: "33.33%",
            maxHeight: "calc(100vh - 230px)",
            overflowY: "scroll",
            padding: "1rem",
            backgroundColor: "#f8fafc",
            borderRight: "1px solid #e2e8f0",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {loading ? (
            <p className="text-center">Loading jobs...</p>
          ) : (
            <>
              <Joblist
                jobs={visibleJobs}
                onSelect={setSelectedJob}
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
        <div style={{ width: "66.66%", padding: "1.5rem", backgroundColor: "#f8fafc" }}>
          {filterApplied && selectedJob && <Jobdetails job={selectedJob} />}
        </div>
      </div>
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
