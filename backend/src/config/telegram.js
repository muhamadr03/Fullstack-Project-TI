const { Telegraf, Markup } = require("telegraf");
const Product = require("../models/Product");
const Order = require("../models/Order");

const token       = process.env.TELEGRAM_BOT_TOKEN;
const botUsername = process.env.TELEGRAM_BOT_USERNAME || "your_bot";
const frontendUrl = process.env.FRONTEND_URL || "https://website-toko-anda.com";

if (!token) {
  console.warn("⚠️  [TelegramBot] TELEGRAM_BOT_TOKEN belum diset di .env.");
  module.exports = null;
  return;
}

const bot = new Telegraf(token);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

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

// ─── Inline Keyboard — muncul di dalam pesan, support SEMUA platform ──────────
const mainMenuInline = Markup.inlineKeyboard([
  [
    Markup.button.callback("📦 Daftar Produk", "menu_products"),
    Markup.button.callback("🔍 Cek Pesanan",   "menu_order"),
  ],
  [
    Markup.button.callback("🌐 Kunjungi Toko", "menu_store"),
    Markup.button.callback("❓ Bantuan",        "menu_help"),
  ],
]);

// ─── State: menunggu input order ID ──────────────────────────────────────────
const awaitingOrder = new Set();

// ─── /start ───────────────────────────────────────────────────────────────────
bot.start((ctx) => {
  const name = esc(ctx.from.first_name || "Pelanggan");
  ctx.replyWithHTML(
    `👋 <b>Halo, ${name}!</b> Selamat datang di <b>E-Shop Support Bot</b> 🛍️\n\n` +
    `Saya siap membantu Anda:\n\n` +
    `📦 <b>Daftar Produk</b> – lihat produk terbaru\n` +
    `🔍 <b>Cek Pesanan</b> – cek status order Anda\n` +
    `🌐 <b>Kunjungi Toko</b> – buka website kami\n` +
    `❓ <b>Bantuan</b> – panduan penggunaan\n\n` +
    `Pilih menu di bawah ini ⬇️`,
    mainMenuInline
  );
});

// ─── /help & /produk & /order ─────────────────────────────────────────────────
bot.help((ctx)    => sendHelp(ctx));
bot.command("help",   (ctx) => sendHelp(ctx));
bot.command("produk", (ctx) => sendProductList(ctx));
bot.command("order",  (ctx) => askOrderId(ctx));

// ─── Callback dari tombol inline ──────────────────────────────────────────────
bot.action("menu_products", async (ctx) => {
  await ctx.answerCbQuery(); // wajib agar loading spinner hilang
  sendProductList(ctx);
});

bot.action("menu_order", async (ctx) => {
  await ctx.answerCbQuery();
  askOrderId(ctx);
});

bot.action("menu_help", async (ctx) => {
  await ctx.answerCbQuery();
  sendHelp(ctx);
});
bot.action("menu_store", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.replyWithHTML(
    `🌐 <b>Kunjungi Toko Kami</b>\n\nBuka link berikut di browser Anda:\n${frontendUrl}`
  );
});


