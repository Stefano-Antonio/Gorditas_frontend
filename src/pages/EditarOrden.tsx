@@ .. @@
   const [ordenes, setOrdenes] = useState<Orden[]>([]);
   const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);
+  const [ordenCompleta, setOrdenCompleta] = useState(false);
+  const [observaciones, setObservaciones] = useState('');
   const [subordenes, setSubordenes] = useState<Suborden[]>([]);
@@ .. @@
       if (ordenesRes.success) {
         const ordenesArray: Orden[] = Array.isArray(ordenesRes.data) ? ordenesRes.data : [];
-        const ordenesRecepcion = ordenesArray.filter((orden: Orden) => orden.estatus === 'Recepcion');
+        const ordenesEditables = ordenesArray.filter((orden: Orden) => 
+          ['Pendiente', 'Recepcion'].includes(orden.estatus)
+        );
-        setOrdenes(ordenesRecepcion);
+        setOrdenes(ordenesEditables);
       }
@@ .. @@
   const loadOrdenDetails = async (orden: OrdenConDetalles) => {
     try {
+      setOrdenCompleta(orden.completaValidacion || false);
+      setObservaciones(orden.observaciones || '');
       // In a real implementation, you would load the order details from the API
       // For now, we'll simulate this data
       setSelectedOrden(orden);
@@ .. @@
     setSuccess('Producto eliminado');
   };

+  const handleValidateOrder = async () => {
+    if (!selectedOrden) return;
+
+    try {
+      const response = await apiService.updateOrdenStatus(
+        selectedOrden._id!, 
+        ordenCompleta ? 'Recepcion' : 'Pendiente'
+      );
+      
+      if (response.success) {
+        setSuccess(`Orden ${ordenCompleta ? 'validada y enviada a cocina' : 'marcada como pendiente'}`);
+        await loadData();
+      } else {
+        setError('Error actualizando el estado de la orden');
+      }
+    } catch (error) {
+      setError('Error actualizando el estado de la orden');
+    }
+  };
+
   if (loading) {
@@ .. @@
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <div className="flex items-center space-x-2 mb-6">
             <Edit3 className="w-5 h-5 text-orange-600" />
-            <h2 className="text-lg font-semibold text-gray-900">Órdenes en Recepción</h2>
+            <h2 className="text-lg font-semibold text-gray-900">Órdenes Editables</h2>
           </div>

           <div className="space-y-4">
             {ordenes.length === 0 ? (
               <div className="text-center py-8">
                 <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
-                <p className="text-gray-500">No hay órdenes en recepción</p>
+                <p className="text-gray-500">No hay órdenes pendientes o en recepción</p>
               </div>
             ) : (
               ordenes.map((orden) => (
@@ .. @@
                       <p className="text-sm font-medium text-green-600">
                         Total: ${orden.total.toFixed(2)}
                       </p>
                     </div>
-                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
+                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
+                      orden.estatus === 'Pendiente' 
+                        ? 'bg-yellow-100 text-yellow-800'
+                        : 'bg-blue-100 text-blue-800'
+                    }`}>
                       {orden.estatus}
                     </span>
                   </div>
@@ .. @@
           {!selectedOrden ? (
             <div className="text-center py-12">
               <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
               <p className="text-gray-500">Selecciona una orden para ver los detalles</p>
             </div>
           ) : (
             <div className="space-y-6">
+              {/* Order Validation Section */}
+              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
+                <h3 className="font-medium text-yellow-900 mb-3">Validación de la Orden</h3>
+                <div className="space-y-3">
+                  <label className="flex items-center">
+                    <input
+                      type="checkbox"
+                      checked={ordenCompleta}
+                      onChange={(e) => setOrdenCompleta(e.target.checked)}
+                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
+                    />
+                    <span className="ml-2 text-sm text-gray-700">
+                      La orden está completa y lista para preparación
+                    </span>
+                  </label>
+                  
+                  <div>
+                    <label className="block text-sm font-medium text-gray-700 mb-2">
+                      Observaciones
+                    </label>
+                    <textarea
+                      value={observaciones}
+                      onChange={(e) => setObservaciones(e.target.value)}
+                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
+                      rows={2}
+                      placeholder="Notas especiales sobre la orden..."
+                    />
+                  </div>
+                  
+                  <button
+                    onClick={handleValidateOrder}
+                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
+                      ordenCompleta 
+                        ? 'bg-green-600 text-white hover:bg-green-700' 
+                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
+                    }`}
+                  >
+                    {ordenCompleta ? 'Enviar a Cocina' : 'Marcar como Pendiente'}
+                  </button>
+                </div>
+              </div>

               {/* Platillos */}