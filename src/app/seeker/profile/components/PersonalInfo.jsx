"use client";
import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Modal } from "react-bootstrap";
import axios from "axios";

const formatDateToLocalInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SeekerPersonalInfo = ({ onUpdated = () => {} }) => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [disability, setDisability] = useState("");
  const [category, setCategory] = useState([]);

  // Modal state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVariant, setPopupVariant] = useState("success");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/seeker/profile/personalinfo");
        const data = res.data;
        setGender(data.gender || "");
        setDob(formatDateToLocalInput(data.dob));
        setDisability(data.disability_details || "");
        setCategory(data.caste ? data.caste.split(",") : []);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setPopupMessage("Failed to load profile data.");
        setPopupVariant("error");
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCategoryChange = (value) => {
    if (category.includes(value)) {
      setCategory(category.filter((cat) => cat !== value));
    } else {
      setCategory([...category, value]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setPopupMessage("");

    try {
      await axios.put("/api/seeker/profile/personalinfo", {
        gender,
        dob,
        disability,
        community: category.join(","),
      });
      setPopupMessage("Profile updated successfully!");
      setPopupVariant("success");
      setShowPopup(true);
      onUpdated?.();
    } catch (error) {
      console.error("Update failed:", error);
      setPopupMessage("Failed to update profile.");
      setPopupVariant("error");
      setShowPopup(true);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );

  return (
    <>
      <Form onSubmit={handleSubmit} className="container px-4">
        <h4 className="mb-4 fw-bold py-2 text-start">Personal Information</h4>

        {/* Gender */}
        <div className="mb-3 d-flex align-items-center gap-4 flex-wrap">
          <div>
            <label className="form-label d-block">Gender</label>
            {["Male", "Female"].map((g) => (
              <Form.Check
                key={g}
                inline
                type="radio"
                name="gender"
                label={g}
                checked={gender === g}
                onChange={() => setGender(g)}
              />
            ))}
          </div>
        </div>

        {/* DOB & Disability */}
        <div className="mb-3 d-flex align-items-center gap-5 flex-wrap">
          <div>
            <label className="form-label d-block">Date Of Birth</label>
            <Form.Control
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{ minWidth: "250px" }}
            />
          </div>

          <div>
            <label className="form-label d-block">Disability</label>
            {["Yes", "No"].map((val) => (
              <Form.Check
                key={val}
                inline
                type="radio"
                name="disability"
                label={val}
                checked={disability === val}
                onChange={() => setDisability(val)}
              />
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="form-label d-block">Category</label>
          {["General", "OBC", "SC", "ST"].map((cat) => (
            <Form.Check
              key={cat}
              inline
              type="checkbox"
              label={cat}
              checked={category.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />
          ))}
        </div>

        <div className="mt-3 text-center">
          <Button variant="primary" type="submit" disabled={updating}>
            {updating ? "Updating..." : "Update"}
          </Button>
        </div>
      </Form>

      {/* Modal Popup */}
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

export default SeekerPersonalInfo;
