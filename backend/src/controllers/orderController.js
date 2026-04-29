const snap = require("../config/midtrans");
const { Order, OrderItem, Cart, Product, User } = require("../models");

// CUSTOMER: Melakukan Checkout
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipping_address } = req.body;

    // 1. Ambil isi keranjang user
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: "product" }],
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Keranjang belanja Anda kosong!",
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

    // 3. Buat data Pesanan Utama (Order)
    const newOrder = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: shipping_address || "Alamat default belum diisi",
      status: "pending",
    });

    // 4. Pindahkan item ke OrderItem & Kurangi Stok
    const orderItemsData = cartItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
    }));

    await OrderItem.bulkCreate(orderItemsData);

    // Update stok satu per satu (atau bisa menggunakan transaksi DB untuk keamanan data)
    for (const item of cartItems) {
      await Product.decrement("stock", {
        by: item.quantity,
        where: { id: item.product_id },
      });
    }

    // 5. Kosongkan keranjang
    await Cart.destroy({ where: { user_id: userId } });

    // 6. Integrasi Midtrans
    const userData = await User.findByPk(userId);

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${newOrder.id}-${Date.now()}`,
        gross_amount: totalAmount,
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
        total_amount: totalAmount,
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
// CUSTOMER: Melihat Riwayat Pesanannya
exports.getUserOrders = async (req, res) => {
  console.log("=== 🚨 CCTV: FUNGSI GET USER ORDERS DIPANGGIL ==="); 
  
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      // Kita matikan 'include' sementara untuk menghindari error relasi antar tabel
      order: [["created_at", "DESC"]], 
    });

    console.log("✅ Sukses mengambil data:", orders.length, "pesanan");

    return res.status(200).json({ 
      status: "success", 
      data: orders 
    });
  } catch (error) {
    // Nah, ini yang bikin errornya nggak sembunyi lagi!
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
    const { status, tracking_number } = req.body;
    const { id } = req.params;

    const updatedOrder = await Order.update(
      { status, tracking_number },
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

// ADMIN: Melihat Semua Pesanan Masuk
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [["created_at", "DESC"]], 
      // Jika Anda punya model User, sangat disarankan menambahkan include agar tahu siapa pembelinya:
      // include: [{ model: User, attributes: ['name', 'email'] }]
    });

    return res.status(200).json({ 
      status: "success", 
      data: orders 
    });
  } catch (error) {
    console.error("🔥 ERROR DI GET ALL ORDERS ADMIN:", error);
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil semua data pesanan.",
      error: error.message,
    });
  }
};

