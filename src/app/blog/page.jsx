"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Row, Col, Card } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ✅ Upgraded Sidebar component
const PostSidebar = ({ postList = [] }) => (
  <div className="d-flex flex-column gap-4">
    {/* Trending Now Card */}
    <div
      className="bg-white rounded-4 p-4 border"
      style={{
        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
        borderColor: "#e2e8f0",
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
        <span
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            fontSize: "14px",
          }}
        >
          <i className="bi bi-fire"></i>
        </span>
        <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "17px" }}>
          Trending Now
        </h5>
      </div>

      <div className="d-flex flex-column gap-2">
        {postList.slice(0, 5).map((post, index) => (
          <Link
            key={post.id || index}
            href={`/blog/${post.id}`}
            className="text-decoration-none trending-item p-2 rounded-3 d-flex align-items-center gap-3"
            style={{
              transition: "all 0.2s ease",
            }}
          >
            <span
              className="fw-bold d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: index === 0 ? "rgba(79, 70, 229, 0.12)" : "#f1f5f9",
                color: index === 0 ? "#4f46e5" : "#64748b",
                fontSize: "12px",
              }}
            >
              0{index + 1}
            </span>

            <div className="flex-grow-1 overflow-hidden">
              <h6
                className="mb-1 text-dark fw-semibold text-truncate"
                style={{ fontSize: "13.5px" }}
              >
                {post.title}
              </h6>
              <small className="text-muted" style={{ fontSize: "11.5px" }}>
                By {post.author || "Editorial Team"}
              </small>
            </div>

            <i className="bi bi-chevron-right text-muted small"></i>
          </Link>
        ))}
      </div>
    </div>

    {/* Modern Career Alert Card */}
    <div
      className="rounded-4 p-4 text-white position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)",
        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="position-relative" style={{ zIndex: 1 }}>
        <span
          className="badge rounded-pill px-3 py-1 mb-3"
          style={{
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            fontSize: "11px",
          }}
        >
          <i className="bi bi-briefcase-fill me-1"></i> Career Opportunity
        </span>

        <h4 className="fw-bold mb-2 text-white">Find Your Next Job</h4>
        <p className="text-white-50 small mb-4" style={{ lineHeight: "1.6" }}>
          Discover thousands of verified career opportunities across top companies on Finder.
        </p>

        <Link
          href="/job-listing"
          className="btn w-100 fw-semibold rounded-pill py-2 text-white shadow-sm"
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
            border: "none",
            fontSize: "13.5px",
          }}
        >
          Explore All Jobs <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </div>

    {/* Popular Topics Cloud */}
    <div
      className="bg-white rounded-4 p-4 border"
      style={{
        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
        borderColor: "#e2e8f0",
      }}
    >
      <h5 className="fw-bold mb-3 text-dark pb-2 border-bottom" style={{ fontSize: "17px" }}>
        Popular Topics
      </h5>
      <div className="d-flex flex-wrap gap-2">
        {["#InterviewPrep", "#RemoteWork", "#ResumeTips", "#SalaryGuide", "#TechJobs", "#Hiring2026"].map((tag, i) => (
          <span
            key={i}
            className="badge rounded-pill px-3 py-2 fw-semibold"
            style={{
              backgroundColor: "#f1f5f9",
              color: "#475569",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// ✅ Main Blog Page Component
const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBlogPosts(data);
      })
      .catch((err) => console.error("Error fetching blogs:", err))
      .finally(() => setLoading(false));
  }, []);

  const tags = ["All", "Career Advice", "Interview Tips", "Job Search", "Workplace Trends"];

  const filteredPosts = useMemo(() => {
    let list = blogPosts;
    if (selectedTag && selectedTag !== "All") {
      const tagLower = selectedTag.toLowerCase();
      list = list.filter(
        (p) =>
          (p.category && p.category.toLowerCase().includes(tagLower)) ||
          (p.title && p.title.toLowerCase().includes(tagLower)) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(tagLower))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
          (p.author && p.author.toLowerCase().includes(q))
      );
    }
    return list;
  }, [blogPosts, searchQuery, selectedTag]);

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "110px", backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "70px" }}>
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Career Blogs & Insights</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Expert articles, hiring trends, resume strategies, and interview masterclasses.
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">Blogs</span>
            </div>
          </Container>
        </div>

        {/* Filter Bar & Search */}
        <Container className="mt-4 mb-4">
          <div
            className="bg-white p-3 rounded-4 border d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3"
            style={{
              boxShadow: "0 4px 18px -2px rgba(15, 23, 42, 0.04)",
              borderColor: "#e2e8f0",
            }}
          >
            {/* Tag Pills */}
            <div className="d-flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`btn btn-sm rounded-pill fw-semibold px-3 py-1 ${
                    selectedTag === tag ? "text-white shadow-sm" : "text-secondary bg-light"
                  }`}
                  style={{
                    background:
                      selectedTag === tag
                        ? "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
                        : "#f1f5f9",
                    border: selectedTag === tag ? "none" : "1px solid #e2e8f0",
                    fontSize: "12.5px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div style={{ minWidth: "260px" }}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0 ps-0"
                  placeholder="Search articles, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: "13px" }}
                />
                {searchQuery && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    onClick={() => setSearchQuery("")}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Container>

        {/* Main Grid */}
        <Container>
          <Row className="g-4">
            {/* Left Column: Blog Grid */}
            <Col lg={8}>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status"></div>
                  <p className="text-muted fw-semibold">Loading articles...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="bg-white rounded-4 p-5 text-center border shadow-sm">
                  <i className="bi bi-journal-x fs-1 text-muted mb-2 d-inline-block"></i>
                  <h5 className="fw-bold text-dark">No Articles Found</h5>
                  <p className="text-muted small mb-3">
                    We couldn&apos;t find any blog posts matching &quot;{searchQuery || selectedTag}&quot;.
                  </p>
                  <button
                    className="btn btn-sm btn-primary rounded-pill px-4"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTag("All");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <Row className="g-4">
                  {filteredPosts.map((post) => (
                    <Col md={6} key={post.id}>
                      <div
                        className="bg-white rounded-4 overflow-hidden border h-100 d-flex flex-column blog-card"
                        style={{
                          boxShadow: "0 4px 18px -2px rgba(15, 23, 42, 0.05)",
                          borderColor: "#e2e8f0",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Link
                          href={`/blog/${post.id}`}
                          className="position-relative d-block overflow-hidden"
                          style={{ height: "200px" }}
                        >
                          <Image
                            src={post.image || "/image/blog4.webp"}
                            alt={post.title}
                            fill
                            unoptimized={true}
                            style={{ objectFit: "cover" }}
                            className="blog-img-zoom"
                          />
                          <span
                            className="position-absolute top-0 start-0 m-3 badge rounded-pill px-3 py-1"
                            style={{
                              backgroundColor: "rgba(15, 23, 42, 0.75)",
                              backdropFilter: "blur(4px)",
                              color: "#fff",
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            {post.category || "Career Insight"}
                          </span>
                        </Link>

                        <div className="p-4 d-flex flex-column flex-grow-1">
                          <div
                            className="d-flex align-items-center gap-2 text-muted small mb-2"
                            style={{ fontSize: "12px" }}
                          >
                            <span>
                              <i className="bi bi-person-fill text-primary me-1"></i>
                              {post.author || "Editorial Team"}
                            </span>
                            <span>•</span>
                            <span>
                              <i className="bi bi-calendar3 me-1"></i>
                              {post.date}
                            </span>
                          </div>

                          <Link
                            href={`/blog/${post.id}`}
                            className="text-decoration-none text-dark mb-2"
                          >
                            <h6
                              className="fw-bold blog-title-link mb-0"
                              style={{ fontSize: "16px", lineHeight: "1.4" }}
                            >
                              {post.title}
                            </h6>
                          </Link>

                          <p
                            className="text-muted small flex-grow-1 mt-2 mb-3"
                            style={{
                              lineHeight: "1.6",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {post.excerpt}
                          </p>

                          <div className="pt-2 border-top d-flex justify-content-between align-items-center mt-auto">
                            <Link
                              href={`/blog/${post.id}`}
                              className="fw-bold text-decoration-none small d-inline-flex align-items-center gap-1"
                              style={{ color: "#4f46e5" }}
                            >
                              Read More <i className="bi bi-arrow-right"></i>
                            </Link>
                            <small className="text-muted" style={{ fontSize: "11px" }}>
                              4 min read
                            </small>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Col>

            {/* Right Column: Sidebar */}
            <Col lg={4}>
              <PostSidebar postList={blogPosts} />
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />

      <style jsx global>{`
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px -4px rgba(79, 70, 229, 0.12) !important;
          border-color: rgba(99, 102, 241, 0.3) !important;
        }

        .blog-img-zoom {
          transition: transform 0.4s ease;
        }

        .blog-card:hover .blog-img-zoom {
          transform: scale(1.05);
        }

        .blog-title-link:hover {
          color: #4f46e5 !important;
        }

        .trending-item:hover {
          background-color: rgba(99, 102, 241, 0.06);
          transform: translateX(3px);
        }
      `}</style>
    </>
  );
};

export default Blog;
