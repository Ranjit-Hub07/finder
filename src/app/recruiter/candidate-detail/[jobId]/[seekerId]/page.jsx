"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Nav,
  Button,
  Dropdown,
  Card,
  Modal,
  Form,
  Alert,
  Badge,
} from "react-bootstrap";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CandidateDetails() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobIdRaw = params?.jobId;
  const seekerIdRaw = params?.seekerId;

  const seekerFallback =
    searchParams?.get("user_id") ||
    searchParams?.get("seekerId") ||
    searchParams?.get("uid") ||
    null;

  const jobId = jobIdRaw ? Number(String(jobIdRaw)) : null;

  const seekerId = useMemo(() => {
    const fromRoute = seekerIdRaw ? Number(String(seekerIdRaw)) : null;
    if (Number.isFinite(fromRoute) && fromRoute > 0) return fromRoute;

    const fromQuery = seekerFallback ? Number(String(seekerFallback)) : null;
    if (Number.isFinite(fromQuery) && fromQuery > 0) return fromQuery;

    return null;
  }, [seekerIdRaw, seekerFallback]);

  const validIds =
    Number.isFinite(jobId) &&
    Number.isFinite(seekerId) &&
    jobId > 0 &&
    seekerId > 0;

  const [activeTab, setActiveTab] = useState("profile");
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewMessage, setInterviewMessage] = useState("");
  const [loadingInterview, setLoadingInterview] = useState(false);
  const [interviewAlert, setInterviewAlert] = useState({
    show: false,
    variant: "",
    text: "",
  });

  const statusMap = {
    Pending: "Awaiting Review",
    Reviewed: "Reviewed",
    "Phone Screened": "Phone Screened",
    Interviewed: "Interviewed",
    "Offer Made": "Offer Made",
    Hired: "Hired",
    Rejected: "Rejected",
  };

  const statusColors = {
    "Awaiting Review": { bg: "rgba(245, 158, 11, 0.12)", color: "#b45309", border: "rgba(245, 158, 11, 0.3)" },
    Reviewed: { bg: "rgba(99, 102, 241, 0.12)", color: "#4338ca", border: "rgba(99, 102, 241, 0.3)" },
    "Phone Screened": { bg: "rgba(6, 182, 212, 0.12)", color: "#0891b2", border: "rgba(6, 182, 212, 0.3)" },
    Interviewed: { bg: "rgba(139, 92, 246, 0.12)", color: "#6d28d9", border: "rgba(139, 92, 246, 0.3)" },
    "Offer Made": { bg: "rgba(59, 130, 246, 0.12)", color: "#1d4ed8", border: "rgba(59, 130, 246, 0.3)" },
    Hired: { bg: "rgba(16, 185, 129, 0.12)", color: "#047857", border: "rgba(16, 185, 129, 0.3)" },
    Rejected: { bg: "rgba(239, 68, 68, 0.12)", color: "#b91c1c", border: "rgba(239, 68, 68, 0.3)" },
  };

  useEffect(() => {
    setCandidate(null);
    setLoading(true);

    if (!validIds) {
      setModalMessage("Candidate not found (invalid Job ID or Seeker ID).");
      setShowModal(true);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchCandidate = async () => {
      try {
        const res = await fetch(`/api/recruiter/candidates/${jobId}/${seekerId}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          let msg = "Failed to load candidate details.";
          try {
            const data = await res.json();
            msg = data?.error || data?.message || msg;
          } catch {
            const text = await res.text();
            msg = text || msg;
          }
          throw new Error(msg);
        }

        const data = await res.json();

        setCandidate({
          ...data,
          status: statusMap[data.status] || data.status,
        });
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.error("Fetch error:", err);
        setModalMessage(err?.message || "Failed to load candidate details.");
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();

    return () => controller.abort();
  }, [jobId, seekerId, validIds]);

  const handleStatusChange = async (newStatus) => {
    if (!validIds) return;

    try {
      const res = await fetch(`/api/recruiter/candidates/${jobId}/${seekerId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus === "Awaiting Review" ? "Pending" : newStatus,
        }),
      });

      if (!res.ok) {
        let msg = "Failed to update candidate status.";
        try {
          const data = await res.json();
          msg = data?.error || data?.message || msg;
        } catch {
          const text = await res.text();
          msg = text || msg;
        }
        throw new Error(msg);
      }

      const data = await res.json();

      setCandidate((prev) =>
        prev
          ? {
              ...prev,
              status: statusMap[data.status] || data.status,
            }
          : prev
      );

      setModalMessage(data?.message || "Status updated successfully!");
      setShowModal(true);
    } catch (err) {
      console.error("Status update error:", err);
      setModalMessage(err?.message || "Failed to update candidate status.");
      setShowModal(true);
    }
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!validIds) return;

    setLoadingInterview(true);
    setInterviewAlert({ show: false, variant: "", text: "" });

    try {
      const res = await fetch(
        `/api/recruiter/candidates/${jobId}/${seekerId}/schedule`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interviewDate,
            interviewTime,
            interviewLocation,
            message: interviewMessage,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to schedule interview.");

      setInterviewAlert({
        show: true,
        variant: "success",
        text: data?.message || "Interview scheduled and email notification sent!",
      });

      setInterviewDate("");
      setInterviewTime("");
      setInterviewLocation("");
      setInterviewMessage("");
    } catch (err) {
      setInterviewAlert({
        show: true,
        variant: "danger",
        text: err?.message || "Failed to schedule interview.",
      });
    } finally {
      setLoadingInterview(false);
    }
  };

  const currentStatusStyle = candidate?.status
    ? statusColors[candidate.status] || { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" }
    : { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };

  const candidateInitial = candidate?.name
    ? candidate.name.trim().charAt(0).toUpperCase()
    : "C";

  return (
    <>
      <Navbar />

      <div
        style={{
          paddingTop: "110px",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          paddingBottom: "80px",
        }}
      >
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Link
                  href="/overview"
                  className="badge text-decoration-none rounded-pill px-2 py-1"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                >
                  <i className="bi bi-arrow-left me-1"></i> Back to Pipeline
                </Link>
                <span className="text-white-50" style={{ fontSize: "12px" }}>•</span>
                <span className="text-white-50" style={{ fontSize: "12px" }}>
                  Applicant #{seekerId || "—"}
                </span>
              </div>
              <h1 className="fw-bold mb-1 text-white">
                {candidate?.name ? `${candidate.name}'s Profile` : "Candidate Details"}
              </h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                {candidate?.jobRole
                  ? `Applied for ${candidate.jobRole}`
                  : "Review application, evaluate skills, and manage recruitment stage."}
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/overview" className="text-decoration-none text-muted">
                <i className="bi bi-grid-fill me-1"></i>Overview
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">Candidate Detail</span>
            </div>
          </Container>
        </div>

        {/* ⭐ Main Content Container */}
        <Container className="mt-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="text-muted fw-semibold">Loading candidate profile...</p>
            </div>
          ) : !candidate ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-4">
              <i className="bi bi-exclamation-circle text-warning fs-1 mb-2"></i>
              <h5 className="fw-bold text-dark">Candidate Not Found</h5>
              <p className="text-muted small mb-3">
                The requested candidate profile could not be loaded or was removed.
              </p>
              <Link href="/overview" className="btn btn-primary btn-sm rounded-pill px-4">
                Return to Overview
              </Link>
            </div>
          ) : (
            <>
              {/* ================= HERO PROFILE CARD ================= */}
              <div
                className="bg-white rounded-4 p-4 mb-4 border"
                style={{
                  boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
                  borderColor: "#e2e8f0",
                }}
              >
                <div className="d-flex flex-lg-row flex-column justify-content-between align-items-lg-center gap-4">
                  {/* Left: Avatar & Meta */}
                  <div className="d-flex align-items-center gap-3">
                    {candidate.photo ? (
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className="rounded-circle object-fit-cover shadow-sm"
                        style={{
                          width: "76px",
                          height: "76px",
                          border: "3px solid #e0e7ff",
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                        style={{
                          width: "76px",
                          height: "76px",
                          background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                          color: "#ffffff",
                          fontSize: "28px",
                          flexShrink: 0,
                        }}
                      >
                        {candidateInitial}
                      </div>
                    )}

                    <div>
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <h3 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-0.5px" }}>
                          {candidate.name}
                        </h3>
                        <span
                          className="badge rounded-pill fw-bold"
                          style={{
                            backgroundColor: currentStatusStyle.bg,
                            color: currentStatusStyle.color,
                            border: `1px solid ${currentStatusStyle.border}`,
                            fontSize: "12px",
                            padding: "6px 12px",
                          }}
                        >
                          <i className="bi bi-circle-fill me-1" style={{ fontSize: "7px" }}></i>
                          {candidate.status}
                        </span>
                      </div>

                      <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mt-1">
                        {candidate.jobRole && (
                          <span>
                            <i className="bi bi-briefcase me-1 text-primary"></i>
                            <strong className="text-secondary">{candidate.jobRole}</strong>
                          </span>
                        )}
                        {candidate.location && (
                          <span>
                            <i className="bi bi-geo-alt me-1 text-danger"></i>
                            {candidate.location}
                          </span>
                        )}
                        {candidate.experience ? (
                          <span>
                            <i className="bi bi-clock-history me-1 text-warning"></i>
                            {candidate.experience} Years Exp.
                          </span>
                        ) : null}
                        {candidate.working && (
                          <span className="badge bg-success-subtle text-success">
                            Currently Working
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <Button
                      className="btn fw-semibold rounded-pill px-3 py-2 text-white d-inline-flex align-items-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                        border: "none",
                        fontSize: "13.5px",
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                      }}
                      onClick={() => setShowInterviewModal(true)}
                    >
                      <i className="bi bi-calendar-event"></i> Schedule Interview
                    </Button>

                    {/* Status Dropdown */}
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        className="fw-semibold rounded-pill px-3 py-2 border d-inline-flex align-items-center gap-2"
                        style={{ fontSize: "13.5px", backgroundColor: "#fff" }}
                      >
                        <i className="bi bi-arrow-repeat text-muted"></i>
                        <span>Stage: {candidate.status}</span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="shadow-lg border-0 rounded-3 py-2">
                        <Dropdown.Header className="text-uppercase small fw-bold text-muted">
                          Change Candidate Stage
                        </Dropdown.Header>
                        {[
                          "Awaiting Review",
                          "Reviewed",
                          "Phone Screened",
                          "Interviewed",
                          "Offer Made",
                          "Hired",
                          "Rejected",
                        ].map((status) => {
                          const conf = statusColors[status] || {};
                          return (
                            <Dropdown.Item
                              key={status}
                              onClick={() => handleStatusChange(status)}
                              className="d-flex align-items-center justify-content-between py-2 px-3 small"
                            >
                              <span>{status}</span>
                              {candidate.status === status && (
                                <i className="bi bi-check2 text-primary fw-bold"></i>
                              )}
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>

                    {candidate.resume && (
                      <Button
                        variant="outline-secondary"
                        href={candidate.resume}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="fw-semibold rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1"
                        style={{ fontSize: "13.5px" }}
                      >
                        <i className="bi bi-download"></i> Resume
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= MAIN CONTENT + SIDEBAR ================= */}
              <Row className="g-4">
                {/* Left Column: Interactive Tabs */}
                <Col lg={8}>
                  <div
                    className="bg-white rounded-4 border overflow-hidden"
                    style={{
                      boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
                      borderColor: "#e2e8f0",
                    }}
                  >
                    {/* Custom Segmented Tabs */}
                    <div className="p-3 bg-light border-bottom d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill fw-semibold px-3 py-2 d-inline-flex align-items-center gap-2 ${
                          activeTab === "profile" ? "text-white shadow-sm" : "text-secondary"
                        }`}
                        style={{
                          background:
                            activeTab === "profile"
                              ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                              : "transparent",
                          fontSize: "13px",
                          border: activeTab === "profile" ? "none" : "1px solid transparent",
                        }}
                        onClick={() => setActiveTab("profile")}
                      >
                        <i className="bi bi-person-lines-fill"></i> Professional Profile
                      </button>

                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill fw-semibold px-3 py-2 d-inline-flex align-items-center gap-2 ${
                          activeTab === "skills" ? "text-white shadow-sm" : "text-secondary"
                        }`}
                        style={{
                          background:
                            activeTab === "skills"
                              ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                              : "transparent",
                          fontSize: "13px",
                          border: activeTab === "skills" ? "none" : "1px solid transparent",
                        }}
                        onClick={() => setActiveTab("skills")}
                      >
                        <i className="bi bi-lightning-charge-fill"></i> Skills & Expertise
                        {candidate.skills?.length > 0 && (
                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor:
                                activeTab === "skills" ? "rgba(255, 255, 255, 0.25)" : "#e2e8f0",
                              color: activeTab === "skills" ? "#fff" : "#475569",
                              fontSize: "11px",
                            }}
                          >
                            {candidate.skills.length}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill fw-semibold px-3 py-2 d-inline-flex align-items-center gap-2 ${
                          activeTab === "experience" ? "text-white shadow-sm" : "text-secondary"
                        }`}
                        style={{
                          background:
                            activeTab === "experience"
                              ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                              : "transparent",
                          fontSize: "13px",
                          border: activeTab === "experience" ? "none" : "1px solid transparent",
                        }}
                        onClick={() => setActiveTab("experience")}
                      >
                        <i className="bi bi-briefcase-fill"></i> Experience & Projects
                      </button>

                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill fw-semibold px-3 py-2 d-inline-flex align-items-center gap-2 ${
                          activeTab === "personal" ? "text-white shadow-sm" : "text-secondary"
                        }`}
                        style={{
                          background:
                            activeTab === "personal"
                              ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                              : "transparent",
                          fontSize: "13px",
                          border: activeTab === "personal" ? "none" : "1px solid transparent",
                        }}
                        onClick={() => setActiveTab("personal")}
                      >
                        <i className="bi bi-info-circle-fill"></i> Additional Details
                      </button>
                    </div>

                    {/* Tab Body */}
                    <div className="p-4">
                      {activeTab === "profile" && (
                        <div>
                          {/* About Section */}
                          <div className="mb-4">
                            <h6 className="fw-bold text-uppercase text-muted small mb-2" style={{ letterSpacing: "0.5px" }}>
                              Candidate Summary / Bio
                            </h6>
                            <p className="text-secondary" style={{ lineHeight: "1.7", fontSize: "14.5px" }}>
                              {candidate.about ||
                                `${candidate.name} has applied for the ${candidate.jobRole || "relevant"} position. Review candidate skills, qualifications, and past experience below.`}
                            </p>
                          </div>

                          <hr className="my-4" style={{ borderColor: "#f1f5f9" }} />

                          {/* Education Card */}
                          <div className="mb-4">
                            <h6 className="fw-bold text-uppercase text-muted small mb-3" style={{ letterSpacing: "0.5px" }}>
                              Education & Qualifications
                            </h6>
                            <div className="p-3 rounded-3 bg-light border d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  width: "44px",
                                  height: "44px",
                                  backgroundColor: "rgba(79, 70, 229, 0.1)",
                                  color: "#4f46e5",
                                  fontSize: "20px",
                                  flexShrink: 0,
                                }}
                              >
                                <i className="bi bi-mortarboard-fill"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-0 text-dark">
                                  {candidate.educationLevel || "Degree / Qualification Not Specified"}
                                </h6>
                                <small className="text-muted">Highest formal qualification recorded</small>
                              </div>
                            </div>
                          </div>

                          {/* Key Highlights Grid */}
                          <div>
                            <h6 className="fw-bold text-uppercase text-muted small mb-3" style={{ letterSpacing: "0.5px" }}>
                              Role & Employment Status
                            </h6>
                            <Row className="g-3">
                              <Col sm={6}>
                                <div className="p-3 rounded-3 border bg-white">
                                  <span className="text-muted small d-block">Target Job Role</span>
                                  <strong className="text-dark" style={{ fontSize: "15px" }}>
                                    {candidate.jobRole || "Not Specified"}
                                  </strong>
                                </div>
                              </Col>
                              <Col sm={6}>
                                <div className="p-3 rounded-3 border bg-white">
                                  <span className="text-muted small d-block">Job Type Preference</span>
                                  <strong className="text-dark" style={{ fontSize: "15px" }}>
                                    {candidate.jobType || "Full Time"}
                                  </strong>
                                </div>
                              </Col>
                              <Col sm={6}>
                                <div className="p-3 rounded-3 border bg-white">
                                  <span className="text-muted small d-block">Current Working Status</span>
                                  <strong className="text-dark" style={{ fontSize: "15px" }}>
                                    {candidate.working ? "Currently Employed" : "Immediate Availability / Not Working"}
                                  </strong>
                                </div>
                              </Col>
                              <Col sm={6}>
                                <div className="p-3 rounded-3 border bg-white">
                                  <span className="text-muted small d-block">Current Designation</span>
                                  <strong className="text-dark" style={{ fontSize: "15px" }}>
                                    {candidate.designation || "Not Disclosed"}
                                  </strong>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      )}

                      {activeTab === "skills" && (
                        <div>
                          <h6 className="fw-bold text-uppercase text-muted small mb-3" style={{ letterSpacing: "0.5px" }}>
                            Technical & Professional Skills
                          </h6>
                          {candidate.skills?.length ? (
                            <div className="d-flex flex-wrap gap-2">
                              {[...new Map(candidate.skills.map((s) => [s.name, s])).values()].map(
                                (s, i) => (
                                  <span
                                    key={i}
                                    className="badge px-3 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-1"
                                    style={{
                                      backgroundColor: "rgba(99, 102, 241, 0.08)",
                                      color: "#4f46e5",
                                      border: "1px solid rgba(99, 102, 241, 0.2)",
                                      fontSize: "13px",
                                    }}
                                  >
                                    <i className="bi bi-check2-circle text-primary"></i> {s.name}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4 bg-light rounded-3">
                              <i className="bi bi-lightning text-muted fs-3 mb-1"></i>
                              <p className="text-muted small mb-0">No specific skills listed on profile.</p>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "experience" && (
                        <div>
                          <div className="mb-4">
                            <h6 className="fw-bold text-uppercase text-muted small mb-3" style={{ letterSpacing: "0.5px" }}>
                              Work History & Roles
                            </h6>
                            <div className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between mb-3">
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">
                                  {candidate.designation || "Professional Experience"}
                                </h6>
                                <p className="text-muted small mb-0">
                                  {candidate.designationExperience
                                    ? `${candidate.designationExperience} in this role`
                                    : "Career experience"}
                                </p>
                              </div>
                              <span
                                className="badge rounded-pill fw-bold"
                                style={{
                                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                                  color: "#047857",
                                  fontSize: "12px",
                                  padding: "6px 12px",
                                }}
                              >
                                {candidate.experience ? `${candidate.experience} Years Total` : "Fresher"}
                              </span>
                            </div>
                          </div>

                          {candidate.projects?.length > 0 && (
                            <div>
                              <h6 className="fw-bold text-uppercase text-muted small mb-3" style={{ letterSpacing: "0.5px" }}>
                                Featured Projects
                              </h6>
                              <div className="d-flex flex-column gap-2">
                                {candidate.projects.map((proj, idx) => (
                                  <div key={idx} className="p-3 rounded-3 border bg-white d-flex align-items-center gap-2">
                                    <i className="bi bi-folder-check text-primary fs-5"></i>
                                    <span className="fw-semibold text-dark">{proj}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "personal" && (
                        <div>
                          <h6 className="fw-bold text-uppercase text-muted small mb-3" style={{ letterSpacing: "0.5px" }}>
                            Demographics & Language Proficiency
                          </h6>
                          <Row className="g-3">
                            <Col sm={6}>
                              <div className="p-3 rounded-3 border bg-light">
                                <span className="text-muted small d-block">Spoken Languages</span>
                                <strong className="text-dark">
                                  {candidate.language?.length
                                    ? candidate.language.join(", ")
                                    : "Not Disclosed"}
                                </strong>
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="p-3 rounded-3 border bg-light">
                                <span className="text-muted small d-block">Gender</span>
                                <strong className="text-dark">{candidate.gender || "Not Disclosed"}</strong>
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="p-3 rounded-3 border bg-light">
                                <span className="text-muted small d-block">Date of Birth</span>
                                <strong className="text-dark">{candidate.dob || "Not Disclosed"}</strong>
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="p-3 rounded-3 border bg-light">
                                <span className="text-muted small d-block">Nationality</span>
                                <strong className="text-dark">{candidate.nationality || "Indian"}</strong>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>

                {/* Right Column: Key Details & Actions Sidebar */}
                <Col lg={4}>
                  {/* Overview Card */}
                  <div
                    className="bg-white rounded-4 p-4 border mb-4"
                    style={{
                      boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <h6 className="fw-bold text-uppercase text-muted small mb-3" style={{ letterSpacing: "0.5px" }}>
                      <i className="bi bi-sliders me-1 text-primary"></i> Candidate Overview
                    </h6>

                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Total Experience</span>
                      <strong className="text-dark">
                        {candidate.experience ? `${candidate.experience} Years` : "Fresher"}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Expected Salary</span>
                      <strong className="text-dark">{candidate.salary || "Negotiable"}</strong>
                    </div>

                    {candidate.currentSalary && (
                      <div className="d-flex justify-content-between py-2 border-bottom small">
                        <span className="text-muted">Current Salary</span>
                        <strong className="text-dark">{candidate.currentSalary}</strong>
                      </div>
                    )}

                    <div className="d-flex justify-content-between py-2 border-bottom small">
                      <span className="text-muted">Qualification</span>
                      <strong className="text-dark">{candidate.educationLevel || "Graduate"}</strong>
                    </div>

                    <div className="d-flex justify-content-between py-2 small">
                      <span className="text-muted">Working Status</span>
                      <strong className={candidate.working ? "text-success" : "text-secondary"}>
                        {candidate.working ? "Employed" : "Available"}
                      </strong>
                    </div>
                  </div>

                  {/* Direct Contact Details */}
                  <div
                    className="bg-white rounded-4 p-4 border mb-4"
                    style={{
                      boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <h6 className="fw-bold text-uppercase text-muted small mb-3" style={{ letterSpacing: "0.5px" }}>
                      <i className="bi bi-person-lines-fill me-1 text-primary"></i> Contact Information
                    </h6>

                    <div className="d-flex align-items-center gap-3 py-2 border-bottom">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "36px",
                          height: "36px",
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          color: "#10b981",
                        }}
                      >
                        <i className="bi bi-telephone-fill"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Phone Number</small>
                        <a
                          href={candidate.contact ? `tel:${candidate.contact}` : "#"}
                          className="fw-bold text-dark text-decoration-none"
                          style={{ fontSize: "14px" }}
                        >
                          {candidate.contact || "Not provided"}
                        </a>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 py-2 border-bottom">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "36px",
                          height: "36px",
                          backgroundColor: "rgba(79, 70, 229, 0.1)",
                          color: "#4f46e5",
                        }}
                      >
                        <i className="bi bi-envelope-fill"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Email Address</small>
                        <a
                          href={candidate.email ? `mailto:${candidate.email}` : "#"}
                          className="fw-bold text-dark text-decoration-none"
                          style={{ fontSize: "14px" }}
                        >
                          {candidate.email || "Not provided"}
                        </a>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 py-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "36px",
                          height: "36px",
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          color: "#ef4444",
                        }}
                      >
                        <i className="bi bi-geo-alt-fill"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Location</small>
                        <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                          {candidate.location || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resume Document Download Card */}
                  {candidate.resume && (
                    <div
                      className="p-4 rounded-4 border text-white text-center"
                      style={{
                        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%)",
                        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
                      }}
                    >
                      <i className="bi bi-file-earmark-pdf fs-1 text-info mb-2 d-inline-block"></i>
                      <h6 className="fw-bold mb-1">Attached Resume</h6>
                      <p className="text-white-50 small mb-3">
                        Review candidate&apos;s complete CV document
                      </p>
                      <Button
                        href={candidate.resume}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="btn btn-sm w-100 rounded-pill fw-semibold py-2"
                        style={{
                          background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                          border: "none",
                        }}
                      >
                        <i className="bi bi-download me-1"></i> Download File
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>

      {/* ================= MODALS ================= */}
      {/* Status Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Body className="text-center p-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "#059669",
              fontSize: "24px",
            }}
          >
            <i className="bi bi-check-lg"></i>
          </div>
          <h5 className="text-dark fw-bold mb-2">Notification</h5>
          <p className="text-muted small mb-3">{modalMessage}</p>
          <Button
            variant="primary"
            className="rounded-pill px-4 fw-semibold"
            style={{ background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)", border: "none" }}
            onClick={() => setShowModal(false)}
          >
            Acknowledge
          </Button>
        </Modal.Body>
      </Modal>

      {/* Interview Modal */}
      <Modal
        show={showInterviewModal}
        onHide={() => setShowInterviewModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-bottom px-4 py-3">
          <div>
            <Modal.Title className="fw-bold fs-5 text-dark">Schedule Candidate Interview</Modal.Title>
            <small className="text-muted">
              Applicant: {candidate?.name || "Candidate"} · {candidate?.email}
            </small>
          </div>
        </Modal.Header>
        <Modal.Body className="p-4">
          {interviewAlert.show && (
            <Alert
              variant={interviewAlert.variant}
              dismissible
              onClose={() => setInterviewAlert({ ...interviewAlert, show: false })}
            >
              {interviewAlert.text}
            </Alert>
          )}

          <Form onSubmit={handleInterviewSubmit}>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-dark">Interview Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required
                    style={{ fontSize: "14px" }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-dark">Interview Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    required
                    style={{ fontSize: "14px" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-dark">
                Location or Meeting Link (Google Meet / Zoom / Office Address)
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. https://meet.google.com/xyz or 3rd Floor Conference Room"
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
                style={{ fontSize: "14px" }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold small text-dark">
                Message / Instructions for Candidate (optional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Include agenda, documents to bring, or interview format..."
                value={interviewMessage}
                onChange={(e) => setInterviewMessage(e.target.value)}
                style={{ fontSize: "14px" }}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="light"
                className="rounded-pill px-3 fw-semibold border"
                onClick={() => setShowInterviewModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-pill px-4 fw-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  border: "none",
                }}
                type="submit"
                disabled={loadingInterview}
              >
                {loadingInterview ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-1"></i> Send Interview Invitation
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
}
