// src/components/ui/BannerCarousel.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { bannerApi } from "../../api/bannerApi";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const getImageSrc = (banner) => {
  if (!banner?.image_url) return null;
  return banner.image_url.startsWith("http")
    ? banner.image_url
    : `${API_URL}${banner.image_url}`;
};

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const autoPlayRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerApi.getAllBanners();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        const active = list.filter((b) => b.is_active);
        setBanners(active);
      } catch {
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const goTo = useCallback(
    (idx) => {
      if (banners.length === 0) return;
      setCurrent((prev) => {
        let next = idx;
        if (next < 0) next = banners.length - 1;
        if (next >= banners.length) next = 0;
        return next;
      });
    },
    [banners.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto play
  useEffect(() => {
    if (banners.length <= 1) return;
    autoPlayRef.current = setInterval(next, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, [banners.length, next]);

  const resetAutoPlay = useCallback(() => {
    clearInterval(autoPlayRef.current);
    if (banners.length > 1) {
      autoPlayRef.current = setInterval(next, 5000);
    }
  }, [banners.length, next]);

  // Touch/drag support
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };
  const handleDragEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const clientX = e.changedTouches
      ? e.changedTouches[0].clientX
      : e.clientX;
    const diff = dragStart - clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      resetAutoPlay();
    }
  };

  if (isLoading) {
    return (
      <div className="lx-banner-carousel-skeleton">
        <div className="skeleton" style={{ width: "100%", height: "100%" }} />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div
      className="lx-banner-carousel"
      ref={trackRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      {/* Slides */}
      <div className="lx-banner-track">
        {banners.map((banner, idx) => {
          const src = getImageSrc(banner);
          const isActive = idx === current;
          const isPrev =
            idx === (current - 1 + banners.length) % banners.length;
          return (
            <div
              key={banner.id}
              className={`lx-banner-slide ${
                isActive ? "active" : isPrev ? "prev" : ""
              }`}
            >
              {banner.link_url ? (
                <a
                  href={banner.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lx-banner-link"
                  draggable={false}
                >
                  <img
                    src={src}
                    alt={banner.title}
                    className="lx-banner-img"
                    draggable={false}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="lx-banner-overlay" />
                  <div className="lx-banner-caption">
                    <span className="lx-banner-title">{banner.title}</span>
                    <span className="lx-banner-cta">
                      Lihat Promo{" "}
                      <i className="bi bi-arrow-right ms-1" />
                    </span>
                  </div>
                </a>
              ) : (
                <>
                  <img
                    src={src}
                    alt={banner.title}
                    className="lx-banner-img"
                    draggable={false}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="lx-banner-overlay" />
                  <div className="lx-banner-caption">
                    <span className="lx-banner-title">{banner.title}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            className="lx-banner-arrow lx-banner-arrow-prev"
            onClick={() => {
              prev();
              resetAutoPlay();
            }}
            aria-label="Banner sebelumnya"
          >
            <i className="bi bi-chevron-left" />
          </button>
          <button
            className="lx-banner-arrow lx-banner-arrow-next"
            onClick={() => {
              next();
              resetAutoPlay();
            }}
            aria-label="Banner selanjutnya"
          >
            <i className="bi bi-chevron-right" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="lx-banner-dots">
          {banners.map((_, idx) => (
            <button
              key={idx}
              className={`lx-banner-dot ${idx === current ? "active" : ""}`}
              onClick={() => {
                goTo(idx);
                resetAutoPlay();
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {banners.length > 1 && (
        <div className="lx-banner-progress">
          <div
            key={current}
            className="lx-banner-progress-bar"
            style={{ animationDuration: "5000ms" }}
          />
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
