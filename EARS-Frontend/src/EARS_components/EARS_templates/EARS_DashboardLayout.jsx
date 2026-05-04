import React from 'react';
import { Outlet } from 'react-router-dom';
import EARS_Navbar from '../EARS_organisms/EARS_Navbar.jsx';
import EARS_Sidebar from '../EARS_organisms/EARS_Sidebar.jsx';
import './EARS_DashboardLayout.css';

const EARS_DashboardLayout = () => {
  return (
    <div className="ears-dashboard-layout">
      <EARS_Navbar />
      <div className="ears-dashboard-body">
        <EARS_Sidebar />
        <main className="ears-dashboard-content ears-animate-fade">
          <div className="ears-content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EARS_DashboardLayout;
