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
                      className="mb-3 similar-job-card"
                      style={{
                        cursor: "pointer",
                        borderRadius: "12px",
                        transition: "0.3s",
                        border: "1px solid #e6ecf5",
                      }}
                    >
                      <Card.Body>
                        <h6 className="fw-bold mb-1" style={{ color: "#05264e" }}>
                          {item.job_title}
                        </h6>
                        <div className="text-muted small mb-1">
                          🕒 Posted on {new Date(item.created_at).toLocaleDateString()}
                        </div>
                        <div className="fw-bold text-primary mb-2">
                          ₹{item.job_minsalary} {item.salary_period || "/month"}
                        </div>
                        <Badge bg="light" text="dark" className="me-1">
                          {item.job_company}
                        </Badge>
                        <Badge bg="light" text="dark">
                          {item.job_cityid}
                        </Badge>
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
