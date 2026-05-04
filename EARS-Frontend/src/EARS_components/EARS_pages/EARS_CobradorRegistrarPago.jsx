import React, { useState } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import EARS_FormField from '../EARS_molecules/EARS_FormField.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import { DollarSign } from 'lucide-react';

const EARS_CobradorRegistrarPago = () => {
  const [idCuota, setIdCuota] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await EARS_ApiFetch(`/cuota/pagar/${idCuota}`, { method: 'PUT' });
      alert('Pago registrado correctamente');
      setIdCuota('');
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
            label="ID de la Cuota a Pagar" 
            type="number" 
            value={idCuota} 
            onChange={(e) => setIdCuota(e.target.value)} 
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
