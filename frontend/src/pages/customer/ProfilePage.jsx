import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance'; // Kita gunakan axios langsung untuk endpoint ini

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // State untuk form, diisi dengan data user yang sedang login
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Asumsi: Backend Anda memiliki route PUT /users/profile untuk update data
      const response = await axiosInstance.put('/users/profile', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });

      // Update state global user agar nama di Navbar juga ikut berubah jika diganti
      setUser({ ...user, ...response.data.data }); 
      
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui! 🎉' });
    } catch (error) {
      console.error("Gagal update profil:", error);
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 text-center">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                <i className="bi bi-person"></i>
              </div>
              <h3 className="fw-bold">Profil Saya</h3>
            </div>
            
            <div className="card-body p-4">
              {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                  {message.text}
                  <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">Email (Tidak dapat diubah)</label>
                  <input 
                    type="email" 
                    className="form-control bg-light" 
                    value={formData.email} 
                    disabled 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold mb-1">Nomor Telepon</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="phone"
                    placeholder="Contoh: 08123456789"
                    value={formData.phone} 
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold mb-1">Alamat Pengiriman Default</label>
                  <textarea 
                    className="form-control" 
                    name="address"
                    rows="3"
                    placeholder="Masukkan alamat lengkap rumah Anda..."
                    value={formData.address} 
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span> Menyimpan...</>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;