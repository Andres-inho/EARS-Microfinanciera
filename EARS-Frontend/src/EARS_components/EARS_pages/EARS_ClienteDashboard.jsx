import React from 'react';
import { useEARS_Auth } from '../../EARS_context/EARS_AuthContext.jsx';

const EARS_ClienteDashboard = () => {
  const { user } = useEARS_Auth();

  return (
    <div className="ears-cliente-dashboard">
      <h1 className="ears-page-title">Hola, {user?.nombres}</h1>
      <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)' }}>
        <p>Bienvenido a tu panel de cliente. Aquí podrás ver tus préstamos activos y el estado de tus cuotas.</p>
      </div>
    </div>
  );
};

export default EARS_ClienteDashboard;
