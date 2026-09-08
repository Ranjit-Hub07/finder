"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const stories = [
  {
    name: "Arjun Verma",
    from: "Fresh Graduate",
    to: "Software Engineer @ TCS Bhubaneswar",
    city: "Bhubaneswar, Odisha",
    quote:
      "I had applied to over 40 companies with no response. Within 2 weeks of creating my Finder profile, I received 3 interview calls. The job recommendations were spot-on for my skills.",
    duration: "Job in 18 days",
    hike: "First Salary: ₹6.5 LPA",
    avatar: "bi-person-circle",
    color: "#4f46e5",
  },
  {
    name: "Meena Patel",
    from: "2 Years Career Gap",
    to: "HR Manager @ HDFC Life",
    city: "Ahmedabad, Gujarat",
    quote:
      "Returning to work after a 2-year break felt impossible. Finder's recruiter tools helped me connect directly with hiring managers who understood my situation. I'm now thriving at HDFC Life.",
    duration: "Job in 31 days",
    hike: "₹9.2 LPA",
    avatar: "bi-person-circle",
    color: "#14b981",
  },
  {
    name: "Suresh Nair",
    from: "Automobile Technician",
    to: "Service Manager @ Tata Motors",
    city: "Chennai, Tamil Nadu",
    quote:
      "I was stuck in the same position for 6 years. Finder matched me with a Tata Motors opening that perfectly fit my expertise. The application process was seamless.",
    duration: "Job in 22 days",
    hike: "60% Salary Hike",
    avatar: "bi-person-circle",
    color: "#f59e0b",
  },
  {
    name: "Ritu Gupta",
    from: "Call Centre Agent",
    to: "Digital Marketing Executive @ Zomato",
    city: "Delhi NCR",
    quote:
      "I never thought I could make the switch from BPO to digital marketing. Finder's skill-matched recommendations opened a door I didn't even know was there. Life-changing!",
    duration: "Job in 27 days",
    hike: "75% Salary Hike",
    avatar: "bi-person-circle",
    color: "#8b5cf6",
  },
  {
    name: "Anil Bhatt",
    from: "Village — Zero Industry Exposure",
    to: "Quality Analyst @ Infosys",
    city: "Pune, Maharashtra",
    quote:
      "Coming from a small village in Bihar, I never imagined working at a company like Infosys. Finder guided me at every step and helped me land my dream job.",
    duration: "Job in 45 days",
    hike: "₹5.8 LPA Package",
    avatar: "bi-person-circle",
    color: "#ef4444",
  },
  {
    name: "Swati Mishra",
    from: "Finance Graduate",
    to: "Business Analyst @ Deloitte",
    city: "Hyderabad, Telangana",
    quote:
      "The filter features on Finder helped me narrow down exactly the type of role I wanted — and I found it in less than 3 weeks. Incredible platform.",
    duration: "Job in 21 days",
    hike: "₹11 LPA",
    avatar: "bi-person-circle",
    color: "#0891b2",
  },
];

const stats = [
  { value: "1,20,000+", label: "Successful Placements", icon: "bi-briefcase-fill" },
  { value: "8,500+", label: "Active Recruiters", icon: "bi-building-fill" },
  { value: "92%", label: "Seeker Satisfaction Rate", icon: "bi-emoji-smile-fill" },
  { value: "18 days", label: "Avg. Time to Job Offer", icon: "bi-clock-fill" },
];

