"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

// Desktop Dropdown Component
const DesktopDropdown = ({
  label,
  options,
  selectedOptions,
  setSelectedOptions,
  isOpen,
  setOpenDropdown,
  handleSearch,
  isCity = false,
  alignRight = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef(null);

  const filtered = options.filter((opt) => {
    const value = isCity ? opt.name : opt;
    return (value || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleOption = (option) => {
    const value = isCity ? option.name : option;
    const current = Array.isArray(selectedOptions) ? selectedOptions : [];
    setSelectedOptions(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const handleClickOutside = useCallback(
    (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    },
    [setOpenDropdown]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  const handleReset = () => {
    setSelectedOptions([]);
    setOpenDropdown(null);
    handleSearch();
  };

  const hasSelected = Array.isArray(selectedOptions) && selectedOptions.length > 0;

  return (
    <div className="position-relative" ref={ref} style={{ flexShrink: 0 }}>
      <button
        type="button"
        className={`btn filter-pill-btn d-inline-flex align-items-center gap-1 ${
          hasSelected ? "active-filter" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setOpenDropdown(isOpen ? null : label);
        }}
        style={{
          fontSize: "13.5px",
          fontWeight: hasSelected ? "600" : "500",
          backgroundColor: hasSelected ? "#eff6ff" : "#ffffff",
          color: hasSelected ? "#2563eb" : "#475569",
          border: hasSelected ? "1px solid #3b82f6" : "1px solid #cbd5e1",
          borderRadius: "20px",
          padding: "6px 14px",
          transition: "all 0.2s ease",
          boxShadow: hasSelected ? "0 2px 6px rgba(59, 130, 246, 0.15)" : "none",
        }}
      >
        <span>{label}</span>
        {hasSelected && (
          <span
            className="badge rounded-pill bg-primary text-white ms-1"
            style={{ fontSize: "11px", padding: "3px 6px" }}
          >
            {selectedOptions.length}
          </span>
        )}
        <i
          className="bi bi-chevron-down ms-1"
          style={{
            fontSize: "11px",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        ></i>
      </button>

      {isOpen && (
        <div
          className="dropdown-menu p-3 show shadow-lg"
          style={{
            display: "block",
            position: "absolute",
            top: "calc(100% + 6px)",
            left: alignRight ? "auto" : 0,
            right: alignRight ? 0 : "auto",
            width: "260px",
            maxWidth: "90vw",
            borderRadius: "14px",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            maxHeight: "360px",
            overflow: "hidden",
            zIndex: 1060,
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.15)",
          }}
        >
          {/* Search Box */}
          <div className="mb-2 position-relative">
            <i
              className="bi bi-search position-absolute text-muted"
              style={{
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12px",
              }}
            ></i>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={`Search ${label}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered.length > 0) {
                  toggleOption(filtered[0]);
                  e.preventDefault();
                }
              }}
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "13px",
                paddingLeft: "30px",
              }}
            />
          </div>

          {/* Options List */}
          <div
            style={{
              maxHeight: "210px",
              overflowY: "auto",
              paddingRight: "2px",
            }}
          >
            {filtered.length === 0 ? (
              <div className="text-muted small text-center py-3">No matching options</div>
            ) : (
              filtered.map((opt) => {
                const val = isCity ? opt.name : opt;
                const isChecked = Array.isArray(selectedOptions) && selectedOptions.includes(val);
                return (
                  <div
                    key={val}
                    className="d-flex align-items-center gap-2 px-2 py-1.5 rounded-2 mb-1"
                    style={{
                      cursor: "pointer",
                      backgroundColor: isChecked ? "rgba(59, 130, 246, 0.1)" : "transparent",
                      transition: "background-color 0.15s ease",
                    }}
                    onClick={() => toggleOption(opt)}
                  >
                    <input
                      type="checkbox"
                      id={`desk-${label}-${val}`}
                      checked={isChecked}
                      readOnly
                      style={{
                        width: "16px",
                        height: "16px",
                        margin: 0,
                        padding: 0,
                        cursor: "pointer",
                        accentColor: "#2563eb",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "13.5px",
                        cursor: "pointer",
                        fontWeight: isChecked ? "600" : "400",
                        color: isChecked ? "#1d4ed8" : "#334155",
                        userSelect: "none",
                        lineHeight: "1.3",
                      }}
                    >
                      {val}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Dropdown Action Footer */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-secondary text-decoration-none fw-semibold"
              onClick={handleReset}
              style={{ fontSize: "12.5px" }}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm px-3 rounded-pill fw-semibold text-white shadow-sm"
              onClick={() => {
                setOpenDropdown(null);
                handleSearch();
              }}
              style={{
                fontSize: "12.5px",
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                border: "none",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Touch-Friendly Mobile Bottom Sheet Modal
const MobileFilterSheet = ({
  categoryConfigs,
  activeCategoryLabel,
  setActiveCategoryLabel,
  onClose,
  handleSearch,
  resetAll,
}) => {
  const currentCategory =
    categoryConfigs.find((c) => c.label === activeCategoryLabel) ||
    categoryConfigs[0];

  const [searchTerm, setSearchTerm] = useState("");

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const filteredOptions = currentCategory.options.filter((opt) => {
    const val = currentCategory.isCity ? opt.name : opt;
    return (val || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleOption = (option) => {
    const val = currentCategory.isCity ? option.name : option;
    const current = Array.isArray(currentCategory.selected) ? currentCategory.selected : [];
    if (current.includes(val)) {
      currentCategory.setSelected(current.filter((v) => v !== val));
    } else {
      currentCategory.setSelected([...current, val]);
    }
  };

  const handleClearCategory = () => {
    currentCategory.setSelected([]);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="mobile-filter-backdrop"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
        }}
      />

      {/* Slide-Up Bottom Sheet */}
      <div
        className="mobile-filter-sheet"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "88vh",
          backgroundColor: "#ffffff",
          borderTopLeftRadius: "22px",
          borderTopRightRadius: "22px",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.25)",
          animation: "slideUpSheet 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Drag Pill */}
        <div className="d-flex justify-content-center pt-2 pb-1">
          <div
            style={{
              width: "42px",
              height: "4px",
              backgroundColor: "#cbd5e1",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Sheet Header */}
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <i className={`bi ${currentCategory.icon || "bi-funnel"} text-primary fs-5`}></i>
            <div>
              <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "16px" }}>
                Filter by {currentCategory.label}
              </h6>
              {currentCategory.selected.length > 0 && (
                <span className="text-primary small fw-semibold">
                  {currentCategory.selected.length} selected
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={onClose}
            style={{ width: "36px", height: "36px", border: "1px solid #e2e8f0" }}
          >
            <i className="bi bi-x-lg text-secondary" style={{ fontSize: "14px" }}></i>
          </button>
        </div>

        {/* Category Switcher Tabs */}
        <div
          className="d-flex gap-2 px-3 py-2 border-bottom overflow-x-auto"
          style={{
            backgroundColor: "#f8fafc",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {categoryConfigs.map((cat) => {
            const isTabActive = cat.label === currentCategory.label;
            const hasCount = cat.selected.length > 0;
            return (
              <button
                key={cat.label}
                type="button"
                className={`btn btn-sm rounded-pill text-nowrap flex-shrink-0 d-inline-flex align-items-center gap-1 ${
                  isTabActive ? "btn-primary text-white" : "btn-outline-secondary bg-white text-secondary"
                }`}
                onClick={() => {
                  setActiveCategoryLabel(cat.label);
                  setSearchTerm("");
                }}
                style={{
                  fontSize: "12px",
                  padding: "4px 12px",
                  borderColor: isTabActive ? "#4f46e5" : "#cbd5e1",
                  background: isTabActive
                    ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                    : "#ffffff",
                }}
              >
                <span>{cat.label}</span>
                {hasCount && (
                  <span
                    className={`badge rounded-pill ${
                      isTabActive ? "bg-white text-primary" : "bg-primary text-white"
                    }`}
                    style={{ fontSize: "10px", padding: "2px 5px" }}
                  >
                    {cat.selected.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="p-3 pb-2">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0 ps-0"
              placeholder={`Search ${currentCategory.label}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: "14px", height: "42px" }}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => setSearchTerm("")}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Options List */}
        <div
          className="flex-grow-1 px-3 overflow-y-auto"
          style={{
            WebkitOverflowScrolling: "touch",
            maxHeight: "45vh",
          }}
        >
          {filteredOptions.length === 0 ? (
            <div className="text-center text-muted py-4">No matching options found</div>
          ) : (
            filteredOptions.map((opt) => {
              const val = currentCategory.isCity ? opt.name : opt;
              const isChecked = currentCategory.selected.includes(val);
              return (
                <div
                  key={val}
                  className="d-flex align-items-center justify-content-between p-3 border-bottom rounded-3 mb-1"
                  style={{
                    cursor: "pointer",
                    minHeight: "48px",
                    backgroundColor: isChecked ? "#f0f7ff" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                  onClick={() => toggleOption(opt)}
                >
                  <span
                    style={{
                      fontSize: "14.5px",
                      fontWeight: isChecked ? "600" : "400",
                      color: isChecked ? "#1e40af" : "#1e293b",
                    }}
                  >
                    {val}
                  </span>
                  <div
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: "22px",
                      height: "22px",
                      border: isChecked ? "2px solid #2563eb" : "2px solid #cbd5e1",
                      backgroundColor: isChecked ? "#2563eb" : "#ffffff",
                    }}
                  >
                    {isChecked && <i className="bi bi-check text-white fw-bold fs-6"></i>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-3 border-top bg-white d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary w-50 py-2 rounded-pill fw-semibold"
            style={{ fontSize: "14px", height: "46px" }}
            onClick={handleClearCategory}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn btn-primary w-50 py-2 rounded-pill fw-semibold text-white shadow"
            style={{
              fontSize: "14px",
              height: "46px",
              background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
              border: "none",
            }}
            onClick={() => {
              onClose();
              handleSearch();
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

const FilterBar = ({ onApply }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cityOptions, setCityOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [jobRoleOptions, setJobRoleOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState([]);
  const [selectedJobRole, setSelectedJobRole] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hasLoadedParams, setHasLoadedParams] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtersData = {
    experience: ["0-1", "1-3", "3-5", "5-10", "10-20"],
    salary: [
      "5000-10000 INR",
      "10000-20000 INR",
      "20000-30000 INR",
      "30000-50000 INR",
      "50000-100000 INR",
    ],
    jobType: [
      "Contractual Jobs",
      "Full Time",
      "Government Job",
      "Internship",
      "Part Time",
      "Private Jobs",
      "State Govt. Jobs",
      "Walk-In Jobs",
      "Work From Home",
      "Working In Abroad",
    ],
  };

  const categoryConfigs = [
    {
      label: "Location",
      icon: "bi-geo-alt-fill",
      options: cityOptions,
      isCity: true,
      selected: selectedLocation,
      setSelected: setSelectedLocation,
    },
    {
      label: "Experience",
      icon: "bi-briefcase-fill",
      options: filtersData.experience,
      isCity: false,
      selected: selectedExperience,
      setSelected: setSelectedExperience,
    },
    {
      label: "Salary",
      icon: "bi-cash-stack",
      options: filtersData.salary,
      isCity: false,
      selected: selectedSalary,
      setSelected: setSelectedSalary,
    },
    {
      label: "Education",
      icon: "bi-mortarboard-fill",
      options: educationOptions.map((e) => e.educ_name),
      isCity: false,
      selected: selectedEducation,
      setSelected: setSelectedEducation,
    },
    {
      label: "Industry",
      icon: "bi-buildings-fill",
      options: industryOptions.map((i) => i.indus_name),
      isCity: false,
      selected: selectedIndustry,
      setSelected: setSelectedIndustry,
    },
    {
      label: "Job Role",
      icon: "bi-person-badge-fill",
      options: jobRoleOptions.map((r) => r.role_name),
      isCity: false,
      selected: selectedJobRole,
      setSelected: setSelectedJobRole,
    },
    {
      label: "Job Type",
      icon: "bi-clock-history",
      options: filtersData.jobType,
      isCity: false,
      selected: selectedJobType,
      setSelected: setSelectedJobType,
    },
  ];

  const totalActiveFilters = categoryConfigs.reduce(
    (acc, cat) => acc + (cat.selected?.length || 0),
    0
  );

  const getArrayParam = (params, key) => {
    const all = params.getAll(key);
    if (all.length > 0) return all;
    const single = params.get(key);
    return single ? [single] : [];
  };

  const handleSearch = async () => {
    const findId = (arr, nameKey, value) => {
      const found = arr.find((item) => item[nameKey] === value);
      if (!found) return undefined;
      const idKey = Object.keys(found).find((key) => key.endsWith("_id"));
      return found[idKey];
    };

    const educationIds = selectedEducation
      .map((name) => findId(educationOptions, "educ_name", name))
      .filter(Boolean);

    const industryIds = selectedIndustry
      .map((name) => findId(industryOptions, "indus_name", name))
      .filter(Boolean);

    const jobRoleIds = selectedJobRole
      .map((name) => findId(jobRoleOptions, "role_name", name))
      .filter(Boolean);

    const filters = {
      location: selectedLocation,
      experience: selectedExperience,
      salary: selectedSalary,
      education: educationIds,
      industry: industryIds,
      jobRole: jobRoleIds,
      jobType: selectedJobType,
      keyword,
    };

    const hasFilters = Object.values(filters).some((v) =>
      Array.isArray(v) ? v.length > 0 : !!v
    );

    if (!hasFilters) {
      router.push("/job-listing");
      onApply([], false);
      return;
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => params.append(key, val));
      } else if (value) {
        params.set(key, value);
      }
    });

    router.push(`/job-listing?${params.toString()}`);

    try {
      const res = await axios.post("/api/recruiter/job/filter-job", filters);
      onApply(res.data || [], true);
    } catch (err) {
      console.error("Filter fetch error:", err);
      onApply([], true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, industriesRes, educationRes, rolesRes] =
          await Promise.all([
            axios.get("/api/recruiter/location/cities?countryCode=IN"),
            axios.get("/api/recruiter/job/job-industry"),
            axios.get("/api/recruiter/job/education"),
            axios.get("/api/recruiter/job/job-role"),
          ]);

        const uniqueCities = Array.from(
          new Map(citiesRes.data.map((c) => [c.name, c])).values()
        );
        setCityOptions(uniqueCities);
        setIndustryOptions(industriesRes.data || []);
        setEducationOptions(educationRes.data || []);
        setJobRoleOptions(rolesRes.data || []);
      } catch (err) {
        console.error("Filter options fetch failed", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!hasLoadedParams) {
      const params = new URLSearchParams(searchParams.toString());

      setSelectedLocation(getArrayParam(params, "location"));
      setSelectedExperience(getArrayParam(params, "experience"));
      setSelectedSalary(getArrayParam(params, "salary"));
      setSelectedEducation(getArrayParam(params, "education"));
      setSelectedIndustry(getArrayParam(params, "industry"));
      setSelectedJobRole(getArrayParam(params, "jobRole"));
      setSelectedJobType(getArrayParam(params, "jobType"));
      setKeyword(params.get("keyword") || "");

      setHasLoadedParams(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (hasLoadedParams) {
      handleSearch();
    }
  }, [hasLoadedParams]);

  const resetAll = () => {
    setSelectedLocation([]);
    setSelectedExperience([]);
    setSelectedSalary([]);
    setSelectedEducation([]);
    setSelectedIndustry([]);
    setSelectedJobRole([]);
    setSelectedJobType([]);
    setKeyword("");
    onApply([], false);
    router.push("/job-listing");
  };

  const handleMobilePillClick = (label) => {
    setOpenDropdown(label);
  };

  return (
    <>
      <div
        className="filter-bar-container d-flex gap-2 align-items-center shadow-sm"
        style={{
          background: "#FFEFE6",
          zIndex: 1020,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          position: "relative",
        }}
      >
        {/* On Mobile: "All Filters" Button with Active Count Badge */}
        <div className="d-lg-none flex-shrink-0">
          <button
            type="button"
            className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill shadow-sm"
            onClick={() => setOpenDropdown("All Filters")}
            style={{
              fontSize: "13px",
              fontWeight: "600",
              background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
              border: "none",
            }}
          >
            <i className="bi bi-sliders"></i>
            <span>All Filters</span>
            {totalActiveFilters > 0 && (
              <span
                className="badge rounded-pill bg-white text-primary ms-1"
                style={{ fontSize: "10.5px", padding: "2px 6px" }}
              >
                {totalActiveFilters}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Dropdowns or Mobile Filter Pills */}
        {categoryConfigs.map((cat, idx) => {
          if (isMobile) {
            const hasSelected = cat.selected.length > 0;
            return (
              <button
                key={cat.label}
                type="button"
                className={`btn filter-pill-btn d-inline-flex align-items-center gap-1 flex-shrink-0 ${
                  hasSelected ? "active-filter" : ""
                }`}
                onClick={() => handleMobilePillClick(cat.label)}
                style={{
                  fontSize: "13px",
                  fontWeight: hasSelected ? "600" : "500",
                  backgroundColor: hasSelected ? "#eff6ff" : "#ffffff",
                  color: hasSelected ? "#2563eb" : "#475569",
                  border: hasSelected ? "1px solid #3b82f6" : "1px solid #cbd5e1",
                  borderRadius: "20px",
                  padding: "5px 12px",
                  boxShadow: hasSelected ? "0 2px 6px rgba(59, 130, 246, 0.15)" : "none",
                }}
              >
                <span>{cat.label}</span>
                {hasSelected && (
                  <span
                    className="badge rounded-pill bg-primary text-white ms-1"
                    style={{ fontSize: "10.5px", padding: "2px 5px" }}
                  >
                    {cat.selected.length}
                  </span>
                )}
              </button>
            );
          }

          // Desktop
          return (
            <DesktopDropdown
              key={cat.label}
              label={cat.label}
              options={cat.options}
              selectedOptions={cat.selected}
              setSelectedOptions={cat.setSelected}
              isOpen={openDropdown === cat.label}
              setOpenDropdown={setOpenDropdown}
              handleSearch={handleSearch}
              isCity={cat.isCity}
              alignRight={idx >= 4}
            />
          );
        })}

        {/* Action Buttons: Reset All & Back */}
        <div className="ms-auto d-flex align-items-center gap-2 flex-shrink-0">
          {totalActiveFilters > 0 && (
            <button
              type="button"
              className="btn btn-link text-decoration-none py-1 px-2 text-danger fw-semibold"
              style={{ fontSize: "13px" }}
              onClick={resetAll}
            >
              Reset All
            </button>
          )}
          <button
            type="button"
            className="btn btn-light btn-sm px-3 py-1 border rounded-pill d-none d-sm-inline-block"
            onClick={() => router.push("/jobs")}
            style={{ fontSize: "13px" }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Mobile Touch-Friendly Bottom Sheet Modal */}
      {isMobile && openDropdown && (
        <MobileFilterSheet
          categoryConfigs={categoryConfigs}
          activeCategoryLabel={
            openDropdown === "All Filters" ? categoryConfigs[0].label : openDropdown
          }
          setActiveCategoryLabel={setOpenDropdown}
          onClose={() => setOpenDropdown(null)}
          handleSearch={handleSearch}
          resetAll={resetAll}
        />
      )}

      {/* Global CSS for Filterbar */}
      <style jsx global>{`
        /* Mobile: swipeable horizontal pill bar with hidden scrollbar */
        @media (max-width: 991px) {
          .filter-bar-container {
            overflow-x: auto !important;
            white-space: nowrap;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding: 8px 12px;
          }
          .filter-bar-container::-webkit-scrollbar {
            display: none;
          }
        }

        /* Desktop: visible overflow so dropdowns float without being clipped */
        @media (min-width: 992px) {
          .filter-bar-container {
            overflow: visible !important;
            flex-wrap: wrap;
            padding: 10px 20px;
          }
        }

        @keyframes slideUpSheet {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default FilterBar;
