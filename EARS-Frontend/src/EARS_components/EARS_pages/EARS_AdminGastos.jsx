import React, { useState, useEffect } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_Table from '../EARS_organisms/EARS_Table.jsx';
import EARS_Modal from '../EARS_molecules/EARS_Modal.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import EARS_FormField from '../EARS_molecules/EARS_FormField.jsx';
import { Plus } from 'lucide-react';

const EARS_AdminGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fecha: '', detalle: '', valor: ''
  });

  const cargarGastos = async () => {
    try {
      const data = await EARS_ApiFetch('/gasto/get');
      setGastos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarGastos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await EARS_ApiFetch('/gasto/create', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      cargarGastos();
    } catch (error) {
      alert(error.message);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_gasto' },
    { header: 'Fecha', render: (row) => new Date(row.fecha).toLocaleDateString() },
    { header: 'Detalle', accessor: 'detalle' },
    { header: 'Valor', render: (row) => `$${row.valor}` },
    { header: 'Ref. Movimiento', accessor: 'movimiento' },
    { header: 'Estado', accessor: 'estado' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="ears-page-title" style={{ marginBottom: 0 }}>Gestión de Gastos</h1>
        <EARS_Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nuevo Gasto
        </EARS_Button>
      </div>

      <EARS_Table columns={columns} data={gastos} />

      <EARS_Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Gasto">
        <form onSubmit={handleSubmit}>
          <EARS_FormField label="Fecha" type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
          <EARS_FormField label="Detalle / Motivo" name="detalle" value={formData.detalle} onChange={handleChange} required />
          <EARS_FormField label="Valor ($)" type="number" name="valor" value={formData.valor} onChange={handleChange} required />

          <div style={{ marginTop: '2rem' }}>
            <EARS_Button type="submit" fullWidth>Registrar Gasto</EARS_Button>
          </div>
        </form>
      </EARS_Modal>
    </div>
  );
};

export default EARS_AdminGastos;
