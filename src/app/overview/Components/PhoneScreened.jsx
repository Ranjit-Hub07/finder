"use client";
import TableHeaders from "./TableHeaders";
import TableSection from "./TableSection";

const PhoneScreened = ({ data = [] }) => {
  return (
    <div
      className="card mb-4 border-0"
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <div
        className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center"
        style={{ borderBottom: "1px solid #e2e8f0" }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "rgba(6, 182, 212, 0.12)",
              color: "#0891b2",
              fontSize: "16px",
            }}
          >
            <i className="bi bi-telephone-inbound"></i>
          </div>
          <div>
            <h6 className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: "16px" }}>
              Phone Screened
            </h6>
            <small className="text-muted">Candidates screened via initial telephone interview</small>
          </div>
        </div>

        <span
          className="badge px-3 py-2 rounded-pill fw-bold"
          style={{
            backgroundColor: data.length > 0 ? "rgba(6, 182, 212, 0.12)" : "#f1f5f9",
            color: data.length > 0 ? "#0891b2" : "#94a3b8",
            fontSize: "12px",
          }}
        >
          {data.length} {data.length === 1 ? "Candidate" : "Candidates"}
        </span>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <TableHeaders />
            <TableSection data={data} />
          </table>
        </div>
      </div>
    </div>
  );
};

export default PhoneScreened;
