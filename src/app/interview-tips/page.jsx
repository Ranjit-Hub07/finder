"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const phases = [
  {
    icon: "bi-search",
    color: "#4f46e5",
    bg: "#e8eeff",
    title: "Phase 1: Research & Preparation",
    tips: [
      {
        heading: "Deep-dive into the Company",
        body: "Study the company's mission, recent news, product lines, key competitors, and culture. Check LinkedIn, Glassdoor, and the company blog. Interviewers are impressed when you reference specific projects or values.",
      },
      {
        heading: "Understand the Job Description",
        body: "Map each responsibility and required skill to examples from your own experience. Highlight keywords — they often mirror what the interviewer will probe.",
      },
      {
        heading: "Prepare Your 30-60-90 Day Plan",
        body: "For senior roles, sketch out what you'd prioritize in your first month, quarter, and 90 days. It signals initiative and strategic thinking.",
      },
      {
        heading: "Practice Out Loud",
        body: "Record yourself or practice with a friend. Most candidates underestimate the power of verbal fluency. Aim for concise, confident answers — not memorized scripts.",
      },
    ],
  },
  {
    icon: "bi-star-fill",
    color: "#f59e0b",
    bg: "#fef3c7",
    title: "Phase 2: Master the STAR Method",
    tips: [
      {
        heading: "What is STAR?",
        body: "STAR stands for Situation, Task, Action, Result. It's the gold standard framework for answering behavioral questions like 'Tell me about a time when...'",
      },
      {
        heading: "Situation",
        body: "Set the context briefly — what was the business challenge or scenario? Keep it to 2-3 sentences.",
      },
      {
        heading: "Task",
        body: "What was your specific responsibility? Clearly distinguish your role from the team's collective effort.",
      },
      {
        heading: "Action",
        body: "This is the most critical part — describe WHAT YOU did, step by step. Use 'I' not 'we'. Highlight leadership, creativity, or problem-solving.",
      },
      {
        heading: "Result",
        body: "Quantify whenever possible: 'Reduced churn by 18%', 'Delivered 2 weeks ahead of schedule', 'Increased revenue by ₹12L'. Numbers make stories memorable.",
      },
    ],
  },
  {
    icon: "bi-laptop",
    color: "#8b5cf6",
    bg: "#ede9fe",
    title: "Phase 3: Technical & Domain Rounds",
    tips: [
      {
        heading: "For Software / Tech Roles",
        body: "Brush up on Data Structures, Algorithms, and System Design. Practice on platforms like LeetCode, HackerRank, or Codeforces. For system design, practice whiteboarding scalable architectures.",
      },
      {
        heading: "For Finance / Analytics Roles",
        body: "Expect case studies, Excel/SQL tests, and valuation questions. Revise financial modeling, P&L reading, and data interpretation techniques.",
      },
      {
        heading: "For HR / Management Roles",
        body: "Prepare for leadership dilemma scenarios, organizational behavior questions, and policy interpretation. Study frameworks like OKRs, Maslow's hierarchy, and HR compliance.",
      },
      {
        heading: "Handling 'I Don't Know' Moments",
        body: "Never bluff. Say: 'That's a great question — let me reason through it.' Walk the interviewer through your thought process. Structured thinking under pressure is valued.",
      },
    ],
  },
  {
    icon: "bi-chat-dots-fill",
    color: "#14b981",
    bg: "#dcfce7",
    title: "Phase 4: During & After the Interview",
    tips: [
      {
        heading: "First Impressions Matter",
        body: "Log in (or arrive) 5 minutes early. Dress professionally. Maintain eye contact and smile naturally. For video calls, ensure good lighting and a quiet environment.",
      },
      {
        heading: "Ask Smart Questions",
        body: "Prepare 3–5 thoughtful questions: 'What does success look like in the first 90 days?', 'How do teams collaborate cross-functionally?', 'What are the biggest challenges your team is facing?'",
      },
      {
        heading: "The Thank-You Note",
        body: "Send a personalized thank-you email within 24 hours. Reference a specific moment from the interview. This sets you apart from 90% of candidates.",
      },
      {
        heading: "Negotiate Your Offer Strategically",
        body: "When you receive an offer, always take 24-48 hours to review. Research market benchmarks (Glassdoor, AmbitionBox). Counter with data, not emotion. Negotiate holistically — include joining bonus, WFH flexibility, and growth timeline.",
      },
    ],
  },
];

