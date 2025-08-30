@@ .. @@
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../../pages/Dashboard';
import NuevaOrden from '../../pages/NuevaOrden';
+import GestionOrdenes from '../../pages/GestionOrdenes';

const Layout: React.FC = () => {
@@ .. @@
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="/nueva-orden" element={<NuevaOrden />} />
              <Route path="/editar-orden" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Editar Orden</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
+              <Route path="/gestion-ordenes" element={<GestionOrdenes />} />
              <Route path="/surtir-orden" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Surtir Orden</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/despachar" element={<div className="text-center py-12"><h2 className="text-2xl font-semibent text-gray-700">Despachar</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/recibir-productos" element={<div className="text-center py-12"><h2 className="text-2xl font-semibent text-gray-700">Recibir Productos</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/cobrar" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Cobrar</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/catalogos" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Catálogos</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/reportes" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Reportes</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
            </Routes>