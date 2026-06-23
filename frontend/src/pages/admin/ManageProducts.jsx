import React, { useState, useEffect } from "react";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ==========================================
  // STATE PENCARIAN & PAGINASI
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category_id: 1,
    description: "",
    price: "",
    stock: "",
    images: [null, null, null],
    existingImages: [null, null, null],
  });
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);

  const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      const categoryList = response.data || response || [];
      setCategories(categoryList);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    }
  };

  // ==========================================
  // LOGIKA FILTER & PAGINASI
  // ==========================================
  let filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory ? p.category_id?.toString() === filterCategory : true;
    
    let matchMonth = true;
    let matchDate = true;

    if (p.created_at) {
      const productDate = new Date(p.created_at);
      
      if (filterMonth) {
        const [y, m] = filterMonth.split("-");
        matchMonth = productDate.getFullYear() === parseInt(y, 10) && (productDate.getMonth() + 1) === parseInt(m, 10);
      }
      
      if (filterDate) {
        // Adjust local timezone mapping safely
        const offset = productDate.getTimezoneOffset() * 60000;
        const localDateStr = new Date(productDate.getTime() - offset).toISOString().split("T")[0];
        matchDate = localDateStr === filterDate;
      }
    }

    return matchSearch && matchCategory && matchMonth && matchDate;
  });

  filteredProducts.sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

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

  const handleFileChangeSlot = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;

      const newPreviews = [...imagePreviews];
      newPreviews[index] = URL.createObjectURL(file);

      setFormData({ ...formData, images: newImages });
      setImagePreviews(newPreviews);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    
    const newExisting = [...formData.existingImages];
    newExisting[index] = null;
    
    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    
    setFormData({ ...formData, images: newImages, existingImages: newExisting });
    setImagePreviews(newPreviews);
  };

  const handleAddClick = () => {
    setFormData({
      id: null,
      name: "",
      category_id: categories[0]?.id || 1,
      description: "",
      price: "",
      stock: "",
      images: [null, null, null],
      existingImages: [null, null, null],
    });
    setImagePreviews([null, null, null]);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    const existingPreviews = [null, null, null];
    const existingImgs = [null, null, null];

    if (product.images) {
      product.images.forEach((img, idx) => {
        if (idx < 3) {
          existingPreviews[idx] = img.image_url;
          existingImgs[idx] = img.image_url;
        }
      });
    }

    setFormData({
      id: product.id,
      name: product.name,
      category_id: product.category_id,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: [null, null, null],
      existingImages: existingImgs,
    });
    setImagePreviews(existingPreviews);
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
      // Kirim gambar per slot
      formData.images.forEach((file, idx) => {
        if (file) {
          dataToSubmit.append(`image_${idx + 1}`, file);
        }
      });

      formData.existingImages.forEach((url, idx) => {
        if (url) {
          dataToSubmit.append(`existing_image_${idx + 1}`, url);
        }
      });

      if (isEditing) {
        await productApi.updateProduct(formData.id, dataToSubmit);
      } else {
        await productApi.createProduct(dataToSubmit);
      }
      setShowForm(false);
      setImagePreviews([]);
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
    <div>
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
                <div className="col-md-3">
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
                <div className="col-md-3">
                  <label className="form-label">Kategori</label>
                  <select
                    className="form-select"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Pilih kategori
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Stok</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Gambar Produk <span className="text-muted fw-normal">(tepat 3 slot gambar)</span></label>
                <div className="row g-3 mt-1">
                  {[0, 1, 2].map((idx) => (
                    <div className="col-md-4" key={idx}>
                      <div className="card h-100 shadow-sm border-0 bg-light">
                        <div className="card-body text-center d-flex flex-column justify-content-between p-3">
                          <p className="fw-bold mb-2" style={{ fontSize: "0.9rem", color: "#4f46e5" }}>
                            Gambar {idx + 1} {idx === 0 && <span className="badge bg-primary ms-1">Utama</span>}
                          </p>
                          <div className="mb-3 d-flex justify-content-center align-items-center" style={{ height: "130px", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", border: "1px dashed #ccc" }}>
                            {imagePreviews[idx] ? (
                              <img
                                src={imagePreviews[idx].startsWith("http") || imagePreviews[idx].startsWith("blob:") ? imagePreviews[idx] : `${API_URL}/${imagePreviews[idx].replace(/\\/g, "/")}`}
                                alt={`preview-${idx}`}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              />
                            ) : (
                              <div className="text-muted small">
                                <i className="bi bi-image" style={{ fontSize: "2rem", opacity: 0.5 }}></i><br/>
                                Belum Ada Gambar
                              </div>
                            )}
                          </div>
                          <div>
                            {imagePreviews[idx] ? (
                              <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => handleRemoveImage(idx)}>
                                Hapus Gambar
                              </button>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  id={`file-upload-${idx}`}
                                  className="d-none"
                                  accept="image/*"
                                  onChange={(e) => handleFileChangeSlot(e, idx)}
                                  required={!isEditing && idx === 0}
                                />
                                <label htmlFor={`file-upload-${idx}`} className="btn btn-sm btn-outline-primary w-100 m-0" style={{ cursor: "pointer" }}>
                                  Pilih Gambar
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
          {/* FILTER & PENCARIAN */}
          <div className="row mb-3 gy-2">
            <div className="col-md-3">
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
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white" title="Filter Bulan">
                  <i className="bi bi-calendar-month"></i>
                </span>
                <input
                  type="month"
                  className="form-control"
                  value={filterMonth}
                  onChange={(e) => { setFilterMonth(e.target.value); setFilterDate(""); setCurrentPage(1); }}
                  title="Filter berdasarkan Bulan"
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="input-group">
                <span className="input-group-text bg-white" title="Pencarian Tanggal">
                  <i className="bi bi-calendar-date"></i>
                </span>
                <input
                  type="date"
                  className="form-control"
                  value={filterDate}
                  onChange={(e) => { setFilterDate(e.target.value); setFilterMonth(""); setCurrentPage(1); }}
                  title="Pencarian berdasarkan Tanggal"
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                title="Urutkan"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
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
                      <th>Kategori</th>
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
                            src={product.images && product.images.length > 0 ? (product.images[0].image_url.startsWith('http') ? product.images[0].image_url : `${API_URL}/${product.images[0].image_url.replace(/\\/g, "/")}`) : "https://via.placeholder.com/50"}
                            alt={product.name}
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
                        <td>{product.category?.name || "-"}</td>
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
