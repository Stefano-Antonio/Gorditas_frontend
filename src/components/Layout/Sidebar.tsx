const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Panel Principal', icon: 'Home', path: '/', roles: ['Admin', 'Encargado', 'Mesero', 'Despachador', 'Cocinero'] },
  { id: 'nueva-orden', label: 'Nueva Orden', icon: 'PlusCircle', path: '/nueva-orden', roles: ['Admin', 'Encargado', 'Mesero'] },
  { id: 'editar-orden', label: 'Validar Órdenes', icon: 'Edit3', path: '/editar-orden', roles: ['Admin', 'Encargado', 'Mesero'] },
  { id: 'gestion-ordenes', label: 'Gestión Órdenes', icon: 'BarChart3', path: '/gestion-ordenes', roles: ['Admin', 'Encargado', 'Mesero'] },
  { id: 'surtir-orden', label: 'Cocina', icon: 'ChefHat', path: '/surtir-orden', roles: ['Admin', 'Despachador', 'Cocinero'] },
  { id: 'despachar', label: 'Despachar', icon: 'Truck', path: '/despachar', roles: ['Admin', 'Despachador'] },
  { id: 'recibir-productos', label: 'Recibir Productos', icon: 'Package', path: '/recibir-productos', roles: ['Admin', 'Encargado'] },
  { id: 'cobrar', label: 'Cobrar', icon: 'CreditCard', path: '/cobrar', roles: ['Admin', 'Encargado', 'Mesero'] },
  { id: 'catalogos', label: 'Catálogos', icon: 'Settings', path: '/catalogos', roles: ['Admin', 'Encargado'] },
  { id: 'reportes', label: 'Reportes', icon: 'BarChart3', path: '/reportes', roles: ['Admin', 'Encargado'] },
];