import { Router } from "express";
import * as controller from './EARS_Reporte.controller.js';

export const EARS_RutaReporte = Router();

EARS_RutaReporte.get('/resumen', controller.EARS_ObtenerResumen);
EARS_RutaReporte.get('/total-prestado', controller.EARS_ObtenerTotalPrestado);
EARS_RutaReporte.get('/total-recaudado', controller.EARS_ObtenerTotalRecaudado);
EARS_RutaReporte.get('/cartera-pendiente', controller.EARS_ObtenerCarteraPendiente);
EARS_RutaReporte.get('/creditos-mora', controller.EARS_ObtenerCreditosEnMora);
EARS_RutaReporte.get('/flujo-caja', controller.EARS_ObtenerFlujoDeCaja);
