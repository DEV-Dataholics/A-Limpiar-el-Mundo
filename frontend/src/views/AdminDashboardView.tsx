import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

import ActivityManager from '../components/admin/ActivityManager';
import RegistrationManager from '../components/admin/RegistrationManager';
import UserManager from '../components/admin/UserManager';
import MobilizationReports from '../components/admin/MobilizationReports';
import CorporateManager from '../components/admin/CorporateManager';
import { API_URL } from '../config';

const API_BASE_URL = API_URL;

type MetricData = {
  general: {
    total_volunteers: number;
    total_registrations: number;
    total_actions: number;
    total_hours: number;
    total_beneficiaries: number;
    pending_approvals: number;
  };
  institutional: Array<{
    id: number;
    name: string;
    min_capacity: number;
    max_capacity: number;
    current_registrations: number;
    event_date: string;
    status: string;
  }>;
  locations: Array<{
    plant_name?: string;
    division_name?: string;
    total_activities?: number;
    municipality?: string;
    count?: number;
  }>;
  community_count: number;
  top_corporates?: Array<{ name: string; hours: number; count: number }>;
};

type NavTab = 'metrics' | 'activities' | 'corporates' | 'registrations' | 'users';

const navItems: { id: NavTab; label: string; icon: string }[] = [
  { id: 'metrics',       label: 'Resumen de Impacto',   icon: '📊' },
  { id: 'activities',    label: 'Catálogo de Causas',    icon: '📂' },
  { id: 'corporates',    label: 'Empresas y Plantas',    icon: '🏢' },
  { id: 'registrations', label: 'Validar Impactos',      icon: '🤝' },
  { id: 'users',         label: 'Comunidad SC',          icon: '👥' },
];

