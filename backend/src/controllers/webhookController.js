const { Order } = require("../models");

exports.midtransNotification = async (req, res) => {
  // Selalu return 200 ke Midtrans apapun yang terjadi
  try {
    const notif = req.body;
    console.log("🔔 Webhook Midtrans masuk:", JSON.stringify(notif));

    // Abaikan jika body kosong
    if (!notif || !notif.order_id || !notif.transaction_status) {
      console.log("⚠️  Body tidak lengkap, diabaikan.");
      return res.status(200).json({ status: "ok", message: "Diterima." });
    }

    const orderId = notif.order_id;
    const transactionStatus = notif.transaction_status;
    const fraudStatus = notif.fraud_status;

    console.log(`📦 Order ID: ${orderId} | Status: ${transactionStatus}`);

    // Abaikan test notification dari dashboard Midtrans
    if (orderId.startsWith("payment_notif_test")) {
      console.log("ℹ️  Test notification dari dashboard, diabaikan.");
      return res.status(200).json({ status: "ok", message: "Test notification." });
    }

    // Ekstrak DB order ID
    // Format: ORDER-{id}-{timestamp} → ambil bagian id-nya
    let dbOrderId = null;
    if (orderId.startsWith("ORDER-")) {
      dbOrderId = orderId.split("-")[1];
    } else if (!isNaN(orderId)) {
      dbOrderId = orderId;
    }

    if (!dbOrderId || isNaN(dbOrderId)) {
      console.log("⚠️  Format order_id tidak dikenali:", orderId);
      return res.status(200).json({ status: "ok" });
    }

    // Cari pesanan di database
    const order = await Order.findByPk(Number(dbOrderId));
    if (!order) {
      console.log(`⚠️  Order ID ${dbOrderId} tidak ada di database.`);
      return res.status(200).json({ status: "ok", message: "Order tidak ditemukan." });
    }

    // Tentukan status baru
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

    return res.status(200).json({ status: "success" });

  } catch (error) {
    console.error("🔥 Error Webhook:", error.message);
    return res.status(200).json({ status: "error_handled" });
  }
};
