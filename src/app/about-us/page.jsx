"use client";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <Head>
        <title>About Us | Finder</title>
      </Head>

      <div style={{ paddingTop: "110px" }}>
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">About Us</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Empowering talent and connecting visionary employers across the nation.
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">About Us</span>
            </div>
          </Container>
        </div>

        {/* =======================
            PREMIUM ABOUT SECTION 
        ======================== */}
        <section className="py-5" style={{ background: "#f8f9fc" }}>
          <Container>
            <Row className="align-items-center">
              <Col md={6}>
                <h2
                  className="fw-bold mb-3"
                  style={{
                    fontSize: "38px",
                    color: "#0a2540",
                    lineHeight: "1.2",
                  }}
                >
                  Your Gateway to Better Career Opportunities
                </h2>

                <p style={{ fontSize: "17px", color: "#555", lineHeight: "1.8" }}>
                 Finder provides reliable job information across India & abroad —
                  including private and government opportunities. We make discovering jobs
                  fast, simple, and efficient.
                </p>

                <p style={{ fontSize: "17px", color: "#555", lineHeight: "1.8" }}>
                  With advanced job filters, recruiter tools, and easy navigation, our
                  platform bridges the gap between recruiters and skilled professionals.
                </p>

                <Link
                  href="/career"
                  className="btn px-4 py-2 mt-2"
                  style={{
                    background: "#6f42c1",
                    color: "white",
                    borderRadius: "8px",
                    fontWeight: 600,
                  }}
                >
                  Explore Jobs
                </Link>
              </Col>

              <Col md={6} className="text-center">
                <img
                  src="/image/about us.jpeg"
                  alt="About Finder"
                  className="img-fluid shadow-lg"
                  style={{
                    borderRadius: "20px",
                    width: "85%",
                    maxHeight: "480px",
                    objectFit: "cover",
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* =======================
            WHY CHOOSE US (Dribbble Style)
        ======================== */}
        <section className="py-5">
          <Container>
            <h2
              className="fw-bold mb-4 text-center"
              style={{ color: "#0a2540", fontSize: "34px" }}
            >
              Why Choose Finder?
            </h2>

            <Row>
              {[
                {
                  icon: "bi-graph-up-arrow",
                  title: "Smart Job Recommendations",
                  text: "AI-powered suggestions based on your skills, experience, and interests.",
                },
                {
                  icon: "bi-briefcase-fill",
                  title: "Verified Recruiters",
                  text: "All recruiters are screened to ensure secure, trusted job listings.",
                },
                {
                  icon: "bi-lightning-charge-fill",
                  title: "Fast Job Alerts",
                  text: "Instant notifications for new job openings that match your profile.",
                },
              ].map((box, index) => (
                <Col md={4} key={index} className="mb-4">
                  <div
                    style={{
                      padding: "25px",
                      borderRadius: "18px",
                      color: "white",
                      background:
                        "linear-gradient(135deg, #8A2BE2, #4C6EF5)", // purple → blue gradient
                      boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 15px 35px rgba(0,0,0,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 25px rgba(0,0,0,0.12)";
                    }}
                  >
                    <i
                      className={`bi ${box.icon}`}
                      style={{
                        fontSize: "40px",
                        marginBottom: "15px",
                      }}
                    ></i>

                    <h5 className="fw-bold">{box.title}</h5>
                    <p style={{ fontSize: "15px", marginTop: "10px" }}>{box.text}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* =======================
            MISSION SECTION
        ======================== */}
        <section className="py-5" style={{ background: "#f8f9fc" }}>
          <Container>
            <h2
              className="fw-bold mb-3 text-center"
              style={{ color: "#0a2540", fontSize: "34px" }}
            >
              Our Mission
            </h2>
            <p
              style={{
                maxWidth: "750px",
                margin: "0 auto",
                textAlign: "center",
                fontSize: "17px",
                color: "#666",
                lineHeight: "1.8",
              }}
            >
              We aim to provide a modern, seamless, and trustworthy platform that helps
              individuals find the right career path. From job discovery to recruiter
              connections — we simplify the hiring process for both job seekers and
              employers.
            </p>
          </Container>
        </section>
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

export default AboutUs;
