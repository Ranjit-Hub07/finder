"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import useRecruiterGuard from "@/hooks/useRecruiterGuard";
const RecruterProfile = () => {
  useRecruiterGuard();
  const router = useRouter();

  const [formData, setFormData] = useState({
    company_name: "",
    designation: "",
    company_starting_year: "",
    achievement_year: "",
    address: "",
    city: "",
    pin_code: "",
    country: "",
    state: "",
    about_company: "",
    why_choose_us: "",
    email: "",
    company_logo: "",
    company_banner: "",
  });

  const [companyBanner, setCompanyBanner] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [years, setYears] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [profileFetched, setProfileFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [packageData, setPackageData] = useState(null);

  // ------------------------------
  // PROFILE COMPLETION (for the meter)
  // ------------------------------
  const profileCompletion = useMemo(() => {
    const keysToCheck = [
      "company_name",
      "designation",
      "company_starting_year",
      "address",
      "city",
      "country",
      "state",
      "pin_code",
      "about_company",
      "why_choose_us",
    ];

    const filled = keysToCheck.filter(
      (k) => formData[k] && String(formData[k]).trim() !== ""
    ).length;

    return Math.round((filled / keysToCheck.length) * 100) || 0;
  }, [formData]);

  // ------------------------------
  // YEARS
  // ------------------------------
  useEffect(() => {
    const thisYear = new Date().getFullYear();
    setYears(Array.from({ length: 40 }, (_, i) => (thisYear - i).toString()));
  }, []);

  // ------------------------------
  // COUNTRIES
  // ------------------------------
  useEffect(() => {
    fetch("/api/recruiter/location/countries")
      .then((res) => res.json())
      .then((data) => {
        const mappedCountries = Array.isArray(data)
          ? data.map((country) => ({ name: country.name, iso2: country.iso2 }))
          : [];
        setCountries(mappedCountries);
      });
  }, []);

  // ------------------------------
  // PACKAGE
  // ------------------------------
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch("/api/subscriptions/active", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        const pkg = Array.isArray(data) ? data[0] : data;
        setPackageData(pkg);
      } catch (err) {
        console.error("Failed to fetch package details", err);
      }
    };
    fetchPackage();
  }, []);

  // ------------------------------
  // FETCH EXISTING PROFILE
  // ------------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/recruiter/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Fetch failed");
          return;
        }

        const data = await res.json();

        const countryMatch = countries.find(
          (c) =>
            data.country?.toLowerCase().includes(c.name.toLowerCase()) ||
            c.iso2.toLowerCase() === data.country?.toLowerCase()
        );
        const updatedCountry = countryMatch?.iso2 || "";

        let fetchedStates = [];
        if (updatedCountry) {
          const stateRes = await fetch(
            `/api/recruiter/location/states?countryCode=${updatedCountry}`
          );
          const stateData = await stateRes.json();
          fetchedStates = stateData.map((s) => ({ name: s.name, iso2: s.iso2 }));
          setStates(fetchedStates);
        }

        const stateMatch = fetchedStates.find(
          (s) =>
            data.state?.toLowerCase().includes(s.name.toLowerCase()) ||
            s.iso2.toLowerCase() === data.state?.toLowerCase()
        );
        const updatedState = stateMatch?.iso2 || "";

        let fetchedCities = [];
        if (updatedCountry) {
          const cityRes = await fetch(
            `/api/recruiter/location/cities?countryCode=${updatedCountry}`
          );
          const cityData = await cityRes.json();
          fetchedCities = cityData.map((c) => ({ name: c.name }));
          setCities(fetchedCities);
        }

        setFormData((prev) => ({
          ...prev,
          ...data,
          country: updatedCountry,
          state: updatedState,
          city: data.city,
        }));

        // 🔹 Store logo in localStorage for Navbar avatar
        if (data.company_logo) {
          try {
            const logoPath = data.company_logo.startsWith("/image")
              ? data.company_logo
              : `/image/recruiters/logos/${data.company_logo}`;
            localStorage.setItem("recruiter_logo", logoPath);
            window.dispatchEvent(
              new CustomEvent("profile-updated", { detail: null })
            );
          } catch (e) {
            console.warn("Could not store recruiter_logo", e);
          }
        }

        setProfileFetched(true);
      } catch (err) {
        console.error("Failed to fetch recruiter profile", err);
      }
    };

    if (countries.length > 0 && !profileFetched) {
      fetchProfile();
    }
  }, [countries, profileFetched]);

  // ------------------------------
  // LOAD STATES + CITIES WHEN COUNTRY CHANGES
  // ------------------------------
  useEffect(() => {
    if (formData.country) {
      fetch(`/api/recruiter/location/states?countryCode=${formData.country}`)
        .then((res) => res.json())
        .then((data) => {
          const mappedStates = Array.isArray(data)
            ? data.map((state) => ({ name: state.name, iso2: state.iso2 }))
            : [];
          setStates(mappedStates);
        });

      fetch(`/api/recruiter/location/cities?countryCode=${formData.country}`)
        .then((res) => res.json())
        .then((data) => {
          const mappedCities = Array.isArray(data)
            ? data.map((city) => ({ name: city.name }))
            : [];
          setCities(mappedCities);
        });
    }
  }, [formData.country]);

  // ------------------------------
  // HANDLERS
  // ------------------------------
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const allowedTypes = ["image/jpeg", "image/png"];
    if (
      (companyBanner && !allowedTypes.includes(companyBanner.type)) ||
      (companyLogo && !allowedTypes.includes(companyLogo.type))
    ) {
      alert("Only JPG and PNG files are allowed for logo and banner.");
      setLoading(false);
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value || "");
    });
    if (companyLogo) form.append("company_logo", companyLogo);
    if (companyBanner) form.append("company_banner", companyBanner);

    try {
      const res = await fetch("/api/recruiter/profile", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Profile update failed");

      // 🔥 Update recruiter logo instantly for Navbar (uses API response)
      try {
        const profileFromApi = result.profile || {};
        let newLogoPath =
          profileFromApi.company_logo || formData.company_logo || "";

        // If backend already returns full "/image/..." path, keep as-is
        if (newLogoPath && !newLogoPath.startsWith("/image")) {
          newLogoPath = `/image/recruiters/logos/${newLogoPath}`;
        }

        if (newLogoPath) {
          localStorage.setItem("recruiter_logo", newLogoPath);
          setFormData((prev) => ({
            ...prev,
            company_logo: newLogoPath,
          }));
          window.dispatchEvent(
            new CustomEvent("userUpdated", { detail: null })
          );
          window.dispatchEvent(
            new CustomEvent("profile-updated", { detail: null })
          );
        }
      } catch (e) {
        console.warn("Could not update recruiter_logo/profile-updated", e);
      }

      alert(result.message || "Profile updated successfully");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // RENDER
  // ------------------------------
  const companyNameDisplay = formData.company_name || "Your Company Name";
  const cityDisplay = formData.city || "City";
  const countryObj = countries.find((c) => c.iso2 === formData.country);
  const countryDisplay = countryObj?.name || "Country";

  return (
    <>
      <Navbar />
      <div
        style={{
          paddingTop: "170px",
          paddingBottom: "60px",
          background:
            "radial-gradient(circle at top left, #e0ebff 0, #f7f9ff 40%, #ffffff 100%)",
        }}
      >
        <Container style={{ maxWidth: "1300px" }}>
          {/* HERO HEADER CARD */}
          <div className="mb-4">
            <div
              className="rounded-4 shadow-sm p-4 p-md-4 position-relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 40%, #6366f1 70%, #22c1c3 100%)",
                color: "white",
              }}
            >
              {/* Ambient circles */}
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.35), transparent 60%)",
                  opacity: 0.9,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -60,
                  left: -40,
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)",
                }}
              />

              <div className="position-relative">
                <Row className="align-items-center g-3">
                  <Col md={8}>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: 52,
                          height: 52,
                          backgroundColor: "rgba(255,255,255,0.14)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <i className="bi bi-building fs-4" />
                      </div>
                      <div>
                        <div
                          style={{
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                            letterSpacing: "0.08em",
                            opacity: 0.85,
                          }}
                        >
                          Recruiter dashboard
                        </div>
                        <h3
                          className="mb-0"
                          style={{ fontWeight: 700, letterSpacing: "0.01em" }}
                        >
                          {companyNameDisplay}
                        </h3>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
                      <span style={{ fontSize: "0.9rem", opacity: 0.95 }}>
                        <i className="bi bi-geo-alt-fill me-2" />
                        {cityDisplay}, {countryDisplay}
                      </span>

                      <span
                        className="px-3 py-1 rounded-pill"
                        style={{
                          backgroundColor: "rgba(15,23,42,0.16)",
                          fontSize: "0.8rem",
                        }}
                      >
                        <i className="bi bi-person-workspace me-2" />
                        {formData.designation || "Your designation"}
                      </span>
                    </div>
                  </Col>

                  <Col
                    md={4}
                    className="mt-3 mt-md-0 d-flex flex-column align-items-md-end align-items-start gap-2"
                  >
                    {/* Profile completion */}
                    <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                      Profile completion
                    </div>
                    <div className="w-100" style={{ maxWidth: 220 }}>
                      <div className="d-flex justify-content-between mb-1">
                        <span style={{ fontSize: "0.8rem" }}>
                          {profileCompletion}%
                        </span>
                        <span style={{ fontSize: "0.8rem" }}>
                          {profileCompletion < 60
                            ? "Keep going"
                            : profileCompletion < 90
                            ? "Almost there"
                            : "Great!"}
                        </span>
                      </div>
                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${profileCompletion}%`,
                            background:
                              "linear-gradient(90deg, #a5b4fc, #f97316)",
                          }}
                          aria-valuenow={profileCompletion}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>

                    {packageData && (
                      <span
                        className="mt-2 px-3 py-1 rounded-pill d-inline-flex align-items-center"
                        style={{
                          backgroundColor: "rgba(15,23,42,0.16)",
                          fontSize: "0.78rem",
                        }}
                      >
                        <i className="bi bi-lightning-charge-fill me-2" />
                        Active plan:{" "}
                        <strong className="ms-1">
                          {packageData.package_name ||
                            packageData.package_id ||
                            "Current Package"}
                        </strong>
                      </span>
                    )}
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN LAYOUT */}
          <Row className="g-4">
            {/* LEFT: PROFILE FORM */}
            <Col lg={8}>
              <div className="bg-white rounded-4 shadow-sm border p-4 p-md-4">
                {/* Section: Company details */}
                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{
                      width: 6,
                      height: 30,
                      borderRadius: 12,
                      background:
                        "linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)",
                      marginRight: 10,
                    }}
                  />
                  <h5 className="mb-0" style={{ fontWeight: 600 }}>
                    Company details
                  </h5>
                </div>
                <p className="text-muted mb-3" style={{ fontSize: "0.85rem" }}>
                  This information appears at the top of your company profile.
                </p>

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="company_name">
                        <Form.Label className="fw-semibold">
                          Company Name
                        </Form.Label>
                        <Form.Control
                          value={formData.company_name || ""}
                          onChange={handleChange}
                          placeholder="Finder Technologies Pvt Ltd"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="designation">
                        <Form.Label className="fw-semibold">
                          Your Designation
                        </Form.Label>
                        <Form.Control
                          value={formData.designation || ""}
                          onChange={handleChange}
                          placeholder="HR Manager / Founder / Recruiter"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group controlId="company_starting_year">
                        <Form.Label className="fw-semibold">
                          Company Starting Year
                        </Form.Label>
                        <Form.Select
                          value={formData.company_starting_year || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="achievement_year">
                        <Form.Label className="fw-semibold">
                          Achievement Year (optional)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.achievement_year || ""}
                          onChange={handleChange}
                          placeholder="e.g. 2024"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Section: Location */}
                  <hr className="my-4" />
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        width: 6,
                        height: 30,
                        borderRadius: 12,
                        background:
                          "linear-gradient(180deg, #f97316 0%, #e11d48 100%)",
                        marginRight: 10,
                      }}
                    />
                    <h5 className="mb-0" style={{ fontWeight: 600 }}>
                      Office location
                    </h5>
                  </div>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="country">
                        <Form.Label className="fw-semibold">
                          Country
                        </Form.Label>
                        <Form.Select
                          value={formData.country || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select country</option>
                          {countries.map((c) => (
                            <option key={c.iso2} value={c.iso2}>
                              {c.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="state">
                        <Form.Label className="fw-semibold">State</Form.Label>
                        <Form.Select
                          value={formData.state || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select state</option>
                          {states.map((s) => (
                            <option key={s.iso2} value={s.iso2}>
                              {s.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="city">
                        <Form.Label className="fw-semibold">City</Form.Label>
                        <Form.Select
                          value={formData.city || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select city</option>
                          {Array.from(new Set(cities.map((c) => c.name))).map(
                            (cityName) => (
                              <option key={cityName} value={cityName}>
                                {cityName}
                              </option>
                            )
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="pin_code">
                        <Form.Label className="fw-semibold">
                          Pin Code
                        </Form.Label>
                        <Form.Control
                          value={formData.pin_code || ""}
                          onChange={handleChange}
                          placeholder="e.g. 751001"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={12}>
                      <Form.Group controlId="address">
                        <Form.Label className="fw-semibold">
                          Full Address
                        </Form.Label>
                        <Form.Control
                          value={formData.address || ""}
                          onChange={handleChange}
                          placeholder="Office address, building, street"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Section: About company */}
                  <hr className="my-4" />
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        width: 6,
                        height: 30,
                        borderRadius: 12,
                        background:
                          "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
                        marginRight: 10,
                      }}
                    />
                    <h5 className="mb-0" style={{ fontWeight: 600 }}>
                      Company story
                    </h5>
                  </div>

                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Group controlId="about_company">
                        <Form.Label className="fw-semibold">
                          About your company
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={formData.about_company || ""}
                          onChange={handleChange}
                          placeholder="Describe your mission, culture and what you do..."
                        />
                        <Form.Text className="text-muted">
                          This is visible to candidates on your company profile.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={12}>
                      <Form.Group controlId="why_choose_us">
                        <Form.Label className="fw-semibold">
                          Why should candidates choose you?
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={formData.why_choose_us || ""}
                          onChange={handleChange}
                          placeholder="Highlight perks, work culture, learning, etc."
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Section: Branding */}
                  <hr className="my-4" />
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        width: 6,
                        height: 30,
                        borderRadius: 12,
                        background:
                          "linear-gradient(180deg, #ec4899 0%, #a855f7 100%)",
                        marginRight: 10,
                      }}
                    />
                    <h5 className="mb-0" style={{ fontWeight: 600 }}>
                      Branding & media
                    </h5>
                  </div>

                  <Row className="mb-3">
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">
                        Current Banner
                      </Form.Label>
                      <div
                        className="border rounded-3 d-flex align-items-center justify-content-center bg-light"
                        style={{ height: 140, overflow: "hidden" }}
                      >
                        {formData.company_banner &&
                        typeof formData.company_banner === "string" ? (
                          <img
                            src={
                              formData.company_banner.startsWith("/image")
                                ? formData.company_banner
                                : `/image/recruiters/banners/${formData.company_banner}`
                            }
                            alt="Banner"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span className="text-muted" style={{ fontSize: 13 }}>
                            No banner uploaded
                          </span>
                        )}
                      </div>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">
                        Current Logo
                      </Form.Label>
                      <div
                        className="border rounded-3 d-flex align-items-center justify-content-center bg-light"
                        style={{ height: 140, overflow: "hidden" }}
                      >
                        {formData.company_logo &&
                        typeof formData.company_logo === "string" ? (
                          <img
                            src={
                              formData.company_logo.startsWith("/image")
                                ? formData.company_logo
                                : `/image/recruiters/logos/${formData.company_logo}`
                            }
                            alt="Logo"
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <span className="text-muted" style={{ fontSize: 13 }}>
                            No logo uploaded
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="company_banner">
                        <Form.Label className="fw-semibold">
                          Upload Banner{" "}
                          <span style={{ color: "red", fontSize: "0.8rem" }}>
                            (JPG / PNG)
                          </span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".jpg,.png"
                          onChange={(e) =>
                            setCompanyBanner(e.target.files[0] || null)
                          }
                        />
                        <Form.Text className="text-muted">
                          Recommended: 1200 × 300 px
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="company_logo">
                        <Form.Label className="fw-semibold">
                          Upload Logo{" "}
                          <span style={{ color: "red", fontSize: "0.8rem" }}>
                            (JPG / PNG)
                          </span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".jpg,.png"
                          onChange={(e) =>
                            setCompanyLogo(e.target.files[0] || null)
                          }
                        />
                        <Form.Text className="text-muted">
                          A square logo with transparent background looks best.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Save button */}
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2"
                      disabled={loading}
                      style={{ borderRadius: 999 }}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill me-2" />
                          Save changes
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              </div>
            </Col>

            {/* RIGHT: PACKAGE CARD */}
            <Col lg={4}>
              {packageData && (
                <div className="h-100">
                  <div
                    className="rounded-4 shadow-sm border overflow-hidden"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #22c1c3 100%)",
                        color: "white",
                        padding: "16px 18px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div
                            className="text-uppercase"
                            style={{
                              fontSize: "0.75rem",
                              letterSpacing: "0.08em",
                              opacity: 0.9,
                            }}
                          >
                            Active plan
                          </div>
                          <h5 className="mb-0 mt-1 fw-bold">
                            {packageData.package_name ||
                              packageData.package_id ||
                              "Current Package"}
                          </h5>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold fs-5">
                            ₹{packageData.price}
                          </div>
                          <div style={{ fontSize: "0.8rem" }}>
                            {packageData.duration} days
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 p-md-3">
                      <Row className="mb-2">
                        <Col xs={6} className="mb-2">
                          <div className="small text-muted">Expiry date</div>
                          <div className="fw-semibold">
                            {packageData.expiry_date || "-"}
                          </div>
                        </Col>
                        <Col xs={6} className="mb-2">
                          <div className="small text-muted">Job posts</div>
                          <div className="fw-semibold">
                            {packageData.job_post_count}
                          </div>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col xs={6} className="mb-2">
                          <div className="small text-muted">
                            Profile views
                          </div>
                          <div className="fw-semibold">
                            {packageData.profile_view_count}
                          </div>
                        </Col>
                        <Col xs={6} className="mb-2">
                          <div className="small text-muted">Emails</div>
                          <div className="fw-semibold">
                            {packageData.email_count}
                          </div>
                        </Col>
                      </Row>

                      <div className="mt-3">
                        <div
                          className="d-inline-flex align-items-center px-3 py-1 rounded-pill"
                          style={{
                            backgroundColor: "rgba(79,70,229,0.06)",
                            color: "#4f46e5",
                            fontSize: "0.8rem",
                          }}
                        >
                          <i className="bi bi-graph-up-arrow me-2" />
                          Use this plan to attract better talent
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
      <BackToTop/>
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

export default RecruterProfile;
