import React, { useState } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_FormField from '../EARS_molecules/EARS_FormField.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import { DollarSign } from 'lucide-react';

const EARS_CobradorRegistrarPago = () => {
  const [formData, setFormData] = useState({ id_cuota: '', valor: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await EARS_ApiFetch('/cuota/pagar', { 
        method: 'POST',
        body: JSON.stringify(formData)
      });
      alert('Pago registrado correctamente');
      setFormData({ id_cuota: '', valor: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1 className="ears-page-title">Registro Rápido de Pago</h1>
      <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)' }}>
        <form onSubmit={handleSubmit}>
          <EARS_FormField 
            label="ID de la Cuota" 
            type="number" 
            name="id_cuota"
            value={formData.id_cuota} 
            onChange={handleChange} 
            required 
          />
          <EARS_FormField 
            label="Valor a Pagar ($)" 
            type="number" 
            name="valor"
            value={formData.valor} 
            onChange={handleChange} 
            required 
          />
          <div style={{ marginTop: '1.5rem' }}>
            <EARS_Button type="submit" fullWidth variant="success">
              <DollarSign size={20} /> Registrar Recaudo
            </EARS_Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EARS_CobradorRegistrarPago;
