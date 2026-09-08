"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const categories = [
  {
    icon: "bi-code-slash",
    color: "#4f46e5",
    bg: "#e8eeff",
    label: "IT & Software",
    desc: "Developer, DevOps, QA, Data Science",
  },
  {
    icon: "bi-people-fill",
    color: "#14b981",
    bg: "#dcfce7",
    label: "HR & Recruitment",
    desc: "Talent Acquisition, L&D, HRBP",
  },
  {
    icon: "bi-bank2",
    color: "#f59e0b",
    bg: "#fef3c7",
    label: "Banking & Finance",
    desc: "Analyst, Auditor, Accountant, CFA",
  },
  {
    icon: "bi-car-front-fill",
    color: "#8b5cf6",
    bg: "#ede9fe",
    label: "Automobile",
    desc: "Automotive Engineer, Sales, Service",
  },
  {
    icon: "bi-megaphone-fill",
    color: "#ef4444",
    bg: "#fee2e2",
    label: "Marketing",
    desc: "Digital Marketing, Brand, SEO, Content",
  },
  {
    icon: "bi-gear-wide-connected",
    color: "#0891b2",
    bg: "#cffafe",
    label: "Operations",
    desc: "Supply Chain, Logistics, Process",
  },
];

const dosDonts = {
  dos: [
    "Keep your resume to 1–2 pages maximum",
    "Use strong action verbs (Led, Built, Increased, Reduced...)",
    "Quantify achievements with metrics and numbers",
    "Tailor your resume to each specific job posting",
    "Use a clean, ATS-friendly single-column layout",
    "Include relevant keywords from the job description",
    "List work experience in reverse chronological order",
    "Proofread carefully — zero typos allowed",
  ],
  donts: [
    "Don't include a photo or personal details like age/gender",
    "Don't use graphics, tables, or columns (ATS cannot read them)",
    "Don't list every job duty — focus on impact, not tasks",
    "Don't use an unprofessional email address",
    "Don't include references on the resume itself",
    "Don't use generic objectives like 'seeking a challenging role'",
    "Don't use more than 2 font types",
    "Don't exceed 12pt font — readability matters",
  ],
};

const actionVerbs = [
  "Achieved", "Accelerated", "Built", "Collaborated", "Delivered",
  "Designed", "Drove", "Enhanced", "Established", "Executed",
  "Generated", "Guided", "Implemented", "Improved", "Increased",
  "Launched", "Led", "Managed", "Optimized", "Pioneered",
  "Reduced", "Resolved", "Scaled", "Streamlined", "Transformed",
];

const atsChecklist = [
  "Plain text format with no graphics or images",
  "Standard headings: Experience, Education, Skills",
  "Common fonts: Arial, Calibri, Times New Roman",
  "No headers/footers — ATS often skips them",
  "Use standard bullet points (not custom symbols)",
  "Save as .docx or .pdf based on the job portal requirement",
  "Spell out acronyms at least once",
  "Match job title terminology from the posting",
];

