@@ .. @@
       if (ordenesRes.success) {
         const ordenesArray = Array.isArray(ordenesRes.data) ? ordenesRes.data : [];
-        const ordenesPreparacion = ordenesArray.filter((orden: Orden) => 
-          orden.estatus === 'Preparacion'
+        const ordenesParaCocina = ordenesArray.filter((orden: Orden) => 
+          ['Recepcion', 'Preparacion'].includes(orden.estatus)
         );
-        setOrdenes(ordenesPreparacion);
+        setOrdenes(ordenesParaCocina);
       }
@@ .. @@
   const handleSurtirOrden = async (ordenId: string) => {
     setUpdating(ordenId);
     setError('');
     
     try {
       const response = await apiService.updateOrdenStatus(ordenId, 'Surtida');
       
       if (response.success) {
-        setSuccess('Orden surtida exitosamente');
+        setSuccess('Orden surtida exitosamente - Lista para despacho');
         await loadData(); // Refresh the list
         
         // Clear success message after 3 seconds
@@ .. @@
          <div>
           <h1 className="text-3xl font-bold text-gray-900">Surtir Órdenes</h1>
-          <p className="text-gray-600 mt-1">Gestiona las órdenes en preparación</p>
+          <p className="text-gray-600 mt-1">Prepara las órdenes recibidas de los meseros</p>
         </div>
         <div className="flex items-center space-x-4">
           <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
             <div className="flex items-center space-x-2">
               <Clock className="w-5 h-5 text-orange-600" />
               <span className="text-sm font-medium text-gray-700">
-                {ordenes.length} órdenes en preparación
+                {ordenes.length} órdenes para preparar
               </span>
             </div>
           </div>
@@ .. @@
       {ordenes.length === 0 ? (
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
           <div className="text-center">
             <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
-            <h2 className="text-xl font-semibold text-gray-900 mb-2">No hay órdenes en preparación</h2>
-            <p className="text-gray-600">Todas las órdenes están al día</p>
+            <h2 className="text-xl font-semibold text-gray-900 mb-2">No hay órdenes para preparar</h2>
+            <p className="text-gray-600">Todas las órdenes han sido procesadas</p>
           </div>
         </div>
       ) : (
@@ .. @@
                     <span className="text-lg font-semibold text-green-600">
                       ${orden.total.toFixed(2)}
                     </span>
-                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
+                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
+                      orden.estatus === 'Recepcion' 
+                        ? 'bg-blue-100 text-blue-800'
+                        : 'bg-yellow-100 text-yellow-800'
+                    }`}>
                       {orden.estatus}
                     </span>
                   </div>
@@ .. @@
                   ) : (
                     <>
                       <CheckCircle className="w-5 h-5 mr-2" />
-                      Marcar como Surtida
+                      {orden.estatus === 'Recepcion' ? 'Iniciar Preparación' : 'Marcar como Surtida'}
                     </>
                   )}
                 </button>
@@ .. @@
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Código de Prioridad</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="flex items-center space-x-3">
             <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded"></div>
             <span className="text-sm text-gray-700">Normal (menos de 30 min)</span>
           </div>
           <div className="flex items-center space-x-3">
             <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-500 rounded"></div>
             <span className="text-sm text-gray-700">Atención (30-45 min)</span>
           </div>
           <div className="flex items-center space-x-3">
             <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded"></div>
             <span className="text-sm text-gray-700">Urgente (más de 45 min)</span>
           </div>
         </div>
       </div>
     </div>
   );
 };

 export default SurtirOrden;