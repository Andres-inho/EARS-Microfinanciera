import React, { useState, useEffect } from 'react';
import { useEARS_Auth } from '../../EARS_context/EARS_AuthContext.jsx';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_Table from '../EARS_organisms/EARS_Table.jsx';
import EARS_Modal from '../EARS_molecules/EARS_Modal.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import EARS_FormField from '../EARS_molecules/EARS_FormField.jsx';
import { Plus } from 'lucide-react';

const EARS_ClientePrestamos = () => {
  const { user } = useEARS_Auth();
  const [deuda, setDeuda] = useState([]);

  const cargarDeuda = async () => {
    try {
      const data = await EARS_ApiFetch(`/cuota/cliente/${user.id_persona}`);
      setDeuda(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDeuda();
  }, []);

  const columns = [
    { header: 'ID Cuota', accessor: 'id_cuota' },
    { header: 'Nro Cuota', accessor: 'nro_cuota' },
    { header: 'ID Préstamo', accessor: 'prestamo' },
    { header: 'Fecha Vencimiento', render: (row) => new Date(row.fecha_pago).toLocaleDateString() },
    { header: 'Valor Cuota', render: (row) => `$${row.valor}` },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="ears-page-title" style={{ marginBottom: 0 }}>Mis Cuotas y Préstamos</h1>
      </div>
      
      <EARS_Table columns={columns} data={deuda} />
    </div>
  );
};

export default EARS_ClientePrestamos;
