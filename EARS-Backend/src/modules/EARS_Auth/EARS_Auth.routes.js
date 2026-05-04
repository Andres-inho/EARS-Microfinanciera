import { Router } from "express";
import * as controller from './EARS_Auth.controller.js';

export const EARS_RutaAuth = Router();

EARS_RutaAuth.post('/login', controller.EARS_Autenticar);
