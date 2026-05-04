import React, { useState, useEffect } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_Table from '../EARS_organisms/EARS_Table.jsx';
import EARS_Modal from '../EARS_molecules/EARS_Modal.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import EARS_FormField from '../EARS_molecules/EARS_FormField.jsx';
import { Plus, CheckCircle } from 'lucide-react';

const EARS_AdminPrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    persona: '', monto: '', valor_prestado: '', interes: '', saldo: '', cant_cuotas: '', valor_cuotas: '', forma_pago: 'mensual', fiador: ''
  });

  const cargarPrestamos = async () => {
    try {
      const data = await EARS_ApiFetch('/prestamo/get');
      setPrestamos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await EARS_ApiFetch('/prestamo/create', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      cargarPrestamos();
    } catch (error) {
      alert(error.message);
    }
  };

  const aprobarPrestamo = async (id) => {
    try {
      await EARS_ApiFetch(`/prestamo/estado/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado: 'activo' })
      });
      cargarPrestamos();
    } catch (error) {
      alert(error.message);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_prestamo' },
    { header: 'Cliente (ID)', accessor: 'persona' },
    { header: 'Monto Original', render: (row) => `$${row.monto}` },
    { header: 'Total (c/ Interés)', render: (row) => `$${row.valor_prestado}` },
    { header: 'Saldo Restante', render: (row) => `$${row.saldo || row.valor_prestado}` },
    { 
      header: 'Estado', 
      render: (row) => (
        <span style={{ 
          color: row.estado === 'solicitado' ? 'var(--ears-warning)' : 
                 row.estado === 'activo' ? 'var(--ears-success)' : 'var(--ears-text-main)' 
        }}>
          {row.estado}
        </span>
      ) 
    },
  ];

  const renderActions = (row) => {
    if (row.estado === 'solicitado') {
      return (
        <EARS_Button variant="success" onClick={() => aprobarPrestamo(row.id_prestamo)}>
          <CheckCircle size={16} /> Aprobar
        </EARS_Button>
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="ears-page-title" style={{ marginBottom: 0 }}>Gestión de Préstamos</h1>
        <EARS_Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nuevo Préstamo
        </EARS_Button>
      </div>

      <EARS_Table columns={columns} data={prestamos} actions={renderActions} />

      <EARS_Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Asignar Préstamo">
        <form onSubmit={handleSubmit}>
          <EARS_FormField label="ID Persona" name="persona" value={formData.persona} onChange={handleChange} required />
          <EARS_FormField label="Monto" type="number" name="monto" value={formData.monto} onChange={handleChange} required />
          <EARS_FormField label="Interés (%)" type="number" name="interes" value={formData.interes} onChange={handleChange} required />
          <EARS_FormField label="Valor Total a Pagar" type="number" name="valor_prestado" value={formData.valor_prestado} onChange={handleChange} required />
          <EARS_FormField label="Saldo" type="number" name="saldo" value={formData.saldo} onChange={handleChange} required />
          <EARS_FormField label="Cantidad Cuotas" type="number" name="cant_cuotas" value={formData.cant_cuotas} onChange={handleChange} required />
          <EARS_FormField label="Valor Cuota" type="number" name="valor_cuotas" value={formData.valor_cuotas} onChange={handleChange} required />
          
          <div className="ears-form-field">
            <label className="ears-label">Forma de Pago</label>
            <select className="ears-input" name="forma_pago" value={formData.forma_pago} onChange={handleChange} required>
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>
          
          <EARS_FormField label="Fiador (Opcional)" name="fiador" value={formData.fiador} onChange={handleChange} />

          <div style={{ marginTop: '2rem' }}>
            <EARS_Button type="submit" fullWidth>Registrar Préstamo</EARS_Button>
          </div>
        </form>
      </EARS_Modal>
    </div>
  );
};

export default EARS_AdminPrestamos;