export default function AdminDashboardView() {
  const { user, token, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('metrics');
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activityUsers, setActivityUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) fetchMetrics(selectedPeriod);
  }, [isAdmin, activeTab]);

  const fetchMetrics = async (periodMonth = selectedPeriod) => {
    try {
      const url = periodMonth
        ? `${API_BASE_URL}/api/admin/metrics?month=${encodeURIComponent(periodMonth)}`
        : `${API_BASE_URL}/api/admin/metrics`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) setMetrics(result.data);
    } catch (error) {
      console.error("Error fetching metrics", error);
    }
  };

  const fetchActivityUsers = async (activity: any) => {
    setSelectedActivity(activity);
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/registrations?activity_id=${activity.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setActivityUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setActivityUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-[#F4F6FA] flex flex-col">

      {/* ══════════════════════════════════════════
          TOPBAR INSTITUCIONAL — #0044B5
      ══════════════════════════════════════════ */}
      <header className="bg-[#0044B5] shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo + marca */}
          <div className="flex items-center gap-4">
            {/* Botón menú móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-white mr-2 hover:text-[#FFBA00] transition-colors"
              aria-label="Menú"
            >
              ☰
            </button>
            
            <Link to="/" className="flex items-center gap-4 group transition-transform hover:scale-105">
              <img
                src="/logo-uwch-35-white-color.png"
                alt="United Way Chihuahua 35 Años"
                className="h-10 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="h-10 w-[2px] bg-[#FFBA00] mx-1 hidden sm:block"></div>
              <img
                src="/logo-a-limpiar-el-mundo.png"
                alt="A Limpiar el Mundo 2026"
                className="h-8 object-contain brightness-0 invert"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </Link>

            <div className="flex flex-col leading-none ml-2 border-l border-white/20 pl-4 hidden lg:flex">
              <span className="font-antonio text-white text-lg tracking-wide uppercase">
                Panel de Control
              </span>
              <span className="text-[#FFBA00] text-[10px] font-bold uppercase tracking-widest">
                United Way Chihuahua
              </span>
            </div>
          </div>

          {/* Info admin + cerrar sesión */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#FFBA00] text-[#002D7A] text-xs font-black uppercase rounded-full">
              ⚡ Admin Maestro
            </span>
            <button
              onClick={logout}
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              Salir →
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Overlay móvil ── */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ══════════════════════════════════════════
            SIDEBAR — AZUL OSCURO #002D7A
        ══════════════════════════════════════════ */}
        <aside className={`
          ${sidebarOpen ? 'block' : 'hidden'} md:flex
          w-64 bg-[#002D7A] flex-shrink-0 flex-col
          fixed md:relative top-16 md:top-0 h-[calc(100vh-4rem)] md:h-full z-40
        `}>
          <nav className="flex-1 p-4 space-y-1 pt-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                  activeTab === item.id
                    ? 'bg-[#0044B5] text-white border-l-4 border-[#FFBA00] pl-3 shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 mt-auto">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-xl text-sm font-semibold transition-all flex items-center gap-3"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </aside>

        <main className={`flex-1 min-w-0 p-6 md:p-8 flex flex-col ${activeTab === 'users' ? 'overflow-y-auto md:overflow-hidden' : 'overflow-y-auto'}`}>

          {/* ── MÉTRICAS ── */}
          {activeTab === 'metrics' && (
            <div className="space-y-8 animate-fade-in">

              {/* Encabezado de sección con selector de periodo mensual (TKT-UW-004) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-antonio text-3xl text-[#0044B5] uppercase flex items-center gap-3">
                    <span className="divider-gold" />
                    Resumen de Impacto
                  </h2>
                  <p className="text-[#4A5568] mt-1">
                    Monitoreo de causas, voluntarios e indicadores de impacto.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl border border-[#D8E2F0] shadow-xs self-start sm:self-auto">
                  <span className="text-xs font-bold text-[#0044B5] uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
                    <span>📅</span> Periodo:
                  </span>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => {
                      const newMonth = e.target.value;
                      setSelectedPeriod(newMonth);
                      fetchMetrics(newMonth);
                    }}
                    className="text-xs font-semibold text-slate-700 bg-transparent border-0 focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="">Acumulado General (Todo el Año)</option>
                    <option value="09">Septiembre (Mes Oficial de Campaña)</option>
                    <option value="08">Agosto</option>
                    <option value="07">Julio</option>
                    <option value="06">Junio</option>
                    <option value="05">Mayo</option>
                    <option value="04">Abril</option>
                    <option value="03">Marzo</option>
                    <option value="02">Febrero</option>
                    <option value="01">Enero</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>
              </div>

              {/* Grid de métricas generales */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                  title="Voluntarios"
                  value={metrics?.general.total_volunteers || 0}
                  icon="👥"
                  color="blue"
                />
                <MetricCard
                  title="Horas Generadas"
                  value={metrics?.general.total_hours || 0}
                  icon="⏱️"
                  color="gold"
                />
                <MetricCard
                  title="Causas Registradas"
                  value={metrics?.general.total_actions || 0}
                  icon="📍"
                  color="blue"
                />
                <MetricCard
                  title="Pendientes"
                  value={metrics?.general.pending_approvals || 0}
                  icon="⏳"
                  color={metrics?.general.pending_approvals ? 'alert' : 'muted'}
                />
              </div>

              {/* ── REPORTEADOR DE MOVILIZACIONES (Ajuste #13) ── */}
              <section>
                <h3 className="font-antonio text-xl text-[#0044B5] uppercase mb-5 flex items-center gap-2">
                  <span className="divider-gold" />
                  Reporte de Movilizaciones Ciudadanas
                </h3>
                <MobilizationReports />
              </section>

              {/* ── TOP 3 CORPORATIVOS ── */}
              {metrics?.top_corporates && metrics.top_corporates.length > 0 && (
                <section>
                  <h3 className="font-antonio text-xl text-[#0044B5] uppercase mb-5 flex items-center gap-2">
                    <span className="divider-gold" />
                    Top 3 Corporativos con Mayor Impacto
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {metrics.top_corporates.slice(0, 3).map((corp, index) => (
                      <div key={index} className="card-brand p-5 relative overflow-hidden flex flex-col items-center text-center">
                        <div className={`absolute top-0 w-full h-2 ${index === 0 ? 'bg-[#FFBA00]' : index === 1 ? 'bg-slate-300' : 'bg-orange-300'}`}></div>
                        <div className="text-4xl mb-3 mt-2">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                        <h4 className="font-bold text-lg text-[#1A2340] mb-1 line-clamp-1">{corp.name || (corp as any).corporate_name || 'Corporativo'}</h4>
                        <div className="text-[#0044B5] font-black text-2xl">{corp.hours || 0} hrs</div>
                        <div className="text-xs text-[#4A5568] uppercase font-bold mt-1">{corp.count || 0} Voluntarios</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Estatus de Causas Institucionales */}
              <section>
                <h3 className="font-antonio text-xl text-[#0044B5] uppercase mb-5 flex items-center gap-2">
                  <span className="divider-gold" />
                  Estatus de Causas Institucionales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(metrics?.institutional || []).map(act => {
                    const maxGoal = Number(act.max_capacity) || 1;
                    const minGoal = Number(act.min_capacity) || 0;
                    const currentRegs = Number(act.current_registrations) || 0;
                    const progress = Math.min(100, (currentRegs / maxGoal) * 100);
                    const reachedMin = currentRegs >= minGoal;
                    const reachedMax = currentRegs >= maxGoal;
                    // Posición del marcador mínimo en la barra (%)
                    const minMarkerPos = Math.min(100, (minGoal / maxGoal) * 100);
                    return (
                      <div
                        key={act.id}
                        onClick={() => fetchActivityUsers(act)}
                        className="card-brand p-5 cursor-pointer hover:border-[#0044B5] group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-base leading-tight text-[#1A2340] group-hover:text-[#0044B5] transition-colors">
                            {act.name}
                          </h4>
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                            reachedMax
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : reachedMin
                              ? 'bg-blue-100 text-[#0044B5] border border-[#0044B5]/30'
                              : 'bg-[#FFBA00]/15 text-[#8A6400] border border-[#FFBA00]/40'
                          }`}>
                            {reachedMax ? 'Meta Máx. Lograda' : reachedMin ? 'Mín. Alcanzado' : 'En Progreso'}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-[#4A5568] mb-2 font-semibold">
                            <span>{currentRegs.toLocaleString()} Voluntarios</span>
                            <span className="text-[#0044B5] font-black">Meta: {maxGoal.toLocaleString()}</span>
                          </div>
                          {/* Barra de progreso con marcador de mínimo */}
                          <div className="progress-brand-track h-2.5 relative">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${
                                reachedMax
                                  ? 'bg-green-500'
                                  : reachedMin
                                  ? 'bg-gradient-to-r from-[#0044B5] to-[#0044B5]'
                                  : 'bg-gradient-to-r from-[#0044B5] to-[#FFBA00]'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                            {/* Marcador visual del mínimo */}
                            {minGoal > 0 && minGoal < maxGoal && (
                              <div
                                className="absolute top-0 h-full w-0.5 bg-[#9AA3B4]/60"
                                style={{ left: `${minMarkerPos}%` }}
                                title={`Mínimo: ${minGoal}`}
                              />
                            )}
                          </div>
                          {/* Referencia del mínimo debajo */}
                          {minGoal > 0 && (
                            <div className="flex justify-between text-[10px] text-[#9AA3B4] mt-1">
                              <span>Umbral mínimo: {minGoal.toLocaleString()}</span>
                              <span>{progress.toFixed(0)}% de la meta</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-xs border-t border-[#D8E2F0] pt-3">
                          <div className="text-[#4A5568]">📅 {act.event_date || 'Sin fecha'}</div>
                          <div className={`font-black ${reachedMax ? 'text-green-600' : 'text-[#0044B5]'}`}>
                            {progress.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {(!metrics?.institutional || metrics.institutional.length === 0) && (
                    <div className="col-span-full py-8 text-center text-[#9AA3B4] italic bg-white rounded-2xl border border-[#D8E2F0]">
                      No hay causas institucionales registradas en el catálogo.
                    </div>
                  )}
                </div>
              </section>

              {/* Distribución Geográfica y Plantas / Divisiones (TKT-UW-004) */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-brand p-6">
                  <h3 className="font-antonio text-lg text-[#0044B5] uppercase mb-5 flex items-center gap-2">
                    <span className="divider-gold" />
                    Localidades de Incidencia (Por Planta y División)
                  </h3>
                  <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
                    {(metrics?.locations || []).map((loc, idx) => {
                      const count = Number(loc.total_activities ?? loc.count ?? 0);
                      const totalActions = metrics?.general?.total_actions || 1;
                      const pct = Math.min(100, Math.round((count / totalActions) * 100));
                      return (
                        <div key={idx} className="flex items-center gap-4 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                          <div className="w-48 truncate">
                            <p className="text-xs font-bold text-[#1A2340] truncate">
                              {loc.plant_name || loc.municipality || 'Planta General'}
                            </p>
                            {loc.division_name && (
                              <p className="text-[11px] text-[#0044B5] font-semibold truncate">
                                División: {loc.division_name}
                              </p>
                            )}
                          </div>
                          <div className="flex-1 progress-brand-track h-2">
                            <div
                              className="h-full bg-[#0044B5] rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-xs font-black text-[#FFBA00] w-14 text-right whitespace-nowrap">
                            {count} {count === 1 ? 'act.' : 'acts.'}
                          </div>
                        </div>
                      );
                    })}
                    {(!metrics?.locations || metrics.locations.length === 0) && (
                      <p className="text-[#9AA3B4] italic text-center py-6">No hay plantas o divisiones con registros aún.</p>
                    )}
                  </div>
                </div>

                <div className="card-brand-surface p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-[#0044B5]/10 rounded-full flex items-center justify-center text-4xl mb-4">
                    ❤️
                  </div>
                  <h4 className="font-antonio text-2xl text-[#0044B5] uppercase mb-2">
                    Impacto Social SC
                  </h4>
                  <p className="text-[#4A5568] max-w-xs text-sm">
                    Cada indicador representa la voluntad de cambiar nuestra comunidad. ¡Sigue adelante!
                  </p>
                </div>
              </section>

              {/* Modal de Detalle de Actividad */}
              {selectedActivity && (
                <div className="fixed inset-0 bg-[#002D7A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-[#D8E2F0] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in">
                    {/* Modal header */}
                    <div className="px-6 py-4 border-b border-[#D8E2F0] flex justify-between items-center bg-[#0044B5] rounded-t-2xl">
                      <div>
                        <h3 className="font-antonio text-white text-xl uppercase">{selectedActivity.name}</h3>
                        <p className="text-white/70 text-sm mt-0.5">Detalle de Voluntarios Inscritos</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {activityUsers.length > 0 && (
                          <button
                            onClick={() => {
                              const headers = ['Empresa / Quien Reporta', 'Modalidad', 'Voluntarios', 'Horas', 'Beneficiarios', 'Fecha Actividad', 'Municipio', 'Descripción', 'Enlace Evidencia', 'Estatus'];
                              const rows = activityUsers.map((r: any) => [
                                r.user_organization || `${r.user_name} ${r.user_last_name}`,
                                r.activity_type || '',
                                r.volunteer_count || 0,
                                r.duration_hours || 0,
                                r.beneficiaries_count || 0,
                                r.execution_date || r.scheduled_date || '',
                                r.user_municipality || '',
                                r.description || '',
                                r.evidence_links || '',
                                r.status
                              ].map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(','));
                              const csv = [headers.join(','), ...rows].join('\n');
                              const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `impacto_${selectedActivity.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
                              link.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="btn-brand-gold text-xs px-4 py-2 flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Exportar CSV
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedActivity(null)}
                          className="text-white/70 hover:text-[#FFBA00] text-3xl leading-none transition-colors"
                        >
                          &times;
                        </button>
                      </div>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                      {loadingUsers ? (
                        <div className="text-center py-10 text-[#0044B5] font-bold tracking-widest animate-pulse">
                          CARGANDO VOLUNTARIOS...
                        </div>
                      ) : !Array.isArray(activityUsers) || activityUsers.length === 0 ? (
                        <div className="text-center py-10 text-[#9AA3B4] italic">
                          No hay voluntarios registrados en esta causa.
                        </div>
                      ) : (
                        <div className="overflow-auto max-h-[480px] rounded-xl border border-[#D8E2F0] custom-scrollbar">
                          <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-[#F4F6FA] text-[#4A5568] text-xs uppercase tracking-wider sticky top-0 z-10 shadow-xs">
                              <tr>
                                <th className="px-4 py-3 font-bold">Empresa / Quien Reporta</th>
                                <th className="px-4 py-3 font-bold">Modalidad</th>
                                <th className="px-4 py-3 font-bold text-center">Voluntarios</th>
                                <th className="px-4 py-3 font-bold text-center">Horas</th>
                                <th className="px-4 py-3 font-bold text-center">Beneficiarios</th>
                                <th className="px-4 py-3 font-bold">Fecha</th>
                                <th className="px-4 py-3 font-bold">Evidencia</th>
                                <th className="px-4 py-3 font-bold">Estatus</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#D8E2F0]">
                              {activityUsers.map((reg: any) => (
                                <tr key={reg.id} className="hover:bg-[#F4F6FA] transition-colors">
                                  <td className="px-4 py-3">
                                    <div className="font-bold text-[#1A2340]">{reg.user_organization || `${reg.user_name} ${reg.user_last_name}`}</div>
                                    <div className="text-xs text-[#9AA3B4] mt-0.5">{reg.user_email}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border ${
                                      reg.activity_type === 'Institucional'
                                        ? 'bg-[#0044B5]/10 text-[#0044B5] border-[#0044B5]/30'
                                        : reg.activity_type === 'Corporativa'
                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                      {reg.activity_type || 'N/D'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center font-bold text-[#0044B5]">
                                    {reg.volunteer_count || '—'}
                                  </td>
                                  <td className="px-4 py-3 text-center font-bold text-[#4A5568]">
                                    {reg.duration_hours ? `${reg.duration_hours}h` : '—'}
                                  </td>
                                  <td className="px-4 py-3 text-center font-bold text-[#FFBA00]">
                                    {reg.beneficiaries_count || '—'}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-[#4A5568]">
                                    {reg.execution_date || reg.scheduled_date || 'N/D'}
                                  </td>
                                  <td className="px-4 py-3">
                                    {reg.evidence_links ? (
                                      <a href={reg.evidence_links} target="_blank" rel="noreferrer"
                                        className="text-[#0044B5] text-xs font-bold underline hover:text-[#FFBA00] transition-colors">
                                        Ver evidencia ↗
                                      </a>
                                    ) : <span className="text-xs text-[#9AA3B4]">Sin enlace</span>}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border ${
                                      reg.status === 'approved'
                                        ? 'bg-green-100 text-green-700 border-green-300'
                                        : reg.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                        : 'bg-red-100 text-red-700 border-red-300'
                                    }`}>
                                      {reg.status === 'approved' ? 'Aprobado' : reg.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities'    && <ActivityManager token={token!} />}
          {activeTab === 'corporates'    && <CorporateManager token={token!} />}
          {activeTab === 'registrations' && <RegistrationManager token={token!} />}
          {activeTab === 'users'         && (
            <div className="flex-1 flex flex-col min-h-0">
              <UserManager token={token!} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   COMPONENTE TARJETA DE MÉTRICA
══════════════════════════════════════════ */
function MetricCard({
  title, value, icon, color
}: {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'gold' | 'alert' | 'muted';
}) {
  const colorMap = {
    blue:  'border-[#0044B5]/20 bg-white',
    gold:  'border-[#FFBA00]/30 bg-white',
    alert: 'border-[#FFBA00] bg-[#FFFBEB] shadow-[0_0_12px_rgba(255,186,0,0.2)]',
    muted: 'border-[#D8E2F0] bg-white',
  };
  const valueColor = {
    blue:  'text-[#0044B5]',
    gold:  'text-[#8A6400]',
    alert: 'text-[#8A6400]',
    muted: 'text-[#9AA3B4]',
  };

  return (
    <div className={`rounded-2xl border-2 p-5 transition-all shadow-sm hover:shadow-md ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="text-2xl">{icon}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-[#9AA3B4]">{title}</div>
      </div>
      <div className={`text-4xl font-black ${valueColor[color]}`}>{value}</div>
    </div>
  );
}
