import * as service from './EARS_Cuota.service.js';

export const EARS_Pagar = async (req, res) => {
    const resultado = await service.EARS_PagarCuota(req.body);
    res.json(resultado);
}

export const EARS_Historial = async (req, res) => {
    const {id_prestamo} = req.params;
    const resultado = await service.EARS_obtenerHistorialPagos(id_prestamo);
    res.json(resultado);
}

export const EARS_ObtenerCuotasPorPrestamo = async (req,res)=>{
const {id_prestamo}=req.params;
const data=await service.EARS_ObtenerCuotasPorPrestamo(id_prestamo);
res.json(data);
};