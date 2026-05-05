import React, { useState, useEffect } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_Table from '../EARS_organisms/EARS_Table.jsx';

const EARS_AdminMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);

  const cargarMovimientos = async () => {
    try {
      const data = await EARS_ApiFetch('/movimiento/get');
      setMovimientos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const columns = [
    { header: 'ID', accessor: 'id_movimiento' },
    { header: 'Fecha', render: (row) => new Date(row.fecha).toLocaleDateString() },
    { header: 'Valor', render: (row) => `$${row.valor}` },
    {
      header: 'Tipo',
      render: (row) => (
        <span style={{
          color: row.tipo === 'ingreso' ? 'var(--ears-success)' : 'var(--ears-danger)',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.875rem'
        }}>
          {row.tipo}
        </span>
      )
    },
    { header: 'Estado', accessor: 'estado' },
  ];

  return (
    <div>
      <h1 className="ears-page-title">Historial de Movimientos</h1>
      <EARS_Table columns={columns} data={movimientos} />
    </div>
  );
};

export default EARS_AdminMovimientos;
