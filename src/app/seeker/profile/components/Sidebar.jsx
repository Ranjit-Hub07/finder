"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  FaUserCircle,
  FaLightbulb,
  FaBriefcase,
  FaGlobe,
  FaIdCard,
  FaLanguage,
  FaSpinner,
} from "react-icons/fa";

// Sidebar tabs
const tabs = [
  { name: "Profile Snapshot", section: "profileSnapshot", icon: <FaUserCircle /> },
  { name: "Skills & Expertise", section: "skills", icon: <FaLightbulb /> },
  { name: "Work History", section: "workHistory", icon: <FaBriefcase /> },
  { name: "Featured Projects", section: "projects", icon: <FaGlobe /> },
  { name: "Personal Details", section: "personalInfo", icon: <FaIdCard /> },
  { name: "Languages Known", section: "languages", icon: <FaLanguage /> },
];

const Sidebar = ({ activeSection, setActiveSection, refreshTrigger }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateCompletion = (data) => {
    if (!data || typeof data !== "object") return 0;
    const keys = Object.keys(data);
    const total = keys.length;
    const completed = keys.filter((key) => Boolean(data[key])).length;
    return total ? Math.round((completed / total) * 100) : 0;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seeker/profile/completion", {
        cache: "no-store",
      });
      const json = await res.json();
      setProfileData(json.profileData);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5 bg-white rounded-4 border">
        <FaSpinner className="spinner-border text-primary" />
        <span className="ms-2 text-muted fw-semibold">Loading...</span>
      </div>
    );
  }

  const profileCompletion = calculateCompletion(profileData);

  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (profileCompletion / 100) * circumference;

  return (
    <div className="d-flex flex-column gap-3">
      {/* Navigation Tabs Card */}
      <div
        className="bg-white rounded-4 p-3 border"
        style={{
          boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
          borderColor: "#e2e8f0",
        }}
      >
        <div className="d-flex flex-column gap-2">
          {tabs.map((tab, index) => {
            const isActive = tab.section === activeSection;
            return (
              <button
                key={index}
                onClick={() => setActiveSection(tab.section)}
                className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 w-100 text-start border-0 ${
                  isActive ? "text-white shadow-sm" : "text-secondary bg-transparent"
                }`}
                style={{
                  fontSize: "14.5px",
                  fontWeight: isActive ? "600" : "500",
                  background: isActive
                    ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                    : "transparent",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.06)";
                    e.currentTarget.style.color = "#4f46e5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#64748b";
                  }
                }}
              >
                <span style={{ fontSize: "16px", color: isActive ? "#fff" : "#6366f1" }}>
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Completion Card */}
      <div
        className="bg-white rounded-4 p-4 border text-center"
        style={{
          boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
          borderColor: "#e2e8f0",
        }}
      >
        <div className="position-relative d-inline-block mx-auto mb-2">
          <svg width="116" height="116">
            <circle
              stroke="#e2e8f0"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx="58"
              cy="58"
            />
            <circle
              stroke="url(#completionGradient)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              r={normalizedRadius}
              cx="58"
              cy="58"
              style={{
                transition: "stroke-dashoffset 1s ease",
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
            <defs>
              <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div
            className="position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center justify-content-center"
            style={{ width: "100%", height: "100%" }}
          >
            <span className="fw-bold fs-4" style={{ color: "#0f172a" }}>
              {profileCompletion}%
            </span>
          </div>
        </div>

        <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: "15px" }}>
          Profile Strength
        </h6>
        <p className="text-muted small mb-0" style={{ fontSize: "12.5px" }}>
          {profileCompletion >= 80
            ? "Your profile is in great shape! Employers can easily discover you."
            : "Complete all sections to rank higher in recruiter searches."}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
