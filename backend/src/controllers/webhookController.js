const crypto = require("crypto");
const { Order } = require("../models");

exports.midtransNotification = async (req, res) => {
  // Selalu return 200 ke Midtrans apapun yang terjadi
  try {
    const notif = req.body;
    console.log("🔔 Webhook Midtrans masuk:", JSON.stringify(notif));

    // Abaikan jika body kosong atau ini adalah test notification dari dashboard
    if (!notif || !notif.order_id || !notif.transaction_status) {
      return res.status(200).json({ status: "ok", message: "Diterima." });
    }

    const orderId = notif.order_id;

    // Abaikan test notification dari Midtrans dashboard
    if (orderId.startsWith("payment_notif_test")) {
      console.log("ℹ️  Test notification diabaikan.");
      return res.status(200).json({ status: "ok", message: "Test notification diterima." });
    }

    // Verifikasi signature_key untuk keamanan
    // SHA512(order_id + status_code + gross_amount + server_key)
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (serverKey && notif.signature_key) {
      const rawString = `${orderId}${notif.status_code}${notif.gross_amount}${serverKey}`;
      const expectedSig = crypto.createHash("sha512").update(rawString).digest("hex");
      if (expectedSig !== notif.signature_key) {
        console.warn("⚠️  Signature tidak cocok! Notifikasi ditolak.");
        return res.status(200).json({ status: "invalid_signature" });
      }
    }

    const transactionStatus = notif.transaction_status;
    const fraudStatus = notif.fraud_status;

    console.log(`📦 Order: ${orderId} | Status: ${transactionStatus} | Fraud: ${fraudStatus}`);

    // Ekstrak DB order ID dari format ORDER-{id}-{timestamp}
    // Juga handle format lain seperti angka langsung
    let dbOrderId = null;
    if (orderId.startsWith("ORDER-")) {
      dbOrderId = orderId.split("-")[1];
    } else if (!isNaN(orderId)) {
      dbOrderId = orderId;
    } else {
      // Coba ambil angka pertama dari string
      const match = orderId.match(/\d+/);
      dbOrderId = match ? match[0] : null;
    }

    if (!dbOrderId) {
      console.log("⚠️  Tidak bisa ekstrak order ID dari:", orderId);
      return res.status(200).json({ status: "ok", message: "Format order_id tidak dikenali." });
    }

    // Cari pesanan di database
    const order = await Order.findByPk(dbOrderId);
    if (!order) {
      console.log(`⚠️  Order ID ${dbOrderId} tidak ada di database.`);
      return res.status(200).json({ status: "ok", message: "Order tidak ditemukan." });
    }

    // Update status berdasarkan laporan Midtrans
    let newStatus = null;
    if (transactionStatus === "capture" && fraudStatus === "accept") {
      newStatus = "paid";
    } else if (transactionStatus === "settlement") {
      newStatus = "paid";
    } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
      newStatus = "cancelled";
    } else if (transactionStatus === "pending") {
      newStatus = "pending";
    }

    if (newStatus && order.status !== newStatus) {
      await order.update({ status: newStatus });
      console.log(`✅ Order ${dbOrderId}: ${order.status} → ${newStatus}`);
    } else {
      console.log(`ℹ️  Order ${dbOrderId} status tidak berubah (${order.status})`);
    }

    return res.status(200).json({ status: "success", message: "Notifikasi diproses." });

  } catch (error) {
    console.error("🔥 Error Webhook:", error.message);
    return res.status(200).json({ status: "error_handled", message: "Error dicatat." });
  }
};
