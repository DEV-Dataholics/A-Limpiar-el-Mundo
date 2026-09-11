import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DynamicRegistrationForm from '../components/DynamicRegistrationForm';
import ProfileForm from '../components/ProfileForm';
import { API_URL } from '../config';

export default function DashboardView() {
  const { user, token, logout, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<'events' | 'profile' | 'form'>('events');
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    if (currentTab === 'events' && token) {
      setLoadingEvents(true);
      fetch(`${API_URL}/api/registrations/my-events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        const events = Array.isArray(data) ? data : (data.data || []);
        setUserEvents(events);
      })
      .catch(err => console.error("Error fetching events:", err))
      .finally(() => setLoadingEvents(false));
    }
  }, [currentTab, token]);

  // Manejador para cerrar modal con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    if (selectedEvent) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  const tabs = [
    { id: 'events',  label: 'Mis Eventos' },
    { id: 'profile', label: 'Mi Perfil' },
    { id: 'form',    label: 'Registrar Movilización' },
  ] as const;

  return (
    <div className="h-screen h-[100dvh] bg-[#F4F6FA] flex flex-col overflow-hidden">

      {/* ── TOPBAR INSTITUCIONAL #0044B5 ── */}
      <header className="bg-[#0044B5] shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo + marca */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-4 group transition-transform hover:scale-105">
              <img
                src="/logo-uwch-35-white-color.png"
                alt="United Way Chihuahua 35 Aniversario"
                className="h-10 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="h-10 w-[2px] bg-[#FFBA00] mx-1 hidden sm:block"></div>
              <img
                src="/logo-a-limpiar-el-mundo.png"
                alt="A Limpiar el Mundo 2026"
                className="h-9 object-contain bg-white px-2 py-1 rounded-xl shadow-sm"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </Link>
          </div>

          {/* Saludo + controles */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#002D7A] rounded-full border border-white/10 shadow-inner group">
              <div className="w-6 h-6 bg-[#FFBA00] rounded-full flex items-center justify-center text-[#002D7A] text-[10px] font-black">
                {user?.name?.charAt(0)}{user?.last_name?.charAt(0)}
              </div>
              <span className="text-white text-xs font-bold uppercase tracking-widest">
                {user?.name} {user?.last_name}
              </span>
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-[#FFBA00] text-[#0044B5] text-sm font-black uppercase rounded-full hover:bg-white transition-all shadow-md"
              >
                🛠️ Admin
              </Link>
            )}
            <button
              onClick={logout}
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              Salir →
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENEDOR DESPLAZABLE ── */}
      <div className="flex-1 overflow-y-auto min-w-0">
        
        {/* ── NAVEGACIÓN DE PESTAÑAS ── */}
      <div className="bg-white border-b border-[#D8E2F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                  currentTab === tab.id
                    ? 'border-[#0044B5] text-[#0044B5]'
                    : 'border-transparent text-[#4A5568] hover:text-[#0044B5] hover:border-[#0044B5]/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── PERFIL ── */}
        {currentTab === 'profile' && (
          <ProfileForm onSaved={() => setCurrentTab('events')} />
        )}

        {/* ── MIS EVENTOS ── */}
        {currentTab === 'events' && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#D8E2F0] overflow-hidden">
            {/* Cabecera de sección */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-[#D8E2F0] bg-[#F4F6FA]">
              <div>
                <h2 className="font-antonio text-2xl text-[#0044B5] uppercase">
                  Mis Eventos y Movilizaciones
                </h2>
                <p className="text-sm text-[#4A5568] mt-0.5">
                  Tus causas institucionales y movilizaciones corporativas reportadas.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('form')}
                className="btn-brand-gold px-5 py-2.5 rounded-full text-sm font-black uppercase shadow-md"
              >
                + Nuevo Evento
              </button>
            </div>

            {/* Lista de eventos */}
            <div className="p-8">
              {loadingEvents ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-[#0044B5] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : userEvents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-[#EEF2FB] flex items-center justify-center mx-auto mb-5">
                    <svg className="w-10 h-10 text-[#0044B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-antonio text-xl text-[#0044B5] uppercase mb-2">
                    No tienes eventos registrados
                  </h3>
                  <p className="text-[#4A5568] mb-6">
                    Comienza creando tu primer evento y ayuda a tu comunidad.
                  </p>
                  <button
                    onClick={() => setCurrentTab('form')}
                    className="btn-brand-gold px-8 py-3 rounded-full font-black uppercase text-sm shadow-lg"
                  >
                    Crear mi primer evento
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userEvents.map((event) => {
                    const volunteers = parseInt(event.total_volunteers || event.volunteer_count || 1);
                    const hours = parseFloat(event.individual_hours_duration || event.duration_hours || 0);
                    const totalImpactHours = (volunteers * hours).toFixed(1);
                    const hasEvidence = Boolean(event.evidence_image_url || event.evidence_links);
                    const eventDate = event.registration_date || event.scheduled_date;

                    return (
                      <div
                        key={event.id}
                        className="card-brand overflow-hidden flex flex-col hover:border-[#0044B5]/40 hover:shadow-xl transition-all group"
                      >
                        {/* Imagen / Header Visual */}
                        <div className="h-40 bg-[#EEF2FB] relative overflow-hidden">
                          {event.evidence_image_url && (event.evidence_image_url.startsWith('http') || event.evidence_image_url.startsWith('/')) && !event.evidence_image_url.includes('drive.google') ? (
                            <img
                              src={event.evidence_image_url}
                              alt={event.title || event.custom_activity_name || 'Actividad registrada'}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EEF2FB] via-[#E2E8F5] to-[#D8E2F0] overflow-hidden">
                              <div className="relative transform group-hover:scale-110 transition-transform duration-500 text-center">
                                <svg className="w-12 h-12 text-[#0044B5] mx-auto opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-[10px] font-black text-[#0044B5] uppercase tracking-widest mt-1 block opacity-60">
                                  {event.modality || event.activity_type || 'Movilización'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Badge de estado */}
                          <div className={`absolute top-2.5 right-2.5 px-2.5 py-1 text-[10px] font-black uppercase rounded-full border shadow-sm backdrop-blur-md ${
                            event.status === 'approved'
                              ? 'bg-green-50/95 border-green-500 text-green-800'
                              : event.status === 'pending'
                              ? 'bg-yellow-50/95 border-yellow-500 text-yellow-800'
                              : 'bg-red-50/95 border-red-500 text-red-800'
                          }`}>
                            {event.status === 'approved' ? '✓ APROBADO'
                              : event.status === 'pending' ? '⏳ PENDIENTE'
                              : '✕ RECHAZADO'}
                          </div>

                          {/* Badge de evidencia */}
                          {hasEvidence && (
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#0044B5]/90 text-white text-[10px] font-bold rounded-full backdrop-blur-md flex items-center gap-1 shadow-sm">
                              <span>📸</span>
                              <span>Con Evidencias</span>
                            </div>
                          )}
                        </div>

                        {/* Contenido de la Tarjeta */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="text-[10px] font-black text-[#0044B5] uppercase bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                {event.modality || event.activity_type || 'Corporativa'}
                              </span>
                              {event.corporate_name && (
                                <span className="text-[10px] font-bold text-slate-500 truncate max-w-[170px]" title={event.corporate_name}>
                                  🏢 {event.corporate_name}
                                </span>
                              )}
                            </div>

                            <h3 className="font-bold text-base leading-tight text-[#1A2340] mb-2 line-clamp-2" title={event.title || event.custom_activity_name || event.description}>
                              {event.title || event.custom_activity_name || 'Movilización Comunitaria'}
                            </h3>

                            {eventDate && (
                              <div className="flex items-center text-xs text-[#4A5568] mb-1 font-medium">
                                <span className="mr-1.5">📅</span>
                                {new Date(eventDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </div>
                            )}

                            {/* Resumen de Voluntarios e Impacto en Tarjeta */}
                            <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Voluntarios</span>
                                <span className="font-extrabold text-[#0044B5] text-sm flex items-center gap-1">
                                  👥 {volunteers}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Horas Totales</span>
                                <span className="font-extrabold text-[#1A2340] text-sm flex items-center gap-1">
                                  ⚡ {totalImpactHours}h
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Botón para Abrir Detalle Completo */}
                          <button
                            type="button"
                            onClick={() => setSelectedEvent(event)}
                            className="w-full mt-2 py-2.5 px-4 bg-[#EEF2FB] hover:bg-[#0044B5] text-[#0044B5] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                          >
                            <span>Ver Registro y Evidencias</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODAL: VISIBILIDAD DE INFORMACIÓN Y ENLACES DE EVIDENCIA [TKT-UW-009] ── */}
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 bg-[#001D4D]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full overflow-hidden my-8 transform animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del Modal */}
              <div className="bg-[#0044B5] px-6 py-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">
                    📋
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FFBA00] bg-white/10 px-2 py-0.5 rounded">
                        Registro #{selectedEvent.id}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        selectedEvent.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-200'
                          : selectedEvent.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-200'
                          : 'bg-red-500/20 text-red-200'
                      }`}>
                        {selectedEvent.status === 'approved' ? 'Aprobado' : selectedEvent.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black mt-1 text-white leading-snug">
                      {selectedEvent.title || selectedEvent.custom_activity_name || 'Detalle de la Actividad'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Cuerpo del Modal */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

                {/* Resumen Métrico de Voluntariado */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-[#EEF2FB] border border-[#D8E2F0] text-center">
                    <span className="text-[11px] font-extrabold text-[#0044B5] uppercase tracking-wider block">
                      Total Personas
                    </span>
                    <span className="text-3xl font-black text-[#0044B5] mt-1 block">
                      {selectedEvent.total_volunteers || selectedEvent.volunteer_count || 1}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Voluntarios participantes</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider block">
                      Duración
                    </span>
                    <span className="text-3xl font-black text-amber-900 mt-1 block">
                      {selectedEvent.individual_hours_duration || selectedEvent.duration_hours || 0}
                      <span className="text-base font-bold ml-1">hrs</span>
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">Por cada persona</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                      Horas Totales
                    </span>
                    <span className="text-3xl font-black text-emerald-900 mt-1 block">
                      {(
                        parseInt(selectedEvent.total_volunteers || selectedEvent.volunteer_count || 1) *
                        parseFloat(selectedEvent.individual_hours_duration || selectedEvent.duration_hours || 0)
                      ).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">Horas de impacto</span>
                  </div>
                </div>

                {/* Detalles de la Actividad y Empresa */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Modalidad</span>
                      <span className="font-extrabold text-[#1A2340] text-sm">
                        {selectedEvent.modality || selectedEvent.activity_type || 'Corporativa'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Fecha de Actividad</span>
                      <span className="font-extrabold text-[#1A2340] text-sm">
                        {selectedEvent.registration_date || selectedEvent.scheduled_date
                          ? new Date(selectedEvent.registration_date || selectedEvent.scheduled_date).toLocaleDateString('es-MX', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'No especificada'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Empresa / Organización</span>
                      <span className="font-bold text-slate-800">
                        {selectedEvent.corporate_name || selectedEvent.group_name || 'No especificada'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Planta / División</span>
                      <span className="font-bold text-slate-800">
                        {selectedEvent.plant_name
                          ? `${selectedEvent.plant_name} ${selectedEvent.division_name ? `(${selectedEvent.division_name})` : ''}`
                          : 'General / No asignada'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Acompañamiento UW Chihuahua</span>
                      <span className="font-bold text-slate-800">
                        {selectedEvent.accompanied_by_fuch ? '✅ Sí hubo acompañamiento' : '❌ Sin acompañamiento'}
                      </span>
                    </div>

                    {selectedEvent.location_name && (
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[10px] block">Lugar / Ubicación</span>
                        <span className="font-bold text-slate-800">{selectedEvent.location_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Descripción o Bitácora */}
                  {selectedEvent.description && (
                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Descripción / Bitácora</span>
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* ── SECCIÓN DE EVIDENCIAS FOTOGRÁFICAS ── */}
                <div className="border-t border-slate-200 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-black text-[#1A2340] uppercase tracking-wider flex items-center gap-2">
                      <span>📸</span> Evidencias Fotográficas del Voluntariado
                    </h4>
                    {selectedEvent.evidence_image_url && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Disponible
                      </span>
                    )}
                  </div>

                  {selectedEvent.evidence_image_url ? (
                    <div className="space-y-3">
                      {/* Si es una imagen web o subida a servidor */}
                      {(selectedEvent.evidence_image_url.startsWith('http') || selectedEvent.evidence_image_url.startsWith('/')) &&
                      !selectedEvent.evidence_image_url.includes('drive.google') &&
                      !selectedEvent.evidence_image_url.includes('onedrive') &&
                      !selectedEvent.evidence_image_url.includes('dropbox') ? (
                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative group">
                          <img
                            src={selectedEvent.evidence_image_url}
                            alt="Evidencia fotográfica"
                            className="w-full max-h-72 object-cover"
                          />
                          <div className="p-3 bg-white flex items-center justify-between gap-3 border-t border-slate-100">
                            <span className="text-xs text-slate-500 font-medium truncate">
                              Fotografía oficial de la actividad
                            </span>
                            <a
                              href={selectedEvent.evidence_image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#0044B5] text-white text-xs font-bold rounded-lg hover:bg-[#002D7A] transition-colors flex items-center gap-1.5 flex-shrink-0"
                            >
                              <span>Ver tamaño completo</span>
                              <span>↗</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        /* Si es un enlace a Drive, Dropbox o álbum externo */
                        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-[#0044B5] text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                              📁
                            </div>
                            <div>
                              <p className="text-xs font-black text-[#0044B5] uppercase tracking-wider">
                                Carpeta o Enlace de Fotografías Compartido
                              </p>
                              <p className="text-xs text-slate-600 font-medium truncate max-w-sm sm:max-w-md mt-0.5">
                                {selectedEvent.evidence_image_url}
                              </p>
                            </div>
                          </div>
                          <a
                            href={selectedEvent.evidence_image_url.startsWith('http') ? selectedEvent.evidence_image_url : `https://${selectedEvent.evidence_image_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-brand-gold px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md hover:scale-105 transition-all w-full sm:w-auto justify-center"
                          >
                            <span>Abrir Fotografías</span>
                            <span>↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500">
                      <p className="text-xs font-semibold">
                        No se adjuntaron fotografías o enlaces de evidencia en este registro.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Los coordinadores pueden contactar a United Way Chihuahua si requieren anexar evidencia posterior.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Footer del Modal */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Cerrar Ventana
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── FORMULARIO ── */}
        {currentTab === 'form' && (
          <div>
            <button
              onClick={() => setCurrentTab('events')}
              className="mb-6 flex items-center gap-2 text-[#0044B5] font-semibold hover:text-[#FFBA00] transition-colors"
            >
              ← Volver a Mis Eventos
            </button>
            <DynamicRegistrationForm />
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
