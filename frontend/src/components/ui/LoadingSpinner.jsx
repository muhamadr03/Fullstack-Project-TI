import React from "react";

const LoadingSpinner = ({ text = "Memuat data...", fullScreen = false }) => {
  const content = (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-medium">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light bg-opacity-50 position-fixed top-0 start-0 w-100" style={{ zIndex: 1050 }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
