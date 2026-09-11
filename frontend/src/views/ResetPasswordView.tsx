import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';
import { BotanicalCactus, BotanicalSprout } from '../components/BotanicalPlant';

export default function ResetPasswordView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  // Verification state
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenEmail, setTokenEmail] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Form state
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Parallax animation state
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

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setTokenValid(false);
      setTokenError('No se proporcionó un enlace o token de recuperación.');
      return;
    }

    const verifyToken = async () => {
      setValidating(true);
      try {
        const res = await fetch(`${API_URL}/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenValid(true);
          setTokenEmail(data.email || '');
        } else {
          setTokenValid(false);
          setTokenError(data.message || 'El enlace de recuperación no es válido o ha expirado.');
        }
      } catch (err) {
        setTokenValid(false);
        setTokenError('Ocurrió un error al verificar tu solicitud. Por favor intenta de nuevo.');
      } finally {
        setValidating(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (password.length < 8) {
      setFormError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== passwordConfirm) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
          password_confirm: passwordConfirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.messages?.password || data.messages?.password_confirm || data.message || 'No fue posible restablecer la contraseña.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setFormError(err.message || 'Error al procesar el cambio de contraseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col selection:bg-[#FFBA00]/30 selection:text-[#0044B5]">
      {/* ── TOPBAR INSTITUCIONAL ── */}
      <Navbar />

      {/* ── CONTENIDO CON ELEMENTOS BOTÁNICOS ── */}
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

        {/* Tarjeta y decoradores */}
        <div ref={cardRef} className="relative w-full max-w-md my-6" style={{ perspective: 1200 }}>
          <BotanicalCactus
            mousePos={mousePos}
            isHovered={isHovered}
            className="absolute -top-24 -right-6 sm:-top-28 sm:-right-8 w-52 sm:w-64 h-64 sm:h-80 z-0"
          />

          <BotanicalSprout
            mousePos={mousePos}
            isHovered={isHovered}
            className="absolute -bottom-8 -left-8 sm:-bottom-10 sm:-left-10 w-32 sm:w-40 h-32 sm:h-40 z-0"
          />

          <div className="relative z-10 bg-white rounded-3xl shadow-[0_24px_60px_rgba(0,45,122,0.18)] border border-[#D8E2F0] overflow-hidden">
            {/* Header institucional */}
            <div className="bg-[#0044B5] px-8 py-7 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFBA00]/10 rounded-full blur-xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA00] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Seguridad de Cuenta
                </span>
              </div>

              <h1 className="font-antonio text-white text-3xl uppercase tracking-wide">
                Nueva Contraseña
              </h1>
              <p className="text-white/80 text-sm mt-1.5 font-medium">
                A Limpiar el Mundo 2026 · United Way Chihuahua
              </p>
            </div>

            <div className="px-8 py-8">
              {/* Estado: Validando enlace */}
              {validating && (
                <div className="text-center py-10 space-y-4">
                  <div className="w-10 h-10 border-4 border-[#0044B5] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-[#4A5568] font-medium">Verificando enlace de recuperación...</p>
                </div>
              )}

              {/* Estado: Enlace Inválido o Expirado */}
              {!validating && !tokenValid && !isSuccess && (
                <div className="text-center py-6 space-y-5">
                  <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A2340] text-lg mb-1.5">Enlace no disponible</h3>
                    <p className="text-sm text-[#4A5568] leading-relaxed">
                      {tokenError || 'Este enlace de recuperación ha expirado o ya fue utilizado anteriormente.'}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="btn-brand-blue w-full py-3 rounded-xl font-antonio text-base uppercase tracking-wide inline-block text-center text-white"
                    >
                      Volver a Iniciar Sesión
                    </Link>
                  </div>
                </div>
              )}

              {/* Estado: Éxito al actualizar contraseña */}
              {isSuccess && (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A2340] text-xl mb-1.5">¡Contraseña Actualizada!</h3>
                    <p className="text-sm text-[#4A5568] leading-relaxed">
                      Tu contraseña ha sido modificada exitosamente. Ya puedes acceder con tus nuevas credenciales.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-brand-blue w-full py-3 rounded-xl font-antonio text-lg uppercase tracking-wide shadow-md text-white hover:scale-[1.02] transition-transform"
                  >
                    Iniciar Sesión Ahora
                  </button>
                </div>
              )}

              {/* Estado: Formulario Activo para Crear Nueva Contraseña */}
              {!validating && tokenValid && !isSuccess && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {tokenEmail && (
                    <div className="bg-[#0044B5]/5 border border-[#0044B5]/15 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-[#0044B5]">
                      <span className="font-bold">Usuario:</span>
                      <span className="font-mono">{tokenEmail}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-[#1A2340] mb-1.5">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="input-brand w-full px-4 py-3 rounded-xl text-sm pr-12"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                        tabIndex={-1}
                      >
                        {showPassword ? 'Ocultar' : 'Ver'}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#9AA3B4] mt-1">
                      Debe contener al menos 8 caracteres.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A2340] mb-1.5">
                      Confirmar Contraseña
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="Repite la nueva contraseña"
                      className="input-brand w-full px-4 py-3 rounded-xl text-sm"
                      required
                    />
                    {password && passwordConfirm && password !== passwordConfirm && (
                      <p className="text-[11px] text-red-500 font-medium mt-1">
                        Las contraseñas no coinciden.
                      </p>
                    )}
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || (!!password && !!passwordConfirm && password !== passwordConfirm)}
                    className="btn-brand-blue w-full py-3 rounded-xl font-antonio text-lg uppercase tracking-wide disabled:opacity-50 text-white"
                  >
                    {submitting ? 'Guardando...' : 'Guardar Nueva Contraseña'}
                  </button>

                  <p className="text-center text-[#4A5568] mt-4 text-xs">
                    ¿Recordaste tu contraseña?{' '}
                    <Link to="/login" className="text-[#0044B5] font-bold hover:text-[#FFBA00] transition-colors">
                      Inicia sesión
                    </Link>
                  </p>
                </form>
              )}
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