const Resume = () => {
  const [tab, setTab] = useState("dos");

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* Banner */}
        <div className="page-banner">
          <Container>
            <h1 style={{ fontWeight: 800, fontSize: "40px" }}>Resume Writing Hub</h1>
            <p style={{ opacity: 0.9, fontSize: "16px", marginTop: "8px" }}>
              Build a resume that gets noticed — by both recruiters and ATS systems.
            </p>
          </Container>
          <div className="breadcrumb-pill">
            <Link href="/home"><i className="bi bi-house" /> Home</Link>
            <i className="bi bi-chevron-right" />
            <span>Resume Writing</span>
          </div>
        </div>

        {/* Stats Strip */}
        <div style={{ background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)", padding: "24px 0" }}>
          <Container>
            <Row className="text-center text-white">
              {[
                { val: "75%", label: "of resumes are rejected by ATS before human review" },
                { val: "6 sec", label: "Average recruiter scan time per resume" },
                { val: "40%", label: "More interviews with quantified achievements" },
                { val: "3×", label: "Higher callback rate with tailored resumes" },
              ].map((s, i) => (
                <Col md={3} key={i}>
                  <div style={{ padding: "8px 0" }}>
                    <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "4px" }}>{s.val}</div>
                    <div style={{ fontSize: "13px", opacity: 0.85 }}>{s.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </div>

        {/* Resume by Category */}
        <section style={{ background: "#f8f9fc", padding: "60px 0" }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-heading">Resume Guides by Industry</h2>
              <p className="section-subheading mt-2">
                Get industry-specific tips and templates tailored to your field.
              </p>
            </div>
            <Row>
              {categories.map((cat, idx) => (
                <Col md={4} sm={6} key={idx} className="mb-4">
                  <div
                    className="card-hover"
                    style={{ padding: "28px 22px", textAlign: "center", cursor: "pointer" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = cat.bg;
                      e.currentTarget.style.borderColor = cat.color;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.borderColor = "#e5eaf3";
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "18px",
                        background: cat.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <i className={`bi ${cat.icon}`} style={{ fontSize: "28px", color: cat.color }} />
                    </div>
                    <h5 style={{ fontWeight: 700, color: "#05264e", marginBottom: "6px" }}>{cat.label}</h5>
                    <p style={{ fontSize: "13px", color: "#66789c", margin: 0 }}>{cat.desc}</p>
                    <div
                      style={{
                        marginTop: "14px",
                        color: cat.color,
                        fontSize: "13px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      View Tips <i className="bi bi-arrow-right" />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ATS Checklist */}
        <section style={{ padding: "60px 0" }}>
          <Container>
            <Row className="align-items-center">
              <Col md={6}>
                <div style={{ paddingRight: "20px" }}>
                  <div className="badge-primary" style={{ marginBottom: "12px", display: "inline-flex" }}>
                    ATS OPTIMIZATION
                  </div>
                  <h2 className="section-heading" style={{ marginBottom: "16px" }}>
                    Beat the ATS — Get Seen by Real Humans
                  </h2>
                  <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.75", marginBottom: "24px" }}>
                    Applicant Tracking Systems automatically filter resumes before any human reads them.
                    Follow these formatting rules to make sure yours passes through.
                  </p>
                  {atsChecklist.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: "#dcfce7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        <i className="bi bi-check" style={{ color: "#14b981", fontSize: "13px", fontWeight: 800 }} />
                      </div>
                      <span style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.6" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Col>
              <Col md={6}>
                {/* Dos & Don'ts Tabs */}
                <div
                  style={{
                    background: "#f8f9fc",
                    borderRadius: "16px",
                    padding: "28px",
                    border: "1px solid #e5eaf3",
                  }}
                >
                  <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                    {["dos", "donts"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "10px",
                          border: "none",
                          fontWeight: 700,
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "all 0.25s",
                          background: tab === t ? (t === "dos" ? "#14b981" : "#ef4444") : "white",
                          color: tab === t ? "white" : "#4b5563",
                          boxShadow: tab === t ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                        }}
                      >
                        {t === "dos" ? "✅ Dos" : "❌ Don'ts"}
                      </button>
                    ))}
                  </div>
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    {dosDonts[tab].map((item, i) => (
                      <li key={i} style={{ color: "#4b5563", fontSize: "14px", marginBottom: "10px", lineHeight: "1.6" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Action Verbs */}
        <section style={{ background: "#f8f9fc", padding: "60px 0" }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-heading">Power Action Verbs</h2>
              <p className="section-subheading mt-2">
                Replace weak words with these high-impact verbs to make your bullet points shine.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {actionVerbs.map((verb, i) => (
                <span
                  key={i}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "50px",
                    background: "white",
                    border: "2px solid #e5eaf3",
                    color: "#0f172a",
                    fontWeight: 600,
                    fontSize: "13px",
                    transition: "all 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = "#e8eeff";
                    e.target.style.borderColor = "#4f46e5";
                    e.target.style.color = "#4f46e5";
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = "white";
                    e.target.style.borderColor = "#e5eaf3";
                    e.target.style.color = "#0f172a";
                  }}
                >
                  {verb}
                </span>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section style={{ background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)", padding: "60px 0" }}>
          <Container className="text-center text-white">
            <h3 style={{ fontWeight: 800, fontSize: "30px", marginBottom: "12px" }}>
              Ready to apply? Find your perfect role.
            </h3>
            <p style={{ opacity: 0.85, fontSize: "16px", marginBottom: "28px" }}>
              Thousands of verified jobs are waiting for a resume like yours.
            </p>
            <Link href="/job-listing" className="btn-portal-primary">
              <i className="bi bi-search" /> Browse All Jobs
            </Link>
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Resume;
