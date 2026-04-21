const { Product } = require("./src/models");

// PERHATIAN: Pastikan Anda minimal sudah punya Kategori dengan ID 1, 2, dan 3 di database!
const seedDatabase = async () => {
  try {
    const dummyData = [];
    const categories = [1, 2, 3]; // Asumsi ID Kategori
    const types = [
      "Kemeja",
      "Sepatu",
      "Celana Jeans",
      "Jaket Pria",
      "Tas Ransel",
      "Topi",
      "Jam Tangan",
    ];
    const colors = ["Hitam", "Putih", "Navy", "Maroon", "Cokelat"];

    console.log("⏳ Sedang meracik 35 produk dummy...");

    for (let i = 1; i <= 35; i++) {
      // Mengacak nama, warna, dan kategori
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      // Mengacak harga kelipatan 10.000 (dari 50rb sampai 500rb)
      const randomPrice = Math.floor(Math.random() * 45 + 5) * 10000;

      dummyData.push({
        name: `${randomType} ${randomColor} V${i}`,
        description: `Ini adalah deskripsi panjang untuk produk ${randomType} berwarna ${randomColor} edisi ke-${i}. Sangat cocok untuk dipakai sehari-hari.`,
        price: randomPrice,
        stock: Math.floor(Math.random() * 80) + 10, // Stok acak 10 - 90
        category_id: randomCategory,
        // Jika Anda punya kolom image di model, sesuaikan namanya (misal: image, image_url, atau biarkan kosong jika boleh null)
      });
    }

    // Fungsi bulkCreate untuk memasukkan array sekaligus ke MySQL
    await Product.bulkCreate(dummyData);
    console.log("✅ BERHASIL! 35 Produk Dummy telah ditanam di Database!");

    process.exit(); // Matikan script setelah selesai
  } catch (error) {
    console.error("❌ Gagal menanam dummy:", error.message);
    process.exit(1);
  }
};

seedDatabase();
