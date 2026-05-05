import * as service from './EARS_Cuota.service.js';

export const EARS_Pagar = async (req, res) => {
    try {
        const resultado = await service.EARS_PagarCuota(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
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

export const EARS_ObtenerCuotasPorCliente = async (req, res) => {
    const { id_persona } = req.params;
    const data = await service.EARS_ObtenerCuotasPorCliente(id_persona);
    res.json(data);
};