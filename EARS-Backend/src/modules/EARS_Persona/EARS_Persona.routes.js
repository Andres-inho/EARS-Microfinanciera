import { Router } from "express";
import * as controller from './EARS_Persona.controller';

export const EARS_RutaPersona = Router();

EARS_RutaPersona.get('/get', controller.EARS_GetAll);
EARS_RutaPersona.post('/create', controller.EARS_Create);