const SuccessStory = () => {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* Banner */}
        <div className="page-banner">
          <Container>
            <h1 style={{ fontWeight: 800, fontSize: "40px" }}>Success Stories</h1>
            <p style={{ opacity: 0.9, fontSize: "16px", marginTop: "8px" }}>
              Real people. Real jobs. Real transformations — powered by Finder.
            </p>
          </Container>
          <div className="breadcrumb-pill">
            <Link href="/home"><i className="bi bi-house" /> Home</Link>
            <i className="bi bi-chevron-right" />
            <span>Success Stories</span>
          </div>
        </div>

        {/* Stats Strip */}
        <div style={{ background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)", padding: "32px 0" }}>
          <Container>
            <Row className="text-center text-white">
              {stats.map((s, i) => (
                <Col md={3} sm={6} key={i}>
                  <div style={{ padding: "8px" }}>
                    <i className={`bi ${s.icon}`} style={{ fontSize: "28px", opacity: 0.8, display: "block", marginBottom: "6px" }} />
                    <div style={{ fontSize: "30px", fontWeight: 800, marginBottom: "4px" }}>{s.value}</div>
                    <div style={{ fontSize: "13px", opacity: 0.85 }}>{s.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </div>

        {/* Featured Story */}
        <section style={{ background: "linear-gradient(180deg, #f0f4ff, #ffffff)", padding: "60px 0" }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-heading">Hear from Our Community</h2>
              <p className="section-subheading mt-2">
                Every story below represents a life changed, a dream fulfilled, a barrier broken.
              </p>
            </div>

            {/* Spotlight Story */}
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 12px 40px rgba(34,52,128,0.12)",
                marginBottom: "40px",
                border: `2px solid ${stories[selected].color}30`,
                transition: "all 0.4s ease",
              }}
            >
              <Row className="align-items-center">
                <Col md={2} className="text-center mb-3 mb-md-0">
                  <i
                    className={`bi ${stories[selected].avatar}`}
                    style={{ fontSize: "72px", color: stories[selected].color }}
                  />
                </Col>
                <Col md={10}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                    <span
                      className="badge-primary"
                      style={{ background: `${stories[selected].color}18`, color: stories[selected].color }}
                    >
                      {stories[selected].duration}
                    </span>
                    <span className="badge-success">{stories[selected].hike}</span>
                    <span style={{ color: "#66789c", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <i className="bi bi-geo-alt" /> {stories[selected].city}
                    </span>
                  </div>

                  <div style={{ fontSize: "16px", color: "#66789c", marginBottom: "6px" }}>
                    <span
                      style={{
                        background: "#fee2e2",
                        color: "#ef4444",
                        padding: "2px 10px",
                        borderRadius: "50px",
                        fontSize: "12px",
                        fontWeight: 600,
                        marginRight: "8px",
                      }}
                    >
                      FROM
                    </span>
                    {stories[selected].from}
                    <i className="bi bi-arrow-right mx-2" />
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#14b981",
                        padding: "2px 10px",
                        borderRadius: "50px",
                        fontSize: "12px",
                        fontWeight: 600,
                        marginRight: "8px",
                      }}
                    >
                      TO
                    </span>
                    {stories[selected].to}
                  </div>

                  <blockquote
                    style={{
                      fontSize: "16px",
                      color: "#4b5563",
                      lineHeight: "1.75",
                      borderLeft: `4px solid ${stories[selected].color}`,
                      paddingLeft: "18px",
                      margin: "16px 0 8px",
                      fontStyle: "italic",
                    }}
                  >
                    "{stories[selected].quote}"
                  </blockquote>

                  <div style={{ fontWeight: 700, color: "#05264e", marginTop: "10px" }}>
                    — {stories[selected].name}
                  </div>
                </Col>
              </Row>
            </div>

            {/* Story Selector Cards */}
            <Row>
              {stories.map((story, idx) => (
                <Col md={4} sm={6} key={idx} className="mb-3">
                  <div
                    onClick={() => setSelected(idx)}
                    className="card-hover"
                    style={{
                      padding: "18px 20px",
                      cursor: "pointer",
                      borderColor: selected === idx ? story.color : "#e5eaf3",
                      background: selected === idx ? `${story.color}08` : "white",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <i className={`bi ${story.avatar}`} style={{ fontSize: "38px", color: story.color }} />
                      <div>
                        <div style={{ fontWeight: 700, color: "#05264e", fontSize: "14px" }}>{story.name}</div>
                        <div style={{ fontSize: "12px", color: "#66789c", marginTop: "2px" }}>{story.to.split("@")[0].trim()}</div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: story.color,
                            fontWeight: 600,
                            marginTop: "4px",
                          }}
                        >
                          {story.duration} · {story.hike}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* CTA */}
        <section style={{ background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)", padding: "60px 0" }}>
          <Container className="text-center text-white">
            <h3 style={{ fontWeight: 800, fontSize: "30px", marginBottom: "12px" }}>
              Your success story starts here.
            </h3>
            <p style={{ opacity: 0.85, fontSize: "16px", marginBottom: "28px" }}>
              Join over 1,20,000 professionals who found their dream jobs through Finder.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/seeker-login/sign-up" className="btn-portal-primary">
                <i className="bi bi-person-plus-fill" /> Create Free Account
              </Link>
              <Link href="/job-listing" className="btn-portal-outline" style={{ color: "white", borderColor: "white" }}>
                <i className="bi bi-search" /> Browse Jobs
              </Link>
            </div>
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SuccessStory;
