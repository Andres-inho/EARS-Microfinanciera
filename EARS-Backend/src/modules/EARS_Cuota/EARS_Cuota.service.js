import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";

export const EARS_PagarCuota = async ({ id_cuota, valor }) => {
    if (!id_cuota || !valor) {
        throw new Error('ID de cuota y valor son obligatorios');
    }

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
        throw new Error('El valor a pagar debe ser un número positivo');
    }

    const coneccion = await EARS_ConexionDb.getConnection();
    try {
        await coneccion.beginTransaction();
        
        console.log('Backend Recibiendo Pago:', { id_cuota, valor: valorNum });

        const [cuotaData] = await coneccion.query('select * from cuotas where id_cuota = ?', [id_cuota]);
        if (cuotaData.length === 0) {
            throw new Error('La cuota no existe');
        }
        const cuota = cuotaData[0];
        if (cuota.estado === 'pagado') {
            throw new Error('La cuota ya fue pagada');
        }
        const [pagos] = await coneccion.query('select sum(valor) as total_pagado from pagos where cuota = ?', [id_cuota]);
        const total_pagado = pagos[0].total_pagado || 0;
        const hoy = new Date();
        const fecha_pago = new Date(cuota.fecha_pago);
        let mora = 0;
        if (hoy > fecha_pago) {
            const dias = Math.floor((hoy - fecha_pago) / (1000 * 60 * 60 * 24));
            mora = dias * (cuota.valor * 0.01);
        }
        const total_cuota_mora = cuota.valor + mora;
        const restante = total_cuota_mora - total_pagado;
        
        if (valorNum > restante) {
            throw new Error(`El pago que quieres realizar excede el limite elegido, debe pagar maximo ${restante}`);
        }
        
        const [movi] = await coneccion.query(`insert into movimientos (fecha, valor, tipo, estado) values (now(), ?, 'ingreso', 'activo')`, [valorNum]);
        const id_movimiento = movi.insertId;
        
        await coneccion.query(`insert into pagos(cuota, valor, fecha, movimiento) values (?,?, now(),?)`, [id_cuota, valorNum, id_movimiento])
        
        const nuevo_total = total_pagado + valorNum;
        if (nuevo_total >= cuota.valor) {
            await coneccion.query(`update cuotas set estado = 'pagado', fecha_recaudo = now() where id_cuota = ?`, [id_cuota]);
        }
        
        const [pendientes] = await coneccion.query(`select count(*) as total from cuotas where prestamo = ? and estado != 'pagado'`, [cuota.prestamo]);
        if (pendientes[0].total === 0) {
            await coneccion.query(`update prestamos set estado = 'pagado' where id_prestamo = ?`, [cuota.prestamo]);
        }
        
        await coneccion.commit();
        return { message: 'Pago registrado correctamente' };
    } catch (error) {
        await coneccion.rollback();
        console.error('Error en EARS_PagarCuota:', error);
        throw error;
    } finally {
        coneccion.release();
    }
}

export const EARS_obtenerHistorialPagos = async (id_prestamo) => {
    const [resultado] = await EARS_ConexionDb.query(`SELECT p.id_pago,p.valor,p.fecha,c.id_cuota,c.nro_cuota,c.valor AS valor_cuota,m.id_movimiento, (SELECT IFNULL(SUM(p2.valor), 0) FROM pagos p2 WHERE p2.cuota = c.id_cuota) AS total_pagado, (c.valor - (SELECT IFNULL(SUM(p3.valor), 0) FROM pagos p3 WHERE p3.cuota = c.id_cuota)) AS restante FROM pagos p INNER JOIN cuotas c ON p.cuota = c.id_cuota INNER JOIN movimientos m ON p.movimiento = m.id_movimiento WHERE c.prestamo = ? ORDER BY p.fecha DESC`, [id_prestamo]);
    return resultado;
}

export const EARS_ObtenerCuotasPorPrestamo = async (id_prestamo) => {
    const [resultado] = await EARS_ConexionDb.query(`SELECT c.id_cuota,c.nro_cuota,c.valor,c.fecha_pago,c.estado,IFNULL((SELECT SUM(p.valor) FROM pagos p WHERE p.cuota=c.id_cuota),0) AS total_pagado,(c.valor-IFNULL((SELECT SUM(p2.valor) FROM pagos p2 WHERE p2.cuota=c.id_cuota),0)) AS restante,CASE WHEN c.fecha_pago<CURDATE() AND c.estado!='pagado' THEN DATEDIFF(CURDATE(),c.fecha_pago)*(c.valor*0.01) ELSE 0 END AS mora FROM cuotas c WHERE c.prestamo=? ORDER BY c.nro_cuota ASC`, [id_prestamo]);
    return resultado;
};

export const EARS_ObtenerCuotasPorCliente = async (id_persona) => {
    const [resultado] = await EARS_ConexionDb.query(`
        SELECT c.id_cuota, c.nro_cuota, c.fecha_pago, c.valor, c.estado, c.prestamo
        FROM cuotas c
        INNER JOIN prestamos p ON c.prestamo = p.id_prestamo
        WHERE p.persona = ?
        ORDER BY c.fecha_pago ASC
    `, [id_persona]);
    return resultado;
};