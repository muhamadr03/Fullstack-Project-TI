const { Telegraf } = require("telegraf");
const Product = require("../models/Product");
const Order = require("../models/Order");

const token = process.env.TELEGRAM_BOT_TOKEN;
const botUsername = process.env.TELEGRAM_BOT_USERNAME || "your_bot";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

if (!token) {
  console.warn(
    "⚠️  [TelegramBot] TELEGRAM_BOT_TOKEN belum diset di .env. Bot tidak akan berjalan."
  );
  module.exports = null;
  return;
}

const bot = new Telegraf(token);

// ─── Format helpers ───────────────────────────────────────────────────────────
const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);

const statusEmoji = {
  pending:   "⏳ Menunggu Pembayaran",
  paid:      "✅ Sudah Dibayar",
  shipped:   "🚚 Dalam Pengiriman",
  completed: "🎉 Selesai",
  cancelled: "❌ Dibatalkan",
};

// Escape karakter khusus HTML agar aman dikirim via parse_mode HTML
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</, "&lt;")
    .replace(/>/g, "&gt;");

// ─── Keyboard utama (plain object — paling reliable) ─────────────────────────
const mainReplyMarkup = {
  reply_markup: {
    keyboard: [
      ["📦 Daftar Produk", "🔍 Cek Pesanan"],
      ["🌐 Kunjungi Toko",  "❓ Bantuan"],
    ],
    resize_keyboard: true,
    is_persistent: true,
  },
};

// Helper: kirim pesan HTML + keyboard sekaligus
const replyHTML = (ctx, text, extra = {}) =>
  ctx.reply(text, { parse_mode: "HTML", ...mainReplyMarkup, ...extra });

// ─── State: user yang sedang menunggu input Order ID ─────────────────────────
const awaitingOrderId = new Set();

// ─── /start ───────────────────────────────────────────────────────────────────
bot.start((ctx) => {
  const firstName = escapeHtml(ctx.from.first_name || "Pelanggan");
  const welcomeText =
    `👋 <b>Halo, ${firstName}!</b> Selamat datang di <b>E-Shop Support Bot</b> 🛍️\n\n` +
    `Saya siap membantu Anda dengan:\n` +
    `📦 <b>Daftar Produk</b> – lihat produk terbaru\n` +
    `🔍 <b>Cek Pesanan</b> – cek status order Anda\n` +
    `🌐 <b>Kunjungi Toko</b> – buka website kami\n` +
    `❓ <b>Bantuan</b> – panduan penggunaan\n\n` +
    `Pilih menu di bawah ini ⬇️`;

  replyHTML(ctx, welcomeText);
});

// ─── /help ────────────────────────────────────────────────────────────────────
bot.help((ctx) => sendHelp(ctx));

// ─── /produk ──────────────────────────────────────────────────────────────────
bot.command("produk", (ctx) => sendProductList(ctx));

// ─── /order ───────────────────────────────────────────────────────────────────
bot.command("order", (ctx) => askOrderId(ctx));

// ─── Tombol keyboard ─────────────────────────────────────────────────────────
bot.hears("📦 Daftar Produk", (ctx) => sendProductList(ctx));
bot.hears("🔍 Cek Pesanan",   (ctx) => askOrderId(ctx));
bot.hears("🌐 Kunjungi Toko", (ctx) => {
  replyHTML(
    ctx,
    `🌐 Klik link berikut untuk membuka toko kami:\n<a href="${frontendUrl}">${frontendUrl}</a>`
  );
});
bot.hears("❓ Bantuan", (ctx) => sendHelp(ctx));

