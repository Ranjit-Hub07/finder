"use client";

export const dynamic = "force-dynamic"; // disable prerendering

import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import useRecruiterGuard from "@/hooks/useRecruiterGuard";
import JobsTableClient from "./jobs-table-client";

const Jobs = () => {
  useRecruiterGuard();

  return (
    <>
      <Navbar />
      <Topbar />

      <div
        className="recruiter-page-container py-3 py-md-4 px-2 px-md-4"
        style={{
          display: "flex",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f8ff 0%, #ebf1ff 100%)",
          minHeight: "100vh",
        }}
      >
        <div
          className="job-wrapper w-100"
          style={{
            maxWidth: "1350px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0px 8px 40px rgba(0,0,0,0.06)",
          }}
        >
          <Suspense fallback={<div className="text-center py-4">Loading jobs...</div>}>
            <JobsTableClient />
          </Suspense>
        </div>
      </div>

      <Footer />
      <style jsx global>{`
        .recruiter-page-container {
          padding-top: 175px;
        }
        .job-wrapper {
          padding: 35px 40px;
        }
        @media (max-width: 768px) {
          .recruiter-page-container {
            padding-top: 120px !important;
          }
          .job-wrapper {
            padding: 20px 14px !important;
            border-radius: 14px !important;
          }
        }
        *:not(input):not(textarea):not(select) {
          caret-color: transparent !important;
        }
        input,
        textarea,
        select {
          caret-color: auto !important;
        }
        .custom-table thead th {
          color: rgba(93, 106, 126, 0.6) !important;
          font-weight: 700;
          font-size: 13.5px;
          text-transform: uppercase;
          background: transparent !important;
          border-bottom: 1px solid #e5e7eb;
          white-space: nowrap;
        }
        .custom-table td {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

export default Jobs;
