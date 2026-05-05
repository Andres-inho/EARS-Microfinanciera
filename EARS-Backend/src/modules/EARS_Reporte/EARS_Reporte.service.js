import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";

export const EARS_GenerarReportes = async () => {
    const [prestado] = await EARS_ConexionDb.query('select sum(valor_prestado) as total from prestamos');
    const [recaudado] = await EARS_ConexionDb.query('select sum(valor) as total from pagos');
    
    const total_prestado = prestado[0].total || 0;
    const total_recaudado = recaudado[0].total || 0;
    
    const [mora] = await EARS_ConexionDb.query(`
        select sum(DATEDIFF(CURDATE(), fecha_pago) * (valor * 0.01)) as total_mora 
        from cuotas 
        where fecha_pago < CURDATE() and estado != 'pagado'
    `);
    const creditos_mora = mora[0].total_mora || 0;

    const [cuotas] = await EARS_ConexionDb.query('select sum(valor) as total from cuotas');
    const total_cuotas = cuotas[0].total || 0;
    const cartera_pendiente = (total_cuotas - total_recaudado) + creditos_mora;

    const [ingresos] = await EARS_ConexionDb.query("select sum(valor) as total from movimientos where tipo = 'ingreso' and estado = 'activo'");
    const [egresos] = await EARS_ConexionDb.query("select sum(valor) as total from movimientos where tipo = 'egreso' and estado = 'activo'");
    const flujo_caja = (ingresos[0].total || 0) - (egresos[0].total || 0);

    return {
        total_prestado,
        total_recaudado,
        cartera_pendiente,
        creditos_mora,
        flujo_caja
    };
}

export const EARS_TotalPrestado = async () => {
    const [rows] = await EARS_ConexionDb.query(`
        SELECT pr.id_prestamo, pr.valor_prestado, pr.interes, pr.tiempo, pr.estado, pr.fecha_prestamo,
               p.nombres AS persona_nombre, f.nombres AS fiador_nombre
        FROM prestamos pr
        LEFT JOIN personas p ON pr.persona = p.id_persona
        LEFT JOIN personas f ON pr.fiador = f.id_persona
        ORDER BY pr.id_prestamo ASC
    `);
    return rows;
}
export const EARS_TotalRecaudado = async () => {
    const [rows] = await EARS_ConexionDb.query(`
        select p.id_pago, p.valor, p.fecha as fecha_pago, c.nro_cuota, pr.id_prestamo, per.nombres as cliente
        from pagos p
        inner join cuotas c on p.cuota = c.id_cuota
        inner join prestamos pr on c.prestamo = pr.id_prestamo
        inner join personas per on pr.persona = per.id_persona
        order by p.fecha desc
    `);
    return rows;
}

export const EARS_CarteraPendiente = async () => {
    const [rows] = await EARS_ConexionDb.query(`
        select c.id_cuota, c.nro_cuota, c.fecha_pago, c.valor, c.estado, 
               p.id_prestamo, p.persona, per.nombres as persona_nombre
        from cuotas c 
        inner join prestamos p on c.prestamo = p.id_prestamo 
        inner join personas per on p.persona = per.id_persona
        where c.estado = 'pendiente'
    `);
    return rows;
}

export const EARS_CreditosEnMora = async () => {
    const [rows] = await EARS_ConexionDb.query(`
        select c.id_cuota, c.nro_cuota, c.fecha_pago, c.valor, 
        DATEDIFF(CURDATE(), c.fecha_pago) as dias_retraso,
        (DATEDIFF(CURDATE(), c.fecha_pago) * (c.valor * 0.01)) as valor_mora,
        p.id_prestamo, p.persona
        from cuotas c 
        inner join prestamos p on c.prestamo = p.id_prestamo 
        where c.fecha_pago < CURDATE() and c.estado != 'pagado'
    `);
    return rows;
}

export const EARS_FlujoDeCaja = async () => {
    const [rows] = await EARS_ConexionDb.query("select * from movimientos where estado = 'activo' order by fecha desc");
    return rows;
}
