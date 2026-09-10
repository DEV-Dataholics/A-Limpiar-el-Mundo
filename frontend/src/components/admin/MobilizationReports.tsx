import { API_URL } from '../../config';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface MobilizationRecord {
  id: number;
  custom_activity_name: string;
  activity_type: string;
  group_name: string;
  location_name: string;
  execution_date: string;
  scheduled_date: string;
  duration_hours: number;
  volunteer_count: number;
  beneficiaries_count: number;
  description: string;
  evidence_links: string;
  status: string;
  created_at: string;
  user_name: string;
  user_last_name: string;
  user_email: string;
  user_phone: string;
  user_municipality: string;
  user_state: string;
  user_organization: string;
  catalog_activity_name: string;
}

const TABS = [
  { key: 'Corporativa', label: 'Corporativo', icon: '🏭' },
  { key: 'Personal', label: 'Personal', icon: '👤' },
  { key: 'Sociedad civil', label: 'Sociedad Civil', icon: '🌐' },
  { key: 'Escuela', label: 'Escuela', icon: '🏫' },
];

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  pending: { cls: 'bg-amber-100 text-amber-700 border-amber-300', label: 'Pendiente' },
  approved: { cls: 'bg-emerald-100 text-emerald-700 border-emerald-300', label: 'Aprobado' },
  cancelled: { cls: 'bg-red-100 text-red-600 border-red-300', label: 'Rechazado' },
};

