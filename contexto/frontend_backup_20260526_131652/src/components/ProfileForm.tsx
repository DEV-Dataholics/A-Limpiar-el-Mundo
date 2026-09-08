import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LocationSelector from './LocationSelector';
import { CORPORATIVOS_CATALOG } from '../utils/constants';


import { API_URL } from '../config';

export default function ProfileForm({ onSaved }: { onSaved?: () => void }) {
  const { user, token, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    last_name: user?.last_name || '',
    age: user?.age || '',
    email: user?.email || '',
    organization_name: user?.organization_name || '',
    state: user?.state || '',
    municipality: user?.municipality || '',
    phone: user?.phone || ''
  });

  // Detecta si el valor guardado en BD es un corporativo o es texto libre
  const savedOrg = user?.organization_name || '';
  const [isOtherOrg, setIsOtherOrg] = useState(
    savedOrg !== '' && !CORPORATIVOS_CATALOG.includes(savedOrg)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('Perfil actualizado correctamente.');
        if (data.data?.user) updateProfile(data.data.user);
        if (onSaved) setTimeout(onSaved, 1500);
      } else {
        setErrorMsg(data.messages?.error || 'Error al actualizar el perfil.');
      }
    } catch {
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "input-brand w-full px-4 py-3 rounded-xl text-sm";
  const labelClass = "block text-sm font-semibold text-[#1A2340] mb-1.5";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#D8E2F0] overflow-hidden">
      {/* Cabecera */}
      <div className="bg-[#F4F6FA] px-6 py-5 border-b border-[#D8E2F0]">
        <h2 className="font-antonio text-2xl text-[#0044B5] uppercase">Mi Perfil Extendido</h2>
        <p className="text-sm text-[#4A5568] mt-0.5">
          Gestiona tu información personal y de contacto para tus registros de impacto.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {successMsg && (
          <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-xl text-sm font-semibold animate-fade-in">
            ✅ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Sección: Información Personal */}
        <section>
          <h3 className="text-[#0044B5] font-black text-xs uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre(s)</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Apellidos</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Edad</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Correo Electrónico (No editable)</label>
              <input type="email" value={formData.email} disabled className={`${inputClass} bg-slate-50 text-slate-400 cursor-not-allowed`} />
            </div>
          </div>
        </section>

        {/* Sección: Organización y Contacto */}
        <section>
          <h3 className="text-[#0044B5] font-black text-xs uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
            Organización y Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>¿A qué Escuela, OSC o Empresa representas?</label>
              {!isOtherOrg ? (
                <select
                  value={formData.organization_name}
                  onChange={e => setFormData({ ...formData, organization_name: e.target.value })}
                  className={inputClass}
                >
                  <option value="">— Selecciona una empresa / organización —</option>
                  {CORPORATIVOS_CATALOG.map(empresa => (
                    <option key={empresa} value={empresa}>{empresa}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  placeholder="Nombre de tu organización..."
                  className={inputClass}
                />
              )}
              <label className="flex items-center gap-2 mt-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isOtherOrg}
                  onChange={e => {
                    setIsOtherOrg(e.target.checked);
                    setFormData(prev => ({ ...prev, organization_name: '' }));
                  }}
                  className="w-4 h-4 accent-[#0044B5]"
                />
                <span className="text-xs text-[#4A5568] group-hover:text-[#0044B5] transition-colors">
                  No está en la lista
                </span>
              </label>
            </div>

            <div>
              <label className={labelClass}>Número de Teléfono (WhatsApp)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10 dígitos"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Ubicación Primaria (Estado y Municipio)</label>
              <LocationSelector
                selectedState={formData.state}
                selectedMunicipality={formData.municipality}
                onStateChange={(state) => setFormData(prev => ({ ...prev, state }))}
                onMunicipalityChange={(municipality) => setFormData(prev => ({ ...prev, municipality }))}
              />
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end border-t border-[#D8E2F0]">
          <button
            type="submit"
            disabled={loading}
            className="btn-brand-gold px-8 py-3 rounded-full font-antonio text-base uppercase tracking-wide disabled:opacity-50 shadow-md"
          >
            {loading ? 'Guardando...' : 'Guardar Perfil'}
          </button>
        </div>
      </form>
    </div>
  );
}

