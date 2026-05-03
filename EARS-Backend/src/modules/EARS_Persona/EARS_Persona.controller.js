import * as service from './EARS_Persona.service.js'

export const EARS_GetAll = async (req, res) => {
    const resultado = await service.EARS_GetPersona();
    res.json(resultado);
}

export const EARS_Create = async (req, res) => {
    const resultado = await service.EARS_CreatePersona(req.body);
    res.json(resultado);
}

export const EARS_Update = async (req, res) => {
    const resultado = await service.EARS_UpdatePersona(req.params.id, req.body);
    res.json(resultado);
}

export const EARS_Delete = async (req, res) => {
    const resultado = await service.EARS_DeletePersona(req.params.id);
    res.json(resultado);
}

export const EARS_GetById = async (req, res) => {
    const resultado = await service.EARS_GetPersonaById(req.params.id);
    if (!resultado) {
        return res.status(404).json({message: 'Persona no encontrada'})
    }
    res.json(resultado);
}