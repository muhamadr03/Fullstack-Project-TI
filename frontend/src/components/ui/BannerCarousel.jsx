// src/components/ui/BannerCarousel.jsx — Premium Hero Banner v3
import React, { useState, useEffect, useCallback, useRef } from "react";
import { bannerApi } from "../../api/bannerApi";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const resolveUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

const BANNER_BENEFITS = [
  { icon: "bi-truck", text: "Gratis Ongkir" },
  { icon: "bi-shield-check", text: "Garansi Resmi" },
  { icon: "bi-credit-card", text: "Cicilan 0%" },
];

/* ─── single slide ──────────────────────────────────────── */
const BannerSlide = ({ banner, isActive }) => {
  const bgSrc      = resolveUrl(banner.image_url);
  const opacity    = banner.overlay_opacity ?? 0.45;
  const isCenter   = (banner.text_position || "left") === "center";

  // Support both sale_price / price field names
  const salePrice     = banner.sale_price     || banner.price     || null;
  const originalPrice = banner.original_price || banner.old_price || null;

  return (
    <div className={`hb-slide ${isActive ? "active" : ""}`}>
      {/* Background */}
      {bgSrc && (
        <img
          src={bgSrc}
          alt=""
          className="hb-bg-img"
          draggable={false}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      )}

      {/* Overlay gradient — always left-weighted for readability */}
      <div className="hb-overlay" style={{ opacity }} />
      <div className="hb-overlay-gradient" />

      {/* Content */}
      <div className={`hb-content ${isCenter ? "hb-content--center" : ""}`}>

        {/* ── LEFT / TEXT COLUMN ── */}
        <div className="hb-text-col">

          {/* Badge */}
          {banner.badge && (
            <span className="hb-badge">
              <i className="bi bi-lightning-charge-fill" />
              {banner.badge}
            </span>
          )}

          {/* Eyebrow heading */}
          {banner.heading && (
            <p className="hb-heading">{banner.heading}</p>
          )}

          {/* Main title */}
          <h2 className="hb-title">{banner.title}</h2>

          {/* Description */}
          {banner.description && (
            <p className="hb-desc">{banner.description}</p>
          )}

          {/* Price block */}
          {(salePrice || originalPrice) && (
            <div className="hb-price-block">
              <span className="hb-price-from">Mulai dari</span>
              {salePrice && <span className="hb-sale-price">{salePrice}</span>}
              {originalPrice && (
                <span className="hb-original-price">{originalPrice}</span>
              )}
            </div>
          )}

          {/* CTA */}
          {banner.button_text && (
            <div className="hb-cta-row">
              <a
                href={banner.button_link || banner.link_url || "#"}
                className="hb-btn hb-btn-primary"
                onClick={(e) => {
                  if (!banner.button_link && !banner.link_url) e.preventDefault();
                }}
              >
                {banner.button_text}
                <i className="bi bi-arrow-right ms-2" />
              </a>
            </div>
          )}

          {/* Benefit mini-list */}
          <div className="hb-benefits">
            {BANNER_BENEFITS.map((b) => (
              <span key={b.text} className="hb-benefit-item">
                <i className={`bi ${b.icon}`} />
                {b.text}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

/* ─── carousel ───────────────────────────────────────────── */
const BannerCarousel = () => {
  const [banners, setBanners]     = useState([]);
  const [current, setCurrent]     = useState(0);
  const [isLoading, setLoading]   = useState(true);
  const [isDragging, setDrag]     = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const autoRef                   = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await bannerApi.getAllBanners();
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setBanners(list.filter((b) => b.is_active));
      } catch {
        setBanners([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goTo = useCallback(
    (idx) => {
      setCurrent((prev) => {
        const len = banners.length;
        if (len === 0) return 0;
        return ((idx % len) + len) % len;
      });
    },
    [banners.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (banners.length <= 1) return;
    autoRef.current = setInterval(next, 6000);
    return () => clearInterval(autoRef.current);
  }, [banners.length, next]);

  const resetAutoPlay = useCallback(() => {
    clearInterval(autoRef.current);
    if (banners.length > 1)
      autoRef.current = setInterval(next, 6000);
  }, [banners.length, next]);

  const onDragStart = (e) => {
    setDrag(true);
    setDragStart(e.touches ? e.touches[0].clientX : e.clientX);
  };
  const onDragEnd = (e) => {
    if (!isDragging) return;
    setDrag(false);
    const x    = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStart - x;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAutoPlay(); }
  };

  if (isLoading) {
    return (
      <div className="hb-skeleton">
        <div className="hb-skeleton-inner" />
      </div>
    );
  }
  if (banners.length === 0) return null;

  return (
    <div
      className="hb-carousel"
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
      onMouseLeave={() => setDrag(false)}
      onTouchStart={onDragStart}
      onTouchEnd={onDragEnd}
    >
      <div className="hb-track">
        {banners.map((banner, idx) => (
          <BannerSlide key={banner.id} banner={banner} isActive={idx === current} />
        ))}
      </div>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            id="hb-arrow-prev"
            className="hb-arrow hb-arrow-prev"
            aria-label="Sebelumnya"
            onClick={() => { prev(); resetAutoPlay(); }}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <button
            id="hb-arrow-next"
            className="hb-arrow hb-arrow-next"
            aria-label="Selanjutnya"
            onClick={() => { next(); resetAutoPlay(); }}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="hb-dots">
          {banners.map((_, idx) => (
            <button
              key={idx}
              id={`hb-dot-${idx}`}
              className={`hb-dot ${idx === current ? "active" : ""}`}
              onClick={() => { goTo(idx); resetAutoPlay(); }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {banners.length > 1 && (
        <div className="hb-progress">
          <div
            key={current}
            className="hb-progress-bar"
            style={{ animationDuration: "6000ms" }}
          />
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
