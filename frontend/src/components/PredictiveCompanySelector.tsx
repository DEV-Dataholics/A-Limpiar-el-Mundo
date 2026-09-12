import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';

export interface Entity {
  id: number;
  name: string;
  display_name?: string;
  type: 'corporate' | 'plant' | 'division' | 'organization';
  corporate_id?: number | null;
  plant_id?: number | null;
  division_id?: number | null;
  hierarchy_path?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  onSelectEntity?: (entity: Entity) => void;
  onClearEntity?: () => void;
}

export default function PredictiveCompanySelector({
  value,
  onChange,
  label,
  required,
  placeholder = "Escribe para buscar o seleccionar...",
  helperText,
  onSelectEntity,
  onClearEntity
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skipSearchRef = useRef(false);

  // Sincronizar valor externo cuando el padre lo modifique directamente
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    setLoading(true);
    try {
      const url = searchQuery.trim()
        ? `${API_URL}/api/corporates/search?q=${encodeURIComponent(searchQuery.trim())}`
        : `${API_URL}/api/corporates/search`;
      const res = await fetch(url);
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.data || []);
      setResults(items);
    } catch (err) {
      console.error("Error fetching corporates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce para búsqueda conforme teclea
  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    const fetchDebounce = setTimeout(() => {
      fetchSuggestions(query);
    }, 200);

    return () => clearTimeout(fetchDebounce);
  }, [query]);

  const handleSelect = (entity: Entity) => {
    skipSearchRef.current = true;
    const displayText = entity.display_name || entity.name || '';
    setQuery(displayText);
    onChange(displayText);
    setShowDropdown(false);
    if (onSelectEntity) {
      onSelectEntity(entity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    skipSearchRef.current = false;
    const nextVal = e.target.value;
    setQuery(nextVal);
    onChange(nextVal);
    setShowDropdown(true);
    if (onClearEntity) {
      onClearEntity();
    }
  };

  const handleFocus = () => {
    setShowDropdown(true);
    if (results.length === 0) {
      fetchSuggestions(query);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-black text-[#0044B5] mb-1 uppercase tracking-wide">
        {label} {required && '*'}
      </label>

      <div className="relative">
        <input
          type="text"
          required={required}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="input-brand w-full pl-4 pr-10 py-3 rounded-lg bg-white"
          autoComplete="off"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#0044B5] border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {helperText && <p className="text-[10px] text-[#4A5568] mt-1">{helperText}</p>}
      
      {/* Menú Rápido Desplegable de Sugerencias */}
      {showDropdown && (
        <div className="absolute z-30 w-full mt-1.5 bg-white border border-[#D8E2F0] shadow-xl rounded-xl max-h-64 overflow-y-auto custom-scrollbar animate-fade-in">
          {loading && (
            <div className="px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-[#0044B5] border-t-transparent rounded-full animate-spin" />
              Buscando en catálogo de empresas y escuelas...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-4 py-3.5 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Sin coincidencias exactas en el catálogo.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Puedes continuar con el nombre ingresado para registrarlo.</p>
            </div>
          )}

          {!loading && results.map((item, idx) => (
            <button
              key={`${item.id}-${item.type}-${idx}`}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50/70 focus:bg-blue-50 focus:outline-none border-b border-slate-100 last:border-b-0 transition-colors flex items-start justify-between gap-3 group"
            >
              <div className="flex-1">
                <div className="font-bold text-[#1A2340] group-hover:text-[#0044B5] transition-colors leading-snug">
                  {item.display_name || item.name}
                </div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA00]" />
                  {item.type === 'corporate' && 'Corporativo'}
                  {item.type === 'plant' && 'Planta Corporativa'}
                  {item.type === 'division' && 'División'}
                  {item.type === 'organization' && 'Escuela / Organización'}
                </div>
              </div>
              <span className="text-xs text-[#0044B5] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                Elegir ↵
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
