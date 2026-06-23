import React, { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import ProductCard from "../../components/ui/ProductCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const WishlistPage = () => {
  const { wishlistItems, wishlistLoading } = useContext(WishlistContext);

  if (wishlistLoading) return <LoadingSpinner />;


  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-heart-fill text-danger me-2"></i>Daftar Keinginan
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="alert alert-info text-center p-5 rounded-4 bg-white border">
          <i className="bi bi-emoji-frown fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold">Wishlist Masih Kosong</h5>
          <p className="text-muted">Anda belum menambahkan produk apapun ke daftar keinginan.</p>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistItems.map((item) => (
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
