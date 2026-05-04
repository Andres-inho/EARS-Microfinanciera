import { Router } from "express";
import * as controller from './EARS_Movimiento.controller.js';

export const EARS_RutaMovimiento = Router();

EARS_RutaMovimiento.get('/get', controller.EARS_Consultar);
