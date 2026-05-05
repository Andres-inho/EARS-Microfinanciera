import * as service from './EARS_Prestamo.service.js';

export const EARS_Create = async (req, res) => {
    const resultado = await service.EARS_CreatePrestamo(req.body);
    res.json(resultado);
}

export const EARS_ObtenerTodos = async (req, res) => {
    const data = await service.EARS_ObtenerPrestamos();
    res.json(data);
};

export const EARS_ObtenerPrestamosPorCliente = async (req, res) => {
    const { id_persona } = req.params;
    const data = await service.EARS_ObtenerPrestamosPorCliente(id_persona);
    res.json(data);
};

export const EARS_ObtenerDetallePrestamo = async (req, res) => {
    const { id_prestamo } = req.params;
    const data = await service.EARS_ObtenerDetallePrestamo(id_prestamo);
    res.json(data);
};

export const EARS_CambiarEstado = async (req, res) => {
    const { id_prestamo } = req.params;
    const { estado } = req.body;
    const data = await service.EARS_CambiarEstadoPrestamo(id_prestamo, estado);
    res.json(data);
};