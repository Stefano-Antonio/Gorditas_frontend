@@ .. @@
  const [selectedGuiso, setSelectedGuiso] = useState<Guiso | null>(null);
  const [cantidad, setCantidad] = useState(1);
+  const [observaciones, setObservaciones] = useState('');
+  const [ordenCompleta, setOrdenCompleta] = useState(false);
   
   const [loading, setLoading] = useState(false);
@@ .. @@
   const steps: OrderStep[] = [
     { step: 1, title: 'Seleccionar Mesa', completed: !!selectedMesa },
     { step: 2, title: 'Crear Suborden', completed: !!nombreSuborden },
     { step: 3, title: 'Agregar Platillos', completed: platillosSeleccionados.length > 0 },
-    { step: 4, title: 'Confirmar Orden', completed: false },
+    { step: 4, title: 'Validar y Confirmar', completed: false },
   ];
@@ .. @@
     const total = platillosSeleccionados.reduce(
       (sum, item) => sum + (item.platillo.precio * item.cantidad), 
       0
     );

+    // Determinar el estado inicial basado en si la orden está completa
+    const estatusInicial = ordenCompleta ? 'Recepcion' : 'Pendiente';
+
     // 1. Crear la orden
     const ordenData = {
       mesa: selectedMesa._id,
       tipoOrden: 'mesa',
       total,
+      estatus: estatusInicial,
+      observaciones,
+      completaValidacion: ordenCompleta,
     };
@@ .. @@
     setSuccess('Orden creada exitosamente');
     setTimeout(() => {
       setCurrentStep(1);
       setSelectedMesa(null);
       setNombreSuborden('');
       setPlatillosSeleccionados([]);
+      setObservaciones('');
+      setOrdenCompleta(false);
       setSuccess('');
       setError('');
       loadInitialData(); // <-- Recarga los datos iniciales
@@ .. @@
         {/* Step 4: Confirm Order */}
         {currentStep === 4 && (
           <div>
-            <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirmar Orden</h2>
+            <h2 className="text-xl font-semibold text-gray-900 mb-6">Validar y Confirmar Orden</h2>
             
             <div className="space-y-6">
+              {/* Order Validation */}
+              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
+                <h3 className="font-medium text-yellow-900 mb-4">Validación de la Orden</h3>
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
+                      Observaciones (opcional)
+                    </label>
+                    <textarea
+                      value={observaciones}
+                      onChange={(e) => setObservaciones(e.target.value)}
+                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
+                      rows={3}
+                      placeholder="Notas especiales sobre la orden..."
+                    />
+                  </div>
+                </div>
+              </div>
+
               <div className="bg-gray-50 p-6 rounded-lg">
@@ .. @@
                   <div>
                     <span className="text-gray-600">Total:</span>
                     <span className="ml-2 font-medium text-orange-600">${getTotalOrden().toFixed(2)}</span>
                   </div>
+                  <div>
+                    <span className="text-gray-600">Estado inicial:</span>
+                    <span className={`ml-2 font-medium ${ordenCompleta ? 'text-green-600' : 'text-yellow-600'}`}>
+                      {ordenCompleta ? 'Recepción (Lista para cocina)' : 'Pendiente (Requiere validación)'}
+                    </span>
+                  </div>
                 </div>
               </div>
@@ .. @@
               <button
                 onClick={handleSubmitOrder}
                 disabled={loading}
-                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
+                className={`w-full px-6 py-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center ${
+                  ordenCompleta 
+                    ? 'bg-green-600 text-white hover:bg-green-700' 
+                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
+                }`}
               >
                 {loading ? (
                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                 ) : (
                   <ChefHat className="w-5 h-5 mr-2" />
                 )}
-                {loading ? 'Creando Orden...' : 'Confirmar y Crear Orden'}
+                {loading ? 'Creando Orden...' : (ordenCompleta ? 'Enviar a Cocina' : 'Guardar como Pendiente')}
               </button>
             </div>
           </div>