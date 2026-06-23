import React, { useState } from "react";

const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "your_bot";

const TelegramWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const telegramUrl = `https://t.me/${BOT_USERNAME}`;

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {/* Popup Chat Bubble */}
      {isOpen && (
        <div
          className="card shadow-lg border-0 mb-3"
          style={{
            width: "300px",
            borderRadius: "20px",
            overflow: "hidden",
            animation: "tgFadeUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #2AABEE 0%, #007DC5 100%)",
              padding: "16px",
            }}
          >
            <div className="d-flex align-items-center">
              {/* Avatar */}
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "46px",
                  height: "46px",
                  background: "rgba(255,255,255,0.2)",
                  flexShrink: 0,
                  backdropFilter: "blur(8px)",
                }}
              >
                <i className="bi bi-telegram text-white fs-5" />
              </div>

              <div className="flex-grow-1">
                <div className="fw-bold text-white" style={{ fontSize: "0.95rem" }}>
                  E-Shop Bot
                </div>
                <div
                  className="d-flex align-items-center gap-1 text-white"
                  style={{ fontSize: "0.72rem", opacity: 0.85 }}
                >
                  <span
                    className="rounded-circle"
                    style={{
                      width: "7px",
                      height: "7px",
                      background: "#29f078",
                      display: "inline-block",
                      boxShadow: "0 0 6px #29f078",
                    }}
                  />
                  Online — Respon otomatis
                </div>
              </div>

              <button
                className="btn-close btn-close-white"
                onClick={() => setIsOpen(false)}
                style={{ fontSize: "0.65rem" }}
                aria-label="Tutup"
              />
            </div>
          </div>

          {/* Body */}
          <div className="p-3" style={{ background: "#f0f6fb" }}>
            {/* Chat bubble tiruan */}
            <div
              className="p-3 mb-3"
              style={{
                background: "#fff",
                borderRadius: "0 14px 14px 14px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontSize: "0.85rem",
                lineHeight: 1.5,
                color: "#1a1a2e",
              }}
            >
              👋 <strong>Halo!</strong> Saya bot E-Shop siap membantu Anda.<br />
              Klik tombol di bawah untuk mulai chat & dapatkan info produk, cek pesanan, dan lainnya!
            </div>

            {/* Fitur-fitur singkat */}
            <div className="d-flex flex-wrap gap-1 mb-3">
              {["📦 Produk", "🔍 Cek Order", "🌐 Toko", "❓ Bantuan"].map((f) => (
                <span
                  key={f}
                  className="badge"
                  style={{ background: "#ddeeff", color: "#007DC5", fontSize: "0.72rem", borderRadius: "20px", padding: "4px 10px" }}
                >
                  {f}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn w-100 fw-semibold text-white d-flex align-items-center justify-content-center gap-2"
              style={{
                background: "linear-gradient(135deg, #2AABEE 0%, #007DC5 100%)",
                border: "none",
                borderRadius: "12px",
                padding: "10px 16px",
                textDecoration: "none",
                fontSize: "0.9rem",
                boxShadow: "0 4px 14px rgba(42, 171, 238, 0.45)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(42,171,238,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(42,171,238,0.45)";
              }}
            >
              <i className="bi bi-telegram fs-5" />
              Mulai Chat di Telegram
            </a>

            <p className="text-center text-muted mt-2 mb-0" style={{ fontSize: "0.72rem" }}>
              Balas otomatis 24/7 🤖
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        id="telegram-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-circle border-0 d-flex align-items-center justify-content-center shadow-lg"
        title="Chat via Telegram"
        aria-label="Buka chat Telegram"
        style={{
          width: "58px",
          height: "58px",
          background: isOpen
            ? "linear-gradient(135deg, #555, #333)"
            : "linear-gradient(135deg, #2AABEE 0%, #007DC5 100%)",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease",
          boxShadow: "0 4px 18px rgba(42, 171, 238, 0.5)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {isOpen
          ? <i className="bi bi-x-lg text-white fs-4" />
          : <i className="bi bi-telegram text-white fs-3" />
        }
      </button>

      {/* Animasi */}
      <style>{`
        @keyframes tgFadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default TelegramWidget;
