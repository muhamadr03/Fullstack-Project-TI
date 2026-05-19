import React from "react";

const StatusBadge = ({ status }) => {
  switch (status) {
    case "pending":
      return <span className="badge bg-warning text-dark">Pending</span>;
    case "paid":
      return <span className="badge bg-info text-dark">Sudah Dibayar</span>;
    case "shipped":
      return <span className="badge bg-primary">Sedang Dikirim</span>;
    case "completed":
      return <span className="badge bg-success">Selesai</span>;
    case "cancelled":
      return <span className="badge bg-danger">Dibatalkan</span>;
    default:
      return <span className="badge bg-secondary">{status}</span>;
  }
};

export default StatusBadge;