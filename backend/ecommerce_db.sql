-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2026 at 05:12 PM
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
  `city` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
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
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `product_image` varchar(512) DEFAULT NULL,
  `badge` varchar(80) DEFAULT NULL,
  `heading` varchar(160) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `button_text` varchar(80) DEFAULT 'Belanja Sekarang',
  `button_link` varchar(512) DEFAULT NULL,
  `button2_text` varchar(80) DEFAULT NULL,
  `button2_link` varchar(512) DEFAULT NULL,
  `sale_price` varchar(60) DEFAULT NULL,
  `original_price` varchar(60) DEFAULT NULL,
  `text_position` varchar(10) NOT NULL DEFAULT 'left',
  `overlay_opacity` float NOT NULL DEFAULT 0.35,
  `order` int(11) NOT NULL DEFAULT 0,
  `link_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `image_url`, `product_image`, `badge`, `heading`, `description`, `button_text`, `button_link`, `button2_text`, `button2_link`, `sale_price`, `original_price`, `text_position`, `overlay_opacity`, `order`, `link_url`, `is_active`, `created_at`) VALUES
(1, 'Promo Akhir Taun', 'https://res.cloudinary.com/dsauphhgf/image/upload/ecommerce_uploads/n0uyalyytvmmy5irg1lw', NULL, NULL, NULL, NULL, 'Belanja Sekarang', NULL, NULL, NULL, NULL, NULL, 'left', 0.35, 0, NULL, 0, '2026-06-23 14:09:45'),
(4, 'hojgf', 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782225147/ecommerce_uploads/ykom5hu0pyqd3ih6ug9o.png', NULL, NULL, NULL, NULL, 'Belanja Sekarang', NULL, NULL, NULL, NULL, NULL, 'left', 0.35, 0, NULL, 0, '2026-06-23 14:32:28'),
(5, 'ASUS VIVOBOOK', 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782481460/ecommerce_uploads/fldohxsjec5yp1ajup86.jpg', 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782481462/ecommerce_uploads/ugchqxyzfrf5oxetqlah.png', NULL, NULL, NULL, 'Belanja Sekarang', NULL, NULL, NULL, NULL, NULL, 'left', 0.35, 0, NULL, 0, '2026-06-26 13:44:25'),
(6, 'ASUS VIVOBOOK', 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782674131/ecommerce_uploads/mgjgys1im8u3vzpazj49.png', NULL, 'FLASH SALE', 'NEW COLLECTION', NULL, 'Belanja Sekarang', 'http://localhost:5173/products/1', NULL, NULL, 'Rp 7.500.000', 'Rp 10.000.000', 'left', 0.35, 0, NULL, 1, '2026-06-28 19:15:32'),
(7, 'ASUS ZENFONE', 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782808580/ecommerce_uploads/isqnpwgkdg3bc1ytdfkl.png', NULL, 'FLASH SALE', 'NEW COLLECTION', NULL, 'Belanja Sekarang', NULL, NULL, NULL, 'Rp 5000.000', NULL, 'left', 0.35, 0, NULL, 1, '2026-06-30 08:36:20');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `selected_image_url` varchar(255) DEFAULT NULL,
  `selected_size` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `variant_id`, `quantity`, `selected_image_url`, `selected_size`) VALUES
(1, 13, 50, NULL, 1, NULL, NULL),
(2, 10, 50, NULL, 1, NULL, NULL),
(16, 14, 49, 15, 1, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216495/ecommerce_uploads/dw5pncial0vd9p2order.jpg', 'M'),
(17, 14, 39, 114, 1, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217218/ecommerce_uploads/ohbnhx5heted3nuwcnsa.jpg', '50 ml'),
(21, 20, 49, 15, 1, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216495/ecommerce_uploads/dw5pncial0vd9p2order.jpg', 'M');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `image_url`) VALUES
(1, 'Elektronik', 'elektronik', 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782227178/ecommerce_uploads/dewto1vyrn03pzgvsuyf.jpg'),
(2, 'Pakaian Pria', 'pakaian-pria', 'https://res.cloudinary.com/dsauphhgf/image/upload/ecommerce_uploads/dzp6cuuxtk71pkwtm3ei'),
(3, 'Pakaian Wanita', 'pakaian-wanita', 'https://res.cloudinary.com/dsauphhgf/image/upload/ecommerce_uploads/o622td0ac1g8rcgdpzhe'),
(4, 'Makanan & Minuman', 'makanan-minuman', 'https://res.cloudinary.com/dsauphhgf/image/upload/ecommerce_uploads/t9pr1dj3tqdlybrexmfi'),
(5, 'Tas & Aksesoris', 'tas-aksesoris', 'https://res.cloudinary.com/dsauphhgf/image/upload/ecommerce_uploads/g7gwnxeg5s3re4cx6peu'),
(6, 'Sepatu & Sandal', 'sepatu-sandal', 'https://res.cloudinary.com/dsauphhgf/image/upload/ecommerce_uploads/sb5iwqwqihmgienf6bam'),
(7, 'Kecantikan', 'kecantikan', 'https://res.cloudinary.com/dsauphhgf/image/upload/ecommerce_uploads/zk4u56qrsvyejmn2eoat'),
(8, 'Olahraga', 'olahraga', 'https://res.cloudinary.com/dsauphhgf/image/upload/ecommerce_uploads/hnttllxhbk3t9xl9cmfz');

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
  `status` enum('pending','paid','shipped','completed','cancelled') DEFAULT 'pending',
  `snap_token` varchar(255) DEFAULT NULL,
  `midtrans_transaction_id` varchar(255) DEFAULT NULL,
  `shipping_address` text NOT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `courier` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `discount_amount` int(11) DEFAULT 0,
  `cancellation_status` enum('requested','approved','rejected') DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `cancellation_note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `snap_token`, `midtrans_transaction_id`, `shipping_address`, `tracking_number`, `courier`, `created_at`, `coupon_code`, `discount_amount`, `cancellation_status`, `cancellation_reason`, `cancellation_note`) VALUES
