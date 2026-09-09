import { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface MetricsData {
  general: {
    total_volunteers: number;
    total_registrations: number;
    total_actions: number;
    total_hours: number;
    total_beneficiaries: number;
    pending_approvals: number;
  };
  institutional: Record<string, unknown>[];
  locations: Record<string, unknown>[];
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

  return (
    <div className="space-y-8">
      {/* Tablero Visual (Pantalla) */}
      <div className="p-8 bg-white border border-[#D8E2F0] rounded-3xl relative overflow-hidden group shadow-lg no-print">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0044B5]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#FFBA00]/10 transition-all"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h2 className="font-antonio text-2xl text-[#0044B5] uppercase tracking-wider flex items-center gap-3">
            <span className="w-8 h-1 bg-[#FFBA00] rounded-full"></span>
            Impacto Comunitario
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
