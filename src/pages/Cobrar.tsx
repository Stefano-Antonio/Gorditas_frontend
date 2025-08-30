@@ .. @@
       if (response.success && Array.isArray(response.data)) {
         const ordenesArray: Orden[] = response.data;
         const ordenesMesa = ordenesArray.filter(
           (orden: Orden) =>
             orden.mesa?.toString() === mesa._id?.toString() &&
-            ['Recepcion', 'Preparacion', 'Surtida'].includes(orden.estatus)
+            ['Entregada'].includes(orden.estatus)
         );

         const ordenesConDetalles: OrdenCompleta[] = ordenesMesa.map(orden => ({
@@ .. @@
   const handleFinalizarOrden = async (orden: OrdenCompleta) => {
     setProcessing(true);
     try {
       const response = await apiService.updateOrdenStatus(orden._id?.toString() || '', 'Finalizada');
       if (response.success) {
-        setSuccess('Orden finalizada exitosamente');
+        setSuccess('Pago procesado - Orden finalizada exitosamente');
         if (selectedMesa) {
           await loadOrdenesActivas(selectedMesa);
         }
       } else {
@@ .. @@
           {!selectedMesa ? (
             <div className="text-center py-12">
               <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
               <p className="text-gray-500">Selecciona una mesa para ver las órdenes activas</p>
             </div>
           ) : ordenesActivas?.length === 0 ? (
             <div className="text-center py-12">
               <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
-              <p className="text-gray-500">No hay órdenes activas en esta mesa</p>
+              <p className="text-gray-500">No hay órdenes entregadas pendientes de cobro en esta mesa</p>
             </div>
           ) : (
             <div className="space-y-4">
@@ .. @@
                     <div className="text-right">
                       <p className="text-sm font-medium text-green-600">
                         ${orden.total.toFixed(2)}
                       </p>
-                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
-                        orden.estatus === 'Surtida' ? 'bg-green-100 text-green-800'
-                        : orden.estatus === 'Preparacion' ? 'bg-yellow-100 text-yellow-800'
-                        : 'bg-blue-100 text-blue-800'
-                      }`}>{orden.estatus}</span>
+                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
+                        {orden.estatus}
+                      </span>
                     </div>
                   </div>
                   <div className="flex space-x-2">
@@ .. @@
                     <button onClick={() => handlePrintTicket(orden)} className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors flex items-center justify-center">
                       <Printer className="w-4 h-4 mr-1" /> Imprimir
                     </button>
-                    <button onClick={() => handleFinalizarOrden(orden)} disabled={processing || orden.estatus !== 'Surtida'} className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
-                      <CheckCircle className="w-4 h-4 mr-1" /> Finalizar
+                    <button onClick={() => handleFinalizarOrden(orden)} disabled={processing} className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
+                      <CheckCircle className="w-4 h-4 mr-1" /> Cobrar
                     </button>
                   </div>
                 </div>