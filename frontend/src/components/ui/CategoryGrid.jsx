import React from "react";
import { Link } from "react-router-dom";
import { CategorySkeleton } from "./SkeletonCard";

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const imgUrl = (url, name) =>
  !url
    ? `https://placehold.co/400x530?text=${encodeURIComponent(name)}`
    : url.startsWith("http")
    ? url
    : `${BACKEND_URL}${url}`;

const CategoryGrid = ({ categories = [], loading = false, limit = null }) => {
  const visibleCategories = limit ? categories.slice(0, limit) : categories;

  if (loading) {
    return (
      <div className="row g-4">
        {[...Array(limit || 8)].map((_, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <CategorySkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!visibleCategories.length) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-grid" style={{ fontSize: "3rem", color: "#e0e0e0" }} />
        <h5 className="mt-3">No categories found.</h5>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {visibleCategories.map((category) => {
        const slug = category.slug || (category.name || "").toLowerCase().replace(/\s+/g, "-");
        return (
          <div key={category.id} className="col-12 col-sm-6 col-lg-3">
            <Link to={`/products?category=${slug}`} className="lx-cat-card">
              <img
                src={imgUrl(category.image_url || category.image, category.name)}
                alt={category.name}
                className="lx-cat-img"
                loading="lazy"
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x530?text=${encodeURIComponent(category.name)}`;
                }}
              />
              <div className="lx-cat-info">
                <span className="lx-cat-name">{category.name}</span>
                <span className="lx-cat-arrow">
                  Belanja sekarang <i className="bi bi-arrow-right" />
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
