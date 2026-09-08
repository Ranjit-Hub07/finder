"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const JobTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/recruiter/job-transactions");
        const data = await res.json();
        setTransactions(data.transactions);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Updated Status Badge Mapping
  const statusBadge = (status) => {
    if (!status)
      return (
        <span className="badge bg-warning text-dark px-3 py-2">PENDING</span>
      );

    const normalized = status.toLowerCase();

    if (normalized === "active")
      return <span className="badge bg-success px-3 py-2">SUCCESS</span>;

    if (normalized === "expired")
      return <span className="badge bg-danger px-3 py-2">FAILED</span>;

    return (
      <span className="badge bg-warning text-dark px-3 py-2">PENDING</span>
    );
  };

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "110px" }} className="pb-5">
        {/* ⭐ Modern Page Banner */}
        <div className="page-banner mb-4">
          <div className="container d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1 text-white">Transaction History</h1>
              <p className="text-white-50 mb-0" style={{ fontSize: "15px" }}>
                Track your subscription package purchases and billing records.
              </p>
            </div>

            {/* ⭐ Responsive Breadcrumb */}
            <div className="breadcrumb-pill">
              <Link href="/home" className="text-decoration-none text-muted">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <i className="bi bi-chevron-right text-muted" style={{ fontSize: "11px" }}></i>
              <span className="text-primary fw-semibold">Transactions</span>
            </div>
          </div>
        </div>

        <div className="container">

          {/* Main Card */}
          <div
            className="bg-white p-4 rounded-4 shadow-sm"
            style={{ border: "1px solid #eee" }}
          >
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : transactions.length === 0 ? (
              <p
                className="text-center py-5 text-muted"
                style={{ fontSize: "16px" }}
              >
                No transactions found.
              </p>
            ) : (
              <div className="table-responsive">
                <table
                  className="table table-hover align-middle"
                  style={{ fontSize: "14px" }}
                >
                  <thead
                    style={{
                      backgroundColor: "#f8f9fc",
                      color: "#5d6a7e",
                      borderBottom: "2px solid #e9ecef",
                    }}
                  >
                    <tr>
                      <th>Sl No</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>TXN ID</th>
                      <th>Payment Mode</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((t, index) => (
                      <tr
                        key={t.id}
                        className="transition-row"
                        style={{
                          cursor: "pointer",
                          transition: "0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#f7faff")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{t.plan_name}</td>
                        <td className="fw-semibold">
                          ₹{t.total_amount || t.price_inr}
                        </td>
                        <td>{t.txn_id || "N/A"}</td>
                        <td>{t.payment_mode || "N/A"}</td>
                        <td>
                          {t.transaction_date
                            ? new Date(t.transaction_date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{statusBadge(t.transaction_status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default JobTransaction;
