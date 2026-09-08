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
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            background: "linear-gradient(135deg, #007bff, #6610f2)",
            color: "#fff",
            border: "none",
            padding: "16px",
            borderRadius: "50%",
            fontSize: "20px",
            cursor: "pointer",
            boxShadow:
              "0px 4px 15px rgba(0, 0, 0, 0.4), 0px 0px 15px rgba(0, 123, 255, 0.8)",
            transition: "all 0.3s ease",
            animation: "floatUp 2s infinite ease-in-out",
            zIndex: 9999,
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.15)";
            e.target.style.boxShadow =
              "0px 4px 20px rgba(0,0,0,0.5), 0px 0px 20px rgba(0,123,255,1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow =
              "0px 4px 15px rgba(0,0,0,0.4), 0px 0px 15px rgba(0,123,255,0.8)";
          }}
        >
          <FaArrowUp />
        </button>
      )}

      {/* Floating animation */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default BackToTop;
