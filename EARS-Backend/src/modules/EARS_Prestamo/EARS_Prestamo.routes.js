import { Router } from "express";
import * as controller from './EARS_Prestamo.controller.js';

export const EARS_RutaPrestamo = Router();

EARS_RutaPrestamo.post('/create', controller.EARS_Create);
EARS_RutaPrestamo.get('/get', controller.EARS_ObtenerTodos);
EARS_RutaPrestamo.get('/cliente/:id_persona', controller.EARS_ObtenerPrestamosPorCliente);
EARS_RutaPrestamo.get('/detalle/:id_prestamo', controller.EARS_ObtenerDetallePrestamo);
EARS_RutaPrestamo.put('/estado/:id_prestamo', controller.EARS_CambiarEstado);