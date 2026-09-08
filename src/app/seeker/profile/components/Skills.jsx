"use client";

import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Spinner, Modal } from "react-bootstrap";

const SeekerSkills = ({ onUpdated = () => {} }) => {
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Modal state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVariant, setPopupVariant] = useState("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ---------- 1) Load master skills ----------
        const skillsRes = await fetch("/api/skills");
        const skillsJson = await skillsRes.json();

        // support both: [ {id,name} ]  OR  { skills: [ {id,name} ] }
        const skillList = Array.isArray(skillsJson)
          ? skillsJson
          : skillsJson.skills || [];

        const sortedSkills = (skillList || [])
          .filter((skill) => skill?.name)
          .sort((a, b) => a.name.localeCompare(b.name));

        setAllSkills(sortedSkills);
        setFilteredSkills(sortedSkills);

        // ---------- 2) Load seeker’s selected skills ----------
        const userRes = await fetch("/api/seeker/profile/skill");
        const userJson = await userRes.json();

        const seekerSkillsArray = Array.isArray(userJson.skills)
          ? userJson.skills
          : [];

        // take only IDs
        setSelectedSkillIds(seekerSkillsArray.map((s) => s.id));
      } catch (err) {
        console.error("Error loading skills:", err);
        setPopupMessage("Failed to load skills.");
        setPopupVariant("error");
        setShowPopup(true);
        onUpdated?.();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSkillToggle = (id) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = allSkills.filter((skill) =>
      skill?.name?.toLowerCase().includes(term)
    );

    setFilteredSkills(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/seeker/profile/skill", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: selectedSkillIds }), // [1,2,3]
      });

      const result = await res.json();
      if (res.ok) {
        setPopupMessage("Skills updated successfully.");
        setPopupVariant("success");
      } else {
        setPopupMessage(result.error || "Failed to update skills.");
        setPopupVariant("error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setPopupMessage("Something went wrong.");
      setPopupVariant("error");
    } finally {
      setShowPopup(true);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading skills...</p>
      </div>
    );
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h4 className="mb-4 fw-bold py-4">Skills</h4>

        {/* Search box */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "25px",
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
            <Form.Control
              type="text"
              placeholder="Search skills (e.g. React, Python, Sales, Accounting)..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                borderRadius: "12px",
                padding: "12px 45px 12px 16px",
                fontSize: "14.5px",
                borderColor: "#cbd5e1",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "16px",
                pointerEvents: "none",
              }}
            >
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>

        {/* Skills list */}
        <Row xs={1} sm={2} md={3} lg={4} className="gy-3 gx-4">
          {filteredSkills.map((skill) => (
            <Col key={skill.id}>
              <Form.Check
                type="checkbox"
                id={`skill-${skill.id}`}
                label={skill.name}
                checked={selectedSkillIds.includes(skill.id)}
                onChange={() => handleSkillToggle(skill.id)}
                className="user-select-none"
              />
            </Col>
          ))}
        </Row>

        {/* Submit */}
        <div className="text-center mt-5">
          <Button
            type="submit"
            className="px-5 py-2 fw-semibold rounded-pill text-white shadow-sm"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
              border: "none",
            }}
          >
            Save Skills & Expertise
          </Button>
        </div>
      </Form>

      {/* ✅ Popup with cross button */}
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
          className="text-center position-relative"
          style={{
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            minWidth: "300px",
          }}
        >
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

          <p
            style={{
              color: popupVariant === "success" ? "green" : "red",
              fontSize: "16px",
              margin: 0,
            }}
          >
            {popupMessage}
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SeekerSkills;