// ─── Utilidad: Descarga CSV ──────────────────────────────────────────────────
function downloadCSV(rows: MobilizationRecord[], type: string) {
  if (!rows.length) return;
  const headers = [
    'ID', 'Actividad', 'Tipo', 'Empresa / Organización', 'Lugar',
    'Fecha', 'Horas', 'Voluntarios', 'Beneficiarios', 'Descripción',
    'Evidencia', 'Estatus', 'Voluntario', 'Email', 'Teléfono', 'Municipio', 'Estado'
  ];
  const csvRows = rows.map(r => [
    r.id, r.custom_activity_name, r.activity_type, r.user_organization || `${r.user_name} ${r.user_last_name}`,
    r.location_name, r.execution_date || r.scheduled_date, r.duration_hours,
    r.volunteer_count, r.beneficiaries_count, r.description || '',
    r.evidence_links || '', r.status,
    `${r.user_name} ${r.user_last_name}`, r.user_email, r.user_phone || '',
    r.user_municipality, r.user_state
  ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));

  const csv = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte_${type.toLowerCase().replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Modal: Ficha de Movilización ─────────────────────────────────────────────
function MobilizationDetailModal({
  record,
  onClose,
}: {
  record: MobilizationRecord;
  onClose: () => void;
}) {
  const status = STATUS_BADGE[record.status] ?? { cls: 'bg-slate-100 text-slate-500 border-slate-200', label: record.status };

  // Cierre con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0a1432]/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header (Fijo) */}
        <div className="bg-[#0044B5] px-6 py-5 rounded-t-2xl flex justify-between items-start flex-shrink-0">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">
              Ficha de Movilización #{record.id}
            </p>
            <h2 className="text-white font-antonio text-xl leading-tight">
              {record.custom_activity_name || record.catalog_activity_name || 'Actividad de Voluntariado'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {record.activity_type}
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${status.cls}`}>
                {status.label}
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

        {/* Body (Scrollable) */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">

          {/* ── Bloque 1: Quién reporta ── */}
          <section>
            <h3 className="text-[10px] font-black text-[#9AA3B4] uppercase tracking-widest mb-3">
              Quién reporta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#F4F6FA] rounded-xl p-3">
                <p className="text-[10px] text-[#9AA3B4] uppercase font-bold mb-0.5">
                  {record.activity_type === 'Corporativa' ? 'Empresa' : 'Nombre'}
                </p>
                <p className="font-bold text-[#1A2340] text-sm">
                  {record.user_organization || `${record.user_name} ${record.user_last_name}`}
                </p>
                {record.user_organization && (
                  <p className="text-xs text-[#9AA3B4] mt-0.5">{record.user_name} {record.user_last_name}</p>
                )}
              </div>
              <div className="bg-[#F4F6FA] rounded-xl p-3">
                <p className="text-[10px] text-[#9AA3B4] uppercase font-bold mb-0.5">Contacto</p>
                <p className="font-medium text-[#1A2340] text-sm">{record.user_email}</p>
                {record.user_phone && (
                  <p className="text-xs text-[#FFBA00] font-bold mt-0.5">{record.user_phone}</p>
                )}
              </div>
              <div className="bg-[#F4F6FA] rounded-xl p-3">
                <p className="text-[10px] text-[#9AA3B4] uppercase font-bold mb-0.5">Localidad</p>
                <p className="font-medium text-[#1A2340] text-sm">
                  {record.location_name || `${record.user_municipality}, ${record.user_state}` || 'N/D'}
                </p>
                {record.group_name && (
                  <p className="text-xs text-[#9AA3B4] mt-0.5">
                    {record.activity_type === 'Escuela' ? 'Escuela' : 'Grupo'}: {record.group_name}
                  </p>
                )}
              </div>
              <div className="bg-[#F4F6FA] rounded-xl p-3">
                <p className="text-[10px] text-[#9AA3B4] uppercase font-bold mb-0.5">Fecha de Actividad</p>
                <p className="font-bold text-[#1A2340] text-sm">
                  {record.execution_date || record.scheduled_date
                    ? new Date(record.execution_date || record.scheduled_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Sin fecha'}
                </p>
                <p className="text-xs text-[#9AA3B4] mt-0.5">
                  Registrado: {new Date(record.created_at).toLocaleDateString('es-MX')}
                </p>
              </div>
            </div>
          </section>

          {/* ── Bloque 2: Impacto ── */}
          <section>
            <h3 className="text-[10px] font-black text-[#9AA3B4] uppercase tracking-widest mb-3">
              Impacto reportado
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0044B5]/8 border border-[#0044B5]/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-[#0044B5]">
                  {record.volunteer_count ?? '—'}
                </p>
                <p className="text-[10px] text-[#4A5568] uppercase font-bold mt-1">Voluntarios</p>
              </div>
              <div className="bg-[#F4F6FA] border border-[#D8E2F0] rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-[#1A2340]">
                  {record.duration_hours ?? '—'}
                </p>
                <p className="text-[10px] text-[#4A5568] uppercase font-bold mt-1">Horas</p>
              </div>
              <div className="bg-[#FFBA00]/10 border border-[#FFBA00]/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-[#8A6400]">
                  {record.beneficiaries_count ?? '—'}
                </p>
                <p className="text-[10px] text-[#4A5568] uppercase font-bold mt-1">Beneficiarios</p>
              </div>
            </div>
          </section>

          {/* ── Bloque 3: Descripción ── */}
          {record.description && (
            <section>
              <h3 className="text-[10px] font-black text-[#9AA3B4] uppercase tracking-widest mb-3">
                Descripción de la actividad
              </h3>
              <div className="bg-[#F4F6FA] rounded-xl p-4 text-sm text-[#4A5568] leading-relaxed">
                {record.description}
              </div>
            </section>
          )}

          {/* ── Bloque 4: Evidencia ── */}
          <section>
            <h3 className="text-[10px] font-black text-[#9AA3B4] uppercase tracking-widest mb-3">
              Evidencia fotográfica
            </h3>
            {record.evidence_links ? (
              <a
                href={record.evidence_links}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-[#0044B5]/8 border border-[#0044B5]/25 rounded-xl p-4 hover:bg-[#0044B5]/15 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0044B5] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#0044B5] font-bold text-sm group-hover:underline">Ver galería de evidencia</p>
                  <p className="text-xs text-[#9AA3B4] truncate mt-0.5">{record.evidence_links}</p>
                </div>
                <svg className="w-4 h-4 text-[#0044B5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <div className="bg-[#F4F6FA] rounded-xl p-4 text-center text-[#9AA3B4] text-sm italic">
                No se adjuntó enlace de evidencia.
              </div>
            )}
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[#D8E2F0] flex justify-end">
          <button
            onClick={onClose}
            className="btn-brand-outline text-sm px-6 py-2"
          >
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function MobilizationReports() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('Corporativa');
  const [data, setData] = useState<MobilizationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MobilizationRecord | null>(null);

  // Estados de filtros dinámicos
  const [filterActivity, setFilterActivity] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Filtrado reactivo en memoria
  const filteredData = useMemo(() => {
    return data.filter(row => {
      // 1. Filtro por actividad
      if (filterActivity.trim()) {
        const query = filterActivity.toLowerCase().trim();
        const actName = (row.custom_activity_name || row.catalog_activity_name || '').toLowerCase();
        if (!actName.includes(query)) return false;
      }
      // 2. Filtro por empresa / organizacion / responsable
      if (filterCompany.trim()) {
        const query = filterCompany.toLowerCase().trim();
        const comp = (row.user_organization || row.group_name || `${row.user_name} ${row.user_last_name}`).toLowerCase();
        if (!comp.includes(query)) return false;
      }
      // 3. Filtro por rango de fechas
      const rawDate = row.execution_date || row.scheduled_date || row.created_at;
      if (filterStartDate) {
        if (!rawDate || rawDate.slice(0, 10) < filterStartDate) return false;
      }
      if (filterEndDate) {
        if (!rawDate || rawDate.slice(0, 10) > filterEndDate) return false;
      }
      return true;
    });
  }, [data, filterActivity, filterCompany, filterStartDate, filterEndDate]);

  const hasActiveFilters = Boolean(filterActivity || filterCompany || filterStartDate || filterEndDate);

  const clearFilters = () => {
    setFilterActivity('');
    setFilterCompany('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  const fetchReports = useCallback(async (type: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API_URL}/api/admin/reports/mobilizations?type=${encodeURIComponent(type)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      setData(Array.isArray(json.data) ? json.data : []);
    } catch {
      setError('No se pudo conectar con el servidor.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReports(activeTab);
  }, [activeTab, fetchReports]);

  // Medir ancho de la tabla para sincronizar la barra superior
  const updateScrollMetrics = useCallback(() => {
    const tableEl = tableScrollRef.current;
    if (tableEl) {
      const sw = tableEl.scrollWidth;
      const cw = tableEl.clientWidth;
      setScrollWidth(sw);
      setHasOverflow(sw > cw + 2);
    }
  }, []);

  useEffect(() => {
    updateScrollMetrics();
    const tableEl = tableScrollRef.current;
    if (!tableEl) return;

    const observer = new ResizeObserver(() => {
      updateScrollMetrics();
    });
    observer.observe(tableEl);
    const table = tableEl.querySelector('table');
    if (table) observer.observe(table);
    window.addEventListener('resize', updateScrollMetrics);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScrollMetrics);
    };
  }, [data, updateScrollMetrics]);

  // Sincronizar scroll entre la barra superior y la tabla
  useEffect(() => {
    const topEl = topScrollRef.current;
    const tableEl = tableScrollRef.current;
    if (!topEl || !tableEl) return;

    let isSyncingTop = false;
    let isSyncingTable = false;

    const handleTopScroll = () => {
      if (isSyncingTop) {
        isSyncingTop = false;
        return;
      }
      isSyncingTable = true;
      tableEl.scrollLeft = topEl.scrollLeft;
    };

    const handleTableScroll = () => {
      if (isSyncingTable) {
        isSyncingTable = false;
        return;
      }
      isSyncingTop = true;
      topEl.scrollLeft = tableEl.scrollLeft;
    };

    topEl.addEventListener('scroll', handleTopScroll, { passive: true });
    tableEl.addEventListener('scroll', handleTableScroll, { passive: true });

    return () => {
      topEl.removeEventListener('scroll', handleTopScroll);
      tableEl.removeEventListener('scroll', handleTableScroll);
    };
  }, [hasOverflow]);

  const scrollByAmount = (amount: number) => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="card-brand p-0 overflow-hidden">
        {/* Header del Módulo */}
        <div className="bg-[#0044B5] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-antonio text-white text-2xl uppercase tracking-wide">
              Reporte de Movilizaciones
            </h2>
            <p className="text-white/70 text-sm mt-0.5">Voluntariado ciudadano registrado en la plataforma</p>
          </div>
          <button
            onClick={() => downloadCSV(filteredData.length ? filteredData : data, activeTab)}
            disabled={!data.length}
            className="btn-brand-gold text-sm px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar CSV
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-slate-200 bg-white">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 ${activeTab === tab.key
                ? 'border-[#0044B5] text-[#0044B5] bg-[#0044B5]/5'
                : 'border-transparent text-slate-500 hover:text-[#0044B5] hover:bg-slate-50'
                }`}
            >
              <span>{tab.icon}</span> {tab.label}
              {activeTab === tab.key && !loading && (
                <span className="ml-1 bg-[#0044B5] text-white text-xs rounded-full px-2 py-0.5">{data.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Barra de Filtros Dinámicos (TKT-UW-003) ── */}
        <div className="bg-[#F8FAFC] border-b border-slate-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Filtro por Actividad */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Buscar por Actividad
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej. Reforestación, Limpieza..."
                  value={filterActivity}
                  onChange={e => setFilterActivity(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0044B5] bg-white transition-colors"
                />
                <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtro por Empresa */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Buscar por Empresa / Reporta
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej. Aptiv, Lear, Brigada..."
                  value={filterCompany}
                  onChange={e => setFilterCompany(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0044B5] bg-white transition-colors"
                />
                <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>

            {/* Filtro Rango: Fecha Desde */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Fecha Desde
              </label>
              <input
                type="date"
                value={filterStartDate}
                onChange={e => setFilterStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0044B5] bg-white transition-colors"
              />
            </div>

            {/* Filtro Rango: Fecha Hasta */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={filterEndDate}
                onChange={e => setFilterEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0044B5] bg-white transition-colors"
              />
            </div>
          </div>

          {/* Sub-barra de resumen y limpiar */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">
              Mostrando <strong className="text-[#0044B5]">{filteredData.length}</strong> de {data.length} registros
              {hasActiveFilters && <span className="text-amber-600 font-semibold ml-1.5">(Filtros aplicados)</span>}
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

        {/* ── Barra Superior de Desplazamiento Sincronizada ── */}
        {hasOverflow && (
          <div className="bg-[#F4F6FA] border-b border-slate-200 px-4 py-2.5 flex items-center gap-3 select-none">
            <span className="text-[11px] font-bold text-[#0044B5] flex items-center gap-1.5 flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[#FFBA00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Desplazar tabla:
            </span>
            <button
              type="button"
              onClick={() => scrollByAmount(-250)}
              className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-[#0044B5] hover:border-[#0044B5] hover:bg-blue-50/50 transition-all flex items-center justify-center flex-shrink-0 shadow-xs"
              title="Desplazar a la izquierda"
              aria-label="Desplazar a la izquierda"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              ref={topScrollRef}
              className="flex-1 overflow-x-auto custom-scrollbar h-4 rounded-full bg-slate-200/90 shadow-inner"
              title="Barra para desplazarse horizontalmente por la tabla"
            >
              <div style={{ width: `${scrollWidth}px`, height: '1px' }} />
            </div>
            <button
              type="button"
              onClick={() => scrollByAmount(250)}
              className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-[#0044B5] hover:border-[#0044B5] hover:bg-blue-50/50 transition-all flex items-center justify-center flex-shrink-0 shadow-xs"
              title="Desplazar a la derecha"
              aria-label="Desplazar a la derecha"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Contenido de Tabla con Sticky Header Confinado */}
        <div ref={tableScrollRef} className="overflow-auto max-h-[620px] custom-scrollbar relative border-b border-slate-200">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <div className="w-6 h-6 border-2 border-[#0044B5] border-t-transparent rounded-full animate-spin mr-3"></div>
              Cargando registros...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 text-sm">{error}</div>
          ) : data.length === 0 ? (
            <div className="text-center py-14 text-slate-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-semibold">Sin registros para este tipo de movilización.</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-14 text-slate-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold">No se encontraron registros que coincidan con los filtros aplicados.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 text-xs text-[#0044B5] font-bold hover:underline"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-100/95 backdrop-blur-sm border-b border-slate-300 sticky top-0 z-20 shadow-xs">
                <tr>
                  {[
                    activeTab === 'Corporativa' ? 'Empresa' : 'Voluntario',
                    'Actividad',
                    activeTab === 'Corporativa' ? 'Enlace / Responsable' : 'Organización',
                    'Lugar', 'Fecha', 'Horas', 'Beneficiarios', 'Estatus', ''
                  ].map((h, i) => (
                    <th key={`${h}-${i}`} className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wide whitespace-nowrap bg-slate-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, i) => {
                  const st = STATUS_BADGE[row.status] ?? { cls: 'bg-slate-100 text-slate-500 border-slate-200', label: row.status };
                  return (
                    <tr key={row.id} className={`border-b border-slate-100 hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">
                          {activeTab === 'Corporativa'
                            ? (row.user_organization || `${row.user_name} ${row.user_last_name}`)
                            : `${row.user_name} ${row.user_last_name}`
                          }
                        </p>
                        <p className="text-xs text-slate-400">{row.user_email}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700 max-w-[160px] truncate">
                        {row.custom_activity_name || row.catalog_activity_name || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {activeTab === 'Corporativa'
                          ? `${row.user_name} ${row.user_last_name}`
                          : (row.user_organization || '—')
                        }
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        <p>{row.location_name || '—'}</p>
                        <p className="text-xs text-slate-400">{row.user_municipality}, {row.user_state}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {(row.execution_date || row.scheduled_date) ? new Date(row.execution_date || row.scheduled_date).toLocaleDateString('es-MX') : '—'}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-[#0044B5]">{row.duration_hours ?? '—'}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{row.beneficiaries_count ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                      {/* ── Botón Ver ── */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedRecord(row)}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#0044B5] hover:text-white bg-[#0044B5]/10 hover:bg-[#0044B5] border border-[#0044B5]/30 hover:border-[#0044B5] px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal: Ficha de Movilización ── */}
      {selectedRecord && (
        <MobilizationDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </>
  );
}

