import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";

export const EARS_CrearGasto = async (data) => {
    const { fecha, detalle, valor } = data;
    const coneccion = await EARS_ConexionDb.getConnection();
    await coneccion.beginTransaction();
    const [movi] = await coneccion.query(`insert into movimientos (fecha, valor, tipo, estado) values (?, ?, 'egreso', 'activo')`, [fecha, valor]);
    const id_movimiento = movi.insertId;
    const [resultado] = await coneccion.query('insert into gastos (fecha, detalle, valor, movimiento, estado) values (?,?,?,?,?)', [fecha, detalle, valor, id_movimiento, 'activo']);
    await coneccion.commit();
    coneccion.release();
    return {
        message: 'Gasto registrado correctamente',
        id_gasto: resultado.insertId
    };
}

export const EARS_ConsultarGastos = async (fecha_inicio, fecha_fin) => {
    let query = 'select * from gastos';
    let params = [];
    if (fecha_inicio && fecha_fin) {
        query += ' where fecha between ? and ?';
        params = [fecha_inicio, fecha_fin];
    }
    query += ' order by id_gasto asc';
    const [rows] = await EARS_ConexionDb.query(query, params);
    return rows;
}
