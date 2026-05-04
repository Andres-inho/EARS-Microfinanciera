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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    monto: '', interes: '10', tiempo: '', fiador: ''
  });

  const cargarDeuda = async () => {
    try {
      const data = await EARS_ApiFetch(`/cartera/deuda/${user.id_persona}`);
      setDeuda(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDeuda();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await EARS_ApiFetch('/prestamo/create', {
        method: 'POST',
        body: JSON.stringify({
          persona: user.id_persona,
          valor_prestado: formData.monto,
          interes: formData.interes,
          tiempo: formData.tiempo,
          fiador: formData.fiador || null,
          fecha_prestamo: new Date().toISOString().split('T')[0],
          estado: 'solicitado'
        })
      });
      alert('Solicitud enviada correctamente. En espera de aprobación.');
      setIsModalOpen(false);
      setFormData({ monto: '', interes: '10', tiempo: '', fiador: '' });
      cargarDeuda();
    } catch (error) {
      alert(error.message);
    }
  };

  const columns = [
    { header: 'ID Cuota', accessor: 'id_cuota' },
    { header: 'Nro Cuota', accessor: 'nro_cuota' },
    { header: 'ID Préstamo', accessor: 'prestamo' },
    { header: 'Fecha Vencimiento', render: (row) => new Date(row.fecha_pago).toLocaleDateString() },
    { header: 'Valor Cuota', render: (row) => `$${row.valor}` },
    { 
      header: 'Estado', 
      render: (row) => (
        <span style={{ color: row.estado === 'pendiente' ? 'var(--ears-warning)' : 'var(--ears-success)' }}>
          {row.estado}
        </span>
      )
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="ears-page-title" style={{ marginBottom: 0 }}>Mis Cuotas y Préstamos</h1>
        <EARS_Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Solicitar Nuevo Préstamo
        </EARS_Button>
      </div>
      
      <EARS_Table columns={columns} data={deuda} />

      <EARS_Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Solicitar Préstamo">
        <form onSubmit={handleSubmit}>
          <EARS_FormField label="Monto Deseado ($)" type="number" name="monto" value={formData.monto} onChange={handleChange} required />
          <EARS_FormField label="Tiempo (Meses)" type="number" name="tiempo" value={formData.tiempo} onChange={handleChange} required />
          <EARS_FormField label="ID Fiador (Opcional)" name="fiador" value={formData.fiador} onChange={handleChange} />
          
          <div style={{ marginTop: '2rem' }}>
            <EARS_Button type="submit" fullWidth>Enviar Solicitud</EARS_Button>
          </div>
        </form>
      </EARS_Modal>
    </div>
  );
};

export default EARS_ClientePrestamos;
