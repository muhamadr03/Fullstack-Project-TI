import React, { useState, useEffect } from "react";
import { productApi } from "../../api/productApi";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Mode Tabel vs Mode Form
  const [isEditing, setIsEditing] = useState(false);

  // State untuk form input
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category_id: 1, // Default kategori, sesuaikan dengan database Anda
    description: "",
    price: "",
    stock: "",
    image: null, // 👈 Tempat menyimpan file gambar fisik
  });

  // URL Backend untuk memunculkan gambar (sesuaikan jika berbeda di .env)
  const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getAllProducts();
      // Menyesuaikan dengan struktur backend paginasi Anda (biasanya di response.data.rows atau response.data.data)
      setProducts(response.data?.rows || response.data || []);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
      alert("Gagal memuat data produk.");
    } finally {
      setLoading(false);
    }
  };

  // Handle perubahan teks (nama, harga, deskripsi)
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle saat Admin memilih file gambar (Multer)
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] }); // Ambil file fisik pertama
  };

  // Buka form untuk tambah produk baru
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

  // Buka form untuk edit produk (bawa data lama)
  const handleEditClick = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      category_id: product.category_id,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: null, // Jangan isi dengan string, biar Admin upload file baru jika mau ganti
    });
    setIsEditing(true);
    setShowForm(true);
  };

  // Submit Form (Kirim FormData ke Backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Kita WAJIB merakit data menggunakan class FormData bawaan browser
      const dataToSubmit = new FormData();
      dataToSubmit.append("name", formData.name);
      dataToSubmit.append("category_id", formData.category_id);
      dataToSubmit.append("description", formData.description);
      dataToSubmit.append("price", formData.price);
      dataToSubmit.append("stock", formData.stock);

      // Jika ada file gambar yang dipilih, masukkan ke FormData
      if (formData.image) {
        dataToSubmit.append("image", formData.image);
      }

      // 2. Tembak API berdasarkan mode (Edit atau Tambah)
      if (isEditing) {
        await productApi.updateProduct(formData.id, dataToSubmit);
        alert("Produk berhasil diperbarui!");
      } else {
        await productApi.createProduct(dataToSubmit);
        alert("Produk baru berhasil ditambahkan!");
      }

      // 3. Kembali ke tabel dan refresh data
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error("Error submit:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan produk.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Hapus Produk
  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      try {
        await productApi.deleteProduct(id);
        alert("Produk dihapus.");
        fetchProducts();
      } catch (error) {
        alert("Gagal menghapus produk.");
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
        /* ================= AREA FORM TAMBAH/EDIT PRODUK ================= */
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-header bg-dark text-white fw-bold py-3">
            {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Nama Produk</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">ID Kategori</label>
                  <input
                    type="number"
                    className="form-control"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Harga (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Stok</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Deskripsi</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Upload Gambar Produk
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!isEditing}
                />
                <small className="text-muted">
                  Format: JPG, PNG.{" "}
                  {isEditing &&
                    "Biarkan kosong jika tidak ingin mengubah gambar."}
                </small>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success fw-bold px-4"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Simpan Produk"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* ================= AREA TABEL PRODUK ================= */
        <div className="card shadow-sm border-0">
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
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="ps-3">
                        <img
                          src={`${API_URL}${product.image_url}`}
                          alt={product.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "5px",
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
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && !loading && (
                <div className="text-center py-4 text-muted">
                  Belum ada produk di database.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
