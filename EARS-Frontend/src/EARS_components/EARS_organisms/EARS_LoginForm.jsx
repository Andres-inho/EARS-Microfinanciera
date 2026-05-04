import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EARS_FormField from '../EARS_molecules/EARS_FormField.jsx';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import { useEARS_Auth } from '../../EARS_context/EARS_AuthContext.jsx';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import './EARS_LoginForm.css';

const EARS_LoginForm = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useEARS_Auth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await EARS_ApiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identificacion, password })
      });
      
      login(data, data.token);
      navigate(`/${data.rol}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="ears-login-form" onSubmit={handleSubmit}>
      <h2 className="ears-gradient-text">Bienvenido</h2>
      <p className="ears-subtitle">Ingresa tus credenciales para continuar</p>
      
      {error && <div className="ears-error-alert">{error}</div>}

      <EARS_FormField
        label="Identificación"
        id="identificacion"
        name="identificacion"
        type="text"
        placeholder="123456789"
        value={identificacion}
        onChange={(e) => setIdentificacion(e.target.value)}
        required
      />

      <EARS_FormField
        label="Contraseña"
        id="password"
        name="password"
        type="password"
        placeholder="••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="ears-login-action">
        <EARS_Button type="submit" fullWidth>Iniciar Sesión</EARS_Button>
      </div>
    </form>
  );
};

export default EARS_LoginForm;
