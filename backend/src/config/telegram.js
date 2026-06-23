const TelegramBot = require("node-telegram-bot-api");
const Product = require("../models/Product");
const Order = require("../models/Order");

const token = process.env.TELEGRAM_BOT_TOKEN;
const botUsername = process.env.TELEGRAM_BOT_USERNAME || "your_bot";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

if (!token) {
  console.warn("⚠️  [TelegramBot] TELEGRAM_BOT_TOKEN belum diset di .env. Bot tidak akan berjalan.");
  module.exports = null;
  return;
}

// Gunakan polling agar cocok untuk local development (tidak perlu https/webhook publik)
const bot = new TelegramBot(token, { polling: true });

// ─── Format helpers ──────────────────────────────────────────────────────────
const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);

const statusEmoji = {
  pending:   "⏳ Menunggu Pembayaran",
  paid:      "✅ Sudah Dibayar",
  shipped:   "🚚 Dalam Pengiriman",
  completed: "🎉 Selesai",
  cancelled: "❌ Dibatalkan",
};

// ─── Keyboard Utama ──────────────────────────────────────────────────────────
const mainKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: "📦 Daftar Produk" }, { text: "🔍 Cek Pesanan" }],
      [{ text: "🌐 Kunjungi Toko" }, { text: "❓ Bantuan" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

// ─── Handler /start ──────────────────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const firstName = msg.from.first_name || "Pelanggan";
  const welcomeText =
    `👋 *Halo, ${firstName}!* Selamat datang di *E-Shop Support Bot* 🛍️\n\n` +
    `Saya siap membantu Anda dengan:\n` +
    `📦 *Daftar Produk* – lihat produk terbaru\n` +
    `🔍 *Cek Pesanan* – cek status order Anda\n` +
    `🌐 *Kunjungi Toko* – buka website kami\n` +
    `❓ *Bantuan* – panduan penggunaan\n\n` +
    `Pilih menu di bawah ini ⬇️`;

  bot.sendMessage(msg.chat.id, welcomeText, {
    parse_mode: "Markdown",
    ...mainKeyboard,
  });
});

// ─── Handler: Daftar Produk ──────────────────────────────────────────────────
bot.onText(/📦 Daftar Produk|\/produk/i, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, "⏳ Sedang mengambil data produk terbaru...");

    const products = await Product.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      attributes: ["id", "name", "price", "stock", "image_url"],
    });

    if (!products.length) {
      return bot.sendMessage(chatId, "😔 Belum ada produk yang tersedia saat ini.", mainKeyboard);
    }

    let pesan = `🛍️ *5 Produk Terbaru di E-Shop*\n${"─".repeat(30)}\n\n`;

    products.forEach((p, i) => {
      const stok = p.stock > 0 ? `✅ Stok: ${p.stock}` : "❌ Habis";
      pesan +=
        `*${i + 1}. ${p.name}*\n` +
        `💰 ${formatRupiah(p.price)}\n` +
        `${stok}\n` +
        `🔗 [Lihat Produk](${frontendUrl}/products/${p.id})\n\n`;
    });

    pesan += `\n🌐 [Lihat semua produk di toko kami](${frontendUrl}/products)`;

    bot.sendMessage(chatId, pesan, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      ...mainKeyboard,
    });
  } catch (err) {
    console.error("[TelegramBot] Error ambil produk:", err.message);
    bot.sendMessage(chatId, "❌ Maaf, terjadi kesalahan saat mengambil data produk. Coba lagi nanti.", mainKeyboard);
  }
});

// ─── Handler: Cek Pesanan (multi-step) ───────────────────────────────────────
const awaitingOrderId = new Set(); // set yang menyimpan chatId yang sedang menunggu input order

bot.onText(/🔍 Cek Pesanan|\/order/i, (msg) => {
  const chatId = msg.chat.id;
  awaitingOrderId.add(chatId);
  bot.sendMessage(
    chatId,
    "🔍 Silakan masukkan *Nomor Order ID* Anda (angka):\n\nContoh: `123`",
    { parse_mode: "Markdown" }
  );
});

