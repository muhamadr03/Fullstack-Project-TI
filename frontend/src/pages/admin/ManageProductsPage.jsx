import React, { useState, useEffect } from "react";
import { productApi } from "../../api/productApi";

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ==========================================
  // STATE PENCARIAN & PAGINASI
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category_id: 1,
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Ambil data dalam jumlah besar agar bisa difilter secara lokal
      const response = await productApi.getAllProducts({ limit: 100, page: 1 });
      const productData = response.data?.rows || response.data || [];
      setProducts(productData);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGIKA FILTER & PAGINASI
  // ==========================================
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Form Actions
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleAddClick = () => {
    setFormData({
      id: null,
      name: "",
      category_id: 1,
      description: "",
      price: "",
      stock: "",
      image: null,
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      category_id: product.category_id,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: null,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append("name", formData.name);
      dataToSubmit.append("category_id", formData.category_id);
      dataToSubmit.append("description", formData.description);
      dataToSubmit.append("price", formData.price);
      dataToSubmit.append("stock", formData.stock);
      if (formData.image) dataToSubmit.append("image", formData.image);

      if (isEditing) {
        await productApi.updateProduct(formData.id, dataToSubmit);
      } else {
        await productApi.createProduct(dataToSubmit);
      }
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      alert("Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus produk "${name}"?`)) {
      try {
        await productApi.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert("Gagal menghapus.");
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          <i className="bi bi-box-seam me-2"></i>Kelola Produk
        </h2>
        {!showForm && (
          <button onClick={handleAddClick} className="btn btn-primary fw-bold">
            <i className="bi bi-plus-lg me-1"></i> Tambah Produk
          </button>
        )}
      </div>

      {showForm ? (
        /* FORM INPUT (Sama seperti sebelumnya) */
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-header bg-dark text-white fw-bold">
            Form Produk
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Produk</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Gambar</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  required={!isEditing}
                />
              </div>
              <button type="submit" className="btn btn-success me-2">
                {loading ? "Proses..." : "Simpan"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* SEARCH BAR */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama produk..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* TABEL PRODUK */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3">Gambar</th>
                      <th>Nama Produk</th>
                      <th>Harga</th>
                      <th>Stok</th>
                      <th className="text-center pe-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="ps-3">
                          <img
                            src={`${API_URL}${product.image_url}`}
                            alt=""
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50";
                            }}
                          />
                        </td>
                        <td className="fw-bold">{product.name}</td>
                        <td className="text-success fw-bold">
                          Rp {product.price?.toLocaleString("id-ID")}
                        </td>
                        <td>{product.stock}</td>
                        <td className="pe-3 text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditClick(product)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* PAGINASI */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Prev
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ManageProductsPage;
