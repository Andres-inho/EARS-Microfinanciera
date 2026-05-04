import * as service from './EARS_Cartera.service.js';

export const EARS_ObtenerDeudaCliente = async (req,res)=>{
const {id_persona}=req.params;
const resultado = await service.EARS_ObtenerDeudaCliente(id_persona);
res.json(resultado);
};
