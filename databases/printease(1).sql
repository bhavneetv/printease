-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 03, 2025 at 04:04 PM
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
-- Database: `printease`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_code` varchar(10) NOT NULL,
  `created_by` int(11) NOT NULL,
  `accepted_by` int(11) DEFAULT NULL,
  `original_file_name` varchar(255) NOT NULL,
  `stored_file_name` varchar(500) NOT NULL,
  `file_path` text NOT NULL,
  `copies` int(11) NOT NULL,
  `print_side` int(11) NOT NULL,
  `pages` int(12) NOT NULL,
  `page_type` varchar(225) NOT NULL,
  `payment_amount` decimal(10,2) DEFAULT 0.00,
  `payment_status` enum('pending','paid','failed') DEFAULT 'pending',
  `status` enum('pending','accepted','printing','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `accepted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `created_by`, `accepted_by`, `original_file_name`, `stored_file_name`, `file_path`, `copies`, `print_side`, `pages`, `page_type`, `payment_amount`, `payment_status`, `status`, `created_at`, `accepted_at`) VALUES
(1, 'ORD-33', 1, 1, 'testing.pdf', '', '', 0, 0, 4, '', 342.00, 'pending', 'pending', '2025-11-21 16:54:59', NULL),
(2, 'ORD-34', 1, 1, 'roll.pdf', '', '', 0, 0, 0, '', 40.00, 'pending', 'pending', '2025-11-21 16:54:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `shops`
--

CREATE TABLE `shops` (
  `shop_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `shop_name` varchar(150) NOT NULL,
  `address` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `upi_id` varchar(100) NOT NULL,
  `rate_bw` decimal(5,2) NOT NULL DEFAULT 4.00,
  `rate_color` decimal(5,2) NOT NULL DEFAULT 12.00,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shops`
--

INSERT INTO `shops` (`shop_id`, `user_id`, `shop_name`, `address`, `image_url`, `upi_id`, `rate_bw`, `rate_color`, `latitude`, `longitude`, `is_active`, `created_at`) VALUES
(1, 2, 'A2', 'mmdu', 'https', 'verm@upi', 2.00, 10.00, 30.3485500, 77.0856690, 1, '2025-12-02 14:51:30'),
(2, 2, 'verma shop', 'mmdu', 'https', 'verm@upi', 4.00, 10.00, 30.3488300, 77.0856690, 1, '2025-12-02 14:51:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','shopkeeper','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`) VALUES
(1, 'Testing user', 'test@t', '44', 'test', 'user', '2025-11-21 16:21:27'),
(2, 'shop ', 'test@tt', '44', 'test', 'user', '2025-11-21 16:21:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `accepted_by` (`accepted_by`);

--
-- Indexes for table `shops`
--
ALTER TABLE `shops`
  ADD PRIMARY KEY (`shop_id`),
  ADD KEY `fk_shop_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shops`
--
ALTER TABLE `shops`
  MODIFY `shop_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`accepted_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `shops`
--
ALTER TABLE `shops`
  ADD CONSTRAINT `fk_shop_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
