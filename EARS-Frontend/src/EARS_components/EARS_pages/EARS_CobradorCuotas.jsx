import React, { useState, useEffect } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_Table from '../EARS_organisms/EARS_Table.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import { CheckCircle } from 'lucide-react';

const EARS_CobradorCuotas = () => {
  const [cuotas, setCuotas] = useState([]);

  const cargarCuotas = async () => {
    try {
      const data = await EARS_ApiFetch('/reporte/cartera-pendiente');
      setCuotas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarCuotas();
  }, []);

  const pagarCuota = async (id_cuota) => {
    try {
      await EARS_ApiFetch(`/cuota/pagar/${id_cuota}`, { method: 'PUT' });
      cargarCuotas();
    } catch (error) {
      alert(error.message);
    }
  };

  const columns = [
    { header: 'ID Cuota', accessor: 'id_cuota' },
    { header: 'Nro Cuota', accessor: 'nro_cuota' },
    { header: 'ID Préstamo', accessor: 'id_prestamo' },
    { header: 'ID Cliente', accessor: 'persona' },
    { header: 'Fecha de Pago', render: (row) => new Date(row.fecha_pago).toLocaleDateString() },
    { header: 'Valor a Pagar', render: (row) => `$${row.valor}` },
    { header: 'Estado', accessor: 'estado' },
  ];

  const renderActions = (row) => (
    <EARS_Button variant="success" onClick={() => pagarCuota(row.id_cuota)}>
      <CheckCircle size={16} /> Recaudar
    </EARS_Button>
  );

  return (
    <div>
      <h1 className="ears-page-title">Cartera Pendiente por Recaudar</h1>
      <EARS_Table columns={columns} data={cuotas} actions={renderActions} />
    </div>
  );
};

export default EARS_CobradorCuotas;
