import * as service from './EARS_Gasto.service.js';

export const EARS_Crear = async (req, res) => {
    const resultado = await service.EARS_CrearGasto(req.body);
    res.json(resultado);
}

export const EARS_Consultar = async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    const resultado = await service.EARS_ConsultarGastos(fecha_inicio, fecha_fin);
    res.json(resultado);
}
