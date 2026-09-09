import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocationSelector from '../components/LocationSelector';
import Navbar from '../components/Navbar';
import { BotanicalSprout, BotanicalCactus } from '../components/BotanicalPlant';
import { API_URL } from '../config';

export default function RegisterView() {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    age: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    state: '',
    municipality: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (formData.password !== formData.confirm_password) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!formData.state || !formData.municipality) {
      setError("Por favor selecciona tu Estado y Municipio");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        const errors = data.messages ? Object.values(data.messages).join('\n') : 'Error al registrar';
        throw new Error(errors);
      }
      alert("Registro exitoso. Por favor inicia sesión.");
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = "input-brand w-full px-4 py-3 rounded-xl text-sm bg-white border border-[#D8E2F0] focus:border-[#0044B5] focus:ring-2 focus:ring-[#0044B5]/15 transition-all text-slate-800 shadow-sm";
  const labelClass = "block text-sm font-semibold text-[#1A2340] mb-1.5";

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
        <div ref={cardRef} className="relative w-full max-w-xl my-6" style={{ perspective: 1200 }}>
          
          {/* Cactus Saguaro Vectorizado sobresaliendo por la derecha superior */}
          <BotanicalCactus
            mousePos={mousePos}
            isHovered={isHovered}
            className="absolute -top-24 -right-6 sm:-top-32 sm:-right-10 md:-top-36 md:-right-12 w-56 sm:w-72 md:w-80 h-72 sm:h-96 z-0"
          />

          {/* Brote botánico sobresaliendo por la esquina inferior izquierda */}
          <BotanicalSprout
            mousePos={mousePos}
            isHovered={isHovered}
            className="absolute -bottom-8 -left-8 sm:-bottom-12 sm:-left-12 w-36 sm:w-48 h-36 sm:h-48 z-0"
          />

          {/* Tarjeta de Registro */}
          <div className="relative z-10 bg-white rounded-3xl shadow-[0_24px_60px_rgba(0,45,122,0.18)] border border-[#D8E2F0] overflow-hidden">

            {/* Banda azul institucional */}
            <div className="bg-[#0044B5] px-8 py-7 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFBA00]/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009464] animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Voluntariado 2026
                </span>
              </div>

              <h1 className="font-antonio text-white text-3xl sm:text-4xl uppercase tracking-wide">
                Únete a la Comunidad
              </h1>
              <p className="text-white/80 text-sm mt-1.5 font-medium">
                A Limpiar el Mundo 2026 · United Way Chihuahua
              </p>
            </div>

            <div className="px-6 sm:px-10 py-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nombre(s)</label>
                    <input type="text" name="name" required onChange={handleChange} className={inputClass} placeholder="María" />
                  </div>
                  <div>
                    <label className={labelClass}>Apellidos</label>
                    <input type="text" name="last_name" required onChange={handleChange} className={inputClass} placeholder="García Pérez" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Edad</label>
                    <input type="number" name="age" required onChange={handleChange} className={inputClass} placeholder="25" />
                  </div>
                  <div>
                    <label className={labelClass}>Celular</label>
                    <input type="tel" name="phone" required onChange={handleChange} className={inputClass} placeholder="614 123 4567" />
                  </div>
                </div>

                {/* Selector de Localidad (Sin etiquetas duplicadas y con campos blancos) */}
                <LocationSelector
                  selectedState={formData.state}
                  selectedMunicipality={formData.municipality}
                  onStateChange={(state) => setFormData(prev => ({ ...prev, state }))}
                  onMunicipalityChange={(municipality) => setFormData(prev => ({ ...prev, municipality }))}
                  labelClassName={labelClass}
                />

                <div>
                  <label className={labelClass}>Correo electrónico</label>
                  <input type="email" name="email" required onChange={handleChange} className={inputClass} placeholder="tu.correo@ejemplo.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Contraseña</label>
                    <input type="password" name="password" required onChange={handleChange} className={inputClass} placeholder="••••••••" />
                  </div>
                  <div>
                    <label className={labelClass}>Confirmar contraseña</label>
                    <input type="password" name="confirm_password" required onChange={handleChange} className={inputClass} placeholder="••••••••" />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 whitespace-pre-line">
                    {error}
                  </div>
                )}

                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="btn-brand-blue w-full py-4 rounded-full font-antonio text-xl uppercase tracking-wider shadow-[0_10px_24px_rgba(0,68,181,0.25)] hover:scale-[1.02] transition-all disabled:opacity-50 text-white"
                >
                  {loading ? 'Registrando...' : 'Crear mi cuenta'}
                </button>
              </form>

              <p className="text-center text-slate-600 mt-6 text-sm font-medium">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-[#0044B5] font-bold hover:text-[#FFBA00] transition-colors underline decoration-[#0044B5]/30 underline-offset-4">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-slate-500 font-medium border-t border-slate-200/60 bg-white">
        © {new Date().getFullYear()} United Way Chihuahua · A Limpiar el Mundo 2026
      </footer>
    </div>
  );
}
