import * as service from './EARS_Persona.service.js'

export const EARS_GetAll = async (req, res) => {
    const data = await service.EARS_GetPersona();
    res.json(data);
}

export const EARS_Create = async (req, res) => {
    const resultado = await service.EARS_CreatePersona(req.body);
    res.json(resultado)
}