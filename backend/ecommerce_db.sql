-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2026 at 10:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `street` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `street`, `city`, `postal_code`, `is_default`) VALUES
(1, 2, 'Jl. Mawar No. 12 RT 03/RW 05', 'Jakarta Selatan', '12345', 1),
(2, 3, 'Jl. Melati No. 45, Perumahan Indah Blok A', 'Bandung', '40251', 1),
(3, 4, 'Jl. Sudirman No. 78', 'Surabaya', '60111', 1),
(4, 5, 'Jl. Gatot Subroto No. 99, Kec. Medan Baru', 'Medan', '20112', 1),
(5, 6, 'Jl. Diponegoro No. 33, RT 01/RW 02', 'Yogyakarta', '55232', 1),
(6, 7, 'Jl. Ahmad Yani No. 56', 'Semarang', '50174', 1),
(7, 8, 'Jl. Pahlawan No. 21, Kelurahan Sukajadi', 'Palembang', '30135', 1),
(8, 9, 'Jl. Kemenangan No. 99', 'Depok', '16424', 1),
(9, 10, 'Jl. Merdeka No. 7, Komplek Permai', 'Makassar', '90111', 1),
(10, 11, 'Jl. Hayam Wuruk No. 55', 'Denpasar', '80235', 1),
(11, 12, 'Jl. Teuku Umar No. 88, RT 05/RW 03', 'Jakarta Barat', '11470', 1);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`) VALUES
(1, 13, 50, 1),
(2, 10, 50, 1);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `image_url`) VALUES
(1, 'Elektronik', 'elektronik', NULL),
(2, 'Pakaian Pria', 'pakaian-pria', NULL),
(3, 'Pakaian Wanita', 'pakaian-wanita', NULL),
(4, 'Makanan & Minuman', 'makanan-minuman', NULL),
(5, 'Tas & Aksesoris', 'tas-aksesoris', NULL),
(6, 'Sepatu & Sandal', 'sepatu-sandal', NULL),
(7, 'Kecantikan', 'kecantikan', NULL),
(8, 'Olahraga', 'olahraga', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_percentage` int(11) NOT NULL,
  `max_discount` int(11) DEFAULT NULL,
  `valid_until` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `discount_percentage`, `max_discount`, `valid_until`, `is_active`, `createdAt`, `updatedAt`) VALUES
