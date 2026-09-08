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
                src="/image.png"
                alt="United Way"
                className="h-10 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="h-10 w-[2px] bg-[#FFBA00] mx-1 hidden sm:block"></div>
              <img
                src="/somoscomunidad-logo.png"
                alt="Somos Comunidad"
                className="h-8 object-contain brightness-0 invert"
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
                  Tus causas institucionales y movilizaciones propias registradas.
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {userEvents.map((event) => (
                    <div
                      key={event.id}
                      className="card-brand overflow-hidden flex flex-col"
                    >
                      {/* Imagen / placeholder */}
                      <div className="h-36 bg-[#EEF2FB] relative">
                        {(event.activity_type === 'Institucional' && event.image_url) || event.evidence_image_url ? (
                          <img
                            src={event.evidence_image_url || event.image_url}
                            alt={event.title || event.custom_activity_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EEF2FB] to-[#D8E2F0] overflow-hidden group">
                            <div className="relative transform group-hover:scale-110 transition-transform duration-500">
                              {/* Círculos de fondo animados */}
                              <div className="absolute inset-0 bg-[#0044B5]/5 rounded-full scale-150 animate-pulse" />
                              <div className="absolute inset-0 bg-[#0044B5]/5 rounded-full scale-125 animate-pulse delay-75" />
                              
                              <svg className="w-12 h-12 text-[#0044B5] relative z-10 animate-bounce-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <span className="absolute bottom-2 left-0 w-full text-center font-antonio text-[10px] text-[#0044B5] uppercase tracking-[0.2em] opacity-30">
                              {event.activity_type}
                            </span>
                          </div>
                        )}
                        {/* Badge de estado */}
                        <div className={`absolute top-2 right-2 px-3 py-1 text-[10px] font-black uppercase rounded-full border ${
                          event.status === 'approved'
                            ? 'bg-green-50 border-green-400 text-green-700'
                            : event.status === 'pending'
                            ? 'bg-yellow-50 border-yellow-400 text-yellow-700'
                            : 'bg-red-50 border-red-400 text-red-700'
                        }`}>
                          {event.status === 'approved' ? '✅ APROBADO'
                            : event.status === 'pending' ? '⏳ PENDIENTE'
                            : '❌ RECHAZADO'}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="text-[10px] font-black text-[#FFBA00] tracking-widest uppercase mb-1 bg-[#FFBA00]/10 inline-block px-2 py-0.5 rounded w-fit">
                          {event.activity_id == 9 ? 'Movilización Propia' : 'Causa Oficial'}
                        </div>
                        <h3 className="font-bold text-base leading-tight text-[#1A2340] mt-1 mb-2">
                          {event.title || event.custom_activity_name}
                        </h3>
                        {event.scheduled_date && (
                          <div className="flex items-center text-sm text-[#4A5568] mb-1">
                            <span className="mr-2 opacity-60">📅</span>
                            {new Date(event.scheduled_date).toLocaleDateString('es-MX')}
                          </div>
                        )}
                        {event.location_name && (
                          <div className="flex items-center text-sm text-[#4A5568]">
                            <span className="mr-2 opacity-60">📍</span>
                            {event.location_name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
