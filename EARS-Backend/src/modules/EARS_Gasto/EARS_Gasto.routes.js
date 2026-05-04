import { Router } from "express";
import * as controller from './EARS_Gasto.controller.js';

export const EARS_RutaGasto = Router();

EARS_RutaGasto.post('/create', controller.EARS_Crear);
EARS_RutaGasto.get('/get', controller.EARS_Consultar);
