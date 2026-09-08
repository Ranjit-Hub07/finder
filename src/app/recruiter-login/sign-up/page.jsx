"use client";
import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RecruiterRegister() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1980; y--) years.push(y);

  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    company_name: "",
    current_designation: "",
    from_year: "",
    to_year: "",
    country: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    otp: "",
  });

  /* ------------------ LOCATION LOADERS ------------------ */
  useEffect(() => {
    fetch("/api/recruiter/location/countries")
      .then((r) => r.json())
      .then(setCountries)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!formData.country) return setStates([]);
    fetch(`/api/recruiter/location/states?countryCode=${formData.country}`)
      .then((r) => r.json())
      .then(setStates)
      .catch(console.error);
  }, [formData.country]);

  useEffect(() => {
    if (!formData.country) return setCities([]);
    fetch(`/api/recruiter/location/cities?countryCode=${formData.country}`)
      .then((r) => r.json())
      .then(setCities)
      .catch(console.error);
  }, [formData.country]);

  /* ------------------ INPUT HANDLER ------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "full_name" && !/^[A-Za-z ]*$/.test(value)) return;
    if (["phone", "pincode", "otp"].includes(name) && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setMessage("");
  };

  /* ------------------ SEND OTP ------------------ */
  const handleSendOtp = async () => {
    if (!formData.email) {
      setMessage("Please enter email first");
      setMessageType("error");
      return;
    }

    setSendingOtp(true);
    setMessage("");

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone || null,
          user_type: "recruiter",
          purpose: "register",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to send OTP");
        setMessageType("error");
        return;
      }

      setOtpSent(true);
      setMessage("OTP sent successfully");
      setMessageType("success");
    } catch {
      setMessage("Something went wrong while sending OTP");
      setMessageType("error");
    } finally {
      setSendingOtp(false);
    }
  };

  /* ------------------ VERIFY OTP ------------------ */
  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      setMessage("Please enter OTP");
      setMessageType("error");
      return;
    }

    setVerifyingOtp(true);
    setMessage("");

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone || null,
          otp: formData.otp,
          user_type: "recruiter",
          purpose: "register",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "OTP verification failed");
        setMessageType("error");
        return;
      }

      setOtpVerified(true);
      setMessage("OTP verified successfully");
      setMessageType("success");
    } catch {
      setMessage("OTP verification failed");
      setMessageType("error");
    } finally {
      setVerifyingOtp(false);
    }
  };

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setMessage("Please verify OTP first");
      setMessageType("error");
      return;
    }

    for (const key in formData) {
      if (!formData[key]) {
        setMessage("Please fill all required fields");
        setMessageType("error");
        return;
      }
    }

    if (formData.phone.length !== 10) {
      setMessage("Phone number must be exactly 10 digits");
      setMessageType("error");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/recruiter/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        setMessageType("error");
        return;
      }

      setMessage("Registration successful!");
      setMessageType("success");

      setTimeout(() => router.push("/recruiter-login"), 800);
    } catch {
      setMessage("Something went wrong");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  // validation flags to control progression between sections
  const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);
  const isPhoneValid = formData.phone && formData.phone.length === 10;
  const isNameValid = /^[A-Z][a-zA-Z ]*$/.test(formData.full_name);
  const isOtpEntered = !!formData.otp;

  const requiredFields = [
    "full_name",
    "email",
    "phone",
    "password",
    "company_name",
    "current_designation",
    "from_year",
    "to_year",
    "country",
    "state",
    "city",
    "address",
    "pincode",
  ];

  const areAllFieldsFilled = requiredFields.every((k) => !!formData[k]);

  // handle Enter key to progress through steps: send OTP -> verify -> submit
  const handleEnterKey = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    // If OTP not sent yet, try to send OTP when email and phone are valid
    if (!otpSent) {
      if (isNameValid && isEmailValid && isPhoneValid && !sendingOtp) {
        handleSendOtp();
        return;
      }

      // otherwise move focus to next input in a sensible order
      const order = [
        "full_name",
        "email",
        "phone",
        "password",
        "company_name",
        "current_designation",
        "from_year",
        "to_year",
        "address",
        "pincode",
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
        // if current field is full_name, ensure it starts with a capital letter
        if (e.target.name === "full_name" && !isNameValid) {
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

    // If OTP was sent but not verified, pressing Enter in OTP field should verify
    if (otpSent && !otpVerified) {
      if (formData.otp && !verifyingOtp) {
        handleVerifyOtp();
      }
      return;
    }

    // If OTP verified, Enter should submit when form is complete
    if (otpVerified) {
      if (!submitting && areAllFieldsFilled && isPhoneValid) {
        document.querySelector('.custom-submit-btn')?.click();
      }
    }
  };

  // show temporary shake and small message under the field
  const showFieldError = (el, msg) => {
    try {
      if (!el) return;
      el.classList.add("shake-invalid");
      el.style.borderColor = "#dc3545";

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
      console.error(err);
    }
  };


  const label = (text) => (
    <Form.Label>
      {text} <span className="text-danger">*</span>
    </Form.Label>
  );

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "100px" }}>
        <div
          style={{
            backgroundImage: 'url("/image/recruiter.png")',
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            backgroundColor: "#f3f3f3",
            minHeight: "100vh",
            paddingTop: "100px",
          }}
        >
          <Container>
            <Row>
              <Col md={6}>
                <div className="p-4">
                  <h6 className="text-primary text-center">Recruiter Registration Form</h6>
                  <h2 className="text-center fw-bold mb-3">Start for free Today</h2>

                  {message && (
                    <div
                      className={`mb-3 text-center fw-semibold ${
                        messageType === "error" ? "text-danger" : "text-success"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <Form onSubmit={handleSubmit} onKeyDown={handleEnterKey}>
                    <Form.Group className="mb-3">{label("Full Name")}
                      <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
                      {formData.full_name && !isNameValid && (
                        <small className="text-danger">Full name must start with a capital letter</small>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">{label("Email")}
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={otpSent}
                        required
                      />
                      {formData.email && !isEmailValid && (
                        <small className="text-danger">Please enter a valid email</small>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">{label("Phone")}
                      <Form.Control type="text" name="phone" maxLength={10} value={formData.phone} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">{label("Password")}
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="pe-5"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          title={showPassword ? "Hide password" : "Show password"}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#666",
                          }}
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">{label("Company Name")}
                      <Form.Control type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">{label("Current Designation")}
                      <Form.Control type="text" name="current_designation" value={formData.current_designation} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">{label("From Year")}
                      <Form.Select name="from_year" value={formData.from_year} onChange={handleChange} required>
                        <option value="">Select Year</option>
                        {years.map((year) => <option key={year} value={year}>{year}</option>)}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">{label("To Year")}
                      <Form.Select name="to_year" value={formData.to_year} onChange={handleChange} required>
                        <option value="">Select Year</option>
                        {years.map((year) => <option key={year} value={year}>{year}</option>)}
                      </Form.Select>
                    </Form.Group>

                    {/* COUNTRY / STATE / CITY SELECT */}
                    <Form.Group className="mb-3">{label("Country")}
                      <Select
                        instanceId="country-select"
                        options={countries.map((c) => ({ value: c.iso2, label: c.name }))}
                        value={formData.country ? { value: formData.country, label: countries.find(c => c.iso2 === formData.country)?.name } : null}
                        onChange={(selected) => setFormData(prev => ({ ...prev, country: selected?.value || "", state: "", city: "" }))}
                        isClearable
                        placeholder="Select Country"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">{label("State")}
                      <Select
                        instanceId="state-select"
                        options={states.map(s => ({ value: s.iso2, label: s.name }))}
                        value={formData.state ? { value: formData.state, label: states.find(s => s.iso2 === formData.state)?.name } : null}
                        onChange={(selected) => setFormData(prev => ({ ...prev, state: selected?.value || "", city: "" }))}
                        isClearable
                        placeholder="Select State"
                        isDisabled={!states.length}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">{label("City")}
                      <Select
                        instanceId="city-select"
                        options={cities.map(c => ({ value: c.name, label: c.name }))}
                        value={formData.city ? { value: formData.city, label: formData.city } : null}
                        onChange={(selected) => setFormData(prev => ({ ...prev, city: selected?.value || "" }))}
                        isClearable
                        placeholder="Select City"
                        isDisabled={!cities.length}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">{label("Address")}
                      <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">{label("Pincode")}
                      <Form.Control type="text" name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6} required />
                    </Form.Group>

                    {/* OTP */}
                    <Form.Group className="mb-3">{label("OTP")}
                      {!otpSent ? (
                        <>
                          <Button
                            variant="outline-primary"
                            className="w-100"
                            onClick={handleSendOtp}
                            disabled={sendingOtp || !isNameValid || !isEmailValid || !isPhoneValid}
                          >
                            {sendingOtp ? "Sending..." : "Send OTP"}
                          </Button>
                          {(!isNameValid || !isEmailValid || !isPhoneValid) && (
                            <small className="text-danger">Please enter a name starting with a capital letter, a valid email and 10-digit phone to send OTP</small>
                          )}
                        </>
                      ) : (
                        <Row>
                          <Col xs={8}>
                            <Form.Control
                              type="text"
                              name="otp"
                              value={formData.otp}
                              onChange={handleChange}
                              maxLength={6}
                              placeholder="Enter OTP"
                              disabled={otpVerified}
                            />
                          </Col>
                          <Col xs={4}>
                            <Button
                              variant="outline-success"
                              className="w-100"
                              onClick={handleVerifyOtp}
                              disabled={verifyingOtp || otpVerified || !isOtpEntered}
                            >
                              {otpVerified ? "Verified" : "Verify"}
                            </Button>
                          </Col>
                        </Row>
                      )}
                      {otpVerified && <small className="text-success">OTP verified ✔</small>}
                    </Form.Group>

                    {/* SUBMIT */}
                    <div className="mb-3 d-grid">
                      <button
                        type="submit"
                        className="btn custom-submit-btn"
                        disabled={submitting || !otpVerified || !areAllFieldsFilled || !isPhoneValid}
                      >
                        {submitting ? "Submitting..." : "Submit & Register"}
                      </button>
                    </div>

                    <div className="text-center">
                      Already have an account?{" "}
                      <a href="/recruiter-login" className="text-primary fw-medium">
                        SIGN IN
                      </a>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
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
             *:not(input):not(textarea):not(select) {
    caret-color: transparent !important;
  }

  input,
  textarea,
  select {
    caret-color: auto !important;
  }
        `}</style>
      </div>
    </>
  );
}
