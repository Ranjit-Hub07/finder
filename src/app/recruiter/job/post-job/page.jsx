"use client";
import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useRecruiterGuard from "@/hooks/useRecruiterGuard";
// ✅ FIX: Load react-select without SSR (prevents hydration mismatch)
const Select = dynamic(() => import("react-select"), { ssr: false });

const PostJob = () => {
  useRecruiterGuard();
  const router = useRouter();
  const [formData, setFormData] = useState({
    job_title: "",
    job_type: "",
    job_industry: "",
    job_role: "",
    job_minsalary: "",
    job_maxsalary: "",
    job_company: "",
    salary_period: "",
    job_cityid: "",
    job_minexp: "",
    job_maxexp: "",
    area: [],
    job_mineducation: "",
    job_desc: "",
    job_reqemail: "",
    job_reqmob: "",
  });

  const [cities, setCities] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [roles, setRoles] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);

  useEffect(() => {
    axios.get("/api/recruiter/job/job-industry").then((res) => {
      setIndustries(
        res.data.map((i) => ({ value: i.indus_id, label: i.indus_name }))
      );
    });
  }, []);

  useEffect(() => {
    if (!formData.job_industry) return;
    axios
      .get(`/api/recruiter/job/job-role?indus_id=${formData.job_industry}`)
      .then((res) => {
        setRoles(
          res.data.map((r) => ({ value: r.role_id, label: r.role_name }))
        );
      });
  }, [formData.job_industry]);

  useEffect(() => {
    axios
      .get(`/api/recruiter/location/cities?countryCode=IN`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCities(
            res.data.map((c) => ({
              value: c.name,
              label: c.name,
            }))
          );
        }
      })
      .catch((err) => console.error("Error loading cities:", err));
  }, []);

  useEffect(() => {
    axios.get("/api/recruiter/job/education").then((res) => {
      setEducationOptions(
        res.data.map((e) => ({
          value: e.educ_id,
          label: e.educ_name,
        }))
      );
    });
  }, []);

  // ✅ ✅ FIXED: Now 0 experience works correctly
  const handleSelectChange = (name, option) => {
    setFormData((prev) => ({
      ...prev,
      [name]: option ? option.value : "",
    }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAreaChange = (areaOption) => {
    setFormData((prev) => {
      const newArea = prev.area.includes(areaOption)
        ? prev.area.filter((a) => a !== areaOption)
        : [...prev.area, areaOption];
      return { ...prev, area: newArea };
    });
  };

  const jobTypeOptions = [
    { value: "Contractual Jobs", label: "Contractual Jobs" },
    { value: "Full Time", label: "Full Time" },
    { value: "Government Job", label: "Government Job" },
    { value: "Internship", label: "Internship" },
    { value: "Part Time", label: "Part Time" },
    { value: "Private Jobs", label: "Private Jobs" },
    { value: "State Govt. Jobs", label: "State Govt. Jobs" },
    { value: "Walk-In Jobs", label: "Walk-In Jobs" },
    { value: "Work From Home", label: "Work From Home" },
    { value: "Working In Abroad", label: "Working In Abroad" },
  ];

  const salaryPeriodOptions = [
    { value: "Yearly", label: "Yearly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Per Day" },
    { value: "Hourly", label: "Per Hour" },
  ];

  const experienceOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: `${i}`,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [key, value] of Object.entries(formData)) {
      if (
        (Array.isArray(value) && value.length === 0) ||
        (!Array.isArray(value) && value.toString().trim() === "")
      ) {
        alert(`Please fill/select the mandatory field: ${key.replace(/_/g, " ")}`);
        return;
      }
    }

    try {
      await axios.post("/api/recruiter/job/post-job", formData);
      alert("Job Posted Successfully");
      router.push("/recruiter/job");
    } catch (err) {
      alert("Failed to post job");
    }
  };

  return (
    <>
      <Navbar />
      <Topbar />

      {/* ✅ EVERYTHING BELOW IS 100% UNTOUCHED UI/STYLING FROM YOU */}
      <div
        style={{
          paddingTop: "175px",
          background: "linear-gradient(135deg, #f5f8ff 0%, #ebf1ff 100%)",
          minHeight: "100vh",
        }}
      >
        <Container>
          <div
            style={{
              background: "#fff",
              borderRadius: "15px",
              padding: "35px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
              border: "1px solid #e6ecf5",
              maxWidth: "1300px",
              margin: "0 auto",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                padding: "20px",
                background: "linear-gradient(90deg,#3b82f6,#2563eb)",
                borderRadius: "10px",
                marginBottom: "25px",
                color: "#fff",
              }}
            >
              <h3 style={{ margin: 0, fontWeight: "600" }}>Post a New Job</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Fill in the details below to publish a job opening.
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              {/* SECTION HEADER */}
              <h5 className="mb-3 fw-bold text-primary">Basic Job Details</h5>

              <Row className="mb-4">
                <Col>
                  <Form.Label>
                    Job Title <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>
                    Job Type <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Select
                    options={jobTypeOptions}
                    placeholder="Select Job Type"
                    onChange={(opt) => handleSelectChange("job_type", opt)}
                    classNamePrefix="react-select"
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Label>
                    Industry <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Select
                    options={industries}
                    placeholder="Select Industry"
                    onChange={(opt) => handleSelectChange("job_industry", opt)}
                    classNamePrefix="react-select"
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>
                    Role <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Select
                    options={roles}
                    placeholder="Select Role"
                    onChange={(opt) => handleSelectChange("job_role", opt)}
                    classNamePrefix="react-select"
                    required
                  />
                </Col>
              </Row>

              {/* AREA SECTION */}
              <div className="mb-4">
                <Form.Label>
                  Are You Hiring Employee For? <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <div className="d-flex gap-3 mt-2">
                  {["Rural", "Urban", "Both"].map((option) => (
                    <Form.Check
                      key={option}
                      type="checkbox"
                      label={option}
                      id={`area-${option}`}
                      checked={formData.area.includes(option)}
                      onChange={() => handleAreaChange(option)}
                    />
                  ))}
                </div>
              </div>

              <h5 className="mt-4 mb-3 fw-bold text-primary">Salary & Company</h5>

              <Row className="mb-4">
                <Col>
                  <Form.Label>
                    Min Salary <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="job_minsalary"
                    value={formData.job_minsalary}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>
                    Max Salary <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="job_maxsalary"
                    value={formData.job_maxsalary}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>

              <Form.Label>
                Hiring For <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                className="mb-4"
                type="text"
                name="job_company"
                value={formData.job_company}
                onChange={handleChange}
                required
              />

              <Row className="mb-4">
                <Col>
                  <Form.Label>
                    Salary Period <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Select
                    options={salaryPeriodOptions}
                    placeholder="Select Period"
                    onChange={(opt) => handleSelectChange("salary_period", opt)}
                    classNamePrefix="react-select"
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>
                    City <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Select
                    options={cities}
                    placeholder="Select City"
                    onChange={(opt) => handleSelectChange("job_cityid", opt)}
                    classNamePrefix="react-select"
                    required
                  />
                </Col>
              </Row>

              <h5 className="mt-4 mb-3 fw-bold text-primary">
                Experience & Qualification
              </h5>

              <Row className="mb-4">
                <Col>
                  <Form.Label>
                    Min Experience <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Select
                    options={experienceOptions}
                    placeholder="Min Exp"
                    onChange={(opt) => handleSelectChange("job_minexp", opt)}
                    classNamePrefix="react-select"
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>
                    Max Experience <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Select
                    options={experienceOptions}
                    placeholder="Max Exp"
                    onChange={(opt) => handleSelectChange("job_maxexp", opt)}
                    classNamePrefix="react-select"
                    required
                  />
                </Col>
              </Row>

              <Form.Label>
                Highest Qualification <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Select
                className="mb-4"
                options={educationOptions}
                placeholder="Select Qualification"
                onChange={(opt) => handleSelectChange("job_mineducation", opt)}
                classNamePrefix="react-select"
                required
              />

              <h5 className="mt-4 mb-3 fw-bold text-primary">
                Job Description & Contact
              </h5>

              <Form.Label>
                Description <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                className="mb-4"
                as="textarea"
                rows={4}
                name="job_desc"
                value={formData.job_desc}
                onChange={handleChange}
                required
              />

              <Row className="mb-4">
                <Col>
                  <Form.Label>
                    Recruiter Email <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="job_reqemail"
                    value={formData.job_reqemail}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>
                    Recruiter Phone <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="job_reqmob"
                    maxLength={10}
                    onChange={(e) => {
                      if (/^\d{0,10}$/.test(e.target.value)) {
                        handleChange(e);
                      }
                    }}
                    value={formData.job_reqmob}
                    required
                  />
                </Col>
              </Row>

              <div className="text-end">
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    padding: "10px 30px",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                >
                  Submit Job
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>

      <Footer />
      <style jsx global>{`
        *:not(input):not(textarea):not(select) {
          caret-color: transparent !important;
        }
        input,
        textarea,
        select {
          caret-color: auto !important;
        }
      `}</style>
    </>
  );
};

export default PostJob;
