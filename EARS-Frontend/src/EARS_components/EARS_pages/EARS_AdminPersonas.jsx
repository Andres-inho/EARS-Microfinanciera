import React, { useState, useEffect } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_Table from '../EARS_organisms/EARS_Table.jsx';
import EARS_Modal from '../EARS_molecules/EARS_Modal.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import EARS_FormField from '../EARS_molecules/EARS_FormField.jsx';
import { Plus, Edit, Trash2 } from 'lucide-react';

const EARS_AdminPersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    identificacion: '', nombres: '', direccion: '', telefono: '', 
    calificacion: '', rol: 'cliente', password: '', estado: 'activo'
  });

  const resetForm = () => {
    setFormData({
      identificacion: '', nombres: '', direccion: '', telefono: '', 
      calificacion: '', rol: 'cliente', password: '', estado: 'activo'
    });
    setIsEditing(false);
  };

  const cargarPersonas = async () => {
    try {
      const data = await EARS_ApiFetch('/persona/get');
      setPersonas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await EARS_ApiFetch(`/persona/update/${formData.id_persona}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await EARS_ApiFetch('/persona/create', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      resetForm();
      cargarPersonas();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (persona) => {
    setFormData({ ...persona, password: '' }); // Reset password field
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de querer desactivar/eliminar a esta persona?')) {
      try {
        await EARS_ApiFetch(`/persona/delete/${id}`, { method: 'DELETE' });
        cargarPersonas();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_persona' },
    { header: 'Identificación', accessor: 'identificacion' },
    { header: 'Nombres', accessor: 'nombres' },
    { header: 'Dirección', accessor: 'direccion' },
    { header: 'Teléfono', accessor: 'telefono' },
    { header: 'Calificación', accessor: 'calificacion' },
    { header: 'Observaciones', accessor: 'observaciones' },
    { 
      header: 'Rol', 
      render: (row) => <span className="ears-role-badge">{row.rol}</span> 
    },
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
    <>
      <EARS_Button variant="secondary" onClick={() => handleEdit(row)}>
        <Edit size={16} /> Editar
      </EARS_Button>
      <EARS_Button variant="danger" onClick={() => handleDelete(row.id_persona)} style={{ marginLeft: '0.5rem' }}>
        <Trash2 size={16} /> Eliminar
      </EARS_Button>
    </>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="ears-page-title" style={{ marginBottom: 0 }}>Gestión de Personas</h1>
        <EARS_Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={20} /> Nueva Persona
        </EARS_Button>
      </div>

      <EARS_Table columns={columns} data={personas} actions={renderActions} />

      <EARS_Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={isEditing ? "Editar Persona" : "Nueva Persona"}>
        <form onSubmit={handleSubmit}>
          <EARS_FormField label="Identificación" name="identificacion" value={formData.identificacion} onChange={handleChange} required />
          <EARS_FormField label="Nombres" name="nombres" value={formData.nombres} onChange={handleChange} required />
          <EARS_FormField label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} required />
          <EARS_FormField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} required />
          <EARS_FormField label="Calificación (1-5)" type="number" name="calificacion" value={formData.calificacion} onChange={handleChange} />
          <EARS_FormField label="Observaciones" name="observaciones" value={formData.observaciones || ''} onChange={handleChange} />
          
          <div className="ears-form-field">
            <label className="ears-label">Rol</label>
            <select className="ears-input" name="rol" value={formData.rol} onChange={handleChange} required>
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
              <option value="cobrador">Cobrador</option>
            </select>
          </div>
          
          <EARS_FormField label="Contraseña (deja en blanco para no cambiar)" type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
          
          <div style={{ marginTop: '2rem' }}>
            <EARS_Button type="submit" fullWidth>Guardar Registro</EARS_Button>
          </div>
        </form>
      </EARS_Modal>
    </div>
  );
};

export default EARS_AdminPersonas;