// ─── Pesan teks: input order ID + fallback ────────────────────────────────────
bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;
  const text   = ctx.message.text.trim();

  // Abaikan perintah slash agar tidak double-handle
  if (text.startsWith("/")) return;

  if (awaitingOrder.has(chatId)) {
    awaitingOrder.delete(chatId);

    try {
      let order = null;
      const orderId = parseInt(text, 10);

      // Coba cari berdasarkan ID (jika inputan berupa angka)
      if (!isNaN(orderId)) {
        order = await Order.findByPk(orderId, {
          attributes: ["id", "status", "total_amount", "shipping_address", "tracking_number", "created_at"],
        });
      }

      // Jika belum ketemu atau inputan bukan angka, cari berdasarkan nomor resi
      if (!order) {
        order = await Order.findOne({
          where: { tracking_number: text },
          attributes: ["id", "status", "total_amount", "shipping_address", "tracking_number", "created_at"],
        });
      }

      if (!order) {
        return ctx.replyWithHTML(
          `😔 Pesanan dengan Order ID / Nomor Resi <b>${esc(text)}</b> tidak ditemukan.\nPastikan data yang Anda masukkan benar.`,
          mainMenuInline
        );
      }

      const tgl  = new Date(order.created_at).toLocaleDateString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
      });
      const resi = order.tracking_number || "Belum tersedia";
      const stat = statusLabel[order.status] ?? order.status;

      ctx.replyWithHTML(
        `📋 <b>Detail Pesanan #${order.id}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `📅 Tanggal : ${tgl}\n` +
        `💰 Total   : ${formatRupiah(order.total_amount)}\n` +
        `📍 Alamat  : ${esc(order.shipping_address)}\n` +
        `🚚 Resi    : <code>${esc(resi)}</code>\n` +
        `📌 Status  : <b>${stat}</b>`,
        Markup.inlineKeyboard([
          [Markup.button.callback("🔗 Lihat Detail Pesanan", "menu_orders")],
          [Markup.button.callback("🏠 Menu Utama", "back_to_menu")],
        ])
      );
    } catch (err) {
      console.error("[TelegramBot] Error cek order:", err.message);
      ctx.replyWithHTML("❌ Gagal mengambil data pesanan. Silakan coba lagi.", mainMenuInline);
    }
    return;
  }

  // Fallback
  ctx.replyWithHTML(
    "🤖 Perintah tidak dikenali.\n\nGunakan tombol menu di bawah atau ketik /help.",
    mainMenuInline
  );
});

// ─── Callback: kembali ke menu utama ─────────────────────────────────────────
bot.action("back_to_menu", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.replyWithHTML(
    "🏠 <b>Menu Utama</b>\n\nPilih menu yang Anda inginkan:",
    mainMenuInline
  );
});

// ─── Callback: lihat pesanan ──────────────────────────────────────────────────
bot.action("menu_orders", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.replyWithHTML(
    `📦 <b>Halaman Pesanan</b>\n\nBuka link berikut untuk melihat pesanan Anda:\n${frontendUrl}/orders`
  );
});

// ─── Callback: lihat semua produk ─────────────────────────────────────────────
bot.action("menu_all_products", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.replyWithHTML(
    `🛒 <b>Semua Produk</b>\n\nBuka link berikut untuk melihat semua produk:\n${frontendUrl}/products`
  );
});

// ─── Callback: detail produk spesifik ────────────────────────────────────────
bot.action(/^product_(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const productId = ctx.match[1];
  ctx.replyWithHTML(
    `🔗 <b>Detail Produk</b>\n\nBuka link berikut untuk melihat produk:\n${frontendUrl}/products/${productId}`
  );
});


// ─── Helper: Daftar Produk ────────────────────────────────────────────────────
async function sendProductList(ctx) {
  await ctx.replyWithHTML("⏳ Mengambil data produk terbaru...");

  try {
    const products = await Product.findAll({
      limit: 5,
      order: [["created_at", "DESC"]],
      attributes: ["id", "name", "price", "stock"],
    });

    if (!products.length) {
      return ctx.replyWithHTML(
        "😔 Belum ada produk yang tersedia saat ini.",
        mainMenuInline
      );
    }

    let html = `🛍️ <b>5 Produk Terbaru di E-Shop</b>\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    const buttons = [];

    products.forEach((p, i) => {
      const stok = p.stock > 0 ? `✅ ${p.stock} stok` : "❌ Habis";
      html +=
        `<b>${i + 1}. ${esc(p.name)}</b>\n` +
        `💰 ${formatRupiah(p.price)}  |  ${stok}\n\n`;
      buttons.push([
        Markup.button.callback(`🔗 ${i + 1}. ${p.name}`, `product_${p.id}`),
      ]);
    });

    buttons.push([
      Markup.button.callback("🛒 Lihat Semua Produk", "menu_all_products"),
    ]);
    buttons.push([
      Markup.button.callback("🏠 Menu Utama", "back_to_menu"),
    ]);

    ctx.replyWithHTML(html, Markup.inlineKeyboard(buttons));
  } catch (err) {
    console.error("[TelegramBot] Error ambil produk:", err.message);
    ctx.replyWithHTML(
      "❌ Gagal mengambil data produk. Coba lagi nanti.",
      mainMenuInline
    );
  }
}

// ─── Helper: Tanya Order ID / Nomor Resi ──────────────────────────────────────
function askOrderId(ctx) {
  awaitingOrder.add(ctx.chat.id);
  ctx.replyWithHTML(
    "🔍 Masukkan <b>Nomor Order ID</b> atau <b>Nomor Resi</b> Anda:\n\nContoh: <code>123</code> atau <code>RESI12345</code>"
  );
}

// ─── Helper: Bantuan ─────────────────────────────────────────────────────────
function sendHelp(ctx) {
  ctx.replyWithHTML(
    `📖 <b>Panduan Bot E-Shop</b>\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `<b>Perintah:</b>\n` +
    `/start – Mulai ulang bot\n` +
    `/produk – Lihat 5 produk terbaru\n` +
    `/order – Cek status pesanan\n` +
    `/help – Panduan ini\n\n` +
    `💬 Atau gunakan tombol di bawah pesan.`,
    mainMenuInline
  );
}

// ─── Error handler ────────────────────────────────────────────────────────────
bot.catch((err, ctx) => {
  console.error(`[TelegramBot] Error (${ctx.updateType}):`, err.message);
});

// ─── Launch ───────────────────────────────────────────────────────────────────
bot.launch().then(() => {
  console.log(`✅ [TelegramBot] Bot @${botUsername} aktif (polling)...`);
}).catch((err) => {
  console.error("❌ [TelegramBot] Gagal start:", err.message);
});

process.once("SIGINT",  () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
