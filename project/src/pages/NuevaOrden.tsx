import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Check,
  ArrowLeft,
  ArrowRight,
  ChefHat
} from 'lucide-react';
import { apiService } from '../services/api';
import { Mesa, Platillo, Guiso, OrderStep } from '../types';

interface PlatilloSeleccionado {
  platillo: Platillo;
  guiso: Guiso;
  cantidad: number;
}

const NuevaOrden: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [nombreSuborden, setNombreSuborden] = useState('');
  const [platillosSeleccionados, setPlatillosSeleccionados] = useState<PlatilloSeleccionado[]>([]);
  
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [guisos, setGuisos] = useState<Guiso[]>([]);
  const [selectedPlatillo, setSelectedPlatillo] = useState<Platillo | null>(null);
  const [selectedGuiso, setSelectedGuiso] = useState<Guiso | null>(null);
  const [cantidad, setCantidad] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps: OrderStep[] = [
    { step: 1, title: 'Seleccionar Mesa', completed: !!selectedMesa },
    { step: 2, title: 'Crear Suborden', completed: !!nombreSuborden },
    { step: 3, title: 'Agregar Platillos', completed: platillosSeleccionados.length > 0 },
    { step: 4, title: 'Confirmar Orden', completed: false },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [mesasResponse, platillosResponse, guisosResponse] = await Promise.all([
        apiService.getCatalog<Mesa>('mesa'),
        apiService.getCatalog<Platillo>('platillo'),
        apiService.getCatalog<Guiso>('guiso'),
      ]);

      setMesas(Array.isArray(mesasResponse.data) ? mesasResponse.data : []);
      setPlatillos(Array.isArray(platillosResponse.data) ? platillosResponse.data : []);
      setGuisos(Array.isArray(guisosResponse.data) ? guisosResponse.data : []);
    } catch (error) {
      setError('Error cargando datos iniciales');
      setMesas([]);
      setPlatillos([]);
      setGuisos([]);
    }
  };

  const handleAddPlatillo = () => {
    if (!selectedPlatillo || !selectedGuiso) {
      setError('Selecciona un platillo y guiso');
      return;
    }

    const nuevo: PlatilloSeleccionado = {
      platillo: selectedPlatillo,
      guiso: selectedGuiso,
      cantidad,
    };

    setPlatillosSeleccionados(prev => [...prev, nuevo]);
    setSelectedPlatillo(null);
    setSelectedGuiso(null);
    setCantidad(1);
  };

  const handleRemovePlatillo = (index: number) => {
    setPlatillosSeleccionados(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitOrder = async () => {
  if (!selectedMesa || !nombreSuborden || platillosSeleccionados.length === 0) {
    setError('Completa todos los campos');
    return;
  }

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const total = platillosSeleccionados.reduce(
      (sum, item) => sum + (item.platillo.precio * item.cantidad), 
      0
    );

    // 1. Crear la orden
    const ordenData = {
      mesa: selectedMesa._id,
      tipoOrden: 'mesa',
      total,
    };
    const ordenResponse = await apiService.createOrden(ordenData);
    // Add type assertion so TypeScript knows _id exists
    const ordenDataWithId = ordenResponse.data as { _id: string } | undefined;
    if (!ordenResponse.success || !ordenDataWithId?._id) {
      setError('Error creando orden');
      setLoading(false);
      return;
    }
    const ordenId = ordenDataWithId._id;

    // 2. Crear la suborden
    const subordenData = { nombre: nombreSuborden };
    const subordenResponse = await apiService.addSuborden(ordenId, subordenData);
    if (
      !subordenResponse.success ||
      !(subordenResponse.data && (subordenResponse.data as { _id?: string })._id)
    ) {
      setError('Error creando suborden');
      setLoading(false);
      return;
    }
    const subordenId = (subordenResponse.data as { _id: string })._id;

    // 3. Agregar platillos
    for (const item of platillosSeleccionados) {
      const platilloData = {
        platillo: item.platillo._id,
        guiso: item.guiso._id,
        cantidad: item.cantidad,
        precio: item.platillo.precio,
      };
      const platilloResponse = await apiService.addPlatillo(subordenId, platilloData);
      if (!platilloResponse.success) {
        setError('Error agregando platillo');
        setLoading(false);
        return;
      }
    }

    setSuccess('Orden creada exitosamente');
    setTimeout(() => {
      setCurrentStep(1);
      setSelectedMesa(null);
      setNombreSuborden('');
      setPlatillosSeleccionados([]);
      setSuccess('');
      setError('');
      loadInitialData(); // <-- Recarga los datos iniciales
    }, 2000);

  } catch (error) {
    setError('Error creando la orden');
  } finally {
    setLoading(false);
  }
};


  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return !!selectedMesa;
      case 2: return !!nombreSuborden;
      case 3: return platillosSeleccionados.length > 0;
      default: return false;
    }
  };

  const getTotalOrden = () => {
    return platillosSeleccionados.reduce(
      (sum, item) => sum + (item.platillo.precio * item.cantidad),
      0
    );
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Orden Creada!</h2>
          <p className="text-gray-600">{success}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Orden</h1>
        <p className="text-gray-600">Crea una nueva orden paso a paso</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.step === currentStep
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : step.completed
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {step.completed && step.step !== currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.step
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step.step === currentStep
                    ? 'text-orange-600'
                    : step.completed
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Step 1: Select Table */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Seleccionar Mesa</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mesas.filter(mesa => mesa.activo).map((mesa) => (
                <button
                  key={mesa._id}
                  onClick={() => setSelectedMesa(mesa)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    selectedMesa?._id === mesa._id
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  <div className="text-lg font-semibold">Mesa {mesa.numero}</div>
                  <div className="text-sm text-gray-600">{mesa.capacidad} personas</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Create Suborder */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Crear Suborden</h2>
            <div className="mb-4">
              <p className="text-gray-600">Mesa seleccionada: <span className="font-medium">Mesa {selectedMesa?.numero}</span></p>
            </div>
            <div>
              <label htmlFor="nombreSuborden" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Suborden
              </label>
              <input
                id="nombreSuborden"
                type="text"
                value={nombreSuborden}
                onChange={(e) => setNombreSuborden(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ej: Orden principal, Entrada, Postres, etc."
              />
            </div>
          </div>
        )}

        {/* Step 3: Add Dishes */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Agregar Platillos</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Dish Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platillo
                  </label>
                  <select
                    value={selectedPlatillo?._id || ''}
                    onChange={(e) => {
                      const platillo = platillos.find(p => p._id === e.target.value);
                      setSelectedPlatillo(platillo || null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Seleccionar platillo</option>
                    {platillos.filter(p => p.activo).map((platillo) => (
                      <option key={platillo._id} value={platillo._id}>
                        {platillo.nombre} - ${platillo.precio}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guiso
                  </label>
                  <select
                    value={selectedGuiso?._id || ''}
                    onChange={(e) => {
                      const guiso = guisos.find(g => g._id === e.target.value);
                      setSelectedGuiso(guiso || null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Seleccionar guiso</option>
                    {guisos.filter(g => g.activo).map((guiso) => (
                      <option key={guiso._id} value={guiso._id}>
                        {guiso.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">{cantidad}</span>
                    <button
                      type="button"
                      onClick={() => setCantidad(cantidad + 1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddPlatillo}
                  disabled={!selectedPlatillo || !selectedGuiso}
                  className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Agregar Platillo
                </button>
              </div>

              {/* Selected Dishes List */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Platillos Seleccionados ({platillosSeleccionados.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {platillosSeleccionados.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.platillo.nombre}</h4>
                        <p className="text-sm text-gray-600">
                          {item.guiso.nombre} • Cantidad: {item.cantidad}
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          ${(item.platillo.precio * item.cantidad).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemovePlatillo(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {platillosSeleccionados.length > 0 && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-orange-600">
                        ${getTotalOrden().toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm Order */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirmar Orden</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Resumen de la Orden</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Mesa:</span>
                    <span className="ml-2 font-medium">Mesa {selectedMesa?.numero}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Suborden:</span>
                    <span className="ml-2 font-medium">{nombreSuborden}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Platillos:</span>
                    <span className="ml-2 font-medium">{platillosSeleccionados.length} items</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-2 font-medium text-orange-600">${getTotalOrden().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Detalle de Platillos</h4>
                <div className="space-y-2">
                  {platillosSeleccionados.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.cantidad}x {item.platillo.nombre} ({item.guiso.nombre})</span>
                      <span className="font-medium">${(item.platillo.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <ChefHat className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Creando Orden...' : 'Confirmar y Crear Orden'}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </button>

          {currentStep < 4 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNext()}
              className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuevaOrden;