import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";

export const EARS_ObtenerDeudaCliente = async (id_persona) => {
const [resultado] = await EARS_ConexionDb.query(`SELECT p.id_persona,p.nombres,SUM(c.valor) AS total_cuotas,IFNULL((SELECT SUM(pg.valor) FROM pagos pg INNER JOIN cuotas c2 ON pg.cuota = c2.id_cuota INNER JOIN prestamos pr2 ON c2.prestamo = pr2.id_prestamo WHERE pr2.persona = p.id_persona),0) AS total_pagado,SUM(CASE WHEN c.fecha_pago < CURDATE() AND c.estado != 'pagado' THEN DATEDIFF(CURDATE(),c.fecha_pago)*(c.valor*0.01) ELSE 0 END) AS mora_total FROM personas p INNER JOIN prestamos pr ON pr.persona = p.id_persona INNER JOIN cuotas c ON c.prestamo = pr.id_prestamo WHERE p.id_persona = ? GROUP BY p.id_persona`,[id_persona]);
if(resultado.length===0){throw new Error('El cliente no tiene prestamos o no existe');}
const data = resultado[0];
const deuda_actual = (data.total_cuotas - data.total_pagado) + data.mora_total;
return {cliente:data.nombres,total_cuotas:data.total_cuotas,total_pagado:data.total_pagado,mora:data.mora_total,deuda_actual};
};