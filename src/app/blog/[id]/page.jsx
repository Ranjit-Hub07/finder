"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState({ name: "", email: "", comment: "" });
  const [comments, setComments] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch blog details
  useEffect(() => {
    if (id) {
      fetch(`/api/blogs/${id}`)
        .then((res) => res.json())
        .then((data) => setBlog(data))
        .catch(() => console.error("Error fetching blog"));
    }
  }, [id]);

  // ✅ Fetch comments for the blog
  useEffect(() => {
    if (id) {
      fetch(`/api/blogs/comments/${id}?blog_id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setComments(data);
          else setComments([]);
        })
        .catch((err) => console.error("Error fetching comments:", err));
    }
  }, [id]);

  // ✅ Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("Please complete the CAPTCHA verification before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/comments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...comment, blog_id: id, recaptchaToken }),
      });

      if (response.ok) {
        alert("Thank you! Your comment has been posted.");
        setComment({ name: "", email: "", comment: "" });
        setRecaptchaToken("");

        // Refresh comments list
        fetch(`/api/blogs/comments/${id}?blog_id=${id}`)
          .then((res) => res.json())
          .then((data) => setComments(Array.isArray(data) ? data : []));
      } else {
        alert("Failed to submit comment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!blog) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: "110px", minHeight: "80vh" }} className="d-flex align-items-center justify-content-center bg-light">
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="text-muted fw-semibold">Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "110px", backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "70px" }}>
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner">
          <Container className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Link
                  href="/blog"
                  className="badge rounded-pill text-decoration-none px-3 py-1"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                >
                  <i className="bi bi-arrow-left me-1"></i> Back to Articles
                </Link>
                <span className="text-white-50 small">•</span>
                <span className="badge bg-primary-subtle text-primary rounded-pill px-2 py-1" style={{ fontSize: "11px" }}>
                  Editorial
                </span>
              </div>
              <h1 className="fw-bold mb-1 text-white" style={{ fontSize: "28px", letterSpacing: "-0.3px" }}>
                {blog.title}
              </h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                Published on {blog.date} · By {blog.author}
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <Link href="/blog" className="text-decoration-none text-muted">
                Blogs
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">Article</span>
            </div>
          </Container>
        </div>

        {/* ⭐ Article Body Container */}
        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col lg={9} xl={8}>
              {/* Main Article Card */}
              <div
                className="bg-white rounded-4 p-4 p-md-5 border mb-5"
                style={{
                  boxShadow: "0 4px 24px -2px rgba(15, 23, 42, 0.06)",
                  borderColor: "#e2e8f0",
                }}
              >
                {/* Author & Reading Meta */}
                <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-4 border-bottom gap-2">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                      style={{
                        width: "44px",
                        height: "44px",
                        background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                        fontSize: "16px",
                      }}
                    >
                      {blog.author ? blog.author.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">{blog.author}</h6>
                      <small className="text-muted">{blog.date} · 5 min read</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <Link
                      href="/blog"
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                    >
                      <i className="bi bi-arrow-left me-1"></i> All Blogs
                    </Link>
                  </div>
                </div>

                {/* Article Featured Image */}
                {(blog.detail_image || blog.image) && (
                  <div
                    className="rounded-4 overflow-hidden mb-4 shadow-sm"
                    style={{ maxHeight: "420px", width: "100%", position: "relative" }}
                  >
                    <img
                      src={blog.detail_image || blog.image}
                      alt={blog.title}
                      className="w-100 object-fit-cover"
                      style={{ maxHeight: "420px" }}
                    />
                  </div>
                )}

                {/* Article Content */}
                <div
                  className="article-body mb-5"
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.85",
                    color: "#334155",
                    textAlign: "justify",
                  }}
                >
                  <p>{blog.content}</p>
                </div>

                {/* Share Strip */}
                <div className="p-3 rounded-3 bg-light border d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5">
                  <span className="fw-semibold text-dark small">
                    <i className="bi bi-share-fill text-primary me-2"></i> Share this article:
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary rounded-circle"
                      style={{ width: "34px", height: "34px", padding: 0 }}
                      onClick={() => alert("Link copied to clipboard!")}
                      title="Copy link"
                    >
                      <i className="bi bi-link-45deg"></i>
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-secondary rounded-circle"
                      style={{ width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary rounded-circle"
                      style={{ width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>

                {/* ================= COMMENTS SECTION ================= */}
                <div className="pt-4 border-top">
                  <h4 className="fw-bold mb-4 text-dark" style={{ letterSpacing: "-0.3px" }}>
                    Discussion ({comments.length})
                  </h4>

                  {comments.length > 0 ? (
                    <div className="d-flex flex-column gap-3 mb-5">
                      {comments.map((c) => {
                        const commenterInitial = c.name ? c.name.charAt(0).toUpperCase() : "U";
                        return (
                          <div
                            key={c.id}
                            className="p-3 rounded-3 border bg-light d-flex gap-3 align-items-start"
                          >
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                              style={{
                                width: "38px",
                                height: "38px",
                                backgroundColor: "#6366f1",
                                fontSize: "14px",
                              }}
                            >
                              {commenterInitial}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "14.5px" }}>
                                  {c.name}
                                </h6>
                                <small className="text-muted" style={{ fontSize: "11.5px" }}>
                                  {new Date(c.created_at).toLocaleDateString()}
                                </small>
                              </div>
                              <p className="mb-0 text-secondary" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                                {c.comment}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-light rounded-3 mb-5">
                      <i className="bi bi-chat-dots text-muted fs-3 mb-1 d-inline-block"></i>
                      <p className="text-muted small mb-0">No comments yet. Share your thoughts below!</p>
                    </div>
                  )}

                  {/* ================= COMMENT FORM ================= */}
                  <div
                    className="p-4 rounded-4 border bg-white"
                    style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}
                  >
                    <h5 className="fw-bold mb-3 text-dark">Leave a Comment</h5>
                    <Form onSubmit={handleSubmit}>
                      <Row className="g-3 mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold small text-dark">Your Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your name"
                              value={comment.name}
                              onChange={(e) => setComment({ ...comment, name: e.target.value })}
                              required
                              style={{ borderRadius: "10px", fontSize: "14px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold small text-dark">Your Email</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              value={comment.email}
                              onChange={(e) => setComment({ ...comment, email: e.target.value })}
                              required
                              style={{ borderRadius: "10px", fontSize: "14px" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small text-dark">Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="What are your thoughts on this article?"
                          value={comment.comment}
                          onChange={(e) => setComment({ ...comment, comment: e.target.value })}
                          required
                          style={{ borderRadius: "10px", fontSize: "14px" }}
                        />
                      </Form.Group>

                      {/* Recaptcha */}
                      <div className="mb-4 d-flex justify-content-start">
                        <ReCAPTCHA
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                          onChange={(token) => setRecaptchaToken(token)}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="fw-semibold rounded-pill px-4 py-2 text-white shadow-sm"
                        style={{
                          background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                          border: "none",
                          fontSize: "14px",
                        }}
                      >
                        {submitting ? "Posting..." : "Post Comment"}
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetailPage;