(1, 2, 7500000.00, 'completed', NULL, 'TXN-2026011001', 'Jl. Mawar No. 12 RT 03/RW 05, Jakarta Selatan 12345', 'JNE-001234567', NULL, '2026-01-15 10:00:00', NULL, 0, NULL, NULL, NULL),
(2, 2, 1049000.00, 'completed', NULL, 'TXN-2026011501', 'Jl. Mawar No. 12 RT 03/RW 05, Jakarta Selatan 12345', 'JNE-001234568', NULL, '2026-01-22 11:00:00', NULL, 0, NULL, NULL, NULL),
(3, 3, 320000.00, 'completed', NULL, 'TXN-2026020101', 'Jl. Melati No. 45, Perumahan Indah Blok A, Bandung 40251', 'SICEPAT-002345678', NULL, '2026-02-05 09:00:00', NULL, 0, NULL, NULL, NULL),
(4, 3, 483000.00, 'completed', NULL, 'TXN-2026020801', 'Jl. Melati No. 45, Perumahan Indah Blok A, Bandung 40251', 'SICEPAT-002345679', NULL, '2026-02-15 10:00:00', NULL, 0, NULL, NULL, NULL),
(5, 4, 1645000.00, 'completed', NULL, 'TXN-2026021501', 'Jl. Sudirman No. 78, Surabaya 60111', 'ANTERAJA-003456789', NULL, '2026-02-20 08:00:00', NULL, 0, NULL, NULL, NULL),
(6, 4, 850000.00, 'completed', NULL, 'TXN-2026022201', 'Jl. Sudirman No. 78, Surabaya 60111', 'ANTERAJA-003456790', NULL, '2026-03-01 09:00:00', NULL, 0, NULL, NULL, NULL),
(7, 5, 383000.00, 'completed', NULL, 'TXN-2026030101', 'Jl. Gatot Subroto No. 99, Medan 20112', 'J&T-004567891', NULL, '2026-03-05 10:00:00', NULL, 0, NULL, NULL, NULL),
(8, 5, 278000.00, 'completed', NULL, 'TXN-2026031001', 'Jl. Gatot Subroto No. 99, Medan 20112', 'J&T-004567892', NULL, '2026-03-15 11:00:00', NULL, 0, NULL, NULL, NULL),
(9, 6, 844000.00, 'completed', NULL, 'TXN-2026031501', 'Jl. Diponegoro No. 33, Yogyakarta 55232', 'TIKI-005678901', NULL, '2026-03-20 08:00:00', NULL, 0, NULL, NULL, NULL),
(10, 6, 459000.00, 'completed', NULL, 'TXN-2026032501', 'Jl. Diponegoro No. 33, Yogyakarta 55232', 'TIKI-005678902', NULL, '2026-04-01 09:00:00', NULL, 0, NULL, NULL, NULL),
(11, 7, 1050000.00, 'completed', NULL, 'TXN-2026040101', 'Jl. Ahmad Yani No. 56, Semarang 50174', 'JNE-006789012', NULL, '2026-04-05 10:00:00', NULL, 0, NULL, NULL, NULL),
(12, 7, 314000.00, 'completed', NULL, 'TXN-2026041001', 'Jl. Ahmad Yani No. 56, Semarang 50174', 'JNE-006789013', NULL, '2026-04-15 11:00:00', NULL, 0, NULL, NULL, NULL),
(13, 8, 680000.00, 'completed', NULL, 'TXN-2026041501', 'Jl. Pahlawan No. 21, Palembang 30135', 'SICEPAT-007890123', NULL, '2026-04-20 08:00:00', NULL, 0, NULL, NULL, NULL),
(14, 8, 570000.00, 'completed', NULL, 'TXN-2026042501', 'Jl. Pahlawan No. 21, Palembang 30135', 'SICEPAT-007890124', NULL, '2026-05-01 09:00:00', NULL, 0, NULL, NULL, NULL),
(15, 9, 975000.00, 'completed', NULL, 'TXN-2026050101', 'Jl. Kemenangan No. 99, Depok 16424', 'J&T-008901234', NULL, '2026-05-05 10:00:00', NULL, 0, NULL, NULL, NULL),
(16, 9, 485000.00, 'completed', NULL, 'TXN-2026051001', 'Jl. Kemenangan No. 99, Depok 16424', 'J&T-008901235', NULL, '2026-05-15 11:00:00', NULL, 0, NULL, NULL, NULL),
(17, 10, 1120000.00, '', NULL, 'TXN-2026051501', 'Jl. Merdeka No. 7, Makassar 90111', 'ANTERAJA-009012345', NULL, '2026-05-20 08:00:00', NULL, 0, NULL, NULL, NULL),
(18, 10, 395000.00, '', NULL, 'TXN-2026052501', 'Jl. Merdeka No. 7, Makassar 90111', 'ANTERAJA-009012346', NULL, '2026-06-01 09:00:00', NULL, 0, NULL, NULL, NULL),
(19, 11, 610000.00, 'shipped', NULL, 'TXN-2026060101', 'Jl. Hayam Wuruk No. 55, Denpasar 80235', 'JNE-010123456', NULL, '2026-06-05 10:00:00', NULL, 0, NULL, NULL, NULL),
(20, 11, 265000.00, 'paid', NULL, 'TXN-2026061001', 'Jl. Hayam Wuruk No. 55, Denpasar 80235', NULL, NULL, '2026-06-10 11:00:00', NULL, 0, NULL, NULL, NULL),
(21, 12, 5800000.00, 'completed', NULL, 'TXN-2026050501', 'Jl. Teuku Umar No. 88, Jakarta Barat 11470', 'JNE-011234567', NULL, '2026-05-05 08:00:00', NULL, 0, NULL, NULL, NULL),
(22, 12, 7500000.00, 'paid', 'tok-salsa-001', NULL, 'Jl. Teuku Umar No. 88, Jakarta Barat 11470', NULL, NULL, '2026-06-15 09:00:00', NULL, 0, NULL, NULL, NULL),
(23, 12, 459000.00, 'cancelled', NULL, NULL, 'Jl. Teuku Umar No. 88, Jakarta Barat 11470', NULL, NULL, '2026-06-18 10:00:00', NULL, 0, NULL, NULL, NULL),
(24, 12, 11000000.00, 'cancelled', 'tok-salsa-002', NULL, 'Jl. Teuku Umar No. 88, Jakarta Barat 11470', '', NULL, '2026-06-19 07:00:00', NULL, 0, NULL, NULL, NULL),
(25, 14, 515000.00, 'completed', '6ec5ec98-5ef2-4f93-9232-9391fcf35272', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660', '', NULL, '2026-06-21 09:07:35', 'DISKONLEBARAN', 515000, NULL, NULL, NULL),
(26, 14, 6045000.00, 'pending', '94e902b3-f91e-4836-b691-1472d9e6a526', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660', NULL, NULL, '2026-06-30 08:34:07', NULL, 0, NULL, NULL, NULL),
(27, 14, 395000.00, 'pending', 'cf26efa4-13c7-422f-ae2e-08925207b394', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660', NULL, NULL, '2026-06-30 08:37:56', NULL, 0, NULL, NULL, NULL),
(28, 14, 245000.00, 'pending', '38c89727-2cbf-4345-9090-2bc1355be892', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660', NULL, NULL, '2026-06-30 09:00:33', NULL, 0, NULL, NULL, NULL),
(29, 14, 245000.00, 'pending', 'df459c49-1bab-406b-885f-ff37173c9ef6', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660', NULL, NULL, '2026-06-30 09:06:19', NULL, 0, NULL, NULL, NULL),
(30, 12, 325000.00, 'completed', 'e26d338e-2169-455e-ac8d-0ea43ed1b848', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660', 'JNE1231413', 'JNE', '2026-06-30 09:31:15', NULL, 0, NULL, NULL, NULL),
(31, 12, 387500.00, 'completed', '9fd8b6fa-9047-4436-a2b2-d725b36c3ad1', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660 [Kurir: JNE Reguler (2-3 Hari) - Ongkir: Rp 15.000]', 'JNE123456', 'JNE', '2026-07-01 10:07:46', NULL, 0, NULL, NULL, NULL),
(32, 12, 174000.00, 'completed', '75d8a89b-8eee-4a64-a1fe-0fff7f4b0ef2', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660 [Kurir: SiCepat BEST (1 Hari) - Ongkir: Rp 20.000]', 'JNE123456', 'JNE', '2026-07-01 10:14:23', NULL, 0, NULL, NULL, NULL),
(33, 21, 245000.00, 'pending', '4d88ca05-d4df-4753-a496-6fc9483e6a39', NULL, 'Jl. Raya Sudirman Kav. 21, Jakarta Selatan, 12345', NULL, NULL, '2026-07-01 14:54:08', NULL, 0, NULL, NULL, NULL),
(34, 12, 245000.00, 'completed', '48745d80-f10a-4528-b7ae-446f8fd45d03', NULL, 'Kp. Ciparahu RT001/RW007, Desa Kiarasari\nKecamatan Sukajaya, Jakarta Selatan, 16660', 'JNE123456', 'JNE', '2026-07-01 15:00:16', NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_purchase` int(11) NOT NULL,
  `selected_image_url` varchar(255) DEFAULT NULL,
  `selected_size` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `variant_id`, `quantity`, `price_at_purchase`, `selected_image_url`, `selected_size`) VALUES
(1, 1, 1, NULL, 1, 7500000, NULL, NULL),
(2, 2, 5, NULL, 1, 1200000, NULL, NULL),
(3, 2, 4, NULL, 1, 850000, NULL, NULL),
(4, 3, 15, NULL, 1, 320000, NULL, NULL),
(5, 4, 17, NULL, 1, 215000, NULL, NULL),
(6, 4, 20, NULL, 3, 89000, NULL, NULL),
(7, 5, 6, NULL, 1, 1450000, NULL, NULL),
(8, 5, 5, NULL, 1, 1200000, NULL, NULL),
(9, 6, 4, NULL, 1, 850000, NULL, NULL),
(10, 7, 16, NULL, 1, 198000, NULL, NULL),
(11, 7, 20, NULL, 2, 89000, NULL, NULL),
(12, 8, 23, NULL, 2, 65000, NULL, NULL),
(13, 8, 22, NULL, 1, 75000, NULL, NULL),
(14, 9, 42, NULL, 1, 395000, NULL, NULL),
(15, 9, 45, NULL, 2, 145000, NULL, NULL),
(16, 10, 26, NULL, 1, 459000, NULL, NULL),
(17, 11, 41, NULL, 1, 285000, NULL, NULL),
(18, 11, 43, NULL, 3, 125000, NULL, NULL),
(19, 11, 45, NULL, 2, 145000, NULL, NULL),
(20, 12, 36, NULL, 1, 189000, NULL, NULL),
(21, 12, 38, NULL, 1, 129000, NULL, NULL),
(22, 13, 32, NULL, 1, 895000, NULL, NULL),
(23, 14, 33, NULL, 1, 425000, NULL, NULL),
(24, 14, 44, NULL, 1, 195000, NULL, NULL),
(25, 15, 31, NULL, 1, 385000, NULL, NULL),
(26, 15, 35, NULL, 1, 675000, NULL, NULL),
(27, 16, 29, NULL, 1, 685000, NULL, NULL),
(28, 17, 1, NULL, 1, 7500000, NULL, NULL),
(29, 18, 42, NULL, 1, 395000, NULL, NULL),
(30, 19, 37, NULL, 2, 145000, NULL, NULL),
(31, 19, 40, NULL, 2, 115000, NULL, NULL),
(32, 20, 46, NULL, 1, 265000, NULL, NULL),
(33, 21, 3, NULL, 1, 5800000, NULL, NULL),
(34, 22, 1, NULL, 1, 7500000, NULL, NULL),
(35, 23, 26, NULL, 1, 459000, NULL, NULL),
(36, 24, 8, NULL, 1, 11000000, NULL, NULL),
(37, 25, 50, NULL, 1, 325000, NULL, NULL),
(38, 25, 49, NULL, 1, 245000, NULL, NULL),
(39, 25, 48, NULL, 1, 195000, NULL, NULL),
(40, 25, 46, NULL, 1, 265000, NULL, NULL),
(41, 26, 3, NULL, 1, 5800000, NULL, NULL),
(42, 26, 49, NULL, 1, 245000, NULL, NULL),
(43, 27, 42, NULL, 1, 395000, NULL, NULL),
(44, 28, 49, NULL, 1, 245000, NULL, NULL),
(45, 29, 49, NULL, 1, 245000, NULL, NULL),
(46, 30, 50, NULL, 1, 325000, NULL, NULL),
(47, 31, 49, 15, 1, 245000, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216495/ecommerce_uploads/dw5pncial0vd9p2order.jpg', 'M'),
(48, 31, 39, 114, 1, 142500, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217218/ecommerce_uploads/ohbnhx5heted3nuwcnsa.jpg', '50 ml'),
(49, 32, 45, 126, 1, 174000, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216788/ecommerce_uploads/fa112flfd8b7fg9avpxl.jpg', 'Pro / Biru'),
(50, 33, 49, 15, 1, 245000, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216495/ecommerce_uploads/dw5pncial0vd9p2order.jpg', 'M'),
(51, 34, 49, 16, 1, 245000, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216495/ecommerce_uploads/dw5pncial0vd9p2order.jpg', 'L');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `average_rating` decimal(3,2) DEFAULT 0.00,
  `total_reviews` int(11) DEFAULT 0,
  `sold_count` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock`, `average_rating`, `total_reviews`, `sold_count`, `created_at`) VALUES
(1, 1, 'Laptop ASUS VivoBook 15', 'Laptop ringan dengan layar 15.6 inci Full HD, prosesor Intel Core i5 Gen 12, RAM 16GB DDR4, SSD 512GB. Cocok untuk pekerjaan dan hiburan sehari-hari. Baterai tahan hingga 8 jam.', 8500000, 15, 5.00, 1, 0, '2026-01-10 08:00:00'),
(2, 1, 'Laptop Lenovo ThinkPad E15', 'ThinkPad E15 hadir dengan prosesor AMD Ryzen 5, RAM 8GB, SSD 256GB. Keyboard nyaman untuk mengetik panjang, cocok untuk profesional dan mahasiswa yang aktif.', 9500000, 30, 0.00, 0, 0, '2026-01-12 09:00:00'),
(3, 1, 'Smartphone Samsung Galaxy A55', 'Ponsel flagship dengan layar Super AMOLED 6.6 inci 120Hz, kamera utama 50MP OIS, baterai 5000mAh fast charging 45W. Hadir dalam warna Navy, Awesome Iceblue, dan Awesome Lilac.', 5800000, 79, 5.00, 1, 1, '2026-01-15 10:00:00'),
(4, 1, 'Earphone TWS Soundcore Liberty 4', 'True Wireless Stereo earbuds dengan ANC aktif, suara Hi-Res, koneksi multipoint Bluetooth 5.3. Masa pakai baterai hingga 28 jam dengan case. Cocok untuk gym dan perjalanan.', 850000, 120, 4.00, 2, 0, '2026-01-18 11:00:00'),
(5, 1, 'Mouse Logitech MX Master 3S', 'Mouse ergonomis premium dengan scroll MagSpeed elektromagnetik, resolusi hingga 8000 DPI, konektivitas Bluetooth & USB. Ideal untuk desainer dan programmer.', 1200000, 60, 4.50, 2, 0, '2026-01-20 12:00:00'),
(6, 1, 'Keyboard Mechanical Keychron K2', 'Keyboard mechanical compact 75%, tersedia switch Gateron Red/Brown/Blue. Kompatibel Windows & Mac, mode kabel dan wireless Bluetooth. Backlight RGB yang indah.', 1450000, 35, 5.00, 1, 0, '2026-01-22 13:00:00'),
(7, 1, 'Monitor LG 27GP850-B 27\"', 'Gaming monitor 27 inci QHD 2560x1440, refresh rate 165Hz, 1ms GTG, panel Nano IPS. NVIDIA G-Sync Compatible & AMD FreeSync Premium. Warna akurat sRGB 99%.', 4200000, 20, 0.00, 0, 0, '2026-01-25 14:00:00'),
(8, 1, 'Tablet iPad Air 11\" M2', 'iPad Air dengan chip Apple M2, layar Liquid Retina 11 inci, kompatibel Apple Pencil Pro dan Magic Keyboard. Penyimpanan 128GB, warna Starlight, Blue, Purple, Midnight.', 10999997, 25, 0.00, 0, 0, '2026-01-28 15:00:00'),
(9, 2, 'Kemeja Batik Pria Lengan Panjang', 'Kemeja batik motif kawung modern dengan bahan katun premium. Cocok untuk acara formal maupun casual. Tersedia ukuran S, M, L, XL, XXL dalam warna Navy dan Cokelat.', 275000, 95, 0.00, 0, 0, '2026-02-01 08:00:00'),
(10, 2, 'Kaos Polos Oversize Premium', 'Kaos oversize dari bahan cotton combed 30s dengan berat 220gsm. Jahitan dobel untuk ketahanan maksimal. Tersedia dalam 10 pilihan warna, ukuran S-3XL.', 149000, 200, 0.00, 0, 0, '2026-02-03 09:00:00'),
(11, 2, 'Celana Chino Slim Fit', 'Celana chino bahan stretch premium, potongan slim fit yang modern dan elegan. Cocok dipadu dengan kemeja maupun kaos. Tersedia warna Khaki, Navy, Olive, dan Abu.', 285000, 75, 0.00, 0, 0, '2026-02-05 10:00:00'),
(12, 2, 'Jaket Bomber Pria Varsity', 'Jaket bomber dengan detail varsity style. Bahan luar polyester berkualitas dengan lapisan fleece hangat di dalam. Cocok untuk musim hujan. Warna Hitam dan Navy.', 485000, 50, 0.00, 0, 0, '2026-02-08 11:00:00'),
(13, 2, 'Polo Shirt Pria Lacoste Style', 'Polo shirt bahan pique cotton breathable, jahitan rapi dan nyaman dipakai seharian. Tersedia ukuran S-XXL dalam warna Putih, Hitam, Navy, Merah, dan Hijau.', 225000, 110, 0.00, 0, 0, '2026-02-10 12:00:00'),
(14, 2, 'Celana Jogger Pria Premium', 'Celana jogger dari bahan fleece katun tebal. Dilengkapi tali pinggang dan kantong ritsleting samping. Nyaman untuk santai di rumah maupun olahraga ringan.', 195000, 130, 0.00, 0, 0, '2026-02-12 13:00:00'),
(15, 3, 'Dress Midi Floral Wanita', 'Dress midi motif bunga dengan bahan rayon lembut dan jatuh. Dilengkapi karet pinggang untuk kenyamanan. Cocok untuk acara casual maupun semi-formal. Tersedia ukuran S-XL.', 320000, 80, 5.00, 1, 0, '2026-02-15 08:00:00'),
(16, 3, 'Blouse Wanita Casual Linen', 'Blouse linen premium dengan potongan loose yang nyaman. Bahan breathable dan tidak mudah kusut. Tersedia warna Putih, Cream, Biru Muda, dan Pink. Ukuran S-XXL.', 198000, 120, 5.00, 1, 0, '2026-02-18 09:00:00'),
(17, 3, 'Rok Plisket Midi Wanita', 'Rok plisket midi yang anggun dan elegan. Bahan sifon berkualitas, jatuh dengan indah. Elastis di pinggang untuk kenyamanan pemakaian. Tersedia 8 pilihan warna.', 215000, 90, 4.00, 1, 0, '2026-02-20 10:00:00'),
(18, 3, 'Outer Rajut Wanita', 'Outer rajut dengan desain modern, cocok dipadupadankan dengan berbagai outfit. Bahan rajutan lembut dan hangat. Tersedia warna Cream, Cokelat, Abu, dan Hitam.', 295000, 65, 0.00, 0, 0, '2026-02-22 11:00:00'),
(19, 3, 'Celana Kulot Wanita Premium', 'Celana kulot bahan katun linen premium, jatuh dan nyaman dipakai seharian. Tersedia warna Hitam, Navy, Cokelat, dan Putih. Ukuran S-XL.', 185000, 100, 0.00, 0, 0, '2026-02-25 12:00:00'),
(20, 3, 'Hijab Voal Premium Motif', 'Hijab voal dengan motif bunga elegan, bahan tidak menerawang dan mudah dibentuk. Ukuran 115x115cm. Tersedia 15 motif pilihan.', 89000, 250, 4.50, 2, 0, '2026-02-28 13:00:00'),
(21, 4, 'Kopi Arabika Single Origin Gayo', 'Biji kopi arabika pilihan dari dataran tinggi Gayo, Aceh. Medium roast dengan profil rasa fruity, floral, dan sedikit asam yang menyegarkan. Berat 250gram.', 98000, 80, 0.00, 0, 0, '2026-03-01 08:00:00'),
(22, 4, 'Teh Herbal Chamomile Organik', 'Teh chamomile organik tanpa kafein, membantu relaksasi dan tidur lebih nyenyak. Kemasan 30 sachet premium. Bersertifikat organik internasional.', 75000, 150, 5.00, 1, 0, '2026-03-03 09:00:00'),
(23, 4, 'Cokelat Dark 70% Cacao Premium', 'Dark chocolate premium dengan kandungan kakao 70%, tanpa tambahan gula berlebih. Kaya antioksidan, baik untuk kesehatan jantung. Berat 100gram per batang.', 65000, 200, 4.00, 1, 0, '2026-03-05 10:00:00'),
(24, 4, 'Granola Sehat Oat & Madu', 'Granola renyah dari oat rolled premium dengan madu asli, kacang almond, dan cranberry. Kaya serat dan protein. Cocok sebagai sarapan atau camilan sehat. Berat 500gram.', 89000, 100, 0.00, 0, 0, '2026-03-08 11:00:00'),
(25, 4, 'Madu Hutan Asli Kalimantan', 'Madu hutan murni langsung dari lebah liar Kalimantan. Tidak dipanaskan untuk menjaga enzim dan nutrisi alami. Berat 500gram, kemasan kaca premium.', 125000, 60, 0.00, 0, 0, '2026-03-10 12:00:00'),
(26, 5, 'Tas Ransel Laptop Anti-Air', 'Backpack kapasitas 30L dengan kompartmen khusus laptop 15.6 inci. Bahan nilon anti-air dengan port USB external. Cocok untuk traveling dan kerja. Warna Hitam dan Abu.', 459000, 55, 5.00, 1, 0, '2026-03-12 08:00:00'),
(27, 5, 'Dompet Kulit Pria Slim', 'Dompet kulit sapi asli dengan desain slim minimalis. Dilengkapi 6 slot kartu, 1 kompartmen uang, dan 1 kantong ID transparan. Tersedia warna Cokelat dan Hitam.', 285000, 70, 0.00, 0, 0, '2026-03-14 09:00:00'),
(28, 5, 'Tote Bag Canvas Premium', 'Tote bag dari canvas tebal berkualitas, cocok untuk belanja dan aktivitas sehari-hari. Kapasitas besar dengan saku dalam. Tersedia berbagai warna dan motif menarik.', 145000, 180, 0.00, 0, 0, '2026-03-16 10:00:00'),
(29, 5, 'Jam Tangan Casio Analog Klasik', 'Jam tangan analog klasik Casio dengan tali leather cokelat. Water resistant 50m, akurasi tinggi. Tampilan bersih dan elegan, cocok untuk formal maupun casual.', 685000, 40, 5.00, 1, 0, '2026-03-18 11:00:00'),
(30, 5, 'Kacamata Hitam UV400', 'Kacamata hitam dengan lensa polarized UV400 proteksi penuh. Frame metal ringan anti-karat. Tersedia bentuk oval, wayfarer, dan cat-eye. Lengkap dengan case dan lap.', 275000, 90, 0.00, 0, 0, '2026-03-20 12:00:00'),
(31, 6, 'Sneakers Pria Casual Putih', 'Sneakers casual dengan sol karet EVA yang ringan dan nyaman. Upper canvas breathable. Desain clean dan minimalis, cocok dipadukan dengan berbagai outfit casual.', 385000, 65, 4.00, 1, 0, '2026-03-22 08:00:00'),
(32, 6, 'Sepatu Kulit Pria Formal Oxford', 'Sepatu pantofel kulit sapi asli dengan sol karet anti-slip. Jahitan Goodyear welt untuk ketahanan lama. Tersedia ukuran 39-44. Warna Hitam dan Cokelat Tua.', 895000, 30, 5.00, 1, 0, '2026-03-24 09:00:00'),
(33, 6, 'Sandal Gunung Eiger Adventure', 'Sandal gunung dengan outsole Vibram anti-slip, tali adjustable dan cepat kering. Cocok untuk hiking ringan hingga medium. Tersedia ukuran 37-44.', 425000, 50, 4.00, 1, 0, '2026-03-26 10:00:00'),
(34, 6, 'Sneakers Wanita Platform', 'Sneakers wanita dengan platform sole 4cm yang trendi. Upper sintetis lembut dengan detail chunky. Tersedia warna Putih, Pink, dan Hitam. Ukuran 36-40.', 465000, 55, 0.00, 0, 0, '2026-03-28 11:00:00'),
(35, 6, 'Sepatu Olahraga Running Pro', 'Sepatu lari dengan teknologi air cushion di sol, upper mesh breathable ringan. Bobot hanya 280gram, cocok untuk lari jarak jauh. Tersedia ukuran 38-45.', 675000, 40, 5.00, 1, 0, '2026-03-30 12:00:00'),
(36, 7, 'Serum Vitamin C 20% Brightening', 'Serum vitamin C konsentrasi 20% dengan niacinamide dan hyaluronic acid. Mencerahkan kulit, meratakan warna, dan memudarkan noda hitam. Cocok untuk kulit normal-berminyak.', 189000, 150, 4.00, 1, 0, '2026-04-01 08:00:00'),
(37, 7, 'Moisturizer Gel Hyaluronic Acid', 'Pelembab gel tekstur ringan tidak lengket, mengandung hyaluronic acid 2% dan panthenol. Melembabkan kulit hingga 72 jam. Aman untuk semua jenis kulit termasuk sensitif.', 145000, 120, 0.00, 0, 0, '2026-04-03 09:00:00'),
(38, 7, 'Sunscreen SPF 50 PA++++', 'Sunscreen dengan perlindungan SPF 50 PA++++ dari sinar UVA dan UVB. Tekstur ringan, tidak meninggalkan white cast. Cocok dipakai sebelum makeup. Kandungan niacinamide dan aloe vera.', 129000, 200, 5.00, 1, 0, '2026-04-05 10:00:00'),
(39, 7, 'Lipstik Matte Tahan Lama', 'Lipstik matte dengan formula tahan hingga 12 jam, tidak kering dan tidak menempel di gigi. Tersedia 15 pilihan shade dari nude hingga bold. Transfer-proof formula.', 95000, 179, 5.00, 1, 1, '2026-04-07 11:00:00'),
(40, 7, 'Masker Wajah Clay Detox', 'Masker wajah dari kaolin clay murni, membantu membersihkan pori-pori, mengontrol minyak, dan mengangkat sel kulit mati. Diperkaya dengan tea tree oil dan charcoal. Isi 100gram.', 115000, 160, 0.00, 0, 0, '2026-04-09 12:00:00'),
(41, 8, 'Matras Yoga Premium 6mm', 'Matras yoga dari bahan TPE ramah lingkungan, ketebalan 6mm untuk kenyamanan sendi. Anti-slip di kedua sisi, mudah digulung dan dibawa. Ukuran 183x61cm.', 285000, 70, 5.00, 1, 0, '2026-04-10 08:00:00'),
(42, 8, 'Dumbbell Set Hex Rubber 5kg', 'Sepasang dumbbell hex 5kg per sisi dengan coating rubber yang melindungi lantai. Handle anti-slip nyaman digenggam. Cocok untuk latihan di rumah.', 395000, 44, 4.00, 1, 1, '2026-04-12 09:00:00'),
(43, 8, 'Tali Skipping Speed Rope', 'Tali skipping dengan bearing presisi untuk kecepatan tinggi. Tali PVC 3mm, handle aluminium ergonomis, panjang adjustable hingga 3 meter. Cocok untuk latihan cardio.', 125000, 100, 0.00, 0, 0, '2026-04-14 10:00:00'),
(44, 8, 'Celana Training Pria Dry-Fit', 'Celana olahraga bahan polyester dry-fit yang menyerap keringat dengan cepat. Desain 2-in-1 dengan celana pendek dalam. Tersedia ukuran S-XL warna Hitam dan Abu.', 195000, 85, 4.00, 1, 0, '2026-04-16 11:00:00'),
(45, 8, 'Botol Minum Stainless 750ml', 'Tumbler stainless steel double wall 750ml, menjaga minuman dingin 24 jam dan panas 12 jam. Mulut lebar mudah dibersihkan. Anti-bocor, BPA-free. Tersedia 8 warna.', 145000, 149, 4.50, 2, 1, '2026-04-18 12:00:00'),
(46, 8, 'Baju Olahraga Wanita Sports Bra Set', 'Set baju olahraga wanita terdiri dari sports bra dan legging. Bahan lycra 4-way stretch, high waist legging dengan saku kecil. Tersedia ukuran S-XL, 5 pilihan warna.', 265000, 74, 0.00, 0, 0, '2026-04-20 13:00:00'),
(47, 1, 'Powerbank Anker 20000mAh', 'Powerbank kapasitas 20000mAh dengan pengisian 2 perangkat sekaligus. Teknologi PowerIQ 3.0, output maksimal 18W. Dilengkapi port USB-A, USB-C, dan Micro-USB. Garansi 18 bulan.', 489000, 90, 0.00, 0, 0, '2026-04-22 08:00:00'),
(48, 5, 'Belt Kulit Pria Formal', 'Ikat pinggang kulit sapi genuine leather, lebar 3.5cm. Buckle metal silver/gold. Cocok untuk celana formal maupun celana jeans. Panjang adjustable 105-125cm.', 195000, 79, 0.00, 0, 0, '2026-04-24 09:00:00'),
(49, 2, 'Kemeja Flannel Kotak-Kotak Pria', 'Kemeja flannel motif kotak-kotak klasik, bahan cotton flannel tebal dan hangat. Cocok untuk cuaca dingin atau gaya casual vintage. Tersedia ukuran S-XXL.', 245000, 83, 5.00, 2, 6, '2026-04-26 10:00:00'),
(50, 3, 'Cardigan Wanita Knit Premium', 'Cardigan rajut dengan desain elegan dan detail kancing cantik. Bahan knit lembut dan hangat. Cocok untuk office look maupun casual. Tersedia ukuran S-XL, 6 pilihan warna.', 325000, 58, 5.00, 1, 1, '2026-04-28 11:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `created_at`) VALUES
(1, 50, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216437/ecommerce_uploads/vxzo8iqt83taadvdf8xe.jpg', 1, '2026-06-23 12:07:18'),
(2, 50, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216437/ecommerce_uploads/kqmo1ambtkuq3vg05xu5.jpg', 0, '2026-06-23 12:07:18'),
(3, 50, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216438/ecommerce_uploads/j0zsu5pnw35uvw1oqexz.jpg', 0, '2026-06-23 12:07:18'),
(7, 48, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216613/ecommerce_uploads/anndxev0f1eo5srrxhnf.jpg', 1, '2026-06-23 12:10:13'),
(8, 48, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216613/ecommerce_uploads/dwgcij493hf60uvsiubl.jpg', 0, '2026-06-23 12:10:13'),
(9, 48, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216613/ecommerce_uploads/aoqbhr36yb3cgktaqzym.jpg', 0, '2026-06-23 12:10:13'),
(10, 47, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216675/ecommerce_uploads/eo8tysji4h2emjjwxody.jpg', 1, '2026-06-23 12:11:16'),
(11, 47, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216675/ecommerce_uploads/naxxaccx7v2f0y83qjyt.jpg', 0, '2026-06-23 12:11:16'),
(12, 47, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216676/ecommerce_uploads/ccsmukue2grzuqja9me3.jpg', 0, '2026-06-23 12:11:16'),
(13, 46, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216739/ecommerce_uploads/pwb6cxgt4p5efd57zbi3.png', 1, '2026-06-23 12:12:22'),
(14, 46, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216741/ecommerce_uploads/gvjoeoz3q818vafi5jsa.png', 0, '2026-06-23 12:12:22'),
(15, 46, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216742/ecommerce_uploads/m5adpnl0waovtbszzavr.jpg', 0, '2026-06-23 12:12:22'),
(16, 45, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216788/ecommerce_uploads/fa112flfd8b7fg9avpxl.jpg', 1, '2026-06-23 12:13:10'),
(17, 45, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216788/ecommerce_uploads/lurt1hlt7tw8xtlt2alp.jpg', 0, '2026-06-23 12:13:10'),
(18, 45, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216790/ecommerce_uploads/lso6zkpvozmu7jce0scc.jpg', 0, '2026-06-23 12:13:10'),
(19, 44, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216859/ecommerce_uploads/kjl2h98vyz24lgr57c4i.jpg', 1, '2026-06-23 12:14:19'),
(20, 44, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216859/ecommerce_uploads/uguncnvae51coogiaor4.jpg', 0, '2026-06-23 12:14:19'),
(21, 44, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216859/ecommerce_uploads/zqjwiwzdqbpzjyzzhopw.jpg', 0, '2026-06-23 12:14:19'),
(22, 43, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216939/ecommerce_uploads/ev5hx0qjglaavxdvhkmo.jpg', 1, '2026-06-23 12:15:40'),
(23, 43, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216939/ecommerce_uploads/r86ag9hfymdrm4rjwvbo.jpg', 0, '2026-06-23 12:15:40'),
(24, 43, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216939/ecommerce_uploads/zyu6imxh9crliu4lpewr.jpg', 0, '2026-06-23 12:15:40'),
(25, 40, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217008/ecommerce_uploads/yfuggq4yl6fzx7krdtxo.jpg', 1, '2026-06-23 12:16:49'),
(26, 40, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217008/ecommerce_uploads/crbmq059tedzh7bkpxbl.jpg', 0, '2026-06-23 12:16:49'),
(27, 40, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217008/ecommerce_uploads/opehqpdnuozt7rg9yqle.jpg', 0, '2026-06-23 12:16:49'),
(28, 41, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217077/ecommerce_uploads/egitfoufafblbjot64vz.jpg', 1, '2026-06-23 12:17:58'),
(29, 41, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217077/ecommerce_uploads/a1tvbcmc5hjkau1wjnxz.jpg', 0, '2026-06-23 12:17:58'),
(30, 41, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217077/ecommerce_uploads/rmgq4emjpbyjrtfb8md5.jpg', 0, '2026-06-23 12:17:58'),
(31, 42, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217165/ecommerce_uploads/tv84gpe7dd21mdocuq60.jpg', 1, '2026-06-23 12:19:26'),
(32, 42, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217165/ecommerce_uploads/ddhy5hamlnb9pxhoevqj.jpg', 0, '2026-06-23 12:19:26'),
(33, 42, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217165/ecommerce_uploads/gg4fn2bfquu40rgxgpja.jpg', 0, '2026-06-23 12:19:26'),
(34, 39, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217218/ecommerce_uploads/ohbnhx5heted3nuwcnsa.jpg', 1, '2026-06-23 12:20:20'),
(35, 39, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217219/ecommerce_uploads/spvwdrcuw98gw5ptyyyg.jpg', 0, '2026-06-23 12:20:20'),
(36, 39, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217219/ecommerce_uploads/i2guniucn18urw1zessk.jpg', 0, '2026-06-23 12:20:20'),
(37, 38, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217379/ecommerce_uploads/gnli7scybrj8zzpp5exx.jpg', 1, '2026-06-23 12:22:59'),
(38, 38, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217379/ecommerce_uploads/tub0g179lvd570qfhzvn.jpg', 0, '2026-06-23 12:22:59'),
(39, 38, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217378/ecommerce_uploads/xpz6w1ybhzj3qnrchdce.webp', 0, '2026-06-23 12:22:59'),
(40, 37, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217511/ecommerce_uploads/ly2njvsoiyrvbrmvmw7v.jpg', 1, '2026-06-23 12:25:13'),
(41, 37, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217511/ecommerce_uploads/xzrgp3yq14ulwgohbqo2.jpg', 0, '2026-06-23 12:25:13'),
(42, 37, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217511/ecommerce_uploads/zoqvihlst4dlpcyetz45.jpg', 0, '2026-06-23 12:25:13'),
(43, 36, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217684/ecommerce_uploads/cqbsqmu7ixujzde0qerg.webp', 1, '2026-06-23 12:28:06'),
(44, 36, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217685/ecommerce_uploads/eaygzfoss4arqrbqdvm6.jpg', 0, '2026-06-23 12:28:06'),
(45, 36, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217685/ecommerce_uploads/d5dtiwbp7pdwubkemato.jpg', 0, '2026-06-23 12:28:06'),
(46, 35, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217823/ecommerce_uploads/uhiylu23po41lcj6dflg.jpg', 1, '2026-06-23 12:30:24'),
(47, 35, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217823/ecommerce_uploads/ed1o0uv3m6bo1enj6j1v.jpg', 0, '2026-06-23 12:30:24'),
(48, 35, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217824/ecommerce_uploads/crc9tsuhvbvr3iu02uzn.jpg', 0, '2026-06-23 12:30:24'),
(49, 34, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217955/ecommerce_uploads/j75rnwo1aiy3fzob76zy.jpg', 1, '2026-06-23 12:32:36'),
(50, 34, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217955/ecommerce_uploads/l6rnt50bejzohhd7esx6.webp', 0, '2026-06-23 12:32:36'),
(51, 34, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782217955/ecommerce_uploads/h9qaughnoz2a1yz47jtr.jpg', 0, '2026-06-23 12:32:36'),
(55, 33, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218113/ecommerce_uploads/fdof3nqlox1dmtebqawo.jpg', 1, '2026-06-23 12:35:49'),
(56, 33, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218112/ecommerce_uploads/tpzgfbganehmewabxvui.jpg', 0, '2026-06-23 12:35:49'),
(57, 33, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218112/ecommerce_uploads/fecsvt0fl8cusuafk0iz.jpg', 0, '2026-06-23 12:35:49'),
(58, 32, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218356/ecommerce_uploads/ba0kobgneog7vd4kscjg.jpg', 1, '2026-06-23 12:39:17'),
(59, 32, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218356/ecommerce_uploads/jpvfazbvfwedvx88zhsr.jpg', 0, '2026-06-23 12:39:17'),
(60, 32, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218356/ecommerce_uploads/dlntysjaiezbeg5ygfms.jpg', 0, '2026-06-23 12:39:17'),
(61, 31, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218484/ecommerce_uploads/wwfjphvrqj9l6mvugt3g.jpg', 1, '2026-06-23 12:41:26'),
(62, 31, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218485/ecommerce_uploads/bmkoxyeltngzafhonnsf.png', 0, '2026-06-23 12:41:26'),
(63, 31, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218485/ecommerce_uploads/tkjyrlu4khcmxywrt1x8.jpg', 0, '2026-06-23 12:41:26'),
(64, 30, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218600/ecommerce_uploads/xgc6g7lymk3wm3xay2i0.jpg', 1, '2026-06-23 12:43:20'),
(65, 30, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218599/ecommerce_uploads/jp1iiinrwwoqjmg5z7tv.jpg', 0, '2026-06-23 12:43:20'),
(66, 30, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218599/ecommerce_uploads/sl22cwlpgptl1fanmp60.jpg', 0, '2026-06-23 12:43:20'),
(70, 29, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218730/ecommerce_uploads/yiqfzji15z6teiiownvx.jpg', 1, '2026-06-23 12:47:14'),
(71, 29, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218731/ecommerce_uploads/fclcpvukrutzsea6iika.jpg', 0, '2026-06-23 12:47:14'),
(72, 29, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782218731/ecommerce_uploads/e9fv7agfbrwu9lj9jl1n.jpg', 0, '2026-06-23 12:47:14'),
(73, 28, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219006/ecommerce_uploads/vxhx9sdty8cxwqbwu9nl.jpg', 1, '2026-06-23 12:50:08'),
(74, 28, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219007/ecommerce_uploads/noqrtsptc7lerqonbifq.jpg', 0, '2026-06-23 12:50:08'),
(75, 28, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219006/ecommerce_uploads/djbv9apdkoz40ilkpt6y.jpg', 0, '2026-06-23 12:50:08'),
(76, 27, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219147/ecommerce_uploads/iyykdmryncjybvnpraog.jpg', 1, '2026-06-23 12:52:28'),
(77, 27, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219147/ecommerce_uploads/xtehqgn8ov87drrgnl9j.jpg', 0, '2026-06-23 12:52:28'),
(78, 27, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219147/ecommerce_uploads/kd3yjzzxhmsqfwqg7tuf.jpg', 0, '2026-06-23 12:52:28'),
(79, 26, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219300/ecommerce_uploads/rv4l5vx1tkejvpis3dwv.jpg', 1, '2026-06-23 12:55:02'),
(80, 26, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219300/ecommerce_uploads/tw9rtocsl4gy9btkk0y8.jpg', 0, '2026-06-23 12:55:02'),
(81, 26, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219300/ecommerce_uploads/rreu2tgfqeljtlr0vfwv.jpg', 0, '2026-06-23 12:55:02'),
(82, 25, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219481/ecommerce_uploads/q7mcl2jketcd1c03vqhi.jpg', 1, '2026-06-23 12:58:01'),
(83, 25, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219481/ecommerce_uploads/zb3eir5vdswlrhq2ned9.jpg', 0, '2026-06-23 12:58:01'),
(84, 25, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219480/ecommerce_uploads/r5nlfcukodoakhoydzan.jpg', 0, '2026-06-23 12:58:01'),
(85, 24, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219777/ecommerce_uploads/zpuhj3gcwhocsuxkht1r.jpg', 1, '2026-06-23 13:02:58'),
(86, 24, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219777/ecommerce_uploads/h70bwq8tsyfsauwyqmne.jpg', 0, '2026-06-23 13:02:58'),
(87, 24, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219777/ecommerce_uploads/u90r7sr28hjbxerrvdmk.jpg', 0, '2026-06-23 13:02:58'),
(88, 23, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219967/ecommerce_uploads/fppumgo9egugn4pcati5.jpg', 1, '2026-06-23 13:06:08'),
(89, 23, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219968/ecommerce_uploads/izn32zsxsxvtnarbndyr.jpg', 0, '2026-06-23 13:06:08'),
(90, 23, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782219967/ecommerce_uploads/yvzjidbicbpgurmoshpk.jpg', 0, '2026-06-23 13:06:08'),
(91, 22, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782220466/ecommerce_uploads/fhmzytduoi1zhtmh76bq.jpg', 1, '2026-06-23 13:14:27'),
(92, 22, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782220467/ecommerce_uploads/o17ryxj4bnkdwjsl2xwg.jpg', 0, '2026-06-23 13:14:27'),
(93, 22, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782220466/ecommerce_uploads/dgburloqllpopqx9cl7e.jpg', 0, '2026-06-23 13:14:27'),
(94, 21, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782220606/ecommerce_uploads/chvrpfq8omcfn0dwwebg.jpg', 1, '2026-06-23 13:16:47'),
(95, 21, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782220606/ecommerce_uploads/rukxxwonpblc6k7daysf.jpg', 0, '2026-06-23 13:16:47'),
(96, 21, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782220606/ecommerce_uploads/petgpijcgmxytnt6trt5.jpg', 0, '2026-06-23 13:16:47'),
(97, 20, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782220927/ecommerce_uploads/w1difcyiohbdqbkky2mc.jpg', 1, '2026-06-23 13:22:08'),
(98, 20, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782220927/ecommerce_uploads/nrvnzsiiuguceltpmeiw.jpg', 0, '2026-06-23 13:22:08'),
(99, 20, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782220928/ecommerce_uploads/rtfpibmxpfso8p5zrtcf.jpg', 0, '2026-06-23 13:22:08'),
(100, 19, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221085/ecommerce_uploads/j4ofx9dzy5cdrrt0jaql.jpg', 1, '2026-06-23 13:24:46'),
(101, 19, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221085/ecommerce_uploads/gd9kkwnkmmdd9sv90cme.jpg', 0, '2026-06-23 13:24:46'),
(102, 19, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221085/ecommerce_uploads/fz9bgp2j71myizp9zprl.jpg', 0, '2026-06-23 13:24:46'),
(103, 18, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221233/ecommerce_uploads/uyu5uhowojiotfbdferb.jpg', 1, '2026-06-23 13:27:14'),
(104, 18, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221233/ecommerce_uploads/c6mg1hnugafyeh57keme.jpg', 0, '2026-06-23 13:27:14'),
(105, 18, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221233/ecommerce_uploads/lfnjhxv8aczmuocsatz9.jpg', 0, '2026-06-23 13:27:14'),
(106, 17, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221354/ecommerce_uploads/ao2mdshkybrdod5pd0ae.jpg', 1, '2026-06-23 13:29:15'),
(107, 17, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221354/ecommerce_uploads/fpts5pntzrpxombywogq.jpg', 0, '2026-06-23 13:29:15'),
(108, 17, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221354/ecommerce_uploads/wqy6x1j3wpikhxulbux0.jpg', 0, '2026-06-23 13:29:15'),
(109, 16, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221458/ecommerce_uploads/v9aw8dlvgzlfcrvi8kl1.jpg', 1, '2026-06-23 13:30:59'),
(110, 16, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221459/ecommerce_uploads/d1hfebt88goserksba02.jpg', 0, '2026-06-23 13:30:59'),
(111, 16, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782221458/ecommerce_uploads/ta2vsa2xr3qzw8haoq37.jpg', 0, '2026-06-23 13:30:59'),
(112, 15, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782222935/ecommerce_uploads/kwtblfd7qqgnhjemiten.jpg', 1, '2026-06-23 13:55:36'),
(113, 15, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782222935/ecommerce_uploads/txngjxt7buy2257vkp8m.jpg', 0, '2026-06-23 13:55:36'),
(114, 15, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782222935/ecommerce_uploads/rffwseitmgoayi5nuv9h.jpg', 0, '2026-06-23 13:55:36'),
(121, 6, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782225704/ecommerce_uploads/yfrj0uoym1rgfprossdg.jpg', 1, '2026-06-23 14:41:45'),
(122, 6, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782225704/ecommerce_uploads/wrz9ehpneejflvi2kjwe.jpg', 0, '2026-06-23 14:41:45'),
(123, 6, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782225705/ecommerce_uploads/tr2cxr3agi8otzokfw7k.jpg', 0, '2026-06-23 14:41:45'),
(124, 8, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782811431/ecommerce_uploads/dejkhw0xxsca5jbureqs.jpg', 1, '2026-06-30 09:23:54'),
(125, 8, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782811432/ecommerce_uploads/gjhxlrwpan8clfu7cdie.jpg', 0, '2026-06-30 09:23:54'),
(126, 8, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782811434/ecommerce_uploads/e3ow0i1cdbgmaywzd4qe.jpg', 0, '2026-06-30 09:23:54'),
(133, 49, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216495/ecommerce_uploads/dw5pncial0vd9p2order.jpg', 1, '2026-07-01 08:34:37'),
(134, 49, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216495/ecommerce_uploads/iokqpxtuj1vs5enrhm0x.jpg', 0, '2026-07-01 08:34:37'),
(135, 49, 'https://res.cloudinary.com/dsauphhgf/image/upload/v1782216495/ecommerce_uploads/w07u4bkqc3ssntnuudqb.jpg', 0, '2026-07-01 08:34:37');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `price`, `stock`, `created_at`) VALUES
(3, 1, 'SKU-TEST-HTTP', 75000, 20, '2026-07-01 07:41:04'),
(15, 49, NULL, 245000, 18, '2026-07-01 08:34:37'),
(16, 49, NULL, 245000, 65, '2026-07-01 08:34:37'),
(17, 2, 'SKU-2-1', 9500000, 15, '2026-07-01 08:39:18'),
(18, 2, 'SKU-2-2', 11400000, 15, '2026-07-01 08:39:18'),
(19, 3, 'SKU-3-1', 5800000, 39, '2026-07-01 08:39:18'),
(20, 3, 'SKU-3-2', 6670000, 39, '2026-07-01 08:39:18'),
(21, 4, 'SKU-4-1', 850000, 60, '2026-07-01 08:39:19'),
(22, 4, 'SKU-4-2', 977500, 60, '2026-07-01 08:39:19'),
(23, 5, 'SKU-5-1', 1200000, 36, '2026-07-01 08:39:19'),
(24, 5, 'SKU-5-2', 1200000, 24, '2026-07-01 08:39:19'),
(25, 6, 'SKU-6-1', 1450000, 21, '2026-07-01 08:39:19'),
(26, 6, 'SKU-6-2', 1450000, 14, '2026-07-01 08:39:19'),
(27, 7, 'SKU-7-1', 4200000, 10, '2026-07-01 08:39:19'),
(28, 7, 'SKU-7-2', 5040000, 10, '2026-07-01 08:39:19'),
(29, 8, 'SKU-8-1', 10999997, 12, '2026-07-01 08:39:19'),
(30, 8, 'SKU-8-2', 13199996, 12, '2026-07-01 08:39:19'),
(31, 9, 'SKU-9-1', 275000, 28, '2026-07-01 08:39:19'),
(32, 9, 'SKU-9-2', 275000, 38, '2026-07-01 08:39:19'),
(33, 9, 'SKU-9-3', 275000, 28, '2026-07-01 08:39:19'),
(34, 10, 'SKU-10-1', 149000, 60, '2026-07-01 08:39:19'),
(35, 10, 'SKU-10-2', 149000, 80, '2026-07-01 08:39:19'),
(36, 10, 'SKU-10-3', 149000, 60, '2026-07-01 08:39:19'),
(37, 11, 'SKU-11-1', 285000, 22, '2026-07-01 08:39:19'),
(38, 11, 'SKU-11-2', 285000, 30, '2026-07-01 08:39:19'),
(39, 11, 'SKU-11-3', 285000, 22, '2026-07-01 08:39:19'),
(40, 12, 'SKU-12-1', 485000, 15, '2026-07-01 08:39:19'),
(41, 12, 'SKU-12-2', 485000, 20, '2026-07-01 08:39:19'),
(42, 12, 'SKU-12-3', 485000, 15, '2026-07-01 08:39:19'),
(43, 13, 'SKU-13-1', 225000, 33, '2026-07-01 08:39:19'),
(44, 13, 'SKU-13-2', 225000, 44, '2026-07-01 08:39:19'),
(45, 13, 'SKU-13-3', 225000, 33, '2026-07-01 08:39:19'),
(46, 14, 'SKU-14-1', 195000, 39, '2026-07-01 08:39:19'),
(47, 14, 'SKU-14-2', 195000, 52, '2026-07-01 08:39:19'),
(48, 14, 'SKU-14-3', 195000, 39, '2026-07-01 08:39:19'),
(49, 15, 'SKU-15-1', 320000, 24, '2026-07-01 08:39:19'),
(50, 15, 'SKU-15-2', 320000, 32, '2026-07-01 08:39:19'),
(51, 15, 'SKU-15-3', 320000, 24, '2026-07-01 08:39:19'),
(52, 16, 'SKU-16-1', 198000, 36, '2026-07-01 08:39:19'),
(53, 16, 'SKU-16-2', 198000, 48, '2026-07-01 08:39:19'),
(54, 16, 'SKU-16-3', 198000, 36, '2026-07-01 08:39:19'),
(55, 17, 'SKU-17-1', 215000, 27, '2026-07-01 08:39:19'),
(56, 17, 'SKU-17-2', 215000, 36, '2026-07-01 08:39:19'),
(57, 17, 'SKU-17-3', 215000, 27, '2026-07-01 08:39:19'),
(58, 18, 'SKU-18-1', 295000, 19, '2026-07-01 08:39:19'),
(59, 18, 'SKU-18-2', 295000, 26, '2026-07-01 08:39:19'),
(60, 18, 'SKU-18-3', 295000, 19, '2026-07-01 08:39:19'),
(61, 19, 'SKU-19-1', 185000, 30, '2026-07-01 08:39:19'),
(62, 19, 'SKU-19-2', 185000, 40, '2026-07-01 08:39:19'),
(63, 19, 'SKU-19-3', 185000, 30, '2026-07-01 08:39:19'),
(64, 20, 'SKU-20-1', 89000, 75, '2026-07-01 08:39:19'),
(65, 20, 'SKU-20-2', 89000, 100, '2026-07-01 08:39:19'),
(66, 20, 'SKU-20-3', 89000, 75, '2026-07-01 08:39:19'),
(67, 21, 'SKU-21-1', 98000, 40, '2026-07-01 08:39:19'),
(68, 21, 'SKU-21-2', 176400, 40, '2026-07-01 08:39:19'),
(69, 22, 'SKU-22-1', 75000, 75, '2026-07-01 08:39:19'),
(70, 22, 'SKU-22-2', 135000, 75, '2026-07-01 08:39:19'),
(71, 23, 'SKU-23-1', 65000, 100, '2026-07-01 08:39:19'),
(72, 23, 'SKU-23-2', 117000, 100, '2026-07-01 08:39:19'),
(73, 24, 'SKU-24-1', 89000, 50, '2026-07-01 08:39:19'),
(74, 24, 'SKU-24-2', 160200, 50, '2026-07-01 08:39:19'),
(75, 25, 'SKU-25-1', 125000, 30, '2026-07-01 08:39:19'),
(76, 25, 'SKU-25-2', 225000, 30, '2026-07-01 08:39:19'),
(77, 26, 'SKU-26-1', 459000, 27, '2026-07-01 08:39:19'),
(78, 26, 'SKU-26-2', 459000, 27, '2026-07-01 08:39:19'),
(79, 27, 'SKU-27-1', 285000, 35, '2026-07-01 08:39:19'),
(80, 27, 'SKU-27-2', 285000, 35, '2026-07-01 08:39:19'),
(81, 28, 'SKU-28-1', 145000, 90, '2026-07-01 08:39:19'),
(82, 28, 'SKU-28-2', 145000, 90, '2026-07-01 08:39:19'),
(83, 29, 'SKU-29-1', 685000, 20, '2026-07-01 08:39:19'),
(84, 29, 'SKU-29-2', 685000, 20, '2026-07-01 08:39:19'),
(85, 30, 'SKU-30-1', 275000, 45, '2026-07-01 08:39:19'),
(86, 30, 'SKU-30-2', 275000, 45, '2026-07-01 08:39:19'),
(87, 31, 'SKU-31-1', 385000, 16, '2026-07-01 08:39:19'),
(88, 31, 'SKU-31-2', 385000, 19, '2026-07-01 08:39:19'),
(89, 31, 'SKU-31-3', 385000, 16, '2026-07-01 08:39:19'),
(90, 31, 'SKU-31-4', 385000, 13, '2026-07-01 08:39:19'),
(91, 32, 'SKU-32-1', 895000, 7, '2026-07-01 08:39:19'),
(92, 32, 'SKU-32-2', 895000, 9, '2026-07-01 08:39:19'),
(93, 32, 'SKU-32-3', 895000, 7, '2026-07-01 08:39:19'),
(94, 32, 'SKU-32-4', 895000, 6, '2026-07-01 08:39:19'),
(95, 33, 'SKU-33-1', 425000, 12, '2026-07-01 08:39:19'),
(96, 33, 'SKU-33-2', 425000, 15, '2026-07-01 08:39:19'),
(97, 33, 'SKU-33-3', 425000, 12, '2026-07-01 08:39:19'),
(98, 33, 'SKU-33-4', 425000, 10, '2026-07-01 08:39:19'),
(99, 34, 'SKU-34-1', 465000, 13, '2026-07-01 08:39:19'),
(100, 34, 'SKU-34-2', 465000, 16, '2026-07-01 08:39:19'),
(101, 34, 'SKU-34-3', 465000, 13, '2026-07-01 08:39:19'),
(102, 34, 'SKU-34-4', 465000, 11, '2026-07-01 08:39:19'),
(103, 35, 'SKU-35-1', 675000, 10, '2026-07-01 08:39:19'),
(104, 35, 'SKU-35-2', 675000, 12, '2026-07-01 08:39:19'),
(105, 35, 'SKU-35-3', 675000, 10, '2026-07-01 08:39:19'),
(106, 35, 'SKU-35-4', 675000, 8, '2026-07-01 08:39:19'),
(107, 36, 'SKU-36-1', 189000, 75, '2026-07-01 08:39:19'),
(108, 36, 'SKU-36-2', 283500, 75, '2026-07-01 08:39:19'),
(109, 37, 'SKU-37-1', 145000, 60, '2026-07-01 08:39:19'),
(110, 37, 'SKU-37-2', 217500, 60, '2026-07-01 08:39:19'),
(111, 38, 'SKU-38-1', 129000, 100, '2026-07-01 08:39:19'),
(112, 38, 'SKU-38-2', 193500, 100, '2026-07-01 08:39:19'),
(113, 39, 'SKU-39-1', 95000, 90, '2026-07-01 08:39:19'),
(114, 39, 'SKU-39-2', 142500, 89, '2026-07-01 08:39:19'),
(115, 40, 'SKU-40-1', 115000, 80, '2026-07-01 08:39:19'),
(116, 40, 'SKU-40-2', 172500, 80, '2026-07-01 08:39:19'),
(117, 41, 'SKU-41-1', 285000, 42, '2026-07-01 08:39:19'),
(118, 41, 'SKU-41-2', 342000, 28, '2026-07-01 08:39:19'),
(119, 42, 'SKU-42-1', 395000, 26, '2026-07-01 08:39:19'),
(120, 42, 'SKU-42-2', 474000, 17, '2026-07-01 08:39:19'),
(121, 43, 'SKU-43-1', 125000, 60, '2026-07-01 08:39:19'),
(122, 43, 'SKU-43-2', 150000, 40, '2026-07-01 08:39:19'),
(123, 44, 'SKU-44-1', 195000, 51, '2026-07-01 08:39:19'),
(124, 44, 'SKU-44-2', 234000, 34, '2026-07-01 08:39:19'),
(125, 45, 'SKU-45-1', 145000, 90, '2026-07-01 08:39:19'),
(126, 45, 'SKU-45-2', 174000, 59, '2026-07-01 08:39:19'),
(127, 46, 'SKU-46-1', 265000, 44, '2026-07-01 08:39:19'),
(128, 46, 'SKU-46-2', 318000, 29, '2026-07-01 08:39:19'),
(129, 47, 'SKU-47-1', 489000, 54, '2026-07-01 08:39:19'),
(130, 47, 'SKU-47-2', 489000, 36, '2026-07-01 08:39:19'),
(131, 48, 'SKU-48-1', 195000, 39, '2026-07-01 08:39:19'),
(132, 48, 'SKU-48-2', 195000, 39, '2026-07-01 08:39:19'),
(133, 50, 'SKU-50-1', 325000, 17, '2026-07-01 08:39:19'),
(134, 50, 'SKU-50-2', 325000, 23, '2026-07-01 08:39:19'),
(135, 50, 'SKU-50-3', 325000, 17, '2026-07-01 08:39:19');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime NOT NULL
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
(27, 3, 12, 21, 5, 'Samsung Galaxy A55 ini luar biasa! Layar Super AMOLED 120Hz-nya jernih dan responsif banget. Kamera 50MP dengan OIS menghasilkan foto yang sangat bagus bahkan di kondisi cahaya rendah. Baterai 5000mAh tahan seharian penuh dengan pemakaian intensif. Sangat puas!', '2026-05-15 10:00:00'),
(28, 50, 12, 30, 5, 'baju nya mantap', '2026-06-30 09:47:15'),
(29, 49, 12, 31, 5, '', '2026-07-01 10:13:01'),
(30, 39, 12, 31, 5, '', '2026-07-01 10:13:13'),
(31, 49, 12, 34, 5, '', '2026-07-01 15:03:17');

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
  `created_at` datetime NOT NULL
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
(14, 'Muhamad Rojali', 'rojali@gmail.com', '$2b$10$QnzaMSfzF1mOq/2HyRRgQOKZVcvUeq0/EjPSbZRqE4Z0aeEaDfQW.', 'admin', '2026-06-21 08:59:45'),
(15, 'UAS Tester', 'tester_1782917371327@example.com', '$2b$10$Wf.0ZAS9PYcKFt9BqERwVe7M3za3EyU7e8J7SCTNiBYLYoL/SaFx6', 'customer', '2026-07-01 14:49:35'),
(16, 'UAS Tester', 'tester_1782917414003@example.com', '$2b$10$2R33u/YiKJuOeDmc4z5pbOXPFbbv0WtBql02etX9Pnj.tqs7.EkcO', 'customer', '2026-07-01 14:50:16'),
(17, 'UAS Tester', 'tester_1782917495052@example.com', '$2b$10$qiUg84350jrOBQ0MwEx59OMx91P.tDYEDH8TIuE.te9sT.zm7t1g.', 'customer', '2026-07-01 14:51:39'),
(18, 'UAS Tester', 'tester_1782917528999@example.com', '$2b$10$2VDcXHksouttvKp5CCkqVO6ekctDFiNJqU1wOU7XTDxDozbh7i8VK', 'customer', '2026-07-01 14:52:12'),
(19, 'UAS Tester', 'tester_1782917554142@example.com', '$2b$10$m0KByQwXlUTqqP2Zg5ZgnOLjZlcAT81IZ2uaPGbNoT1dWVgMExYHa', 'customer', '2026-07-01 14:52:37'),
(20, 'UAS Tester', 'tester_1782917616338@example.com', '$2b$10$klouKCGA3jblGIJrKUODsu9S1JKDCIC7G7Vn43M98oWjcPCkoRAIC', 'customer', '2026-07-01 14:53:40'),
(21, 'UAS Tester', 'tester_1782917634411@example.com', '$2b$10$7bkfH9HhfQ0e.JyQdMhE8Oc.RlgX0OF6AMrYHDwX6Gtj41VXIeA06', 'customer', '2026-07-01 14:53:57');

-- --------------------------------------------------------

--
-- Table structure for table `variant_attributes`
--

CREATE TABLE `variant_attributes` (
  `id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `attribute_value` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `variant_attributes`
--

INSERT INTO `variant_attributes` (`id`, `variant_id`, `attribute_name`, `attribute_value`) VALUES
(3, 3, 'Ukuran', 'XXL'),
(15, 15, 'Ukuran', 'M'),
(16, 16, 'Ukuran', 'L'),
(17, 17, 'Kapasitas', '8GB / 256GB'),
(18, 18, 'Kapasitas', '16GB / 512GB'),
(19, 19, 'RAM / Internal', '8GB / 128GB'),
(20, 20, 'RAM / Internal', '8GB / 256GB'),
(21, 21, 'Warna', 'Hitam'),
(22, 22, 'Warna', 'Putih / Silver'),
(23, 23, 'Warna', 'Hitam'),
(24, 24, 'Warna', 'Putih / Silver'),
(25, 25, 'Warna', 'Hitam'),
(26, 26, 'Warna', 'Putih / Silver'),
(27, 27, 'Kapasitas', '8GB / 256GB'),
(28, 28, 'Kapasitas', '16GB / 512GB'),
(29, 29, 'Kapasitas', '8GB / 256GB'),
(30, 30, 'Kapasitas', '16GB / 512GB'),
(31, 31, 'Ukuran', 'M'),
(32, 32, 'Ukuran', 'L'),
(33, 33, 'Ukuran', 'XL'),
(34, 34, 'Ukuran', 'M'),
(35, 35, 'Ukuran', 'L'),
(36, 36, 'Ukuran', 'XL'),
(37, 37, 'Ukuran', 'M'),
(38, 38, 'Ukuran', 'L'),
(39, 39, 'Ukuran', 'XL'),
(40, 40, 'Ukuran', 'M'),
(41, 41, 'Ukuran', 'L'),
(42, 42, 'Ukuran', 'XL'),
(43, 43, 'Ukuran', 'M'),
(44, 44, 'Ukuran', 'L'),
(45, 45, 'Ukuran', 'XL'),
(46, 46, 'Ukuran', 'M'),
(47, 47, 'Ukuran', 'L'),
(48, 48, 'Ukuran', 'XL'),
(49, 49, 'Ukuran', 'M'),
(50, 50, 'Ukuran', 'L'),
(51, 51, 'Ukuran', 'XL'),
(52, 52, 'Ukuran', 'M'),
(53, 53, 'Ukuran', 'L'),
(54, 54, 'Ukuran', 'XL'),
(55, 55, 'Ukuran', 'M'),
(56, 56, 'Ukuran', 'L'),
(57, 57, 'Ukuran', 'XL'),
(58, 58, 'Ukuran', 'M'),
(59, 59, 'Ukuran', 'L'),
(60, 60, 'Ukuran', 'XL'),
(61, 61, 'Ukuran', 'M'),
(62, 62, 'Ukuran', 'L'),
(63, 63, 'Ukuran', 'XL'),
(64, 64, 'Ukuran', 'M'),
(65, 65, 'Ukuran', 'L'),
(66, 66, 'Ukuran', 'XL'),
(67, 67, 'Kemasan', '250 gr'),
(68, 68, 'Kemasan', '500 gr'),
(69, 69, 'Kemasan', '250 gr'),
(70, 70, 'Kemasan', '500 gr'),
(71, 71, 'Kemasan', '250 gr'),
(72, 72, 'Kemasan', '500 gr'),
(73, 73, 'Kemasan', '250 gr'),
(74, 74, 'Kemasan', '500 gr'),
(75, 75, 'Kemasan', '250 gr'),
(76, 76, 'Kemasan', '500 gr'),
(77, 77, 'Warna', 'Hitam Classic'),
(78, 78, 'Warna', 'Cokelat Leather'),
(79, 79, 'Warna', 'Hitam Classic'),
(80, 80, 'Warna', 'Cokelat Leather'),
(81, 81, 'Warna', 'Hitam Classic'),
(82, 82, 'Warna', 'Cokelat Leather'),
(83, 83, 'Warna', 'Hitam Classic'),
(84, 84, 'Warna', 'Cokelat Leather'),
(85, 85, 'Warna', 'Hitam Classic'),
(86, 86, 'Warna', 'Cokelat Leather'),
(87, 87, 'Nomor', '40'),
(88, 88, 'Nomor', '41'),
(89, 89, 'Nomor', '42'),
(90, 90, 'Nomor', '43'),
(91, 91, 'Nomor', '40'),
(92, 92, 'Nomor', '41'),
(93, 93, 'Nomor', '42'),
(94, 94, 'Nomor', '43'),
(95, 95, 'Nomor', '40'),
(96, 96, 'Nomor', '41'),
(97, 97, 'Nomor', '42'),
(98, 98, 'Nomor', '43'),
(99, 99, 'Nomor', '40'),
(100, 100, 'Nomor', '41'),
(101, 101, 'Nomor', '42'),
(102, 102, 'Nomor', '43'),
(103, 103, 'Nomor', '40'),
(104, 104, 'Nomor', '41'),
(105, 105, 'Nomor', '42'),
(106, 106, 'Nomor', '43'),
(107, 107, 'Kemasan', '30 ml'),
(108, 108, 'Kemasan', '50 ml'),
(109, 109, 'Kemasan', '30 ml'),
(110, 110, 'Kemasan', '50 ml'),
(111, 111, 'Kemasan', '30 ml'),
(112, 112, 'Kemasan', '50 ml'),
(113, 113, 'Kemasan', '30 ml'),
(114, 114, 'Kemasan', '50 ml'),
(115, 115, 'Kemasan', '30 ml'),
(116, 116, 'Kemasan', '50 ml'),
(117, 117, 'Spesifikasi', 'Standard / Hitam'),
(118, 118, 'Spesifikasi', 'Pro / Biru'),
(119, 119, 'Spesifikasi', 'Standard / Hitam'),
(120, 120, 'Spesifikasi', 'Pro / Biru'),
(121, 121, 'Spesifikasi', 'Standard / Hitam'),
(122, 122, 'Spesifikasi', 'Pro / Biru'),
(123, 123, 'Spesifikasi', 'Standard / Hitam'),
(124, 124, 'Spesifikasi', 'Pro / Biru'),
(125, 125, 'Spesifikasi', 'Standard / Hitam'),
(126, 126, 'Spesifikasi', 'Pro / Biru'),
(127, 127, 'Spesifikasi', 'Standard / Hitam'),
(128, 128, 'Spesifikasi', 'Pro / Biru'),
(129, 129, 'Warna', 'Hitam'),
(130, 130, 'Warna', 'Putih / Silver'),
(131, 131, 'Warna', 'Hitam Classic'),
(132, 132, 'Warna', 'Cokelat Leather'),
(133, 133, 'Ukuran', 'M'),
(134, 134, 'Ukuran', 'L'),
(135, 135, 'Ukuran', 'XL');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `createdAt`, `updatedAt`) VALUES
(1, 10, 1, '2026-06-23 11:21:09', '2026-06-23 11:21:09'),
(2, 14, 49, '2026-06-30 09:05:52', '2026-06-30 09:05:52'),
(3, 14, 8, '2026-06-30 09:24:45', '2026-06-30 09:24:45');

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
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `fk_cart_variant` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `code_2` (`code`);

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
  ADD KEY `product_id` (`product_id`),
  ADD KEY `fk_order_items_variant` (`variant_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

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
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- Indexes for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cart_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_6` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD CONSTRAINT `variant_attributes_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
