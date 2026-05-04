import { Router } from "express";
import * as controller from './EARS_Cartera.controller.js';

export const EARS_RutaCartera = Router();

EARS_RutaCartera.get('/deuda/:id_persona', controller.EARS_ObtenerDeudaCliente);