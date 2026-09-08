import { Link } from 'react-router-dom';
import MetricsDashboardView from './MetricsDashboardView';
import portadaImg from '../../../contexto/portada.jpg';

export default function LandingView() {
  // URLs de assets (ya copiados a public)
  const uwchLogo = '/image.png';
  const somosLogo = '/somoscomunidad-logo.png';

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans selection:bg-[#FFBA00]/30 selection:text-[#0044B5] w-full max-w-full overflow-x-hidden">
      {/* Navbar Institucional */}
      <header className="topbar-brand px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-xl border-b border-[#FFBA00]/20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4 group transition-transform hover:scale-105">
            <img src={uwchLogo} alt="United Way" className="h-9 md:h-11 object-contain" />
            <div className="h-10 w-[2px] bg-[#FFBA00] mx-1 hidden sm:block"></div>
            <img src={somosLogo} alt="Somos Comunidad" className="h-8 md:h-10 object-contain brightness-0 invert" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#causas" className="text-white/90 hover:text-[#FFBA00] font-bold text-sm uppercase tracking-widest transition-colors">Causas</a>
          <a href="#impacto" className="text-white/90 hover:text-[#FFBA00] font-bold text-sm uppercase tracking-widest transition-colors">Impacto</a>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <Link to="/login" className="text-white font-bold text-sm uppercase tracking-widest hover:text-[#FFBA00] transition-colors">
            Ingresar
          </Link>
          <Link to="/register" className="btn-brand-gold px-6 py-2.5 text-sm">
            Únete
          </Link>
        </nav>

        {/* Mobile Trigger */}
        <div className="md:hidden">
          <Link to="/register" className="btn-brand-gold px-4 py-2 text-xs">Únete</Link>
        </div>
      </header>

      <main>
        {/* Hero Section Estilo United Way (Replica Exacta con Animaciones) */}
        <section className="relative min-h-[80vh] md:h-[90vh] bg-[#0044B5] overflow-hidden flex items-center">

          {/* Círculo Azul Claro Decorativo (Detrás de la foto con pulso) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[-20%] md:right-[-10%] w-[100vh] h-[100vh] md:w-[130vh] md:h-[130vh] rounded-full bg-[#3A7BFF]/30 z-0 animate-pulse-subtle"></div>

          {/* Contenedor de la Foto Circular con Animación de Entrada */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[-25%] md:right-[-15%] w-[90vh] h-[90vh] md:w-[120vh] md:h-[120vh] rounded-full overflow-hidden border-[15px] md:border-[25px] border-[#3A7BFF] z-10 shadow-2xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <img
              src={portadaImg}
              alt="Comunidad en Acción"
              className="w-full h-full object-cover animate-slow-zoom"
            />
            {/* Overlay para móviles */}
            <div className="absolute inset-0 bg-[#0044B5]/40 md:hidden"></div>
          </div>

          {/* Contenido sobre el fondo azul */}
          <div className="container mx-auto px-6 md:px-20 relative z-20">
            <div className="max-w-3xl flex flex-col items-center text-center md:items-start md:text-left">
              <div className="mb-8 pb-4">
                <img 
                  src={somosLogo} 
                  alt="Somos Comunidad" 
                  className="h-32 md:h-64 object-center md:object-left object-contain brightness-0 invert animate-slide-up" 
                />
              </div>

              <p className="text-white text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Movilizamos la generosidad y el esfuerzo en nuestra comunidad. Desde la recuperación de espacios hasta brindar apoyo a quien más lo necesita, cada acción cuenta.
              </p>

              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <Link to="/register" className="btn-brand-gold px-12 py-4 rounded-full text-xl shadow-[0_10px_30px_rgba(255,186,0,0.3)] hover:scale-105 transition-all inline-block text-center uppercase tracking-wider font-antonio">
                  ÚNETE AL MOVIMIENTO
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Nueva Sección: ¿Cómo Participar? (Diseño Full-Width United Way) */}
        <section className="w-full">
          <div className="flex flex-col md:flex-row w-full">
            
            {/* Columna 1: Qué registrar */}
            <div className="w-full md:w-1/2 bg-white p-10 md:p-16 lg:p-24 flex flex-col justify-center items-center md:items-start text-center md:text-left relative overflow-hidden border-r border-[#F4F6FA]">
              {/* Curva sutil estilo corporativo */}
              <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#0044B5]/5 rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
              
              <div className="relative z-10 max-w-lg">
                <h3 className="font-antonio text-4xl md:text-5xl uppercase tracking-wide mb-8 text-[#0044B5]">
                  ¿QUÉ PUEDO HACER?
                </h3>
                <ul className="space-y-6 text-left">
                  {[
                    'Limpiar calles o espacios públicos',
                    'Recoger basura',
                    'Sembrar o salir a regar árboles en tu entorno',
                    'Convivir y brindar compañía en estancias de adultos mayores',
                    'Colecta alimento para alguna familia, organización necesitada o refugio de mascotas'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="mt-0.5 flex-shrink-0 w-8 h-8 border-2 border-[#0044B5] rounded-full text-[#0044B5] flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-600 text-lg leading-snug pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Columna 2: Cómo registrar */}
            <div className="w-full md:w-1/2 bg-[#A50034] p-10 md:p-16 lg:p-24 text-white relative overflow-hidden flex flex-col items-center md:items-start text-center md:text-left">
              {/* Curva sutil estilo corporativo */}
              <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-black/10 rounded-full -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
              
              <div className="relative z-10 max-w-lg">
                <h3 className="font-antonio text-4xl md:text-5xl uppercase tracking-wide mb-6 leading-tight text-white">
                  ¿CÓMO REGISTRAR <br/>TU PARTICIPACIÓN?
                </h3>
                <ul className="space-y-8 mt-10 text-left">
                  {[
                    { step: 1, text: 'Llena el formulario en esta página.' },
                    { step: 2, text: 'Adjunta una foto como evidencia de tu actividad.' },
                    { step: 3, text: '¡No hay límite de participaciones!' },
                    { step: 4, text: 'Comparte tu experiencia en redes sociales usando el hashtag #SomosComunidadUWCH e invita a más personas a sumarse.' }
                  ].map((item) => (
                    <li key={item.step} className="flex items-start gap-5">
                      <span className="flex-shrink-0 w-10 h-10 border-2 border-white rounded-full text-white font-antonio flex items-center justify-center text-xl">
                        {item.step}
                      </span>
                      <span className="text-white/90 text-lg pt-1 leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Cierre / Llamado a la acción */}
          <div className="bg-[#FFBA00] text-[#002D7A] py-20 px-4 text-center relative overflow-hidden">
             {/* Curva sutil azul */}
             <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#0044B5]/5 rounded-full translate-x-1/3 translate-y-1/4 pointer-events-none"></div>
             
             <div className="relative z-10">
                <p className="text-3xl md:text-5xl font-antonio tracking-wide uppercase leading-tight mb-8">
                  ¡CADA ACTO CUENTA! <br className="hidden md:block"/> HAGAMOS COMUNIDAD, HAGAMOS LA DIFERENCIA.
                </p>
                <Link to="/register" className="inline-block bg-[#0044B5] border-[1.5px] border-transparent text-[#FFBA00] hover:bg-[#002D7A] px-10 py-4 rounded-full font-bold text-lg tracking-widest transition-all uppercase shadow-lg">
                  REGISTRA TU ACCIÓN
                </Link>
             </div>
          </div>
        </section>

        {/* Ejes de Acción */}
        <section id="causas" className="py-24 px-4 bg-[#F4F6FA] relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-brand text-4xl md:text-5xl mb-4">Nuestras Causas</h2>
              <div className="w-24 h-1.5 bg-[#FFBA00] mx-auto mb-8 rounded-full"></div>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">Nos enfocamos en cuatro pilares fundamentales para transformar nuestro entorno social y ambiental.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🌿', title: 'Medio Ambiente', desc: 'Reforestaciones, limpieza de espacios públicos y educación ecológica.' },
                { icon: '📚', title: 'Educación', desc: 'Apoyo escolar, mentorías y mejora de infraestructura educativa comunitaria.' },
                { icon: '🤝', title: 'Inclusión Social', desc: 'Atención a grupos vulnerables, comedores comunitarios y acompañamiento.' },
                { icon: '🐾', title: 'Bienestar Animal', desc: 'Campañas de adopción, rescate y esterilización para mascotas.' }
              ].map((eje, idx) => (
                <div key={idx} className="card-brand p-8 group hover:-translate-y-2 transition-all flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="w-16 h-16 bg-[#0044B5]/10 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:bg-[#FFBA00] group-hover:rotate-6 transition-all duration-300">
                    {eje.icon}
                  </div>
                  <h4 className="font-antonio text-xl text-[#0044B5] mb-3 uppercase tracking-wide">{eje.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{eje.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Muro de Impacto y Métricas */}
        <section id="impacto" className="py-24 px-4 relative bg-[#002D7A]">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0044B5]/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFBA00]/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

          <div className="max-w-4xl mx-auto mb-16 flex flex-col items-center relative z-10">
            <div className="bg-[#0044B5] p-8 rounded-3xl mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#FFBA00]/30 rotate-3 hover:rotate-0 transition-transform">
              <img
                src={somosLogo}
                alt="Somos Comunidad"
                className="h-32 md:h-44 w-auto brightness-0 invert"
              />
            </div>
            <h2 className="font-antonio text-white text-4xl md:text-7xl text-center mb-6 leading-tight uppercase tracking-tighter">
              EL IMPACTO EN <span className="text-[#FFBA00]">TIEMPO REAL</span>
            </h2>
            <div className="w-24 h-1.5 bg-[#FFBA00] mx-auto mb-8 rounded-full"></div>
            <p className="text-white/80 text-center text-xl max-w-2xl font-medium leading-relaxed">
              Cada hora invertida y cada persona beneficiada suma a nuestro contador global.
              Así es como estamos transformando nuestra comunidad.
            </p>
          </div>

          <div className="max-w-6xl mx-auto mb-16 relative z-10">
            <div className="bg-white rounded-[3rem] p-4 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/20">
              <MetricsDashboardView />
            </div>
          </div>
        </section>

        {/* Footer CTA Institucional */}
        <section className="py-24 px-4 relative overflow-hidden bg-[#F4F6FA]">
          <div className="max-w-5xl mx-auto bg-white border border-[#D8E2F0] p-8 md:p-16 rounded-[3.5rem] text-center relative z-10 shadow-2xl">
            <h2 className="heading-brand text-4xl md:text-6xl mb-6">¿LISTO PARA HACER LA DIFERENCIA?</h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
              Ya sea participando en causas institucionales o registrando tus propias iniciativas vecinales, tu esfuerzo cuenta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-brand-gold px-12 py-5 text-xl shadow-xl hover:scale-105">
                CREAR MI CUENTA
              </Link>
              <Link to="/login" className="btn-brand-blue px-12 py-5 text-xl shadow-xl hover:scale-105">
                ACCESO VOLUNTARIO
              </Link>
            </div>
          </div>

          {/* Decoración fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0044B5]/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFBA00]/5 rounded-full -ml-32 -mb-32"></div>
        </section>
      </main>

      <footer className="bg-[#0044B5] text-white py-16 px-6 border-t border-[#FFBA00]/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          {/* Logo United Way */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src={uwchLogo} alt="United Way" className="h-16 w-auto object-contain" />
            <p className="text-white/60 text-xs font-medium max-w-[200px]">Uniendo fuerzas por un futuro mejor en Chihuahua.</p>
          </div>

          {/* Logo Somos Comunidad (Centro) */}
          <div className="flex flex-col items-center gap-4">
            <img src={somosLogo} alt="Somos Comunidad" className="h-20 w-auto brightness-0 invert" />
            <h4 className="font-antonio text-[#FFBA00] text-sm uppercase tracking-[0.3em]">Impacto Colectivo</h4>
          </div>

          {/* Copyright y Legal */}
          <div className="text-center md:text-right text-white/50 text-[10px] flex flex-col gap-2">
            <p className="font-bold uppercase tracking-widest text-[#FFBA00]/80">United Way - Fondo Unido Chihuahua</p>
            <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
            <p className="mt-2 text-[9px] opacity-40 leading-relaxed italic">Esta plataforma es una herramienta oficial para el monitoreo de impacto social en el estado de Chihuahua y a nivel nacional.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
