import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  // 1. Penanganan URL Gambar (Fallback ke placeholder jika kosong/error)
  // Sesuaikan dengan URL Backend Anda (bisa diambil dari env variables nanti)
  const backendUrl = "http://localhost:5000";
  const imageUrl = product.image_url
    ? `${backendUrl}${product.image_url}`
    : "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div className="card h-100 shadow-sm border-0 position-relative transition-hover">
      {/* 2. Badge Kategori (Pojok Kiri Atas) */}
      {product.category && (
        <span className="badge bg-dark position-absolute top-0 start-0 m-2 z-1">
          {product.category.name}
        </span>
      )}

      {/* 3. Gambar Produk */}
      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.name}
        style={{ objectFit: "cover", height: "200px" }}
        onError={(e) => {
          // Jika gambar dari backend gagal dimuat (misal file terhapus), ganti ke placeholder
          e.target.src =
            "https://via.placeholder.com/300x300?text=Image+Not+Found";
        }}
      />

      <div className="card-body d-flex flex-column text-center">
        {/* 4. Nama Produk */}
        <h5 className="card-title text-truncate mb-1" title={product.name}>
          {product.name}
        </h5>

        {/* 5. Rating (Persiapan untuk fitur ulasan nanti) */}
        <div className="mb-2 text-warning" style={{ fontSize: "0.9rem" }}>
          ⭐{" "}
          <span className="text-muted ms-1 text-dark">
            {product.average_rating
              ? parseFloat(product.average_rating).toFixed(1)
              : "Baru"}
          </span>
        </div>

        {/* 6. Harga Produk */}
        <p className="card-text text-danger fw-bold fs-5 mb-3">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        {/* 7. Tombol Aksi (Otomatis terdorong ke bawah berkat d-flex & mt-auto) */}
        <div className="mt-auto d-grid gap-2">
          <Link
            to={`/products/${product.id}`}
            className="btn btn-outline-primary btn-sm"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
