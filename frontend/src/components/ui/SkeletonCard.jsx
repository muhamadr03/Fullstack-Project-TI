// src/components/ui/SkeletonCard.jsx
import React from "react";

export const ProductSkeleton = () => (
  <div className="lx-product-card h-100" style={{ overflow: "hidden" }}>
    <div className="skeleton skeleton-rect" style={{ aspectRatio: "1/1", width: "100%", borderRadius: "var(--r-lg) var(--r-lg) 0 0" }} />
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="skeleton" style={{ height: 10, width: "50%", borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: "85%", borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 12, width: "40%", borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 18, width: "60%", borderRadius: 4, marginTop: 4 }} />
      <div className="skeleton" style={{ height: 38, width: "100%", borderRadius: 12, marginTop: 8 }} />
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="skeleton skeleton-rect lx-cat-skeleton" />
);

const SkeletonCard = () => <ProductSkeleton />;
export default SkeletonCard;
