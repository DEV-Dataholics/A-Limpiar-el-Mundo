import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { API_URL } from '../../config';

interface Registration {
  id: number;
  user_id: number;
  user_name: string;
  user_last_name: string;
  user_email: string;
  user_phone?: string;
  user_organization?: string;
  user_municipality?: string;
  user_state?: string;
  activity_id: number;
  activity_name: string;
  custom_activity_name?: string;
  activity_type?: string;
  group_name?: string;
  location_name?: string;
  location_address?: string;
  execution_date?: string;
  scheduled_date?: string;
  duration_hours: number;
  volunteer_count?: number;
  beneficiaries_count: number;
  description?: string;
  evidence_links?: string;
  testimonials?: string;
  status: 'pending' | 'approved' | 'cancelled';
  created_at: string;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    badgeCls: 'bg-amber-100 text-amber-800 border-amber-300',
    tabCls: 'border-amber-500 text-amber-700 bg-amber-50/50',
    icon: '⏳'
  },
  approved: {
    label: 'Aprobado',
    badgeCls: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    tabCls: 'border-emerald-500 text-emerald-700 bg-emerald-50/50',
    icon: '✅'
  },
  cancelled: {
    label: 'Rechazado',
    badgeCls: 'bg-red-100 text-red-700 border-red-300',
    tabCls: 'border-red-500 text-red-700 bg-red-50/50',
    icon: '❌'
  },
};

