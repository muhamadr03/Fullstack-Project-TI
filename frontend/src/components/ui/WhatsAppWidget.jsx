import React, { useState } from "react";

const WhatsAppWidget = ({ phoneNumber = "6281234567890", message = "Halo! Saya ingin bertanya tentang produk Anda." }) => {
  const [isOpen, setIsOpen] = useState(false);

  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {/* Chat Bubble Popup */}
      {isOpen && (
        <div
          className="card shadow-lg border-0 mb-3"
          style={{ width: "300px", borderRadius: "16px", overflow: "hidden", animation: "fadeInUp 0.3s ease" }}
        >
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", padding: "16px" }}>
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
                style={{ width: "44px", height: "44px", flexShrink: 0 }}
              >
                <i className="bi bi-headset fs-5 text-success"></i>
              </div>
              <div>
                <div className="fw-bold text-white" style={{ fontSize: "0.95rem" }}>E-Shop Support</div>
                <div className="text-white d-flex align-items-center gap-1" style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                  <span className="rounded-circle bg-success" style={{ width: "8px", height: "8px", display: "inline-block", border: "2px solid white" }}></span>
                  Online
                </div>
              </div>
              <button
                className="btn-close btn-close-white ms-auto"
                onClick={() => setIsOpen(false)}
                style={{ fontSize: "0.7rem" }}
              ></button>
            </div>
          </div>

          {/* Body */}
          <div className="p-3 bg-white">
            <div
              className="p-3 mb-3 rounded-3"
              style={{ background: "#f0f9f0", borderLeft: "3px solid #25D366", fontSize: "0.875rem" }}
            >
              👋 Halo! Ada yang bisa kami bantu? Klik tombol di bawah untuk langsung chat dengan tim kami.
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn w-100 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
              style={{
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                border: "none",
                borderRadius: "10px",
                padding: "10px",
                textDecoration: "none"
              }}
            >
              <i className="bi bi-whatsapp fs-5"></i>
              Mulai Chat WhatsApp
            </a>
            <p className="text-center text-muted mt-2 mb-0" style={{ fontSize: "0.75rem" }}>
              Respon dalam beberapa menit
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-circle border-0 d-flex align-items-center justify-content-center shadow-lg"
        style={{
          width: "58px",
          height: "58px",
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: "0 4px 15px rgba(37, 211, 102, 0.4)"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        title="Chat via WhatsApp"
      >
        {isOpen
          ? <i className="bi bi-x-lg text-white fs-4"></i>
          : <i className="bi bi-whatsapp text-white fs-3"></i>
        }
      </button>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppWidget;
