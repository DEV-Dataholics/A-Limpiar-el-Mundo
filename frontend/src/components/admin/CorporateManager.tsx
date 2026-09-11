import React, { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../../config';

interface Corporate {
  id: number;
  name: string;
  slug: string;
  code?: string | null;
  total_headcount?: number;
  plants_count: number;
  divisions_count: number;
  created_at?: string;
}

interface Plant {
  id: number;
  corporate_id: number;
  division_id?: number | null;
  name: string;
  corporate_name?: string;
  division_name?: string | null;
  location_name?: string | null;
}

interface Division {
  id: number;
  corporate_id: number;
  name: string;
  code?: string | null;
}

export default function CorporateManager({ token: propToken }: { token?: string } = {}) {
  const [corporates, setCorporates] = useState<Corporate[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [showCorpModal, setShowCorpModal] = useState(false);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Formulario Nueva Empresa
  const [newCorpName, setNewCorpName] = useState('');
  const [newCorpCode, setNewCorpCode] = useState('');
  const [newCorpInitialPlant, setNewCorpInitialPlant] = useState('');

  // Formulario Nueva Planta
  const [selectedCorpIdForPlant, setSelectedCorpIdForPlant] = useState<number | ''>('');
  const [selectedDivIdForPlant, setSelectedDivIdForPlant] = useState<number | ''>('');
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantLocation, setNewPlantLocation] = useState('');

  const token = propToken || localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/corporates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCorporates(data.corporates || []);
        setPlants(data.plants || []);
        setDivisions(data.divisions || []);
      } else if (res.status === 401 || res.status === 403) {
        setErrorMsg('Tu sesión actual ha expirado o requiere renovación. Por favor haz clic en "Salir →" en la esquina superior derecha y vuelve a entrar como Administrador.');
      } else {
        setErrorMsg(data.error || data.message || 'Error al obtener empresas');
      }
    } catch (err) {
      console.error('Error fetching corporates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrado reactivo de corporativos y plantas
  const filteredCorporates = useMemo(() => {
    return corporates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plants.some(p => p.corporate_id === c.id && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [corporates, plants, searchTerm]);

  // Manejador Crear Empresa
  const handleCreateCorporate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCorpName.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/corporates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCorpName.trim(),
          code: newCorpCode.trim() || null,
          initial_plant_name: newCorpInitialPlant.trim() || null
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Empresa "${newCorpName}" dada de alta correctamente.`);
        setNewCorpName('');
        setNewCorpCode('');
        setNewCorpInitialPlant('');
        setShowCorpModal(false);
        fetchData();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.messages ? Object.values(data.messages).join(', ') : (data.message || 'Error al crear empresa'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  // Manejador Crear Planta
  const handleCreatePlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCorpIdForPlant || !newPlantName.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          corporate_id: selectedCorpIdForPlant,
          division_id: selectedDivIdForPlant || null,
          name: newPlantName.trim(),
          location_name: newPlantLocation.trim() || null
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Planta "${newPlantName}" agregada con éxito.`);
        setNewPlantName('');
        setNewPlantLocation('');
        setSelectedDivIdForPlant('');
        setShowPlantModal(false);
        fetchData();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.messages ? Object.values(data.messages).join(', ') : (data.message || 'Error al agregar planta'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  // Manejador Eliminar Empresa
  const handleDeleteCorp = async (id: number, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${name}" y todas sus plantas asociadas?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/corporates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMsg(`Empresa "${name}" eliminada.`);
        fetchData();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Manejador Eliminar Planta
  const handleDeletePlant = async (plantId: number, plantName: string) => {
    if (!window.confirm(`¿Eliminar la planta "${plantName}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/plants/${plantId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMsg(`Planta eliminada.`);
        fetchData();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Divisiones del corporativo seleccionado en el modal
  const currentCorpDivisions = useMemo(() => {
    if (!selectedCorpIdForPlant) return [];
    return divisions.filter(d => d.corporate_id === Number(selectedCorpIdForPlant));
  }, [divisions, selectedCorpIdForPlant]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Notificaciones */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold">✓</span>
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-800">✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-600">⚠️</span>
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-amber-500 hover:text-amber-800">✕</button>
        </div>
      )}

      {/* Barra de Acciones y Estadísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#D8E2F0] shadow-sm">
        <div>
          <h3 className="font-antonio text-2xl text-[#0044B5] uppercase flex items-center gap-2">
            <span className="divider-gold" />
            Catálogo de Empresas y Plantas
          </h3>
          <p className="text-xs text-[#4A5568] mt-1">
            Gestiona los corporativos donantes y sus centros operativos / plantas asignadas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setErrorMsg(null);
              setShowCorpModal(true);
            }}
            className="btn-brand-blue px-5 py-2.5 rounded-xl font-antonio text-sm uppercase tracking-wider flex items-center gap-2 shadow-sm hover:scale-105 transition-all text-white"
          >
            <span>+</span> Nueva Empresa
          </button>

          <button
            onClick={() => {
              setErrorMsg(null);
              if (corporates.length > 0 && !selectedCorpIdForPlant) {
                setSelectedCorpIdForPlant(corporates[0].id);
              }
              setShowPlantModal(true);
            }}
            className="px-5 py-2.5 rounded-xl font-antonio text-sm uppercase tracking-wider bg-white border-2 border-[#0044B5] text-[#0044B5] hover:bg-[#0044B5] hover:text-white transition-all shadow-sm"
          >
            <span>+</span> Nueva Planta
          </button>
        </div>
      </div>

      {/* Buscador y Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar por empresa o planta..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-brand w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>{corporates.length} Empresas</span>
          <span>•</span>
          <span>{plants.length} Plantas Activas</span>
        </div>
      </div>

      {/* Lista / Acordeón de Empresas */}
      {loading ? (
        <div className="text-center py-12 text-[#0044B5] font-antonio text-xl animate-pulse">
          Cargando catálogo corporativo...
        </div>
      ) : filteredCorporates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#D8E2F0]">
          <p className="font-antonio text-lg text-slate-500 uppercase tracking-wide">No se encontraron empresas con esa búsqueda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCorporates.map(corp => {
            const corpPlants = plants.filter(p => p.corporate_id === corp.id);
            return (
              <div key={corp.id} className="bg-white rounded-2xl border border-[#D8E2F0] shadow-sm overflow-hidden hover:border-[#0044B5]/40 transition-colors">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60 border-b border-[#D8E2F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0044B5]/10 text-[#0044B5] flex items-center justify-center font-antonio text-lg font-black">
                      {corp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-antonio text-xl text-[#002D7A] uppercase tracking-wide flex items-center gap-2">
                        {corp.name}
                        {corp.code && (
                          <span className="text-[10px] bg-[#FFBA00]/20 text-[#856404] px-2 py-0.5 rounded font-bold">
                            {corp.code}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {corpPlants.length} planta{corpPlants.length !== 1 ? 's' : ''} registrada{corpPlants.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCorpIdForPlant(corp.id);
                        setErrorMsg(null);
                        setShowPlantModal(true);
                      }}
                      className="text-xs font-bold text-[#0044B5] hover:text-[#002D7A] bg-white border border-[#D8E2F0] hover:border-[#0044B5] px-3 py-1.5 rounded-lg transition-all"
                    >
                      + Agregar Planta
                    </button>
                    <button
                      onClick={() => handleDeleteCorp(corp.id, corp.name)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all"
                      title="Eliminar Empresa"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Desglose de Plantas */}
                <div className="p-4 bg-white">
                  {corpPlants.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2 pl-2">Sin plantas asignadas aún. Puedes agregar una con el botón "+ Agregar Planta".</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {corpPlants.map(plant => (
                        <div
                          key={plant.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-xs text-[#1A2340]"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold block truncate">{plant.name}</span>
                            {plant.division_name && (
                              <span className="inline-block text-[10px] font-semibold text-[#0044B5] bg-blue-50 px-1.5 py-0.5 rounded mt-0.5">
                                {plant.division_name}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeletePlant(plant.id, plant.name)}
                            className="text-slate-300 hover:text-rose-500 font-bold px-1.5 py-0.5 transition-colors"
                            title="Eliminar planta"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Nueva Empresa */}
      {showCorpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D8E2F0] shadow-2xl relative">
            <button
              onClick={() => setShowCorpModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>

            <h4 className="font-antonio text-2xl text-[#0044B5] uppercase mb-1">
              Dar de Alta Empresa
            </h4>
            <p className="text-xs text-slate-500 mb-5">
              Ingresa los datos para registrar un nuevo corporativo donante en el sistema.
            </p>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCorporate} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#0044B5] uppercase mb-1">Nombre de la Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Honeywell, Siemens, etc."
                  value={newCorpName}
                  onChange={e => setNewCorpName(e.target.value)}
                  className="input-brand w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0044B5] uppercase mb-1">Código o Abreviación (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. HW, SIE"
                  value={newCorpCode}
                  onChange={e => setNewCorpCode(e.target.value)}
                  className="input-brand w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0044B5] uppercase mb-1">Nombre de Planta Inicial (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. Planta Complejo Chihuahua"
                  value={newCorpInitialPlant}
                  onChange={e => setNewCorpInitialPlant(e.target.value)}
                  className="input-brand w-full px-4 py-2.5 rounded-xl text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">Si la empresa cuenta con una planta principal, puedes registrarla de una vez.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorpModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-antonio text-sm uppercase text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newCorpName.trim()}
                  className="flex-1 py-2.5 rounded-xl btn-brand-blue font-antonio text-sm uppercase text-white disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Guardar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nueva Planta */}
      {showPlantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D8E2F0] shadow-2xl relative">
            <button
              onClick={() => setShowPlantModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>

            <h4 className="font-antonio text-2xl text-[#0044B5] uppercase mb-1">
              Agregar Planta
            </h4>
            <p className="text-xs text-slate-500 mb-5">
              Registra una nueva planta o centro de trabajo asignado a una empresa.
            </p>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreatePlant} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#0044B5] uppercase mb-1">Empresa / Corporativo *</label>
                <select
                  required
                  value={selectedCorpIdForPlant}
                  onChange={e => setSelectedCorpIdForPlant(Number(e.target.value))}
                  className="input-brand w-full px-4 py-2.5 rounded-xl text-sm"
                >
                  <option value="">Selecciona una empresa</option>
                  {corporates.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {currentCorpDivisions.length > 0 && (
                <div>
                  <label className="block text-xs font-black text-[#0044B5] uppercase mb-1">División Corporativa</label>
                  <select
                    value={selectedDivIdForPlant}
                    onChange={e => setSelectedDivIdForPlant(e.target.value ? Number(e.target.value) : '')}
                    className="input-brand w-full px-4 py-2.5 rounded-xl text-sm"
                  >
                    <option value="">Sin división específica</option>
                    {currentCorpDivisions.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-[#0044B5] uppercase mb-1">Nombre de la Planta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Planta Torres, Complejo Sur, etc."
                  value={newPlantName}
                  onChange={e => setNewPlantName(e.target.value)}
                  className="input-brand w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0044B5] uppercase mb-1">Ubicación / Ciudad (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. Cd. Juárez, Chihuahua, etc."
                  value={newPlantLocation}
                  onChange={e => setNewPlantLocation(e.target.value)}
                  className="input-brand w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPlantModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-antonio text-sm uppercase text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedCorpIdForPlant || !newPlantName.trim()}
                  className="flex-1 py-2.5 rounded-xl btn-brand-blue font-antonio text-sm uppercase text-white disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Guardar Planta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
