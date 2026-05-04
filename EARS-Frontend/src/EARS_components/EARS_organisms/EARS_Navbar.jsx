import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useEARS_Auth } from '../../EARS_context/EARS_AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './EARS_Navbar.css';

const EARS_Navbar = () => {
  const { user, logout } = useEARS_Auth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="ears-navbar ears-glass">
      <div className="ears-navbar-brand">
        <span className="ears-gradient-text">EARS Panel</span>
      </div>
      <div className="ears-navbar-actions">
        <div className="ears-user-info">
          <User size={20} />
          <span>{user?.nombres || 'Usuario'}</span>
          <span className="ears-role-badge">{user?.rol}</span>
        </div>
        <button className="ears-logout-btn" onClick={handleLogout} title="Cerrar Sesión">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default EARS_Navbar;
