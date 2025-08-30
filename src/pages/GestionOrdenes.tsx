import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Edit3, 
  CheckCircle, 
  XCircle,
  Clock,
  Users,
  AlertTriangle
} from 'lucide-react';
import { apiService } from '../services/api';
import { Orden, Mesa } from '../types';

const GestionOrdenes: React.FC = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
    // Polling for real-time updates
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [ordenesRes, mesasRes] = await Promise.all([
        apiService.getOrdenes(),
        apiService.getCatalog<Mesa>('mesa')
      ]);

      if (ordenesRes.success) {
        const ordenesArray: Orden[] = Array.isArray(ordenesRes.data) ? ordenesRes.data : [];
        // Show all orders except finalized ones
        const ordenesActivas = ordenesArray.filter((orden: Orden) => 
          orden.estatus !== 'Finalizada'
        );
        setOrdenes(ordenesActivas);
      }

      if (mesasRes.success) {
        setMesas(mesasRes.data || []);
      }
    } catch (error) {
      setError('Error cargando órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orden: Orden) => {
    setSelectedOrden(orden);
    setObservaciones(orden.observaciones || '');
    setShowModal(true);
  };

  const handleUpdateStatus = async (ordenId: string, nuevoEstatus: string) => {
    setUpdating(ordenId);
    try {
      const response = await apiService.updateOrdenStatus(ordenId, nuevoEstatus);
      
      if (response.success) {
        setSuccess(`Orden actualizada a ${nuevoEstatus}`);
        await loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Error actualizando la orden');
      }
    } catch (error) {
      setError('Error actualizando la orden');
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateObservations = async () => {
    if (!selectedOrden) return;

    try {
      const response = await apiService.updateOrden(selectedOrden._id!, {
        ...selectedOrden,
        observaciones
      });
      
      if (response.success) {
        setSuccess('Observaciones actualizadas');
        setShowModal(false);
        await loadData();
      } else {
        setError('Error actualizando observaciones');
      }
    } catch (error) {
      setError('Error actualizando observaciones');
    }
  };

  const getMesaInfo = (mesaId: string) => {
    return mesas.find(mesa => mesa._id === mesaId);
  };

  const getStatusColor = (estatus: string) => {
    switch (estatus) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Recepcion':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparacion':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Surtida':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Entregada':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pendiente':
        return 'Recepcion';
      case 'Recepcion':
        return 'Preparacion';
      case 'Preparacion':
        return 'Surtida';
      case 'Surtida':
        return 'Entregada';
      case 'Entregada':
        return 'Finalizada';
      default:
        return null;
    }
  };

  const getActionLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pendiente':
        return 'Enviar a Cocina';
      case 'Recepcion':
        return 'Iniciar Preparación';
      case 'Preparacion':
        return 'Marcar Surtida';
      case 'Surtida':
        return 'Entregar';
      case 'Entregada':
        return 'Cobrar';
      default:
        return 'Actualizar';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Órdenes</h1>
          <p className="text-gray-600 mt-1">Monitorea y gestiona todas las órdenes activas</p>
        </div>
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              {ordenes.length} órdenes activas
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {ordenes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No hay órdenes activas</h2>
            <p className="text-gray-600">Todas las órdenes han sido procesadas</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ordenes.map((orden) => {
            const mesa = getMesaInfo(orden.mesa);
            const nextStatus = getNextStatus(orden.estatus);
            
            return (
              <div
                key={orden._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Mesa {mesa?.numero || orden.mesa}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(orden.fecha).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewOrder(orden)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${orden.total.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estado:</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(orden.estatus)}`}>
                      {orden.estatus}
                    </span>
                  </div>

                  {orden.observaciones && (
                    <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                      <p className="text-xs text-yellow-800">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {orden.observaciones}
                      </p>
                    </div>
                  )}
                </div>

                {nextStatus && (
                  <button
                    onClick={() => handleUpdateStatus(orden._id!, nextStatus)}
                    disabled={updating === orden._id}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {updating === orden._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {getActionLabel(orden.estatus)}
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrden && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles - Mesa {getMesaInfo(selectedOrden.mesa)?.numero}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Orden ID:</span>
                  <span className="ml-2 font-medium">#{selectedOrden._id?.slice(-6)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <span className="ml-2 font-medium text-green-600">${selectedOrden.total.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrden.estatus)}`}>
                    {selectedOrden.estatus}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Fecha:</span>
                  <span className="ml-2 font-medium">
                    {new Date(selectedOrden.fecha).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Agregar observaciones sobre la orden..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleUpdateObservations}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Actualizar Observaciones
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estados de la Orden</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
              Pendiente
            </span>
            <span className="text-sm text-gray-600">Requiere validación</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Recepción
            </span>
            <span className="text-sm text-gray-600">Lista para cocina</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 border border-orange-200">
              Preparación
            </span>
            <span className="text-sm text-gray-600">En cocina</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
              Surtida
            </span>
            <span className="text-sm text-gray-600">Lista para entregar</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Entregada
            </span>
            <span className="text-sm text-gray-600">Pendiente de cobro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionOrdenes;