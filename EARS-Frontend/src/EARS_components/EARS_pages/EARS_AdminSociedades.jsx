import React, { useState, useEffect } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_Table from '../EARS_organisms/EARS_Table.jsx';
import EARS_Modal from '../EARS_molecules/EARS_Modal.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import EARS_FormField from '../EARS_molecules/EARS_FormField.jsx';
import { Plus, Power } from 'lucide-react';

const EARS_AdminSociedades = () => {
  const [sociedades, setSociedades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sociedad: '', caja: ''
  });

  const resetForm = () => {
    setFormData({ sociedad: '', caja: '' });
  };

  const cargarSociedades = async () => {
    try {
      const data = await EARS_ApiFetch('/sociedad/get');
      setSociedades(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarSociedades();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await EARS_ApiFetch('/sociedad/create', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      resetForm();
      cargarSociedades();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleEstado = async (sociedad) => {
    const nuevoEstado = sociedad.estado === 'activo' ? 'inactivo' : 'activo';
    if (window.confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) {
      try {
        await EARS_ApiFetch(`/sociedad/estado/${sociedad.id_sociedad}`, {
          method: 'PUT',
          body: JSON.stringify({ estado: nuevoEstado })
        });
        cargarSociedades();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_sociedad' },
    { header: 'Nombre de Sociedad', accessor: 'sociedad' },
    { header: 'Caja', accessor: 'caja' },
    {
      header: 'Estado',
      render: (row) => (
        <span style={{ color: row.estado === 'activo' ? 'var(--ears-success)' : 'var(--ears-danger)' }}>
          {row.estado}
        </span>
      )
    }
  ];

  const renderActions = (row) => (
    <EARS_Button
      variant={row.estado === 'activo' ? 'danger' : 'success'}
      onClick={() => handleToggleEstado(row)}
    >
      <Power size={16} /> {row.estado === 'activo' ? 'Desactivar' : 'Activar'}
    </EARS_Button>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="ears-page-title" style={{ marginBottom: 0 }}>Gestión de Sociedades</h1>
        <EARS_Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={20} /> Nueva Sociedad
        </EARS_Button>
      </div>

      <EARS_Table columns={columns} data={sociedades} actions={renderActions} />

      <EARS_Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title="Nueva Sociedad">
        <form onSubmit={handleSubmit}>
          <EARS_FormField label="Nombre de la Sociedad" name="sociedad" value={formData.sociedad} onChange={handleChange} required />
          <EARS_FormField label="Caja" name="caja" value={formData.caja} onChange={handleChange} />

          <div style={{ marginTop: '2rem' }}>
            <EARS_Button type="submit" fullWidth>Guardar Registro</EARS_Button>
          </div>
        </form>
      </EARS_Modal>
    </div>
  );
};

export default EARS_AdminSociedades;
