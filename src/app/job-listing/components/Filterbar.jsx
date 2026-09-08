"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
const DropdownWithApply = ({
  label,
  options,
  selectedOptions,
  setSelectedOptions,
  isOpen,
  setOpenDropdown,
  handleSearch,
  isCity = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef(null);

  const filtered = options.filter((opt) => {
    const value = isCity ? opt.name : opt;
    return value.toLowerCase().includes(searchTerm.toLowerCase());
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
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  const handleReset = () => {
    setSelectedOptions([]);
    setOpenDropdown(null);
    handleSearch();
  };

  return (
    <div className="position-relative" ref={ref}>
      <button
        className="btn dropdown-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setOpenDropdown(isOpen ? null : label);
        }}
        style={{
          textAlign: "left",
          fontSize: "14px",
          backgroundColor: "#fff",
          color: "#777",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "6px 12px",
          minWidth: "100px",
        }}
      >
        {label}{" "}
        {Array.isArray(selectedOptions) && selectedOptions.length
          ? `(${selectedOptions.length})`
          : ""}
      </button>

      {isOpen && (
        <div
          className="dropdown-menu p-3 show shadow"
          style={{
            display: "block",
            width: "200px",
            borderRadius: "12px",
            backgroundColor: "#fff",
            maxHeight: "340px",
            overflow: "hidden",
            zIndex: 1050,
          }}
        >
          <input
            type="text"
            className="form-control mb-2"
            placeholder={`🔍 Search ${label}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered.length > 0) {
                toggleOption(filtered[0]);
                e.preventDefault();
              }
            }}
            style={{
              border: "1px solid #3b82f6",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />

          <div style={{ maxHeight: "220px", overflowY: "auto" }}>
            {filtered.map((opt) => {
              const val = isCity ? opt.name : opt;
              return (
                <div className="form-check" key={val}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${label}-${val}`}
                    checked={
                      Array.isArray(selectedOptions) &&
                      selectedOptions.includes(val)
                    }
                    onChange={() => toggleOption(opt)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${label}-${val}`}
                  >
                    {val}
                  </label>
                </div>
              );
            })}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-link p-0" onClick={handleReset}>
              Reset
            </button>
            <button
              className="btn btn-primary btn-sm px-3"
              onClick={() => {
                setOpenDropdown(null);
                handleSearch();
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

  const getArrayParam = (params, key) => {
    const all = params.getAll(key);
    if (all.length > 0) return all;
    const single = params.get(key);
    return single ? [single] : [];
  };

  const handleSearch = async () => {
    // Fixed findId function to avoid reference error
    const findId = (arr, nameKey, value) => {
      const found = arr.find((item) => item[nameKey] === value);
      if (!found) return undefined;
      const idKey = Object.keys(found).find((key) => key.endsWith("_id"));
      return found[idKey];
    };

    // Convert selected names → IDs
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

  return (
    <div
  className="d-flex flex-wrap gap-2 px-3 py-3 border-bottom shadow-sm"
  style={{
    background: "#FFEFE6",
    zIndex: 999,
    minHeight: "40px",   // ⬅️ Increase height here
    alignItems: "center", // ⬅️ Vertically align items nicely
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",  
    position: "relative",
  }}
>

      <DropdownWithApply
        label="Location"
        options={cityOptions}
        selectedOptions={selectedLocation}
        setSelectedOptions={setSelectedLocation}
        isOpen={openDropdown === "Location"}
        setOpenDropdown={setOpenDropdown}
        isCity
        handleSearch={handleSearch}
      />
      <DropdownWithApply
        label="Experience"
        options={filtersData.experience}
        selectedOptions={selectedExperience}
        setSelectedOptions={setSelectedExperience}
        isOpen={openDropdown === "Experience"}
        setOpenDropdown={setOpenDropdown}
        handleSearch={handleSearch}
      />
      <DropdownWithApply
        label="Salary"
        options={filtersData.salary}
        selectedOptions={selectedSalary}
        setSelectedOptions={setSelectedSalary}
        isOpen={openDropdown === "Salary"}
        setOpenDropdown={setOpenDropdown}
        handleSearch={handleSearch}
      />
      <DropdownWithApply
        label="Education"
        options={educationOptions.map((e) => e.educ_name)}
        selectedOptions={selectedEducation}
        setSelectedOptions={setSelectedEducation}
        isOpen={openDropdown === "Education"}
        setOpenDropdown={setOpenDropdown}
        handleSearch={handleSearch}
      />
      <DropdownWithApply
        label="Industry"
        options={industryOptions.map((i) => i.indus_name)}
        selectedOptions={selectedIndustry}
        setSelectedOptions={setSelectedIndustry}
        isOpen={openDropdown === "Industry"}
        setOpenDropdown={setOpenDropdown}
        handleSearch={handleSearch}
      />
      <DropdownWithApply
        label="Job Role"
        options={jobRoleOptions.map((r) => r.role_name)}
        selectedOptions={selectedJobRole}
        setSelectedOptions={setSelectedJobRole}
        isOpen={openDropdown === "Job Role"}
        setOpenDropdown={setOpenDropdown}
        handleSearch={handleSearch}
      />
      <DropdownWithApply
        label="Job Type"
        options={filtersData.jobType}
        selectedOptions={selectedJobType}
        setSelectedOptions={setSelectedJobType}
        isOpen={openDropdown === "Job Type"}
        setOpenDropdown={setOpenDropdown}
        handleSearch={handleSearch}
      />

      <div className="ms-auto d-flex align-items-center gap-2">
        <button className="btn btn-link text-decoration-none" onClick={resetAll}>
          Reset All
        </button>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/jobs")}
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
