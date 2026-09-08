"use client";
import React from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const leaders = [
  {
    name: "Rajesh Kumar",
    role: "Founder & Managing Director",
    bio: "20+ years of experience in HR technology and talent acquisition. Passionate about connecting talent with opportunity across India.",
    avatar: "/image/profile.png",
    social: { linkedin: "#", twitter: "#" },
    color: "#4f46e5",
  },
  {
    name: "Priya Sharma",
    role: "Chief Technology Officer",
    bio: "Ex-engineer at Infosys and Wipro. Leads the platform engineering team, driving AI-powered job matching and recruiter tools.",
    avatar: "/image/profile.png",
    social: { linkedin: "#", twitter: "#" },
    color: "#8b5cf6",
  },
  {
    name: "Ankit Mishra",
    role: "Head of Product",
    bio: "Formerly at Naukri and LinkedIn India. Obsessed with intuitive UX and building features that job seekers actually love.",
    avatar: "/image/profile.png",
    social: { linkedin: "#", twitter: "#" },
    color: "#14b981",
  },
  {
    name: "Sunita Pattnaik",
    role: "Director – Recruiter Partnerships",
    bio: "Built and scaled recruiter partnerships across 500+ companies in Odisha, Bengal, and Maharashtra over the last decade.",
    avatar: "/image/profile.png",
    social: { linkedin: "#", twitter: "#" },
    color: "#f59e0b",
  },
  {
    name: "Debasish Nayak",
    role: "Head of Marketing",
    bio: "Growth hacker by trade, storyteller by passion. Drives the brand and demand generation programs across digital channels.",
    avatar: "/image/profile.png",
    social: { linkedin: "#", twitter: "#" },
    color: "#ef4444",
  },
  {
    name: "Kavitha Rao",
    role: "Lead – Customer Success",
    bio: "Champions both seeker and recruiter experiences. Ensures that every interaction on Finder leaves a lasting positive impression.",
    avatar: "/image/profile.png",
    social: { linkedin: "#", twitter: "#" },
    color: "#0891b2",
  },
];

const values = [
  {
    icon: "bi-heart-fill",
    color: "#ef4444",
    title: "People First",
    desc: "Every feature, every decision starts with asking: does this make life better for the job seeker or recruiter?",
  },
  {
    icon: "bi-shield-check-fill",
    color: "#14b981",
    title: "Trust & Transparency",
    desc: "We verify recruiters, protect seeker data, and communicate honestly — because trust is the foundation of great hiring.",
  },
  {
    icon: "bi-lightning-charge-fill",
    color: "#f59e0b",
    title: "Speed & Innovation",
    desc: "The job market moves fast. We build fast too — shipping features, AI tools, and integrations that stay ahead of the curve.",
  },
  {
    icon: "bi-globe2",
    color: "#4f46e5",
    title: "Inclusive Opportunity",
    desc: "From tier-1 metros to tier-3 cities — every Indian deserves access to great career opportunities.",
  },
];

const Team = () => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* Banner */}
        <div className="page-banner">
          <Container>
            <h1 style={{ fontWeight: 800, fontSize: "40px" }}>Meet Our Team</h1>
            <p style={{ opacity: 0.9, fontSize: "16px", marginTop: "8px" }}>
              The passionate people behind Finder — building India's most trusted job portal.
            </p>
          </Container>
          <div className="breadcrumb-pill">
            <Link href="/home"><i className="bi bi-house" /> Home</Link>
            <i className="bi bi-chevron-right" />
            <span>Our Team</span>
          </div>
        </div>

        {/* Mission Headline */}
        <section style={{ background: "linear-gradient(180deg, #f0f4ff, #ffffff)", padding: "60px 0" }}>
          <Container className="text-center">
            <div className="badge-primary" style={{ display: "inline-flex", marginBottom: "16px" }}>
              OUR STORY
            </div>
            <h2 className="section-heading" style={{ maxWidth: "700px", margin: "0 auto 20px" }}>
              Driven by Purpose, United by Passion
            </h2>
            <p className="section-subheading">
              We started Finder with a single mission: make job discovery fast, fair, and effective for every Indian.
              Today, our team of 50+ professionals works tirelessly across product, engineering, recruiter partnerships,
              and customer success — fueled by the belief that the right job can change a life.
            </p>
          </Container>
        </section>

        {/* Leadership Grid */}
        <section style={{ background: "#f8f9fc", padding: "60px 0" }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-heading">Leadership Team</h2>
              <p className="section-subheading mt-2">
                Experienced leaders from tech, HR, and product — committed to a single vision.
              </p>
            </div>
            <Row>
              {leaders.map((person, idx) => (
                <Col md={4} key={idx} className="mb-4">
                  <div
                    className="card-hover"
                    style={{ padding: "28px 24px", textAlign: "center" }}
                  >
                    {/* Avatar */}
                    <div style={{ position: "relative", display: "inline-block", marginBottom: "16px" }}>
                      <img
                        src={person.avatar}
                        alt={person.name}
                        style={{
                          width: "88px",
                          height: "88px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: `3px solid ${person.color}`,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "2px",
                          right: "2px",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#14b981",
                          border: "2px solid white",
                        }}
                      />
                    </div>
                    <h5 style={{ fontWeight: 700, color: "#05264e", marginBottom: "4px" }}>{person.name}</h5>
                    <div
                      className="badge-primary"
                      style={{
                        display: "inline-flex",
                        marginBottom: "12px",
                        background: `${person.color}18`,
                        color: person.color,
                      }}
                    >
                      {person.role}
                    </div>
                    <p style={{ color: "#66789c", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
                      {person.bio}
                    </p>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <a href={person.social.linkedin} style={{ color: "#0077b5", fontSize: "20px" }}>
                        <i className="bi bi-linkedin" />
                      </a>
                      <a href={person.social.twitter} style={{ color: "#1da1f2", fontSize: "20px" }}>
                        <i className="bi bi-twitter-x" />
                      </a>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Company Values */}
        <section style={{ padding: "60px 0" }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-heading">What We Stand For</h2>
              <p className="section-subheading mt-2">
                Our core values guide every product decision, every hire, and every interaction.
              </p>
            </div>
            <Row>
              {values.map((val, idx) => (
                <Col md={3} sm={6} key={idx} className="mb-4">
                  <div
                    style={{
                      padding: "32px 24px",
                      borderRadius: "16px",
                      background: `linear-gradient(135deg, ${val.color}12, ${val.color}06)`,
                      border: `1px solid ${val.color}30`,
                      textAlign: "center",
                      height: "100%",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow = `0 12px 32px ${val.color}25`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "18px",
                        background: `${val.color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <i className={`bi ${val.icon}`} style={{ fontSize: "26px", color: val.color }} />
                    </div>
                    <h5 style={{ fontWeight: 700, color: "#05264e", marginBottom: "10px" }}>{val.title}</h5>
                    <p style={{ color: "#66789c", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>{val.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Join Us CTA */}
        <section style={{ background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)", padding: "60px 0" }}>
          <Container className="text-center text-white">
            <h3 style={{ fontWeight: 800, fontSize: "30px", marginBottom: "12px" }}>
              Want to join our team?
            </h3>
            <p style={{ opacity: 0.85, fontSize: "16px", marginBottom: "28px" }}>
              We are always looking for passionate, driven individuals who want to shape the future of work in India.
            </p>
            <Link href="/career" className="btn-portal-primary">
              <i className="bi bi-briefcase-fill" /> View Open Positions
            </Link>
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Team;