// ─── Modal: Ficha de Validación de la Actividad Registrada ─────────────────────
function RegistrationDetailModal({
  record,
  onClose,
  onUpdateStatus,
  onDelete
}: {
  record: Registration;
  onClose: () => void;
  onUpdateStatus: (id: number, status: 'approved' | 'cancelled') => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const st = STATUS_CONFIG[record.status] || { label: record.status, badgeCls: 'bg-slate-100 text-slate-700 border-slate-200', icon: '📋' };
  const volCount = record.volunteer_count || 1;
  const durHours = parseFloat(String(record.duration_hours || 0));
  const totalCalculatedHours = volCount * durHours;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleStatusChange = async (newStatus: 'approved' | 'cancelled') => {
    setUpdating(true);
    await onUpdateStatus(record.id, newStatus);
    setUpdating(false);
    onClose();
  };

  const handleDeleteRecord = async () => {
    if (!confirm('¿Estás seguro de eliminar este registro permanentemente?')) return;
    setUpdating(true);
    await onDelete(record.id);
    setUpdating(false);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0a1432]/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Fijo */}
        <div className="bg-[#0044B5] px-6 py-5 rounded-t-2xl flex justify-between items-start flex-shrink-0">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">
              Validación de Movilización #{record.id}
            </p>
            <h2 className="text-white font-antonio text-2xl leading-tight">
              {record.custom_activity_name || record.activity_name || 'Actividad de Voluntariado'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Modalidad: {record.activity_type || (record.activity_id === 9 ? 'Movilización Propia' : 'Oficial')}
              </span>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${st.badgeCls}`}>
                {st.icon} {st.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors ml-4 mt-1 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Bloque 1: Quién reporta */}
          <section>
            <h3 className="text-[10px] font-black text-[#9AA3B4] uppercase tracking-widest mb-3">
              Información de quien reporta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#F4F6FA] rounded-xl p-3.5">
                <p className="text-[10px] text-[#9AA3B4] uppercase font-bold mb-0.5">Voluntario</p>
                <p className="font-bold text-[#1A2340] text-sm">{record.user_name} {record.user_last_name}</p>
                <p className="text-xs text-[#4A5568] mt-0.5">{record.user_email}</p>
                {record.user_phone && (
                  <p className="text-xs text-[#0044B5] font-semibold mt-0.5">📱 {record.user_phone}</p>
                )}
              </div>
              <div className="bg-[#F4F6FA] rounded-xl p-3.5">
                <p className="text-[10px] text-[#9AA3B4] uppercase font-bold mb-0.5">Organización o Empresa</p>
                <p className="font-bold text-[#1A2340] text-sm">
                  {record.group_name || record.user_organization || 'Particular / Sin especificar'}
                </p>
                <p className="text-xs text-[#9AA3B4] mt-0.5">
                  Ubicación: {record.user_municipality || 'N/D'}, {record.user_state || 'N/D'}
                </p>
              </div>
              <div className="bg-[#F4F6FA] rounded-xl p-3.5">
                <p className="text-[10px] text-[#9AA3B4] uppercase font-bold mb-0.5">Lugar de la Actividad</p>
                <p className="font-bold text-[#1A2340] text-sm">{record.location_name || 'No especificado'}</p>
                {record.location_address && (
                  <p className="text-xs text-[#4A5568] mt-0.5">{record.location_address}</p>
                )}
              </div>
              <div className="bg-[#F4F6FA] rounded-xl p-3.5">
                <p className="text-[10px] text-[#9AA3B4] uppercase font-bold mb-0.5">Fecha de Realización</p>
                <p className="font-bold text-[#1A2340] text-sm">
                  {record.execution_date || record.scheduled_date
                    ? new Date(record.execution_date || record.scheduled_date || '').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Sin fecha'}
                </p>
                <p className="text-xs text-[#9AA3B4] mt-0.5">
                  Registrado el: {new Date(record.created_at).toLocaleDateString('es-MX')}
                </p>
              </div>
            </div>
          </section>

          {/* Bloque 2: Métricas e Impacto */}
          <section>
            <h3 className="text-[10px] font-black text-[#9AA3B4] uppercase tracking-widest mb-3">
              Métricas e Impacto Reportado
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0044B5]/10 border border-[#0044B5]/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-[#0044B5]">{volCount}</p>
                <p className="text-[10px] text-[#4A5568] uppercase font-bold mt-0.5">Voluntarios</p>
              </div>
              <div className="bg-[#F4F6FA] border border-[#D8E2F0] rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-[#1A2340]">{durHours}h</p>
                <p className="text-[10px] text-[#4A5568] uppercase font-bold mt-0.5">Horas / Persona</p>
              </div>
              <div className="bg-[#FFBA00]/15 border border-[#FFBA00]/40 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-[#8A6400]">{totalCalculatedHours}h</p>
                <p className="text-[10px] text-[#8A6400] uppercase font-black mt-0.5">Total Horas</p>
              </div>
              <div className="bg-[#F4F6FA] border border-[#D8E2F0] rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-[#1A2340]">{record.beneficiaries_count ?? 0}</p>
                <p className="text-[10px] text-[#4A5568] uppercase font-bold mt-0.5">Beneficiarios</p>
              </div>
            </div>
          </section>

          {/* Bloque 3: Descripción */}
          <section>
            <h3 className="text-[10px] font-black text-[#9AA3B4] uppercase tracking-widest mb-3">
              Descripción de las acciones realizadas
            </h3>
            <div className="bg-[#F4F6FA] border border-[#D8E2F0] rounded-xl p-4 text-sm text-[#1A2340] leading-relaxed whitespace-pre-wrap">
              {record.description || 'Sin descripción ingresada.'}
            </div>
          </section>

          {/* Bloque 4: Testimonios (Opcional) */}
          {record.testimonials && (
            <section>
              <h3 className="text-[10px] font-black text-[#9AA3B4] uppercase tracking-widest mb-3">
                Testimonios y comentarios
              </h3>
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-sm text-[#8A6400] italic leading-relaxed">
                &ldquo;{record.testimonials}&rdquo;
              </div>
            </section>
          )}

          {/* Bloque 5: Evidencia Fotográfica */}
          <section>
            <h3 className="text-[10px] font-black text-[#9AA3B4] uppercase tracking-widest mb-3">
              Evidencia Fotográfica
            </h3>
            {record.evidence_links ? (
              <a
                href={record.evidence_links}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-[#0044B5]/10 border border-[#0044B5]/30 rounded-xl p-4 hover:bg-[#0044B5]/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0044B5] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#0044B5] font-bold text-sm group-hover:underline">Abrir enlace de evidencia fotográfica ↗</p>
                  <p className="text-xs text-[#4A5568] truncate mt-0.5">{record.evidence_links}</p>
                </div>
                <span className="btn-brand-gold text-xs px-3 py-1.5 rounded-lg font-black flex-shrink-0">
                  Ver Fotos
                </span>
              </a>
            ) : (
              <div className="bg-[#F4F6FA] rounded-xl p-4 text-center text-[#9AA3B4] text-sm italic">
                No se adjuntó enlace de evidencia en este registro.
              </div>
            )}
          </section>
        </div>

        {/* Footer con Acciones de Validación */}
        <div className="px-6 py-4 border-t border-[#D8E2F0] bg-[#F4F6FA] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDeleteRecord}
            disabled={updating}
            className="text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            🗑️ Eliminar
          </button>

          <div className="flex items-center gap-2">
            {record.status !== 'approved' && (
              <button
                onClick={() => handleStatusChange('approved')}
                disabled={updating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                ✅ Aprobar Registro
              </button>
            )}

            {record.status !== 'cancelled' && (
              <button
                onClick={() => handleStatusChange('cancelled')}
                disabled={updating}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                ❌ Rechazar
              </button>
            )}

            <button
              onClick={onClose}
              className="btn-brand-outline text-xs px-4 py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function RegistrationManager({ token }: { token: string }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'cancelled' | 'all'>('pending');
  const [selectedRecord, setSelectedRecord] = useState<Registration | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'full' | 'light'>('full');

  useEffect(() => { fetchRegistrations(); }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/registrations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching registrations", error);
      setRegistrations([]);
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
      await fetchRegistrations();
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
      await fetchRegistrations();
    } catch (error) {
      console.error("Error deleting registration", error);
    }
  };

  // Contadores por estado
  const counts = useMemo(() => {
    return {
      pending: registrations.filter(r => r.status === 'pending').length,
      approved: registrations.filter(r => r.status === 'approved').length,
      cancelled: registrations.filter(r => r.status === 'cancelled').length,
      all: registrations.length,
    };
  }, [registrations]);

  // Filtrar registros según pestaña activa y buscador
  const filteredRegistrations = useMemo(() => {
    let list = registrations;
    if (activeTab !== 'all') {
      list = list.filter(r => r.status === activeTab);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(r =>
        (r.user_name && r.user_name.toLowerCase().includes(q)) ||
        (r.user_last_name && r.user_last_name.toLowerCase().includes(q)) ||
        (r.user_email && r.user_email.toLowerCase().includes(q)) ||
        (r.custom_activity_name && r.custom_activity_name.toLowerCase().includes(q)) ||
        (r.activity_name && r.activity_name.toLowerCase().includes(q)) ||
        (r.group_name && r.group_name.toLowerCase().includes(q)) ||
        (r.user_organization && r.user_organization.toLowerCase().includes(q)) ||
        (r.location_name && r.location_name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [registrations, activeTab, searchTerm]);

  const TABS = [
    { id: 'pending' as const, label: 'Pendientes por Validar', icon: '⏳', count: counts.pending, colorCls: 'text-amber-700 bg-amber-100' },
    { id: 'approved' as const, label: 'Aprobadas', icon: '✅', count: counts.approved, colorCls: 'text-emerald-700 bg-emerald-100' },
    { id: 'cancelled' as const, label: 'Rechazadas', icon: '❌', count: counts.cancelled, colorCls: 'text-red-700 bg-red-100' },
    { id: 'all' as const, label: 'Todos los Registros', icon: '📋', count: counts.all, colorCls: 'text-slate-700 bg-slate-100' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div>
        <h3 className="font-antonio text-2xl text-[#0044B5] uppercase flex items-center gap-2">
          <span className="divider-gold" />
          Gestión de Movilizaciones e Impacto
        </h3>
        <p className="text-[#4A5568] text-sm mt-1">
          Revisa a detalle cada actividad registrada, consulta sus evidencias y aprueba o rechaza el impacto.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D8E2F0] shadow-sm overflow-hidden">
        
        {/* ── Barra de Pestañas (Tabs) ── */}
        <div className="flex flex-wrap border-b border-[#D8E2F0] bg-slate-50">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 ${
                  isActive
                    ? 'border-[#0044B5] text-[#0044B5] bg-white shadow-xs'
                    : 'border-transparent text-[#4A5568] hover:text-[#0044B5] hover:bg-slate-100/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-black ml-1 ${tab.colorCls}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Buscador Rápido ── */}
        <div className="p-4 border-b border-[#D8E2F0] bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Buscar por voluntario, empresa o actividad..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-brand w-full pl-9 pr-4 py-2 text-xs rounded-lg"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="text-xs text-[#4A5568] font-medium flex items-center gap-4">
            <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setViewMode('full')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${viewMode === 'full' ? 'bg-white shadow text-[#0044B5]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Completo
              </button>
              <button
                onClick={() => setViewMode('light')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${viewMode === 'light' ? 'bg-white shadow text-[#0044B5]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Ligero (Sin imágenes)
              </button>
            </div>
            <span>
              Mostrando <strong className="text-[#0044B5]">{filteredRegistrations.length}</strong> registro(s)
            </span>
          </div>
        </div>

        {/* ── Tabla de Registros ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F4F6FA] text-[#4A5568] text-xs uppercase tracking-wider border-b border-[#D8E2F0]">
              <tr>
                <th className="px-5 py-4 font-bold">Voluntario / Organización</th>
                <th className="px-5 py-4 font-bold">Actividad Registrada</th>
                <th className="px-5 py-4 font-bold">Lugar y Fecha</th>
                <th className="px-5 py-4 font-bold text-center">Impacto</th>
                <th className="px-5 py-4 font-bold text-center">Estado</th>
                <th className="px-5 py-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8E2F0] text-sm">
              {filteredRegistrations.map(reg => {
                const st = STATUS_CONFIG[reg.status] || { label: reg.status, badgeCls: 'bg-slate-100 text-slate-600', icon: '📋' };
                const volCount = reg.volunteer_count || 1;
                const durHours = parseFloat(String(reg.duration_hours || 0));
                const totalHours = volCount * durHours;

                return (
                  <tr key={reg.id} className="hover:bg-blue-50/30 transition-colors">
                    {/* Voluntario */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#1A2340]">
                        {reg.user_name} {reg.user_last_name}
                      </div>
                      <div className="text-xs text-[#4A5568]">{reg.user_email}</div>
                      {(reg.group_name || reg.user_organization) && (
                        <div className="text-[11px] font-semibold text-[#0044B5] mt-0.5">
                          🏢 {reg.group_name || reg.user_organization}
                        </div>
                      )}
                    </td>

                    {/* Actividad */}
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-bold text-[#1A2340] leading-snug">
                        {reg.custom_activity_name || reg.activity_name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="bg-[#0044B5]/10 text-[#0044B5] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          {reg.activity_type || (reg.activity_id === 9 ? 'Propia' : 'Institucional')}
                        </span>
                        {reg.evidence_links && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            📷 Con Fotos
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Lugar y Fecha */}
                    <td className="px-5 py-4 text-xs text-[#4A5568] whitespace-nowrap">
                      <div className="font-medium text-[#1A2340]">
                        📍 {reg.location_name || reg.user_municipality || 'N/D'}
                      </div>
                      <div className="text-[#9AA3B4] mt-0.5">
                        📅 {reg.execution_date || reg.scheduled_date ? new Date(reg.execution_date || reg.scheduled_date || '').toLocaleDateString('es-MX') : 'Sin fecha'}
                      </div>
                    </td>

                    {/* Impacto */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <div className="font-black text-[#0044B5] text-base">
                        {totalHours}h
                      </div>
                      {viewMode === 'full' && (
                        <>
                          <div className="text-[10px] text-[#4A5568] font-semibold">
                            {volCount} vol. × {durHours}h
                          </div>
                          <div className="text-[10px] text-[#8A6400] font-bold mt-0.5">
                            {reg.beneficiaries_count} ben.
                          </div>
                        </>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${st.badgeCls}`}>
                        {st.icon} {st.label}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Botón Ver Actividad */}
                        <button
                          onClick={() => setSelectedRecord(reg)}
                          className="flex items-center gap-1 bg-[#0044B5] hover:bg-[#002D7A] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs"
                          title="Ver ficha completa de la actividad"
                        >
                          <span>👁️</span>
                          <span>Ver Ficha</span>
                        </button>

                        {/* Botón Aprobar Rápido */}
                        {reg.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(reg.id, 'approved')}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-1.5 rounded-lg transition-colors border border-emerald-300"
                            title="Aprobar registro"
                          >
                            ✅
                          </button>
                        )}

                        {/* Botón Rechazar Rápido */}
                        {reg.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(reg.id, 'cancelled')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded-lg transition-colors border border-red-300"
                            title="Rechazar registro"
                          >
                            ❌
                          </button>
                        )}

                        {/* Botón Eliminar */}
                        <button
                          onClick={() => handleDelete(reg.id)}
                          className="bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 p-1.5 rounded-lg transition-colors border border-slate-200"
                          title="Eliminar registro"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRegistrations.length === 0 && !loading && (
          <div className="p-12 text-center text-[#9AA3B4]">
            <p className="text-4xl mb-2">📭</p>
            <p className="font-semibold text-sm">No se encontraron registros en esta sección.</p>
          </div>
        )}

        {loading && (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <div className="w-8 h-8 border-4 border-[#0044B5] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Cargando registros de movilización...</span>
          </div>
        )}
      </div>

      {/* ── Modal de Detalle de Actividad ── */}
      {selectedRecord && (
        <RegistrationDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onUpdateStatus={async (id, status) => { await handleUpdateStatus(id, status); }}
          onDelete={async (id) => { await handleDelete(id); }}
        />
      )}
    </div>
  );
}
