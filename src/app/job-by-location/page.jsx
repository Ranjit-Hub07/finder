"use client";

import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const JobLocation = () => {
  const [searchInput, setSearchInput] = useState("");
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/recruiter/location/cities?countryCode=IN");
        if (!res.ok) throw new Error("Failed to fetch cities");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");
        setCities(data);
      } catch (err) {
        console.error("Error:", err.message);
        setError("Failed to load cities. Please try again later.");
      }
    };
    fetchCities();
  }, []);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "110px" }}>
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Jobs by Location</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Explore active employment opportunities across major cities in India.
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">Locations</span>
            </div>
          </Container>
        </div>

        {/* Search and Grid */}
        <Container className="my-5">
          <div className="text-center mb-4">
            <h2 style={{ fontWeight: "700", fontSize: "32px", color: "#05264e" }}>
              Job Location
            </h2>

            <div className="d-flex justify-content-center mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search By Location"
                style={{
                  width: "100%",
                  maxWidth: "1000px",
                  height: "50px",
                  borderRadius: "5px",
                }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-danger text-center mb-4">{error}</div>}

          <div
            className="mx-auto"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "15px 20px",
              maxWidth: "1000px",
              padding: "0 10px",
            }}
          >
            {filteredCities.map((city, idx) => (
              <Link
                key={idx}
                href={`/job-listing?location=${encodeURIComponent(city.name)}`}
                className="text-decoration-none fw-semibold"
                style={{ color: "#05264e" }}
              >
                {city.name}
              </Link>
            ))}
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

export default JobLocation;



