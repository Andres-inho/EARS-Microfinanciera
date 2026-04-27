import { EARS_ConexionDb } from "../../config/EARS-ConexionDb";

export const EARS_GetPersona = async () => {
    const [row] = await EARS_ConexionDb.query('select * from personas');
    return row;
}

export const EARS_CreatePersona = async (data) => {
    const {identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, token, password, estado} = data;
    const [resultado] = await EARS_ConexionDb.query('insert into personas (identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, token, password, estado) values (?,?,?,?,?,?,?,?,?,?)', [identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, token, password, estado]);
    return resultado;
};

export const EARS_GetPersonaById = async (id) => {
    const [row] = await EARS_ConexionDb.query('select * from personas where id_persona = ?', [id]);
    return row;
}

export const EARS_UpdatePersona = async (data) => {
    const {identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, token, password, estado} = data;
    const [resultado] = await EARS_ConexionDb.query('update personas set identificacion = ?, nombres = ?, direccion = ?, telefono = ?, calificacion = ?, rol = ?, observaciones = ?, token = ?, password = ?, estado = ?', [identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, token, password, estado]);
    return resultado;
}

export const EARS_DeletePersona = async (id) => {
    const [row] = await EARS_ConexionDb.query('delete personas where id_persona', [id]);
    return row;
}