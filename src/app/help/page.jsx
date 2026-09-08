"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const helpCategories = [
  {
    icon: "bi-rocket-takeoff-fill",
    color: "#4f46e5",
    bg: "#e8eeff",
    title: "Getting Started",
    items: [
      "How to create a Seeker account",
      "How to register as a Recruiter",
      "Setting up your profile for the first time",
      "Uploading your resume and documents",
      "Verifying your email address",
    ],
  },
  {
    icon: "bi-briefcase-fill",
    color: "#14b981",
    bg: "#dcfce7",
    title: "Job Applications",
    items: [
      "How to search and filter jobs",
      "How to apply for a job",
      "Tracking your application status",
      "Withdrawing a job application",
      "Understanding application deadlines",
    ],
  },
  {
    icon: "bi-building-fill",
    color: "#f59e0b",
    bg: "#fef3c7",
    title: "Recruiter Tools",
    items: [
      "Posting a new job opening",
      "Managing and editing posted jobs",
      "Searching and shortlisting candidates",
      "Sending bulk emails to candidates",
      "Understanding subscription packages",
    ],
  },
  {
    icon: "bi-shield-lock-fill",
    color: "#8b5cf6",
    bg: "#ede9fe",
    title: "Account & Security",
    items: [
      "Changing your password",
      "Recovering a forgotten password",
      "Updating your contact information",
      "Deactivating or deleting your account",
      "Two-factor authentication setup",
    ],
  },
  {
    icon: "bi-file-earmark-person-fill",
    color: "#ef4444",
    bg: "#fee2e2",
    title: "Resume Guidance",
    items: [
      "Tips for writing an ATS-friendly resume",
      "How to highlight your key achievements",
      "Choosing the right resume format",
      "Resume dos and don'ts",
      "Getting your resume reviewed",
    ],
  },
  {
    icon: "bi-credit-card-fill",
    color: "#0891b2",
    bg: "#cffafe",
    title: "Billing & Subscriptions",
    items: [
      "Understanding the free vs premium plans",
      "Upgrading your recruiter subscription",
      "Cancellation and refund policy",
      "Invoice and payment receipt download",
      "Contacting billing support",
    ],
  },
];

const faqs = [
  {
    q: "How do I reset my password?",
    a: "Go to the login page and click 'Forgot Password'. Enter your registered email and follow the reset link sent to your inbox.",
  },
  {
    q: "Can I apply to multiple jobs at once?",
    a: "Yes! You can apply to as many jobs as you like. Each application is independent and tracked separately in your profile dashboard.",
  },
  {
    q: "How long does it take for a recruiter to respond?",
    a: "Response times vary by company. Most recruiters respond within 3–7 business days. You can also follow up via the application tracker.",
  },
  {
    q: "Is my personal data safe on Finder?",
    a: "Absolutely. All data is encrypted and stored securely. We never share your personal information with third parties without your consent.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to your Profile Settings and scroll to the bottom. Click 'Delete Account' and confirm. Note: this action is permanent.",
  },
];

