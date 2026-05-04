import { Router } from 'express';
import * as controller from './EARS_Cuota.controller.js';

export const EARS_RutaCuota = Router();

EARS_RutaCuota.post('/pagar', controller.EARS_Pagar);
EARS_RutaCuota.get('/historial/:id_prestamo', controller.EARS_Historial);
EARS_RutaCuota.get('/prestamo/:id_prestamo', controller.EARS_ObtenerCuotasPorPrestamo);