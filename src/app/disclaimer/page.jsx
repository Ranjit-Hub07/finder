"use client";
import React from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const clauses = [
  {
    icon: "bi-briefcase-fill",
    color: "#4f46e5",
    title: "No Employment Guarantee",
    body: "Finder is an online job marketplace that facilitates connections between job seekers and recruiters. While we strive to provide genuine, verified listings, we do not guarantee employment outcomes. Hiring decisions are entirely at the discretion of the employer. Finder is not responsible for any offer, rejection, or delay in the hiring process.",
  },
  {
    icon: "bi-building-fill",
    color: "#f59e0b",
    title: "Third-Party Recruiter Responsibility",
    body: "All job postings on Finder are submitted by independent recruiters and employers. Finder does not verify the accuracy, completeness, or legality of every job listing in real-time. We strongly encourage all job seekers to conduct independent due diligence before attending interviews, sharing sensitive documents, or accepting any offer.",
  },
  {
    icon: "bi-exclamation-triangle-fill",
    color: "#ef4444",
    title: "Fraud Prevention Warning",
    body: "Finder will NEVER ask for money, bank account details, or personal payments as a condition of employment or profile activation. If any recruiter or individual demands payment from you, this is a red flag for fraud. Report such incidents immediately at fraud@finder.com. Finder is not liable for losses resulting from transactions initiated outside our platform.",
  },
  {
    icon: "bi-link-45deg",
    color: "#8b5cf6",
    title: "External Links & Third-Party Sites",
    body: "The Finder platform may contain links to third-party websites, such as company career pages or external resources. These links are provided for convenience only. Finder has no control over the content, privacy practices, or accuracy of external sites and accepts no responsibility for them. Visiting external links is at the user's own risk.",
  },
  {
    icon: "bi-bar-chart-fill",
    color: "#14b981",
    title: "Accuracy of Information",
    body: "While we make every effort to keep information on the Finder platform accurate and up-to-date, we cannot guarantee the completeness, accuracy, or timeliness of job listings, salary estimates, company descriptions, or any other user-submitted content. Information is provided 'as is' without warranty of any kind, express or implied.",
  },
  {
    icon: "bi-phone-fill",
    color: "#0891b2",
    title: "Platform Availability",
    body: "Finder strives to maintain 99.9% platform uptime but does not guarantee uninterrupted access. The platform may occasionally be unavailable due to scheduled maintenance, server upgrades, or unforeseen technical issues. Finder is not liable for any loss, inconvenience, or missed opportunities resulting from platform downtime.",
  },
];

const Disclaimer = () => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* Banner */}
        <div className="page-banner">
          <Container>
            <h1 style={{ fontWeight: 800, fontSize: "40px" }}>Disclaimer</h1>
            <p style={{ opacity: 0.9, fontSize: "16px", marginTop: "8px" }}>
              Important notices and limitations regarding your use of the Finder platform.
            </p>
          </Container>
          <div className="breadcrumb-pill">
            <Link href="/home"><i className="bi bi-house" /> Home</Link>
            <i className="bi bi-chevron-right" />
            <span>Disclaimer</span>
          </div>
        </div>

        {/* Warning Alert */}
        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fef9c3)",
            borderBottom: "1px solid #fde68a",
            padding: "24px 0",
          }}
        >
          <Container>
            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                maxWidth: "820px",
              }}
            >
              <i className="bi bi-shield-exclamation" style={{ fontSize: "30px", color: "#d97706", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, color: "#92400e", fontSize: "16px", marginBottom: "6px" }}>
                  Important Notice
                </div>
                <p style={{ color: "#78350f", fontSize: "14px", lineHeight: "1.8", margin: 0 }}>
                  Please read this disclaimer carefully. Finder provides this platform in good faith as an information bridge between job seekers and employers. However, we are not responsible for the conduct of any recruiter or employer, and we strongly advise users to exercise caution and verify every opportunity independently.
                </p>
              </div>
            </div>
          </Container>
        </div>

        {/* Disclaimer Clauses */}
        <section style={{ background: "#f8f9fc", padding: "60px 0" }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-heading">Our Disclaimers</h2>
              <p className="section-subheading mt-2">
                Understand the limits of our responsibility and how to protect yourself.
              </p>
            </div>
            <Row>
              {clauses.map((clause, idx) => (
                <Col md={6} key={idx} className="mb-4">
                  <div
                    className="card-hover"
                    style={{ padding: "28px 24px", height: "100%" }}
                  >
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "14px",
                          background: `${clause.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <i className={`bi ${clause.icon}`} style={{ fontSize: "22px", color: clause.color }} />
                      </div>
                      <div>
                        <h5 style={{ fontWeight: 700, color: "#05264e", marginBottom: "10px", fontSize: "16px" }}>
                          {clause.title}
                        </h5>
                        <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.8", margin: 0 }}>
                          {clause.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Fraud Warning CTA */}
        <section
          style={{
            background: "linear-gradient(135deg, #7f1d1d, #ef4444)",
            padding: "52px 0",
          }}
        >
          <Container>
            <Row className="align-items-center text-white">
              <Col md={8}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "10px" }}>
                  <i className="bi bi-shield-x" style={{ fontSize: "36px" }} />
                  <h3 style={{ fontWeight: 800, fontSize: "26px", margin: 0 }}>
                    Beware of Job Scams
                  </h3>
                </div>
                <p style={{ opacity: 0.9, fontSize: "15px", lineHeight: "1.75", marginBottom: 0 }}>
                  <strong>NEVER pay money</strong> for a job interview, application, or placement. Genuine employers do not charge candidates. If you encounter suspicious activity on Finder, report it immediately.
                </p>
              </Col>
              <Col md={4} className="text-md-end mt-3 mt-md-0">
                <a
                  href="mailto:fraud@finder.com"
                  className="btn-portal-primary"
                  style={{ background: "white", color: "#ef4444" }}
                >
                  <i className="bi bi-flag-fill" /> Report Fraud
                </a>
              </Col>
            </Row>
          </Container>
        </section>

        {/* General Statement */}
        <section style={{ padding: "48px 0", background: "white" }}>
          <Container>
            <Row className="justify-content-center">
              <Col md={8} className="text-center">
                <h4 style={{ fontWeight: 700, color: "#05264e", marginBottom: "16px" }}>
                  General Statement
                </h4>
                <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.85" }}>
                  The information provided on the Finder platform is for general informational purposes only. Nothing on this platform constitutes legal, financial, or professional career advice. Finder reserves the right to update this Disclaimer at any time. Continued use of the platform after changes are posted constitutes your acceptance of the updated Disclaimer.
                </p>
                <div style={{ marginTop: "24px", display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/privacy-policy" className="btn-portal-outline">
                    <i className="bi bi-shield-fill" /> Privacy Policy
                  </Link>
                  <Link href="/terms-conditions" className="btn-portal-outline">
                    <i className="bi bi-file-earmark-text-fill" /> Terms & Conditions
                  </Link>
                  <Link href="/contact-us" className="btn-portal-outline">
                    <i className="bi bi-envelope-fill" /> Contact Us
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Disclaimer;
