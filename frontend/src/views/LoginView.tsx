import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';
import { BotanicalCactus, BotanicalSprout } from '../components/BotanicalPlant';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estados para recuperación de contraseña
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Estados de movimiento para efecto 3D en plantas y cactus
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'No se pudo procesar la solicitud.');
      }
      setForgotSuccess(true);
    } catch (err: any) {
      setForgotError(err.message || 'Error al enviar la solicitud.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.messages?.error || 'Error de autenticación');
      login(data.data.user, data.data.token);
      if (Number(data.data.user.role_id) === 1) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col selection:bg-[#FFBA00]/30 selection:text-[#0044B5]">

      {/* ── TOPBAR INSTITUCIONAL EXACTO ── */}
      <Navbar />

      {/* ── FORMULARIO CON FONDO BOTÁNICO Y CACTUS ── */}
      <div 
        className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 0, y: 0 });
        }}
      >
        {/* Orbes bio-ambientales suaves de fondo */}
        <div 
          className="absolute top-12 right-1/4 w-96 h-96 bg-[#FFBA00]/15 rounded-full blur-3xl pointer-events-none transition-transform duration-700"
          style={{ transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * 20}px, 0)` }}
        />
        <div 
          className="absolute bottom-12 left-1/4 w-96 h-96 bg-[#009464]/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700"
          style={{ transform: `translate3d(${-mousePos.x * 20}px, ${-mousePos.y * 15}px, 0)` }}
        />

        {/* Contenedor relativo de tarjeta y elementos botánicos */}
        <div ref={cardRef} className="relative w-full max-w-md my-6" style={{ perspective: 1200 }}>
          
          {/* Cactus Saguaro Vectorizado sobresaliendo por la derecha superior */}
          <BotanicalCactus
            mousePos={mousePos}
            isHovered={isHovered}
            className="absolute -top-24 -right-6 sm:-top-28 sm:-right-8 w-52 sm:w-64 h-64 sm:h-80 z-0"
          />

          {/* Brote botánico sobresaliendo por la esquina inferior izquierda */}
          <BotanicalSprout
            mousePos={mousePos}
            isHovered={isHovered}
            className="absolute -bottom-8 -left-8 sm:-bottom-10 sm:-left-10 w-32 sm:w-40 h-32 sm:h-40 z-0"
          />

          {/* Tarjeta de Inicio de Sesión */}
          <div className="relative z-10 bg-white rounded-3xl shadow-[0_24px_60px_rgba(0,45,122,0.18)] border border-[#D8E2F0] overflow-hidden">

            {/* Banda azul institucional */}
            <div className="bg-[#0044B5] px-8 py-7 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFBA00]/10 rounded-full blur-xl pointer-events-none"></div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009464] animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Acceso a Plataforma
                </span>
              </div>

              <h1 className="font-antonio text-white text-3xl uppercase tracking-wide">
                Iniciar Sesión
              </h1>
              <p className="text-white/80 text-sm mt-1.5 font-medium">
                A Limpiar el Mundo 2026 · United Way Chihuahua
              </p>
            </div>

          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A2340] mb-1.5">
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="input-brand w-full px-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-[#1A2340]">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotSuccess(false);
                      setForgotError('');
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-semibold text-[#0044B5] hover:text-[#FFBA00] transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input-brand w-full px-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-brand-blue w-full py-3 rounded-xl font-antonio text-lg uppercase tracking-wide disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Entrar al sistema'}
              </button>
            </form>

            <p className="text-center text-[#4A5568] mt-6 text-sm">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-[#0044B5] font-bold hover:text-[#FFBA00] transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Modal Recuperar Contraseña */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-[#D8E2F0] max-w-md w-full overflow-hidden p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#D8E2F0]">
                <h3 className="font-antonio text-2xl text-[#0044B5] uppercase">
                  Recuperar Contraseña
                </h3>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 leading-none"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              {forgotSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A2340] text-lg mb-1">Revisa tu Correo</h4>
                    <p className="text-sm text-[#4A5568] leading-relaxed">
                      Si <strong className="text-[#1A2340]">{forgotEmail}</strong> está registrado, recibirás un enlace seguro para restablecer tu contraseña.
                    </p>
                    <p className="text-xs text-[#9AA3B4] mt-2">
                      El enlace expirará en 60 minutos. No olvides revisar tu carpeta de spam o correo no deseado.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="btn-brand-blue w-full py-3 rounded-xl font-antonio text-base uppercase tracking-wide text-white"
                  >
                    Entendido
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4 pt-4">
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    Ingresa el correo electrónico con el que te registraste en la plataforma y te enviaremos un enlace de recuperación.
                  </p>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-1.5">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="input-brand w-full px-4 py-3 rounded-xl text-sm"
                      required
                      autoFocus
                    />
                  </div>

                  {forgotError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-2.5">
                      {forgotError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="w-1/3 py-3 rounded-xl border border-slate-300 font-antonio text-sm uppercase text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="btn-brand-blue flex-1 py-3 rounded-xl font-antonio text-sm uppercase tracking-wider text-white disabled:opacity-50"
                    >
                      {forgotLoading ? 'Enviando...' : 'Enviar Enlace'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

      {/* ── FOOTER MÍNIMO ── */}
      <footer className="text-center py-6 text-xs text-slate-500 font-medium border-t border-slate-200/60 bg-white">
        © {new Date().getFullYear()} United Way Chihuahua · A Limpiar el Mundo 2026
      </footer>
    </div>
  );
}
