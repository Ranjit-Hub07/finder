"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { auto } from "@popperjs/core";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarUpdateKey, setAvatarUpdateKey] = useState(0); // used to force avatar reload
  const router = useRouter();

  // ---------------------------
  // FETCH SUBSCRIPTION
  // ---------------------------
  useEffect(() => {
    if (!user) {
      setSubscription(null);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const res = await fetch("/api/subscriptions/active", {
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch (err) {
        console.error("Subscription load failed:", err);
      }
    };

    fetchSubscription();

    const handleSubUpdate = () => fetchSubscription();
    window.addEventListener("subscriptionUpdated", handleSubUpdate);
    return () => window.removeEventListener("subscriptionUpdated", handleSubUpdate);
  }, [user]);

  // ---------------------------
  // FETCH USER + LISTEN EVENTS
  // ---------------------------
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
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const handleUserUpdate = (e) => {
      const updatedUser = e.detail;

      if (updatedUser) {
        // if you pass updated user from other pages
        setUser(updatedUser);
      } else {
        // fallback: refetch from backend
        fetchUser();
      }

      // force avatar refresh whenever event is fired
      setAvatarUpdateKey((prev) => prev + 1);
    };

    // listen to BOTH events
    window.addEventListener("userUpdated", handleUserUpdate);
    window.addEventListener("profile-updated", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
      window.removeEventListener("profile-updated", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  // LOGOUT
 const handleLogout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // ✅ MUST
      cache: "no-store",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }

  // ✅ CLEAR OLD USER DATA
  localStorage.clear();

  setUser(null);
  window.dispatchEvent(new Event("userUpdated"));

  // ✅ hard redirect is best after logout (ensures middleware runs clean)
  window.location.href = "/home";
};

  const getNameParts = (full) => {
    if (!full) return ["", ""];
    const parts = full.trim().split(" ");
    return [parts[0], parts.slice(1).join(" ")];
  };

  const [firstName, lastName] = user
    ? getNameParts(user.full_name || user.fullName || user.name || "")
    : ["", ""];

  const role = (user?.role || "recruiter").toLowerCase().trim();

  // AVATAR PATH (uses avatarUpdateKey as cache-buster)
 const avatarPath = () => {
  if (!user) return "/image/profile.png";

  const ts = avatarUpdateKey;

  if (role === "recruiter") {
    const logoPath = user.logo || "/image/profile.png";
    return `${logoPath}?uid=${user.id}&t=${ts}`;
  }

  if (role === "seeker") {
    const photoPath = user.photo || "/image/profile.png";
    return `${photoPath}?uid=${user.id}&t=${ts}`;
  }

  return "/image/default-avatar.png";
};

  const styles = {
    container: {
      backgroundColor: "#0b0f19",
      color: "#e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 15px",
      position: "fixed",
      top: "0px",
      left: "0px",
      height: "45px",
      width: "100%",
      zIndex: 1030,
      fontSize: "13.5px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    },
    contactInfo: {
      display: "flex",
      gap: "1.5rem",
      marginLeft: "8%",
    },
    socialIcons: {
      display: "flex",
      gap: "1rem",
      marginLeft: "auto",
      marginRight: "8%",
    },
    link: {
      color: "#cbd5e1",
      textDecoration: "none",
      transition: "all 0.25s ease",
    },
    icon: {
      marginRight: "0.4rem",
      color: "#38bdf8",
      transition: "all 0.25s ease",
    },
    navbar: {
      backgroundColor: "#ffffff",
      padding: "0 15px",
      height: "65px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      position: "fixed",
      top: "45px",
      left: "0px",
      zIndex: 1020,
      fontSize: "15px",
      boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
      borderBottom: "1px solid #e2e8f0",
    },
    navLink: {
      fontFamily: "var(--font-sans), sans-serif",
      margin: "0 14px",
      textDecoration: "none",
      color: "#1e293b",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.25s ease",
      fontSize: "14.5px",
    },
    mobileMenuIcon: {
      fontSize: "26px",
      cursor: "pointer",
      color: "#0f172a",
      transition: "all 0.25s ease",
    },
  };

  if (loading) return null;

  return (
    <>
      {/* ---- TOP BLUE BAR ---- */}
      <div style={styles.container}>
        <div style={styles.contactInfo}>
          <span className="no-hover-underline">
            <i className="bi bi-telephone" style={styles.icon} />
            <a href="tel:+917538057669" style={styles.link}>
              +91 7538057669
            </a>
          </span>
          <span className="no-hover-underline">
            <i className="bi bi-envelope" style={styles.icon} />
            <a href="mailto:job@finder.com" style={styles.link}>
              job@finder.com
            </a>
          </span>
        </div>

        <div style={styles.socialIcons}>
          {["youtube", "linkedin", "twitter", "facebook", "instagram"].map(
            (s) => (
              <a
                key={s}
                href="#"
                className="no-hover-underline"
                aria-label={s}
              >
                <i className={`bi bi-${s} text-light fs-5`} />
              </a>
            )
          )}
        </div>
      </div>

      <div style={styles.navbar}>
        <div className="container d-flex justify-content-between align-items-center">
          <Link href="/home" className="d-flex align-items-center text-decoration-none">
            <Image
              src="/image/finder_logo.svg"
              alt="Finder Logo"
              width={140}
              height={35}
              priority
              style={{
                cursor: "pointer",
                height: "35px",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          <div className="d-none d-md-flex align-items-center">
            <Link
              href={user && role === "recruiter" ? "/overview" : "/home"}
              className="hover-link"
              style={styles.navLink}
            >
              Home
            </Link>
            <Link href="/about-us" className="hover-link" style={styles.navLink}>
              About Us
            </Link>
            <Link
              href="/contact-us"
              className="hover-link"
              style={styles.navLink}
            >
              Contact Us
            </Link>
            <Link href="/blog" className="hover-link" style={styles.navLink}>
              Blogs
            </Link>
            {user && role === "recruiter" && (
              <Link
                href="/recruiter/package"
                className="hover-link"
                style={styles.navLink}
              >
                Package
              </Link>
            )}
          </div>

          {/* MOBILE MENU ICON */}
          <i
            className="bi bi-list d-md-none hover-link"
            style={styles.mobileMenuIcon}
            onClick={() => setIsMobileMenuOpen(true)}
          />

          {/* LOGIN BUTTONS */}
          {!user ? (
            <div className="d-none d-md-flex" style={{ gap: "15px" }}>
              <Link
                href="/recruiter-login"
                className="hover-link"
                style={{ ...styles.navLink, textDecoration: "underline" }}
              >
                Recruiter Login
              </Link>
              <Link
                href="/seeker-login"
                className="hover-link"
                style={{ ...styles.navLink, textDecoration: "underline" }}
              >
                Seeker Login
              </Link>
            </div>
          ) : (
            <Dropdown align="end" className="d-none d-md-block account-section">
              <Dropdown.Toggle
                variant="link"
                className="p-0 d-flex align-items-center gap-2 text-decoration-none hover-link"
                style={{ color: "#000" }}
              >
                <Image
                  key={avatarUpdateKey} // FORCE RELOAD
                  src={avatarPath()}
                  alt="User Avatar"
                  width={35}
                  height={35}
                  className="rounded-circle"
                  style={{ objectFit: "cover", width: "35px", height: "35px" }}
                />
                <span className="d-flex flex-column text-start lh-sm">
                  <span className="fw-semibold">{firstName}</span>
                  <span className="fw-semibold">{lastName}</span>
                  <small className="text-muted">Settings</small>
                </span>
                <i
                  className="bi bi-caret-down-fill ms-1"
                  style={{ fontSize: "0.8rem" }}
                ></i>
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  minWidth: "270px",
                  padding: "10px",
                  borderRadius: "14px",
                  boxShadow: "0 14px 34px -4px rgba(15, 23, 42, 0.16)",
                  border: "1px solid #e2e8f0",
                }}
              >
                {role === "recruiter" ? (
                  <>
                    {/* Active Subscription Banner */}
                    <div
                      className="px-3 py-2 mb-2 rounded-3"
                      style={{
                        background:
                          subscription?.has_active_subscription !== false &&
                          subscription?.package_name &&
                          subscription?.package_name !== "No Active Plan"
                            ? "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)"
                            : "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Subscription Plan
                        </span>
                        <span
                          className="badge"
                          style={{
                            background:
                              subscription?.has_active_subscription !== false &&
                              subscription?.package_name &&
                              subscription?.package_name !== "No Active Plan"
                                ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                                : "#94a3b8",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          {subscription?.package_name || "Free Plan"}
                        </span>
                      </div>
                      {subscription?.expiry_date ? (
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          Valid Till:{" "}
                          <span className="fw-semibold text-dark">
                            {subscription.expiry_date}
                          </span>
                        </div>
                      ) : (
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                          No active plan purchased
                        </div>
                      )}
                    </div>

                    {/* Post Remaining */}
                    <Dropdown.Item
                      href="/recruiter/job"
                      className="d-flex justify-content-between align-items-center py-2 px-3 rounded-2"
                      style={{ transition: "all 0.2s ease" }}
                    >
                      <span>
                        <i className="bi bi-file-earmark-plus me-2 text-primary"></i>
                        Post Remaining
                      </span>
                      <span
                        className="badge rounded-pill fw-bold"
                        style={{
                          backgroundColor:
                            (subscription?.posts_remaining ?? 0) > 0
                              ? "rgba(79, 70, 229, 0.12)"
                              : "rgba(239, 68, 68, 0.12)",
                          color:
                            (subscription?.posts_remaining ?? 0) > 0
                              ? "#4f46e5"
                              : "#ef4444",
                          fontSize: "11.5px",
                        }}
                      >
                        {subscription?.posts_remaining !== undefined
                          ? `${subscription.posts_remaining} / ${subscription.job_post_count || 0}`
                          : "0 Left"}
                      </span>
                    </Dropdown.Item>

                    {/* Profile View Count */}
                    <Dropdown.Item
                      href="/recruiter/candidate-search"
                      className="d-flex justify-content-between align-items-center py-2 px-3 rounded-2"
                      style={{ transition: "all 0.2s ease" }}
                    >
                      <span>
                        <i className="bi bi-eye me-2 text-info"></i>
                        Profile View Count
                      </span>
                      <span
                        className="badge rounded-pill fw-bold"
                        style={{
                          backgroundColor: "rgba(6, 182, 212, 0.12)",
                          color: "#0891b2",
                          fontSize: "11.5px",
                        }}
                      >
                        {subscription?.profile_view_count !== undefined
                          ? `${subscription.profile_view_count} Views`
                          : "0 Views"}
                      </span>
                    </Dropdown.Item>

                    {/* Email Count */}
                    <Dropdown.Item
                      href="/recruiter/candidates"
                      className="d-flex justify-content-between align-items-center py-2 px-3 rounded-2"
                      style={{ transition: "all 0.2s ease" }}
                    >
                      <span>
                        <i className="bi bi-envelope me-2 text-success"></i>
                        Email Count
                      </span>
                      <span
                        className="badge rounded-pill fw-bold"
                        style={{
                          backgroundColor: "rgba(16, 185, 129, 0.12)",
                          color: "#059669",
                          fontSize: "11.5px",
                        }}
                      >
                        {subscription?.email_count !== undefined
                          ? `${subscription.email_count} Emails`
                          : "0 Emails"}
                      </span>
                    </Dropdown.Item>

                    <Dropdown.Divider className="my-2" />

                    <Dropdown.Item
                      href="/recruiter/package"
                      className="d-flex align-items-center py-2 px-3 rounded-2 text-primary fw-semibold"
                    >
                      <i className="bi bi-stars me-2 text-warning"></i>
                      Upgrade Plan / Package
                    </Dropdown.Item>
                    <Dropdown.Item href="/recruiter/recruiter-profile" className="py-2 px-3 rounded-2">
                      <i className="bi bi-person me-2 text-secondary"></i>
                      Recruiter Profile
                    </Dropdown.Item>
                    <Dropdown.Item href="/recruiter/my-transaction" className="py-2 px-3 rounded-2">
                      <i className="bi bi-receipt me-2 text-secondary"></i>
                      My Transaction
                    </Dropdown.Item>
                    <Dropdown.Item href="/recruiter/recruiter-changepassword" className="py-2 px-3 rounded-2">
                      <i className="bi bi-key me-2 text-secondary"></i>
                      Change Password
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item href="/seeker/profile">
                      My Account
                    </Dropdown.Item>
                    <Dropdown.Item href="/seeker/seeker-changepassword">
                      Change Password
                    </Dropdown.Item>
                  </>
                )}
                <Dropdown.Divider className="my-1" />
                <Dropdown.Item
                  as="button"
                  onClick={handleLogout}
                  className="d-flex align-items-center py-2 px-3 rounded-2 fw-semibold"
                  style={{
                    color: "#dc2626",
                    backgroundColor: "transparent",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.08)";
                    e.currentTarget.style.color = "#b91c1c";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#dc2626";
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2 text-danger"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>

      {/* ---------- MOBILE SLIDE MENU ---------- */}
      <div className={`mobile-slide-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <i
          className="bi bi-x-lg close-btn"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className="mobile-links">
          <Link href="/home" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about-us" onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </Link>
          <Link href="/contact-us" onClick={() => setIsMobileMenuOpen(false)}>
            Contact Us
          </Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>
            Blogs
          </Link>

          {!user && (
            <>
              <Link
                href="/recruiter-login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Recruiter Login
              </Link>
              <Link
                href="/seeker-login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Seeker Login
              </Link>
            </>
          )}

          {user && role === "recruiter" && (
            <>
              <div className="px-3 py-2 my-2 rounded-2 bg-light border small">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-semibold">Active Plan:</span>
                  <span className="badge bg-primary text-white">{subscription?.package_name || "Free"}</span>
                </div>
              </div>
              <Link
                href="/recruiter/job"
                onClick={() => setIsMobileMenuOpen(false)}
                className="d-flex justify-content-between align-items-center"
              >
                <span>Post Remaining</span>
                <span className="badge bg-primary-subtle text-primary">
                  {subscription?.posts_remaining ?? 0} Left
                </span>
              </Link>
              <Link
                href="/recruiter/candidate-search"
                onClick={() => setIsMobileMenuOpen(false)}
                className="d-flex justify-content-between align-items-center"
              >
                <span>Profile View Count</span>
                <span className="badge bg-info-subtle text-info">
                  {subscription?.profile_view_count ?? 0} Views
                </span>
              </Link>
              <Link
                href="/recruiter/candidates"
                onClick={() => setIsMobileMenuOpen(false)}
                className="d-flex justify-content-between align-items-center"
              >
                <span>Email Count</span>
                <span className="badge bg-success-subtle text-success">
                  {subscription?.email_count ?? 0} Emails
                </span>
              </Link>
              <Link
                href="/recruiter/package"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary fw-semibold"
              >
                <i className="bi bi-stars me-1 text-warning"></i> Upgrade Package
              </Link>
              <Link
                href="/recruiter/recruiter-profile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Recruiter Profile
              </Link>
              <Link
                href="/recruiter/my-transaction"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Transaction
              </Link>
              <Link
                href="/recruiter/recruiter-changepassword"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Change Password
              </Link>
              <button
                className="logout-btn d-flex align-items-center justify-content-center"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </>
          )}

          {user && role === "seeker" && (
            <>
              <Link
                href="/seeker/profile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Account
              </Link>
              <Link
                href="/seeker/seeker-changepassword"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Change Password
              </Link>
              <button
                className="logout-btn d-flex align-items-center justify-content-center"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* ---- GLOBAL STYLES ---- */}
      <style jsx global>{`
        .hover-link {
          position: relative;
          display: inline-block;
          transition: all 0.25s ease;
          text-decoration: none !important;
        }

        .hover-link:after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 2.5px;
          background: linear-gradient(90deg, #4f46e5, #06b6d4);
          border-radius: 2px;
          transition: width 0.25s ease;
        }

        .hover-link:hover:after {
          width: 100%;
        }

        .hover-link:hover {
          transform: translateY(-2px);
          color: #4f46e5 !important;
        }

        .hover-link i:hover {
          color: #06b6d4 !important;
          transform: translateY(-2px);
        }

        .account-section .hover-link:after {
          display: none !important;
        }

        .account-section .hover-link:hover {
          transform: none !important;
          color: inherit !important;
        }

        .mobile-slide-menu {
          position: fixed;
          top: 0;
          right: -300px;
          width: 300px;
          height: 100vh;
          background: #ffffff;
          z-index: 9999;
          padding: 25px;
          box-shadow: -4px 0 20px rgba(15, 23, 42, 0.15);
          transition: right 0.35s ease-in-out;
        }

        .mobile-slide-menu.open {
          right: 0;
        }

        .mobile-slide-menu .close-btn {
          font-size: 26px;
          cursor: pointer;
          display: block;
          text-align: right;
          margin-bottom: 25px;
          color: #0f172a;
        }

        .mobile-links a {
          display: block;
          padding: 12px 0;
          font-size: 15px;
          font-weight: 500;
          color: #1e293b;
          text-decoration: none;
          border-bottom: 1px solid #f1f5f9;
          transition: color 0.2s;
        }

        .mobile-links a:hover {
          color: #4f46e5;
        }

        .logout-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          width: 100%;
          padding: 12px;
          margin-top: 15px;
          border-radius: 8px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default Navbar;