// ─── Handler: semua pesan teks (input Order ID & fallback) ───────────────────
bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;
  const text   = ctx.message.text.trim();

  // Proses input Order ID
  if (awaitingOrderId.has(chatId)) {
    awaitingOrderId.delete(chatId);
    const orderId = parseInt(text, 10);

    if (isNaN(orderId)) {
      return replyHTML(
        ctx,
        "⚠️ Order ID tidak valid. Masukkan angka saja, contoh: <code>123</code>"
      );
    }

    try {
      const order = await Order.findByPk(orderId, {
        attributes: [
          "id", "status", "total_amount",
          "shipping_address", "tracking_number", "created_at",
        ],
      });

      if (!order) {
        return replyHTML(
          ctx,
          `😔 Order dengan ID <b>#${orderId}</b> tidak ditemukan.\nPastikan nomor order Anda benar.`
        );
      }

      const statusLabel = statusEmoji[order.status] || order.status;
      const tanggal = new Date(order.created_at).toLocaleDateString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
      });
      const resi = order.tracking_number || "Belum tersedia";

      const detail =
        `📋 <b>Detail Pesanan #${order.id}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `📅 Tanggal: ${tanggal}\n` +
        `💰 Total: ${formatRupiah(order.total_amount)}\n` +
        `📍 Alamat: ${escapeHtml(order.shipping_address)}\n` +
        `🚚 No. Resi: <code>${escapeHtml(resi)}</code>\n` +
        `📌 Status: <b>${statusLabel}</b>\n\n` +
        `🔗 <a href="${frontendUrl}/orders">Lihat Detail di Toko</a>`;

      return replyHTML(ctx, detail, { disable_web_page_preview: true });
    } catch (err) {
      console.error("[TelegramBot] Error cek order:", err.message);
      return replyHTML(ctx, "❌ Gagal mengambil data pesanan. Silakan coba lagi.");
    }
  }

  // Fallback
  replyHTML(
    ctx,
    "🤖 Maaf, saya belum mengerti pesan tersebut.\n\nKetik /help untuk melihat daftar perintah yang tersedia."
  );
});

// ─── Fungsi helper ────────────────────────────────────────────────────────────
async function sendProductList(ctx) {
  try {
    await ctx.reply("⏳ Sedang mengambil data produk terbaru...");

    const products = await Product.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      attributes: ["id", "name", "price", "stock"],
    });

    if (!products.length) {
      return replyHTML(ctx, "😔 Belum ada produk yang tersedia saat ini.");
    }

    let pesan =
      `🛍️ <b>5 Produk Terbaru di E-Shop</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    products.forEach((p, i) => {
      const stok = p.stock > 0 ? `✅ Stok: ${p.stock}` : "❌ Habis";
      pesan +=
        `<b>${i + 1}. ${escapeHtml(p.name)}</b>\n` +
        `💰 ${formatRupiah(p.price)}\n` +
        `${stok}\n` +
        `🔗 <a href="${frontendUrl}/products/${p.id}">Lihat Produk</a>\n\n`;
    });

    pesan += `🌐 <a href="${frontendUrl}/products">Lihat semua produk di toko kami</a>`;

    replyHTML(ctx, pesan, { disable_web_page_preview: true });
  } catch (err) {
    console.error("[TelegramBot] Error ambil produk:", err.message);
    replyHTML(ctx, "❌ Maaf, terjadi kesalahan saat mengambil data produk. Coba lagi nanti.");
  }
}

function askOrderId(ctx) {
  awaitingOrderId.add(ctx.chat.id);
  ctx.reply(
    "🔍 Silakan masukkan <b>Nomor Order ID</b> Anda (angka):\n\nContoh: <code>123</code>",
    { parse_mode: "HTML" }
  );
}

function sendHelp(ctx) {
  const helpText =
    `📖 <b>Panduan Penggunaan Bot E-Shop</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `<b>Perintah yang tersedia:</b>\n` +
    `/start – Mulai ulang bot\n` +
    `/produk – Lihat 5 produk terbaru\n` +
    `/order – Cek status pesanan\n` +
    `/help – Tampilkan panduan ini\n\n` +
    `💬 Atau gunakan tombol menu di bawah keyboard Anda.`;

  replyHTML(ctx, helpText);
}

// ─── Error handler ────────────────────────────────────────────────────────────
bot.catch((err, ctx) => {
  console.error(`[TelegramBot] Error pada update ${ctx.updateType}:`, err.message);
});

// ─── Launch bot (polling) ─────────────────────────────────────────────────────
bot
  .launch()
  .then(() => {
    console.log(`✅ [TelegramBot] Bot @${botUsername} aktif dan mendengarkan pesan (polling)...`);
  })
  .catch((err) => {
    console.error("❌ [TelegramBot] Gagal menjalankan bot:", err.message);
  });

// Graceful stop saat server dimatikan
process.once("SIGINT",  () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
