const { Telegraf } = require("telegraf");
const Product = require("../models/Product");
const Order = require("../models/Order");

const token       = process.env.TELEGRAM_BOT_TOKEN;
const botUsername = process.env.TELEGRAM_BOT_USERNAME || "your_bot";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

if (!token) {
  console.warn("⚠️  [TelegramBot] TELEGRAM_BOT_TOKEN belum diset di .env.");
  module.exports = null;
  return;
}

const bot = new Telegraf(token);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// Escape SEMUA karakter khusus HTML
const esc = (str) =>
  String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const statusLabel = {
  pending:   "⏳ Menunggu Pembayaran",
  paid:      "✅ Sudah Dibayar",
  shipped:   "🚚 Dalam Pengiriman",
  completed: "🎉 Selesai",
  cancelled: "❌ Dibatalkan",
};

// ─── Keyboard (plain object, paling compatible) ───────────────────────────────
const KEYBOARD = {
  keyboard: [
    ["📦 Daftar Produk", "🔍 Cek Pesanan"],
    ["🌐 Kunjungi Toko",  "❓ Bantuan"],
  ],
  resize_keyboard: true,
  is_persistent: true,
};

// Shortcut: replyWithHTML + keyboard
const reply = (ctx, html, extra = {}) =>
  ctx.replyWithHTML(html, { reply_markup: KEYBOARD, ...extra });

// ─── State cek order ──────────────────────────────────────────────────────────
const awaitingOrder = new Set();

// ─── /start ───────────────────────────────────────────────────────────────────
bot.start((ctx) => {
  const name = esc(ctx.from.first_name || "Pelanggan");
  reply(ctx,
    `👋 <b>Halo, ${name}!</b> Selamat datang di <b>E-Shop Support Bot</b> 🛍️\n\n` +
    `Saya siap membantu Anda:\n` +
    `📦 <b>Daftar Produk</b> – lihat produk terbaru\n` +
    `🔍 <b>Cek Pesanan</b> – cek status order Anda\n` +
    `🌐 <b>Kunjungi Toko</b> – buka website kami\n` +
    `❓ <b>Bantuan</b> – panduan penggunaan\n\n` +
    `Pilih menu di bawah ⬇️`
  );
});

// ─── /help ────────────────────────────────────────────────────────────────────
bot.command("help", (ctx) => sendHelp(ctx));
bot.help((ctx) => sendHelp(ctx));

// ─── /produk ──────────────────────────────────────────────────────────────────
bot.command("produk", (ctx) => sendProductList(ctx));

// ─── /order ───────────────────────────────────────────────────────────────────
bot.command("order", (ctx) => askOrderId(ctx));

// ─── Tombol keyboard ─────────────────────────────────────────────────────────
bot.hears("📦 Daftar Produk", (ctx) => sendProductList(ctx));
bot.hears("🔍 Cek Pesanan",   (ctx) => askOrderId(ctx));
bot.hears("🌐 Kunjungi Toko", (ctx) =>
  reply(ctx, `🌐 Buka toko kami di sini:\n<a href="${frontendUrl}">${frontendUrl}</a>`)
);
bot.hears("❓ Bantuan", (ctx) => sendHelp(ctx));

// ─── Pesan umum (input order ID + fallback) ───────────────────────────────────
bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;
  const text   = ctx.message.text.trim();

  if (awaitingOrder.has(chatId)) {
    awaitingOrder.delete(chatId);

    const orderId = parseInt(text, 10);
    if (isNaN(orderId)) {
      return reply(ctx, `⚠️ Order ID tidak valid. Masukkan angka saja.\n\nContoh: <code>123</code>`);
    }

    try {
      const order = await Order.findByPk(orderId, {
        attributes: ["id", "status", "total_amount", "shipping_address", "tracking_number", "created_at"],
      });

      if (!order) {
        return reply(ctx, `😔 Order <b>#${orderId}</b> tidak ditemukan.\nPastikan nomor order Anda benar.`);
      }

      const tgl  = new Date(order.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
      const resi = order.tracking_number || "Belum tersedia";

      reply(ctx,
        `📋 <b>Detail Pesanan #${order.id}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `📅 Tanggal : ${tgl}\n` +
        `💰 Total   : ${formatRupiah(order.total_amount)}\n` +
        `📍 Alamat  : ${esc(order.shipping_address)}\n` +
        `🚚 Resi    : <code>${esc(resi)}</code>\n` +
        `📌 Status  : <b>${statusLabel[order.status] ?? order.status}</b>\n\n` +
        `🔗 <a href="${frontendUrl}/orders">Lihat detail di toko</a>`,
        { disable_web_page_preview: true }
      );
    } catch (err) {
      console.error("[TelegramBot] Error cek order:", err.message);
      reply(ctx, "❌ Gagal mengambil data pesanan. Silakan coba lagi.");
    }
    return;
  }

  // Fallback
  reply(ctx, "🤖 Perintah tidak dikenali.\n\nKetik /help untuk melihat panduan.");
});

// ─── Helper functions ─────────────────────────────────────────────────────────
async function sendProductList(ctx) {
  await ctx.reply("⏳ Mengambil data produk...");

  try {
    const products = await Product.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      attributes: ["id", "name", "price", "stock"],
    });

    if (!products.length) {
      return reply(ctx, "😔 Belum ada produk yang tersedia saat ini.");
    }

    let html = `🛍️ <b>5 Produk Terbaru</b>\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    products.forEach((p, i) => {
      const stok = p.stock > 0 ? `✅ Stok: ${p.stock}` : "❌ Habis";
      html +=
        `<b>${i + 1}. ${esc(p.name)}</b>\n` +
        `💰 ${formatRupiah(p.price)}  ${stok}\n` +
        `🔗 <a href="${frontendUrl}/products/${p.id}">Lihat Produk</a>\n\n`;
    });
    html += `🌐 <a href="${frontendUrl}/products">Lihat semua produk</a>`;

    reply(ctx, html, { disable_web_page_preview: true });
  } catch (err) {
    console.error("[TelegramBot] Error ambil produk:", err.message);
    reply(ctx, "❌ Gagal mengambil data produk. Coba lagi nanti.");
  }
}

function askOrderId(ctx) {
  awaitingOrder.add(ctx.chat.id);
  ctx.replyWithHTML(
    "🔍 Masukkan <b>Nomor Order ID</b> Anda:\n\nContoh: <code>123</code>"
    // sengaja tidak kirim keyboard agar user fokus ketik angka
  );
}

function sendHelp(ctx) {
  reply(ctx,
    `📖 <b>Panduan Bot E-Shop</b>\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `<b>Perintah:</b>\n` +
    `/start – Mulai ulang\n` +
    `/produk – Lihat produk terbaru\n` +
    `/order – Cek status pesanan\n` +
    `/help – Panduan ini\n\n` +
    `💬 Atau gunakan tombol keyboard di bawah.`
  );
}

// ─── Error & Launch ───────────────────────────────────────────────────────────
bot.catch((err, ctx) => {
  console.error(`[TelegramBot] Error (${ctx.updateType}):`, err.message);
});

bot.launch().then(() => {
  console.log(`✅ [TelegramBot] Bot @${botUsername} aktif (polling)...`);
}).catch((err) => {
  console.error("❌ [TelegramBot] Gagal start:", err.message);
});

process.once("SIGINT",  () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
