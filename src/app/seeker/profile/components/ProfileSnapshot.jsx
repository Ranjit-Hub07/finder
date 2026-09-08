"use client";

import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Button, Form, Container } from "react-bootstrap";
import Select from "react-select";

// === Options ===
const noticePeriodOptions = [
  { value: "immediate", label: "Immediate" },
  { value: "15_days", label: "15 Days" },
  { value: "1_month", label: "1 Month" },
  { value: "2_months", label: "2 Months" },
  { value: "3_months", label: "3 Months" },
];

const jobTypeOptions = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

function normalizeJobType(value) {
  if (!value) return "";
  return value.toLowerCase().replace(/\s+/g, "_");
}

// 🔹 ACCEPT onUpdated PROP (with safe default)
export default function ProfileSnapshot({ onUpdated = () => {} }) {
  const [formData, setFormData] = useState({
    current_salary: "",
    expected_salary: "",
    experience: "",
    nationality: "",
    location: "",
    job_role: "",
    notice_period: "",
    job_type: "",
    qualification: "",
  });

  const [hasExperience, setHasExperience] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVariant, setPopupVariant] = useState("success");

  // -----------------------
  // LOAD ALL DATA
  // -----------------------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // Qualifications
        const qualRes = await fetch("/api/recruiter/job/education");
        const qualData = await qualRes.json();
        const qualArray = Array.isArray(qualData)
          ? qualData
          : qualData?.education || [];
        setQualifications(
          qualArray.map((q) => ({
            value: String(q.educ_id),
            label: q.educ_name,
          }))
        );

        // Job Roles
        const roleRes = await fetch("/api/recruiter/job/job-role");
        const roleData = await roleRes.json();
        const roleArray = Array.isArray(roleData)
          ? roleData
          : roleData?.roles || [];
        setRoles(
          roleArray.map((r) => ({
            value: String(r.role_id),
            label: r.role_name,
          }))
        );

        // Countries
        const countryRes = await fetch("/api/recruiter/location/countries");
        const countryData = await countryRes.json();
        const countryArray = Array.isArray(countryData)
          ? countryData
          : countryData?.countries || [];

        // ✅ create mappedCountries and store in state
        const mappedCountries = countryArray.map((c) => ({
          value: c.iso2,
          label: c.name,
        }));
        setCountries(mappedCountries);

        // Profile Data
        const profRes = await fetch("/api/seeker/profile/Profilesnap", {
          credentials: "include",
        });
        if (!profRes.ok) throw new Error("Failed to load profile");

        const profile = await profRes.json();

        const hasExp =
          profile.experience &&
          !["no", "No", "NO", "0"].includes(profile.experience);
        setHasExperience(hasExp);

        setFormData({
          current_salary: profile.current_salary || "",
          expected_salary: profile.expected_salary || "",
          experience: hasExp ? profile.experience : "",
          nationality: profile.nationality || "",
          location: profile.location || "",
          job_role: profile.role_id ? String(profile.role_id) : "",
          notice_period: profile.notice_period || "",
          job_type: normalizeJobType(profile.job_type),
          qualification: profile.qualification_id
            ? String(profile.qualification_id)
            : "",
        });

        // ✅ pre-load cities based on saved nationality
        if (profile.nationality) {
          const matchedCountry =
            mappedCountries.find(
              (c) =>
                c.value === profile.nationality ||
                c.label === profile.nationality
            ) || null;

          if (matchedCountry) {
            await loadCities(matchedCountry.value);
          }
        }
      } catch (err) {
        console.error(err);
        setPopupMessage(err.message);
        setPopupVariant("error");
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // -----------------------
  // LOAD CITIES
  // -----------------------
  const loadCities = async (countryCode) => {
    if (!countryCode) return setCities([]);
    try {
      const res = await fetch(
        `/api/recruiter/location/cities?countryCode=${countryCode}`
      );
      const data = await res.json();
      const citiesArray = Array.isArray(data) ? data : data?.cities || [];
      setCities(citiesArray.map((c) => ({ value: c.name, label: c.name })));
    } catch {
      console.error("Failed to load cities");
      setCities([]);
    }
  };

  // -----------------------
  // HANDLERS
  // -----------------------
  const handleSelectChange = (option, field) => {
    setFormData((prev) => ({ ...prev, [field]: option ? option.value : "" }));

    if (field === "nationality") {
      setFormData((prev) => ({ ...prev, location: "" }));
      loadCities(option ? option.value : "");
    }
  };

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleExperienceChange = (e) => {
    const isExp = e.target.value === "yes";
    setHasExperience(isExp);
    if (!isExp) {
      setFormData((prev) => ({ ...prev, current_salary: "", experience: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    Object.entries(formData).forEach(([k, v]) => form.append(k, v));
    form.append("hasExperience", hasExperience ? "yes" : "no");
    if (profileImage) form.append("photo", profileImage);
    if (resumeFile) form.append("resume", resumeFile);

    try {
      const res = await fetch("/api/seeker/profile/Profilesnap", {
        method: "PUT",
        body: form,
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");

      if (result.photo) {
        localStorage.setItem("seeker_photo", result.photo);
        window.dispatchEvent(new CustomEvent("userUpdated"));
        window.dispatchEvent(new CustomEvent("profile-updated"));
      }

      setPopupMessage("Profile updated successfully!");
      setPopupVariant("success");
      setShowPopup(true);

      // ✅ TRIGGER PROFILE COMPLETION REFRESH IN PARENT
      onUpdated();
    } catch (err) {
      setPopupMessage(err.message);
      setPopupVariant("error");
      setShowPopup(true);
    }
  };

  if (loading) return <p className="p-4">⏳ Loading profile...</p>;

  // -----------------------
  // UNIFORM SELECT STYLE
  // -----------------------
  const selectStyles = {
    container: (base) => ({ ...base, width: "100%" }),
    control: (base) => ({
      ...base,
      minHeight: 50,
      height: 50,
      borderRadius: 10,
      borderColor: "#ced4da",
      boxShadow: "none",
      "&:hover": { borderColor: "#495057" },
    }),
    valueContainer: (base) => ({
      ...base,
      height: 50,
      padding: "0 12px",
      display: "flex",
      alignItems: "center",
    }),
  };

  const selectedJobType =
    jobTypeOptions.find((j) => j.value === formData.job_type) || null;

  // -----------------------
  // STYLES FOR RED STAR + HEIGHT
  // -----------------------
  const globalStyles = (
    <style>{`
      .required-label::after {
        content: " *";
        color: red;
        font-weight: bold;
      }
      input.form-control, select.form-select {
        height: 50px !important;
        min-height: 50px !important;
        border-radius: 10px !important;
      }
    `}</style>
  );

  return (
    <>
      {globalStyles}

      <Container className="my-4" style={{ maxWidth: 900 }}>
        <h3 className="mb-4" style={{ fontWeight: "700" }}>
          Profile Snapshot
        </h3>

        <Form onSubmit={handleSubmit}>
          {/* Experience */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold required-label">
              Do you have experience?
            </Form.Label>
            <div className="d-flex gap-4">
              <Form.Check
                type="radio"
                label="Yes"
                value="yes"
                checked={hasExperience}
                onChange={handleExperienceChange}
                required
              />
              <Form.Check
                type="radio"
                label="No"
                value="no"
                checked={!hasExperience}
                onChange={handleExperienceChange}
                required
              />
            </div>
          </Form.Group>

          {/* Experience Fields */}
          {hasExperience && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold required-label">
                  Current Salary
                </Form.Label>
                <Form.Control
                  type="number"
                  id="current_salary"
                  value={formData.current_salary}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={6}>
                <Form.Label className="fw-bold required-label">
                  Years of Experience
                </Form.Label>
                <Form.Select
                  id="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Experience --</option>
                  {[...Array(31).keys()].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          )}

          {/* Salary + Nationality */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold required-label">
                Salary Expectation
              </Form.Label>
              <Form.Control
                type="number"
                id="expected_salary"
                value={formData.expected_salary}
                onChange={handleInputChange}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-bold required-label">
                Nationality
              </Form.Label>
              <Select
                options={countries}
                value={
                  countries.find((c) => c.value === formData.nationality) ||
                  null
                }
                onChange={(opt) => handleSelectChange(opt, "nationality")}
                styles={selectStyles}
                placeholder="Select Country"
                isClearable
                required
              />
            </Col>
          </Row>

          {/* Location + Job Role */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold required-label">
                Current Location
              </Form.Label>
              <Select
                options={cities}
                value={
                  cities.find((c) => c.value === formData.location) || null
                }
                onChange={(opt) => handleSelectChange(opt, "location")}
                styles={selectStyles}
                placeholder="Select City"
                isClearable
                isDisabled={!formData.nationality}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-bold required-label">
                Job Role
              </Form.Label>
              <Select
                options={roles}
                value={roles.find((r) => r.value === formData.job_role) || null}
                onChange={(opt) => handleSelectChange(opt, "job_role")}
                styles={selectStyles}
                placeholder="Select Job Role"
                isClearable
                required
              />
            </Col>
          </Row>

          {/* Qualification + Notice Period */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold required-label">
                Qualification
              </Form.Label>
              <Select
                options={qualifications}
                value={
                  qualifications.find(
                    (q) => q.value === formData.qualification
                  ) || null
                }
                onChange={(opt) => handleSelectChange(opt, "qualification")}
                styles={selectStyles}
                placeholder="Select Qualification"
                isClearable
                required
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-bold required-label">
                Notice Period
              </Form.Label>
              <Select
                options={noticePeriodOptions}
                value={
                  noticePeriodOptions.find(
                    (n) => n.value === formData.notice_period
                  ) || null
                }
                onChange={(opt) => handleSelectChange(opt, "notice_period")}
                styles={selectStyles}
                placeholder="Select Notice Period"
                isClearable
                required
              />
            </Col>
          </Row>

          {/* Job Type */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold required-label">
              Job Type
            </Form.Label>
            <Select
              options={jobTypeOptions}
              value={selectedJobType}
              onChange={(opt) => handleSelectChange(opt, "job_type")}
              styles={selectStyles}
              placeholder="Select Job Type"
              isClearable
              required
            />
          </Form.Group>

          {/* Profile Image + Resume */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold">Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-bold">Resume</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </Col>
          </Row>

          <Button
            type="submit"
            className="w-100 py-3 mt-4 fw-semibold rounded-pill text-white shadow-sm"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
              border: "none",
              fontSize: "15px",
            }}
            disabled={loading}
          >
            {loading ? "Updating Profile..." : "Save Profile Snapshot"}
          </Button>
        </Form>
      </Container>

      {/* Popup */}
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
    </>
  );
}
