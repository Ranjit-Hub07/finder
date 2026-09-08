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
        style={{
          paddingTop: "175px",
          display: "flex",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f8ff 0%, #ebf1ff 100%)",
        }}
      >
        <div
          className="job-wrapper"
          style={{
            width: "88%",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0px 8px 40px rgba(0,0,0,0.06)",
            padding: "35px 40px",
          }}
        >
          <Suspense fallback={<div className="text-center py-4">Loading jobs...</div>}>
            <JobsTableClient />
          </Suspense>
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
        .custom-table thead th {
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

export default Jobs;
