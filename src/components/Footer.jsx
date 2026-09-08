'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <>
      <footer
        className="footer-section pt-5 pb-4"
        style={{
          backgroundColor: '#0b0f19',
          color: '#cbd5e1',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container">
          {/* Top Row */}
          <div className="row gy-4 mb-5">
            {/* Brand column */}
            <div className="col-lg-3 col-md-6">
              <Link href="/home" className="d-inline-block text-decoration-none mb-3">
                <Image
                  src="/image/finder_logo.svg"
                  alt="Finder Logo"
                  width={140}
                  height={36}
                  priority
                  style={{
                    cursor: "pointer",
                    height: "36px",
                    width: "auto",
                    objectFit: "contain",
                    display: "block",
                    filter: "brightness(1.1)",
                  }}
                />
              </Link>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.75' }}>
                Finder connects ambitious job seekers with top recruiters across private, government, walk-in, and global opportunities.
              </p>
              <div className="d-flex gap-2 mt-3">
                {[
                  { icon: 'youtube', label: 'YouTube' },
                  { icon: 'linkedin', label: 'LinkedIn' },
                  { icon: 'twitter', label: 'Twitter' },
                  { icon: 'facebook', label: 'Facebook' },
                  { icon: 'instagram', label: 'Instagram' },
                ].map((s) => (
                  <a
                    key={s.icon}
                    href="#"
                    aria-label={s.label}
                    className="social-icon-btn"
                  >
                    <i className={`bi bi-${s.icon} fs-6`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-3 col-6">
              <h6 className="footer-title">Quick Links</h6>
              <ul className="list-unstyled footer-list">
                <li><Link href="/about-us">About Us</Link></li>
                <li><Link href="/contact-us">Contact Us</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/terms-conditions">Terms & Conditions</Link></li>
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Community Links */}
            <div className="col-lg-2 col-md-3 col-6">
              <h6 className="footer-title">Community</h6>
              <ul className="list-unstyled footer-list">
                <li><Link href="/team">Team</Link></li>
                <li><Link href="/career">Career</Link></li>
                <li><Link href="/success-story">Success Story</Link></li>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/disclaimer">Disclaimer</Link></li>
              </ul>
            </div>

            {/* Job Links */}
            <div className="col-lg-2 col-md-3 col-6">
              <h6 className="footer-title">Job Links</h6>
              <ul className="list-unstyled footer-list">
                <li><Link href="/job-listing?jobType=Walk-In+Jobs">Walk In Jobs</Link></li>
                <li><Link href="/job-by-location">Jobs By Location</Link></li>
                <li><Link href="/job-by-type">Job By Types</Link></li>
                <li><Link href="/interview-tips">Interview Tips</Link></li>
                <li><Link href="/resume">Resume Writing</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6 col-12">
              <h6 className="footer-title">Contact Us</h6>
              <p className="mb-2" style={{ fontSize: '14px', color: '#94a3b8' }}>
                <i className="bi bi-envelope-fill me-2 text-info"></i>
                <a href="mailto:job@finder.com" className="footer-link-text">
                  job@finder.com
                </a>
              </p>
              <p className="mb-2" style={{ fontSize: '14px', color: '#94a3b8' }}>
                <i className="bi bi-telephone-fill me-2 text-info"></i>
                <a href="tel:+917538057669" className="footer-link-text">
                  +91 7538057669
                </a>
              </p>
              <p className="mb-0" style={{ fontSize: '14px', color: '#94a3b8' }}>
                <i className="bi bi-geo-alt-fill me-2 text-info"></i>
                Bhubaneswar, Odisha, India
              </p>

              <div className="mt-3 p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Toll Free Helpline</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                  <a href="tel:+917538057669" style={{ color: '#ffffff', textDecoration: 'none' }}>
                    <i className="bi bi-telephone-outbound me-2"></i>+91 7538057669
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom Divider */}
          <div
            className="row pt-4 align-items-center"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0" style={{ fontSize: '13px', color: '#64748b' }}>
                Copyright &copy; 2026 <span style={{ color: '#38bdf8', fontWeight: 600 }}>Finder</span>. All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
              <Link href="/privacy-policy" className="footer-bottom-link me-3">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="footer-bottom-link">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern Footer CSS */}
      <style jsx global>{`
        .footer-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          letter-spacing: 0.3px;
        }

        .footer-list li {
          margin-bottom: 10px;
        }

        .footer-list a,
        .footer-link-text {
          color: #94a3b8;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .footer-list a:hover,
        .footer-link-text:hover {
          color: #38bdf8 !important;
          transform: translateX(4px);
        }

        .social-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .social-icon-btn:hover {
          background: #4f46e5;
          color: #ffffff !important;
          border-color: #4f46e5;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }

        .footer-bottom-link {
          color: #64748b;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-bottom-link:hover {
          color: #38bdf8;
        }
      `}</style>
    </>
  );
};

export default Footer;
