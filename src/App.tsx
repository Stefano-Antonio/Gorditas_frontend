@@ .. @@
import NuevaOrden from './pages/NuevaOrden';
import SurtirOrden from './pages/SurtirOrden';
import EditarOrden from './pages/EditarOrden';
+import GestionOrdenes from './pages/GestionOrdenes';
import Despachar from './pages/Despachar';
@@ .. @@
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/nueva-orden" element={<NuevaOrden />} />
              <Route path="/editar-orden" element={<EditarOrden/>} />
+              <Route path="/gestion-ordenes" element={<GestionOrdenes/>} />
              <Route path="/surtir-orden" element={<SurtirOrden/>} />
              <Route path="/despachar" element={<Despachar/>} />
              <Route path="/recibir-productos" element={<RecibirProducto/>} />
              <Route path="/cobrar" element={<Cobrar/>} />
              <Route path="/catalogos" element={<Catalogos/>} />
              <Route path="/reportes" element={<Reportes/>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
   );
 };

 const LayoutRoutes: React.FC = () => {
   return (
     <Routes>
       <Route path="/" element={<Dashboard />} />
       <Route path="/nueva-orden" element={<NuevaOrden />} />
       <Route path="/editar-orden" element={<EditarOrden/>} />
+      <Route path="/gestion-ordenes" element={<GestionOrdenes/>} />
       <Route path="/surtir-orden" element={<SurtirOrden/>} />
       <Route path="/despachar" element={<Despachar/>} />
       <Route path="/recibir-productos" element={<RecibirProducto/>} />
       <Route path="/cobrar" element={<Cobrar/>} />
       <Route path="/catalogos" element={<Catalogos/>} />
       <Route path="/reportes" element={<Reportes/>} />
     </Routes>
   );
 };