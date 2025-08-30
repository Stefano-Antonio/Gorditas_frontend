@@ .. @@
   async updateOrdenStatus(ordenId: string, estatus: string) {
     return this.request(`/ordenes/${ordenId}/estatus`, {
       method: 'PUT',
       body: JSON.stringify({ estatus }),
     });
   }

+  async updateOrden(ordenId: string, orden: any) {
+    return this.request(`/ordenes/${ordenId}`, {
+      method: 'PUT',
+      body: JSON.stringify(orden),
+    });
+  }
+
   // Inventory methods