const Help = () => {
  const [activeQ, setActiveQ] = useState(null);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* Banner */}
        <div className="page-banner">
          <Container>
            <h1 style={{ fontWeight: 800, fontSize: "40px" }}>Help & Support Center</h1>
            <p style={{ opacity: 0.9, fontSize: "16px", marginTop: "8px" }}>
              Find answers, guides, and support resources for all your questions.
            </p>
          </Container>
          <div className="breadcrumb-pill">
            <Link href="/home"><i className="bi bi-house" /> Home</Link>
            <i className="bi bi-chevron-right" />
            <span>Help</span>
          </div>
        </div>

        {/* Search Banner */}
        <div style={{ background: "linear-gradient(135deg, #f0f4ff, #ffffff)", padding: "40px 0 20px" }}>
          <Container className="text-center">
            <h2 className="section-heading">How can we help you?</h2>
            <p className="section-subheading mt-2">
              Search our knowledge base or browse the categories below.
            </p>
            <div
              style={{
                display: "flex",
                maxWidth: "580px",
                margin: "24px auto 0",
                background: "white",
                borderRadius: "50px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                overflow: "hidden",
                border: "1px solid #e5eaf3",
              }}
            >
              <i
                className="bi bi-search"
                style={{ padding: "0 16px", color: "#66789c", fontSize: "18px", display: "flex", alignItems: "center" }}
              />
              <input
                type="text"
                placeholder="Search for help topics, articles..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "15px",
                  padding: "14px 0",
                  background: "transparent",
                }}
              />
              <button
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  color: "white",
                  border: "none",
                  padding: "0 28px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </div>
          </Container>
        </div>

        {/* Help Categories Grid */}
        <section style={{ background: "#f8f9fc", padding: "60px 0" }}>
          <Container>
            <Row>
              {helpCategories.map((cat, idx) => (
                <Col md={4} key={idx} className="mb-4">
                  <div
                    className="card-hover"
                    style={{ padding: "28px 24px", height: "100%" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "14px",
                          background: cat.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <i className={`bi ${cat.icon}`} style={{ fontSize: "22px", color: cat.color }} />
                      </div>
                      <h5 style={{ fontWeight: 700, color: "#05264e", margin: 0 }}>{cat.title}</h5>
                    </div>
                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                      {cat.items.map((item, i) => (
                        <li key={i} style={{ color: "#66789c", fontSize: "14px", marginBottom: "6px", lineHeight: "1.5" }}>
                          <a href="#" style={{ color: "#4b5563", textDecoration: "none", transition: "color 0.2s" }}
                            onMouseEnter={e => e.target.style.color = "#4f46e5"}
                            onMouseLeave={e => e.target.style.color = "#4b5563"}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* FAQ Section */}
        <section style={{ padding: "60px 0" }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-heading">Frequently Asked Questions</h2>
              <p className="section-subheading mt-2">
                Quick answers to the most common questions we receive.
              </p>
            </div>
            <Row className="justify-content-center">
              <Col md={8}>
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #e5eaf3",
                      borderRadius: "12px",
                      marginBottom: "12px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      boxShadow: activeQ === idx ? "0 4px 20px rgba(60,101,245,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        padding: "18px 22px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        background: activeQ === idx ? "#f0f4ff" : "white",
                      }}
                      onClick={() => setActiveQ(activeQ === idx ? null : idx)}
                    >
                      <span style={{ fontWeight: 600, color: "#05264e", fontSize: "15px" }}>{faq.q}</span>
                      <i
                        className={`bi bi-chevron-${activeQ === idx ? "up" : "down"}`}
                        style={{ color: "#4f46e5", fontSize: "14px", flexShrink: 0, marginLeft: "12px" }}
                      />
                    </div>
                    {activeQ === idx && (
                      <div
                        style={{
                          padding: "0 22px 18px",
                          background: "#f8f9fc",
                          color: "#4b5563",
                          fontSize: "14px",
                          lineHeight: "1.75",
                          borderTop: "1px solid #e5eaf3",
                          paddingTop: "14px",
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </Col>
            </Row>
          </Container>
        </section>

        {/* Contact Support CTA */}
        <section style={{ background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)", padding: "60px 0" }}>
          <Container>
            <Row className="align-items-center text-white">
              <Col md={8}>
                <h3 style={{ fontWeight: 800, fontSize: "28px", marginBottom: "10px" }}>
                  Still can't find what you're looking for?
                </h3>
                <p style={{ opacity: 0.88, fontSize: "16px", margin: 0 }}>
                  Our support team is ready to help you. Reach out anytime.
                </p>
              </Col>
              <Col md={4} className="text-md-end mt-3 mt-md-0">
                <Link href="/contact-us" className="btn-portal-primary" style={{ marginRight: "12px" }}>
                  <i className="bi bi-envelope-fill" /> Contact Us
                </Link>
                <a href="tel:+917538057669" className="btn-portal-outline" style={{ color: "white", borderColor: "white" }}>
                  <i className="bi bi-telephone-fill" /> Call Now
                </a>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Help;
