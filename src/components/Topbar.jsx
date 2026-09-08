"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

const Topbar = () => {
  const pathname = usePathname();

  const buttons = [
    { name: "Overview", path: "/overview", icon: "bi-speedometer2" },
    { name: "Jobs", path: "/recruiter/job", icon: "bi-briefcase" },
    { name: "Candidates", path: "/recruiter/candidates", icon: "bi-people" },
    { name: "Candidates Search", path: "/recruiter/candidate-search", icon: "bi-search" },
    { name: "Bulk Mail", path: "/recruiter/bulk-mail", icon: "bi-envelope-paper" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: "110px",
        left: 0,
        width: "100%",
        zIndex: 1015,
        background: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #0369a1 100%)",
        padding: "8px 0",
        minHeight: "48px",
        boxShadow: "0 4px 16px rgba(11, 15, 25, 0.25)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="container d-flex justify-content-start align-items-center"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="d-flex align-items-center gap-2 py-1">
          {buttons.map((btn) => {
            const isActive =
              pathname === btn.path ||
              (btn.path !== "/overview" && pathname.startsWith(btn.path));

            return (
              <Link
                key={btn.name}
                href={btn.path}
                style={{
                  padding: "6px 16px",
                  borderRadius: "50px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                  background: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.12)",
                  color: isActive ? "#4f46e5" : "#ffffff",
                  border: isActive
                    ? "1px solid #ffffff"
                    : "1px solid rgba(255, 255, 255, 0.20)",
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                }}
              >
                <i className={`bi ${btn.icon}`} style={{ fontSize: "14px" }} />
                <span>{btn.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