const quickTips = [
  { icon: "bi-clock", tip: "Arrive / join 5 minutes early" },
  { icon: "bi-camera-video", tip: "Test your mic & camera before video rounds" },
  { icon: "bi-journal-text", tip: "Carry printed copies of your resume" },
  { icon: "bi-emoji-smile", tip: "Be authentic — interviewers remember personality" },
  { icon: "bi-bar-chart-fill", tip: "Quantify your achievements wherever possible" },
  { icon: "bi-hand-thumbs-up-fill", tip: "End every answer with a positive outcome" },
];

const InterviewTips = () => {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* Banner */}
        <div className="page-banner">
          <Container>
            <h1 style={{ fontWeight: 800, fontSize: "40px" }}>Interview Mastery Guide</h1>
            <p style={{ opacity: 0.9, fontSize: "16px", marginTop: "8px" }}>
              From preparation to offer negotiation — everything you need to ace your next interview.
            </p>
          </Container>
          <div className="breadcrumb-pill">
            <Link href="/home"><i className="bi bi-house" /> Home</Link>
            <i className="bi bi-chevron-right" />
            <span>Interview Tips</span>
          </div>
        </div>

        {/* Quick Tips Strip */}
        <div style={{ background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)", padding: "24px 0" }}>
          <Container>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              {quickTips.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  <i className={`bi ${t.icon}`} style={{ fontSize: "18px", opacity: 0.85 }} />
                  {t.tip}
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* Phase Tabs */}
        <section style={{ background: "#f8f9fc", padding: "60px 0" }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-heading">The 4-Phase Interview Roadmap</h2>
              <p className="section-subheading mt-2">
                Follow this structured path from preparation to post-interview follow-up.
              </p>
            </div>

            {/* Tab Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
                marginBottom: "40px",
              }}
            >
              {phases.map((ph, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhase(idx)}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "50px",
                    border: activePhase === idx ? "none" : `2px solid ${ph.color}`,
                    background: activePhase === idx
                      ? ph.color
                      : "white",
                    color: activePhase === idx ? "white" : ph.color,
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.25s ease",
                    boxShadow: activePhase === idx ? `0 4px 16px ${ph.color}55` : "none",
                  }}
                >
                  <i className={`bi ${ph.icon}`} /> {phases[idx].title.split(":")[0]}
                </button>
              ))}
            </div>

            {/* Active Phase Content */}
            {phases.map((phase, pidx) =>
              pidx === activePhase ? (
                <div key={pidx}>
                  <div
                    style={{
                      background: phase.bg,
                      borderRadius: "16px",
                      padding: "28px 32px",
                      marginBottom: "28px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: phase.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i className={`bi ${phase.icon}`} style={{ fontSize: "24px", color: "white" }} />
                    </div>
                    <h3 style={{ fontWeight: 700, color: "#05264e", margin: 0, fontSize: "22px" }}>
                      {phase.title}
                    </h3>
                  </div>

                  <Row>
                    {phase.tips.map((tip, tidx) => (
                      <Col md={6} key={tidx} className="mb-4">
                        <div
                          className="card-hover"
                          style={{ padding: "24px" }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: phase.bg,
                                color: phase.color,
                                fontWeight: 800,
                                fontSize: "13px",
                                flexShrink: 0,
                                marginTop: "2px",
                              }}
                            >
                              {tidx + 1}
                            </span>
                            <div>
                              <h6 style={{ fontWeight: 700, color: "#05264e", marginBottom: "8px" }}>
                                {tip.heading}
                              </h6>
                              <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.75", margin: 0 }}>
                                {tip.body}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              ) : null
            )}
          </Container>
        </section>

        {/* CTA */}
        <section style={{ background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)", padding: "60px 0" }}>
          <Container className="text-center text-white">
            <h3 style={{ fontWeight: 800, fontSize: "30px", marginBottom: "12px" }}>
              Ready to land your dream job?
            </h3>
            <p style={{ opacity: 0.85, fontSize: "16px", marginBottom: "28px" }}>
              Browse thousands of live opportunities and start applying today.
            </p>
            <Link href="/job-listing" className="btn-portal-primary">
              <i className="bi bi-search" /> Browse Jobs
            </Link>
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default InterviewTips;
