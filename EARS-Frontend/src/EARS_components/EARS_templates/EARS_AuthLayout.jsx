import React from 'react';
import { Outlet } from 'react-router-dom';
import './EARS_AuthLayout.css';

const EARS_AuthLayout = () => {
  return (
    <div className="ears-auth-layout">
      <div className="ears-auth-left ears-gradient-bg">
        <div className="ears-auth-brand">
          <h1>EARS Microfinanciera</h1>
          <p>Gestión financiera moderna y eficiente</p>
        </div>
      </div>
      <div className="ears-auth-right">
        <div className="ears-auth-card ears-glass ears-animate-fade">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EARS_AuthLayout;
