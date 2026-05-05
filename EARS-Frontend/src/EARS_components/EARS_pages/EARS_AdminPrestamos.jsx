import React, { useState, useEffect } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_Table from '../EARS_organisms/EARS_Table.jsx';
import EARS_Modal from '../EARS_molecules/EARS_Modal.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import EARS_FormField from '../EARS_molecules/EARS_FormField.jsx';
import { Plus, CheckCircle } from 'lucide-react';

const EARS_AdminPrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [personasLista, setPersonasLista] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    ficha: '', tipo: '', fecha_prestamo: '', interes: '', tiempo: '', valor_prestado: '', persona: '', fiador: ''
  });

  const cargarPrestamos = async () => {
    try {
      const data = await EARS_ApiFetch('/prestamo/get');
      setPrestamos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarPersonas = async () => {
    try {
      const data = await EARS_ApiFetch('/persona/get');
      setPersonasLista(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarPrestamos();
    cargarPersonas();
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
    { header: 'Ficha', accessor: 'ficha' },
    { header: 'Fecha prestamo', render: (row) => new Date(row.fecha_prestamo).toLocaleDateString() },
    { header: 'Total interes', accessor: 'interes' },
    { header: 'Tiempo', accessor: 'tiempo' },
    { header: 'Prestado', accessor: 'valor_prestado' },
    { header: 'A pagar', accessor: 'valor_futuro' },
    { header: 'Tipo', accessor: 'tipo' },
    {
      header: 'Persona',
      render: (row) => row.persona_nombre || `ID: ${row.persona || 'N/A'}`
    },
    { header: 'Movimiento', accessor: 'movimiento' },
    {
      header: 'Fiador',
      render: (row) => row.fiador_nombre || (row.fiador ? `ID: ${row.fiador}` : 'Sin fiador')
    },
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
    return <span style={{ color: 'var(--ears-text-muted)', fontSize: '0.8rem' }}>No requiere acción</span>;
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
          <EARS_FormField label="Ficha (Opcional)" name="ficha" value={formData.ficha} onChange={handleChange} />
          <EARS_FormField label="Tipo de Préstamo (Opcional)" name="tipo" value={formData.tipo} onChange={handleChange} />
          <EARS_FormField label="Fecha del prestamo" type="date" name="fecha_prestamo" value={formData.fecha_prestamo} onChange={handleChange} required />
          <EARS_FormField label="Interés (%)" type="number" name="interes" value={formData.interes} onChange={handleChange} required />
          <EARS_FormField label="Tiempo (Meses)" type="number" name="tiempo" value={formData.tiempo} onChange={handleChange} required />
          <EARS_FormField label="Valor prestado" type="float" name="valor_prestado" value={formData.valor_prestado} onChange={handleChange} required />

          <div className="ears-form-field">
            <label className="ears-label">Persona (Cliente)</label>
            <select className="ears-input" name="persona" value={formData.persona} onChange={handleChange} required>
              <option value="">Seleccione un cliente</option>
              {personasLista.map(p => (
                <option key={p.id_persona} value={p.id_persona}>{p.nombres} - {p.identificacion}</option>
              ))}
            </select>
          </div>

          <div className="ears-form-field">
            <label className="ears-label">Fiador (Opcional)</label>
            <select className="ears-input" name="fiador" value={formData.fiador} onChange={handleChange}>
              <option value="">Sin fiador</option>
              {personasLista.map(p => (
                <option key={p.id_persona} value={p.id_persona}>{p.nombres} - {p.identificacion}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <EARS_Button type="submit" fullWidth>Registrar Préstamo</EARS_Button>
          </div>
        </form>
      </EARS_Modal>
    </div>
  );
};

export default EARS_AdminPrestamos;
