import React, { useState, useEffect } from "react";
import { wishlistApi } from "../../api/wishlistApi";
import ProductCard from "../../components/ui/ProductCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const WishlistPage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await wishlistApi.getWishlist();
      setWishlists(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil wishlist:", err);
      setError("Gagal memuat daftar keinginan Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={fetchWishlist} /></div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-heart-fill text-danger me-2"></i>Daftar Keinginan
      </h2>

      {wishlists.length === 0 ? (
        <div className="alert alert-info text-center p-5 rounded-4 bg-white border">
          <i className="bi bi-emoji-frown fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold">Wishlist Masih Kosong</h5>
          <p className="text-muted">Anda belum menambahkan produk apapun ke daftar keinginan.</p>
        </div>
      ) : (
        <div className="row g-4">
          {wishlists.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard product={item.product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
