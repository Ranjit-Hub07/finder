"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const sections = [
  {
    id: "acceptance",
    icon: "bi-check-circle-fill",
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Finder platform (finder.com), you confirm that you have read, understood, and agree to be bound by these Terms & Conditions, along with our Privacy Policy and any other policies referenced herein.

    If you do not agree to these Terms, you must discontinue use of the platform immediately. These Terms apply to all users, including job seekers, recruiters, and visitors.
    
    Finder reserves the right to update these Terms at any time. Continued use of the platform after changes are posted constitutes acceptance of the revised Terms.`,
  },
  {
    id: "accounts",
    icon: "bi-person-badge-fill",
    title: "2. User Accounts & Registration",
    content: `To access most features of Finder, you must create an account. By registering, you agree to:

    • Provide accurate, complete, and current information during registration.
    • Maintain and promptly update your account information.
    • Keep your password confidential and not share it with third parties.
    • Be fully responsible for all activities that occur under your account.
    • Notify us immediately at support@finder.com if you suspect unauthorized access.
    
    Finder reserves the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.`,
  },
  {
    id: "seeker-terms",
    icon: "bi-person-lines-fill",
    title: "3. Job Seeker Terms",
    content: `As a registered Job Seeker on Finder, you agree to:

    • Only submit genuine applications for positions you are qualified and interested in.
    • Not apply for jobs on behalf of another person without their explicit consent.
    • Keep your profile information accurate and up-to-date.
    • Not misrepresent your qualifications, experience, or identity.
    • Not use the platform to harvest recruiter contact details for unsolicited communications.
    • Understand that Finder does not guarantee employment or interview opportunities.
    
    Seeker profiles may be made discoverable to subscribed recruiters unless you set your profile to private in your account settings.`,
  },
  {
    id: "recruiter-terms",
    icon: "bi-building-fill",
    title: "4. Recruiter Terms",
    content: `As a Recruiter or Employer on Finder, you agree to:

    • Post only genuine, legal, and non-discriminatory job openings.
    • Not post duplicate, expired, or misleading job listings.
    • Treat all applicant data with confidentiality and in compliance with applicable data protection laws.
    • Not use candidate data for purposes outside the recruitment process.
    • Not engage in or facilitate any fraudulent, deceptive, or exploitative hiring practices.
    • Comply with all applicable labor laws, minimum wage requirements, and equal opportunity guidelines.
    
    Finder reserves the right to review, edit, or remove any job posting that violates these Terms without prior notice.`,
  },
  {
    id: "payment",
    icon: "bi-credit-card-fill",
    title: "5. Subscription, Payments & Refunds",
    content: `Recruiter accounts on Finder may require a paid subscription to access premium features. By subscribing:

    • You agree to pay the applicable subscription fee as listed on the Packages page.
    • Payments are processed securely via our designated payment gateway.
    • Subscriptions are auto-renewed at the end of each billing cycle unless cancelled.
    • Refunds: Subscription fees are generally non-refundable once the billing period has commenced. Exceptions may be granted at Finder's sole discretion for verified technical failures.
    • Cancellation: You may cancel your subscription at any time. Access continues until the end of the current billing period.
    
    For billing disputes, contact billing@finder.com within 7 days of the charge.`,
  },
  {
    id: "prohibited",
    icon: "bi-slash-circle-fill",
    title: "6. Prohibited Conduct",
    content: `The following activities are strictly prohibited on the Finder platform:

    • Posting false, misleading, or fraudulent job listings or profiles.
    • Collecting user data through scraping, bots, or automated means.
    • Impersonating another person, company, or Finder representative.
    • Sending unsolicited spam, phishing messages, or malware.
    • Attempting to gain unauthorized access to any account or server.
    • Circumventing any platform security or verification measure.
    • Using the platform for any unlawful purpose or in violation of any applicable law.
    • Posting content that is defamatory, obscene, discriminatory, or violates intellectual property rights.
    
    Violation of these prohibitions may result in immediate account termination and legal action.`,
  },
  {
    id: "ip",
    icon: "bi-award-fill",
    title: "7. Intellectual Property",
    content: `All content on the Finder platform — including text, graphics, logos, icons, software, and code — is the intellectual property of Finder or its content suppliers and is protected by applicable copyright and trademark laws.

    • You may not reproduce, distribute, modify, or create derivative works from any platform content without express written permission.
    • User-generated content (resumes, job postings, comments) remains the property of the respective user. By uploading content, you grant Finder a non-exclusive, royalty-free license to display, distribute, and process it for platform operations.
    
    Any unauthorized use of Finder's intellectual property may result in legal action.`,
  },
  {
    id: "limitation",
    icon: "bi-exclamation-triangle-fill",
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by law, Finder and its officers, employees, agents, and partners shall not be liable for:

    • Any indirect, incidental, special, consequential, or punitive damages arising from platform use.
    • Unauthorized access to or alteration of your data.
    • Errors, inaccuracies, or omissions in job postings by third-party recruiters.
    • Any actions taken by recruiters or candidates based on information shared through the platform.
    • Loss of data, revenue, or business opportunity resulting from platform downtime.
    
    Finder acts as a marketplace facilitating connections between job seekers and recruiters. We are not a staffing agency and do not guarantee employment outcomes.`,
  },
];

const TermsCondition = () => {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* Banner */}
        <div className="page-banner">
          <Container>
            <h1 style={{ fontWeight: 800, fontSize: "40px" }}>Terms & Conditions</h1>
            <p style={{ opacity: 0.9, fontSize: "16px", marginTop: "8px" }}>
              Last updated: September 2024 · Please read carefully before using our platform.
            </p>
          </Container>
          <div className="breadcrumb-pill">
            <Link href="/home"><i className="bi bi-house" /> Home</Link>
            <i className="bi bi-chevron-right" />
            <span>Terms & Conditions</span>
          </div>
        </div>

        {/* Intro */}
        <div style={{ background: "#fef9c3", borderBottom: "1px solid #fde68a", padding: "24px 0" }}>
          <Container>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", maxWidth: "820px" }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "28px", color: "#d97706", flexShrink: 0 }} />
              <p style={{ color: "#78350f", fontSize: "15px", lineHeight: "1.75", margin: 0 }}>
                These Terms & Conditions govern your use of the Finder platform. By accessing or registering on finder.com, you agree to comply with these terms. If you disagree, please discontinue use immediately.
              </p>
            </div>
          </Container>
        </div>

        {/* Content */}
        <section style={{ padding: "60px 0", background: "#f8f9fc" }}>
          <Container>
            <Row>
              {/* TOC */}
              <Col md={3} className="d-none d-md-block">
                <div
                  style={{
                    position: "sticky",
                    top: "180px",
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #e5eaf3",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#05264e", marginBottom: "14px", fontSize: "13px" }}>
                    TABLE OF CONTENTS
                  </div>
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      style={{
                        display: "block",
                        color: "#66789c",
                        textDecoration: "none",
                        fontSize: "13px",
                        padding: "7px 0",
                        borderBottom: "1px solid #f0f4ff",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => e.target.style.color = "#4f46e5"}
                      onMouseLeave={e => e.target.style.color = "#66789c"}
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              </Col>

              <Col md={9}>
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    id={sec.id}
                    style={{
                      background: "white",
                      borderRadius: "14px",
                      marginBottom: "16px",
                      border: "1px solid #e5eaf3",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "20px 24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        background: activeSection === idx ? "#f0f4ff" : "white",
                        borderBottom: activeSection === idx ? "1px solid #e5eaf3" : "none",
                      }}
                      onClick={() => setActiveSection(activeSection === idx ? null : idx)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: "#e8eeff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i className={`bi ${sec.icon}`} style={{ color: "#4f46e5", fontSize: "18px" }} />
                        </div>
                        <span style={{ fontWeight: 700, color: "#05264e", fontSize: "15px" }}>{sec.title}</span>
                      </div>
                      <i className={`bi bi-chevron-${activeSection === idx ? "up" : "down"}`} style={{ color: "#66789c" }} />
                    </div>
                    {activeSection === idx && (
                      <div
                        style={{
                          padding: "22px 24px",
                          color: "#4b5563",
                          fontSize: "14px",
                          lineHeight: "1.9",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {sec.content}
                      </div>
                    )}
                  </div>
                ))}

                <div
                  style={{
                    background: "linear-gradient(135deg, #e8eeff, #f0f4ff)",
                    borderRadius: "14px",
                    padding: "28px",
                    border: "1px solid #d0dcff",
                  }}
                >
                  <h5 style={{ fontWeight: 700, color: "#05264e", marginBottom: "10px" }}>
                    <i className="bi bi-envelope-fill me-2" style={{ color: "#4f46e5" }} />
                    Need Clarification?
                  </h5>
                  <p style={{ color: "#4b5563", fontSize: "14px", marginBottom: "16px" }}>
                    For any questions about these Terms & Conditions, please reach out to our legal team.
                  </p>
                  <a href="mailto:job@finder.com" className="btn-portal-primary" style={{ fontSize: "14px" }}>
                    <i className="bi bi-envelope" /> job@finder.com
                  </a>
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

export default TermsCondition;
