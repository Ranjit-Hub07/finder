"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const sections = [
  {
    id: "collection",
    icon: "bi-database-fill",
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you create an account, apply for jobs, or contact us. This includes:

    • Personal Identification: Full name, email address, phone number, date of birth, gender (optional).
    • Professional Information: Work history, educational qualifications, skills, resume/CV, cover letters, certifications.
    • Account Credentials: Username and encrypted password.
    • Profile Media: Profile photo, portfolio documents.
    • Recruiter Information: Company name, designation, GST details, company logo, billing address.
    • Usage Data: Pages visited, search queries entered, jobs clicked and applied to, time spent on platform.
    • Device & Technical Data: IP address, browser type, operating system, referral URLs, cookies.`,
  },
  {
    id: "use",
    icon: "bi-gear-fill",
    title: "2. How We Use Your Information",
    content: `Finder uses the information we collect for the following purposes:

    • To create and manage your account and profile.
    • To match you with relevant job opportunities based on your skills and preferences.
    • To enable recruiters to discover and contact suitable candidates.
    • To send you job alerts, application status updates, and platform notifications.
    • To process payments and manage subscription plans for recruiters.
    • To improve platform features, performance, and user experience.
    • To detect, prevent, and address fraud, abuse, or security vulnerabilities.
    • To comply with applicable legal obligations and respond to lawful requests.`,
  },
  {
    id: "sharing",
    icon: "bi-share-fill",
    title: "3. Information Sharing & Disclosure",
    content: `We do not sell, rent, or trade your personal information. We may share your data in the following limited circumstances:

    • With Recruiters: If you apply for a job or mark your profile as publicly searchable, your resume and profile details become visible to subscribed recruiters.
    • Service Providers: Trusted third-party vendors who help us operate the platform (cloud hosting, email delivery, analytics) — subject to strict confidentiality agreements.
    • Legal Compliance: When required by law, court order, or government authority.
    • Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity.
    • With Your Consent: Any other purpose with your explicit prior consent.`,
  },
  {
    id: "security",
    icon: "bi-shield-lock-fill",
    title: "4. Data Security",
    content: `We take the security of your personal information seriously. Our security measures include:

    • All data is transmitted over encrypted HTTPS connections.
    • Passwords are stored using industry-standard bcrypt hashing — never in plaintext.
    • Access to personal data is restricted to authorized personnel on a need-to-know basis.
    • Regular security audits and vulnerability assessments are conducted.
    • Two-factor authentication is available for account access.
    
    While we implement strong protections, no method of electronic transmission or storage is 100% secure. We encourage users to use strong, unique passwords and log out from shared devices.`,
  },
  {
    id: "cookies",
    icon: "bi-cookie",
    title: "5. Cookies & Tracking",
    content: `We use cookies and similar tracking technologies to enhance your experience on our platform:

    • Essential Cookies: Required for core functionality like session management and authentication.
    • Analytics Cookies: Help us understand how users interact with the platform (e.g., Google Analytics).
    • Preference Cookies: Remember your settings and preferences across sessions.
    • Marketing Cookies: Used to deliver relevant job alerts and advertisements.
    
    You can manage or disable cookies in your browser settings. Note that disabling essential cookies may affect platform functionality.`,
  },
  {
    id: "rights",
    icon: "bi-person-check-fill",
    title: "6. Your Rights & Choices",
    content: `As a Finder user, you have the following rights regarding your personal data:

    • Access: Request a copy of the personal data we hold about you.
    • Correction: Update or correct inaccurate information via your profile settings.
    • Deletion: Request deletion of your account and associated data (subject to legal retention requirements).
    • Portability: Request your data in a structured, machine-readable format.
    • Opt-out: Unsubscribe from marketing communications at any time.
    • Profile Visibility: Control whether your profile is publicly searchable by recruiters.
    
    To exercise any of these rights, contact us at privacy@finder.com.`,
  },
  {
    id: "retention",
    icon: "bi-calendar-fill",
    title: "7. Data Retention",
    content: `We retain your personal information for as long as your account is active or as needed to provide services. Specifically:

    • Active account data is retained indefinitely while the account exists.
    • Upon account deletion, personal data is purged within 30 days, except where retention is required by law.
    • Application records may be retained for up to 2 years for recruiter dispute resolution purposes.
    • Financial transaction records are retained for 7 years per applicable tax regulations.`,
  },
  {
    id: "changes",
    icon: "bi-arrow-clockwise",
    title: "8. Updates to This Policy",
    content: `We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or for other operational reasons. 

    When we make significant changes, we will:
    • Post the updated policy on this page with a revised "Last Updated" date.
    • Notify registered users via email or in-app notification for material changes.
    
    We encourage you to review this page periodically. Your continued use of Finder after any changes constitutes acceptance of the updated policy.`,
  },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* Banner */}
        <div className="page-banner">
          <Container>
            <h1 style={{ fontWeight: 800, fontSize: "40px" }}>Privacy Policy</h1>
            <p style={{ opacity: 0.9, fontSize: "16px", marginTop: "8px" }}>
              Last updated: September 2024
            </p>
          </Container>
          <div className="breadcrumb-pill">
            <Link href="/home"><i className="bi bi-house" /> Home</Link>
            <i className="bi bi-chevron-right" />
            <span>Privacy Policy</span>
          </div>
        </div>

        {/* Intro */}
        <div style={{ background: "#f0f4ff", borderBottom: "1px solid #e5eaf3", padding: "28px 0" }}>
          <Container>
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                maxWidth: "820px",
              }}
            >
              <i className="bi bi-shield-fill-check" style={{ fontSize: "32px", color: "#4f46e5", flexShrink: 0 }} />
              <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.8", margin: 0 }}>
                At <strong>Finder</strong>, we are committed to protecting your privacy and handling your personal data with transparency, respect, and care. This Privacy Policy explains what information we collect, how we use it, and your rights as a user of our platform. By using Finder, you agree to the practices described in this policy.
              </p>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <section style={{ padding: "60px 0", background: "#f8f9fc" }}>
          <Container>
            <Row>
              {/* Sticky TOC */}
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

              {/* Sections */}
              <Col md={9}>
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    id={sec.id}
                    style={{
                      background: "white",
                      borderRadius: "14px",
                      marginBottom: "20px",
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

                {/* Contact */}
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
                    Questions About This Policy?
                  </h5>
                  <p style={{ color: "#4b5563", fontSize: "14px", marginBottom: "16px" }}>
                    If you have any concerns or questions about this Privacy Policy or how your data is handled, please contact our Privacy Officer:
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

export default PrivacyPolicy;
