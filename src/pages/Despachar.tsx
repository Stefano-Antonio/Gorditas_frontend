@@ .. @@
   const handleCompleteDispatch = async () => {
     if (!selectedOrden) return;

     setDispatching(true);
     try {
-      const response = await apiService.updateOrdenStatus(selectedOrden._id!, 'Finalizada');
+      const response = await apiService.updateOrdenStatus(selectedOrden._id!, 'Entregada');
       
       if (response.success) {
-        setSuccess('Orden despachada exitosamente');
+        setSuccess('Orden entregada exitosamente - Lista para cobro');
         setSelectedOrden(null);
         await loadData();
       } else {
@@ .. @@
                     <CheckCircle className="w-4 h-4 mr-2" />
-                    Completar Despacho
+                    Entregar al Cliente
                   </>
                 )}
               </button>
@@ .. @@
                 <h3 className="font-medium text-gray-900 mb-2">Resumen de la Orden</h3>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <span className="text-gray-600">Mesa:</span>
                     <span className="ml-2 font-medium">{getMesaInfo(selectedOrden.mesa)?.numero}</span>
                   </div>
                   <div>
                     <span className="text-gray-600">Total:</span>
                     <span className="ml-2 font-medium text-green-600">${selectedOrden.total.toFixed(2)}</span>
                   </div>
                   <div>
                     <span className="text-gray-600">Hora:</span>
                     <span className="ml-2 font-medium">
                       {new Date(selectedOrden.fecha).toLocaleTimeString('es-ES', {
                         hour: '2-digit',
                         minute: '2-digit'
                       })}
                     </span>
                   </div>
                   <div>
                     <span className="text-gray-600">Estado:</span>
                     <span className="ml-2 font-medium">{selectedOrden.estatus}</span>
                   </div>
+                  {selectedOrden.observaciones && (
+                    <div className="col-span-2">
+                      <span className="text-gray-600">Observaciones:</span>
+                      <span className="ml-2 font-medium">{selectedOrden.observaciones}</span>
+                    </div>
+                  )}
                 </div>
               </div>
@@ .. @@
                 <div className="flex items-center space-x-2 mb-2">
                   <Clock className="w-5 h-5 text-blue-600" />
                   <h3 className="font-medium text-blue-900">Estado de Entrega</h3>
                 </div>
                 <p className="text-sm text-blue-700">
                   {isOrderReadyForDispatch(selectedOrden)
-                    ? 'Todos los items han sido entregados. La orden está lista para completar el despacho.'
-                    : 'Marca todos los items como entregados para completar el despacho.'
+                    ? 'Todos los items han sido preparados. La orden está lista para entregar al cliente.'
+                    : 'Marca todos los items como preparados para poder entregar la orden.'
                   }
                 </p>
               </div>