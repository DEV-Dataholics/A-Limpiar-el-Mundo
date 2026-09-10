import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetricsDashboardView from './MetricsDashboardView';
import Navbar from '../components/Navbar';
import { BotanicalPlant, BotanicalSprout, BotanicalCactus } from '../components/BotanicalPlant';

export default function LandingView() {
  // URLs de assets institucionales oficiales
  const alemLogo = '/logo-a-limpiar-el-mundo.png';

  // Fotografías oficiales de campaña (Docs A Limpiar el Mundo 2025)
  const campaignPhotos = [
    { src: '/campana-07.jpg', alt: 'Jornada Principal 2025' },
    { src: '/campana-04.jpg', alt: 'Movilización Comunitaria 2025' },
    { src: '/campana-08.jpg', alt: 'Recuperación Activa 2025' }
  ];

  const [activePhoto, setActivePhoto] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Estado para efecto parallax 3D en el CTA Intermedio
  const [ctaMousePos, setCtaMousePos] = useState({ x: 0, y: 0 });
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Seguimiento suave del cursor normalizado (-1 a 1)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setCtaMousePos({ x, y });
  };

  // Rotación automática sutil de fotos si el usuario no interactúa
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % campaignPhotos.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isHovered, campaignPhotos.length]);

  // Factores de inclinación 3D (tilt)
  const tiltX = -mousePos.y * 6;
  const tiltY = mousePos.x * 8;
  const shiftX = mousePos.x * 10;
  const shiftY = mousePos.y * 8;

  // 11 Espacios públicos autorizados
  const espaciosPublicos = [
    'Parques públicos',
    'Áreas verdes públicas',
    'Plazas públicas',
    'Camellones',
    'Banquetas y calles de la colonia',
    'Alrededores de escuelas',
    'Canchas y espacios deportivos',
    'Senderos y ciclovías',
    'Paraderos de transporte público',
    'Áreas recreativas',
    'Alrededores de centros comunitarios'
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans selection:bg-[#FFBA00]/30 selection:text-[#0044B5]">
      {/* Navbar Institucional Reutilizable */}
      <Navbar />

      <main>
        {/* Nuevo Hero Impactante e Interactivo con Parallax 3D */}
        <section
          ref={heroRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative min-h-[90vh] bg-gradient-to-br from-[#FFFFFF] via-[#F8FBFA] to-[#EEF5FF] overflow-hidden flex items-center py-16 lg:py-24 border-b border-[#D8E2F0]"
        >
          {/* Ondas Concéntricas y Resplandores Dinámicos Reactivos al Cursor */}
          <div
            className="absolute top-1/2 -translate-y-1/2 right-[-10%] w-[110vh] h-[110vh] rounded-full bg-gradient-to-br from-[#5082F0]/15 via-[#C6F7DA]/20 to-transparent z-0 pointer-events-none transition-transform ease-out duration-500"
            style={{
              transform: `translate3d(${-mousePos.x * 25}px, ${-mousePos.y * 20}px, 0)`
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 right-[-5%] w-[130vh] h-[130vh] rounded-full border border-dashed border-[#0044B5]/15 z-0 pointer-events-none transition-transform ease-out duration-700"
            style={{
              transform: `translate3d(${-mousePos.x * 15}px, ${-mousePos.y * 12}px, 0)`
            }}
          />
          <div
            className="absolute top-12 left-10 w-96 h-96 rounded-full bg-[#FFBA00]/10 blur-3xl pointer-events-none transition-transform ease-out duration-500"
            style={{
              transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 15}px, 0)`
            }}
          />

          <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Columna Izquierda: Branding, Titular y Convocatoria */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
                {/* Micro-badge institucional */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#D8E2F0] shadow-sm mb-5 animate-fade-in">
                  <span className="w-2 h-2 rounded-full bg-[#009464] animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0044B5]">
                    Campaña Anual 2026
                  </span>
                </div>

                {/* Logotipo Oficial A Limpiar el Mundo */}
                <div className="mb-4 inline-block text-center lg:text-left">
                  <img
                    src={alemLogo}
                    alt="A Limpiar el Mundo 2026"
                    className="h-28 sm:h-36 md:h-44 w-auto object-contain mx-auto lg:mx-0 animate-slide-up drop-shadow-sm transition-transform hover:scale-105"
                  />
                </div>

                {/* Titular Editorial de Alto Impacto */}
                <h1 className="font-antonio text-4xl sm:text-5xl xl:text-6xl text-[#1A2340] uppercase tracking-tight leading-[0.96] mb-5 text-center lg:text-left">
                  CAMPAÑA ANUAL <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0044B5] via-[#009464] to-[#002D7A]">
                    DE VOLUNTARIADO
                  </span>
                </h1>

                {/* Copy Oficial Esencial */}
                <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                  A Limpiar el Mundo invita a empresas, organizaciones y comunidades a colaborar en la limpieza y recuperación de espacios públicos, promoviendo la participación ciudadana, el trabajo en equipo y el cuidado del medio ambiente.
                </p>

                {/* Botones de Llamado a la Acción */}
                <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start w-full">
                  <Link
                    to="/register"
                    className="btn-brand-blue px-8 sm:px-9 py-3.5 rounded-full text-base shadow-[0_10px_24px_rgba(0,68,181,0.22)] hover:scale-105 transition-all inline-flex items-center justify-center gap-3 font-antonio uppercase tracking-wider text-white"
                  >
                    <span>ÚNETE AL MOVIMIENTO</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <a
                    href="#actividades"
                    className="border border-[#D8E2F0] hover:border-[#0044B5] bg-white/90 px-6 sm:px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#0044B5] hover:text-[#21296B] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    11 Espacios <span>↓</span>
                  </a>
                </div>
              </div>

              {/* Columna Derecha: Portal 3D Interactivo con Parallax y Fotografía Limpia */}
              <div className="lg:col-span-6 xl:col-span-5 relative max-w-lg mx-auto lg:max-w-none w-full" style={{ perspective: 1200 }}>
                {/* Ilustración Botánica Vectorizada Detrás de la Foto (Planta Principal) */}
                <BotanicalPlant
                  mousePos={mousePos}
                  isHovered={isHovered}
                  className="absolute -top-12 -right-10 sm:-top-16 sm:-right-14 md:-top-20 md:-right-16 w-64 sm:w-80 md:w-[24rem] h-64 sm:h-80 md:h-[24rem] z-0"
                />

                {/* Brote Botánico Secundario en Esquina Opuesta */}
                <BotanicalSprout
                  mousePos={mousePos}
                  isHovered={isHovered}
                  className="absolute -bottom-8 -left-8 sm:-bottom-10 sm:-left-10 w-32 sm:w-40 h-32 sm:h-40 z-0"
                />

                {/* Contenedor 3D con Inclinación Reactiva */}
                <div
                  className="relative z-10 rounded-[2.5rem] p-3 sm:p-4 bg-white/90 backdrop-blur-md border border-white shadow-[0_30px_70px_rgba(0,68,181,0.18)] transition-all ease-out"
                  style={{
                    transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${shiftX}px, ${shiftY}px, 0)`,
                    transformStyle: 'preserve-3d',
                    transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                >
                  {/* Lienzo Fotográfico Limpio con Crossfade entre tomas */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/12] rounded-[2rem] overflow-hidden bg-slate-100 shadow-inner group">
                    {campaignPhotos.map((photo, idx) => (
                      <img
                        key={photo.src}
                        src={photo.src}
                        alt={photo.alt}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                          activePhoto === idx
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105 pointer-events-none'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Badge Flotante 1: Icono Cactus de Chihuahua (Profundidad z=45px) */}
                  <div
                    className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl shadow-xl border border-white/80 flex items-center justify-center transition-transform ease-out pointer-events-none"
                    style={{
                      transform: `translate3d(${mousePos.x * 22}px, ${mousePos.y * 18}px, 45px)`,
                      transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#009464]/15 flex items-center justify-center text-2xl sm:text-3xl">
                      🌵
                    </div>
                  </div>

                  {/* Badge Flotante 2: Impacto Ambiental (Profundidad z=35px) */}
                  <div
                    className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-xl border border-white/80 flex items-center gap-3 transition-transform ease-out pointer-events-none"
                    style={{
                      transform: `translate3d(${-mousePos.x * 18}px, ${-mousePos.y * 14}px, 35px)`,
                      transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#009464]/20 flex items-center justify-center text-xl">
                      🌱
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009464] block">
                        Impacto Ambiental
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        11 Tipos de Espacios
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selector sutil de fotos (Dots Minimalistas) */}
                <div className="mt-5 flex justify-center items-center gap-2.5">
                  {campaignPhotos.map((photo, idx) => (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setActivePhoto(idx)}
                      aria-label={`Ver foto ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activePhoto === idx
                          ? 'w-8 bg-[#0044B5]'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 2: ¿Qué actividades puedes registrar? y ¿Cómo registrar tu participación? */}
        <section id="actividades" className="w-full">
          <div className="flex flex-col lg:flex-row w-full">
            
            {/* Columna 1: 11 Espacios públicos autorizados */}
            <div className="w-full lg:w-1/2 bg-white p-8 md:p-14 lg:p-20 text-slate-700 relative overflow-hidden border-r border-[#F4F6FA]">
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0044B5]/5 rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
              
              <div className="relative z-10 max-w-xl mx-auto lg:ml-auto text-center lg:text-left">
                <span className="text-[#0044B5] font-bold text-xs uppercase tracking-[0.25em] mb-2 block">
                  Voluntariado en tu entorno
                </span>
                <h3 className="font-antonio text-3xl md:text-5xl uppercase tracking-wide mb-4 leading-tight text-[#0044B5]">
                  ¿QUÉ ACTIVIDADES <br/>PUEDES REGISTRAR?
                </h3>
                <p className="text-slate-600 mb-8 text-base md:text-lg font-medium leading-relaxed">
                  Cualquier acción orientada a la limpieza, dignificación y recuperación en los siguientes espacios públicos:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                  {espaciosPublicos.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F4F6FA] transition-colors">
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 border-2 border-[#009464] bg-[#C6F7DA]/30 rounded-full text-[#009464] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm md:text-base font-semibold leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna 2: Cómo registrar tu participación */}
            <div className="w-full lg:w-1/2 bg-[#FD372C] p-8 md:p-14 lg:p-20 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
              
              <div className="relative z-10 max-w-xl mx-auto lg:mr-auto text-center lg:text-left">
                <span className="text-white/80 font-bold text-xs uppercase tracking-[0.25em] mb-2 block">
                  Paso a paso
                </span>
                <h3 className="font-antonio text-3xl md:text-5xl uppercase tracking-wide mb-8 leading-tight text-white">
                  ¿CÓMO REGISTRAR <br/>TU PARTICIPACIÓN?
                </h3>
                <ul className="space-y-6 mt-6 text-left">
                  {[
                    { step: 1, text: 'Llena el formulario en esta página.' },
                    { step: 2, text: 'Adjunta una foto como evidencia de tu actividad.' },
                    { step: 3, text: '¡No hay límite de participaciones!' },
                    { 
                      step: 4, 
                      text: (
                        <>
                          Comparte tu experiencia en redes sociales usando el hashtag <span className="font-black text-[#FFBA00] bg-black/20 px-2 py-0.5 rounded">#AlimpiarelmundoUWCH</span> e invita a más personas a sumarse.
                        </>
                      ) 
                    }
                  ].map((item) => (
                    <li key={item.step} className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <span className="flex-shrink-0 w-9 h-9 border-2 border-white rounded-full text-white font-antonio flex items-center justify-center text-lg">
                        {item.step}
                      </span>
                      <span className="text-white/95 text-base md:text-lg pt-0.5 leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Cierre / Llamado a la acción intermedio: Espacios que Cobran Vida */}
          <div
            ref={ctaRef}
            className="bg-[#FFBA00] text-[#002D7A] py-16 md:py-24 px-6 relative overflow-hidden"
            onMouseMove={handleCtaMouseMove}
            onMouseEnter={() => setIsCtaHovered(true)}
            onMouseLeave={() => {
              setIsCtaHovered(false);
              setCtaMousePos({ x: 0, y: 0 });
            }}
          >
            {/* Círculos decorativos de fondo con respuesta de movimiento */}
            <div
              className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#0044B5]/5 rounded-full translate-x-1/3 translate-y-1/4 pointer-events-none transition-transform ease-out duration-500"
              style={{
                transform: `translate3d(${ctaMousePos.x * 20}px, ${ctaMousePos.y * 15}px, 0)`
              }}
            />
            <div
              className="absolute top-0 left-0 w-[450px] h-[450px] bg-white/20 rounded-full -translate-x-1/4 -translate-y-1/4 pointer-events-none transition-transform ease-out duration-500"
              style={{
                transform: `translate3d(${-ctaMousePos.x * 15}px, ${-ctaMousePos.y * 12}px, 0)`
              }}
            />

            <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

                {/* Columna Izquierda: Mensaje y Acción */}
                <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-sm mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#009464] animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0044B5]">
                      Acción Comunitaria
                    </span>
                  </div>

                  <h3 className="font-antonio text-4xl sm:text-5xl xl:text-6xl uppercase tracking-tight leading-[0.96] text-[#002D7A] mb-4 text-center lg:text-left">
                    ESPACIOS QUE <br />
                    <span className="text-white drop-shadow-[0_2px_8px_rgba(0,45,122,0.35)]">
                      COBRAN VIDA
                    </span>
                  </h3>

                  <p className="text-xl sm:text-2xl font-bold text-[#002D7A] mb-4 leading-snug">
                    ¡Manos a la obra! Recuperemos juntos nuestros espacios
                  </p>

                  <p className="text-slate-800/85 text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-xl text-center lg:text-left">
                    Cada parque rehabilitado, plaza dignificada o área verde limpia fortalece el tejido social y genera entornos más seguros y saludables.
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start w-full">
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-3 bg-[#0044B5] text-white hover:bg-[#002D7A] px-10 py-4 rounded-full font-bold text-base sm:text-lg tracking-wider transition-all uppercase shadow-[0_12px_28px_rgba(0,45,122,0.3)] hover:scale-105 font-antonio"
                    >
                      <span>REGISTRA TU ACTIVIDAD</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Columna Derecha: Tarjeta Fotográfica 3D con Efecto Parallax y Planta */}
                <div className="lg:col-span-6 xl:col-span-5 relative max-w-lg mx-auto lg:max-w-none w-full" style={{ perspective: 1200 }}>
                  {/* Ilustración de Cactus Saguaro Vectorizado Sobresaliendo Detrás de la Foto */}
                  <BotanicalCactus
                    mousePos={ctaMousePos}
                    isHovered={isCtaHovered}
                    className="absolute -top-24 -right-2 sm:-top-32 sm:-right-4 md:-top-36 md:-right-6 w-64 sm:w-80 md:w-96 h-80 sm:h-[26rem] z-0 opacity-100"
                  />

                  {/* Tarjeta Fotográfica Interactiva */}
                  <div
                    className="relative z-10 group"
                    style={{
                      transform: isCtaHovered
                        ? `perspective(1000px) rotateY(${ctaMousePos.x * 6}deg) rotateX(${-ctaMousePos.y * 6}deg) scale3d(1.02, 1.02, 1.02)`
                        : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
                      transition: isCtaHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
                    }}
                  >
                    {/* Badge superior flotante Cactus */}
                    <div className="absolute -top-3.5 -left-3.5 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-white/80 flex items-center gap-2">
                      <span className="text-xl">🌵</span>
                      <span className="text-xs font-extrabold text-[#002D7A] uppercase tracking-wider">Comunidad Unida</span>
                    </div>

                    {/* Marco de Foto de la Jornada */}
                    <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-[0_24px_50px_rgba(0,45,122,0.25)] aspect-[4/3] bg-slate-900">
                      <img
                        src="/campana-14.jpg"
                        alt="Voluntarios de United Way Chihuahua con letrero de Limpieza"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Badge inferior flotante de Espacios Vivos */}
                    <div className="absolute -bottom-3.5 -right-3.5 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/80 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#009464]/10 flex items-center justify-center text-base text-[#009464]">
                        🌱
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009464] block">
                          Voluntariado en Acción
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          Espacios que Cobran Vida
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Sección: Nuestra Causa (Enfocada exclusivamente en Medio Ambiente) */}
        <section id="causas" className="py-24 px-6 bg-[#F4F6FA] relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#009464] font-bold text-xs uppercase tracking-[0.3em] mb-2 block">
                Pilar Oficial de Campaña
              </span>
              <h2 className="heading-brand text-4xl md:text-6xl text-[#0044B5] mb-4">Nuestra Causa: Medioambiental</h2>
              <div className="w-24 h-1.5 bg-[#009464] mx-auto mb-6 rounded-full"></div>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                Nos enfocamos de manera prioritaria en la recuperación, regeneración y dignificación de nuestros espacios públicos y entornos naturales compartidos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-brand p-8 bg-white border border-[#D8E2F0] rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center text-center md:items-start md:text-left">
                <div className="w-16 h-16 bg-[#009464]/10 rounded-2xl flex items-center justify-center text-4xl mb-6 text-[#009464]">
                  🏞️
                </div>
                <h4 className="font-antonio text-2xl text-[#0044B5] mb-3 uppercase tracking-wide">
                  Recuperación de Espacios
                </h4>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  Limpieza y rehabilitación integral de parques, plazas, banquetas, senderos y centros comunitarios para devolver la seguridad y la convivencia vecinal.
                </p>
              </div>

              <div className="card-brand p-8 bg-white border border-[#D8E2F0] rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center text-center md:items-start md:text-left">
                <div className="w-16 h-16 bg-[#0044B5]/10 rounded-2xl flex items-center justify-center text-4xl mb-6 text-[#0044B5]">
                  🌿
                </div>
                <h4 className="font-antonio text-2xl text-[#0044B5] mb-3 uppercase tracking-wide">
                  Áreas Verdes y Conservación
                </h4>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  Cuidado, riego y reforestación de camellones, jardines públicos y zonas arboladas para mitigar el calor urbano y enriquecer el ecosistema.
                </p>
              </div>

              <div className="card-brand p-8 bg-white border border-[#D8E2F0] rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center text-center md:items-start md:text-left">
                <div className="w-16 h-16 bg-[#FFBA00]/20 rounded-2xl flex items-center justify-center text-4xl mb-6 text-[#FFBA00]">
                  ♻️
                </div>
                <h4 className="font-antonio text-2xl text-[#0044B5] mb-3 uppercase tracking-wide">
                  Cultura de Manejo de Residuos
                </h4>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  Retiro responsable de basura, eliminación de microbasureros clandestinos y fomento activo de la corresponsabilidad ciudadana en el reciclaje.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Muro de Impacto y Métricas con Paleta Oscura y Logo en Frame Blanco */}
        <section id="impacto" className="py-24 px-4 relative bg-[#002D7A] overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0044B5]/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFBA00]/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

          <div className="max-w-4xl mx-auto mb-16 flex flex-col items-center relative z-10 text-center">
            {/* Logo de A Limpiar el Mundo dentro de un frame con fondo blanco */}
            <div className="bg-white px-8 py-5 rounded-3xl shadow-2xl border border-white/20 mb-8 inline-flex items-center justify-center transform hover:scale-105 transition-transform">
              <img
                src={alemLogo}
                alt="A Limpiar el Mundo"
                className="h-20 sm:h-24 md:h-28 w-auto object-contain"
              />
            </div>
            
            <h2 className="font-antonio text-white text-4xl md:text-6xl text-center mb-6 leading-tight uppercase tracking-tight">
              EL IMPACTO DE <span className="text-[#FFBA00]">LIMPIAR UNIDOS</span>
            </h2>
            <div className="w-24 h-1.5 bg-[#FFBA00] mx-auto mb-8 rounded-full"></div>
            <p className="text-white/90 text-center text-lg md:text-xl max-w-3xl font-medium leading-relaxed">
              Cada hora de voluntariado representa tiempo, esfuerzo y compromiso dedicados al cuidado de nuestra comunidad. A través de A Limpiar el Mundo, sumamos las horas y acciones de cada participante para recuperar espacios públicos y construir entornos más limpios, seguros y agradables para todas y todos.
            </p>
          </div>

          <div className="max-w-6xl mx-auto mb-16 relative z-10">
            <div className="bg-white rounded-[2.5rem] p-4 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/20">
              <MetricsDashboardView />
            </div>
          </div>
        </section>

        {/* Footer CTA Institucional con Fondo Amarillo Dorado */}
        <section className="py-24 px-4 relative overflow-hidden bg-[#FFBA00]">
          <div className="max-w-5xl mx-auto bg-white border border-[#D8E2F0] p-8 md:p-16 rounded-[3.5rem] text-center relative z-10 shadow-2xl">
            <h2 className="heading-brand text-4xl md:text-6xl mb-6 text-[#0044B5]">¿LISTO PARA HACER LA DIFERENCIA?</h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
              Súmate a la campaña A Limpiar el Mundo y sé parte del movimiento que recupera nuestras calles, áreas verdes y espacios públicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-brand-gold px-12 py-5 text-xl shadow-xl hover:scale-105 rounded-full font-antonio">
                REGISTRA TU ACTIVIDAD
              </Link>
              <Link to="/login" className="btn-brand-blue px-12 py-5 text-xl shadow-xl hover:scale-105 rounded-full font-antonio text-white">
                ACCESO VOLUNTARIO
              </Link>
            </div>
          </div>

          {/* Decoración fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -mr-48 -mt-48 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0044B5]/10 rounded-full -ml-48 -mb-48 pointer-events-none"></div>
        </section>
      </main>

      <footer className="bg-[#002D7A] text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          {/* Logo United Way */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src="/logo-uwch-35-white-color.png" alt="United Way Chihuahua 35 Aniversario" className="h-14 w-auto object-contain" />
            <p className="text-white/70 text-xs font-medium max-w-[260px] leading-relaxed">
              United Way Chihuahua.<br/>Uniendo fuerzas por un futuro más próspero.
            </p>
          </div>

          {/* Logo A Limpiar el Mundo (Centro) con fondo blanco protector */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white px-5 py-2.5 rounded-2xl shadow-md inline-block">
              <img src={alemLogo} alt="A Limpiar el Mundo" className="h-14 w-auto object-contain" />
            </div>
            <h4 className="font-antonio text-[#FFBA00] text-sm uppercase tracking-[0.25em]">Campaña de Voluntariado Ambiental</h4>
          </div>

          {/* Copyright y Legal */}
          <div className="text-center md:text-right text-white/60 text-xs flex flex-col gap-2">
            <p className="font-bold uppercase tracking-widest text-[#FFBA00]">A Limpiar el Mundo 2026</p>
            <p className="text-[11px] opacity-75 leading-relaxed">Plataforma oficial para el registro, cuantificación y trazabilidad de impacto voluntario en espacios públicos.</p>
          </div>
        </div>

        {/* Sub-barra inferior con crédito discreto */}
        <div className="container mx-auto px-6 md:px-12 lg:px-16 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
          <p>© {new Date().getFullYear()} United Way Chihuahua. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            <span>Desarrollado por</span>
            <a
              href="https://dataholics.com.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#FFBA00] font-semibold transition-colors underline decoration-white/30 hover:decoration-[#FFBA00] underline-offset-4"
            >
              Dataholics
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
