@@ .. @@
// Transactional models
export interface Orden extends BaseEntity {
  mesa: string;
  tipoOrden: string;
  usuario: string;
-  estatus: 'Recepcion' | 'Preparacion' | 'Surtida' | 'Finalizada';
+  estatus: 'Pendiente' | 'Recepcion' | 'Preparacion' | 'Surtida' | 'Entregada' | 'Finalizada';
  total: number;
  fecha: Date;
  subordenes?: string[];
+  observaciones?: string;
+  modificaciones?: number;
+  completaValidacion?: boolean;
 }