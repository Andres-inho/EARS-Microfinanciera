import express from 'express'
import cors from 'cors'

export const EARS_App = express();

EARS_App.use(cors());
EARS_App.use(express.json())

import { EARS_RutaPersona } from './modules/EARS_Persona/EARS_Persona.routes';
EARS_App.use('api/persona', EARS_RutaPersona)