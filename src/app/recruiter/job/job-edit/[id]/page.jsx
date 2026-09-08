"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

const EditPost = () => {
  const router = useRouter();
  const { id: jobId } = useParams();

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
    job_minexp: 0,
    job_maxexp: 0,
    area: [], // changed to array to hold multiple checkbox selections
    job_mineducation: "",
    job_desc: "",
    job_reqemail: "",
    job_reqmob: "",
  });

  const [cities, setCities] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [roles, setRoles] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [clientLoaded, setClientLoaded] = useState(false);

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

  const experienceOptions = Array.from({ length: 11 }, (_, i) => ({ value: i, label: `${i}` }));

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  useEffect(() => {
    if (!jobId) return;
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(`/api/recruiter/job/job-edit/${jobId}`);
        const job = res.data;

        setFormData({
          job_title: job.job_title || "",
          job_type: job.job_type || "",
          job_industry: job.indus_id ? job.indus_id.toString() : "",
          job_role: job.role_id ? job.role_id.toString() : "",
          job_minsalary: job.job_minsalary ? job.job_minsalary.toString() : "",
          job_maxsalary: job.job_maxsalary ? job.job_maxsalary.toString() : "",
          job_company: job.job_company || "",
          salary_period: job.salary_period || "",
          job_cityid: job.job_cityid || "",
          job_minexp: job.job_minexp || 0,
          job_maxexp: job.job_maxexp || 0,
          area: job.area ? (typeof job.area === "string" ? job.area.split(",") : job.area) : [],
          job_mineducation: job.educ_id ? job.educ_id.toString() : "",
          job_desc: job.job_desc || "",
          job_reqemail: job.job_reqemail || "",
          job_reqmob: job.job_reqmob || "",
        });
      } catch (error) {
        console.error("Error fetching job:", error);
        alert("Failed to load job details.");
      }
    };
    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get("/api/recruiter/job/job-industry");
        setIndustries(res.data.map((ind) => ({ value: ind.indus_id.toString(), label: ind.indus_name })));
      } catch (err) {
        console.error("Error fetching industries:", err);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!formData.job_industry) return;
      try {
        const res = await axios.get(`/api/recruiter/job/job-role?indus_id=${formData.job_industry}`);
        setRoles(res.data.map((r) => ({ value: r.role_id.toString(), label: r.role_name })));
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, [formData.job_industry]);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await axios.get("/api/recruiter/job/education");
        setEducationOptions(res.data.map((edu) => ({ value: edu.educ_id.toString(), label: edu.educ_name })));
      } catch (err) {
        console.error("Error fetching education:", err);
      }
    };
    fetchEducation();
  }, []);

  useEffect(() => {
    if (!clientLoaded) return;
    const fetchCities = async () => {
      try {
        const res = await axios.get("/api/recruiter/location/cities?countryCode=IN");
        if (Array.isArray(res.data)) {
          setCities(res.data.map((city) => ({ value: city.name, label: city.name })));
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, [clientLoaded]);

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => ({ ...prev, [name]: selectedOption ? selectedOption.value : "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Area checkbox change
  const handleAreaChange = (areaOption) => {
    setFormData((prev) => {
      const currentAreas = prev.area;
      if (currentAreas.includes(areaOption)) {
        return { ...prev, area: currentAreas.filter((a) => a !== areaOption) };
      } else {
        return { ...prev, area: [...currentAreas, areaOption] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mandatory fields including area (must have at least one selected)
    if (
      !formData.job_title ||
      !formData.job_type ||
      !formData.job_industry ||
      !formData.job_role ||
      !formData.job_minsalary ||
      !formData.job_maxsalary ||
      !formData.job_company ||
      !formData.salary_period ||
      !formData.job_cityid ||
      formData.job_minexp === "" ||
      formData.job_maxexp === "" ||
      formData.area.length === 0 ||
      !formData.job_mineducation ||
      !formData.job_desc ||
      !formData.job_reqemail ||
      !formData.job_reqmob
    ) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    try {
      const payload = {
        job_title: formData.job_title,
        job_type: formData.job_type,
        indus_id: Number(formData.job_industry),
        role_id: Number(formData.job_role),
        job_minsalary: Number(formData.job_minsalary),
        job_maxsalary: Number(formData.job_maxsalary),
        job_company: formData.job_company,
        salary_period: formData.salary_period,
        job_cityid: formData.job_cityid,
        job_minexp: Number(formData.job_minexp),
        job_maxexp: Number(formData.job_maxexp),
        area: formData.area.join(","), // send as comma separated string
        educ_id: Number(formData.job_mineducation),
        job_desc: formData.job_desc,
        job_reqemail: formData.job_reqemail,
        job_reqmob: formData.job_reqmob,
      };

      await axios.put(`/api/recruiter/job/job-edit/${jobId}`, payload);
      alert("Job updated successfully!");
      router.push(`/recruiter/job/${jobId}`);
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Something went wrong while updating the job post.");
    }
  };

  const areaOptions = ["Rural", "Urban", "Both"];

  return (
    <>
      <Navbar />
      <Topbar />
      <div style={{ paddingTop: "175px", backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
        <Container className="d-flex justify-content-center">
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: "1300px",
            }}
          >
            <Form onSubmit={handleSubmit}>
              <h2 className="mb-4" style={{ color: "#05264e", fontSize: "18px" }}>
                Edit Post
              </h2>

              {/* Job Title & Type */}
              <Row className="mb-3">
                <Col>
                  <Form.Group>
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
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>
                      Job Type <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    {clientLoaded && (
                      <Select
                        options={jobTypeOptions}
                        value={jobTypeOptions.find((opt) => opt.value === formData.job_type)}
                        onChange={(opt) => handleSelectChange("job_type", opt)}
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Industry & Role */}
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>
                      Industry <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    {clientLoaded && (
                      <Select
                        options={industries}
                        value={industries.find((opt) => opt.value === formData.job_industry)}
                        onChange={(opt) => handleSelectChange("job_industry", opt)}
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>
                      Role <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    {clientLoaded && (
                      <Select
                        options={roles}
                        value={roles.find((opt) => opt.value === formData.job_role)}
                        onChange={(opt) => handleSelectChange("job_role", opt)}
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Salary & Company */}
              <Row className="mb-3">
                <Col>
                  <Form.Group>
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
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
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
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>
                  Hiring Company <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="job_company"
                  value={formData.job_company}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Salary Period & City */}
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>
                      Salary Period <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    {clientLoaded && (
                      <Select
                        options={salaryPeriodOptions}
                        value={salaryPeriodOptions.find((opt) => opt.value === formData.salary_period)}
                        onChange={(opt) => handleSelectChange("salary_period", opt)}
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>
                      City <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    {clientLoaded && (
                      <Select
                        options={cities}
                        value={cities.find((opt) => opt.value === formData.job_cityid)}
                        onChange={(opt) => handleSelectChange("job_cityid", opt)}
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Experience */}
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>
                      Min Experience <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    {clientLoaded && (
                      <Select
                        options={experienceOptions}
                        value={experienceOptions.find((opt) => opt.value === Number(formData.job_minexp))}
                        onChange={(opt) => handleSelectChange("job_minexp", opt)}
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>
                      Max Experience <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    {clientLoaded && (
                      <Select
                        options={experienceOptions}
                        value={experienceOptions.find((opt) => opt.value === Number(formData.job_maxexp))}
                        onChange={(opt) => handleSelectChange("job_maxexp", opt)}
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Area (Checkboxes) & Education */}
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>
                      Are You Hiring Employee For? <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <div className="d-flex gap-3 mt-2">
                      {areaOptions.map((option) => (
                        <Form.Check
                          key={option}
                          type="checkbox"
                          id={`area-${option}`}
                          label={option}
                          checked={formData.area.includes(option)}
                          onChange={() => handleAreaChange(option)}
                        />
                      ))}
                    </div>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>
                      Education <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    {clientLoaded && (
                      <Select
                        options={educationOptions}
                        value={educationOptions.find((opt) => opt.value === formData.job_mineducation)}
                        onChange={(opt) => handleSelectChange("job_mineducation", opt)}
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Description & Contact */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Job Description <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="job_desc"
                  value={formData.job_desc}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
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
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>
                      Recruiter Mobile <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="job_reqmob"
                      value={formData.job_reqmob}
                      onChange={handleChange}
                      maxLength={10}
                      pattern="\d*"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" className="btn btn-primary mt-3">
                Update Job
              </Button>
            </Form>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default EditPost;
