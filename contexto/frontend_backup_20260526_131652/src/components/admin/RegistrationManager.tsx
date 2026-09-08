import { useState, useEffect } from 'react';

import { API_URL } from '../../config';

type Registration = {
  id: number;
  user_id: number;
  user_name: string;
  user_last_name: string;
  user_email: string;
  activity_name: string;
  status: 'pending' | 'approved' | 'cancelled';
  duration_hours: number;
  beneficiaries_count: number;
  created_at: string;
  description: string;
};

export default function RegistrationManager({ token }: { token: string }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRegistrations(); }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/registrations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await fetch(`${API_URL}/api/admin/registrations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchRegistrations();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Deseas eliminar esta movilización permanentemente?')) return;
    try {
      await fetch(`${API_URL}/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchRegistrations();
    } catch (error) {
      console.error("Error deleting registration", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h3 className="font-antonio text-2xl text-[#0044B5] uppercase flex items-center gap-2">
          <span className="divider-gold" />
          Gestión de Movilizaciones e Impacto
        </h3>
        <p className="text-[#4A5568] text-sm mt-1">
          Aprueba, rechaza o elimina los registros de voluntariado.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D8E2F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F4F6FA] text-[#4A5568] text-xs uppercase tracking-wider border-b border-[#D8E2F0]">
              <tr>
                <th className="px-6 py-4 font-bold">Voluntario</th>
                <th className="px-6 py-4 font-bold">Causa</th>
                <th className="px-6 py-4 font-bold">Impacto</th>
                <th className="px-6 py-4 font-bold">Estado</th>
                <th className="px-6 py-4 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8E2F0]">
              {registrations.map(reg => (
                <tr key={reg.id} className="hover:bg-[#F4F6FA] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#1A2340]">{reg.user_name} {reg.user_last_name}</div>
                    <div className="text-xs text-[#4A5568]">{reg.user_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4A5568]">
                    {reg.activity_name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-black text-[#0044B5]">{reg.duration_hours}h</div>
                    <div className="text-xs text-[#FFBA00] font-bold">{reg.beneficiaries_count} ben.</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      reg.status === 'approved'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : reg.status === 'pending'
                        ? 'bg-[#FFBA00]/15 text-[#8A6400] border-[#FFBA00]/40'
                        : 'bg-red-100 text-red-700 border-red-300'
                    }`}>
                      {reg.status === 'approved' ? 'Aprobado'
                        : reg.status === 'pending' ? 'Pendiente'
                        : 'Rechazado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {reg.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(reg.id, 'approved')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 p-1.5 rounded-lg transition-colors"
                            title="Aprobar"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(reg.id, 'cancelled')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded-lg transition-colors"
                            title="Rechazar"
                          >
                            ❌
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="bg-[#F4F6FA] hover:bg-[#D8E2F0] text-[#4A5568] p-1.5 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {registrations.length === 0 && !loading && (
          <div className="p-10 text-center text-[#9AA3B4] italic">
            No hay registros de movilización por el momento.
          </div>
        )}

        {loading && (
          <div className="p-10 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#0044B5] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
