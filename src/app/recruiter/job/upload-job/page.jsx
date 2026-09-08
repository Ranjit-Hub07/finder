"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UploadJob = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cities, setCities] = useState([]);
  const [formValues, setFormValues] = useState({
    job_title: "",
    job_type: "",
    job_industry: "",
    job_role: "",
    salary_period: "",
    location: "",
    min_exp: "",
    max_exp: "",
    job_description: "",
  });

  const [countryCode, setCountryCode] = useState("IN"); // Default India

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`/api/recruiter/location/cities?countryCode=${countryCode}`);
        setCities(res.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [countryCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const triggerFileInput = () => {
    document.getElementById("jobFileInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, val]) => {
      formData.append(key, val);
    });
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const res = await axios.post("/api/recruiter/job/upload-job", formData);
      alert(res.status === 200 ? "Job posted successfully!" : "Something went wrong!");
    } catch (err) {
      console.error("Job upload failed:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        <Container fluid className="mt-3 d-flex justify-content-center">
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              width: "100%",
              maxWidth: "1300px",
            }}
          >
            <Form onSubmit={handleSubmit}>
              <h2 className="mb-4" style={{ color: "#05264e", fontSize: "18px" }}>
                Post Job Vacancy
              </h2>

              {/* Job Title and Type */}
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formJobTitle">
                    <Form.Label>Job Title <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="job_title"
                      value={formValues.job_title}
                      onChange={handleChange}
                      placeholder="e.g. Senior Product Designer"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formJobType">
                    <Form.Label>Job Type <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="job_type" value={formValues.job_type} onChange={handleChange}>
                      <option>Please Select a Job Type</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Industry and Role */}
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formJobIndustry">
                    <Form.Label>Job Industry <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="job_industry" value={formValues.job_industry} onChange={handleChange}>
                      <option>Please Select a Job Industry</option>
                      <option value="it">IT</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formJobRole">
                    <Form.Label>Job Role <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="job_role" value={formValues.job_role} onChange={handleChange}>
                      <option>Please Select a Job Role</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="manager">Manager</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Salary and Location */}
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formSalaryPeriod">
                    <Form.Label>Salary Period <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="salary_period" value={formValues.salary_period} onChange={handleChange}>
                      <option>Please Select Salary Period</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formLocation">
                    <Form.Label>Location (City) <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="location" value={formValues.location} onChange={handleChange}>
                      <option value="">Please Select Your City</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Experience */}
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formMinExperience">
                    <Form.Label>Min Experience <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="min_exp" value={formValues.min_exp} onChange={handleChange}>
                      {[...Array(21)].map((_, i) => (
                        <option key={i} value={i}>{i} Years</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formMaxExperience">
                    <Form.Label>Max Experience <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="max_exp" value={formValues.max_exp} onChange={handleChange}>
                      {[...Array(21)].map((_, i) => (
                        <option key={i} value={i}>{i} Years</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Job Description */}
              <Form.Group className="mb-3" controlId="formJobDescription">
                <Form.Label>Job Description <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  name="job_description"
                  rows={4}
                  value={formValues.job_description}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* File Upload Section */}
              <Row className="mb-4">
                <Col>
                  <div
                    style={{
                      border: "2px dashed #c3d4e9",
                      borderRadius: "10px",
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      width: "fit-content",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        fontSize: "24px",
                        color: "#0d6efd",
                      }}
                    >
                      +
                    </div>

                    <Button
                      variant="primary"
                      type="button"
                      onClick={triggerFileInput}
                      style={{ padding: "10px 20px", borderRadius: "8px" }}
                    >
                      Upload File
                    </Button>
                  </div>

                  <input
                    type="file"
                    id="jobFileInput"
                    name="job_file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  <div className="mt-2">
                    <span style={{ color: "#0a2540", fontWeight: "500", fontSize: "14px" }}>
                      Upload Job Ad Image
                    </span>
                    {selectedFile && (
                      <div className="mt-1">
                        <strong>Selected:</strong> {selectedFile.name}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              {/* Submit Button */}
              <div className="text-start">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default UploadJob;


