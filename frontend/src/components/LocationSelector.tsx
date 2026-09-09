import { useState, useEffect, useMemo } from 'react';

// Fuente de datos: https://raw.githubusercontent.com/cisnerosnow/json-estados-municipios-mexico/master/estados-municipios.json
const DATA_URL = "https://raw.githubusercontent.com/cisnerosnow/json-estados-municipios-mexico/master/estados-municipios.json";

interface LocationSelectorProps {
  selectedState: string;
  selectedMunicipality: string;
  onStateChange: (state: string) => void;
  onMunicipalityChange: (municipality: string) => void;
  showLabels?: boolean;
  labelClassName?: string;
}

export default function LocationSelector({ 
  selectedState, 
  selectedMunicipality, 
  onStateChange, 
  onMunicipalityChange,
  showLabels = true,
  labelClassName
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

  if (loading) return <div className="text-xs text-slate-500 animate-pulse py-2">Cargando catálogo de localidades...</div>;

  const resolvedLabelClass = labelClassName || "block text-sm font-semibold text-[#1A2340] mb-1.5";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Estado */}
      <div className="relative">
        {showLabels && <label className={resolvedLabelClass}>Estado</label>}
        <input 
          type="text"
          placeholder="Buscar estado..."
          value={stateSearch}
          onFocus={() => setShowStateList(true)}
          onChange={(e) => {
            setStateSearch(e.target.value);
            setShowStateList(true);
          }}
          className="w-full bg-white border border-[#D8E2F0] rounded-xl px-4 py-3 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0044B5] focus:ring-2 focus:ring-[#0044B5]/15 transition-all shadow-sm"
        />
        {showStateList && filteredStates.length > 0 && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-[#D8E2F0] rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-100 text-sm">
            {filteredStates.map(s => (
              <div 
                key={s}
                onClick={() => handleStateSelect(s)}
                className="px-4 py-2.5 hover:bg-[#0044B5]/10 hover:text-[#0044B5] cursor-pointer text-slate-700 transition-colors font-medium"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Municipio */}
      <div className="relative">
        {showLabels && <label className={resolvedLabelClass}>Municipio</label>}
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
          className={`w-full bg-white border border-[#D8E2F0] rounded-xl px-4 py-3 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0044B5] focus:ring-2 focus:ring-[#0044B5]/15 transition-all shadow-sm ${!selectedState ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : ''}`}
        />
        {showMuniList && filteredMunis.length > 0 && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-[#D8E2F0] rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-100 text-sm">
            {filteredMunis.map(m => (
              <div 
                key={m}
                onClick={() => handleMuniSelect(m)}
                className="px-4 py-2.5 hover:bg-[#0044B5]/10 hover:text-[#0044B5] cursor-pointer text-slate-700 transition-colors font-medium"
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
