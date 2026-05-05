import * as service from './EARS_Sociedad.service.js';

export const EARS_ObtenerSociedades = async (req, res) => {
    try {
        const data = await service.EARS_ObtenerSociedades();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const EARS_CrearSociedad = async (req, res) => {
    try {
        const data = await service.EARS_CrearSociedad(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const EARS_CambiarEstadoSociedad = async (req, res) => {
    try {
        const { id_sociedad } = req.params;
        const { estado } = req.body;
        await service.EARS_CambiarEstadoSociedad(id_sociedad, estado);
        res.json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
