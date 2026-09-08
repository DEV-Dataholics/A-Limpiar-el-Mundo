import { useState, useEffect } from 'react';

import { API_URL } from '../../config';

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role_id: number;
  created_at: string;
  deleted_at: string | null;
};

export default function UserManager({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
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

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h3 className="font-antonio text-2xl text-[#0044B5] uppercase flex items-center gap-2">
          <span className="divider-gold" />
          Gestión de Usuarios y Voluntarios
        </h3>
        <p className="text-[#4A5568] text-sm mt-1">
          Administra los voluntarios registrados en la plataforma.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D8E2F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F4F6FA] text-[#4A5568] text-xs uppercase tracking-wider border-b border-[#D8E2F0]">
              <tr>
                <th className="px-6 py-4 font-bold">Nombre Completo</th>
                <th className="px-6 py-4 font-bold">Correo</th>
                <th className="px-6 py-4 font-bold">Fecha Registro</th>
                <th className="px-6 py-4 font-bold">Estado</th>
                <th className="px-6 py-4 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8E2F0]">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-[#F4F6FA] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#1A2340]">
                      {user.name} {user.last_name}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest">
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
                  <td className="px-6 py-4 text-sm text-[#4A5568]">
                    {new Date(user.created_at).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user.id, !!user.deleted_at)}
                      className={`text-sm opacity-0 group-hover:opacity-100 transition-opacity font-bold ${
                        user.deleted_at
                          ? 'text-[#FFBA00] hover:text-[#CC9400]'
                          : 'text-red-500 hover:text-red-700'
                      }`}
                    >
                      {user.deleted_at ? '🗑️ Purgar Permanente' : 'Suspender / Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="p-10 text-center text-[#9AA3B4] italic">
            No hay otros usuarios registrados en el sistema.
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
