import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";
import bcrypt from 'bcrypt';

export const EARS_GetPersona = async () => {
    const [row] = await EARS_ConexionDb.query('select * from personas');
    return row;
}

export const EARS_CreatePersona = async (data) => {
    const {identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, token, password, estado} = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [resultado] = await EARS_ConexionDb.query('insert into personas (identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, token, password, estado) values (?,?,?,?,?,?,?,?,?,?)', [identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, token, hashedPassword, estado]);
    return resultado;
};

export const EARS_GetPersonaById = async (id) => {
    const [row] = await EARS_ConexionDb.query('select * from personas where id_persona = ?', [id]);
    return row;
}

export const EARS_UpdatePersona = async (id, data) => {
    const {identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, token, password, estado} = data;
    let query = 'update personas set identificacion = ?, nombres = ?, direccion = ?, telefono = ?, calificacion = ?, rol = ?, observaciones = ?, estado = ?';
    let params = [identificacion, nombres, direccion, telefono, calificacion, rol, observaciones, estado];
    
    if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = ?';
        params.push(hashedPassword);
    }
    
    if (token !== undefined) {
        query += ', token = ?';
        params.push(token);
    }

    query += ' where id_persona = ?';
    params.push(id);

    const [resultado] = await EARS_ConexionDb.query(query, params);
    return resultado;
}

export const EARS_DeletePersona = async (id) => {
    const [row] = await EARS_ConexionDb.query("update personas set estado = 'inactivo' where id_persona = ?", [id]);
    return row;
}