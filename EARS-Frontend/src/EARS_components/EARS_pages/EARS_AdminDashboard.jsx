import React, { useEffect, useState } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import { Activity, CreditCard, DollarSign, Users, AlertTriangle } from 'lucide-react';
import './EARS_AdminDashboard.css';

const EARS_StatCard = ({ title, value, icon, variant = 'primary' }) => (
  <div className={`ears-stat-card ears-glass ears-border-${variant}`}>
    <div className={`ears-stat-icon ears-bg-${variant}`}>
      {icon}
    </div>
    <div className="ears-stat-info">
      <h3>{title}</h3>
      <p className="ears-stat-value">${Number(value).toLocaleString()}</p>
    </div>
  </div>
);

const EARS_AdminDashboard = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const data = await EARS_ApiFetch('/reporte/resumen');
        setReporte(data);
      } catch (error) {
        console.error('Error fetching reporte:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReporte();
  }, []);

  if (loading) return <div>Cargando dashboard...</div>;

  return (
    <div className="ears-admin-dashboard">
      <h1 className="ears-page-title">Resumen Financiero</h1>
      
      <div className="ears-stats-grid">
        <EARS_StatCard 
          title="Total Prestado" 
          value={reporte?.total_prestado || 0} 
          icon={<CreditCard size={24} color="white" />} 
          variant="primary"
        />
        <EARS_StatCard 
          title="Total Recaudado" 
          value={reporte?.total_recaudado || 0} 
          icon={<DollarSign size={24} color="white" />} 
          variant="success"
        />
        <EARS_StatCard 
          title="Cartera Pendiente" 
          value={reporte?.cartera_pendiente || 0} 
          icon={<Activity size={24} color="white" />} 
          variant="warning"
        />
        <EARS_StatCard 
          title="Créditos en Mora" 
          value={reporte?.creditos_mora || 0} 
          icon={<AlertTriangle size={24} color="white" />} 
          variant="danger"
        />
      </div>
    </div>
  );
};

export default EARS_AdminDashboard;
