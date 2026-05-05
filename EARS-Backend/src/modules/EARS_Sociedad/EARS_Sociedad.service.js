import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";

export const EARS_ObtenerSociedades = async () => {
    const [rows] = await EARS_ConexionDb.query('select * from sociedades order by id_sociedad asc');
    return rows;
}

export const EARS_CrearSociedad = async (data) => {
    const { sociedad, caja, estado = 'activo' } = data;
    const [resultado] = await EARS_ConexionDb.query('insert into sociedades (sociedad, caja, estado) values (?,?,?)', [sociedad, caja, estado]);
    return { id: resultado.insertId, message: 'Sociedad creada exitosamente' };
}

export const EARS_CambiarEstadoSociedad = async (id, estado) => {
    const [resultado] = await EARS_ConexionDb.query('update sociedades set estado = ? where id_sociedad = ?', [estado, id]);
    return resultado;
}
