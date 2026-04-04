// middleware untuk mengecek role admin
const adminMiddleware = (req, res, next) => {
    try {
        // ambil role dari header
        const role = req.headers.role;

        // cek apakah role adalah admin
        if (role === 'admin') {
            next(); // lanjut ke controller berikutnya
        } else {
            return res.status(403).json({
                message: 'Akses ditolak! Hanya admin yang diperbolehkan.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

module.exports = adminMiddleware;