"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Eye, EyeOff } from "lucide-react";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function SeekerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    job_type: "",
    industry: "",
    job_role: "",
    location: "",
    photo: "",
    resume: "",
    working: "",
    experience: "",
    passport: "",
    languages: "",
    dob: "",
    gender: "",
    qualification: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [cities, setCities] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const router = useRouter();

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch(`/api/recruiter/location/cities?countryCode=IN`);
        const data = await res.json();
        if (res.ok) setCities(data.map((city) => ({ value: city.name, label: city.name })));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCities();
  }, []);

  useEffect(() => {
    async function fetchQualifications() {
      try {
        const res = await fetch("/api/recruiter/job/education");
        const data = await res.json();
        if (res.ok) setQualifications(data.map((q) => ({ value: q.educ_id, label: q.educ_name })));
      } catch (err) {
        console.error(err);
      }
    }
    fetchQualifications();
  }, []);

  useEffect(() => {
    async function fetchIndustries() {
      try {
        const res = await fetch("/api/recruiter/job/job-industry");
        const data = await res.json();
        if (res.ok) setIndustries(data.map((ind) => ({ value: ind.indus_id, label: ind.indus_name })));
      } catch (err) {
        console.error(err);
      }
    }
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (!formData.industry) {
      setJobRoles([]);
      return;
    }
    const fetchRoles = async () => {
      try {
        const res = await fetch(`/api/recruiter/job/job-role?indus_id=${formData.industry}`);
        const data = await res.json();
        if (res.ok) setJobRoles(data.map((role) => ({ value: role.role_id, label: role.role_name })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoles();
  }, [formData.industry]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/language')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setLanguageOptions(Array.isArray(data) ? data.map((l) => ({ value: l, label: l })) : []);
      })
      .catch((err) => console.error('Failed to load languages', err));
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // reset OTP states like recruiter flow
    if (name === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setFormData((prev) => ({ ...prev, otp: "" }));
    }
    if (name === "otp") {
      setOtpVerified(false);
    }

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      // Resume: only allow PDF and DOC
      if (name === "resume") {
        const allowed = ["application/pdf", "application/msword"];
        const ok = allowed.includes(file.type) || /\.pdf$|\.doc$/i.test(file.name);
        if (!ok) {
          alert("Resume must be a PDF or DOC file");
          e.target.value = "";
          setFormData((prev) => ({ ...prev, [name]: "" }));
          return;
        }
      }

      // Photo: allow common image types (jpeg, png, webp)
      if (name === "photo") {
        const allowedImg = ["image/jpeg", "image/png", "image/webp"];
        const okImg = allowedImg.includes(file.type) || /\.(jpg|jpeg|png|webp)$/i.test(file.name);
        if (!okImg) {
          alert("Photo must be a JPG, PNG or WEBP image");
          e.target.value = "";
          setFormData((prev) => ({ ...prev, [name]: "" }));
          return;
        }
      }

      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      const newValue = name === "name" ? value.replace(/[^A-Za-z\s]/g, "") : value;
      setFormData((prev) => ({ ...prev, [name]: newValue }));
      // clear attempted submit when user edits fields
      setAttemptedSubmit(false);
    }
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prev) => ({ ...prev, [field]: selectedOption ? selectedOption.value : "" }));
  };

  // Send OTP (universal otp API)
  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter email first");
      return;
    }
    if (!isNameValid) {
      alert("Name must start with a capital letter");
      return;
    }

    try {
      setOtpSending(true);

      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          user_type: "seeker",
          purpose: "register",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setOtpVerified(false);
        alert("OTP sent to your email");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("OTP send failed");
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP (recruiter style)
  const handleVerifyOtp = async () => {
    if (!formData.email) {
      alert("Please enter email first");
      return;
    }
    if (!formData.otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setOtpVerifying(true);

      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          user_type: "seeker",
          purpose: "register",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpVerified(true);
        alert("OTP verified successfully");
      } else {
        setOtpVerified(false);
        alert(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      setOtpVerified(false);
      alert("OTP verification failed");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const canSubmit = otpVerified && areAllFieldsFilled && isPhoneValid;

    // If form not ready, show validation hints after user attempted to submit
    if (!canSubmit) {
      setAttemptedSubmit(true);
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      alert("Name can only contain alphabets and spaces.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    try {
      const form = new FormData();
      for (const key in formData) {
        const val = formData[key];
        if (Array.isArray(val)) {
          if (val.length) form.append(key, val.join(", "));
        } else if (val) {
          form.append(key, val);
        }
      }

      const res = await fetch("/api/seeker/register", { method: "POST", body: form });
      const result = await res.json();

      if (res.ok) {
        alert(result.message || "Registration successful!");
        router.push("/seeker-login");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  // validation flags to control progression between steps
  const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);
  const isPhoneValid = formData.phone && formData.phone.length === 10;
  const isNameValid = /^[A-Z][a-zA-Z ]*$/.test(formData.name);
  const isOtpEntered = !!formData.otp;

  const requiredFields = [
    "name",
    "email",
    "phone",
    "password",
    "address",
    "job_type",
    "industry",
    "job_role",
    "location",
    "photo",
    "resume",
    "languages",
    "dob",
    "qualification",
  ];

  const areAllFieldsFilled = requiredFields.every((k) => {
    const v = formData[k];
    if (Array.isArray(v)) return v.length > 0;
    return !!v;
  });

  const missingFields = requiredFields.filter((k) => {
    const v = formData[k];
    if (Array.isArray(v)) return v.length === 0;
    return !v;
  });

  // handle Enter key to progress through steps: send OTP -> verify -> submit
  const handleEnterKey = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    if (!otpSent) {
      if (isNameValid && isEmailValid && isPhoneValid && !otpSending) {
        handleSendOtp();
        return;
      }

      const order = [
        "name",
        "email",
        "phone",
        "password",
        "address",
        "job_type",
        "industry",
        "job_role",
        "location",
        "languages",
        "dob",
        "qualification",
        "otp",
      ];
      const name = e.target.name;
      const idx = order.indexOf(name);
      if (idx >= 0 && idx < order.length - 1) {
        const currentVal = e.target && e.target.value;
        if (!currentVal || (typeof currentVal === "string" && currentVal.trim() === "")) {
          showFieldError(e.target, "Please fill this field");
          return;
        }
        // if current field is name, ensure it starts with a capital letter
        if (e.target.name === "name" && !isNameValid) {
          showFieldError(e.target, "Name must start with a capital letter");
          return;
        }
        // if current field is email, ensure it's valid before moving on
        if (e.target.name === "email" && !isEmailValid) {
          showFieldError(e.target, "Enter a valid email");
          return;
        }
        const nextName = order[idx + 1];
        const nextEl = document.querySelector(`[name="${nextName}"]`);
        if (nextEl) nextEl.focus();
      }
      return;
    }

    if (otpSent && !otpVerified) {
      if (formData.otp && !otpVerifying) handleVerifyOtp();
      return;
    }

    if (otpVerified) {
      if (!areAllFieldsFilled || !isPhoneValid || otpVerifying) return;
      document.querySelector('.custom-submit-btn')?.click();
    }
  };

  // show temporary shake and small message under the field
  const showFieldError = (el, msg) => {
    try {
      if (!el) return;
      el.classList.add("shake-invalid");
      el.style.borderColor = "#dc3545";

      // create message element next to the field if not already
      let hint = el.parentNode.querySelector(".enter-error-msg");
      if (!hint) {
        hint = document.createElement("small");
        hint.className = "enter-error-msg";
        hint.style.color = "#dc3545";
        hint.style.display = "block";
        hint.style.marginTop = "6px";
        el.parentNode.appendChild(hint);
      }
      hint.textContent = msg;

      setTimeout(() => {
        el.classList.remove("shake-invalid");
        el.style.borderColor = "";
        if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
      }, 1200);
    } catch (err) {
      // ignore DOM errors
      console.error(err);
    }
  };

  if (!hasMounted) return null;

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "50px" }}>
        <div
          style={{
            backgroundImage: 'url("/image/seeker-register.png")',
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            backgroundColor: "#f3f3f3",
            minHeight: "100vh",
            paddingTop: "100px",
          }}
        >
          <Container className="my-5">
            <Row>
              <Col md={6}>
                <div className="p-4">
                  <h6 className="text-primary text-center fw-medium">Seeker Registration Form</h6>
                  <h2 className="text-center fw-bold mb-4">Start for free Today</h2>

                  <form onSubmit={handleSubmit} encType="multipart/form-data" onKeyDown={handleEnterKey}>
                    {/* Name */}
                    <div className="mb-3">
                      <label className="form-label">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      {formData.name && !isNameValid && (
                        <small className="text-danger">Full name must start with a capital letter</small>
                      )}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        // recruiter style: lock email after otp sent
                        disabled={otpSent}
                      />
                      {formData.email && !isEmailValid && (
                        <small className="text-danger">Please enter a valid email</small>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                      <label className="form-label">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, "");
                          setFormData((prev) => ({ ...prev, phone: onlyNums }));
                        }}
                        maxLength={10}
                        required
                      />
                    </div>

                    {/* Password */}
<div className="mb-3">
  <label className="form-label">
    Password <span className="text-danger">*</span>
  </label>

  <div className="position-relative">
    <input
      type={showPassword ? "text" : "password"}
      className="form-control pe-5"
      name="password"
      value={formData.password}
      onChange={handleChange}
      required
    />

    <span
      onClick={() => setShowPassword(prev => !prev)}
      style={{
        position: "absolute",
        top: "50%",
        right: "12px",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#555",
      }}
      title={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
    </span>
  </div>
</div>

                    {/* Address */}
                    <div className="mb-3">
                      <label className="form-label">
                        Address <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="address"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    {/* Job Type */}
                    <div className="mb-3">
                      <label className="form-label">
                        Job Type <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={[
                          { value: "Contractual Jobs", label: "Contractual Jobs" },
                          { value: "Full Time", label: "Full Time" },
                          { value: "Government Job", label: "Government Job" },
                          { value: "Internship", label: "Internship" },
                          { value: "Part Time", label: "Part Time" },
                          { value: "Private Jobs", label: "Private Jobs" },
                          { value: "State Govt. Jobs", label: "State Govt. Jobs" },
                          { value: "Walk-In Jobs", label: "Walk-In Jobs" },
                          { value: "Work From Home", label: "Work From Home" },
                          { value: "Working In Abroad", label: "Working In Abroad" },
                        ]}
                        placeholder="Select Job Type"
                        isClearable
                        isSearchable
                        name="job_type"
                        onChange={(option) => handleSelectChange(option, "job_type")}
                      />
                    </div>

                    {/* Industry */}
                    <div className="mb-3">
                      <label className="form-label">
                        Job Industry <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={industries}
                        placeholder="Select Industry"
                        isClearable
                        isSearchable
                        name="industry"
                        onChange={(option) => handleSelectChange(option, "industry")}
                      />
                    </div>

                    {/* Job Role */}
                    <div className="mb-3">
                      <label className="form-label">
                        Job Role <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={jobRoles}
                        placeholder="Select Job Role"
                        isClearable
                        isSearchable
                        name="job_role"
                        onChange={(option) => handleSelectChange(option, "job_role")}
                      />
                    </div>

                    {/* City */}
                    <div className="mb-3">
                      <label className="form-label">
                        Location <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={cities}
                        placeholder="Select City"
                        isClearable
                        isSearchable
                        name="location"
                        onChange={(option) => handleSelectChange(option, "location")}
                      />
                    </div>

                    {/* Photo */}
                    <div className="mb-3">
                      <label className="form-label">
                        Upload Your Recent Photo <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        name="photo"
                        accept=".jpg,.jpeg,.webp"
                        onChange={handleChange}
                        required
                      />
                      <small className="form-text" style={{ color: "#f51818ff" }}>Accepted formats: JPG, PNG, WEBP. Required.</small>
                    </div>

                    {/* Resume */}
                    <div className="mb-3">
                      <label className="form-label">
                        Upload Your Resume <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        name="resume"
                        accept=".pdf,.doc"
                        onChange={handleChange}
                        required
                      />
                      <small className="form-text" style={{ color: "#f51710ff" }}>Accepted formats: PDF, DOC. Required.</small>
                    </div>

                    {/* Working Status */}
                    <div className="mb-3">
                      <label className="form-label">Are You Currently Working?</label>
                      <br />
                      <input type="radio" name="working" value="Yes" onChange={handleChange} /> Yes
                      <input type="radio" name="working" value="No" onChange={handleChange} className="ms-3" /> No
                    </div>

                    {/* Experience */}
                    <div className="mb-3">
                      <label className="form-label">Do You Have Experience?</label>
                      <br />
                      <input type="radio" name="experience" value="Yes" onChange={handleChange} /> Yes
                      <input type="radio" name="experience" value="No" onChange={handleChange} className="ms-3" /> No
                    </div>

                    {/* Passport */}
                    <div className="mb-3">
                      <label className="form-label">Do You Have Passport?</label>
                      <br />
                      <input type="radio" name="passport" value="Yes" onChange={handleChange} /> Yes
                      <input type="radio" name="passport" value="No" onChange={handleChange} className="ms-3" /> No
                    </div>

                    {/* Languages */}
                    <div className="mb-3">
                      <label className="form-label">
                        Which Languages Do You Know? <span className="text-danger">*</span>
                      </label>
                      <Select
                        isMulti
                        options={languageOptions}
                        value={Array.isArray(formData.languages) ? formData.languages.map((l) => ({ value: l, label: l })) : []}
                        onChange={(selected) => setFormData((prev) => ({ ...prev, languages: selected ? selected.map((s) => s.value) : [] }))}
                        isClearable
                        placeholder="Select languages"
                        name="languages"
                        isSearchable
                      />
                      {Array.isArray(formData.languages) && formData.languages.length === 0 && (
                        <small className="text-danger">Please select at least one language</small>
                      )}
                    </div>

                    {/* DOB */}
                    <div className="mb-3">
                      <label className="form-label">
                        Date Of Birth <span className="text-danger">*</span>
                      </label>
                      <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
                    </div>

                    {/* Gender */}
                    <div className="mb-3">
                      <label className="form-label">Please Select Your Gender</label>
                      <br />
                      <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male
                      <input type="radio" name="gender" value="Female" onChange={handleChange} className="ms-3" /> Female
                      <input type="radio" name="gender" value="Other" onChange={handleChange} className="ms-3" /> Other
                    </div>

                    {/* Qualification */}
                    <div className="mb-3">
                      <label className="form-label">
                        Highest Qualification <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={qualifications}
                        placeholder="Select Qualification"
                        isClearable
                        isSearchable
                        name="qualification"
                        onChange={(option) => handleSelectChange(option, "qualification")}
                      />
                    </div>

                    {/* ✅ OTP (Recruiter style: Send button then input+verify row) */}
                    <div className="mb-3">
                      <label className="form-label">
                        OTP <span className="text-danger">*</span>
                      </label>

                      {!otpSent ? (
                        <>
                              <button
                                type="button"
                                className="btn btn-outline-primary w-100"
                                onClick={handleSendOtp}
                                disabled={otpSending || !isNameValid || !isEmailValid || !isPhoneValid}
                              >
                                {otpSending ? "Sending..." : "Send OTP"}
                              </button>
                              {(!isNameValid || !isEmailValid || !isPhoneValid) && (
                                <small className="text-danger">Enter a name starting with a capital letter, a valid email and 10-digit phone to send OTP</small>
                              )}
                        </>
                      ) : (
                        <>
                          <div className="row g-2">
                            <div className="col-8">
                              <input
                                type="text"
                                className="form-control"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                maxLength={6}
                                placeholder="Enter OTP"
                                disabled={otpVerified}
                              />
                            </div>

                            <div className="col-4">
                              <button
                                type="button"
                                className="btn btn-outline-success w-100"
                                onClick={handleVerifyOtp}
                                disabled={otpVerifying || otpVerified || !isOtpEntered}
                              >
                                {otpVerified ? "Verified" : otpVerifying ? "Verifying..." : "Verify"}
                              </button>
                            </div>
                          </div>

                          {otpVerified && <small className="text-success">OTP verified ✔</small>}

                          {!otpVerified && (
                            <button
                              type="button"
                              className="btn btn-link p-0 mt-2"
                              onClick={handleSendOtp}
                              disabled={otpSending}
                            >
                              {otpSending ? "Resending..." : "Resend OTP"}
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    <div className="mb-3 d-grid">
                      <button
                        type="submit"
                        className={`btn custom-submit-btn${otpVerified && areAllFieldsFilled && isPhoneValid ? "" : " disabled"}`}
                        aria-disabled={!otpVerified || !areAllFieldsFilled || !isPhoneValid}
                        title={!otpVerified ? "Please verify OTP first" : !areAllFieldsFilled ? "Please fill all required fields" : !isPhoneValid ? "Phone must be 10 digits" : ""}
                      >
                        Submit & Register
                      </button>
                    </div>

                    {/* Diagnostic: show which required fields are missing only after user attempts to submit */}
                    {attemptedSubmit && (!otpVerified || !areAllFieldsFilled || !isPhoneValid) && (
                      <div className="mb-3">
                        <small style={{ color: "#dc3545" }}>
                          { !otpVerified && <div>• Please verify OTP first.</div> }
                          { !isPhoneValid && <div>• Phone must be 10 digits.</div> }
                          { missingFields.length > 0 && (
                            <div>
                              • Missing fields: {missingFields.join(", ")}
                            </div>
                          ) }
                        </small>
                      </div>
                    )}

                    <div className="text-center">
                      Already have an account?{" "}
                      <a href="/seeker-login" className="text-primary fw-medium">
                        SIGN IN
                      </a>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .custom-submit-btn {
          background-color: #05264e;
          padding: 14px 0;
          font-size: 16px;
          border: none;
          color: #fff;
        }
        .custom-submit-btn:hover {
          background-color: #4f46e5;
        }
      `}</style>

      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .shake-invalid {
          animation: shake 0.4s ease;
        }
        .enter-error-msg {
          font-size: 12px;
          color: #dc3545;
        }
      `}</style>

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
}
