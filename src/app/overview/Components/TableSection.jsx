"use client";
import Link from "next/link";

const TableSection = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="7" className="text-center py-5">
            <div className="d-flex flex-column align-items-center justify-content-center py-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "rgba(99, 102, 241, 0.08)",
                  color: "#4f46e5",
                  fontSize: "24px",
                }}
              >
                <i className="bi bi-inbox"></i>
              </div>
              <h6 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                No candidates in this stage
              </h6>
              <p className="text-muted small mb-0">
                Candidates will appear here as they apply and move through your pipeline.
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((candidate, index) => {
        const jobId = candidate.jobId ?? candidate.job_id;
        const seekerId =
          candidate.user_id ?? candidate.userId ?? candidate.seeker_id ?? null;

        const href =
          jobId && seekerId
            ? `/recruiter/candidate-detail/${jobId}/${seekerId}`
            : "#";

        const initial = candidate.name
          ? candidate.name.trim().charAt(0).toUpperCase()
          : "C";

        return (
          <tr
            key={index}
            className="candidate-table-row"
            style={{
              transition: "all 0.2s ease",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <td className="py-3 px-3 text-center text-muted fw-semibold" style={{ fontSize: "13px" }}>
              {index + 1}
            </td>

            <td className="py-3 px-3">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-2 fw-bold"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)",
                    color: "#4f46e5",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>
                <div>
                  <Link
                    href={href}
                    className="fw-bold text-dark text-decoration-none candidate-name-link"
                    style={{ fontSize: "14px" }}
                    onClick={(e) => {
                      if (href === "#") {
                        e.preventDefault();
                        console.error("Missing jobId/user_id:", candidate);
                      }
                    }}
                  >
                    {candidate.name || "Unnamed Candidate"}
                  </Link>
                </div>
              </div>
            </td>

            <td className="py-3 px-3">
              <span
                className="badge fw-medium px-2 py-1 rounded-2"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.08)",
                  color: "#4f46e5",
                  fontSize: "12px",
                }}
              >
                {candidate.job || "General Application"}
              </span>
            </td>

            <td className="py-3 px-3 text-muted" style={{ fontSize: "13px" }}>
              <i className="bi bi-envelope me-1 text-secondary"></i>
              {candidate.email || "—"}
            </td>

            <td className="py-3 px-3 text-muted" style={{ fontSize: "13px" }}>
              <i className="bi bi-telephone me-1 text-secondary"></i>
              {candidate.contact || "—"}
            </td>

            <td className="py-3 px-3 text-muted" style={{ fontSize: "13px" }}>
              <i className="bi bi-calendar3 me-1 text-secondary"></i>
              {candidate.date || "—"}
            </td>

            <td className="py-3 px-3 text-end">
              <Link
                href={href}
                className="btn btn-sm px-3 py-1 fw-semibold rounded-pill view-candidate-btn"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  color: "#ffffff",
                  fontSize: "12px",
                  border: "none",
                  boxShadow: "0 2px 6px rgba(79, 70, 229, 0.2)",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onClick={(e) => {
                  if (href === "#") {
                    e.preventDefault();
                    console.error("Missing jobId/user_id:", candidate);
                  }
                }}
              >
                View <i className="bi bi-arrow-right"></i>
              </Link>
            </td>
          </tr>
        );
      })}

      <style jsx>{`
        .candidate-table-row:hover {
          background-color: #f8fafc !important;
        }
        .candidate-name-link:hover {
          color: #4f46e5 !important;
        }
        .view-candidate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.35) !important;
        }
      `}</style>
    </tbody>
  );
};

export default TableSection;
