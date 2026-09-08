"use client"; // 👈 This makes the file a Client Component

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    "What is Finder?",
    "How do I create an account on Finder?",
    "How can I search for jobs on Finder?",
    "Can I upload my resume to Finder?",
    "How do I apply for a job on Finder?",
    "Is Finder available on mobile devices?",
    "How can Employers post job openings on Finder?",
    "Is there a fee for using Finder?",
    "How can I contact Finder for support or inquiries?",
    "Is my personal information secure on Finder?",
  ];

  const answers = [
    "Finder is an innovative online job portal designed to connect job seekers with employers in urban areas. Our platform aims to streamline the job search process by providing easy access to a wide range of job opportunities across various industries.",
    "You can create an account by clicking on the 'Sign Up' button on the homepage and filling out the registration form.",
    "To search for jobs, use the search bar on the homepage and filter by keywords, location, or job category.",
    "Yes, you can upload your resume by navigating to your profile settings and selecting 'Upload Resume'.",
    "To apply for a job, click on the job listing and then click 'Apply Now'.",
    "Yes, Finder is accessible on both Android and iOS devices.",
    "Employers can post job openings by registering an employer account and accessing the job posting dashboard.",
    "Finder offers free and premium plans. Free plans allow basic access, while premium plans offer additional features.",
    "You can contact us through the 'Contact Us' page or email support@Finder.com.",
    "Yes, Finder ensures the security of your personal information through encryption and strict privacy policies.",
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner" style={{ backgroundColor: "#05264e", padding: "60px 0" }}>
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Frequently Asked Questions</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Find answers to common questions about using Finder as a job seeker or recruiter.
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill" style={{ backgroundColor: "white", padding: "8px 16px", borderRadius: "50px" }}>
              <Link href="/home" className="text-decoration-none text-muted" style={{ fontSize: "14px" }}>
                Home
              </Link>
              <span className="text-muted" style={{ margin: "0 10px" }}>/</span>
              <span className="text-primary fw-semibold" style={{ fontSize: "14px" }}>FAQ</span>
            </div>
          </Container>
        </div>

        {/* FAQ Section */}
        <div className="container mt-4 mb-5">
          {questions.map((question, index) => (
            <div
              key={index}
              className="mb-1"
              style={{
                border: "1px solid #673ab7",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#673ab7",
                  color: "white",
                  cursor: "pointer",
                  padding: "8px 12px",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                onClick={() => toggleAnswer(index)}
              >
                {question}
                <span
                  style={{
                    float: "right",
                    transition: "transform 0.3s",
                  }}
                >
                   {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "12px",
                    fontSize: "14px",
                  }}
                >
                  {answers[index]}
                </div>
              )}
            </div>
          ))}
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

export default FAQ;
