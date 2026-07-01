import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";


const CartPage = () => {
  const { cartItems, cartLoading, removeFromCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);

  // Auto-select all items when cart loads initially
  useEffect(() => {
    if (cartItems.length > 0 && selectedItems.length === 0) {
      // Optional: automatically check everything by default, or let it be empty.
      // We will let it be empty so the user actively selects, but usually
      // eCommerce apps auto-select everything. Let's auto-select all.
      setSelectedItems(cartItems.map((item) => item.id));
    }
  }, [cartItems, selectedItems.length]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedTotalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => {
      const productData = item.Product || item.product || {};
      return sum + (productData.price || 0) * item.quantity;
    }, 0);

  if (cartLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Keranjang Belanja</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Keranjang Anda masih kosong.</h4>
          <Link to="/" className="btn btn-primary mt-3">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="row">
          {/* Daftar Item */}
          <div className="col-lg-8">
            <div className="table-responsive bg-white p-3 shadow-sm rounded">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        style={{ cursor: "pointer" }}
                        checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Jumlah</th>
                    <th>Subtotal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    // Trik Jitu: Tangkap data produk entah itu huruf besar (Product) atau kecil (product)
                    const productData = item.Product || item.product || {};

                    return (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            style={{ cursor: "pointer" }}
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                item.selected_image_url 
                                  ? item.selected_image_url
                                  : (productData.image_url
                                      ? (productData.image_url.startsWith('http') ? productData.image_url : `${BACKEND_URL}${productData.image_url}`)
                                      : "https://via.placeholder.com/50")
                              }
                              alt={productData.name || "Produk"}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                              className="rounded me-2"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/50?text=No+Img";
                              }}
                            />
                            <div>
                              <span className="fw-semibold d-block">
                                {productData.name || "Nama Produk Tidak Tersedia"}
                              </span>
                              {item.selected_size && (
                                <span className="badge bg-info text-dark mt-1" style={{ fontSize: "0.75rem" }}>
                                  Varian: {item.selected_size}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          Rp{" "}
                          {(item.variant?.price || productData.price || 0).toLocaleString("id-ID")}
                        </td>
                        <td>{item.quantity}</td>
                        <td className="fw-bold text-danger">
                          Rp{" "}
                          {((item.variant?.price || productData.price || 0) * item.quantity).toLocaleString("id-ID")}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <i className="bi bi-trash"></i> Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ringkasan Belanja */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-3">
              <h5 className="fw-bold mb-3">Ringkasan Pesanan</h5>
              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Total Barang Terpilih:</span>
                <span>{selectedItems.length} barang</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Harga:</span>
                <span className="fw-bold fs-5 text-danger">
                  Rp {selectedTotalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <hr />
              <button
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={selectedItems.length === 0}
                onClick={() => navigate("/checkout", { state: { selectedItems } })}
              >
                {selectedItems.length === 0 ? "Pilih Produk Dulu" : "Lanjut ke Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
