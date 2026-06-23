const { Telegraf, Markup } = require("telegraf");
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

// ─── Keyboard — cara paling native Telegraf ───────────────────────────────────
const mainMenu = Markup.keyboard([
  ["📦 Daftar Produk", "🔍 Cek Pesanan"],
  ["🌐 Kunjungi Toko",  "❓ Bantuan"],
]).resize();

// ─── State cek order ──────────────────────────────────────────────────────────
const awaitingOrder = new Set();

// ─── /start ───────────────────────────────────────────────────────────────────
bot.start(async (ctx) => {
  const name = esc(ctx.from.first_name || "Pelanggan");

  // Langkah 1: kirim keyboard tanpa HTML dulu (paling reliable)
  await ctx.reply(
    `👋 Halo, ${name}! Selamat datang di E-Shop Support Bot 🛍️`,
    mainMenu
  );

  // Langkah 2: kirim detail menu dengan HTML (terpisah dari keyboard)
  await ctx.replyWithHTML(
    `Saya siap membantu Anda:\n\n` +
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
bot.hears("🌐 Kunjungi Toko", async (ctx) => {
  await ctx.reply("🌐 Buka toko kami di sini:", mainMenu);
  await ctx.reply(frontendUrl);
});
bot.hears("❓ Bantuan", (ctx) => sendHelp(ctx));

// ─── Pesan umum (input order ID + fallback) ───────────────────────────────────
bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;
  const text   = ctx.message.text.trim();

  if (awaitingOrder.has(chatId)) {
    awaitingOrder.delete(chatId);

    const orderId = parseInt(text, 10);
    if (isNaN(orderId)) {
      return ctx.reply("⚠️ Order ID tidak valid. Masukkan angka saja.\n\nContoh: 123", mainMenu);
    }

    try {
      const order = await Order.findByPk(orderId, {
        attributes: ["id", "status", "total_amount", "shipping_address", "tracking_number", "created_at"],
      });

      if (!order) {
        return ctx.reply(`😔 Order #${orderId} tidak ditemukan.\nPastikan nomor order Anda benar.`, mainMenu);
      }

      const tgl  = new Date(order.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
      const resi = order.tracking_number || "Belum tersedia";
      const stat = statusLabel[order.status] ?? order.status;

      await ctx.reply(
        `📋 Detail Pesanan #${order.id}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `📅 Tanggal : ${tgl}\n` +
        `💰 Total   : ${formatRupiah(order.total_amount)}\n` +
        `📍 Alamat  : ${order.shipping_address}\n` +
        `🚚 Resi    : ${resi}\n` +
        `📌 Status  : ${stat}\n\n` +
        `Lihat detail: ${frontendUrl}/orders`,
        mainMenu
      );
    } catch (err) {
      console.error("[TelegramBot] Error cek order:", err.message);
      ctx.reply("❌ Gagal mengambil data pesanan. Silakan coba lagi.", mainMenu);
    }
    return;
  }

  // Fallback
  ctx.reply("🤖 Perintah tidak dikenali.\n\nKetik /help untuk melihat panduan.", mainMenu);
});

// ─── Helper functions ─────────────────────────────────────────────────────────
async function sendProductList(ctx) {
  await ctx.reply("⏳ Mengambil data produk...", mainMenu);

  try {
    const products = await Product.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      attributes: ["id", "name", "price", "stock"],
    });

    if (!products.length) {
      return ctx.reply("😔 Belum ada produk yang tersedia saat ini.", mainMenu);
    }

    let msg = `🛍️ 5 Produk Terbaru\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    products.forEach((p, i) => {
      const stok = p.stock > 0 ? `✅ Stok: ${p.stock}` : "❌ Habis";
      msg +=
        `${i + 1}. ${p.name}\n` +
        `💰 ${formatRupiah(p.price)}  ${stok}\n` +
        `🔗 ${frontendUrl}/products/${p.id}\n\n`;
    });
    msg += `🌐 Semua produk: ${frontendUrl}/products`;

    ctx.reply(msg, mainMenu);
  } catch (err) {
    console.error("[TelegramBot] Error ambil produk:", err.message);
    ctx.reply("❌ Gagal mengambil data produk. Coba lagi nanti.", mainMenu);
  }
}

function askOrderId(ctx) {
  awaitingOrder.add(ctx.chat.id);
  ctx.reply("🔍 Masukkan Nomor Order ID Anda (angka):\n\nContoh: 123");
}

function sendHelp(ctx) {
  ctx.reply(
    `📖 Panduan Bot E-Shop\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Perintah:\n` +
    `/start – Mulai ulang\n` +
    `/produk – Lihat produk terbaru\n` +
    `/order – Cek status pesanan\n` +
    `/help – Panduan ini\n\n` +
    `💬 Atau gunakan tombol keyboard di bawah.`,
    mainMenu
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
