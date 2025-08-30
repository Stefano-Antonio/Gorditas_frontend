import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../../pages/Dashboard';
import NuevaOrden from '../../pages/NuevaOrden';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="/nueva-orden" element={<NuevaOrden />} />
              <Route path="/editar-orden" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Editar Orden</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/surtir-orden" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Surtir Orden</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/despachar" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Despachar</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/recibir-productos" element={<div className="text-center py-12"><h2 className="text-2xl font-semibent text-gray-700">Recibir Productos</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/cobrar" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Cobrar</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/catalogos" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Catálogos</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
              <Route path="/reportes" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold text-gray-700">Reportes</h2><p className="text-gray-500 mt-2">Módulo en desarrollo</p></div>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;