"use client";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="back-to-top-btn d-flex align-items-center justify-content-center"
          aria-label="Back to top"
          style={{
            position: "fixed",
            background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(79, 70, 229, 0.4)",
            transition: "all 0.3s ease",
            animation: "floatUp 2.5s infinite ease-in-out",
            zIndex: 9999,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FaArrowUp />
        </button>
      )}

      {/* Responsive & Floating animation */}
      <style>{`
        .back-to-top-btn {
          bottom: 25px;
          right: 25px;
          width: 48px;
          height: 48px;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .back-to-top-btn {
            bottom: 18px !important;
            right: 18px !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 14px !important;
          }
        }

        @keyframes floatUp {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default BackToTop;
