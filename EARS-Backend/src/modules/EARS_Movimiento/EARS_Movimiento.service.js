import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";

export const EARS_ObtenerHistorialMovimientos = async () => {
    const [rows] = await EARS_ConexionDb.query('select * from movimientos order by fecha desc');
    return rows;
}
