"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "@/components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "@/components/Footer";
import ProfileSnapshot from "./components/ProfileSnapshot";
import Skills from "./components/Skills";
import WorkHistory from "./components/WorkHistory";
import Projects from "./components/Projects";
import PersonalInfo from "./components/PersonalInfo";
import Languages from "./components/Languages";
import "bootstrap-icons/font/bootstrap-icons.css";
import BackToTop from "@/components/BackToTop";
import useSeekerGuard from "@/hooks/useSeekerGuard";

const ProfileLayout = () => {
  useSeekerGuard();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profileSnapshot");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 🔹 Avatar state
  const [profilePicBase, setProfilePicBase] = useState(
    "/image/seekers/Photos/default.png"
  );
  const [profilePicVersion, setProfilePicVersion] = useState(0);

  // 🔹 Photo Upload State
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  const showToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so selecting the same file triggers again if needed
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (JPEG, PNG, WebP).", "danger");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5MB.", "danger");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    setUploadingPhoto(true);
    try {
      const res = await fetch("/api/seeker/profile/photo", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile photo");
      }

      const newPhoto = data.photo;
      if (newPhoto) {
        localStorage.setItem("seeker_photo", newPhoto);
        setProfilePicBase(newPhoto);
        setProfilePicVersion((prev) => prev + 1);
        window.dispatchEvent(new CustomEvent("userUpdated"));
        window.dispatchEvent(new CustomEvent("profile-updated"));
        setRefreshTrigger((prev) => prev + 1);
      }

      showToast("Profile image updated successfully!", "success");
    } catch (err) {
      console.error("Photo upload error:", err);
      showToast(err.message || "Failed to update profile photo", "danger");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // -----------------------------------
  // FETCH USER
  // -----------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth fetch error:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // -----------------------------------
  // INITIAL PROFILE PHOTO
  // -----------------------------------
  useEffect(() => {
    if (!user) return;

    try {
      const stored = localStorage.getItem("seeker_photo");
      const base =
        stored ||
        user.photo ||
        "/image/seekers/Photos/default.png";

      setProfilePicBase(base);
      setProfilePicVersion((prev) => prev + 1);
    } catch (e) {
      const fallback = user.photo || "/image/seekers/Photos/default.png";
      setProfilePicBase(fallback);
      setProfilePicVersion((prev) => prev + 1);
    }
  }, [user]);

  // -----------------------------------
  // ✅ LIVE UPDATE: Avatar + Sidebar Completion
  // -----------------------------------
  useEffect(() => {
    const handleProfileUpdated = () => {
      try {
        const stored = localStorage.getItem("seeker_photo");
        if (stored) {
          setProfilePicBase(stored);
        }
        setProfilePicVersion((prev) => prev + 1);
        setRefreshTrigger((prev) => prev + 1);
      } catch (e) {
        console.warn("Could not update profilePic from localStorage", e);
      }
    };

    window.addEventListener("profile-updated", handleProfileUpdated);
    window.addEventListener("userUpdated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
      window.removeEventListener("userUpdated", handleProfileUpdated);
    };
  }, []);

  if (!user) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted fw-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  const fullName = user.name || user.full_name || "Job Seeker";
  const profilePic = `${profilePicBase}?v=${profilePicVersion}`;
  const location = user.location || "Location not specified";
  const email = user.email || "No email available";
  const phone = user.phone || "No contact available";

  const renderContent = () => {
    switch (activeSection) {
      case "skills":
        return <Skills onUpdated={() => setRefreshTrigger((prev) => prev + 1)} />;
      case "workHistory":
        return <WorkHistory onUpdated={() => setRefreshTrigger((prev) => prev + 1)} />;
      case "projects":
        return <Projects onUpdated={() => setRefreshTrigger((prev) => prev + 1)} />;
      case "personalInfo":
        return <PersonalInfo onUpdated={() => setRefreshTrigger((prev) => prev + 1)} />;
      case "languages":
        return <Languages onUpdated={() => setRefreshTrigger((prev) => prev + 1)} />;
      default:
        return (
          <ProfileSnapshot onUpdated={() => setRefreshTrigger((prev) => prev + 1)} />
        );
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "110px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Seeker Profile & Career Hub</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Keep your profile updated with recent skills and experience to maximize interview calls.
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">My Profile</span>
            </div>
          </Container>
        </div>

        {/* ⭐ Profile Showcase Container */}
        <Container className="py-4">
          {/* Profile Header Card */}
          <div
            className="bg-white rounded-4 p-4 mb-4 border"
            style={{
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
              borderColor: "#e2e8f0",
            }}
          >
            <div className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
              <div className="d-flex align-items-center gap-3">
                {/* Avatar with click-to-update and status/edit badge */}
                <div
                  className="position-relative flex-shrink-0"
                  style={{ cursor: uploadingPhoto ? "wait" : "pointer" }}
                  onMouseEnter={() => setIsAvatarHovered(true)}
                  onMouseLeave={() => setIsAvatarHovered(false)}
                  onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
                  title="Click to update profile photo"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      !uploadingPhoto && fileInputRef.current?.click();
                    }
                  }}
                >
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    style={{ display: "none" }}
                    onChange={handlePhotoChange}
                  />

                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: isAvatarHovered ? "3px solid #4f46e5" : "3px solid #e0e7ff",
                      background: "linear-gradient(135deg, #f5f8ff 0%, #ebf1ff 100%)",
                      boxShadow: isAvatarHovered
                        ? "0 6px 20px rgba(79, 70, 229, 0.3)"
                        : "0 4px 14px rgba(79, 70, 229, 0.15)",
                      transition: "all 0.2s ease-in-out",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={profilePic}
                      alt="Profile"
                      width={80}
                      height={80}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: isAvatarHovered ? "scale(1.06)" : "scale(1)",
                        transition: "transform 0.25s ease",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/100x100/CCCCCC/333333?text=User";
                      }}
                    />

                    {/* Hover overlay with camera icon */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(15, 23, 42, 0.55)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: isAvatarHovered && !uploadingPhoto ? 1 : 0,
                        transition: "opacity 0.2s ease",
                        color: "#ffffff",
                        pointerEvents: "none",
                      }}
                    >
                      <i className="bi bi-camera-fill" style={{ fontSize: "20px" }} />
                      <span style={{ fontSize: "10px", fontWeight: 600, marginTop: "2px" }}>
                        Update
                      </span>
                    </div>

                    {/* Uploading indicator */}
                    {uploadingPhoto && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(15, 23, 42, 0.75)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          zIndex: 2,
                        }}
                      >
                        <div
                          className="spinner-border text-light spinner-border-sm mb-1"
                          role="status"
                        />
                        <span style={{ fontSize: "9px", fontWeight: 600 }}>Saving...</span>
                      </div>
                    )}
                  </div>

                  {/* Camera edit badge on bottom-right */}
                  <div
                    className="position-absolute bottom-0 end-0 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                      width: "26px",
                      height: "26px",
                      backgroundColor: isAvatarHovered ? "#4338ca" : "#4f46e5",
                      color: "#ffffff",
                      border: "2px solid #ffffff",
                      transition: "all 0.2s ease",
                      transform: isAvatarHovered ? "scale(1.1)" : "scale(1)",
                    }}
                    title="Click to update photo"
                  >
                    <i className="bi bi-camera-fill" style={{ fontSize: "12px" }}></i>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <h4 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-0.3px" }}>
                      {fullName}
                    </h4>
                    <span
                      className="badge rounded-pill fw-semibold"
                      style={{
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        color: "#4f46e5",
                        fontSize: "12px",
                      }}
                    >
                      <i className="bi bi-patch-check-fill me-1"></i> Job Seeker
                    </span>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mt-1">
                    <span>
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {location}
                    </span>
                    <span>
                      <i className="bi bi-envelope-fill text-primary me-1"></i>
                      {email}
                    </span>
                    <span>
                      <i className="bi bi-telephone-fill text-success me-1"></i>
                      {phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="d-flex flex-wrap align-items-center gap-2">
                <Link
                  href="/job-listing"
                  className="btn btn-sm fw-semibold rounded-pill px-3 py-2 text-white shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                    border: "none",
                  }}
                >
                  <i className="bi bi-search me-1"></i> Browse Jobs
                </Link>

                <Link
                  href="/seeker/seeker-changepassword"
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2"
                >
                  <i className="bi bi-shield-lock me-1"></i> Security
                </Link>
              </div>
            </div>
          </div>

          {/* Main Grid Layout (Sidebar + Content) */}
          <Row className="g-4">
            <Col lg={4} xl={3}>
              <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                refreshTrigger={refreshTrigger}
              />
            </Col>

            <Col lg={8} xl={9}>
              <div
                className="bg-white p-4 p-md-5 rounded-4 border"
                style={{
                  boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
                  borderColor: "#e2e8f0",
                }}
              >
                {renderContent()}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
      <BackToTop />

      {/* Floating toast notification */}
      {toastMessage && (
        <div
          className={`position-fixed bottom-0 end-0 m-4 p-3 rounded-3 shadow-lg d-flex align-items-center gap-2 alert alert-${toastType === "success" ? "success" : "danger"} mb-0`}
          style={{ zIndex: 9999, transition: "all 0.3s ease" }}
        >
          <i
            className={`bi ${toastType === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} fs-5`}
          ></i>
          <span className="fw-medium">{toastMessage}</span>
          <button
            type="button"
            className="btn-close ms-2"
            onClick={() => setToastMessage("")}
            aria-label="Close"
          ></button>
        </div>
      )}

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

export default ProfileLayout;
