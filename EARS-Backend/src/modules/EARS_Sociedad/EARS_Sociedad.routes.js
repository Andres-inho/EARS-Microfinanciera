import { Router } from "express";
import * as controller from './EARS_Sociedad.controller.js';

export const EARS_RutaSociedad = Router();

EARS_RutaSociedad.get('/get', controller.EARS_ObtenerSociedades);
EARS_RutaSociedad.post('/create', controller.EARS_CrearSociedad);
EARS_RutaSociedad.put('/estado/:id_sociedad', controller.EARS_CambiarEstadoSociedad);
