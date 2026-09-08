import { useState, useRef, useEffect, useMemo } from 'react';
import { CORPORATIVOS_CATALOG } from '../utils/constants';

interface PredictiveCompanySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  helperText?: string;
  className?: string;
}

export default function PredictiveCompanySelector({
  value,
  onChange,
  placeholder = 'Buscar empresa o corporativo...',
  required = false,
  label,
  helperText,
  className = '',
}: PredictiveCompanySelectorProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantener query sincronizado con el prop value externo
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Filtrar sugerencias
  const suggestions = useMemo(() => {
    if (!query.trim()) {
      return CORPORATIVOS_CATALOG.slice(0, 15);
    }
    const cleanQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return CORPORATIVOS_CATALOG.filter(empresa => {
      const cleanEmpresa = empresa.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return cleanEmpresa.includes(cleanQuery);
    });
  }, [query]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (empresa: string) => {
    setQuery(empresa);
    onChange(empresa);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      } else if (query.trim()) {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setIsOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  // Función para resaltar la coincidencia
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-[#0044B5] font-black bg-[#FFBA00]/30 rounded-xs px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#4A5568] mb-1">
          {label} {required && <span className="text-[#0044B5] font-black">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          required={required}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="input-brand w-full pl-10 pr-9 py-3 rounded-lg text-sm text-[#1A2340] placeholder:text-[#9AA3B4]"
          autoComplete="off"
        />

        {/* Icono de búsqueda */}
        <div className="absolute left-3.5 text-[#9AA3B4] pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Botón limpiar o flecha indicadora */}
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 text-[#9AA3B4] hover:text-[#0044B5] hover:bg-slate-100 rounded-full transition-colors"
            title="Borrar texto"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-3 p-1 text-[#9AA3B4] hover:text-[#0044B5] transition-colors"
            tabIndex={-1}
          >
            <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-[#4A5568] mt-1">{helperText}</p>
      )}

      {/* Menú flotante de resultados predictivos */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#D8E2F0] rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-fade-in divide-y divide-slate-100">
          {suggestions.length > 0 ? (
            <>
              <div className="px-3 py-1.5 bg-[#F4F6FA] text-[10px] font-black text-[#9AA3B4] uppercase tracking-wider flex justify-between items-center">
                <span>Empresas y Corporativos sugeridos</span>
                <span>{suggestions.length} resultado(s)</span>
              </div>
              {suggestions.map((empresa, idx) => {
                const isSelected = value === empresa;
                const isHighlighted = highlightedIndex === idx;
                return (
                  <div
                    key={empresa}
                    onClick={() => handleSelect(empresa)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                      isHighlighted
                        ? 'bg-[#0044B5]/10 text-[#0044B5] font-semibold'
                        : isSelected
                        ? 'bg-[#0044B5]/5 text-[#0044B5] font-bold'
                        : 'text-[#1A2340] hover:bg-[#F4F6FA]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-60">🏭</span>
                      <span>{highlightMatch(empresa, query)}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[#0044B5] text-xs font-black">✓ Seleccionado</span>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="p-3.5 text-center">
              <p className="text-xs text-[#4A5568] font-medium mb-1">
                No se encontró &ldquo;<span className="font-bold text-[#0044B5]">{query}</span>&rdquo; en el catálogo.
              </p>
              <button
                type="button"
                onClick={() => {
                  onChange(query);
                  setIsOpen(false);
                }}
                className="text-xs text-[#0044B5] font-bold underline hover:text-[#002D7A]"
              >
                Usar &ldquo;{query}&rdquo; como nombre de organización
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
