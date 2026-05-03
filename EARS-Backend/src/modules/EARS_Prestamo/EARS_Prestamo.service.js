import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";

export const EARS_CreatePrestamo = async (data) => {
    const coneccion = await EARS_ConexionDb.getConnection();
    await coneccion.beginTransaction();
    const { persona, filador, valor_prestado, interes, tiempo, fecha_prestamo} = data;
    const interes_total = valor_prestado * (interes / 100);
    const valor_futuro = valor_prestado + interes_total;
    const valor_cuota = valor_futuro / tiempo;

    const [movi] = await coneccion.query(`insert into movimientos (fecha, valor, tipo, estado) values (?,?, 'egreso', 'activo')`, [fecha_prestamo, valor_prestado]);
    const [prestamo] = await coneccion.query(
        `insert into prestamos (fecha_prestamo, interes, tiempo, valor_prestado, valor_futuro, persona, fiador, movimiento, estado) values (?,?,?,?,?,?,?,?,)`, [fecha_prestamo, interes, tiempo, valor_prestado, valor_futuro, persona, fiador, id_movimiento]);
        const id_prestamo = prestamo.insertId;

        for (let i = 1; i <= tiempo; i++) {
            const fecha = new Date(fecha_prestamo);
            fecha.setMonth(fecha.getMonth() + i);
            await coneccion.query(`insert into cuotas (nro_cuota, valor, fecha_pago, prestamo, eatado) values (?,?,?,?, 'pendiente')`,  [i, valor_cuota, fecha, id_prestamo]);
        }
        await coneccion.commit();
        return {
            message: 'Préstamo creado correctamente',
            id_prestamo
        }
        coneccion.release();
}