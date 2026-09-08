"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";

const Package = () => {
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchActivePlan();
  }, []);

  // ⭐ Fetch Plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get("/api/plans?group=PSP");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ⭐ Fetch Active Subscription
  const fetchActivePlan = async () => {
    try {
      const res = await axios.get("/api/subscriptions/active");
      if (res.data?.plan_id) {
        setActivePlanId(res.data.plan_id);
      }
    } catch (err) {
      console.log("No active plan");
    }
  };

  // ⭐ Buy Now / Activate Plan
  const handleBuyNow = async (planId) => {
    try {
      const res = await axios.post("/api/subscriptions", {
        plan_id: planId,
      });

      if (res.data.subscription) {
        alert("Subscription Activated Successfully!");
        setActivePlanId(planId);
      }
    } catch (error) {
      console.error("Buy Now Error:", error);

      if (error.response?.status === 401) {
        alert("Please login again. Your session expired.");
      } else {
        alert("Failed to activate subscription.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <Head>
        <title>Packages | Finder</title>
      </Head>

      {/* ⭐ Page Wrapper */}
      <div
        style={{
          paddingTop: "110px",
          minHeight: "100vh",
          paddingBottom: "50px",
          backgroundColor: "#f8fafc",
        }}
      >
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Recruitment Packages</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Choose the right subscription plan to post jobs and access verified candidates.
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">Packages</span>
            </div>
          </Container>
        </div>

        {/* ⭐ Cards Section */}
        <Container className="d-flex justify-content-center flex-wrap my-5">
          {plans.map((plan) => {
            const discount = Math.round(
              ((plan.mrp_inr - plan.price_inr) / plan.mrp_inr) * 100
            );

            const isActive = activePlanId === plan.id;
            const isDiamond =
              (plan.name || "").toLowerCase().trim() === "diamond";
            const isRecommended = plan.is_recommended || isDiamond;

            return (
              <div
                key={plan.id}
                style={{
                  width: "350px",
                  borderRadius: "15px",
                  boxShadow: isRecommended
                    ? "0 0 12px 2px rgba(255,165,0,0.8)"
                    : "0 8px 20px rgba(0, 0, 0, 0.15)",
                  margin: "20px",
                  background: "#7b75f8",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  border: isRecommended ? "2px solid #ffcc00" : "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-10px) scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(0,0,0,0.25), 0 0 18px rgba(255,200,0,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = isRecommended
                    ? "0 0 12px 2px rgba(255,165,0,0.8)"
                    : "0 8px 20px rgba(0, 0, 0, 0.15)";
                }}
              >
                {/* ⭐ ACTIVE GREEN TAG */}
                {isActive && (
  <div
    style={{
      position: "absolute",
      top: "0",
      left: "0",
      width: "120px",
      height: "120px",
      overflow: "hidden",
      zIndex: 20,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "14px",
        left: "-35px",
        width: "180px",
        background: "#28a745",
        color: "white",
        textAlign: "center",
        fontWeight: "700",
        fontSize: "17px",
        padding: "8px 0",
        transform: "rotate(-45deg)",
        boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
      }}
    >
      ACTIVE
    </div>

    {/* folded corner shadow */}
    <div
      style={{
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "0",
        height: "0",
        borderLeft: "60px solid rgba(0,0,0,0.2)",
        borderTop: "60px solid transparent",
        transform: "rotate(0deg)",
      }}
    />
  </div>
)}


                {/* ⭐ Recommended Ribbon */}
                {isRecommended && (
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "orange",
                      color: "white",
                      textAlign: "center",
                      fontWeight: "600",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="bi bi-star-fill" />
                    RECOMMENDED
                  </div>
                )}

                {/* ⭐ Card Header */}
                <div style={{ textAlign: "center", padding: "30px 20px" }}>
                  <h2 className="mb-2">
                    <i className="bi bi-gem me-2" />
                    {plan.name}
                  </h2>

                  <p>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        textDecoration: "line-through",
                        marginRight: "5px",
                      }}
                    >
                      <i className="bi bi-tag me-1" />
                      ₹{plan.mrp_inr}
                    </span>{" "}
                    {discount}% Off
                  </p>

                  <h1 style={{ fontSize: "26px", fontWeight: "700" }}>
                    <i className="bi bi-currency-rupee me-1" />
                    {plan.price_inr}{" "}
                    <span style={{ fontSize: "16px" }}>
                      <i className="bi bi-clock-history me-1 ms-1" />
                      {plan.duration_days} Days
                    </span>
                  </h1>

                  <p className="text-muted small mb-1">
                    <i className="bi bi-receipt-cutoff me-1" />
                    excluding
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      margin: "10px 0",
                    }}
                  >
                    [SGST 9%, CGST 9%, IGST 0%]
                  </p>
                </div>

                {/* ⭐ Middle Feature Section */}
                <div
                  style={{
                    backgroundColor: "#f7f7f7",
                    padding: "30px 20px",
                    textAlign: "center",
                    transform: "skewY(-6deg)",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ transform: "skewY(6deg)" }}>
                    <p style={{ color: "#333", margin: "5px 0" }}>
                      <i className="bi bi-briefcase-fill me-2 text-primary" />
                      Job Post - {plan.job_post_limit}
                    </p>
                    <p style={{ color: "#333", margin: "5px 0" }}>
                      <i className="bi bi-people-fill me-2 text-success" />
                      Profile Views - {plan.contact_limit}
                    </p>
                    <p style={{ color: "#333", margin: "5px 0" }}>
                      <i className="bi bi-envelope-fill me-2 text-danger" />
                      Emailers - {plan.email_limit}
                    </p>
                  </div>
                </div>

                {/* ⭐ Footer */}
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "#7b75f8",
                  }}
                >
                  <button
                    onClick={() => handleBuyNow(plan.id)}
                    disabled={activePlanId === plan.id}
                    style={{
                      backgroundColor:
                        activePlanId === plan.id ? "#550c72" : "#ffcc00",
                      color: activePlanId === plan.id ? "white" : "#333",
                      fontWeight: "600",
                      borderRadius: "25px",
                      padding: "12px 30px",
                      border: "none",
                      marginTop: "10px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      cursor:
                        activePlanId === plan.id ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {activePlanId === plan.id ? (
                      <>
                        <i className="bi bi-patch-check-fill" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lightning-charge-fill" />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
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

export default Package;
