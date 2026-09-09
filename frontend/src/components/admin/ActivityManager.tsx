import { useState, useEffect } from 'react';

import { API_URL } from '../../config';

type Activity = {
  id: number;
  name: string;
  description: string;
  type: 'institutional' | 'community';
  image_url: string;
  min_capacity?: number;
  max_capacity?: number;
  event_date?: string;
  cancellation_days_before?: number;
  status?: string;
  default_hours?: number;
  default_beneficiaries?: number;
};

export default function ActivityManager({ token }: { token: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<Partial<Activity> | null>(null);

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/activities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching activities", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta causa?')) return;
    try {
      await fetch(`${API_URL}/api/admin/activities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingActivity?.id ? 'PUT' : 'POST';
    const url = editingActivity?.id
      ? `${API_URL}/api/admin/activities/${editingActivity.id}`
      : `${API_URL}/api/admin/activities`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingActivity)
      });
      if (response.ok) {
        setEditingActivity(null);
        fetchActivities();
      }
    } catch (error) {
      console.error("Error saving activity", error);
    }
  };

  const inputClass = "w-full bg-white border border-[#D8E2F0] rounded-xl px-4 py-2.5 text-[#1A2340] text-sm focus:outline-none focus:border-[#0044B5] focus:ring-2 focus:ring-[#0044B5]/10 transition-all";
  const labelClass = "block text-xs font-bold text-[#4A5568] mb-1.5 uppercase tracking-wide";

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h3 className="font-antonio text-2xl text-[#0044B5] uppercase flex items-center gap-2">
          <span className="divider-gold" />
          Catálogo de Causas
        </h3>
        <button
          onClick={() => setEditingActivity({ type: 'institutional' })}
          className="btn-brand-gold px-5 py-2.5 rounded-full text-sm font-black uppercase shadow-md"
        >
          + Nueva Causa
        </button>
      </div>

      {/* Formulario de edición */}
      {editingActivity && (
        <div className="bg-white rounded-2xl border-2 border-[#0044B5]/30 shadow-lg p-6 animate-fade-in">
          <h4 className="font-antonio text-lg text-[#0044B5] uppercase mb-5">
            {editingActivity.id ? '✏️ Editar Causa' : '✨ Crear Nueva Causa'}
          </h4>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Nombre de la Causa</label>
              <input
                type="text"
                value={editingActivity.name || ''}
                onChange={e => setEditingActivity({ ...editingActivity, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descripción</label>
              <textarea
                value={editingActivity.description || ''}
                onChange={e => setEditingActivity({ ...editingActivity, description: e.target.value })}
                className={`${inputClass} h-24 resize-none`}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Tipo</label>
              <select
                value={editingActivity.type}
                onChange={e => setEditingActivity({ ...editingActivity, type: e.target.value as any })}
                className={inputClass}
              >
                <option value="institutional">Institucional (United Way)</option>
                <option value="community">Comunitaria / Ciudadana</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>URL Imagen (Opcional)</label>
              <input
                type="text"
                value={editingActivity.image_url || ''}
                onChange={e => setEditingActivity({ ...editingActivity, image_url: e.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            {editingActivity.type === 'institutional' && (
              <>
                <div className="md:col-span-2 border-t border-[#D8E2F0] pt-4 mt-2">
                  <p className="text-[#0044B5] font-bold text-sm uppercase tracking-wide">
                    ⚙️ Configuración Institucional y Metas
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Mínimo de Voluntarios</label>
                  <input
                    type="number"
                    value={editingActivity.min_capacity || ''}
                    onChange={e => setEditingActivity({ ...editingActivity, min_capacity: parseInt(e.target.value) || undefined })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Meta Máxima de Voluntarios</label>
                  <input
                    type="number"
                    value={editingActivity.max_capacity || ''}
                    onChange={e => setEditingActivity({ ...editingActivity, max_capacity: parseInt(e.target.value) || undefined })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha del Evento</label>
                  <input
                    type="date"
                    value={editingActivity.event_date || ''}
                    onChange={e => setEditingActivity({ ...editingActivity, event_date: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Días de anticipación para auto-cancelar</label>
                  <input
                    type="number"
                    value={editingActivity.cancellation_days_before || ''}
                    onChange={e => setEditingActivity({ ...editingActivity, cancellation_days_before: parseInt(e.target.value) || undefined })}
                    className={inputClass}
                    placeholder="Ej. 10"
                  />
                </div>
                <div>
                  <label className={labelClass}>Horas de Voluntariado a otorgar</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingActivity.default_hours || ''}
                    onChange={e => setEditingActivity({ ...editingActivity, default_hours: parseFloat(e.target.value) || undefined })}
                    className={`${inputClass} font-bold text-[#FFBA00]`}
                    placeholder="Ej. 4.5"
                  />
                </div>
                <div>
                  <label className={labelClass}>Beneficiarios a impactar por registro</label>
                  <input
                    type="number"
                    value={editingActivity.default_beneficiaries || ''}
                    onChange={e => setEditingActivity({ ...editingActivity, default_beneficiaries: parseInt(e.target.value) || undefined })}
                    className={`${inputClass} font-bold text-[#0044B5]`}
                    placeholder="Ej. 10"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2 flex justify-end gap-3 mt-2 border-t border-[#D8E2F0] pt-4">
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="px-5 py-2.5 text-[#4A5568] hover:text-[#1A2340] font-semibold text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-brand-blue px-6 py-2.5 rounded-xl font-antonio uppercase text-sm tracking-wide"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de actividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activities.map(activity => (
          <div
            key={activity.id}
            className="card-brand overflow-hidden group"
          >
            <div className="h-36 bg-[#EEF2FB] relative overflow-hidden">
              {activity.image_url ? (
                <img
                  src={activity.image_url}
                  alt={activity.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <span className="text-4xl">🖼️</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  activity.type === 'institutional'
                    ? 'bg-[#0044B5] text-white'
                    : 'bg-green-600 text-white'
                }`}>
                  {activity.type === 'institutional' ? 'Institucional' : 'Comunidad'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-base text-[#1A2340] mb-1 truncate group-hover:text-[#0044B5] transition-colors">
                {activity.name}
              </h4>
              <p className="text-[#4A5568] text-xs line-clamp-2 mb-4 h-8">{activity.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-[#D8E2F0]">
                <button
                  onClick={() => setEditingActivity(activity)}
                  className="text-[#0044B5] text-sm hover:text-[#002D7A] font-semibold transition-colors"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="text-red-500 text-sm hover:text-red-700 font-semibold transition-colors"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && !loading && (
        <div className="text-center py-16 text-[#9AA3B4] italic">No hay causas registradas.</div>
      )}
    </div>
  );
}
