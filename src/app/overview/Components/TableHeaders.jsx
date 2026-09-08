"use client";

const TableHeaders = () => (
  <thead>
    <tr
      style={{
        backgroundColor: "#f8fafc",
        borderBottom: "2px solid #e2e8f0",
      }}
    >
      <th
        className="py-3 px-3 text-center"
        style={{ color: "#64748b", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.6px" }}
      >
        #
      </th>

      <th
        className="py-3 px-3"
        style={{ color: "#64748b", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.6px" }}
      >
        Candidate
      </th>

      <th
        className="py-3 px-3"
        style={{ color: "#64748b", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.6px" }}
      >
        Job Position
      </th>

      <th
        className="py-3 px-3"
        style={{ color: "#64748b", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.6px" }}
      >
        Email
      </th>

      <th
        className="py-3 px-3"
        style={{ color: "#64748b", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.6px" }}
      >
        Contact
      </th>

      <th
        className="py-3 px-3"
        style={{ color: "#64748b", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.6px" }}
      >
        Applied On
      </th>

      <th
        className="py-3 px-3 text-end"
        style={{ color: "#64748b", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.6px" }}
      >
        Action
      </th>
    </tr>
  </thead>
);

export default TableHeaders;
