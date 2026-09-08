import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // Keep a deterministic fallback when backend returns non-JSON responses.
      }

      if (!response.ok) {
        const backendMessage =
          data?.messages?.error ||
          data?.message ||
          data?.error ||
          `Error de autenticación (HTTP ${response.status})`;
        throw new Error(backendMessage);
      }

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
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col">

      {/* ── TOPBAR INSTITUCIONAL ── */}
      <header className="bg-[#0044B5] h-14 flex items-center px-6 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="/somoscomunidad-logo.png"
            alt="Somos Comunidad"
            className="h-8 object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="font-antonio text-white text-base uppercase tracking-wide">
            Somos Comunidad
          </span>
        </div>
      </header>

      {/* ── FORMULARIO ── */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-[#D8E2F0] w-full max-w-md overflow-hidden">

          {/* Banda azul superior */}
          <div className="bg-[#0044B5] px-8 py-6 text-center">
            <h1 className="font-antonio text-white text-2xl uppercase">
              Iniciar Sesión
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Accede a tu cuenta de voluntario
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

      {/* ── FOOTER MÍNIMO ── */}
      <footer className="text-center py-4 text-xs text-[#9AA3B4]">
        © 2025 United Way Chihuahua · Somos Comunidad
      </footer>
    </div>
  );
}
