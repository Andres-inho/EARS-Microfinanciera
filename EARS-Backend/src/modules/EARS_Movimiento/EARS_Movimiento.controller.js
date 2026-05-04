import * as service from './EARS_Movimiento.service.js';

export const EARS_Consultar = async (req, res) => {
    const resultado = await service.EARS_ObtenerHistorialMovimientos();
    res.json(resultado);
}
