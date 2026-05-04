import express from 'express'
import cors from 'cors'

export const EARS_App = express();

EARS_App.use(cors());
EARS_App.use(express.json())

import { EARS_RutaAuth } from './modules/EARS_Auth/EARS_Auth.routes.js';
EARS_App.use('/api/auth', EARS_RutaAuth);

import { EARS_VerificarToken } from './config/EARS_VerificarToken.js';
EARS_App.use('/api', EARS_VerificarToken);

import { EARS_RutaPersona } from './modules/EARS_Persona/EARS_Persona.routes.js';
EARS_App.use('/api/persona', EARS_RutaPersona)

import { EARS_RutaPrestamo } from './modules/EARS_Prestamo/EARS_Prestamo.routes.js';
EARS_App.use('/api/prestamo', EARS_RutaPrestamo)

import { EARS_RutaCuota } from './modules/EARS_Cuota/EARS_Cuota.routes.js';
EARS_App.use('/api/cuota', EARS_RutaCuota);

import { EARS_RutaCartera } from './modules/EARS_Cartera/EARS_Cartera.routes.js';
EARS_App.use('/api/cartera', EARS_RutaCartera)

import { EARS_RutaGasto } from './modules/EARS_Gasto/EARS_Gasto.routes.js';
EARS_App.use('/api/gasto', EARS_RutaGasto);

import { EARS_RutaMovimiento } from './modules/EARS_Movimiento/EARS_Movimiento.routes.js';
EARS_App.use('/api/movimiento', EARS_RutaMovimiento);

import { EARS_RutaReporte } from './modules/EARS_Reporte/EARS_Reporte.routes.js';
EARS_App.use('/api/reporte', EARS_RutaReporte);

EARS_App.listen(process.env.PORT, () => {
    console.log('Server corriendo en puerto:', process.env.PORT)
});