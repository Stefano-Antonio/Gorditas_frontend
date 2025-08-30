@@ .. @@
         const pendientes = ordenes.filter((orden: Orden) => 
-          ['Recepcion', 'Preparacion'].includes(orden.estatus)
+          ['Pendiente', 'Recepcion', 'Preparacion', 'Surtida', 'Entregada'].includes(orden.estatus)
         );

         setStats(prev => ({
@@ .. @@
   const getStatusColor = (estatus: string) => {
     switch (estatus) {
+      case 'Pendiente':
+        return 'bg-yellow-100 text-yellow-800';
       case 'Recepcion':
         return 'bg-blue-100 text-blue-800';
       case 'Preparacion':
         return 'bg-yellow-100 text-yellow-800';
       case 'Surtida':
         return 'bg-green-100 text-green-800';
+      case 'Entregada':
+        return 'bg-purple-100 text-purple-800';
       case 'Finalizada':
         return 'bg-gray-100 text-gray-800';
       default: