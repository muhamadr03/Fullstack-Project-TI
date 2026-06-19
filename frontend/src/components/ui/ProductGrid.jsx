import React from "react";
import ProductCard from "./ProductCard";
import { ProductSkeleton } from "./SkeletonCard";

const ProductGrid = ({
  products = [],
  loading = false,
  limit = null,
  skeletonCount = 8,
  emptyMessage = "No products available.",
}) => {
  const visibleProducts = limit ? products.slice(0, limit) : products;

  if (loading) {
    return (
      <div className="row g-4">
        {[...Array(skeletonCount)].map((_, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3">
            <ProductSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!visibleProducts.length) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-bag-x" style={{ fontSize: "3rem", color: "#e0e0e0" }} />
        <h5 className="mt-3">{emptyMessage}</h5>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {visibleProducts.map((product) => (
        <div key={product.id} className="col-6 col-md-4 col-lg-3">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
