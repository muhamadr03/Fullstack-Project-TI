import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { CartContext } from "../../context/CartContext";

const ProductDetailPage = () => {
  // 1. Menangkap ID produk dari URL (misal: /products/5 -> id = 5)
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. State Management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Untuk jumlah barang yang mau dibeli
  const { addToCart } = useContext(CartContext);

  // 3. Ambil data spesifik dari Backend
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProductById(id);
        console.log("CCTV DATA DARI BACKEND:", response);

        // Sesuaikan dengan format response backend Anda (biasanya response.data)
        setProduct(response);
      } catch (err) {
        console.error("Gagal mengambil detail:", err);
        setError("Ups! Produk tidak ditemukan atau terjadi kesalahan server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  // 4. Handler untuk Tombol Keranjang (Fungsionalitas menyusul di Sprint F3)
  const handleAddToCart = async () => {
    // Nanti kita akan panggil fungsi dari CartContext di sini
    const result = await addToCart(product.id, quantity);

    if (result.success) {
      alert(`Berhasil! ${quantity} buah ${product.name} masuk ke keranjang 🛒`);
      // Opsional: Langsung lempar user ke halaman keranjang setelah klik beli
      // navigate('/cart');
    } else {
      alert(`Ups, gagal memasukkan ke keranjang: ${result.message}`);

      // Jika user belum login (dapat error dari backend), arahkan ke halaman login
      if (
        result.message.toLowerCase().includes("token") ||
        result.message.toLowerCase().includes("login")
      ) {
        navigate("/login");
      }
    }
  };

  // 5. Layar Loading & Error
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          {error || "Produk tidak ditemukan"}
        </div>
        <Link to="/" className="btn btn-outline-primary">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // 6. Penyiapan URL Gambar
  const backendUrl = "http://localhost:5000";
  const imageUrl = product.image_url
    ? `${backendUrl}${product.image_url}`
    : "https://via.placeholder.com/500x500?text=No+Image";

  // 7. Render UI Utama
  return (
    <div className="container py-5">
      {/* Breadcrumb (Navigasi Jejak) */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row bg-white p-4 rounded shadow-sm">
        {/* Kolom Kiri: Gambar Produk */}
        <div className="col-md-5 mb-4 mb-md-0 text-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/500x500?text=Image+Not+Found";
            }}
          />
        </div>

        {/* Kolom Kanan: Detail Produk */}
        <div className="col-md-7 d-flex flex-column justify-content-center">
          {product.category && (
            <span
              className="badge bg-secondary mb-2"
              style={{ width: "fit-content" }}
            >
              {product.category.name}
            </span>
          )}

          <h2 className="fw-bold mb-3">{product.name}</h2>

          <h3 className="text-danger fw-bold mb-4">
            Rp {product.price.toLocaleString("id-ID")}
          </h3>

          <div className="mb-4">
            <h6 className="fw-bold">Deskripsi Produk:</h6>
            <p className="text-muted" style={{ whiteSpace: "pre-line" }}>
              {product.description}
            </p>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold">
              Sisa Stok: <span className="text-primary">{product.stock}</span>
            </h6>
          </div>

          {/* Input Jumlah & Tombol Beli */}
          {product.stock > 0 ? (
            <div className="d-flex align-items-center gap-3 mt-auto">
              <div className="input-group" style={{ width: "130px" }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => Math.min(product.stock, prev + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-primary px-4 py-2"
                onClick={handleAddToCart}
              >
                <i className="bi bi-cart-plus me-2"></i> Masukkan Keranjang
              </button>
            </div>
          ) : (
            <div className="alert alert-warning mt-auto" role="alert">
              Maaf, stok produk ini sedang kosong.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
