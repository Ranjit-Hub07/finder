"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import axios from "axios";

// ✅ ADD THIS ONCE
axios.defaults.withCredentials = true;

const LanguageCheckboxes = ({ onUpdated = () => {} }) => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVariant, setPopupVariant] = useState("success");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const [allLangRes, selectedLangRes] = await Promise.all([
          axios.get("/api/language"),
          axios.get("/api/seeker/profile/language", {
            withCredentials: true, // ✅ FIX
          }),
        ]);

        const allLanguages = allLangRes.data || [];
        setLanguages(allLanguages);
        setFilteredLanguages(allLanguages);

        setSelectedLanguages(selectedLangRes.data || []);
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleChange = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = languages.filter((lang) =>
      lang.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLanguages(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await axios.post(
        "/api/seeker/profile/language",
        { languages: selectedLanguages },
        { withCredentials: true } // ✅ FIX
      );

      if (res.status === 200) {
        setPopupMessage("Languages updated successfully.");
        setPopupVariant("success");
        setShowPopup(true);
        onUpdated?.();
      } else {
        setPopupMessage("Failed to update languages.");
        setPopupVariant("danger");
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setPopupMessage("An error occurred while updating languages.");
      setPopupVariant("danger");
      setShowPopup(true);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <h4 className="mb-3">Languages Known</h4>

      <Form onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ position: "relative", width: "600px" }}>
            <Form.Control
              type="text"
              placeholder="Type to search.."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                border: "none",
                borderBottom: "2px solid grey",
                borderRadius: "0px",
                color: "black",
                padding: "12px 40px 20px 10px",
                fontSize: "16px",
                width: "100%",
                boxShadow: "none",
              }}
            />
            <span style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", color: "grey", fontSize: "18px" }}>
              🔍
            </span>
          </div>
        </div>

        <Row>
          {filteredLanguages.map((language, idx) => (
            <Col key={idx} xs={12} sm={6} md={4}>
              <Form.Check
                type="checkbox"
                id={`lang-${idx}`}
                label={language}
                checked={selectedLanguages.includes(language)} // ✅ AUTO LOADS FROM DB
                onChange={() => handleChange(language)}
                className="mb-2"
              />
            </Col>
          ))}
        </Row>

        <div className="mt-3 text-center">
          <Button variant="primary" type="submit" disabled={updating}>
            {updating ? "Updating..." : "Update"}
          </Button>
        </div>
      </Form>

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
    {/* ✅ CLOSE CROSS BUTTON */}
    <button
      onClick={() => setShowPopup(false)}
      style={{
        position: "absolute",
        top: "10px",
        right: "12px",
        border: "none",
        background: "transparent",
        fontSize: "1.4rem",
        cursor: "pointer",
        color: "#555",
        fontWeight: "bold",
      }}
      aria-label="Close"
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
    </Container>
  );
};

export default LanguageCheckboxes;
