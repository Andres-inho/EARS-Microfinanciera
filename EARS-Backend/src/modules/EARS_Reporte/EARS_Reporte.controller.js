import * as service from './EARS_Reporte.service.js';

export const EARS_ObtenerResumen = async (req, res) => {
    const resultado = await service.EARS_GenerarReportes();
    res.json(resultado);
}

export const EARS_ObtenerTotalPrestado = async (req, res) => {
    const resultado = await service.EARS_TotalPrestado();
    res.json(resultado);
}

export const EARS_ObtenerTotalRecaudado = async (req, res) => {
    const resultado = await service.EARS_TotalRecaudado();
    res.json(resultado);
}

export const EARS_ObtenerCarteraPendiente = async (req, res) => {
    const resultado = await service.EARS_CarteraPendiente();
    res.json(resultado);
}

export const EARS_ObtenerCreditosEnMora = async (req, res) => {
    const resultado = await service.EARS_CreditosEnMora();
    res.json(resultado);
}

export const EARS_ObtenerFlujoDeCaja = async (req, res) => {
    const resultado = await service.EARS_FlujoDeCaja();
    res.json(resultado);
}
