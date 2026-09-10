import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../../config';

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone?: string;
  plant_phone?: string;
  organization_name?: string;
  plant_name?: string;
  division_name?: string;
  corporate_name?: string;
  total_activities?: number | string;
  role_id: number;
  created_at: string;
  deleted_at: string | null;
};

export default function UserManager({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Controles de filtrado dinámico (TKT-UW-004)
  const [filterSearch, setFilterSearch] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterActivities, setFilterActivities] = useState<'all' | 'with' | 'without'>('all');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, isPurge: boolean) => {
    const message = isPurge
      ? '¿Deseas eliminar permanentemente este registro? Esta acción es irreversible y liberará el correo.'
      : '¿Deseas suspender este usuario?';
    if (!confirm(message)) return;
    try {
      await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  // Filtrado reactivo en memoria
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // 1. Filtro por nombre, correo o empresa
      if (filterSearch.trim()) {
        const query = filterSearch.toLowerCase().trim();
        const fullName = `${user.name} ${user.last_name}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const org = (user.organization_name || user.corporate_name || '').toLowerCase();
        if (!fullName.includes(query) && !email.includes(query) && !org.includes(query)) {
          return false;
        }
      }
      // 2. Filtro por teléfono de planta
      if (filterPhone.trim()) {
        const phoneQuery = filterPhone.toLowerCase().trim();
        const phone = (user.plant_phone || user.phone || '').toLowerCase();
        if (!phone.includes(phoneQuery)) return false;
      }
      // 3. Filtro por actividades realizadas
      const count = Number(user.total_activities) || 0;
      if (filterActivities === 'with' && count === 0) return false;
      if (filterActivities === 'without' && count > 0) return false;

      return true;
    });
  }, [users, filterSearch, filterPhone, filterActivities]);

  const hasActiveFilters = Boolean(filterSearch || filterPhone || filterActivities !== 'all');

  const clearFilters = () => {
    setFilterSearch('');
    setFilterPhone('');
    setFilterActivities('all');
  };

  // Exportación del reporte de voluntarios a CSV
  const exportVolunteersCSV = () => {
    const dataToExport = filteredUsers.length ? filteredUsers : users;
    if (!dataToExport.length) return;

    const headers = [
      'ID',
      'Nombre Completo',
      'Correo Electrónico',
      'Teléfono Planta',
      'Empresa / Corporativo',
      'Planta',
      'División',
      'Total Actividades Realizadas',
      'Fecha Registro',
      'Estado'
    ];

    const rows = dataToExport.map(u => [
      u.id,
      `${u.name} ${u.last_name}`,
      u.email,
      u.plant_phone || u.phone || '',
      u.organization_name || u.corporate_name || '',
      u.plant_name || '',
      u.division_name || '',
      Number(u.total_activities) || 0,
      u.created_at ? new Date(u.created_at).toLocaleDateString('es-MX') : '',
      u.deleted_at ? 'Suspendido' : 'Activo'
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_voluntarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado con Botón de Exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-antonio text-2xl text-[#0044B5] uppercase flex items-center gap-2">
            <span className="divider-gold" />
            Gestión de Usuarios y Reporte de Voluntarios
          </h3>
          <p className="text-[#4A5568] text-sm mt-1">
            Administra voluntarios, supervisa teléfonos de planta y exporta reportes consolidados.
          </p>
        </div>

        <button
          type="button"
          onClick={exportVolunteersCSV}
          disabled={!users.length}
          className="btn-brand-gold text-sm px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap self-start sm:self-auto shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar Voluntarios (CSV)
        </button>
      </div>

      {/* Barra de Filtros Dinámicos (TKT-UW-004) */}
      <div className="bg-white rounded-2xl border border-[#D8E2F0] shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Búsqueda por Nombre / Correo / Empresa */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Buscar Voluntario / Empresa
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre, correo, corporativo..."
                value={filterSearch}
                onChange={e => setFilterSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0044B5] bg-white transition-colors"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filtro por Teléfono de la Planta */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Teléfono de la Planta
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. 614, 656..."
                value={filterPhone}
                onChange={e => setFilterPhone(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0044B5] bg-white transition-colors"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>

          {/* Filtro por Actividades Realizadas */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Actividades Realizadas
            </label>
            <select
              value={filterActivities}
              onChange={e => setFilterActivities(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0044B5] bg-white transition-colors"
            >
              <option value="all">Todas las participaciones</option>
              <option value="with">Con actividades registradas (&gt; 0)</option>
              <option value="without">Sin actividades aún (0)</option>
            </select>
          </div>
        </div>

        {/* Resumen de filtros */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
          <span className="text-slate-600 font-medium">
            Mostrando <strong className="text-[#0044B5]">{filteredUsers.length}</strong> de {users.length} usuarios
            {hasActiveFilters && <span className="text-amber-600 font-semibold ml-1.5">(Filtros activos)</span>}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>&times;</span> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Usuarios con Sticky Header y Columnas de Planta / Actividades */}
      <div className="bg-white rounded-2xl border border-[#D8E2F0] shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[580px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F4F6FA] text-[#4A5568] text-xs uppercase tracking-wider border-b border-[#D8E2F0] sticky top-0 z-10 shadow-xs">
              <tr>
                <th className="px-6 py-4 font-bold bg-[#F4F6FA] whitespace-nowrap">Voluntario / Empresa</th>
                <th className="px-6 py-4 font-bold bg-[#F4F6FA] whitespace-nowrap">Correo</th>
                <th className="px-6 py-4 font-bold bg-[#F4F6FA] whitespace-nowrap">Teléfono Planta</th>
                <th className="px-6 py-4 font-bold bg-[#F4F6FA] whitespace-nowrap">Planta / División</th>
                <th className="px-6 py-4 font-bold bg-[#F4F6FA] text-center whitespace-nowrap">Actividades</th>
                <th className="px-6 py-4 font-bold bg-[#F4F6FA] whitespace-nowrap">Registro</th>
                <th className="px-6 py-4 font-bold bg-[#F4F6FA] whitespace-nowrap">Estado</th>
                <th className="px-6 py-4 font-bold bg-[#F4F6FA] text-right whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8E2F0]">
              {filteredUsers.map(user => {
                const actCount = Number(user.total_activities) || 0;
                return (
                  <tr key={user.id} className="hover:bg-[#F4F6FA] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#1A2340]">
                        {user.name} {user.last_name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {user.organization_name || user.corporate_name || 'Particular'}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest mt-0.5">
                        {user.role_id === 1 ? (
                          <span className="text-[#FFBA00]">Administrador</span>
                        ) : (
                          <span className="text-[#9AA3B4]">Voluntario</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4A5568]">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A2340] font-medium whitespace-nowrap">
                      {user.plant_phone || user.phone ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-700">
                          <span>📞</span> {user.plant_phone || user.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Sin teléfono</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#4A5568]">
                      {user.plant_name ? (
                        <div>
                          <p className="font-semibold text-slate-800">{user.plant_name}</p>
                          {user.division_name && (
                            <p className="text-[11px] text-[#0044B5] font-medium">{user.division_name}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No asignada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black ${
                        actCount > 0
                          ? 'bg-[#0044B5]/10 text-[#0044B5] border border-[#0044B5]/30'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {actCount} {actCount === 1 ? 'actividad' : 'actividades'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#4A5568] whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.deleted_at ? (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-full border border-red-200 animate-pulse">
                          Suspendido
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-200">
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(user.id, !!user.deleted_at)}
                        className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity font-bold px-2 py-1 rounded-lg ${
                          user.deleted_at
                            ? 'text-[#FFBA00] hover:bg-amber-50'
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        {user.deleted_at ? '🗑️ Purgar' : 'Suspender'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="p-10 text-center text-[#9AA3B4] italic">
            No hay otros usuarios registrados en el sistema.
          </div>
        )}

        {users.length > 0 && filteredUsers.length === 0 && !loading && (
          <div className="p-10 text-center text-slate-400">
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-semibold text-sm">No se encontraron usuarios con los filtros aplicados.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 text-xs text-[#0044B5] font-bold hover:underline"
            >
              Restablecer filtros
            </button>
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
