"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Modal, Button, Form, Row, Col, Alert, Spinner, Container } from "react-bootstrap";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Career = () => {
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentSalary: "",
    expectedSalary: "",
    coverLetter: "",
    cv: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleSection = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleShowModal = (position) => {
    setSelectedPosition(position);
    setShowModal(true);
    setMessage("");
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("position", selectedPosition);
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const res = await fetch("/api/career/apply", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setMessage("✅ Application submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        currentSalary: "",
        expectedSalary: "",
        coverLetter: "",
        cv: null,
      });
    } catch (err) {
      setMessage("❌ Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const jobOpenings = [
    {
      title: "Digital Marketing Specialist (Experience - 1+ year)",
      vacancies: 6,
      profile: [
        "Proven working experience in digital marketing",
        "Experience in SEO/SEM, email & social media campaigns",
        "Strong analytical and data-driven thinking",
      ],
      responsibilities: [
        "Manage and optimize digital campaigns",
        "Track ROI and KPIs",
        "Collaborate with internal teams",
      ],
    },
  ];

  return (
    <>
      <Navbar />

      {/* PAGE OFFSET FOR FIXED NAVBAR */}
      <main style={{ paddingTop: "110px" }}>
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Career Opportunities</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Join our team and build the future of recruitment and career growth.
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">Careers</span>
            </div>
          </Container>
        </div>

        <div className="container mt-5">

          {/* CONTENT */}
          <div className="mb-5">
            <p>
              Managing Director of Finder welcomes you to{" "}
              <strong>MAXIMISE</strong> your passion, efforts, skills, knowledge and
              efficiency unlimited!
            </p>

            <p className="fw-bold">Life is a beautiful ride at Finder!</p>

            <p className="fw-bold">
              Career that takes you{" "}
              <span style={{ color: "green" }}>Miles</span> and makes you{" "}
              <span style={{ color: "red" }}>Smile</span>!
            </p>

            <p>
              Grab the opportunity and work with the thought leaders to
              revolutionize the e-commerce industry in India.
            </p>

            <p>
              Be a part of our team that is{" "}
              <span style={{ color: "green" }}>Innovative</span>,{" "}
              <span style={{ color: "red" }}>Passionate</span>,{" "}
              <span style={{ color: "blue" }}>Collaborative</span> and{" "}
              <span style={{ color: "orange" }}>Ambitious</span>.
            </p>

            <p className="fw-bold">
              Apply now! Please drop your Resume at{" "}
              <a href="mailto:job@Finder.com">job@Finder.com</a>
            </p>
          </div>

          {/* JOB OPENINGS */}
          {jobOpenings.map((job, index) => (
            <div key={index} className="mb-3 border rounded">
              <div
                className="d-flex justify-content-between align-items-center p-3 text-white"
                style={{ backgroundColor: "#524eb7", cursor: "pointer" }}
                onClick={() => toggleSection(index)}
              >
                <h6 className="mb-0">{job.title}</h6>
                <span>{expanded === index ? "-" : "+"}</span>
              </div>

              {expanded === index && (
                <div className="p-3">
                  <p><strong>Vacancies:</strong> {job.vacancies}</p>

                  <p className="fw-bold">Desired Profile:</p>
                  <ul>
                    {job.profile.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  <p className="fw-bold">Job Responsibilities:</p>
                  <ul>
                    {job.responsibilities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <Button onClick={() => handleShowModal(job.title)}>
                      Apply For This Position
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* APPLY MODAL */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Apply – {selectedPosition}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {message && <Alert>{message}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Row>
              <Col>
                <Form.Control name="name" placeholder="Name" required onChange={handleChange} />
              </Col>
              <Col>
                <Form.Control name="email" type="email" placeholder="Email" required onChange={handleChange} />
              </Col>
            </Row>

            <Form.Control className="mt-3" name="phone" placeholder="Phone" maxLength={10} required onChange={handleChange} />
            <Form.Control className="mt-3" type="file" name="cv" required onChange={handleChange} />

            <Row className="mt-3">
              <Col>
                <Form.Control name="currentSalary" placeholder="Current Salary" required onChange={handleChange} />
              </Col>
              <Col>
                <Form.Control name="expectedSalary" placeholder="Expected Salary" required onChange={handleChange} />
              </Col>
            </Row>

            <Form.Control
              className="mt-3"
              as="textarea"
              rows={4}
              name="coverLetter"
              placeholder="Cover Letter"
              required
              onChange={handleChange}
            />

            <div className="text-center mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Apply"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default Career;

