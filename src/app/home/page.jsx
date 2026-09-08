"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Select from "react-select";
import { motion } from "framer-motion";
import BackToTop from "@/components/BackToTop";
export default function Home() {
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [cities, setCities] = useState([
    { id: 1, name: "Bhubaneswar" },
    { id: 2, name: "Bengaluru" },
    { id: 3, name: "Mumbai" },
    { id: 4, name: "Delhi" },
    { id: 5, name: "Hyderabad" },
    { id: 6, name: "Pune" },
    { id: 7, name: "Noida" },
    { id: 8, name: "Gurugram" },
    { id: 9, name: "Chennai" },
    { id: 10, name: "Kolkata" },
  ]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [countValues, setCountValues] = useState([0, 0, 0, 0]);
  const countersRef = useRef(null);

  const router = useRouter();

  useEffect(() => setIsClient(true), []);

  // ✅ Counter data
  const counters = [
    { label: "Jobs Posted", value: 2500 },
    { label: "Companies", value: 1500 },
    { label: "Job Seekers", value: 8500 },
    { label: "Applications", value: 9500 },
  ];

  // ✅ Animate counters when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          counters.forEach((item, i) => {
            let start = 0;
            const end = item.value;
            const duration = 2000;
            const stepTime = 30;
            const increment = end / (duration / stepTime);

            const counterInterval = setInterval(() => {
              start += increment;
              if (start >= end) {
                start = end;
                clearInterval(counterInterval);
              }
              setCountValues((prev) => {
                const updated = [...prev];
                updated[i] = Math.floor(start);
                return updated;
              });
            }, stepTime);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (countersRef.current) observer.observe(countersRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch cities
  useEffect(() => {
    if (!isClient) return;
    async function fetchCities() {
      try {
        const res = await fetch(`/api/recruiter/location/cities?countryCode=IN`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCities(data);
          }
        }
      } catch (error) {
        console.warn("Could not load dynamic cities, fallback in place:", error);
      }
    }
    fetchCities();
  }, [isClient]);

  // ✅ Fetch blogs
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error loading blogs:", error);
      }
    }
    fetchBlogs();
  }, []);

  // ✅ Fetch latest jobs
  useEffect(() => {
    async function fetchLatestJobs() {
      try {
        const res = await fetch("/api/recruiter/job/latest");
        if (!res.ok) throw new Error("Failed to fetch latest jobs");
        const data = await res.json();
        setLatestJobs(data.jobs || []);
      } catch (error) {
        console.error("Error loading latest jobs:", error);
      }
    }
    fetchLatestJobs();
  }, []);

  const experienceOptions = [
    { value: "0", label: "Fresher (0 yr)" },
    { value: "0-1", label: "0 - 1 Years" },
    { value: "1-3", label: "1 - 3 Years" },
    { value: "3-5", label: "3 - 5 Years" },
    { value: "5+", label: "5+ Years" },
  ];

  const handleSearch = () => {
    if (!experience || !location) {
      alert("Please select both Experience and Location.");
      return;
    }
    const query = new URLSearchParams();
    query.append("experience", experience);
    query.append("location", location);
    if (keyword) query.append("keyword", keyword);
    router.push(`/job-listing?${query.toString()}`);
  };

  // ✅ Blog scroll (manual)
  const scrollBlogs = (direction) => {
    const container = document.getElementById("blogScrollContainer");
    if (!container) return;
    const scrollAmount = 400;
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // ✅ Auto-scroll blogs
  useEffect(() => {
    const container = document.getElementById("blogScrollContainer");
    if (!container) return;
    const cardWidth = 400;
    let scrollDirection = 1;

    const autoScroll = setInterval(() => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      container.scrollBy({ left: scrollDirection * cardWidth, behavior: "smooth" });

      setTimeout(() => {
        if (container.scrollLeft >= maxScrollLeft - 10) scrollDirection = -1;
        else if (container.scrollLeft <= 10) scrollDirection = 1;
      }, 600);
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [blogs]);
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div
        style={{
          background: "linear-gradient(180deg, #edf2f9 0%, #f8fafc 100%)",
          paddingTop: "175px",
          paddingBottom: "130px",
          position: "relative",
        }}
      >
        <Container>
          <Row className="align-items-center">
              <Col md={6}>
                <h1 style={{ fontWeight: "800", fontSize: "44px", color: "#0f172a", letterSpacing: "-0.5px" }}>
                  The{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                      color: "#ffffff",
                      padding: "3px 14px",
                      borderRadius: "10px",
                      display: "inline-block",
                      boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
                    }}
                  >
                    Easiest Way
                  </span>
                  <br />
                  to Get Your <span style={{ color: "#4f46e5" }}>Dream Job</span>
                </h1>
                <p className="text-muted mt-4" style={{ fontSize: "16px", lineHeight: "1.7" }}>
                  Each month, more than 3 million job seekers turn to our
                  website in their search for work, making over 140,000
                  applications every single day
                </p>

                {/* Search Bar */}
                <div
                  className="d-flex align-items-center bg-white p-2 ps-3 pe-2 mt-4 flex-wrap flex-md-nowrap gap-2 gap-md-0"
                  style={{
                    width: "100%",
                    maxWidth: "860px",
                    minHeight: "64px",
                    borderRadius: "16px",
                    position: "relative",
                    zIndex: 1020,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 30px -4px rgba(15, 23, 42, 0.08)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 16px 36px -4px rgba(79, 70, 229, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px -4px rgba(15, 23, 42, 0.08)";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  {/* Experience */}
                  <div
                    className="d-flex align-items-center px-3"
                    style={{
                      borderRight: "1px solid #e6e9ef",
                      height: "100%",
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className="bi bi-briefcase text-secondary me-2"
                      style={{ fontSize: "18px" }}
                    ></i>
                    {isClient ? (
                      <div style={{ width: "150px" }}>
                        <Select
                          options={experienceOptions}
                          value={
                            experience
                              ? experienceOptions.find((opt) => opt.value === experience) || { value: experience, label: experience }
                              : null
                          }
                          onChange={(selected) =>
                            setExperience(selected?.value || "")
                          }
                          placeholder="Exp (years)"
                          isSearchable
                          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                          menuPosition="fixed"
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: "none",
                              boxShadow: "none",
                              minHeight: "40px",
                              fontSize: "14px",
                              cursor: "pointer",
                              backgroundColor: "transparent",
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 99999,
                              fontSize: "14px",
                              borderRadius: "12px",
                              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
                              border: "1px solid #e2e8f0",
                              padding: "6px",
                            }),
                            option: (base, state) => ({
                              ...base,
                              borderRadius: "8px",
                              padding: "8px 12px",
                              cursor: "pointer",
                              backgroundColor: state.isSelected
                                ? "#4f46e5"
                                : state.isFocused
                                ? "rgba(99, 102, 241, 0.1)"
                                : "transparent",
                              color: state.isSelected ? "#ffffff" : "#1e293b",
                              fontWeight: state.isSelected ? "600" : "500",
                            }),
                          }}
                        />
                      </div>
                    ) : (
                      <Form.Select
                        className="border-0 p-0"
                        style={{ width: "150px" }}
                        disabled
                      >
                        <option>Loading...</option>
                      </Form.Select>
                    )}
                  </div>

                  {/* Location */}
                  <div
                    className="d-flex align-items-center px-3"
                    style={{
                      borderRight: "1px solid #e6e9ef",
                      height: "100%",
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className="bi bi-geo-alt text-secondary me-2"
                      style={{ fontSize: "18px" }}
                    ></i>
                    {isClient ? (
                      <div style={{ width: "200px" }}>
                        <Select
                          options={cities.map((city) => ({
                            value: city.name,
                            label: city.name,
                          }))}
                          value={
                            location ? { value: location, label: location } : null
                          }
                          onChange={(selected) =>
                            setLocation(selected?.value || "")
                          }
                          placeholder="Select Location"
                          isSearchable
                          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                          menuPosition="fixed"
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: "none",
                              boxShadow: "none",
                              minHeight: "40px",
                              fontSize: "14px",
                              cursor: "pointer",
                              backgroundColor: "transparent",
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 99999,
                              fontSize: "14px",
                              borderRadius: "12px",
                              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
                              border: "1px solid #e2e8f0",
                              padding: "6px",
                            }),
                            option: (base, state) => ({
                              ...base,
                              borderRadius: "8px",
                              padding: "8px 12px",
                              cursor: "pointer",
                              backgroundColor: state.isSelected
                                ? "#4f46e5"
                                : state.isFocused
                                ? "rgba(99, 102, 241, 0.1)"
                                : "transparent",
                              color: state.isSelected ? "#ffffff" : "#1e293b",
                              fontWeight: state.isSelected ? "600" : "500",
                            }),
                          }}
                        />
                      </div>
                    ) : (
                      <Form.Select
                        className="border-0 p-0"
                        style={{ width: "150px" }}
                        disabled
                      >
                        <option>Loading...</option>
                      </Form.Select>
                    )}
                  </div>

                  {/* Keyword */}
                  <div
                    className="d-flex align-items-center flex-grow-1 px-3"
                    style={{
                      borderRight: "1px solid #e6e9ef",
                      height: "100%",
                    }}
                  >
                    <i
                      className="bi bi-grid text-secondary me-2"
                      style={{ fontSize: "18px" }}
                    ></i>
                    <Form.Control
                      type="text"
                      placeholder="Your keyword..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="border-0 shadow-none"
                      style={{ fontSize: "14px", color: "#333" }}
                    />
                  </div>

                  {/* Search Btn */}
                  <div className="px-3">
                    <Button
                      onClick={handleSearch}
                      style={{
                        backgroundColor: "#3B66F6",
                        border: "none",
                        height: "45px",
                        borderRadius: "8px",
                        padding: "0 24px",
                        fontWeight: "500",
                        fontSize: "15px",
                        boxShadow: "0 4px 10px rgba(4, 21, 78, 0.3)",
                       transition: "all 0.3s ease",     
                       }}
                       className="search-btn"
                    >
                      <i className="bi bi-search me-2"></i> SEARCH
                    </Button>
                  </div>
                </div>
              </Col>

 {/* Hero Image with Automatic Floating Animation */}
<Col md={6} className="text-center position-relative mt-5 mt-md-0">
  <div
    className="position-relative d-inline-block hero-auto-animate"
    style={{
      cursor: "pointer",
    }}
  >
    <Image
      src="/image/team1.png"
      alt="Team working"
      width={350}
      height={250}
      className="rounded hero-main"
      style={{
        borderRadius: "20px",
        objectFit: "cover",
      }}
    />
    <div
      className="hero-sub position-absolute"
      style={{
        bottom: "-70px",
        left: "-40px",
        borderRadius: "20px",
      }}
    >
      <Image
        src="/image/team2.png"
        alt="Business meeting"
        width={300}
        height={200}
        className="rounded"
        style={{
          borderRadius: "20px",
          objectFit: "cover",
        }}
      />
    </div>
  </div>
  

  {/* Animation Styles */}
  <style jsx global>{`
  .search-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
  transition: all 0.25s ease;
}

.search-btn:hover {
  background: linear-gradient(135deg, #4338ca 0%, #0891b2 100%) !important;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.45);
}

    @keyframes floatMain {
      0% {
        transform: translateY(0px) rotate(0deg) scale(1);
      }
      50% {
        transform: translateY(-10px) rotate(1.5deg) scale(1.03);
      }
      100% {
        transform: translateY(0px) rotate(0deg) scale(1);
      }
    }

    @keyframes floatSub {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      50% {
        transform: translate(-10px, 10px) scale(1.05);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }

    .hero-auto-animate .hero-main {
      animation: floatMain 6s ease-in-out infinite;
      
      transition: all 0.4s ease;
    }

    .hero-auto-animate .hero-sub {
      animation: floatSub 7s ease-in-out infinite;
     
      transition: all 0.4s ease;
    }
  `}</style>
</Col>
            </Row>
          </Container>
        </div>

    {/* BROWSE BY CATEGORY */}
<section style={{ padding: "80px 0", backgroundColor: "#fff" }}>
  <Container>
    <div className="text-center mb-5">
      <h2 className="fw-bold">Browse Jobs by Categories</h2>
      <p className="text-muted">
        Find the job that's perfect for you, about 800+ new jobs everyday.
      </p>
    </div>

    <Row className="justify-content-center gy-4">
      {[
        { title: ".Net Developer", image: "/image/dotnet.jpg" },
        { title: "Academic Coordinator", image: "/image/academic.jpg" },
        { title: "Accounting Consultant", image: "/image/AccountingConsultant.jpg" },
        { title: "Accounts", image: "/image/accounts.webp" },
        { title: "ACP Work", image: "/image/acp.webp" },
      ].map((job, index) => (
        <Col
          key={index}
          xs={6}
          md={4}
          lg={2}
          className="d-flex justify-content-center"
        >
          <Card
            className="text-center shadow-sm border-0 category-card"
            style={{
              width: "210px", // same width
              height: "200px", // same height
              borderRadius: "15px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 15px 25px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
            }}
          >
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <Image
                src={job.image}
                alt={job.title}
                width={150} // ⬅️ increased from 80
                height={150} // ⬅️ increased from 80
                className="mb-3"
                style={{
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)", // subtle image shadow
                }}
              />
              <Card.Text
                className="fw-medium text-dark"
                style={{ fontSize: "15px" }}
              >
                {job.title}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
</section>


       {/* 👇 NEW HIRING BANNER SECTION 👇 */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#f8fbff",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card
              className="border-0 shadow-sm px-4 py-5 mx-auto"
              style={{
                borderRadius: "20px",
                maxWidth: "1500px",
                background:
                  "linear-gradient(90deg, #ffffff 0%, #f0f6ff 100%)",
              }}
            >
              <Row className="align-items-center">
                {/* Left Illustration */}
                <Col md={2} className="text-center d-none d-md-block">
                  <Image
                    src="/image/hiring-left.png"
                    alt="Hiring illustration"
                    width={450}
                    height={880}
                    className="img-fluid"
                  />
                </Col>

                {/* Text Section */}
                <Col md={7} className="text-center text-md-start">
                  <p
                    className="text-uppercase fw-semibold mb-1"
                    style={{
                      color: "#8ca0c3",
                      letterSpacing: "2px",
                    }}
                  >
                    We are
                  </p>
                  <h2
                    className="fw-bold mb-2"
                    style={{
                      fontSize: "2.5rem",
                      color: "#0a2342",
                    }}
                  >
                    HIRING
                  </h2>
                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Let’s{" "}
                    <span className="fw-semibold text-primary">work</span>{" "}
                    together &{" "}
                    <span className="fw-semibold text-primary">explore</span>{" "}
                    opportunities.
                  </p>
                </Col>

                {/* Apply Button */}
                <Col
                  md={3}
                  className="text-center mt-4 mt-md-0 d-flex justify-content-center justify-content-md-end"
                >
                  <Button
                    className="fw-semibold"
                    style={{
                      background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                      border: "none",
                      borderRadius: "10px",
                      padding: "14px 28px",
                      boxShadow: "0 6px 18px rgba(79, 70, 229, 0.35)",
                      transition: "all 0.25s ease",
                    }}
                    onClick={() => router.push("/job-listing?company=finder")}
                  >
                    <i className="bi bi-send me-2"></i> Apply Now
                  </Button>
                </Col>
              </Row>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{
                position: "absolute",
                right: "20px",
                bottom: "15px",
              }}
              className="d-none d-md-block"
            >
              <Image
                src="/image/hiring-right.svg"
                alt="Hiring illustration right"
                width={180}
                height={220}
                className="img-fluid"
              />
            </motion.div>
          </Card>
        </motion.div>
      </Container>

        {/* Floating Animation scoped */}
        <style jsx global>{`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
            100% {
              transform: translateY(0px);
            }
          }
          .floating-illus {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </section>

       {/* ✅ LATEST JOBS SECTION */}
<section style={{ padding: "80px 0", backgroundColor: "#f9fbff" }}>
  <Container>
    <div className="text-center mb-5">
      <h2 className="fw-bold mb-2" style={{ color: "#05264e" }}>
        Latest Jobs Trending Now
      </h2>
      <p className="text-muted mb-0">
        Explore new opportunities and trending job openings updated daily.
      </p>
    </div>

    {latestJobs.length > 0 ? (
      <Row className="gy-4">
        {latestJobs.slice(0, 4).map((job) => (
          <Col key={job.id} md={3}>
            <Card
              className="border-0 shadow-sm h-100 bg-white"
              style={{
                borderRadius: "16px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(0,0,0,0.05)";
              }}
            >
              <Card.Body className="d-flex flex-column justify-content-between">
                {/* Header */}
                <div>
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        backgroundColor: "rgba(99, 102, 241, 0.12)",
                        width: "50px",
                        height: "50px",
                        fontWeight: "700",
                        color: "#4f46e5",
                        fontSize: "18px",
                      }}
                    >
                      {job.job_company
                        ? job.job_company.charAt(0).toUpperCase()
                        : "F"}
                    </div>
                    <div>
                      <h6
                        className="fw-bold mb-0"
                        style={{ color: "#0f172a", fontSize: "16px" }}
                      >
                        {job.job_title}
                      </h6>
                      <small className="text-muted">
                        {job.job_company || "Finder™"}
                      </small>
                    </div>
                  </div>

                  {/* Job Description */}
                  <p
                    className="text-muted mb-3"
                    style={{
                      fontSize: "14px",
                      minHeight: "60px",
                      lineHeight: "1.5",
                    }}
                  >
                    {job.job_desc
                      ? job.job_desc.slice(0, 100) + "..."
                      : "No description available."}
                  </p>
{/* Meta Info */}
<div
  className="d-flex flex-wrap text-muted small mb-3"
  style={{ gap: "10px" }}
>
  {/* Location */}
  <span>
    <i className="bi bi-geo-alt me-1 text-primary"></i>
    {job.job_cityid && job.job_cityid.trim() !== ""
      ? job.job_cityid
      : "Location Not Specified"}
  </span>

  {/* Experience */}
  <span>
    <i className="bi bi-clock me-1 text-primary"></i>
    {job.job_minexp === 0 ||
    job.job_minexp === null ||
    job.job_minexp === undefined
      ? "Fresher"
      : `${job.job_minexp} - ${job.job_maxexp} yrs`}
  </span>

  {/* Salary */}
  <span>
    <i className="bi bi-cash-coin me-1 text-primary"></i>
    {job.job_minsalary &&
    job.job_minsalary !== "" &&
    job.job_minsalary !== null &&
    job.job_minsalary !== undefined
      ? `₹${job.job_minsalary} - ₹${job.job_maxsalary} / ${
          job.salary_period || "Monthly"
        }`
      : "Salary Not Disclosed"}
  </span>
</div>

                </div>

                {/* View More Button */}
                <div className="text-center mt-auto">
                  <Button
                    onClick={() => router.push(`/job-listing/${job.id}`)}
                    style={{
                      background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 20px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#ffffff",
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    ) : (
      <p className="text-center text-muted w-100">
        No jobs available right now.
      </p>
    )}
  </Container>
</section>

    {/* FIND THE ONE THAT’S RIGHT FOR YOU */}
<section
 style={{
    backgroundImage:  "linear-gradient(rgba(255, 255, 255, 0.54), rgba(255, 255, 255, 0.86)), url('/image/home.jpg')", // your background image path
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "60px 0",
  }}
>
  <Container>
    <Row className="align-items-center">
      <Col md={6}>
        <div style={{ position: "relative", width: "100%", height: "500px" }}>
          {/* Main Big Image */}
          <Image
            src="/image/team.jpeg"
            alt="team"
            width={450}
            height={350}
            className="rounded"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: "15px",
            }}
          />

          {/* Floating small image 1 */}
          <Image
            src="/image/collage1.jpg"
            alt="floating1"
            width={250}
            height={280}
            className="rounded"
            style={{
              position: "absolute",
              top: "20px",
              left: "-25px",
              transform: "rotate(-6deg)",
              borderRadius: "15px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              objectFit: "cover",
            }}
          />

          {/* Floating small image 2 */}
          <Image
            src="/image/collage2.jpg"
            alt="floating2"
            width={240}
            height={170}
            className="rounded"
            style={{
              position: "absolute",
              bottom: "20px",
              right: "-25px",
              transform: "rotate(5deg)",
              borderRadius: "15px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              objectFit: "cover",
            }}
          />
        </div>
      </Col>

      <Col md={6}>
        <p className="text-muted mb-1">Millions Of Jobs.</p>
        <h2 className="fw-bold mb-3">
          Find The One That’s <span className="text-primary">Right</span> For You
        </h2>
        <p className="text-muted mb-4">
          Search all the open positions on the web. Get your own personalized salary
          estimate. Read reviews on over 400,000 companies worldwide.
        </p>
        <Button
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 28px",
            fontWeight: "600",
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
            transition: "all 0.25s ease",
          }}
          onClick={() => router.push("/job-listing")}
        >
          <i className="bi bi-search me-2"></i> Search Jobs
        </Button>
      </Col>
    </Row>
  </Container>
{/* </section> */}

{/* ✅ Counters Section */}
<section ref={countersRef} style={{ padding: "60px 0", background: "transparent" }}>
  <Container>
    <Row className="text-center justify-content-center gy-4">
      {counters.map((item, i) => (
        <Col key={i} md={3} sm={6}>
          <div
            className="p-4 bg-white rounded-4 h-100"
            style={{
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 14px 28px -4px rgba(79, 70, 229, 0.15)";
              e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px -2px rgba(15, 23, 42, 0.05)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <h2
              style={{
                fontWeight: "800",
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "44px",
                marginBottom: "8px",
                letterSpacing: "-0.5px",
              }}
            >
              {countValues[i].toLocaleString()}+
            </h2>
            <h5 style={{ fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>{item.label}</h5>
            <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
              Verified and updated daily on Finder portal.
            </p>
          </div>
        </Col>
      ))}
    </Row>
  </Container>
</section>
</section>

{/* 📰 Blog Section */}
<section style={{ padding: "80px 0", backgroundColor: "#fff" }}>
  <Container>
    {/* ✅ Centered heading */}
    <div className="text-center mb-4">
      <h2 className="fw-bold" style={{ color: "#05264e" }}>
        Blogs
      </h2>
      <div className="d-flex justify-content-end gap-2">
        <Button
          variant="light"
          onClick={() => scrollBlogs("prev")}
          className="rounded-circle border-0 shadow-sm"
          style={{ width: "40px", height: "40px" }}
        >
          <i className="bi bi-chevron-left"></i>
        </Button>
        <Button
          variant="light"
          onClick={() => scrollBlogs("next")}
          className="rounded-circle border-0 shadow-sm"
          style={{ width: "40px", height: "40px" }}
        >
          <i className="bi bi-chevron-right"></i>
        </Button>
      </div>
    </div>

    {/* Blog Cards */}
    <div
      id="blogScrollContainer"
      style={{
        display: "flex",
        overflowX: "auto",
        scrollBehavior: "smooth",
        gap: "24px",
        paddingBottom: "10px",
      }}
    >
      {blogs.length > 0 ? (
        blogs.map((blog) => {
          const formattedDate = blog.date || "—";
          const previewText = blog.excerpt
            ? blog.excerpt.length > 150
              ? blog.excerpt.slice(0, 150) + "..."
              : blog.excerpt
            : "No content available.";

          return (
            <Card
              key={blog.id}
              className="border rounded-4 shadow-sm bg-white"
              style={{
                width: "380px",
                height: "500px",
                flexShrink: 0,
                borderColor: "#e5e7eb",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(0, 0, 0, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0, 0, 0, 0.05)";
              }}
            >
             {/* Blog Image (final rounded corners) */}
<div
  style={{
    width: "100%",
    height: "180px",
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
    overflow: "hidden",
    marginBottom: "5px",
  }}
>
  <Image
    src={blog.image || "/image/default-blog.jpg"}
    alt={blog.title}
    width={380}
    height={200}
    unoptimized={true}
    style={{
      objectFit: "cover",
      width: "100%",
      height: "100%",
    }}
  />
</div>


              {/* Blog Content */}
              <Card.Body
                className="p-4 d-flex flex-column justify-content-between"
                style={{ height: "calc(100% - 180px)" }}
              >
                <div>
                  <span
                    className="d-inline-block mb-2 px-3 py-1 rounded-3 fw-semibold"
                    style={{
                      backgroundColor: "#f0f3ff",
                      color: "#4c63e3",
                      fontSize: "13px",
                    }}
                  >
                    Blog
                  </span>

                  {/* ✅ Clickable Heading */}
                  <h6
                    onClick={() => router.push(`/blog/${blog.id}`)}
                    className="fw-bold mb-2"
                    style={{
                      color: "#05264e",
                      fontSize: "17px",
                      lineHeight: "1.4",
                      cursor: "pointer",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#3B66F6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#05264e")
                    }
                  >
                    {blog.title?.length > 70
                      ? blog.title.slice(0, 70) + "..."
                      : blog.title}
                  </h6>

                  <p
                    className="text-muted mb-3"
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      height: "75px",
                      overflow: "hidden",
                    }}
                  >
                    {previewText}
                  </p>
                </div>

                <div>
                  <Button
                    variant="link"
                    className="p-0 fw-semibold"
                    onClick={() => router.push(`/blog/${blog.id}`)}
                    style={{
                      color: "#4c63e3",
                      textDecoration: "none",
                      fontSize: "14px",
                      letterSpacing: "0.3px",
                    }}
                  >
                    READ MORE
                  </Button>

                  <div className="mt-3 d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{
                        backgroundColor: "#f0f3ff",
                        width: "28px",
                        height: "28px",
                        fontWeight: "700",
                        color: "#4c63e3",
                        fontSize: "13px",
                      }}
                    >
                      du
                    </div>
                    <div>
                      <small
                        className="fw-semibold d-block"
                        style={{ color: "#05264e" }}
                      >
                        {blog.author || "Finder (Super Admin)"}
                      </small>
                      <small className="text-muted">{formattedDate}</small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p className="text-center text-muted w-100">
          No blogs available right now.
        </p>
      )}
    </div>

    {/* More Blogs Button */}
    <div className="text-center mt-5">
      <Button
        onClick={() => router.push("/blog")}
        className="px-4 py-2 rounded-pill fw-semibold shadow-sm"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
          color: "#ffffff",
          border: "none",
          boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
          padding: "10px 28px",
          transition: "all 0.25s ease",
        }}
      >
        <i className="bi bi-journal-text me-2"></i> More Blogs
      </Button>
    </div>
  </Container>

 {/* Hide scrollbar */}
        <style jsx global>{`
          #blogScrollContainer::-webkit-scrollbar {
            display: none;
          }
          #blogScrollContainer {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
      <>
      {/* global caret-color tweak (hides caret on non-input elements) */}
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

      <Footer />
      <BackToTop/>
      </>
    </>
  );
}