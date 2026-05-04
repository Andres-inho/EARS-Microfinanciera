import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";

export const EARS_CreatePrestamo = async (data) => {
    const coneccion = await EARS_ConexionDb.getConnection();
    await coneccion.beginTransaction();
    try {
        const { persona, fiador, valor_prestado, interes, tiempo, fecha_prestamo, estado = 'activo'} = data;
        const valor_futuro = valor_prestado * Math.pow(1 + (interes / 100), tiempo);
        const valor_cuota = Math.round(valor_futuro / tiempo);
        
        if (estado === 'activo') {
            await coneccion.query(`insert into movimientos (fecha, valor, tipo, estado) values (?,?, 'egreso', 'activo')`, [fecha_prestamo, valor_prestado]);
        }
        
        const [prestamo] = await coneccion.query(
            `insert into prestamos (fecha_prestamo, interes, tiempo, valor_prestado, persona, fiador, estado) values (?,?,?,?,?,?,?)`, [fecha_prestamo, interes, tiempo, valor_prestado, persona, fiador, estado]);
        const id_prestamo = prestamo.insertId;
        const [personaExiste] = await coneccion.query('select id_persona from personas where id_persona = ?', [persona]);
        if (personaExiste.length === 0) {
            throw new Error('La persona no existe')
        }
        if (fiador) {
            const [fiadorExiste] = await coneccion.query('select id_persona from personas where id_persona = ?', [fiador]);
            if (fiadorExiste.length === 0) {
                throw new Error('El fiador no existe');
            }
        }

        for (let i = 1; i <= tiempo; i++) {
            const fecha = new Date(fecha_prestamo);
            fecha.setMonth(fecha.getMonth() + i);
            const estado_cuota = estado === 'activo' ? 'pendiente' : 'inactivo';
            await coneccion.query(`insert into cuotas (nro_cuota, valor, fecha_pago, prestamo, estado) values (?,?,?,?, ?)`,  [i, valor_cuota, fecha, id_prestamo, estado_cuota]);
        }
        await coneccion.commit();
        return {
            message: 'Préstamo creado correctamente',
            id_prestamo
        }
    } catch (error) {
        await coneccion.rollback();
        throw error;
    } finally {
        coneccion.release();
    }
}

export const EARS_ObtenerPrestamos = async () => {
    const [resultado] = await EARS_ConexionDb.query(`SELECT pr.id_prestamo,pr.valor_prestado,pr.interes,pr.tiempo,pr.estado,pr.fecha_prestamo, p.nombres as persona FROM prestamos pr INNER JOIN personas p ON pr.persona = p.id_persona ORDER BY pr.fecha_prestamo DESC`);
    return resultado;
};

export const EARS_ObtenerPrestamosPorCliente = async (id_persona)=>{
const [resultado]=await EARS_ConexionDb.query(`SELECT pr.id_prestamo,pr.valor_prestado,pr.interes,pr.tiempo,pr.estado,pr.fecha_prestamo FROM prestamos pr WHERE pr.persona=? ORDER BY pr.fecha_prestamo DESC`,[id_persona]);
return resultado;
};

export const EARS_ObtenerDetallePrestamo = async (id_prestamo)=>{
const [resultado]=await EARS_ConexionDb.query(`SELECT pr.id_prestamo,pr.valor_prestado,pr.interes,pr.tiempo,pr.estado,pr.fecha_prestamo,p.id_persona,p.nombres FROM prestamos pr INNER JOIN personas p ON pr.persona=p.id_persona WHERE pr.id_prestamo=?`,[id_prestamo]);
if (resultado.length===0) {
    throw new Error('Prestamo no existe');
    }
const prestamo=resultado[0];
const [cuotas]=await EARS_ConexionDb.query(`SELECT c.id_cuota,c.nro_cuota,c.valor,c.fecha_pago,c.estado,IFNULL((SELECT SUM(p.valor) FROM pagos p WHERE p.cuota=c.id_cuota),0) AS total_pagado,(c.valor-IFNULL((SELECT SUM(p2.valor) FROM pagos p2 WHERE p2.cuota=c.id_cuota),0)) AS restante,CASE WHEN c.fecha_pago<CURDATE() AND c.estado!='pagado' THEN DATEDIFF(CURDATE(),c.fecha_pago)*(c.valor*0.01) ELSE 0 END AS mora FROM cuotas c WHERE c.prestamo=? ORDER BY c.nro_cuota ASC`,[id_prestamo]);
return {...prestamo,cuotas};
};

export const EARS_CambiarEstadoPrestamo = async (id_prestamo, estado) => {
    const coneccion = await EARS_ConexionDb.getConnection();
    await coneccion.beginTransaction();
    try {
        const [resultado] = await coneccion.query('update prestamos set estado = ? where id_prestamo = ?', [estado, id_prestamo]);
        
        if (estado === 'activo') {
            await coneccion.query('update cuotas set estado = "pendiente" where prestamo = ? and estado = "inactivo"', [id_prestamo]);
            const [prestamo] = await coneccion.query('select valor_prestado, fecha_prestamo from prestamos where id_prestamo = ?', [id_prestamo]);
            if (prestamo.length > 0) {
                await coneccion.query(`insert into movimientos (fecha, valor, tipo, estado) values (?,?, 'egreso', 'activo')`, [new Date(), prestamo[0].valor_prestado]);
            }
        }
        await coneccion.commit();
        return resultado;
    } catch (error) {
        await coneccion.rollback();
        throw error;
    } finally {
        coneccion.release();
    }
};