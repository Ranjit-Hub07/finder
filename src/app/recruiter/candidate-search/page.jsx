"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const Select = dynamic(() => import("react-select"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const Topbar = dynamic(() => import("@/components/Topbar"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

const CandidatesSearch = () => {
  const [skills, setSkills] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- SAFE JSON FETCH ----------------
  const safeFetchJson = async (url) => {
    try {
      const res = await fetch(url);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        console.error("Server returned HTML instead of JSON:", text);
        return [];
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      return [];
    }
  };

  // LOAD SKILLS (ROLE NAMES)
  const fetchSkills = async () => {
    const data = await safeFetchJson("/api/skills");
    setSkills(
      Array.isArray(data)
        ? data.map((s) => ({ value: s.name, label: s.name }))
        : []
    );
  };

  // LOAD CITIES
  const fetchCities = async () => {
    const data = await safeFetchJson(
      "/api/recruiter/location/cities?countryCode=IN"
    );
    setCities(
      Array.isArray(data)
        ? data.map((c) => ({ value: c.name, label: c.name }))
        : []
    );
  };

  useEffect(() => {
    fetchSkills();
    fetchCities();
  }, []);

  // ---------------- FETCH CANDIDATES BASED ON FILTERS ----------------
  useEffect(() => {
    const fetchFilteredCandidates = async () => {
      if (!selectedSkill && !selectedCity) {
        setCandidates([]);
        return;
      }

      setLoading(true);

      let query = "/api/recruiter/candidate?";
      if (selectedSkill) query += `role=${selectedSkill.value}&`;
      if (selectedCity) query += `location=${selectedCity.value}&`;

      const data = await safeFetchJson(query);

      const normalized = Array.isArray(data)
        ? data.map((r) => ({
            apply_id: r.apply_id ?? null,
            candidate_id: r.seeker_id ?? null,
            candidate_name: r.name ?? "Unknown",
            job_id: r.jobId ?? null,
            role_name: r.role_name ?? "—",
            location: r.location ?? "—",
            education: r.education ?? "—",
            date: r.date ?? r.job_apply_date ?? "—",
          }))
        : [];

      setCandidates(normalized);
      setLoading(false);
    };

    fetchFilteredCandidates();
  }, [selectedSkill, selectedCity]);

  return (
    <>
      <Navbar />
      <Topbar />

      <div
        style={{
          paddingTop: "175px",
          minHeight: "100vh",
          paddingBottom: "40px",
          background: "linear-gradient(135deg, #f5f8ff 0%, #ebf1ff 100%)",
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: "90%",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "14px",
            padding: "25px",
            border: "1px solid #e6e9f2",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* HEADER + FILTERS */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5
              className="fw-bold"
              style={{ fontSize: "22px", color: "#05264e", margin: 0 }}
            >
              Candidates List
            </h5>

            <div className="d-flex gap-3">
              <div style={{ width: "250px" }}>
                <Select
                  options={skills}
                  value={selectedSkill}
                  onChange={setSelectedSkill}
                  placeholder="Search Skill..."
                  isClearable
                />
              </div>

              <div style={{ width: "250px" }}>
                <Select
                  options={cities}
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder="Search Location..."
                  isClearable
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ overflowX: "auto" }}>
            <table
              className="table table-hover text-center align-middle"
              style={{ width: "100%", minWidth: "1100px" }}
            >
              <thead className="table-light">
                <tr>
                  <th style={headerStyle}>SL</th>
                  <th style={headerStyle}>NAME</th>
                  <th style={headerStyle}>ROLE</th>
                  <th style={headerStyle}>LOCATION</th>
                  <th style={headerStyle}>EDUCATION</th>
                  <th style={headerStyle}>DATE</th>
                </tr>
              </thead>

              <tbody style={{ fontSize: "14px" }}>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-3 fw-bold text-primary">
                      Loading...
                    </td>
                  </tr>
                ) : candidates.length ? (
                  candidates.map((c, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <Link
                          href={`/recruiter/candidate-detail/${c.job_id}/${c.candidate_id}`}
                          style={{
                            color: "#007bff",
                            textDecoration: "none",
                            fontWeight: "500",
                          }}
                        >
                          {c.candidate_name}
                        </Link>
                      </td>
                      <td>{c.role_name}</td>
                      <td>{c.location}</td>
                      <td>{c.education}</td>
                      <td>{c.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-3 text-danger fw-bold">
                      No candidates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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

const headerStyle = {
  backgroundColor: "transparent",
  fontSize: "14px",
  color: "rgba(93, 106, 126, 0.6)",
  fontWeight: "700",
};

export default CandidatesSearch;
