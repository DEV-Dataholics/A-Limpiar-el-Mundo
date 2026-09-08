import { useState, useEffect, useMemo } from 'react';

// Fuente de datos: https://raw.githubusercontent.com/cisnerosnow/json-estados-municipios-mexico/master/estados-municipios.json
const DATA_URL = "https://raw.githubusercontent.com/cisnerosnow/json-estados-municipios-mexico/master/estados-municipios.json";

interface LocationSelectorProps {
  selectedState: string;
  selectedMunicipality: string;
  onStateChange: (state: string) => void;
  onMunicipalityChange: (municipality: string) => void;
}

export default function LocationSelector({ 
  selectedState, 
  selectedMunicipality, 
  onStateChange, 
  onMunicipalityChange 
}: LocationSelectorProps) {
  const [data, setData] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [stateSearch, setStateSearch] = useState(selectedState);
  const [muniSearch, setMuniSearch] = useState(selectedMunicipality);
  const [showStateList, setShowStateList] = useState(false);
  const [showMuniList, setShowMuniList] = useState(false);

  useEffect(() => {
    fetch(DATA_URL)
      .then(res => res.json())
      .then(json => {
        // Transformar la estructura si es necesario
        // El JSON de cisnerosnow tiene la forma { "Estado": ["Muni1", "Muni2"] }
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading locations", err);
        setLoading(false);
      });
  }, []);

  const states = useMemo(() => Object.keys(data).sort(), [data]);
  
  const filteredStates = useMemo(() => {
    if (!stateSearch) return states;
    return states.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [stateSearch, states]);

  const municipalities = useMemo(() => {
    if (!selectedState || !data[selectedState]) return [];
    return data[selectedState].sort();
  }, [selectedState, data]);

  const filteredMunis = useMemo(() => {
    if (!muniSearch) return municipalities;
    return municipalities.filter(m => m.toLowerCase().includes(muniSearch.toLowerCase()));
  }, [muniSearch, municipalities]);

  const handleStateSelect = (state: string) => {
    onStateChange(state);
    setStateSearch(state);
    setShowStateList(false);
    onMunicipalityChange(''); // Reset muni when state changes
    setMuniSearch('');
  };

  const handleMuniSelect = (muni: string) => {
    onMunicipalityChange(muni);
    setMuniSearch(muni);
    setShowMuniList(false);
  };

  if (loading) return <div className="text-xs text-gray-400 animate-pulse">Cargando catálogo de localidades...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Estado */}
      <div className="relative">
        <label className="block text-sm font-semibold text-[#b3d4f0] mb-1">Estado</label>
        <input 
          type="text"
          placeholder="Buscar estado..."
          value={stateSearch}
          onFocus={() => setShowStateList(true)}
          onChange={(e) => {
            setStateSearch(e.target.value);
            setShowStateList(true);
          }}
          className="w-full bg-[#001224] border border-[#005191]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f57921]"
        />
        {showStateList && filteredStates.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-[#001f3f] border border-[#005191]/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
            {filteredStates.map(s => (
              <div 
                key={s}
                onClick={() => handleStateSelect(s)}
                className="px-4 py-2 hover:bg-[#f57921]/20 cursor-pointer text-white transition-colors"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Municipio */}
      <div className="relative">
        <label className="block text-sm font-semibold text-[#b3d4f0] mb-1">Municipio</label>
        <input 
          type="text"
          placeholder={selectedState ? "Buscar municipio..." : "Selecciona un estado primero"}
          disabled={!selectedState}
          value={muniSearch}
          onFocus={() => setShowMuniList(true)}
          onChange={(e) => {
            setMuniSearch(e.target.value);
            setShowMuniList(true);
          }}
          className={`w-full bg-[#001224] border border-[#005191]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f57921] ${!selectedState ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {showMuniList && filteredMunis.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-[#001f3f] border border-[#005191]/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
            {filteredMunis.map(m => (
              <div 
                key={m}
                onClick={() => handleMuniSelect(m)}
                className="px-4 py-2 hover:bg-[#f57921]/20 cursor-pointer text-white transition-colors"
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
