import React from "react";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger text-center shadow-sm p-4 rounded-4" role="alert">
      <i className="bi bi-exclamation-triangle-fill fs-1 text-danger mb-3 d-block"></i>
      <h5 className="alert-heading fw-bold">Ups! Terjadi Kesalahan</h5>
      <p className="mb-0">{message || "Gagal memuat data. Silakan coba lagi."}</p>
      
      {onRetry && (
        <button className="btn btn-outline-danger mt-3 fw-medium" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-2"></i>Coba Lagi
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
