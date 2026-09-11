import { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface TopCorporate {
  corporate_name: string;
  total_activities: number | string;
  total_volunteers?: number | string;
}

interface MetricsData {
  general: {
    total_volunteers: number;
    total_registrations: number;
    total_actions: number;
    total_hours: number;
    total_beneficiaries: number;
    pending_approvals: number;
  };
  top_corporates?: TopCorporate[];
  institutional: Record<string, unknown>[];
  locations: Array<{ municipality?: string; plant_name?: string; division_name?: string; total_activities?: number; count?: number | string }>;
  community_count: number;
}

export default function MetricsDashboardView({ showAdminControls = false }: { showAdminControls?: boolean }) {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const response = await fetch(`${API_URL}/api/public-metrics`, { headers });
        const res = await response.json();
        if (response.ok && isMounted) {
          setData(res.data);
        }
      } catch (e) {
        console.error("Error loading metrics", e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-12 text-center text-[#0044B5] animate-pulse font-bold font-antonio uppercase tracking-widest">Cargando tablero de impacto...</div>;
  if (!data) return <div className="p-12 text-center text-red-500 font-bold">Error al cargar métricas.</div>;

  // Preparar datos ordenados para el podio de Top 3
  const topList: TopCorporate[] = data.top_corporates && data.top_corporates.length > 0
    ? data.top_corporates
    : [];

  const firstPlace = topList[0] || null;
  const secondPlace = topList[1] || null;
  const thirdPlace = topList[2] || null;

  return (
    <div className="space-y-8">
      {/* Tablero Visual (Pantalla) */}
      <div className="p-8 bg-white border border-[#D8E2F0] rounded-3xl relative overflow-hidden group shadow-lg no-print">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0044B5]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#FFBA00]/10 transition-all"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h2 className="font-antonio text-2xl text-[#0044B5] uppercase tracking-wider flex items-center gap-3">
            <span className="w-8 h-1 bg-[#FFBA00] rounded-full"></span>
            Impacto Comunitario Acumulado
          </h2>
          {showAdminControls && (
            <button 
              onClick={handlePrint}
              className="btn-brand-blue px-6 py-2.5 text-xs no-print flex items-center gap-2"
            >
              <span>📄</span> GENERAR REPORTE PDF
            </button>
          )}
        </div>
        
        <div className={`grid grid-cols-1 ${showAdminControls ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-10`}>
          <div className="relative group/stat flex flex-col items-center text-center md:items-start md:text-left pl-0 md:pl-6 border-l-0 md:border-l-4 border-[#0044B5]">
            <p className="text-6xl font-antonio text-[#0044B5] mb-1 group-hover/stat:text-[#FFBA00] transition-colors">
              {data.general.total_volunteers.toLocaleString()}
            </p>
            <p className="text-xs text-[#4A5568] uppercase font-bold tracking-[0.2em]">Voluntarios</p>
          </div>
          
          <div className="relative group/stat flex flex-col items-center text-center md:items-start md:text-left pl-0 md:pl-6 border-l-0 md:border-l-4 border-[#FFBA00]">
            <p className="text-6xl font-antonio text-[#0044B5] mb-1 group-hover/stat:text-[#FFBA00] transition-colors">
              {data.general.total_actions.toLocaleString()}
            </p>
            <p className="text-xs text-[#4A5568] uppercase font-bold tracking-[0.2em]">Actividades</p>
          </div>
          
          <div className="relative group/stat flex flex-col items-center text-center md:items-start md:text-left pl-0 md:pl-6 border-l-0 md:border-l-4 border-[#002D7A]">
            <p className="text-6xl font-antonio text-[#0044B5] mb-1 group-hover/stat:text-[#FFBA00] transition-colors">
              {Math.round(data.general.total_hours).toLocaleString()}
            </p>
            <p className="text-xs text-[#4A5568] uppercase font-bold tracking-[0.2em]">Horas de Impacto</p>
          </div>

          {showAdminControls && (
            <div className="relative group/stat flex flex-col items-center text-center md:items-start md:text-left pl-0 md:pl-6 border-l-0 md:border-l-4 border-[#FFBA00]/60">
              <p className="text-6xl font-antonio text-[#FFBA00] mb-1 group-hover/stat:text-[#0044B5] transition-colors">
                {data.general.total_beneficiaries.toLocaleString()}
              </p>
              <p className="text-xs text-[#4A5568] uppercase font-bold tracking-[0.2em]">Beneficiarios</p>
            </div>
          )}
        </div>
      </div>

      {/* ── RANKING GAMIFICADO: TOP 3 CORPORATIVOS [TKT-UW-010] ── */}
      <div className="p-8 sm:p-10 bg-gradient-to-br from-[#002D7A] via-[#0044B5] to-[#001D4D] rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden no-print">
        {/* Resplandores y elementos gráficos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBA00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/15">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFBA00]/20 border border-[#FFBA00]/30 text-[#FFBA00] text-xs font-black uppercase tracking-widest mb-2">
                <span>🏆</span> Gamificación e Incidencia
              </div>
              <h3 className="font-antonio text-3xl sm:text-5xl text-white uppercase tracking-tight">
                Top 3 Corporativos Más Participativos
              </h3>
              <p className="text-white/80 text-sm mt-1.5 max-w-xl">
                Empresas líderes con mayor número de actividades registradas en la campaña &quot;A Limpiar el Mundo 2026&quot;.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs font-bold text-white/90 self-start md:self-auto flex items-center gap-2 shadow-inner">
              <span className="text-[#FFBA00]">★ Métrica Oficial:</span>
              <span>Cantidad de Actividades</span>
            </div>
          </div>

          {/* Podio Gamificado (Escalonado: 2º Plata, 1º Oro, 3º Bronce) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

            {/* 🥈 2DO LUGAR (Plata) */}
            <div className="order-2 md:order-1 flex flex-col items-center">
              <div className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-slate-300/30 rounded-3xl p-6 text-center transition-all transform hover:-translate-y-1 shadow-lg">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-200 border-2 border-slate-300 text-slate-700 flex items-center justify-center text-2xl font-black shadow-md mb-3">
                  🥈
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-300 block mb-1">
                  2° Lugar
                </span>
                <h4 className="font-extrabold text-lg sm:text-xl text-white truncate max-w-full px-2" title={secondPlace?.corporate_name || 'Disponible'}>
                  {secondPlace ? secondPlace.corporate_name : 'Por definir'}
                </h4>

                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-1">
                  <div className="bg-slate-200/20 px-3 py-1 rounded-full text-xs font-black text-white">
                    {secondPlace ? `${secondPlace.total_activities} Actividades` : '—'}
                  </div>
                  {secondPlace && secondPlace.total_volunteers && (
                    <span className="text-[11px] text-white/70 font-medium">
                      👥 {secondPlace.total_volunteers} voluntarios
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden md:flex w-full h-20 bg-slate-300/20 rounded-b-2xl border-t border-slate-300/30 items-center justify-center text-slate-300 font-antonio text-3xl font-black">
                2
              </div>
            </div>

            {/* 🥇 1ER LUGAR (Oro - Destacado Central) */}
            <div className="order-1 md:order-2 flex flex-col items-center">
              <div className="w-full bg-gradient-to-b from-[#FFBA00]/25 via-white/15 to-white/10 backdrop-blur-lg border-2 border-[#FFBA00] rounded-3xl p-7 text-center transition-all transform hover:-translate-y-2 shadow-[0_20px_50px_rgba(255,186,0,0.25)] relative">
                {/* Corona de Líder */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FFBA00] text-[#002D7A] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <span>👑</span> Líder de Campaña
                </div>

                <div className="w-20 h-20 mx-auto rounded-full bg-[#FFBA00] text-[#002D7A] flex items-center justify-center text-4xl font-black shadow-xl mb-3 mt-2 border-4 border-white/40">
                  🥇
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FFBA00] block mb-1">
                  1° Lugar
                </span>
                <h4 className="font-black text-xl sm:text-2xl text-white truncate max-w-full px-2" title={firstPlace?.corporate_name || 'Disponible'}>
                  {firstPlace ? firstPlace.corporate_name : 'Por definir'}
                </h4>

                <div className="mt-4 pt-4 border-t border-white/20 flex flex-col items-center gap-1">
                  <div className="bg-[#FFBA00] px-4 py-1.5 rounded-full text-sm font-black text-[#002D7A] shadow-md">
                    {firstPlace ? `${firstPlace.total_activities} Actividades Registradas` : 'En disputa'}
                  </div>
                  {firstPlace && firstPlace.total_volunteers && (
                    <span className="text-xs text-white/90 font-bold mt-0.5">
                      👥 {firstPlace.total_volunteers} personas movilizadas
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden md:flex w-full h-32 bg-[#FFBA00]/25 rounded-b-2xl border-t-2 border-[#FFBA00] items-center justify-center text-[#FFBA00] font-antonio text-5xl font-black shadow-inner">
                1
              </div>
            </div>

            {/* 🥉 3ER LUGAR (Bronce) */}
            <div className="order-3 md:order-3 flex flex-col items-center">
              <div className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-amber-600/30 rounded-3xl p-6 text-center transition-all transform hover:-translate-y-1 shadow-lg">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-700/80 border-2 border-amber-500 text-amber-100 flex items-center justify-center text-2xl font-black shadow-md mb-3">
                  🥉
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 block mb-1">
                  3° Lugar
                </span>
                <h4 className="font-extrabold text-lg sm:text-xl text-white truncate max-w-full px-2" title={thirdPlace?.corporate_name || 'Disponible'}>
                  {thirdPlace ? thirdPlace.corporate_name : 'Por definir'}
                </h4>

                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-1">
                  <div className="bg-amber-600/30 px-3 py-1 rounded-full text-xs font-black text-white">
                    {thirdPlace ? `${thirdPlace.total_activities} Actividades` : '—'}
                  </div>
                  {thirdPlace && thirdPlace.total_volunteers && (
                    <span className="text-[11px] text-white/70 font-medium">
                      👥 {thirdPlace.total_volunteers} voluntarios
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden md:flex w-full h-14 bg-amber-700/20 rounded-b-2xl border-t border-amber-600/30 items-center justify-center text-amber-400 font-antonio text-2xl font-black">
                3
              </div>
            </div>

          </div>

          {topList.length === 0 && (
            <div className="text-center mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/80 font-semibold">
                El ranking se actualizará automáticamente conforme los comités de responsabilidad social y voluntariado corporativo registren sus actividades.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REPORTE PARA IMPRESIÓN */}
      <div className="only-print p-12 bg-white text-black min-h-[1056px] w-[816px] mx-auto border-8 border-[#0044B5]">
        <div className="flex justify-between items-center border-b-8 border-[#FFBA00] pb-8 mb-10">
          <div className="flex flex-col">
            <h1 className="font-antonio text-5xl font-black text-[#0044B5] leading-none mb-2">REPORTE DE IMPACTO</h1>
            <p className="font-antonio text-xl font-bold text-[#FFBA00] tracking-[0.4em]">A LIMPIAR EL MUNDO</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right border-r-2 pr-6 border-[#D8E2F0]">
              <p className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Fecha de Emisión</p>
              <p className="text-sm font-bold">{new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <img src="/logo-a-limpiar-el-mundo.png" alt="Logo A Limpiar el Mundo" className="h-16 w-auto bg-[#0044B5] p-2 rounded-lg object-contain" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-14">
          <div className="bg-[#F4F6FA] p-8 rounded-[2rem] border border-[#D8E2F0]">
            <h3 className="font-antonio text-[#0044B5] font-black text-lg uppercase mb-6 tracking-wider">RESUMEN GENERAL</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-end border-b-2 border-[#0044B5]/10 pb-2">
                <span className="text-sm text-slate-600 font-bold uppercase">Voluntarios:</span>
                <span className="text-2xl font-antonio text-[#0044B5]">{data.general.total_volunteers}</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-[#0044B5]/10 pb-2">
                <span className="text-sm text-slate-600 font-bold uppercase">Actividades:</span>
                <span className="text-2xl font-antonio text-[#0044B5]">{data.general.total_actions}</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-[#0044B5]/10 pb-2">
                <span className="text-sm text-slate-600 font-bold uppercase">Horas Totales:</span>
                <span className="text-2xl font-antonio text-[#0044B5]">{Math.round(data.general.total_hours)}</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-[#FFBA00]/20 pb-2">
                <span className="text-sm text-slate-600 font-bold uppercase">Beneficiarios:</span>
                <span className="text-2xl font-antonio text-[#FFBA00]">{data.general.total_beneficiaries}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0044B5] p-8 rounded-[2rem] text-white">
            <h3 className="font-antonio text-[#FFBA00] font-black text-lg uppercase mb-6 tracking-wider">DESGLOSE DE CAUSAS</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-bold opacity-80 uppercase">Causas Institucionales:</span>
                <span className="font-antonio text-xl">{data.institutional.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold opacity-80 uppercase">Movilizaciones Libres:</span>
                <span className="font-antonio text-xl">{data.community_count}</span>
              </div>
              <div className="pt-6 mt-6 border-t border-white/20">
                <p className="text-[10px] opacity-60 italic leading-relaxed">Este reporte certifica el impacto social y ambiental generado a través de la campaña A Limpiar el Mundo impulsada por United Way Chihuahua.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Corporativos en Impresión */}
        {topList.length > 0 && (
          <div className="mb-14">
            <h3 className="font-antonio text-[#0044B5] font-black text-lg uppercase mb-4 tracking-wider flex items-center gap-3">
              <span className="w-6 h-6 bg-[#FFBA00] rounded-full flex items-center justify-center text-xs">★</span>
              Top 3 Corporativos Más Participativos
            </h3>
            <div className="rounded-3xl overflow-hidden border border-[#D8E2F0]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#002D7A] text-white font-antonio uppercase tracking-widest text-xs">
                    <th className="p-3.5 text-center w-16">Lugar</th>
                    <th className="p-3.5">Empresa / Corporativo</th>
                    <th className="p-3.5 text-center">Actividades Registradas</th>
                    <th className="p-3.5 text-center">Voluntarios</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8E2F0]">
                  {topList.map((corp, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F4F6FA]'}>
                      <td className="p-3.5 text-center font-black text-base">
                        {index === 0 ? '🥇 1°' : index === 1 ? '🥈 2°' : '🥉 3°'}
                      </td>
                      <td className="p-3.5 font-bold text-[#1A2340] text-xs uppercase">{corp.corporate_name}</td>
                      <td className="p-3.5 text-center font-antonio text-xl text-[#0044B5] font-black">{corp.total_activities}</td>
                      <td className="p-3.5 text-center font-bold text-slate-700 text-xs">{corp.total_volunteers || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mb-14">
          <h3 className="font-antonio text-[#0044B5] font-black text-lg uppercase mb-6 tracking-wider flex items-center gap-3">
             <span className="w-6 h-6 bg-[#FFBA00] rounded-full"></span>
             Impacto Geográfico
          </h3>
          <div className="rounded-3xl overflow-hidden border border-[#D8E2F0]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#002D7A] text-white font-antonio uppercase tracking-widest">
                  <th className="p-4">Municipio</th>
                  <th className="p-4 text-center">Intervenciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8E2F0]">
                {data.locations.map((loc, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F4F6FA]'}>
                    <td className="p-4 font-bold text-[#1A2340] uppercase text-xs">{loc.municipality || 'No especificado'}</td>
                    <td className="p-4 text-center font-antonio text-xl text-[#0044B5]">{loc.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-auto pt-16 border-t-2 border-[#D8E2F0] text-center">
          <p className="font-antonio text-[#FFBA00] text-lg font-black uppercase tracking-[0.5em] mb-10">Unidos somos más fuertes</p>
          <div className="flex justify-center gap-20">
             <div className="text-center">
                <div className="w-48 h-[2px] bg-[#0044B5] mb-3"></div>
                <p className="font-antonio text-[10px] text-[#4A5568] uppercase tracking-widest">Dirección de Comunidad</p>
             </div>
             <div className="text-center">
                <div className="w-48 h-[2px] bg-[#0044B5] mb-3"></div>
                <p className="font-antonio text-[10px] text-[#4A5568] uppercase tracking-widest">Validación United Way</p>
             </div>
          </div>
          <div className="mt-12 flex items-center justify-center gap-4">
             <div className="h-[1px] flex-1 bg-[#D8E2F0]"></div>
             <p className="font-antonio text-[10px] text-[#0044B5] font-black uppercase tracking-widest px-4">A Limpiar el Mundo · United Way Chihuahua © 2026</p>
             <div className="h-[1px] flex-1 bg-[#D8E2F0]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
