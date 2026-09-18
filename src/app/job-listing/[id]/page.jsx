"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import JobDetail from "../components/Jobdetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    if (id) {
      axios.get(`/api/seeker/${id}`).then((res) => {
        setJob(res.data.job);
        setSimilarJobs(res.data.similarJobs || []);
      });
    }
  }, [id]);

  if (!job) return <p className="text-center py-5">Loading job details...</p>;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "170px" }}>
        <Container className="py-4">
          <Row>
            <Col md={8}>
              <JobDetail job={job} />
            </Col>
            <Col md={4}>
              <h5 className="fw-bold mb-3" style={{ color: "#05264e" }}>
                Similar Jobs
              </h5>
              {similarJobs.length === 0 ? (
                <p className="text-muted">No similar jobs found.</p>
              ) : (
                similarJobs.map((item) => (
                  <Link
                    href={`/job-listing/${item.id}`}
                    key={item.id}
                    className="text-decoration-none"
                  >
                    <Card
                      className="mb-3 similar-job-card border-0 shadow-sm"
                      style={{
                        cursor: "pointer",
                        borderRadius: "14px",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        border: "1px solid #e2e8f0",
                        background: "#ffffff",
                      }}
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <h6 className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: "14.5px" }}>
                            {item.job_title}
                          </h6>
                          <span className="text-muted small" style={{ fontSize: "11px" }}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="fw-bold mb-2" style={{ color: "#059669", fontSize: "13.5px" }}>
                          ₹{item.job_minsalary} {item.salary_period || "/mo"}
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {item.job_company && (
                            <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: "11px" }}>
                              <i className="bi bi-building me-1"></i>
                              {item.job_company}
                            </span>
                          )}
                          {item.job_cityid && (
                            <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: "11px" }}>
                              <i className="bi bi-geo-alt me-1"></i>
                              {item.job_cityid}
                            </span>
                          )}
                          {item.role_name && (
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1" style={{ fontSize: "11px" }}>
                              {item.role_name}
                            </span>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                ))
              )}
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>

      <style jsx>{`
        .similar-job-card {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          background-color: #fff;
        }

        .similar-job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        a.text-decoration-none:hover {
          text-decoration: none;
        }
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
}
