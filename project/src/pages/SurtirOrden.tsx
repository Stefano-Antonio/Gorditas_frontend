import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Timer
} from 'lucide-react';
import { apiService } from '../services/api';
import { Orden, Mesa } from '../types';

const SurtirOrden: React.FC = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
    // Set up polling for real-time updates
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [ordenesRes, mesasRes] = await Promise.all([
        apiService.getOrdenes(),
        apiService.getCatalog<Mesa>('mesa')
      ]);

      if (ordenesRes.success) {
        const ordenesArray = Array.isArray(ordenesRes.data) ? ordenesRes.data : [];
        const ordenesPreparacion = ordenesArray.filter((orden: Orden) => 
          orden.estatus === 'Preparacion'
        );
        setOrdenes(ordenesPreparacion);
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

  const handleSurtirOrden = async (ordenId: string) => {
    setUpdating(ordenId);
    setError('');
    
    try {
      const response = await apiService.updateOrdenStatus(ordenId, 'Surtida');
      
      if (response.success) {
        setSuccess('Orden surtida exitosamente');
        await loadData(); // Refresh the list
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Error al surtir la orden');
      }
    } catch (error) {
      setError('Error al surtir la orden');
    } finally {
      setUpdating(null);
    }
  };

  const getMesaInfo = (mesaId: string) => {
    return mesas.find(mesa => mesa._id === mesaId);
  };

  const getTimeElapsed = (fecha: Date) => {
    const now = new Date();
    const orderTime = new Date(fecha);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const getPriorityColor = (fecha: Date) => {
    const now = new Date();
    const orderTime = new Date(fecha);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes > 45) return 'border-red-500 bg-red-50';
    if (diffInMinutes > 30) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
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
          <h1 className="text-3xl font-bold text-gray-900">Surtir Órdenes</h1>
          <p className="text-gray-600 mt-1">Gestiona las órdenes en preparación</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">
                {ordenes.length} órdenes en preparación
              </span>
            </div>
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
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No hay órdenes en preparación</h2>
            <p className="text-gray-600">Todas las órdenes están al día</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ordenes.map((orden) => {
            const mesa = getMesaInfo(orden.mesa);
            const timeElapsed = getTimeElapsed(orden.fecha);
            const priorityColor = getPriorityColor(orden.fecha);
            
            return (
              <div
                key={orden._id}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-md ${priorityColor}`}
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
                        {mesa?.capacidad} personas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Timer className="w-4 h-4" />
                      <span>{timeElapsed}</span>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      {orden.estatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${orden.total.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hora de orden:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(orden.fecha).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {orden.subordenes && orden.subordenes.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subórdenes:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {orden.subordenes.length} items
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSurtirOrden(orden._id!)}
                  disabled={updating === orden._id}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {updating === orden._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Surtiendo...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Marcar como Surtida
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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