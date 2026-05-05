import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEARS_Auth } from '../../EARS_context/EARS_AuthContext.jsx';
import { Home, Users, CreditCard, DollarSign, Activity, FileText, Building } from 'lucide-react';
import './EARS_Sidebar.css';

const EARS_Sidebar = () => {
  const { user } = useEARS_Auth();
  
  const getLinksByRole = () => {
    switch(user?.rol) {
      case 'admin':
        return [
          { path: '/admin', icon: <Home size={20}/>, label: 'Dashboard' },
          { path: '/admin/personas', icon: <Users size={20}/>, label: 'Personas' },
          { path: '/admin/sociedades', icon: <Building size={20}/>, label: 'Sociedades' },
          { path: '/admin/prestamos', icon: <CreditCard size={20}/>, label: 'Préstamos' },
          { path: '/admin/gastos', icon: <Activity size={20}/>, label: 'Gastos' },
          { path: '/admin/movimientos', icon: <DollarSign size={20}/>, label: 'Movimientos' },
          { path: '/admin/reportes', icon: <FileText size={20}/>, label: 'Reportes' },
        ];
      case 'cliente':
        return [
          { path: '/cliente', icon: <Home size={20}/>, label: 'Mis Préstamos' },
          { path: '/cliente/pagos', icon: <DollarSign size={20}/>, label: 'Mis Pagos' },
        ];
      case 'cobrador':
        return [
          { path: '/cobrador', icon: <Home size={20}/>, label: 'Inicio' },
          { path: '/cobrador/cuotas', icon: <CreditCard size={20}/>, label: 'Cuotas Pendientes' },
          { path: '/cobrador/registrar-pago', icon: <DollarSign size={20}/>, label: 'Registrar Pago' },
        ];
      default:
        return [];
    }
  };

  const links = getLinksByRole();

  return (
    <aside className="ears-sidebar ears-glass">
      <nav className="ears-nav-list">
        {links.map((link, index) => (
          <NavLink 
            key={index} 
            to={link.path} 
            end={link.path === `/${user?.rol}`}
            className={({isActive}) => `ears-nav-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default EARS_Sidebar;