// ─── Handler: Kunjungi Toko ──────────────────────────────────────────────────
bot.onText(/🌐 Kunjungi Toko|\/toko/i, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🌐 Klik link berikut untuk membuka toko kami:\n${frontendUrl}`,
    mainKeyboard
  );
});

// ─── Handler: Bantuan ────────────────────────────────────────────────────────
bot.onText(/❓ Bantuan|\/help/i, (msg) => {
  const helpText =
    `📖 *Panduan Penggunaan Bot E-Shop*\n${"─".repeat(30)}\n\n` +
    `*Perintah yang tersedia:*\n` +
    `/start – Mulai ulang bot\n` +
    `/produk – Lihat 5 produk terbaru\n` +
    `/order – Cek status pesanan\n` +
    `/toko – Link ke website toko\n` +
    `/help – Tampilkan panduan ini\n\n` +
    `💬 Atau gunakan tombol menu di bawah keyboard Anda.\n\n` +
    `Jika ada kendala lain, hubungi admin kami langsung.`;

  bot.sendMessage(msg.chat.id, helpText, {
    parse_mode: "Markdown",
    ...mainKeyboard,
  });
});

// ─── Handler: Pesan Umum (termasuk input Order ID) ───────────────────────────
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  // Abaikan jika sudah ditangani oleh handler lain
  const handledCommands = [
    "/start", "/produk", "/order", "/toko", "/help",
    "📦 Daftar Produk", "🔍 Cek Pesanan", "🌐 Kunjungi Toko", "❓ Bantuan",
  ];
  if (handledCommands.some((cmd) => text.toLowerCase().startsWith(cmd.toLowerCase()))) return;

  // ─── Proses input Order ID ───────────────────────────────────────────────
  if (awaitingOrderId.has(chatId)) {
    awaitingOrderId.delete(chatId);
    const orderId = parseInt(text, 10);

    if (isNaN(orderId)) {
      return bot.sendMessage(chatId, "⚠️ Order ID tidak valid. Masukkan angka saja, contoh: `123`", {
        parse_mode: "Markdown",
        ...mainKeyboard,
      });
    }

    try {
      const order = await Order.findByPk(orderId, {
        attributes: ["id", "status", "total_amount", "shipping_address", "tracking_number", "created_at"],
      });

      if (!order) {
        return bot.sendMessage(
          chatId,
          `😔 Order dengan ID *#${orderId}* tidak ditemukan.\nPastikan nomor order Anda benar.`,
          { parse_mode: "Markdown", ...mainKeyboard }
        );
      }

      const statusLabel = statusEmoji[order.status] || order.status;
      const tanggal = new Date(order.created_at).toLocaleDateString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
      });
      const resi = order.tracking_number || "Belum tersedia";

      const detailPesanan =
        `📋 *Detail Pesanan #${order.id}*\n${"─".repeat(30)}\n\n` +
        `📅 Tanggal: ${tanggal}\n` +
        `💰 Total: ${formatRupiah(order.total_amount)}\n` +
        `📍 Alamat: ${order.shipping_address}\n` +
        `🚚 No. Resi: \`${resi}\`\n` +
        `📌 Status: *${statusLabel}*\n\n` +
        `🔗 [Lihat Detail di Toko](${frontendUrl}/orders)`;

      bot.sendMessage(chatId, detailPesanan, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        ...mainKeyboard,
      });
    } catch (err) {
      console.error("[TelegramBot] Error cek order:", err.message);
      bot.sendMessage(chatId, "❌ Gagal mengambil data pesanan. Silakan coba lagi.", mainKeyboard);
    }
    return;
  }

  // ─── Fallback: pesan tidak dikenal ──────────────────────────────────────
  bot.sendMessage(
    chatId,
    `🤖 Maaf, saya belum mengerti pesan tersebut.\n\nKetik /help untuk melihat daftar perintah yang tersedia.`,
    mainKeyboard
  );
});

// ─── Error global ────────────────────────────────────────────────────────────
bot.on("polling_error", (err) => {
  console.error("[TelegramBot] Polling error:", err.code, err.message);
});

console.log(`✅ [TelegramBot] Bot @${botUsername} aktif dan mendengarkan pesan...`);

module.exports = bot;
