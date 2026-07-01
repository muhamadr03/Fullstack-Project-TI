// src/components/layout/Footer.jsx — Premium Dark Footer
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    "Layanan": [
      { label: "Pusat Bantuan", href: "#" },
      { label: "Lacak Pesanan", href: "#" },
      { label: "Cara Pengembalian", href: "#" },
    ],
    "Perusahaan": [
      { label: "Tentang Kami", href: "#" },
      { label: "Syarat & Ketentuan", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
    ],
  };

  const socials = [
    { icon: "bi-instagram", href: "#", label: "Instagram" },
    { icon: "bi-facebook", href: "#", label: "Facebook" },
    { icon: "bi-twitter-x", href: "#", label: "Twitter/X" },
  ];

  const payments = ["Visa", "Mastercard", "GoPay", "OVO"];

  return (
    <footer className="lx-footer" id="contact">
      <div className="container-xl px-3">
        <div className="row g-4 justify-content-between">
          {/* Brand */}
          <div className="col-12 col-md-4 col-lg-4">
            <Link to="/" className="lx-footer-logo d-flex align-items-center gap-2 text-decoration-none mb-2" style={{ display: "flex" }}>
              <img
                src="/logo.png"
                alt="Logo Toko"
                style={{ width: "36px", height: "36px", objectFit: "contain" }}
                onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
              />
              <span>Shop<span>Ku</span></span>
            </Link>
            <p className="lx-footer-desc mt-2">
              Destinasi premium Anda untuk produk fashion, elektronik, dan gaya hidup pilihan. Kualitas yang dapat dipercaya, gaya yang Anda cintai.
            </p>
            <div className="d-flex gap-3 mt-4">
              {socials.map((s) => (
                <a key={s.icon} href={s.href} className="lx-social-btn" aria-label={s.label}>
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="col-12 col-md-8 col-lg-7">
            <div className="row g-4">
              {Object.entries(links).map(([title, items]) => (
                <div key={title} className="col-6 col-md-4">
                  <div className="lx-footer-heading">{title}</div>
                  {items.map((item) => (
                    item.href.startsWith("/?") ? (
                      <Link key={item.label} to={item.href} className="lx-footer-link">{item.label}</Link>
                    ) : (
                      <a key={item.label} href={item.href} className="lx-footer-link">{item.label}</a>
                    )
                  ))}
                </div>
              ))}
              
              {/* Kontak Section */}
              <div className="col-12 col-md-4">
                <div className="lx-footer-heading">Hubungi Kami</div>
                <a href="mailto:support@shopku.id" className="lx-footer-link">support@shopku.id</a>
                <a href="tel:+622112345678" className="lx-footer-link">+62 21 1234 5678</a>
                <span className="lx-footer-link" style={{ pointerEvents: 'none' }}>Senin–Jumat 09:00–18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="lx-footer-bottom mt-5">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
              © {year} ShopKu. Hak Cipta Dilindungi.
            </p>

            {/* Payment methods */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginRight: 8 }}>
                Pembayaran Aman:
              </span>
              {payments.map((p) => (
                <span key={p} className="lx-payment-badge">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
