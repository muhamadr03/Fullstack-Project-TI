-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2026 at 05:42 AM
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
(3, 9, 'Jl. Kemenangan No. 99', 'Depok', '16424', 1);

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

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Elektronik', 'elektronik'),
(2, 'Pakaian Pria', 'pakaian-pria'),
(3, 'Pakaian Wanita', 'pakaian-wanita'),
(4, 'Makanan & Minuman', 'makanan-minuman'),
(5, 'Kategori Uji Coba', 'kategori-uji-coba');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `snap_token`, `midtrans_transaction_id`, `shipping_address`, `tracking_number`, `created_at`) VALUES
(3, 9, 17000000.00, 'pending', NULL, NULL, 'Jl. Kemenangan No. 99, Depok 16424', NULL, '2026-04-15 01:25:28'),
(4, 9, 17000000.00, 'pending', NULL, NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:02:37'),
(5, 9, 17000000.00, 'pending', NULL, NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:03:44'),
(6, 9, 17000000.00, 'pending', NULL, NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:06:34'),
(7, 9, 17000000.00, 'pending', NULL, NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:08:19'),
(8, 9, 34000000.00, 'pending', NULL, NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:13:27'),
(9, 9, 17000000.00, 'pending', NULL, NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:17:12'),
(10, 9, 17000000.00, 'pending', 'adc25a7a-9160-4631-83e6-8aba61e907c8', NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:22:42'),
(11, 9, 17000000.00, 'pending', '5ec70cd9-da75-4b08-b2ea-a4eebf2c15f6', NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:37:25'),
(12, 9, 17000000.00, 'pending', '012fd838-3cc2-4160-8a53-9b986e2eb538', NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:42:51'),
(13, 9, 17000000.00, 'cancelled', 'eef49dcb-564f-4b96-962e-1d5c9472dc38', NULL, 'Jl. Kemenangan', NULL, '2026-04-21 02:51:59'),
(14, 9, 17000000.00, 'paid', '33ebcfec-f9d8-4ab5-902a-e3b6fcd0403e', NULL, 'Jl. Kemenangan', NULL, '2026-04-21 03:00:29');

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
(4, 3, 1, 2, 8500000.00),
(5, 4, 1, 2, 8500000.00),
(6, 5, 1, 2, 8500000.00),
(7, 6, 1, 2, 8500000.00),
(8, 7, 1, 2, 8500000.00),
(9, 8, 1, 4, 8500000.00),
(10, 9, 1, 2, 8500000.00),
(11, 10, 1, 2, 8500000.00),
(12, 11, 1, 2, 8500000.00),
(13, 12, 1, 2, 8500000.00),
(14, 13, 1, 2, 8500000.00),
(15, 14, 1, 2, 8500000.00);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock`, `image_url`, `average_rating`, `total_reviews`, `created_at`) VALUES
(1, 1, 'Laptop ThinkPad T480s', 'Laptop tangguh yang sangat cocok untuk backend development dan tugas kampus.', 8500000.00, 84, 'https://dummyimage.com/400x400/000/fff&text=ThinkPad', 5.00, 1, '2026-04-04 06:17:20'),
(2, 1, 'Mouse Wireless', 'Mouse nyaman untuk produktivitas sehari-hari.', 250000.00, 50, 'https://dummyimage.com/400x400/000/fff&text=Mouse', 0.00, 0, '2026-04-04 06:17:20'),
(3, 2, 'Kemeja Flannel Hitam', 'Kemeja kasual yang nyaman dipakai saat hangout.', 150000.00, 100, 'https://dummyimage.com/400x400/000/fff&text=Kemeja', 0.00, 0, '2026-04-04 06:17:20'),
(4, 4, 'Kopi Susu Literan', 'Kopi kekinian untuk menemani waktu ngoding.', 85000.00, 25, 'https://dummyimage.com/400x400/000/fff&text=Kopi', 0.00, 0, '2026-04-04 06:17:20'),
(5, 1, 'Sepatu Nike', 'Laptop Kencang', 500000.00, 10, '/uploads/1776326347487-789825929.jpeg', 0.00, 0, '2026-04-16 07:59:07'),
(6, 3, 'Tas Ransel Cokelat V1', 'Ini adalah deskripsi panjang untuk produk Tas Ransel berwarna Cokelat edisi ke-1. Sangat cocok untuk dipakai sehari-hari.', 330000.00, 37, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(7, 1, 'Jam Tangan Maroon V2', 'Ini adalah deskripsi panjang untuk produk Jam Tangan berwarna Maroon edisi ke-2. Sangat cocok untuk dipakai sehari-hari.', 350000.00, 78, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(8, 3, 'Kemeja Navy V3', 'Ini adalah deskripsi panjang untuk produk Kemeja berwarna Navy edisi ke-3. Sangat cocok untuk dipakai sehari-hari.', 200000.00, 80, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(9, 3, 'Kemeja Navy V4', 'Ini adalah deskripsi panjang untuk produk Kemeja berwarna Navy edisi ke-4. Sangat cocok untuk dipakai sehari-hari.', 480000.00, 46, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(10, 3, 'Sepatu Putih V5', 'Ini adalah deskripsi panjang untuk produk Sepatu berwarna Putih edisi ke-5. Sangat cocok untuk dipakai sehari-hari.', 230000.00, 63, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(11, 3, 'Jam Tangan Cokelat V6', 'Ini adalah deskripsi panjang untuk produk Jam Tangan berwarna Cokelat edisi ke-6. Sangat cocok untuk dipakai sehari-hari.', 430000.00, 85, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(12, 3, 'Kemeja Cokelat V7', 'Ini adalah deskripsi panjang untuk produk Kemeja berwarna Cokelat edisi ke-7. Sangat cocok untuk dipakai sehari-hari.', 150000.00, 20, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(13, 2, 'Jam Tangan Hitam V8', 'Ini adalah deskripsi panjang untuk produk Jam Tangan berwarna Hitam edisi ke-8. Sangat cocok untuk dipakai sehari-hari.', 420000.00, 28, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(14, 1, 'Sepatu Putih V9', 'Ini adalah deskripsi panjang untuk produk Sepatu berwarna Putih edisi ke-9. Sangat cocok untuk dipakai sehari-hari.', 370000.00, 26, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(15, 2, 'Tas Ransel Putih V10', 'Ini adalah deskripsi panjang untuk produk Tas Ransel berwarna Putih edisi ke-10. Sangat cocok untuk dipakai sehari-hari.', 390000.00, 54, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(16, 2, 'Jam Tangan Putih V11', 'Ini adalah deskripsi panjang untuk produk Jam Tangan berwarna Putih edisi ke-11. Sangat cocok untuk dipakai sehari-hari.', 290000.00, 50, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(17, 2, 'Jam Tangan Navy V12', 'Ini adalah deskripsi panjang untuk produk Jam Tangan berwarna Navy edisi ke-12. Sangat cocok untuk dipakai sehari-hari.', 140000.00, 52, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(18, 2, 'Topi Putih V13', 'Ini adalah deskripsi panjang untuk produk Topi berwarna Putih edisi ke-13. Sangat cocok untuk dipakai sehari-hari.', 240000.00, 85, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(19, 1, 'Jaket Pria Hitam V14', 'Ini adalah deskripsi panjang untuk produk Jaket Pria berwarna Hitam edisi ke-14. Sangat cocok untuk dipakai sehari-hari.', 90000.00, 48, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(20, 2, 'Jam Tangan Navy V15', 'Ini adalah deskripsi panjang untuk produk Jam Tangan berwarna Navy edisi ke-15. Sangat cocok untuk dipakai sehari-hari.', 390000.00, 64, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(21, 3, 'Tas Ransel Hitam V16', 'Ini adalah deskripsi panjang untuk produk Tas Ransel berwarna Hitam edisi ke-16. Sangat cocok untuk dipakai sehari-hari.', 480000.00, 32, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(22, 3, 'Tas Ransel Navy V17', 'Ini adalah deskripsi panjang untuk produk Tas Ransel berwarna Navy edisi ke-17. Sangat cocok untuk dipakai sehari-hari.', 410000.00, 48, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(23, 1, 'Jaket Pria Putih V18', 'Ini adalah deskripsi panjang untuk produk Jaket Pria berwarna Putih edisi ke-18. Sangat cocok untuk dipakai sehari-hari.', 360000.00, 33, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(24, 1, 'Jaket Pria Navy V19', 'Ini adalah deskripsi panjang untuk produk Jaket Pria berwarna Navy edisi ke-19. Sangat cocok untuk dipakai sehari-hari.', 350000.00, 30, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(25, 1, 'Jaket Pria Putih V20', 'Ini adalah deskripsi panjang untuk produk Jaket Pria berwarna Putih edisi ke-20. Sangat cocok untuk dipakai sehari-hari.', 270000.00, 28, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(26, 1, 'Jaket Pria Navy V21', 'Ini adalah deskripsi panjang untuk produk Jaket Pria berwarna Navy edisi ke-21. Sangat cocok untuk dipakai sehari-hari.', 240000.00, 89, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(27, 2, 'Kemeja Maroon V22', 'Ini adalah deskripsi panjang untuk produk Kemeja berwarna Maroon edisi ke-22. Sangat cocok untuk dipakai sehari-hari.', 410000.00, 71, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(28, 3, 'Celana Jeans Maroon V23', 'Ini adalah deskripsi panjang untuk produk Celana Jeans berwarna Maroon edisi ke-23. Sangat cocok untuk dipakai sehari-hari.', 140000.00, 62, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(29, 2, 'Topi Maroon V24', 'Ini adalah deskripsi panjang untuk produk Topi berwarna Maroon edisi ke-24. Sangat cocok untuk dipakai sehari-hari.', 140000.00, 11, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(30, 3, 'Celana Jeans Maroon V25', 'Ini adalah deskripsi panjang untuk produk Celana Jeans berwarna Maroon edisi ke-25. Sangat cocok untuk dipakai sehari-hari.', 170000.00, 65, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(31, 2, 'Sepatu Cokelat V26', 'Ini adalah deskripsi panjang untuk produk Sepatu berwarna Cokelat edisi ke-26. Sangat cocok untuk dipakai sehari-hari.', 160000.00, 68, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(32, 2, 'Celana Jeans Navy V27', 'Ini adalah deskripsi panjang untuk produk Celana Jeans berwarna Navy edisi ke-27. Sangat cocok untuk dipakai sehari-hari.', 310000.00, 35, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(33, 3, 'Jaket Pria Navy V28', 'Ini adalah deskripsi panjang untuk produk Jaket Pria berwarna Navy edisi ke-28. Sangat cocok untuk dipakai sehari-hari.', 480000.00, 31, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(34, 3, 'Jaket Pria Putih V29', 'Ini adalah deskripsi panjang untuk produk Jaket Pria berwarna Putih edisi ke-29. Sangat cocok untuk dipakai sehari-hari.', 190000.00, 56, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(35, 3, 'Tas Ransel Cokelat V30', 'Ini adalah deskripsi panjang untuk produk Tas Ransel berwarna Cokelat edisi ke-30. Sangat cocok untuk dipakai sehari-hari.', 320000.00, 61, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(36, 1, 'Celana Jeans Navy V31', 'Ini adalah deskripsi panjang untuk produk Celana Jeans berwarna Navy edisi ke-31. Sangat cocok untuk dipakai sehari-hari.', 130000.00, 21, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(37, 3, 'Sepatu Hitam V32', 'Ini adalah deskripsi panjang untuk produk Sepatu berwarna Hitam edisi ke-32. Sangat cocok untuk dipakai sehari-hari.', 420000.00, 42, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(38, 1, 'Topi Navy V33', 'Ini adalah deskripsi panjang untuk produk Topi berwarna Navy edisi ke-33. Sangat cocok untuk dipakai sehari-hari.', 190000.00, 51, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(39, 2, 'Topi Cokelat V34', 'Ini adalah deskripsi panjang untuk produk Topi berwarna Cokelat edisi ke-34. Sangat cocok untuk dipakai sehari-hari.', 260000.00, 18, NULL, 0.00, 0, '2026-04-21 03:26:03'),
(40, 1, 'Celana Jeans Cokelat V35', 'Ini adalah deskripsi panjang untuk produk Celana Jeans berwarna Cokelat edisi ke-35. Sangat cocok untuk dipakai sehari-hari.', 250000.00, 59, NULL, 0.00, 0, '2026-04-21 03:26:03');

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
(9, 'Salsa Tester', 'salsa.test@example.com', '$2b$10$QtdR7UPcp/qyWV9fyvZNT.0DsKEVjZ8DUaVtlzl8b3xTW.rk6NZqW', 'customer', '2026-04-15 01:19:58'),
(10, 'admin', 'admin@gmail.com', '$2b$10$ybVPHEOi8.NvC2Km7WwsQuxlbtEEV4g3LNIhEXrX.DbLg9kjFPF.W', 'admin', '2026-04-18 02:14:26');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
