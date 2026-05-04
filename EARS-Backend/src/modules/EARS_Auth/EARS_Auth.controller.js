import * as service from './EARS_Auth.service.js';

export const EARS_Autenticar = async (req, res) => {
    const {identificacion, password} = req.body;
    const resultado = await service.EARS_Login(identificacion, password);
    res.json(resultado);
}
