import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import RutaProtegida from './components/common/RutaProtegida.jsx';
import MenuRoles from './components/layout/MenuRoles.jsx';
import Login from './pages/Login.jsx';
import Inicio from './pages/Inicio.jsx';
import MetrobusPanel from './modulos/metrobus/MetrobusPanel.jsx';
import AguaPanel from './modulos/agua/AguaPanel.jsx';
import SatPanel from './modulos/sat/SatPanel.jsx';
import CrmPanel from './modulos/crm/CrmPanel.jsx';
import FugaEstacion from './integraciones/FugaEstacion.jsx';
import ReclamoArbitrios from './integraciones/ReclamoArbitrios.jsx';
import Vista360 from './integraciones/Vista360.jsx';

function LayoutProtegido({ modulo, rolesPermitidos, children }) {
  return (
    <RutaProtegida modulo={modulo} rolesPermitidos={rolesPermitidos}>
      <MenuRoles>{children}</MenuRoles>
    </RutaProtegida>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<LayoutProtegido><Inicio /></LayoutProtegido>} />

          {/* Módulos principales */}
          <Route path="/metrobus" element={<LayoutProtegido modulo="metrobus"><MetrobusPanel /></LayoutProtegido>} />
          <Route path="/agua" element={<LayoutProtegido modulo="agua"><AguaPanel /></LayoutProtegido>} />
          <Route path="/sat" element={<LayoutProtegido modulo="sat"><SatPanel /></LayoutProtegido>} />
          <Route path="/crm" element={<LayoutProtegido modulo="crm"><CrmPanel /></LayoutProtegido>} />

          {/* Rutas de integración del Grupo 6 */}
          <Route
            path="/agua/fuga"
            element={<LayoutProtegido modulo="agua" rolesPermitidos={['cliente']}><FugaEstacion /></LayoutProtegido>}
          />
          <Route
            path="/sat/reclamo"
            element={<LayoutProtegido modulo="sat" rolesPermitidos={['cliente']}><ReclamoArbitrios /></LayoutProtegido>}
          />
          <Route
            path="/metrobus/mis-reportes"
            element={<LayoutProtegido modulo="metrobus" rolesPermitidos={['administrador']}><ReclamoArbitrios soloSeguimiento /></LayoutProtegido>}
          />
          <Route
            path="/crm/vista-360"
            element={<LayoutProtegido modulo="crm" rolesPermitidos={['administrador', 'empleado']}><Vista360 /></LayoutProtegido>}
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}