import { useEffect, useState } from 'react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { useAuth } from '../context/AuthContext';
import LocationSelector from './LocationSelector';
import PredictiveCompanySelector from './PredictiveCompanySelector';
import { API_URL } from '../config';

// ─────────────────────────────────────────────────────────────────────────────


export default function DynamicRegistrationForm() {
  const { user } = useAuth();
  const [catalog, setCatalog] = useState<any[]>([]);
  const {
    legalConsent, setLegalConsent,
    loading, error,
    activityId, setActivityId,
    scheduledDate, setScheduledDate,
    volunteerCount, setVolunteerCount,
    description, setDescription,
    customActivityName, setCustomActivityName,
    activityType, setActivityType,
    groupName, setGroupName,
    locationName, setLocationName,
    state, setState,
    municipality, setMunicipality,
    durationHours, setDurationHours,
    beneficiariesCount, setBeneficiariesCount,
    testimonials, setTestimonials,
    evidenceLinks, setEvidenceLinks,
    canSubmit,
    handleSubmit
  } = useRegistrationForm();

  // Carga de catálogo real
  useEffect(() => {
    fetch(`${API_URL}/api/activities`)
      .then(res => res.json())
      .then(data => {
        // CodeIgniter respond() puede devolver data: [] o el array directo
        const items = Array.isArray(data) ? data : (data.data || []);
        setCatalog(Array.isArray(items) ? items : []);
      })
      .catch(err => {
        console.error("Error loading catalog:", err);
        setCatalog([]);
      });
  }, []);

  // Wrapper para inyectar user_id en el submit
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(user) {
      // En un caso real se inyecta user.id en el custom hook
      console.log("Submitting as user:", user.id);
    }
    handleSubmit(e);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D8E2F0] shadow-sm p-6">
      <h2 className="font-antonio text-2xl text-[#0044B5] uppercase mb-6">
        Registra tu Participación
      </h2>

      <form onSubmit={onSubmit} className="space-y-6 animate-fade-in transition-opacity duration-300">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-[#0044B5] mb-1 uppercase tracking-wide">Modalidad de la actividad *</label>
            <select
              value={activityType}
              onChange={e => {
                const newType = e.target.value;
                setActivityType(newType);
                
                // Si el usuario tiene una organización en su perfil, la pre-llenamos al cambiar a Corporativa o Personal
                if (newType === 'Corporativa' || newType === 'Personal') {
                  setGroupName(user?.organization_name || '');
                } else {
                  setGroupName('');
                }

                if (newType !== 'Institucional') {
                   setActivityId('');
                } else {
                   setCustomActivityName('');
                }
              }}
              className="input-brand w-full px-4 py-3 rounded-lg bg-white"
            >
              <option value="Institucional">Institucional (Causa oficial)</option>
              <option value="Corporativa">Corporativa</option>
              <option value="Personal">Personal</option>
              <option value="Sociedad civil">Sociedad civil</option>
              <option value="Escuela">Escuela</option>
            </select>
          </div>

          <div className="md:col-span-2">
            {activityType === 'Institucional' ? (
              <>
                <label className="block text-xs font-black text-[#0044B5] mb-1 uppercase tracking-wide">Nombre de la causa institucional *</label>
                <select
                  value={activityId || ''}
                  onChange={e => setActivityId(e.target.value)}
                  className="input-brand w-full px-4 py-3 rounded-lg"
                  required
                >
                  <option value="">— Selecciona la causa oficial —</option>
                  {catalog.filter(act => act.type === 'institutional').map(act => (
                    <option key={act.id} value={act.id}>{act.name}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label className="block text-xs font-black text-[#0044B5] mb-1 uppercase tracking-wide">Nombre de la actividad *</label>
                <input 
                  type="text" required placeholder="Ej. Reforestación del parque central"
                  value={customActivityName} onChange={e => setCustomActivityName(e.target.value)}
                  className="input-brand w-full px-4 py-3 rounded-lg"
                />
              </>
            )}
          </div>

          {/* Campo dinámico según modalidad */}
          {activityType !== 'Comunidad abierta' && activityType !== 'Institucional' && (
            <div className="md:col-span-2">
              {activityType === 'Corporativa' && (
                <PredictiveCompanySelector
                  value={groupName}
                  onChange={setGroupName}
                  label="Empresa corporativa"
                  required
                  placeholder="Escribe para buscar tu empresa o planta..."
                  helperText="Escribe el nombre o iniciales de la empresa para ver sugerencias predictivas instantáneas."
                />
              )}

              {activityType === 'Personal' && (
                <PredictiveCompanySelector
                  value={groupName}
                  onChange={setGroupName}
                  label="Escuela, OSC, empresa o colectivo (Opcional)"
                  placeholder="¿A quién representas? (Ej. Yazaki, Lear, UACH...)"
                  helperText="Escribe el nombre de tu empresa, colectivo o institución para autocompletar."
                />
              )}

              {activityType === 'Sociedad civil' && (
                <PredictiveCompanySelector
                  value={groupName}
                  onChange={setGroupName}
                  label="Nombre de la Organización de la Sociedad Civil (OSC) *"
                  required
                  placeholder="Ej. Fundación / Colectivo..."
                  helperText="Escribe el nombre de tu organización."
                />
              )}

              {activityType === 'Escuela' && (
                <>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1">Nombre de la Escuela *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Escuela Primaria Federal"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    className="input-brand w-full px-4 py-3 rounded-lg"
                  />
                </>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Nombre del lugar *</label>
            <input 
              type="text" required placeholder="Ej. Parque Central"
              value={locationName} onChange={e => setLocationName(e.target.value)}
              className="input-brand w-full px-4 py-3 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
             <label className="block text-xs font-semibold text-[#4A5568] mb-1">Localidad de la actividad *</label>
             <LocationSelector 
              selectedState={state}
              selectedMunicipality={municipality}
              onStateChange={setState}
              onMunicipalityChange={setMunicipality}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Fecha de la actividad *</label>
            <input 
              type="date" required max={new Date().toISOString().split('T')[0]}
              value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
              className="input-brand w-full px-4 py-3 rounded-lg"
            />
          </div>

          {/* Métricas de Impacto con Leyenda Aclaratoria y Previsualizador */}
          <div className="md:col-span-2 bg-[#F4F6FA] border border-[#D8E2F0] rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-[#0044B5] mb-1 uppercase tracking-wide">
                  Duración por persona (Horas) *
                </label>
                <input 
                  type="number" min="0.5" step="0.5" required
                  placeholder="Ej. 3"
                  value={durationHours} onChange={e => setDurationHours(e.target.value)}
                  className="input-brand w-full px-3 py-3 rounded-lg text-center font-bold text-[#0044B5]"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-[#0044B5] mb-1 uppercase tracking-wide">
                  Número de Voluntarios *
                </label>
                <input 
                  type="number" min="1" required
                  placeholder="Ej. 15"
                  value={volunteerCount} onChange={e => setVolunteerCount(parseInt(e.target.value) || 0)}
                  className="input-brand w-full px-3 py-3 rounded-lg text-center font-bold text-[#1A2340]"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-[#0044B5] mb-1 uppercase tracking-wide">
                  Beneficiarios Estimados *
                </label>
                <input 
                  type="number" min="0" required
                  placeholder="Ej. 50"
                  value={beneficiariesCount} onChange={e => setBeneficiariesCount(e.target.value)}
                  className="input-brand w-full px-3 py-3 rounded-lg text-center font-bold text-[#8A6400]"
                />
              </div>
            </div>

            {/* Leyenda aclaratoria para el llenado de horas */}
            <div className="flex items-start gap-2 bg-blue-50/70 border border-[#0044B5]/20 rounded-lg p-2.5 text-xs text-[#0044B5]">
              <span className="text-base leading-none">💡</span>
              <div className="flex-1 leading-relaxed">
                <span className="font-bold">Aclaración de llenado: </span>
                Ingresa la duración de la jornada por persona, no la suma de todo el grupo (ej. si 15 personas participaron durante 3 horas, ingresa <strong className="underline">3</strong>). El sistema calculará el impacto total automáticamente.
              </div>
            </div>

            {/* Previsualizador de Impacto en tiempo real */}
            {parseFloat(durationHours) > 0 && volunteerCount > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-[#D8E2F0] rounded-lg px-3.5 py-2 text-xs gap-1">
                <span className="text-[#4A5568] font-medium flex items-center gap-1.5">
                  <span>⏱️</span>
                  <span>Impacto total calculado:</span>
                </span>
                <span className="font-bold text-[#1A2340]">
                  {volunteerCount} {volunteerCount === 1 ? 'voluntario' : 'voluntarios'} × {durationHours} {parseFloat(durationHours) === 1 ? 'hora' : 'horas'} = <span className="text-sm text-[#0044B5] bg-[#FFBA00]/25 px-2 py-0.5 rounded font-black">{(volunteerCount * parseFloat(durationHours)).toLocaleString()} horas de impacto</span>
                </span>
              </div>
            )}

            {parseFloat(durationHours) > 24 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg p-2 text-xs font-medium animate-pulse">
                <span>⚠️</span>
                <span>Ingresaste más de 24 horas. Recuerda que es la duración de la jornada por persona, no el total acumulado del grupo.</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Describe las acciones que realizaste *</label>
            <textarea 
              placeholder="Detalla tu impacto..." required
              value={description} onChange={e => setDescription(e.target.value)}
              className="input-brand w-full px-4 py-3 rounded-lg min-h-[80px]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Comentarios generales o testimonios (Opcional)</label>
            <textarea 
              placeholder="¿Alguna anécdota o comentario de los participantes?"
              value={testimonials} onChange={e => setTestimonials(e.target.value)}
              className="input-brand w-full px-4 py-3 rounded-lg min-h-[80px]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Enlace a las fotos de la actividad *</label>
            <input 
              type="url" required placeholder="Ej. Enlace a Google Drive, OneDrive, Facebook..."
              value={evidenceLinks} onChange={e => setEvidenceLinks(e.target.value)}
              className="input-brand w-full px-4 py-3 rounded-lg border-[#FFBA00]/60 focus:border-[#FFBA00]"
            />
            <p className="text-[10px] text-[#8A6400] mt-1">Comparte un link público para evitar cargar imágenes pesadas al servidor.</p>
          </div>

          {/* Consentimiento Legal */}
          <div className="md:col-span-2 pt-6 border-t border-[#D8E2F0]">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={legalConsent}
                onChange={e => setLegalConsent(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#0044B5] rounded border-[#CBD5E1]"
              />
              <span className="text-sm text-[#4A5568] leading-relaxed group-hover:text-[#1A2340] transition-colors">
                He leído y acepto los <a href="#" className="text-[#0044B5] font-semibold underline decoration-[#0044B5]/30 underline-offset-2">Términos, Condiciones y Aviso de Privacidad</a> de United Way Chihuahua. Autorizo el uso de las fotografías y testimonios proporcionados para fines de reporte e impacto social de la organización.
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={!canSubmit() || loading || (activityType === 'Institucional' && !activityId)}
            className="md:col-span-2 w-full bg-[#0044B5] hover:bg-[#002D7A] text-white py-4 rounded-xl text-lg font-antonio uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <span className="animate-pulse">Procesando registro...</span>
            ) : (
              <>
                <span>Registrar Impacto</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
