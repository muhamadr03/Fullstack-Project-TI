// src/components/layout/Footer.jsx — Premium Dark Footer
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    About: [
      { label: "Our Story", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Sustainability", href: "#" },
    ],
    Help: [
      { label: "FAQ", href: "#" },
      { label: "Shipping Info", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Track Order", href: "#" },
    ],
    Categories: [
      { label: "Fashion", href: "/?category=fashion" },
      { label: "Electronics", href: "/?category=elektronik" },
      { label: "Beauty", href: "/?category=kecantikan" },
      { label: "Sport", href: "/?category=olahraga" },
    ],
    Contact: [
      { label: "support@luxestore.id", href: "mailto:support@luxestore.id" },
      { label: "+62 21 1234 5678", href: "tel:+622112345678" },
      { label: "Mon–Fri 09:00–18:00", href: "#" },
      { label: "Live Chat", href: "#" },
    ],
  };

  const socials = [
    { icon: "bi-instagram", href: "#", label: "Instagram" },
    { icon: "bi-facebook", href: "#", label: "Facebook" },
    { icon: "bi-twitter-x", href: "#", label: "Twitter/X" },
    { icon: "bi-tiktok", href: "#", label: "TikTok" },
    { icon: "bi-youtube", href: "#", label: "YouTube" },
  ];

  const payments = ["Visa", "Mastercard", "GoPay", "OVO", "DANA", "BCA"];

  return (
    <footer className="lx-footer" id="contact">
      <div className="container-xl px-3">
        <div className="row g-5">

          {/* Brand */}
          <div className="col-12 col-md-4 col-lg-3">
            <span className="lx-footer-logo">Luxe<span>Store</span></span>
            <p className="lx-footer-desc">
              Your premium destination for curated fashion, electronics, and lifestyle products. Quality you can trust, style you'll love.
            </p>
            <div className="d-flex gap-2 mt-4">
              {socials.map((s) => (
                <a key={s.icon} href={s.href} className="lx-social-btn" aria-label={s.label}>
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="col-6 col-md-2 col-lg-2">
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

          {/* Newsletter */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="lx-footer-heading">Newsletter</div>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>
              Get the latest deals and style news delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="d-flex gap-2"
              style={{ marginBottom: 20 }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="form-control"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: "0.82rem",
                }}
              />
              <button
                type="submit"
                className="btn btn-primary flex-shrink-0 fw-semibold"
                style={{ borderRadius: 10, fontSize: "0.8rem", padding: "0 16px" }}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="lx-footer-bottom">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
              © {year} LuxeStore. All rights reserved.
            </p>

            {/* Payment methods */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginRight: 4 }}>
                We accept:
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
