const snap = require("../config/midtrans");
const { Order } = require("../models");

exports.midtransNotification = async (req, res) => {
  // Midtrans WAJIB dapat balasan 200, apapun yang terjadi
  // Kalau tidak, Midtrans akan spam kirim notifikasi terus
  try {
    const notifBody = req.body;
    console.log("🔔 Webhook Midtrans masuk:", JSON.stringify(notifBody));

    // Validasi body tidak kosong
    if (!notifBody || !notifBody.order_id) {
      console.log("⚠️  Body kosong atau order_id tidak ada (test notification?)");
      return res.status(200).json({ status: "ok", message: "Test notification diterima." });
    }

    // Verifikasi notifikasi via SDK Midtrans
    let statusResponse;
    try {
      statusResponse = await snap.transaction.notification(notifBody);
    } catch (sdkErr) {
      console.error("⚠️  SDK Error (mungkin test notification):", sdkErr.message);
      // Tetap 200 agar Midtrans tidak retry terus
      return res.status(200).json({ status: "ok", message: "Diterima." });
    }

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`📦 Order: ${orderId} | Transaction: ${transactionStatus} | Fraud: ${fraudStatus}`);

    // Ekstrak ID dari format ORDER-{id}-{timestamp}
    const parts = orderId.split("-");
    const dbOrderId = parts.length >= 2 ? parts[1] : null;

    if (!dbOrderId || isNaN(dbOrderId)) {
      console.log("⚠️  Format order_id tidak dikenali:", orderId);
      return res.status(200).json({ status: "ok", message: "Format order_id tidak dikenali." });
    }

    // Cari pesanan di database
    const order = await Order.findByPk(dbOrderId);
    if (!order) {
      console.log(`⚠️  Order ID ${dbOrderId} tidak ditemukan di DB.`);
      return res.status(200).json({ status: "ok", message: "Order tidak ditemukan." });
    }

    // Update status berdasarkan laporan Midtrans
    if (transactionStatus === "capture" && fraudStatus === "accept") {
      await order.update({ status: "paid" });
      console.log(`✅ Order ${dbOrderId} -> paid (capture)`);
    } else if (transactionStatus === "settlement") {
      await order.update({ status: "paid" });
      console.log(`✅ Order ${dbOrderId} -> paid (settlement)`);
    } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
      await order.update({ status: "cancelled" });
      console.log(`❌ Order ${dbOrderId} -> cancelled (${transactionStatus})`);
    } else if (transactionStatus === "pending") {
      await order.update({ status: "pending" });
      console.log(`⏳ Order ${dbOrderId} -> pending`);
    }

    return res.status(200).json({ status: "success", message: "Notifikasi berhasil diproses." });

  } catch (error) {
    console.error("🔥 Error Webhook:", error.message);
    // TETAP return 200 agar Midtrans tidak retry
    return res.status(200).json({ status: "error_handled", message: "Terjadi kesalahan tapi sudah dicatat." });
  }
};
