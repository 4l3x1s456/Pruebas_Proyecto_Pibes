-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-05-2025 a las 02:33:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ecommerce-shop`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(255) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `subcategoria` varchar(50) NOT NULL,
  `precio` double NOT NULL,
  `stock` int(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `categoria`, `subcategoria`, `precio`, `stock`) VALUES
(1, 'Poco X3 Pro', 'Último modelo con cámara de 48MP y 128GB de almacenamiento', 'Electrónica', 'Smartphones', 599.99, 50),
(2, 'Laptop ASUS Vivobook 16x', '32GB RAM, SSD 1TB, RTX 4050, i9 13900H', 'Computadoras', 'Laptops', 999.99, 30),
(3, 'iPhone 14 Pro', 'Pantalla Super Retina XDR, 256GB, cámara triple', 'Electrónica', 'Smartphones', 1299.99, 40),
(4, 'Samsung Galaxy S23', 'Snapdragon 8 Gen 2, 128GB, cámara de 50MP', 'Electrónica', 'Smartphones', 1199.99, 45),
(5, 'Monitor LG 27\"', 'Resolución 4K UHD, IPS, HDR10', 'Electrónica', 'Monitores', 349.99, 20),
(6, 'Teclado Mecánico Logitech G Pro', 'Interruptores GX Blue, RGB', 'Periféricos', 'Teclados', 129.99, 60),
(7, 'Mouse Logitech MX Master 3S', 'Sensor de alta precisión, Bluetooth', 'Periféricos', 'Ratones', 99.99, 70),
(8, 'Tablet Samsung Galaxy Tab S8', '11\" LCD, 256GB, Snapdragon 8 Gen 1', 'Electrónica', 'Tablets', 799.99, 25),
(9, 'Disco Duro Externo WD 2TB', 'USB 3.0, compatible con Windows y Mac', 'Almacenamiento', 'Discos Duros', 89.99, 80),
(10, 'SSD NVMe Samsung 980 Pro 1TB', 'Lectura hasta 7000MB/s, PCIe Gen4', 'Almacenamiento', 'SSD', 159.99, 50),
(11, 'Procesador AMD Ryzen 7 5800X', '8 núcleos, 16 hilos, AM4', 'Componentes', 'Procesadores', 299.99, 35),
(12, 'Placa Madre ASUS ROG Strix B550-F', 'Soporte Ryzen, WiFi 6, ATX', 'Componentes', 'Placas Madre', 199.99, 40),
(13, 'Memoria RAM Corsair Vengeance 32GB', 'DDR4, 3600MHz, RGB', 'Componentes', 'Memorias RAM', 129.99, 65),
(14, 'Tarjeta Gráfica NVIDIA RTX 4070', '12GB GDDR6X, Ray Tracing', 'Componentes', 'Tarjetas Gráficas', 699.99, 15),
(15, 'Fuente de Poder EVGA 750W Gold', 'Modular, certificación 80+ Gold', 'Componentes', 'Fuentes de Poder', 119.99, 30),
(16, 'Gabinete NZXT H510', 'ATX, con vidrio templado', 'Componentes', 'Gabinetes', 99.99, 25),
(17, 'Laptop Lenovo Legion 5', 'Ryzen 7, RTX 3060, 16GB RAM, SSD 512GB', 'Computadoras', 'Laptops', 1199.99, 20),
(18, 'Smartwatch Amazfit GTR 4', 'GPS, monitoreo de salud, AMOLED', 'Electrónica', 'Relojes Inteligentes', 199.99, 50),
(19, 'Auriculares Sony WH-1000XM5', 'Cancelación de ruido, Bluetooth 5.2', 'Electrónica', 'Auriculares', 349.99, 45),
(20, 'Impresora HP LaserJet Pro M404dn', 'Impresión láser monocromática, Ethernet', 'Periféricos', 'Impresoras', 249.99, 10);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
