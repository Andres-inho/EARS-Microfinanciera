import { Router } from "express";
import * as controller from './EARS_Persona.controller.js';

export const EARS_RutaPersona = Router();

EARS_RutaPersona.get('/get', controller.EARS_GetAll);
EARS_RutaPersona.post('/create', controller.EARS_Create);
EARS_RutaPersona.put('/update/:id', controller.EARS_Update);
EARS_RutaPersona.delete('/delete/:id', controller.EARS_Delete);