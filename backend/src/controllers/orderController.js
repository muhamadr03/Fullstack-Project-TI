const snap = require("../config/midtrans");
const { Order, OrderItem, Cart, Product, User, Coupon, ProductImage } = require("../models");

// CUSTOMER: Melakukan Checkout
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipping_address, coupon_code, cart_item_ids } = req.body;

    // 1. Ambil isi keranjang user
    // Jika ada cart_item_ids, filter hanya item yang dipilih
    const { Op } = require("sequelize");
    const whereClause = { user_id: userId };
    if (cart_item_ids && Array.isArray(cart_item_ids) && cart_item_ids.length > 0) {
      whereClause.id = { [Op.in]: cart_item_ids };
    }

    const cartItems = await Cart.findAll({
      where: whereClause,
      include: [{ model: Product, as: "product" }],
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Barang yang dipilih tidak ditemukan di keranjang!",
      });
    }

    // 2. Validasi Stok & Hitung Total Harga
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          status: "fail",
          message: `Stok produk ${item.product.name} tidak mencukupi (Sisa: ${item.product.stock})`,
        });
      }
      totalAmount += item.quantity * item.product.price;
    }

    // 2.5 Cek dan Hitung Diskon Kupon
    let finalAmount = totalAmount;
    let discountAmount = 0;

    if (coupon_code) {
      const coupon = await Coupon.findOne({ where: { code: coupon_code, is_active: true } });
      if (coupon) {
        if (new Date() > new Date(coupon.valid_until)) {
          return res.status(400).json({ status: "fail", message: "Kupon sudah kedaluwarsa." });
        }
        
        const calculatedDiscount = Math.floor((totalAmount * coupon.discount_percentage) / 100);
        discountAmount = coupon.max_discount ? Math.min(calculatedDiscount, coupon.max_discount) : calculatedDiscount;
        finalAmount = totalAmount - discountAmount;
      } else {
        return res.status(400).json({ status: "fail", message: "Kupon tidak valid atau tidak aktif." });
      }
    }

    // 3. Buat data Pesanan Utama (Order)
    const newOrder = await Order.create({
      user_id: userId,
      total_amount: finalAmount,
      shipping_address: shipping_address || "Alamat default belum diisi",
      status: "pending",
      coupon_code: coupon_code || null,
      discount_amount: discountAmount,
    });

    // 4. Pindahkan item ke OrderItem & Kurangi Stok
    const orderItemsData = cartItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
      selected_image_url: item.selected_image_url || null,
      selected_size: item.selected_size || null,
    }));

    await OrderItem.bulkCreate(orderItemsData);

    // Update stok dan jumlah terjual (sold_count)
    for (const item of cartItems) {
      await Product.decrement("stock", {
        by: item.quantity,
        where: { id: item.product_id },
      });
      await Product.increment("sold_count", {
        by: item.quantity,
        where: { id: item.product_id },
      });
    }

    // 5. Hapus item yang baru saja dicheckout dari keranjang
    const processedCartIds = cartItems.map(item => item.id);
    await Cart.destroy({ where: { id: processedCartIds } });

    // 6. Integrasi Midtrans
    const userData = await User.findByPk(userId);

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${newOrder.id}-${Date.now()}`,
        gross_amount: finalAmount,
      },
      customer_details: {
        first_name: userData.name,
        email: userData.email,
      },
    };

    const midtransTransaction = await snap.createTransaction(parameter);
    const snapToken = midtransTransaction.token;

    // Update token ke database
    await newOrder.update({ snap_token: snapToken });

    // 7. Response Sukses
    return res.status(201).json({
      status: "success",
      message: "Checkout berhasil, silakan lakukan pembayaran.",
      data: {
        order_id: newOrder.id,
        total_amount: finalAmount,
        discount_amount: discountAmount,
        snap_token: snapToken,
        redirect_url: midtransTransaction.redirect_url,
      },
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Gagal melakukan checkout.",
      error: error.message,
    });
  }
};

// CUSTOMER: Melihat Riwayat Pesanannya
exports.getUserOrders = async (req, res) => {
  try {
    const { OrderItem, Product, ProductImage, Review } = require('../models');
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
              include: [
                { model: ProductImage, as: "images", attributes: ["image_url", "is_primary"] },
              ],
            },
          ],
        },
        {
          // Cek review yang sudah ada di pesanan ini
          model: Review,
          as: "reviews",
          required: false,
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error("🔥 ERROR FATAL DI GETUSERORDERS:", error);
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil riwayat pesanan.",
      error: error.message,
    });
  }
};

// ADMIN: Update Status Resi/Pengiriman
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, tracking_number, courier } = req.body;
    const { id } = req.params;

    const updatedOrder = await Order.update(
      { status, tracking_number, courier },
      { where: { id } },
    );

    if (updatedOrder[0] === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }

    return res.status(200).json({
      status: "success",
      message: "Status pesanan berhasil diupdate.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengupdate status pesanan.",
    });
  }
};

// CUSTOMER: Konfirmasi pesanan sudah diterima
exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ where: { id, user_id: userId } });

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }

    if (order.status !== "shipped") {
      return res.status(400).json({
        message: "Pesanan hanya bisa dikonfirmasi setelah berstatus 'Dikirim'.",
      });
    }

    await order.update({ status: "completed" });

    return res.status(200).json({
      status: "success",
      message: "Pesanan berhasil dikonfirmasi selesai. Terima kasih!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengkonfirmasi pesanan.",
    });
  }
};

// ADMIN: Melihat Semua Pesanan Masuk
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'price'], include: [{ model: ProductImage, as: 'images', attributes: ['image_url', 'is_primary'] }] }] }
      ]
    });
    return res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    console.error('ERROR DI GET ALL ORDERS ADMIN:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil semua data pesanan.', error: error.message });
  }
};

// CUSTOMER: Mengajukan permintaan pembatalan pesanan
exports.requestCancellation = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'Alasan pembatalan wajib diisi.' });
    }

    const order = await Order.findOne({ where: { id, user_id: userId } });

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    // Hanya pesanan dengan status pending atau paid yang bisa diajukan pembatalan
    if (!['pending', 'paid'].includes(order.status)) {
      return res.status(400).json({
        message: 'Pembatalan hanya bisa diajukan untuk pesanan dengan status Menunggu Bayar atau Sudah Dibayar.',
      });
    }

    // Cegah pengajuan ganda
    if (order.cancellation_status === 'requested') {
      return res.status(400).json({ message: 'Permintaan pembatalan sudah diajukan dan sedang ditinjau admin.' });
    }

    await order.update({
      cancellation_status: 'requested',
      cancellation_reason: reason.trim(),
      cancellation_note: null,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Permintaan pembatalan berhasil diajukan. Silakan tunggu persetujuan admin.',
    });
  } catch (error) {
    console.error('Error requestCancellation:', error);
    return res.status(500).json({ message: 'Gagal mengajukan pembatalan.', error: error.message });
  }
};

// ADMIN: Menyetujui atau menolak permintaan pembatalan
exports.handleCancellationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Aksi tidak valid. Gunakan approve atau reject.' });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    if (order.cancellation_status !== 'requested') {
      return res.status(400).json({ message: 'Tidak ada permintaan pembatalan aktif untuk pesanan ini.' });
    }

    if (action === 'approve') {
      // Setujui: ubah status order menjadi cancelled
      await order.update({
        status: 'cancelled',
        cancellation_status: 'approved',
        cancellation_note: note?.trim() || null,
      });

      // Kembalikan stok produk jika pesanan sudah paid/shipped
      if (['paid', 'shipped'].includes(order.status)) {
        const { OrderItem, Product } = require('../models');
        const items = await OrderItem.findAll({ where: { order_id: id } });
        for (const item of items) {
          await Product.increment('stock', { by: item.quantity, where: { id: item.product_id } });
          await Product.decrement('sold_count', { by: item.quantity, where: { id: item.product_id } });
        }
      }

      return res.status(200).json({
        status: 'success',
        message: 'Permintaan pembatalan disetujui. Pesanan telah dibatalkan.',
      });
    } else {
      // Tolak: kembalikan status cancellation ke null agar bisa diajukan lagi atau lanjut
      await order.update({
        cancellation_status: 'rejected',
        cancellation_note: note?.trim() || null,
      });

      return res.status(200).json({
        status: 'success',
        message: 'Permintaan pembatalan ditolak.',
      });
    }
  } catch (error) {
    console.error('Error handleCancellationRequest:', error);
    return res.status(500).json({ message: 'Gagal memproses permintaan pembatalan.', error: error.message });
  }
};

