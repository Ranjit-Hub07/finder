"use client";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const ContactUs = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!recaptchaToken) {
      alert("⚠️ Please complete the reCAPTCHA verification.");
      return;
    }

    const data = {
      name: form.name.value,
      subject: form.subject.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
      recaptchaToken,
    };

    try {
      const res = await fetch("/api/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Message sent successfully!");
        form.reset();
        setRecaptchaToken(null);
      } else {
        alert("❌ Failed to send message. Please try again later.");
      }
    } catch (error) {
      alert("❌ Server error. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />

      <Head>
        <title>Contact Us | Finder</title>
      </Head>

      <div style={{ paddingTop: "110px" }}>
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Contact Us</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                We would love to hear from you. Get in touch with our team anytime!
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">Contact Us</span>
            </div>
          </Container>
        </div>

        {/* =====================================================
              🔵 SOFT BACKGROUND (ONLY AFTER BANNER)
        ===================================================== */}
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.74)), url('/image/contact.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            paddingBottom: "60px",
            paddingTop: "20px",
          }}
        >

          {/* ========================== CONTACT INFO CARD ========================== */}
          <Container style={{ position: "relative", zIndex: 10, marginTop: "-45px" }}>
            <div
              className="p-4"
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
              }}
            >
              <Row className="text-center align-items-center">
                <Col md={12}>
                  <Row className="text-center g-3">
                    <Col md={4} className="mb-3 mb-md-0">
                      <div className="d-flex flex-column align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: "44px",
                            height: "44px",
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            color: "#ef4444",
                            fontSize: "18px",
                          }}
                        >
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <h6 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "16px" }}>
                          Address
                        </h6>
                        <p className="mb-0 text-muted small">
                          Bhubaneswar, Odisha, India
                        </p>
                      </div>
                    </Col>

                    <Col md={4} className="mb-3 mb-md-0">
                      <div className="d-flex flex-column align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: "44px",
                            height: "44px",
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            color: "#10b981",
                            fontSize: "18px",
                          }}
                        >
                          <i className="bi bi-telephone-fill"></i>
                        </div>
                        <h6 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "16px" }}>
                          Phone
                        </h6>
                        <p className="mb-0">
                          <a href="tel:+917538057669" className="text-dark fw-semibold text-decoration-none small">
                            +91 7538057669
                          </a>
                        </p>
                      </div>
                    </Col>

                    <Col md={4}>
                      <div className="d-flex flex-column align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: "44px",
                            height: "44px",
                            backgroundColor: "rgba(79, 70, 229, 0.1)",
                            color: "#4f46e5",
                            fontSize: "18px",
                          }}
                        >
                          <i className="bi bi-envelope-fill"></i>
                        </div>
                        <h6 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "16px" }}>
                          Email
                        </h6>
                        <p className="mb-0">
                          <a href="mailto:job@finder.com" className="text-dark fw-semibold text-decoration-none small">
                            job@finder.com
                          </a>
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Container>

          {/* ========================== CONTACT FORM ========================== */}
          <Container className="py-5">
            <Row className="align-items-center">
              <Col md={7} className="text-start">
                <h2 style={{ fontSize: "16px", color: "#4076D9" }}>Contact us</h2>
                <h3 style={{ fontSize: "28px", color: "#05264e", fontWeight: "700" }}>
                  Get in touch
                </h3>

                <p style={{ color: "#666", marginBottom: "25px", fontSize: "16px" }}>
                  We are here to support you. Share your query with us.
                </p>

                <form onSubmit={handleSubmit}>
                  <Row className="g-3 mb-2">
                    <Col md={6}>
                      <input
                        type="text"
                        name="name"
                        className="form-control contact-input"
                        placeholder="Enter your name"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <input
                        type="text"
                        name="subject"
                        className="form-control contact-input"
                        placeholder="Subject"
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="g-3 mb-2">
                    <Col md={6}>
                      <input
                        type="email"
                        name="email"
                        className="form-control contact-input"
                        placeholder="Your email"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <input
                        type="text"
                        name="phone"
                        className="form-control contact-input"
                        placeholder="Phone number"
                        required
                      />
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <textarea
                      name="message"
                      rows="4"
                      className="form-control contact-input"
                      placeholder="Tell us about yourself"
                      required
                    ></textarea>
                  </div>

                  <div className="my-3">
                    <ReCAPTCHA
                      sitekey="6LebRv4rAAAAAITcu9U5vKPUkaGHIqMDlTJxLWLl"
                      onChange={(token) => setRecaptchaToken(token)}
                    />
                  </div>

                  <button className="btn btn-primary px-4 py-2 contact-btn">
                    <i className="bi bi-envelope-fill me-2"></i> Send Message
                  </button>
                </form>
              </Col>

              <Col md={5} className="text-center">
                <img
                  src="/image/img.png"
                  alt="Team"
                  className="team-image"
                  style={{ width: "70%", height: "100%", borderRadius: "10px" }}
                />
              </Col>
            </Row>
          </Container>

        </div>
      </div>

      <Footer />

      {/* ========================== GLOBAL STYLES ========================== */}
      <style jsx global>{`
        .team-image {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border-radius: 12px;
        }

        .team-image:hover {
          transform: scale(1.05) translateY(-4px);
        }

        .contact-input {
          border-radius: 10px;
          padding: 12px 15px;
          border: 1px solid #dce3f0;
          transition: 0.3s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.04);
        }

        .contact-input:focus {
          border-color: #4076d9;
          box-shadow: 0 0 6px rgba(64,118,217,0.4);
        }

        .contact-btn {
          border-radius: 8px;
          font-weight: 600;
          transition: 0.3s;
        }

        .contact-btn:hover {
          background-color: #2459b8;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      }
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

export default ContactUs;
