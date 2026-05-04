import React from 'react';
import { useEARS_Auth } from '../../EARS_context/EARS_AuthContext.jsx';

const EARS_CobradorDashboard = () => {
  const { user } = useEARS_Auth();

  return (
    <div className="ears-cobrador-dashboard">
      <h1 className="ears-page-title">Panel de Cobranza</h1>
      <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)' }}>
        <p>Bienvenido {user?.nombres}. Desde aquí podrás registrar los pagos y gestionar la cartera pendiente.</p>
      </div>
    </div>
  );
};

export default EARS_CobradorDashboard;
