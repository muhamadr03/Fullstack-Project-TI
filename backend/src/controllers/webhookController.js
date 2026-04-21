const snap = require("../config/midtrans");
const { Order } = require("../models");

exports.midtransNotification = async (req, res) => {
  try {
    // 1. Serahkan data dari Midtrans ke library untuk diverifikasi keamanannya
    const statusResponse = await snap.transaction.notification(req.body);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(
      `🔔 Webhook Midtrans Masuk! Order: ${orderId} | Status: ${transactionStatus}`,
    );

    // 2. Ekstrak ID Order asli dari database kita
    // Ingat, kemarin kita format namanya: ORDER-{id_database}-{timestamp}
    // Contoh: ORDER-10-1712345678 -> Kita ambil angka "10" di tengah
    const dbOrderId = orderId.split("-")[1];

    // 3. Cari pesanan tersebut di Database
    const order = await Order.findByPk(dbOrderId);
    if (!order) {
      // Jika tidak ketemu, tetap balas 200 agar Midtrans tidak spam panggil terus
      return res
        .status(200)
        .json({ message: "Order tidak ditemukan di DB kita." });
    }

    // 4. Logika Perubahan Status Berdasarkan Laporan Midtrans
    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        await order.update({ status: "paid" }); // Kartu Kredit Sukses
      }
    } else if (transactionStatus === "settlement") {
      await order.update({ status: "paid" }); // Transfer Bank / GoPay Sukses (LUNAS!)
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      await order.update({ status: "cancelled" }); // Gagal / Kedaluwarsa
    } else if (transactionStatus === "pending") {
      await order.update({ status: "pending" }); // Menunggu Pembayaran
    }

    // 5. WAJIB HUKUMNYA membalas Midtrans dengan status 200 OK
    res
      .status(200)
      .json({ status: "success", message: "Notifikasi berhasil diproses" });
  } catch (error) {
    console.error("🔥 Error Webhook:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada Webhook" });
  }
};
