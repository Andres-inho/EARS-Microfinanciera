-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 04-05-2026 a las 05:46:01
-- Versión del servidor: 8.4.3
-- Versión de PHP: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `microfinanciera`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuotas`
--

CREATE TABLE `cuotas` (
  `id_cuota` int NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `fecha_recaudo` date DEFAULT NULL,
  `nro_cuota` int DEFAULT NULL,
  `valor` decimal(12,2) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `prestamo` int DEFAULT NULL,
  `estado` enum('pendiente','pagado','vencido') DEFAULT 'pendiente',
  `movimiento` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `cuotas`
--

INSERT INTO `cuotas` (`id_cuota`, `fecha_pago`, `fecha_recaudo`, `nro_cuota`, `valor`, `tipo`, `prestamo`, `estado`, `movimiento`) VALUES
(1, '2026-06-01', '2026-05-03', 1, 240000.00, NULL, 4, 'pagado', 13),
(2, '2026-07-01', NULL, 2, 240000.00, NULL, 4, 'pendiente', NULL),
(3, '2026-08-01', NULL, 3, 240000.00, NULL, 4, 'pendiente', NULL),
(4, '2026-09-01', NULL, 4, 240000.00, NULL, 4, 'pendiente', NULL),
(5, '2026-10-01', NULL, 5, 240000.00, NULL, 4, 'pendiente', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos`
--

CREATE TABLE `gastos` (
  `id_gasto` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `detalle` varchar(300) DEFAULT NULL,
  `valor` decimal(12,2) DEFAULT NULL,
  `movimiento` int DEFAULT NULL,
  `estado` enum('activo','anulado') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id_movimiento` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `sociedad` int DEFAULT NULL,
  `valor` decimal(12,2) DEFAULT NULL,
  `caja` decimal(12,2) DEFAULT NULL,
  `tipo` enum('ingreso','egreso') DEFAULT NULL,
  `estado` enum('activo','anulado') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id_movimiento`, `fecha`, `sociedad`, `valor`, `caja`, `tipo`, `estado`) VALUES
(9, '2026-05-02', NULL, 1000000.00, NULL, 'egreso', 'activo'),
(13, '2026-05-03', NULL, 240000.00, NULL, 'ingreso', 'activo'),
(14, '2026-05-03', NULL, 10000.00, NULL, 'ingreso', 'activo'),
(15, '2026-05-04', NULL, 230000.00, NULL, 'ingreso', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int NOT NULL,
  `cuota` int DEFAULT NULL,
  `valor` decimal(12,2) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `movimiento` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `cuota`, `valor`, `fecha`, `movimiento`) VALUES
(1, 2, 10000.00, '2026-05-03 23:35:44', 14),
(2, 2, 230000.00, '2026-05-04 00:09:31', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `id_persona` int NOT NULL,
  `identificacion` varchar(50) NOT NULL,
  `nombres` varchar(200) DEFAULT NULL,
  `direccion` varchar(70) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `calificacion` int DEFAULT NULL,
  `rol` enum('cliente','admin','cobrador') DEFAULT 'cliente',
  `observaciones` text,
  `token` varchar(250) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id_persona`, `identificacion`, `nombres`, `direccion`, `telefono`, `calificacion`, `rol`, `observaciones`, `token`, `password`, `estado`) VALUES
(1, '987654321', 'María Gómez', 'Calle 10 #20-30', '3019876543', 5, 'cliente', NULL, NULL, '123456', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `id_prestamo` int NOT NULL,
  `ficha` varchar(100) DEFAULT NULL,
  `fecha_prestamo` date DEFAULT NULL,
  `interes` decimal(5,2) DEFAULT NULL,
  `tiempo` int DEFAULT NULL,
  `valor_prestado` decimal(12,2) DEFAULT NULL,
  `valor_futuro` decimal(12,2) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `persona` int DEFAULT NULL,
  `movimiento` int DEFAULT NULL,
  `fiador` int DEFAULT NULL,
  `estado` enum('activo','pagado','mora') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `prestamos`
--

INSERT INTO `prestamos` (`id_prestamo`, `ficha`, `fecha_prestamo`, `interes`, `tiempo`, `valor_prestado`, `valor_futuro`, `tipo`, `persona`, `movimiento`, `fiador`, `estado`) VALUES
(4, NULL, '2026-05-02', 20.00, 5, 1000000.00, NULL, NULL, 1, NULL, 1, 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sociedades`
--

CREATE TABLE `sociedades` (
  `id_sociedad` int NOT NULL,
  `sociedad` varchar(200) DEFAULT NULL,
  `caja` decimal(12,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cuotas`
--
ALTER TABLE `cuotas`
  ADD PRIMARY KEY (`id_cuota`),
  ADD KEY `fk_cuota_prestamo` (`prestamo`),
  ADD KEY `fk_cuota_movimiento` (`movimiento`);

--
-- Indices de la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD PRIMARY KEY (`id_gasto`),
  ADD KEY `fk_gasto_movimiento` (`movimiento`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `fk_mov_sociedad` (`sociedad`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `cuota` (`cuota`),
  ADD KEY `movimiento` (`movimiento`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id_persona`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id_prestamo`),
  ADD KEY `fk_prestamo_persona` (`persona`),
  ADD KEY `fk_prestamo_fiador` (`fiador`),
  ADD KEY `fk_prestamo_movimiento` (`movimiento`);

--
-- Indices de la tabla `sociedades`
--
ALTER TABLE `sociedades`
  ADD PRIMARY KEY (`id_sociedad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cuotas`
--
ALTER TABLE `cuotas`
  MODIFY `id_cuota` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `gastos`
--
ALTER TABLE `gastos`
  MODIFY `id_gasto` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id_movimiento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `personas`
--
ALTER TABLE `personas`
  MODIFY `id_persona` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  MODIFY `id_prestamo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `sociedades`
--
ALTER TABLE `sociedades`
  MODIFY `id_sociedad` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cuotas`
--
ALTER TABLE `cuotas`
  ADD CONSTRAINT `fk_cuota_movimiento` FOREIGN KEY (`movimiento`) REFERENCES `movimientos` (`id_movimiento`),
  ADD CONSTRAINT `fk_cuota_prestamo` FOREIGN KEY (`prestamo`) REFERENCES `prestamos` (`id_prestamo`);

--
-- Filtros para la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD CONSTRAINT `fk_gasto_movimiento` FOREIGN KEY (`movimiento`) REFERENCES `movimientos` (`id_movimiento`);

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `fk_mov_sociedad` FOREIGN KEY (`sociedad`) REFERENCES `sociedades` (`id_sociedad`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`cuota`) REFERENCES `cuotas` (`id_cuota`),
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`movimiento`) REFERENCES `movimientos` (`id_movimiento`);

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `fk_prestamo_fiador` FOREIGN KEY (`fiador`) REFERENCES `personas` (`id_persona`),
  ADD CONSTRAINT `fk_prestamo_movimiento` FOREIGN KEY (`movimiento`) REFERENCES `movimientos` (`id_movimiento`),
  ADD CONSTRAINT `fk_prestamo_persona` FOREIGN KEY (`persona`) REFERENCES `personas` (`id_persona`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
