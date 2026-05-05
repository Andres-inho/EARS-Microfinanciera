import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EARS_AuthProvider, useEARS_Auth } from './EARS_context/EARS_AuthContext.jsx';
import EARS_AuthLayout from './EARS_components/EARS_templates/EARS_AuthLayout.jsx';
import EARS_DashboardLayout from './EARS_components/EARS_templates/EARS_DashboardLayout.jsx';

import EARS_Login from './EARS_components/EARS_pages/EARS_Login.jsx';
import EARS_AdminDashboard from './EARS_components/EARS_pages/EARS_AdminDashboard.jsx';
import EARS_AdminPersonas from './EARS_components/EARS_pages/EARS_AdminPersonas.jsx';
import EARS_AdminPrestamos from './EARS_components/EARS_pages/EARS_AdminPrestamos.jsx';
import EARS_AdminGastos from './EARS_components/EARS_pages/EARS_AdminGastos.jsx';
import EARS_AdminMovimientos from './EARS_components/EARS_pages/EARS_AdminMovimientos.jsx';
import EARS_AdminReportes from './EARS_components/EARS_pages/EARS_AdminReportes.jsx';
import EARS_ClienteDashboard from './EARS_components/EARS_pages/EARS_ClienteDashboard.jsx';
import EARS_ClientePrestamos from './EARS_components/EARS_pages/EARS_ClientePrestamos.jsx';
import EARS_CobradorDashboard from './EARS_components/EARS_pages/EARS_CobradorDashboard.jsx';
import EARS_CobradorCuotas from './EARS_components/EARS_pages/EARS_CobradorCuotas.jsx';
import EARS_CobradorRegistrarPago from './EARS_components/EARS_pages/EARS_CobradorRegistrarPago.jsx';
import EARS_AdminSociedades from './EARS_components/EARS_pages/EARS_AdminSociedades.jsx';

const EARS_ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useEARS_Auth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to={`/${user?.rol}`} replace />;
  }
  return children;
};

function EARS_App() {
  return (
    <EARS_AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<EARS_AuthLayout />}>
            <Route path="/login" element={<EARS_Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
          
          <Route element={<EARS_DashboardLayout />}>
            {/* Rutas de Admin */}
            <Route path="/admin" element={<EARS_ProtectedRoute allowedRoles={['admin']}><EARS_AdminDashboard /></EARS_ProtectedRoute>} />
            <Route path="/admin/reportes" element={<EARS_ProtectedRoute allowedRoles={['admin']}><EARS_AdminReportes /></EARS_ProtectedRoute>} />
            <Route path="/admin/personas" element={<EARS_ProtectedRoute allowedRoles={['admin']}><EARS_AdminPersonas /></EARS_ProtectedRoute>} />
            <Route path="/admin/sociedades" element={<EARS_ProtectedRoute allowedRoles={['admin']}><EARS_AdminSociedades /></EARS_ProtectedRoute>} />
            <Route path="/admin/prestamos" element={<EARS_ProtectedRoute allowedRoles={['admin']}><EARS_AdminPrestamos /></EARS_ProtectedRoute>} />
            <Route path="/admin/gastos" element={<EARS_ProtectedRoute allowedRoles={['admin']}><EARS_AdminGastos /></EARS_ProtectedRoute>} />
            <Route path="/admin/movimientos" element={<EARS_ProtectedRoute allowedRoles={['admin']}><EARS_AdminMovimientos /></EARS_ProtectedRoute>} />
            
            {/* Rutas de Cliente */}
            <Route path="/cliente" element={<EARS_ProtectedRoute allowedRoles={['cliente']}><EARS_ClientePrestamos /></EARS_ProtectedRoute>} />
            <Route path="/cliente/pagos" element={<EARS_ProtectedRoute allowedRoles={['cliente']}><EARS_ClienteDashboard /></EARS_ProtectedRoute>} />
            
            {/* Rutas de Cobrador */}
            <Route path="/cobrador" element={<EARS_ProtectedRoute allowedRoles={['cobrador']}><EARS_CobradorDashboard /></EARS_ProtectedRoute>} />
            <Route path="/cobrador/cuotas" element={<EARS_ProtectedRoute allowedRoles={['cobrador']}><EARS_CobradorCuotas /></EARS_ProtectedRoute>} />
            <Route path="/cobrador/registrar-pago" element={<EARS_ProtectedRoute allowedRoles={['cobrador']}><EARS_CobradorRegistrarPago /></EARS_ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EARS_AuthProvider>
  );
}

export default EARS_App;
