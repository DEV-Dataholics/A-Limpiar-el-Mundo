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

  // Estados de movimiento para efecto 3D en plantas y cactus
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
                <label className="block text-sm font-semibold text-[#1A2340] mb-1.5">
                  Contraseña
                </label>
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
      </div>
    </div>

      {/* ── FOOTER MÍNIMO ── */}
      <footer className="text-center py-6 text-xs text-slate-500 font-medium border-t border-slate-200/60 bg-white">
        © {new Date().getFullYear()} United Way Chihuahua · A Limpiar el Mundo 2026
      </footer>
    </div>
  );
}
