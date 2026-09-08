import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import LocationSelector from '../components/LocationSelector';

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

  const inputClass = "input-brand w-full px-4 py-3 rounded-xl text-sm";
  const labelClass = "block text-sm font-semibold text-[#1A2340] mb-1.5";

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
      <div className="flex-1 flex items-start justify-center p-4 py-10">
        <div className="bg-white rounded-2xl shadow-xl border border-[#D8E2F0] w-full max-w-xl overflow-hidden">

          {/* Banda azul */}
          <div className="bg-[#0044B5] px-8 py-6 text-center">
            <h1 className="font-antonio text-white text-2xl uppercase">
              Únete a la Comunidad
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Registra tus datos para empezar a crear impacto
            </p>
          </div>

          <div className="px-8 py-8">
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

              {/* Selector de Localidad */}
              <div>
                <label className={labelClass}>Estado y Municipio</label>
                <LocationSelector
                  selectedState={formData.state}
                  selectedMunicipality={formData.municipality}
                  onStateChange={(state) => setFormData(prev => ({ ...prev, state }))}
                  onMunicipalityChange={(municipality) => setFormData(prev => ({ ...prev, municipality }))}
                />
              </div>

              <div>
                <label className={labelClass}>Correo electrónico</label>
                <input type="email" name="email" required onChange={handleChange} className={inputClass} placeholder="correo@ejemplo.com" />
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
                className="btn-brand-blue w-full py-3 rounded-xl font-antonio text-lg uppercase tracking-wide disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Crear mi cuenta'}
              </button>
            </form>

            <p className="text-center text-[#4A5568] mt-6 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-[#0044B5] font-bold hover:text-[#FFBA00] transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-[#9AA3B4]">
        © 2025 United Way Chihuahua · Somos Comunidad
      </footer>
    </div>
  );
}
