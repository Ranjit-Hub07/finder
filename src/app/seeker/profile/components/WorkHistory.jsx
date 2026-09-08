"use client";
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";

const SeekerWorkHistory = ({ onUpdated = () => {} }) => {
  const [hasExperience, setHasExperience] = useState(null);
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟩 Modal states
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVariant, setPopupVariant] = useState("success");

  // 🔄 Fetch experience data on load
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await axios.get("/api/seeker/profile/workhistory");
        const { experience, current_working, designation_experience } = res.data;

        if (experience === "Yes") {
          setHasExperience(true);
          setCompany(current_working || "");
          setDesignation(designation_experience || "");
        } else if (experience === "No") {
          setHasExperience(false);
        } else {
          setHasExperience(null);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    fetchExperience();
  }, []);

  // 📝 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.put("/api/seeker/profile/workhistory", {
        hasExperience,
        company,
        designation,
      });
      setPopupMessage("Work experience updated successfully!");
      setPopupVariant("success");
      onUpdated?.();
    } catch (err) {
      console.error("Update failed:", err);
      setPopupMessage("Failed to update experience.");
      setPopupVariant("error");
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="container px-md-5 px-3 mt-4">
        <h2 className="fw-bold text-dark mb-4" style={{ fontSize: "28px" }}>
          Work History
        </h2>

        <Form.Group className="mb-4">
          <Form.Label className="text-muted medium">
            Do you have any working experience?{" "}
            <span className="text-danger">*</span>
          </Form.Label>
          <div>
            <Form.Check
              inline
              label="Yes"
              type="radio"
              name="experience"
              id="experienceYes"
              onChange={() => setHasExperience(true)}
              checked={hasExperience === true}
            />
            <Form.Check
              inline
              label="No"
              type="radio"
              name="experience"
              id="experienceNo"
              onChange={() => {
                setHasExperience(false);
                setCompany("");
                setDesignation("");
              }}
              checked={hasExperience === false}
            />
          </div>
        </Form.Group>

        {hasExperience && (
          <>
            <Row className="mb-4">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group controlId="designation">
                  <Form.Label className="text-muted medium">
                    Please enter your current designation{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="py-2 rounded"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="company">
                  <Form.Label className="text-muted medium">
                    Please enter your current company name{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="py-2 rounded"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-4">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="px-5 py-2 fw-semibold rounded"
                style={{ backgroundColor: "#3F5AE0", borderColor: "#3F5AE0" }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </>
        )}
      </Form>

      {/* ✅ Modal Popup */}
      <Modal
        show={showPopup}
        onHide={() => setShowPopup(false)}
        backdrop="static"
        keyboard={false}
        contentClassName="border-0"
        dialogClassName="mt-5 d-flex justify-content-center"
        style={{ marginTop: "60px" }}
      >
        <Modal.Body
          className="text-center"
          style={{
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            minWidth: "300px",
          }}
        >
          <p
            style={{
              color: popupVariant === "success" ? "green" : "red",
              fontSize: "16px",
              margin: 0,
            }}
          >
            {popupMessage}
          </p>
          <button
            onClick={() => setShowPopup(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              border: "none",
              background: "transparent",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SeekerWorkHistory;