(3, 'DISKONLEBARAN', 50, NULL, '2026-06-30 00:00:00', 1, '2026-06-21 09:01:54', '2026-06-21 09:01:54');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `status` enum('pending','paid','shipped','delivered','completed','cancelled') DEFAULT 'pending',
  `snap_token` varchar(255) DEFAULT NULL,
  `midtrans_transaction_id` varchar(255) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `coupon_code` varchar(255) DEFAULT NULL,
  `discount_amount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `snap_token`, `midtrans_transaction_id`, `shipping_address`, `tracking_number`, `created_at`, `coupon_code`, `discount_amount`) VALUES
(1, 2, 7500000.00, 'completed', NULL, 'TXN-2026011001', 'Jl. Mawar No. 12 RT 03/RW 05, Jakarta Selatan 12345', 'JNE-001234567', '2026-01-15 10:00:00', NULL, 0),
(2, 2, 1049000.00, 'completed', NULL, 'TXN-2026011501', 'Jl. Mawar No. 12 RT 03/RW 05, Jakarta Selatan 12345', 'JNE-001234568', '2026-01-22 11:00:00', NULL, 0),
(3, 3, 320000.00, 'completed', NULL, 'TXN-2026020101', 'Jl. Melati No. 45, Perumahan Indah Blok A, Bandung 40251', 'SICEPAT-002345678', '2026-02-05 09:00:00', NULL, 0),
(4, 3, 483000.00, 'completed', NULL, 'TXN-2026020801', 'Jl. Melati No. 45, Perumahan Indah Blok A, Bandung 40251', 'SICEPAT-002345679', '2026-02-15 10:00:00', NULL, 0),
(5, 4, 1645000.00, 'completed', NULL, 'TXN-2026021501', 'Jl. Sudirman No. 78, Surabaya 60111', 'ANTERAJA-003456789', '2026-02-20 08:00:00', NULL, 0),
(6, 4, 850000.00, 'completed', NULL, 'TXN-2026022201', 'Jl. Sudirman No. 78, Surabaya 60111', 'ANTERAJA-003456790', '2026-03-01 09:00:00', NULL, 0),
(7, 5, 383000.00, 'completed', NULL, 'TXN-2026030101', 'Jl. Gatot Subroto No. 99, Medan 20112', 'J&T-004567891', '2026-03-05 10:00:00', NULL, 0),
(8, 5, 278000.00, 'completed', NULL, 'TXN-2026031001', 'Jl. Gatot Subroto No. 99, Medan 20112', 'J&T-004567892', '2026-03-15 11:00:00', NULL, 0),
(9, 6, 844000.00, 'completed', NULL, 'TXN-2026031501', 'Jl. Diponegoro No. 33, Yogyakarta 55232', 'TIKI-005678901', '2026-03-20 08:00:00', NULL, 0),
(10, 6, 459000.00, 'completed', NULL, 'TXN-2026032501', 'Jl. Diponegoro No. 33, Yogyakarta 55232', 'TIKI-005678902', '2026-04-01 09:00:00', NULL, 0),
(11, 7, 1050000.00, 'completed', NULL, 'TXN-2026040101', 'Jl. Ahmad Yani No. 56, Semarang 50174', 'JNE-006789012', '2026-04-05 10:00:00', NULL, 0),
(12, 7, 314000.00, 'completed', NULL, 'TXN-2026041001', 'Jl. Ahmad Yani No. 56, Semarang 50174', 'JNE-006789013', '2026-04-15 11:00:00', NULL, 0),
(13, 8, 680000.00, 'completed', NULL, 'TXN-2026041501', 'Jl. Pahlawan No. 21, Palembang 30135', 'SICEPAT-007890123', '2026-04-20 08:00:00', NULL, 0),
(14, 8, 570000.00, 'completed', NULL, 'TXN-2026042501', 'Jl. Pahlawan No. 21, Palembang 30135', 'SICEPAT-007890124', '2026-05-01 09:00:00', NULL, 0),
(15, 9, 975000.00, 'completed', NULL, 'TXN-2026050101', 'Jl. Kemenangan No. 99, Depok 16424', 'J&T-008901234', '2026-05-05 10:00:00', NULL, 0),
(16, 9, 485000.00, 'completed', NULL, 'TXN-2026051001', 'Jl. Kemenangan No. 99, Depok 16424', 'J&T-008901235', '2026-05-15 11:00:00', NULL, 0),
(17, 10, 1120000.00, 'delivered', NULL, 'TXN-2026051501', 'Jl. Merdeka No. 7, Makassar 90111', 'ANTERAJA-009012345', '2026-05-20 08:00:00', NULL, 0),
(18, 10, 395000.00, 'delivered', NULL, 'TXN-2026052501', 'Jl. Merdeka No. 7, Makassar 90111', 'ANTERAJA-009012346', '2026-06-01 09:00:00', NULL, 0),
(19, 11, 610000.00, 'shipped', NULL, 'TXN-2026060101', 'Jl. Hayam Wuruk No. 55, Denpasar 80235', 'JNE-010123456', '2026-06-05 10:00:00', NULL, 0),
(20, 11, 265000.00, 'paid', NULL, 'TXN-2026061001', 'Jl. Hayam Wuruk No. 55, Denpasar 80235', NULL, '2026-06-10 11:00:00', NULL, 0),
(21, 12, 5800000.00, 'completed', NULL, 'TXN-2026050501', 'Jl. Teuku Umar No. 88, Jakarta Barat 11470', 'JNE-011234567', '2026-05-05 08:00:00', NULL, 0),
(22, 12, 7500000.00, 'paid', 'tok-salsa-001', NULL, 'Jl. Teuku Umar No. 88, Jakarta Barat 11470', NULL, '2026-06-15 09:00:00', NULL, 0),
(23, 12, 459000.00, 'cancelled', NULL, NULL, 'Jl. Teuku Umar No. 88, Jakarta Barat 11470', NULL, '2026-06-18 10:00:00', NULL, 0),
(24, 12, 11000000.00, 'cancelled', 'tok-salsa-002', NULL, 'Jl. Teuku Umar No. 88, Jakarta Barat 11470', '', '2026-06-19 07:00:00', NULL, 0),
(25, 14, 515000.00, 'completed', '6ec5ec98-5ef2-4f93-9232-9391fcf35272', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660', '', '2026-06-21 09:07:35', 'DISKONLEBARAN', 515000);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_purchase` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price_at_purchase`) VALUES
(1, 1, 1, 1, 7500000.00),
(2, 2, 5, 1, 1200000.00),
(3, 2, 4, 1, 850000.00),
(4, 3, 15, 1, 320000.00),
(5, 4, 17, 1, 215000.00),
(6, 4, 20, 3, 89000.00),
(7, 5, 6, 1, 1450000.00),
(8, 5, 5, 1, 1200000.00),
(9, 6, 4, 1, 850000.00),
(10, 7, 16, 1, 198000.00),
(11, 7, 20, 2, 89000.00),
(12, 8, 23, 2, 65000.00),
(13, 8, 22, 1, 75000.00),
(14, 9, 42, 1, 395000.00),
(15, 9, 45, 2, 145000.00),
(16, 10, 26, 1, 459000.00),
(17, 11, 41, 1, 285000.00),
(18, 11, 43, 3, 125000.00),
(19, 11, 45, 2, 145000.00),
(20, 12, 36, 1, 189000.00),
(21, 12, 38, 1, 129000.00),
(22, 13, 32, 1, 895000.00),
(23, 14, 33, 1, 425000.00),
(24, 14, 44, 1, 195000.00),
(25, 15, 31, 1, 385000.00),
(26, 15, 35, 1, 675000.00),
(27, 16, 29, 1, 685000.00),
(28, 17, 1, 1, 7500000.00),
(29, 18, 42, 1, 395000.00),
(30, 19, 37, 2, 145000.00),
(31, 19, 40, 2, 115000.00),
(32, 20, 46, 1, 265000.00),
(33, 21, 3, 1, 5800000.00),
(34, 22, 1, 1, 7500000.00),
(35, 23, 26, 1, 459000.00),
(36, 24, 8, 1, 11000000.00),
(37, 25, 50, 1, 325000.00),
(38, 25, 49, 1, 245000.00),
(39, 25, 48, 1, 195000.00),
(40, 25, 46, 1, 265000.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `average_rating` decimal(3,2) DEFAULT 0.00,
  `total_reviews` int(11) DEFAULT 0,
  `sold_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock`, `image_url`, `average_rating`, `total_reviews`, `created_at`) VALUES
(1, 1, 'Laptop ASUS VivoBook 15', 'Laptop ringan dengan layar 15.6 inci Full HD, prosesor Intel Core i5 Gen 12, RAM 16GB DDR4, SSD 512GB. Cocok untuk pekerjaan dan hiburan sehari-hari. Baterai tahan hingga 8 jam.', 7500000.00, 45, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', 5.00, 1, '2026-01-10 08:00:00'),
(2, 1, 'Laptop Lenovo ThinkPad E15', 'ThinkPad E15 hadir dengan prosesor AMD Ryzen 5, RAM 8GB, SSD 256GB. Keyboard nyaman untuk mengetik panjang, cocok untuk profesional dan mahasiswa yang aktif.', 9500000.00, 30, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop', 0.00, 0, '2026-01-12 09:00:00'),
(3, 1, 'Smartphone Samsung Galaxy A55', 'Ponsel flagship dengan layar Super AMOLED 6.6 inci 120Hz, kamera utama 50MP OIS, baterai 5000mAh fast charging 45W. Hadir dalam warna Navy, Awesome Iceblue, dan Awesome Lilac.', 5800000.00, 80, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 5.00, 1, '2026-01-15 10:00:00'),
(4, 1, 'Earphone TWS Soundcore Liberty 4', 'True Wireless Stereo earbuds dengan ANC aktif, suara Hi-Res, koneksi multipoint Bluetooth 5.3. Masa pakai baterai hingga 28 jam dengan case. Cocok untuk gym dan perjalanan.', 850000.00, 120, 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=400&fit=crop', 4.00, 2, '2026-01-18 11:00:00'),
(5, 1, 'Mouse Logitech MX Master 3S', 'Mouse ergonomis premium dengan scroll MagSpeed elektromagnetik, resolusi hingga 8000 DPI, konektivitas Bluetooth & USB. Ideal untuk desainer dan programmer.', 1200000.00, 60, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', 4.50, 2, '2026-01-20 12:00:00'),
(6, 1, 'Keyboard Mechanical Keychron K2', 'Keyboard mechanical compact 75%, tersedia switch Gateron Red/Brown/Blue. Kompatibel Windows & Mac, mode kabel dan wireless Bluetooth. Backlight RGB yang indah.', 1450000.00, 35, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop', 5.00, 1, '2026-01-22 13:00:00'),
(7, 1, 'Monitor LG 27GP850-B 27\"', 'Gaming monitor 27 inci QHD 2560x1440, refresh rate 165Hz, 1ms GTG, panel Nano IPS. NVIDIA G-Sync Compatible & AMD FreeSync Premium. Warna akurat sRGB 99%.', 4200000.00, 20, 'https://images.unsplash.com/photo-1546514714-df0ccc50b7a3?w=400&h=400&fit=crop', 0.00, 0, '2026-01-25 14:00:00'),
(8, 1, 'Tablet iPad Air 11\" M2', 'iPad Air dengan chip Apple M2, layar Liquid Retina 11 inci, kompatibel Apple Pencil Pro dan Magic Keyboard. Penyimpanan 128GB, warna Starlight, Blue, Purple, Midnight.', 11000000.00, 25, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', 0.00, 0, '2026-01-28 15:00:00'),
(9, 2, 'Kemeja Batik Pria Lengan Panjang', 'Kemeja batik motif kawung modern dengan bahan katun premium. Cocok untuk acara formal maupun casual. Tersedia ukuran S, M, L, XL, XXL dalam warna Navy dan Cokelat.', 275000.00, 95, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=400&fit=crop', 0.00, 0, '2026-02-01 08:00:00'),
(10, 2, 'Kaos Polos Oversize Premium', 'Kaos oversize dari bahan cotton combed 30s dengan berat 220gsm. Jahitan dobel untuk ketahanan maksimal. Tersedia dalam 10 pilihan warna, ukuran S-3XL.', 149000.00, 200, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 0.00, 0, '2026-02-03 09:00:00'),
(11, 2, 'Celana Chino Slim Fit', 'Celana chino bahan stretch premium, potongan slim fit yang modern dan elegan. Cocok dipadu dengan kemeja maupun kaos. Tersedia warna Khaki, Navy, Olive, dan Abu.', 285000.00, 75, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop', 0.00, 0, '2026-02-05 10:00:00'),
(12, 2, 'Jaket Bomber Pria Varsity', 'Jaket bomber dengan detail varsity style. Bahan luar polyester berkualitas dengan lapisan fleece hangat di dalam. Cocok untuk musim hujan. Warna Hitam dan Navy.', 485000.00, 50, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop', 0.00, 0, '2026-02-08 11:00:00'),
(13, 2, 'Polo Shirt Pria Lacoste Style', 'Polo shirt bahan pique cotton breathable, jahitan rapi dan nyaman dipakai seharian. Tersedia ukuran S-XXL dalam warna Putih, Hitam, Navy, Merah, dan Hijau.', 225000.00, 110, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop', 0.00, 0, '2026-02-10 12:00:00'),
(14, 2, 'Celana Jogger Pria Premium', 'Celana jogger dari bahan fleece katun tebal. Dilengkapi tali pinggang dan kantong ritsleting samping. Nyaman untuk santai di rumah maupun olahraga ringan.', 195000.00, 130, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 0.00, 0, '2026-02-12 13:00:00'),
(15, 3, 'Dress Midi Floral Wanita', 'Dress midi motif bunga dengan bahan rayon lembut dan jatuh. Dilengkapi karet pinggang untuk kenyamanan. Cocok untuk acara casual maupun semi-formal. Tersedia ukuran S-XL.', 320000.00, 80, 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&h=400&fit=crop', 5.00, 1, '2026-02-15 08:00:00'),
(16, 3, 'Blouse Wanita Casual Linen', 'Blouse linen premium dengan potongan loose yang nyaman. Bahan breathable dan tidak mudah kusut. Tersedia warna Putih, Cream, Biru Muda, dan Pink. Ukuran S-XXL.', 198000.00, 120, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop', 5.00, 1, '2026-02-18 09:00:00'),
(17, 3, 'Rok Plisket Midi Wanita', 'Rok plisket midi yang anggun dan elegan. Bahan sifon berkualitas, jatuh dengan indah. Elastis di pinggang untuk kenyamanan pemakaian. Tersedia 8 pilihan warna.', 215000.00, 90, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop', 4.00, 1, '2026-02-20 10:00:00'),
(18, 3, 'Outer Rajut Wanita', 'Outer rajut dengan desain modern, cocok dipadupadankan dengan berbagai outfit. Bahan rajutan lembut dan hangat. Tersedia warna Cream, Cokelat, Abu, dan Hitam.', 295000.00, 65, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop', 0.00, 0, '2026-02-22 11:00:00'),
(19, 3, 'Celana Kulot Wanita Premium', 'Celana kulot bahan katun linen premium, jatuh dan nyaman dipakai seharian. Tersedia warna Hitam, Navy, Cokelat, dan Putih. Ukuran S-XL.', 185000.00, 100, 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=400&h=400&fit=crop', 0.00, 0, '2026-02-25 12:00:00'),
(20, 3, 'Hijab Voal Premium Motif', 'Hijab voal dengan motif bunga elegan, bahan tidak menerawang dan mudah dibentuk. Ukuran 115x115cm. Tersedia 15 motif pilihan.', 89000.00, 250, 'https://images.unsplash.com/photo-1598124839397-af820ce6e2d8?w=400&h=400&fit=crop', 4.50, 2, '2026-02-28 13:00:00'),
(21, 4, 'Kopi Arabika Single Origin Gayo', 'Biji kopi arabika pilihan dari dataran tinggi Gayo, Aceh. Medium roast dengan profil rasa fruity, floral, dan sedikit asam yang menyegarkan. Berat 250gram.', 98000.00, 80, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop', 0.00, 0, '2026-03-01 08:00:00'),
(22, 4, 'Teh Herbal Chamomile Organik', 'Teh chamomile organik tanpa kafein, membantu relaksasi dan tidur lebih nyenyak. Kemasan 30 sachet premium. Bersertifikat organik internasional.', 75000.00, 150, 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=400&fit=crop', 5.00, 1, '2026-03-03 09:00:00'),
(23, 4, 'Cokelat Dark 70% Cacao Premium', 'Dark chocolate premium dengan kandungan kakao 70%, tanpa tambahan gula berlebih. Kaya antioksidan, baik untuk kesehatan jantung. Berat 100gram per batang.', 65000.00, 200, 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400&h=400&fit=crop', 4.00, 1, '2026-03-05 10:00:00'),
(24, 4, 'Granola Sehat Oat & Madu', 'Granola renyah dari oat rolled premium dengan madu asli, kacang almond, dan cranberry. Kaya serat dan protein. Cocok sebagai sarapan atau camilan sehat. Berat 500gram.', 89000.00, 100, 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&h=400&fit=crop', 0.00, 0, '2026-03-08 11:00:00'),
(25, 4, 'Madu Hutan Asli Kalimantan', 'Madu hutan murni langsung dari lebah liar Kalimantan. Tidak dipanaskan untuk menjaga enzim dan nutrisi alami. Berat 500gram, kemasan kaca premium.', 125000.00, 60, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop', 0.00, 0, '2026-03-10 12:00:00'),
(26, 5, 'Tas Ransel Laptop Anti-Air', 'Backpack kapasitas 30L dengan kompartmen khusus laptop 15.6 inci. Bahan nilon anti-air dengan port USB external. Cocok untuk traveling dan kerja. Warna Hitam dan Abu.', 459000.00, 55, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', 5.00, 1, '2026-03-12 08:00:00'),
(27, 5, 'Dompet Kulit Pria Slim', 'Dompet kulit sapi asli dengan desain slim minimalis. Dilengkapi 6 slot kartu, 1 kompartmen uang, dan 1 kantong ID transparan. Tersedia warna Cokelat dan Hitam.', 285000.00, 70, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop', 0.00, 0, '2026-03-14 09:00:00'),
(28, 5, 'Tote Bag Canvas Premium', 'Tote bag dari canvas tebal berkualitas, cocok untuk belanja dan aktivitas sehari-hari. Kapasitas besar dengan saku dalam. Tersedia berbagai warna dan motif menarik.', 145000.00, 180, 'https://images.unsplash.com/photo-1614179818511-7b3e9a1b5a41?w=400&h=400&fit=crop', 0.00, 0, '2026-03-16 10:00:00'),
(29, 5, 'Jam Tangan Casio Analog Klasik', 'Jam tangan analog klasik Casio dengan tali leather cokelat. Water resistant 50m, akurasi tinggi. Tampilan bersih dan elegan, cocok untuk formal maupun casual.', 685000.00, 40, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop', 5.00, 1, '2026-03-18 11:00:00'),
(30, 5, 'Kacamata Hitam UV400', 'Kacamata hitam dengan lensa polarized UV400 proteksi penuh. Frame metal ringan anti-karat. Tersedia bentuk oval, wayfarer, dan cat-eye. Lengkap dengan case dan lap.', 275000.00, 90, 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=400&h=400&fit=crop', 0.00, 0, '2026-03-20 12:00:00'),
(31, 6, 'Sneakers Pria Casual Putih', 'Sneakers casual dengan sol karet EVA yang ringan dan nyaman. Upper canvas breathable. Desain clean dan minimalis, cocok dipadukan dengan berbagai outfit casual.', 385000.00, 65, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 4.00, 1, '2026-03-22 08:00:00'),
(32, 6, 'Sepatu Kulit Pria Formal Oxford', 'Sepatu pantofel kulit sapi asli dengan sol karet anti-slip. Jahitan Goodyear welt untuk ketahanan lama. Tersedia ukuran 39-44. Warna Hitam dan Cokelat Tua.', 895000.00, 30, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=400&fit=crop', 5.00, 1, '2026-03-24 09:00:00'),
(33, 6, 'Sandal Gunung Eiger Adventure', 'Sandal gunung dengan outsole Vibram anti-slip, tali adjustable dan cepat kering. Cocok untuk hiking ringan hingga medium. Tersedia ukuran 37-44.', 425000.00, 50, 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop', 4.00, 1, '2026-03-26 10:00:00'),
(34, 6, 'Sneakers Wanita Platform', 'Sneakers wanita dengan platform sole 4cm yang trendi. Upper sintetis lembut dengan detail chunky. Tersedia warna Putih, Pink, dan Hitam. Ukuran 36-40.', 465000.00, 55, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop', 0.00, 0, '2026-03-28 11:00:00'),
(35, 6, 'Sepatu Olahraga Running Pro', 'Sepatu lari dengan teknologi air cushion di sol, upper mesh breathable ringan. Bobot hanya 280gram, cocok untuk lari jarak jauh. Tersedia ukuran 38-45.', 675000.00, 40, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop', 5.00, 1, '2026-03-30 12:00:00'),
(36, 7, 'Serum Vitamin C 20% Brightening', 'Serum vitamin C konsentrasi 20% dengan niacinamide dan hyaluronic acid. Mencerahkan kulit, meratakan warna, dan memudarkan noda hitam. Cocok untuk kulit normal-berminyak.', 189000.00, 150, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 4.00, 1, '2026-04-01 08:00:00'),
(37, 7, 'Moisturizer Gel Hyaluronic Acid', 'Pelembab gel tekstur ringan tidak lengket, mengandung hyaluronic acid 2% dan panthenol. Melembabkan kulit hingga 72 jam. Aman untuk semua jenis kulit termasuk sensitif.', 145000.00, 120, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop', 0.00, 0, '2026-04-03 09:00:00'),
(38, 7, 'Sunscreen SPF 50 PA++++', 'Sunscreen dengan perlindungan SPF 50 PA++++ dari sinar UVA dan UVB. Tekstur ringan, tidak meninggalkan white cast. Cocok dipakai sebelum makeup. Kandungan niacinamide dan aloe vera.', 129000.00, 200, 'https://images.unsplash.com/photo-1607008829749-c0f284a49fc4?w=400&h=400&fit=crop', 5.00, 1, '2026-04-05 10:00:00'),
(39, 7, 'Lipstik Matte Tahan Lama', 'Lipstik matte dengan formula tahan hingga 12 jam, tidak kering dan tidak menempel di gigi. Tersedia 15 pilihan shade dari nude hingga bold. Transfer-proof formula.', 95000.00, 180, 'https://images.unsplash.com/photo-1586495777744-4e6232bf2919?w=400&h=400&fit=crop', 0.00, 0, '2026-04-07 11:00:00'),
(40, 7, 'Masker Wajah Clay Detox', 'Masker wajah dari kaolin clay murni, membantu membersihkan pori-pori, mengontrol minyak, dan mengangkat sel kulit mati. Diperkaya dengan tea tree oil dan charcoal. Isi 100gram.', 115000.00, 160, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', 0.00, 0, '2026-04-09 12:00:00'),
(41, 8, 'Matras Yoga Premium 6mm', 'Matras yoga dari bahan TPE ramah lingkungan, ketebalan 6mm untuk kenyamanan sendi. Anti-slip di kedua sisi, mudah digulung dan dibawa. Ukuran 183x61cm.', 285000.00, 70, 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop', 5.00, 1, '2026-04-10 08:00:00'),
(42, 8, 'Dumbbell Set Hex Rubber 5kg', 'Sepasang dumbbell hex 5kg per sisi dengan coating rubber yang melindungi lantai. Handle anti-slip nyaman digenggam. Cocok untuk latihan di rumah.', 395000.00, 45, 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=400&fit=crop', 4.00, 1, '2026-04-12 09:00:00'),
(43, 8, 'Tali Skipping Speed Rope', 'Tali skipping dengan bearing presisi untuk kecepatan tinggi. Tali PVC 3mm, handle aluminium ergonomis, panjang adjustable hingga 3 meter. Cocok untuk latihan cardio.', 125000.00, 100, 'https://images.unsplash.com/photo-1434608519344-49d77a124f46?w=400&h=400&fit=crop', 0.00, 0, '2026-04-14 10:00:00'),
(44, 8, 'Celana Training Pria Dry-Fit', 'Celana olahraga bahan polyester dry-fit yang menyerap keringat dengan cepat. Desain 2-in-1 dengan celana pendek dalam. Tersedia ukuran S-XL warna Hitam dan Abu.', 195000.00, 85, 'https://images.unsplash.com/photo-1591291621060-c6bed3817b9a?w=400&h=400&fit=crop', 4.00, 1, '2026-04-16 11:00:00'),
(45, 8, 'Botol Minum Stainless 750ml', 'Tumbler stainless steel double wall 750ml, menjaga minuman dingin 24 jam dan panas 12 jam. Mulut lebar mudah dibersihkan. Anti-bocor, BPA-free. Tersedia 8 warna.', 145000.00, 150, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', 4.50, 2, '2026-04-18 12:00:00'),
(46, 8, 'Baju Olahraga Wanita Sports Bra Set', 'Set baju olahraga wanita terdiri dari sports bra dan legging. Bahan lycra 4-way stretch, high waist legging dengan saku kecil. Tersedia ukuran S-XL, 5 pilihan warna.', 265000.00, 74, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', 0.00, 0, '2026-04-20 13:00:00'),
(47, 1, 'Powerbank Anker 20000mAh', 'Powerbank kapasitas 20000mAh dengan pengisian 2 perangkat sekaligus. Teknologi PowerIQ 3.0, output maksimal 18W. Dilengkapi port USB-A, USB-C, dan Micro-USB. Garansi 18 bulan.', 489000.00, 90, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', 0.00, 0, '2026-04-22 08:00:00'),
(48, 5, 'Belt Kulit Pria Formal', 'Ikat pinggang kulit sapi genuine leather, lebar 3.5cm. Buckle metal silver/gold. Cocok untuk celana formal maupun celana jeans. Panjang adjustable 105-125cm.', 195000.00, 79, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', 0.00, 0, '2026-04-24 09:00:00'),
(49, 2, 'Kemeja Flannel Kotak-Kotak Pria', 'Kemeja flannel motif kotak-kotak klasik, bahan cotton flannel tebal dan hangat. Cocok untuk cuaca dingin atau gaya casual vintage. Tersedia ukuran S-XXL.', 245000.00, 89, 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&h=400&fit=crop', 0.00, 0, '2026-04-26 10:00:00'),
(50, 3, 'Cardigan Wanita Knit Premium', 'Cardigan rajut dengan desain elegan dan detail kancing cantik. Bahan knit lembut dan hangat. Cocok untuk office look maupun casual. Tersedia ukuran S-XL, 6 pilihan warna.', 325000.00, 59, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', 0.00, 0, '2026-04-28 11:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `order_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 2, 1, 5, 'Laptop ini luar biasa! Performa sangat kencang untuk keperluan kuliah dan kerja. RAM 16GB sangat membantu multitasking. Baterai tahan lama, bisa sampai 7-8 jam pemakaian normal. Layarnya jernih dan nyaman di mata. Sangat puas dengan pembelian ini!', '2026-01-25 09:00:00'),
(2, 5, 2, 2, 5, 'Mouse premium yang benar-benar premium! Scroll MagSpeed-nya bikin nagih, sangat smooth. Ergonomis banget di tangan, cocok buat yang kerja berjam-jam. Koneksi Bluetooth stabil. Sudah 1 bulan pemakaian masih sempurna. Worth every penny!', '2026-02-01 10:00:00'),
(3, 4, 2, 2, 4, 'Kualitas suara bagus untuk harganya. ANC-nya lumayan efektif meredam suara bising. Baterai awet sesuai klaim. Sedikit kurang nyaman setelah pemakaian 2+ jam karena earpad agak keras. Overall rekomen!', '2026-02-01 11:00:00'),
(4, 15, 3, 3, 5, 'Dress cantik banget! Motif bunganya elegan dan bahan rayonnya jatuh di badan. Jahitan rapi dan kualitas bahan bagus. Sudah dipakai ke kondangan dan banyak yang tanya belinya dimana. Seller terpercaya, pengiriman cepat. Pasti repeat order!', '2026-02-12 08:00:00'),
(5, 17, 3, 4, 4, 'Roknya bagus dan elegan. Bahan sifon terasa lembut dan ringan. Plisketnya rapi tidak mudah kusut. Ukuran sesuai deskripsi. Hanya minus sedikit di bagian karet pinggang yang terasa agak ketat, tapi masih oke. Rekomen buat yang mau tampil formal!', '2026-02-22 09:00:00'),
(6, 20, 3, 4, 5, 'Hijab voalnya bagus banget! Tidak menerawang, mudah dibentuk, dan motifnya cantik. Sudah beli 3 motif sekaligus dan semuanya memuaskan. Bahan adem dan nyaman dipakai seharian. Seller fast response dan packing rapih. Recommended!', '2026-02-22 10:00:00'),
(7, 6, 4, 5, 5, 'Keyboard terbaik yang pernah saya gunakan! Switch Gateron Brown-nya terasa perfect - tactile feedback bagus tapi tidak terlalu berisik. Build quality solid, RGB-nya cantik. Dual mode wireless/wired sangat memudahkan. Sudah 2 bulan, masih mulus. Top!', '2026-02-28 08:00:00'),
(8, 5, 4, 5, 4, 'Mouse yang sangat nyaman untuk kerja panjang. DPI range-nya luas, bisa disesuaikan dengan kebutuhan. Koneksi multipoint sangat berguna untuk perpindahan antar perangkat. Baterai tahan berminggu-minggu. Sedikit berat tapi justru terasa premium.', '2026-02-28 09:00:00'),
(9, 4, 4, 6, 4, 'TWS yang sangat worth it! Sound quality-nya punchy dan bass-nya terasa. ANC bekerja lumayan baik untuk transportasi umum. Fit di telinga pas dan tidak mudah copot saat aktivitas. Charging case desainnya compact. Rekomendasi untuk budget mid-range!', '2026-03-08 10:00:00'),
(10, 16, 5, 7, 5, 'Blouse linennnya bagus banget! Bahan breathable cocok untuk cuaca Indonesia yang panas. Potongan loose bikin nyaman bergerak. Warna putih bersih tidak terlalu terawang. Sudah dicuci beberapa kali tetap bagus. Seller terpercaya, highly recommended!', '2026-03-12 08:00:00'),
(11, 20, 5, 7, 4, 'Hijabnya kualitas baik, tidak menerawang dan mudah diatur. Motifnya elegan dan cocok untuk berbagai kesempatan. Packing sangat rapi. Sedikit minus di jahitan pinggir yang kurang rapih di salah satu sisi, tapi overall masih bagus dan recommended!', '2026-03-12 09:00:00'),
(12, 23, 5, 8, 4, 'Dark chocolate yang enak! Rasa cokelatnya kuat dan authentic, tidak terlalu manis. Kadar kakao 70% terasa dari first bite. Teksturnya smooth. Cocok untuk camilan sehat dan teman minum kopi. Packaging aman, tidak meleleh saat dikirim. Akan repeat!', '2026-03-22 10:00:00'),
(13, 22, 5, 8, 5, 'Teh chamomile organik terbaik yang pernah saya coba! Aroma bunga yang menenangkan, rasa tidak terlalu pahit. Memang terasa bedanya dengan teh biasa. Tidur lebih nyenyak setelah minum ini. 30 sachet terasa sangat worth it untuk harganya. Wajib beli!', '2026-03-22 11:00:00'),
(14, 42, 6, 9, 4, 'Dumbbell solid dan berkualitas! Coating rubber-nya tebal dan tidak mudah retak. Handle anti-slip saat tangan berkeringat. Berat akurat sesuai label. Pengiriman aman dengan bubble wrap tebal. Sedikit minus di finishing yang ada sedikit bekas mold. Bagus overall!', '2026-03-27 08:00:00'),
(15, 45, 6, 9, 5, 'Tumbler terbaik! Benar-benar bisa menjaga minuman dingin sampai 24 jam dan panas 12 jam, sudah saya tes sendiri. Tidak ada kebocoran sama sekali. Desain sleek dan elegan. Sudah menemani perjalanan traveling selama sebulan, masih mulus. Highly recommended!', '2026-03-27 09:00:00'),
(16, 26, 6, 10, 5, 'Backpack terbaik untuk harganya! Anti air teruji sudah kena hujan deras dan laptop tetap aman. Kapasitas 30L sangat cukup untuk laptop, baju, dan kebutuhan sehari-hari. USB port external sangat praktis. Bahan kuat dan jahitan rapi. Wajib punya!', '2026-04-08 10:00:00'),
(17, 41, 7, 11, 5, 'Matras yoga berkualitas tinggi! Bahan TPE-nya lebih nyaman dari EVA biasa. Ketebalan 6mm sangat pas untuk proteksi sendi saat gerakan yoga. Anti-slip di kedua sisi bekerja sempurna. Mudah digulung dan dibawa. Sudah dipakai hampir sebulan, masih bagus!', '2026-04-12 08:00:00'),
(18, 45, 7, 11, 4, 'Tumbler bagus untuk gym! Kapasitas 750ml cukup untuk 1 sesi olahraga. Menjaga air tetap dingin selama latihan. Mulut lebar mudah diisi es batu. Sedikit berat saat penuh tapi wajar. Handle-nya bisa dikaitkan di tas. Overall memuaskan!', '2026-04-12 09:00:00'),
(19, 36, 7, 12, 4, 'Serum vitamin C yang effective! Kulit terasa lebih cerah setelah pemakaian rutin 2 minggu. Tekstur serumnya ringan dan cepat menyerap. Tidak terasa lengket atau berminyak. Noda bekas jerawat mulai memudar. Harganya terjangkau untuk kualitas yang didapat!', '2026-04-22 10:00:00'),
(20, 38, 7, 12, 5, 'Sunscreen terbaik! Teksturnya ringan sekali, langsung menyerap dan tidak meninggalkan white cast sama sekali. Tidak lengket dan tidak menyumbat pori. Kulitku yang sensitif tidak ada reaksi negatif. SPF 50 PA++++ bikin tenang seharian di luar. Must have!', '2026-04-22 11:00:00'),
(21, 32, 8, 13, 5, 'Sepatu kulit premium yang worth every penny! Bahan kulit sapi asli terasa tebal dan berkualitas. Jahitan Goodyear welt memang ketahanannya beda level. Nyaman dipakai seharian bahkan untuk acara formal panjang. Sudah 1 bulan pemakaian, makin bagus dan nyaman.', '2026-04-27 08:00:00'),
(22, 33, 8, 14, 4, 'Sandal gunung yang solid untuk harganya! Outsole Vibram-nya grip sempurna di berbagai medan, sudah diuji di jalur hiking berbatu. Tali adjustable mudah dikencangkan dan dilonggarkan. Cepat kering saat kena air. Minus sedikit di ketebalan sol yang terasa agak tipis.', '2026-05-08 09:00:00'),
(23, 44, 8, 14, 4, 'Celana olahraga yang nyaman! Bahan dry-fit benar-benar menyerap keringat dengan cepat. Desain 2-in-1 praktis tidak perlu pakai celana dalam lagi. Jahitan kuat walau sering dicuci. Ukuran sesuai size chart. Sedikit kurang panjang untuk tinggi 175cm, minta ukuran lebih besar.', '2026-05-08 10:00:00'),
(24, 31, 9, 15, 4, 'Sneakers nyaman dan stylish! Bahan canvas breathable bikin kaki tidak gerah. Sol EVA ringan dan empuk. Desain putih minimalis cocok dipakai dengan outfit apa saja. Sudah berjalan jauh tidak ada lecet. Sedikit minus di sol yang terlalu tipis untuk medan tidak rata.', '2026-05-12 08:00:00'),
(25, 35, 9, 15, 5, 'Sepatu lari terbaik! Air cushion di sol terasa nyaman untuk lari jarak jauh. Bobot 280gram benar-benar ringan, tidak terasa. Upper mesh sangat breathable bahkan saat lari 1 jam kaki tidak pengap. Sudah lari 5K dan 10K, kaki tetap nyaman. Recommended untuk runner!', '2026-05-12 09:00:00'),
(26, 29, 9, 16, 5, 'Jam tangan klasik yang timeless! Desain analog sederhana tapi elegan. Tali leather cokelat sangat cocok dipadukan dengan pakaian formal maupun casual. Akurasi waktu sangat presisi. Water resistant sudah diuji kena air hujan, aman. Quality build yang sangat baik untuk harganya!', '2026-05-22 10:00:00'),
(27, 3, 12, 21, 5, 'Samsung Galaxy A55 ini luar biasa! Layar Super AMOLED 120Hz-nya jernih dan responsif banget. Kamera 50MP dengan OIS menghasilkan foto yang sangat bagus bahkan di kondisi cahaya rendah. Baterai 5000mAh tahan seharian penuh dengan pemakaian intensif. Sangat puas!', '2026-05-15 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin Toko', 'admin@tokoonline.com', '$2b$10$ybVPHEOi8.NvC2Km7WwsQuxlbtEEV4g3LNIhEXrX.DbLg9kjFPF.W', 'admin', '2026-01-01 00:00:00'),
(2, 'Budi Santoso', 'budi.santoso@gmail.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-01-05 08:30:00'),
(3, 'Siti Rahayu', 'siti.rahayu@gmail.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-01-10 09:15:00'),
(4, 'Ahmad Fauzi', 'ahmad.fauzi@yahoo.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-01-15 10:00:00'),
(5, 'Dewi Lestari', 'dewi.lestari@gmail.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-01-20 11:30:00'),
(6, 'Riko Permana', 'riko.permana@gmail.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-02-01 07:00:00'),
(7, 'Nurul Hidayah', 'nurul.hidayah@gmail.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-02-05 13:45:00'),
(8, 'Hendra Kusuma', 'hendra.kusuma@gmail.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-02-10 15:20:00'),
(9, 'Rina Marlina', 'rina.marlina@gmail.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-02-15 09:00:00'),
(10, 'Doni Setiawan', 'doni.setiawan@gmail.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-02-20 10:30:00'),
(11, 'Yuni Astuti', 'yuni.astuti@gmail.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-03-01 08:00:00'),
(12, 'Salsa Tester', 'salsa.test@example.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-03-05 14:00:00'),
(13, 'admin', 'admin@gmail.com', '$2b$10$LNwEs1ZrJf5vcvS.feo/dOQZNfpSjd7hF1VhkpTqz.O7DrfL7mNf6', 'admin', '2026-06-20 03:07:30'),
(14, 'Muhamad Rojali', 'rojali@gmail.com', '$2b$10$QnzaMSfzF1mOq/2HyRRgQOKZVcvUeq0/EjPSbZRqE4Z0aeEaDfQW.', 'admin', '2026-06-21 08:59:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_review` (`user_id`,`product_id`,`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;