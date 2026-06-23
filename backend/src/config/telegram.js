const { Telegraf, Markup } = require("telegraf");
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

// ─── Keyboard utama ───────────────────────────────────────────────────────────
const mainKeyboard = Markup.keyboard([
  ["📦 Daftar Produk", "🔍 Cek Pesanan"],
  ["🌐 Kunjungi Toko",  "❓ Bantuan"],
])
  .resize()
  .persistent();

// ─── State: user yang sedang menunggu input Order ID ─────────────────────────
const awaitingOrderId = new Set();

// ─── /start ───────────────────────────────────────────────────────────────────
bot.start((ctx) => {
  const firstName = ctx.from.first_name || "Pelanggan";
  const welcomeText =
    `👋 *Halo, ${firstName}\\!* Selamat datang di *E\\-Shop Support Bot* 🛍️\n\n` +
    `Saya siap membantu Anda dengan:\n` +
    `📦 *Daftar Produk* – lihat produk terbaru\n` +
    `🔍 *Cek Pesanan* – cek status order Anda\n` +
    `🌐 *Kunjungi Toko* – buka website kami\n` +
    `❓ *Bantuan* – panduan penggunaan\n\n` +
    `Pilih menu di bawah ini ⬇️`;

  ctx.replyWithMarkdownV2(welcomeText, mainKeyboard);
});

// ─── /help ────────────────────────────────────────────────────────────────────
bot.help((ctx) => sendHelp(ctx));

// ─── /produk ──────────────────────────────────────────────────────────────────
bot.command("produk", (ctx) => sendProductList(ctx));

// ─── /order ───────────────────────────────────────────────────────────────────
bot.command("order", (ctx) => askOrderId(ctx));

// ─── Tombol keyboard: Daftar Produk ──────────────────────────────────────────
bot.hears("📦 Daftar Produk", (ctx) => sendProductList(ctx));

// ─── Tombol keyboard: Cek Pesanan ─────────────────────────────────────────────
bot.hears("🔍 Cek Pesanan", (ctx) => askOrderId(ctx));

// ─── Tombol keyboard: Kunjungi Toko ──────────────────────────────────────────
bot.hears("🌐 Kunjungi Toko", (ctx) => {
  ctx.reply(`🌐 Klik link berikut untuk membuka toko kami:\n${frontendUrl}`, mainKeyboard);
});

// ─── Tombol keyboard: Bantuan ─────────────────────────────────────────────────
bot.hears("❓ Bantuan", (ctx) => sendHelp(ctx));

// ─── Handler: semua pesan teks (untuk input Order ID & fallback) ──────────────
bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;
  const text = ctx.message.text.trim();

  // Proses input Order ID jika user sedang dalam mode cek pesanan
  if (awaitingOrderId.has(chatId)) {
    awaitingOrderId.delete(chatId);
    const orderId = parseInt(text, 10);

    if (isNaN(orderId)) {
      return ctx.reply(
        "⚠️ Order ID tidak valid. Masukkan angka saja, contoh: 123",
        mainKeyboard
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
        return ctx.reply(
          `😔 Order dengan ID *#${orderId}* tidak ditemukan.\nPastikan nomor order Anda benar.`,
          { parse_mode: "Markdown", ...mainKeyboard }
        );
      }

      const statusLabel = statusEmoji[order.status] || order.status;
      const tanggal = new Date(order.created_at).toLocaleDateString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
      });
      const resi = order.tracking_number || "Belum tersedia";

      const detail =
        `📋 *Detail Pesanan #${order.id}*\n${"─".repeat(28)}\n\n` +
        `📅 Tanggal: ${tanggal}\n` +
        `💰 Total: ${formatRupiah(order.total_amount)}\n` +
        `📍 Alamat: ${order.shipping_address}\n` +
        `🚚 No\\. Resi: \`${resi}\`\n` +
        `📌 Status: *${statusLabel}*\n\n` +
        `🔗 [Lihat Detail di Toko](${frontendUrl}/orders)`;

      return ctx.reply(detail, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        ...mainKeyboard,
      });
    } catch (err) {
      console.error("[TelegramBot] Error cek order:", err.message);
      return ctx.reply(
        "❌ Gagal mengambil data pesanan. Silakan coba lagi.",
        mainKeyboard
      );
    }
  }

  // Fallback
  ctx.reply(
    "🤖 Maaf, saya belum mengerti pesan tersebut.\n\nKetik /help untuk melihat daftar perintah yang tersedia.",
    mainKeyboard
  );
});

// ─── Fungsi helper ────────────────────────────────────────────────────────────
async function sendProductList(ctx) {
  try {
    await ctx.reply("⏳ Sedang mengambil data produk terbaru...");

    const products = await Product.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      attributes: ["id", "name", "price", "stock", "image_url"],
    });

    if (!products.length) {
      return ctx.reply("😔 Belum ada produk yang tersedia saat ini.", mainKeyboard);
    }

    let pesan = `🛍️ *5 Produk Terbaru di E\\-Shop*\n${"─".repeat(28)}\n\n`;

    products.forEach((p, i) => {
      const stok = p.stock > 0 ? `✅ Stok: ${p.stock}` : "❌ Habis";
      // Escape karakter MarkdownV2 pada nama produk
      const namaSafe = p.name.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
      pesan +=
        `*${i + 1}\\. ${namaSafe}*\n` +
        `💰 ${formatRupiah(p.price)}\n` +
        `${stok}\n` +
        `🔗 [Lihat Produk](${frontendUrl}/products/${p.id})\n\n`;
    });

    pesan += `\n🌐 [Lihat semua produk di toko kami](${frontendUrl}/products)`;

    ctx.replyWithMarkdownV2(pesan, {
      disable_web_page_preview: true,
      ...mainKeyboard,
    });
  } catch (err) {
    console.error("[TelegramBot] Error ambil produk:", err.message);
    ctx.reply(
      "❌ Maaf, terjadi kesalahan saat mengambil data produk. Coba lagi nanti.",
      mainKeyboard
    );
  }
}

function askOrderId(ctx) {
  awaitingOrderId.add(ctx.chat.id);
  ctx.reply(
    "🔍 Silakan masukkan *Nomor Order ID* Anda (angka):\n\nContoh: `123`",
    { parse_mode: "Markdown" }
  );
}

function sendHelp(ctx) {
  const helpText =
    `📖 *Panduan Penggunaan Bot E\\-Shop*\n${"─".repeat(28)}\n\n` +
    `*Perintah yang tersedia:*\n` +
    `/start \\– Mulai ulang bot\n` +
    `/produk \\– Lihat 5 produk terbaru\n` +
    `/order \\– Cek status pesanan\n` +
    `/help \\– Tampilkan panduan ini\n\n` +
    `💬 Atau gunakan tombol menu di bawah keyboard Anda\\.`;

  ctx.replyWithMarkdownV2(helpText, mainKeyboard);
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
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
