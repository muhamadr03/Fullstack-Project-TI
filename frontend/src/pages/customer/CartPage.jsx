import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const CartPage = () => {
  const { cartItems, cartLoading, removeFromCart, totalPrice } =
    useContext(CartContext);
  const navigate = useNavigate();

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
                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Jumlah</th>
                    <th>Subtotal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={`http://localhost:5000${item.Product?.image_url}`}
                            alt={item.Product?.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            className="rounded me-2"
                          />
                          <span className="fw-semibold">
                            {item.Product?.name}
                          </span>
                        </div>
                      </td>
                      <td>Rp {item.Product?.price.toLocaleString("id-ID")}</td>
                      <td>{item.quantity}</td>
                      <td className="fw-bold text-danger">
                        Rp{" "}
                        {(item.Product?.price * item.quantity).toLocaleString(
                          "id-ID",
                        )}
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ringkasan Belanja */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-3">
              <h5 className="fw-bold mb-3">Ringkasan Pesanan</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Harga:</span>
                <span className="fw-bold fs-5 text-danger">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <hr />
              <button
                className="btn btn-primary w-100 py-2 fw-bold"
                onClick={() => navigate("/checkout")}
              >
                Lanjut ke Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
