import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';

interface Entity {
  id: number;
  name: string;
  type: 'corporate' | 'plant' | 'division';
  corporate_id?: number | null;
  plant_id?: number | null;
  division_id?: number | null;
  hierarchy_path?: string; // Optional nice-to-have if backend provides it
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
  placeholder,
  helperText,
  onSelectEntity,
  onClearEntity
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDebounce = setTimeout(async () => {
      if (query.trim().length >= 2 && query !== value) {
        setLoading(true);
        try {
          const res = await fetch(`${API_URL}/api/corporates/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          // Adjust based on typical CI4 response wrapper
          const items = Array.isArray(data) ? data : (data.data || []);
          setResults(items);
          setShowDropdown(true);
        } catch (err) {
          console.error("Error fetching corporates:", err);
        } finally {
          setLoading(false);
        }
      } else if (query.trim().length < 2) {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(fetchDebounce);
  }, [query, value]);

  const handleSelect = (entity: Entity) => {
    // Set the visible text to the chosen entity's name (or path)
    const displayText = entity.hierarchy_path || entity.name;
    onChange(displayText);
    setQuery(displayText);
    setShowDropdown(false);
    if (onSelectEntity) {
      onSelectEntity(entity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onChange(e.target.value); // Keep external state somewhat synced
    if (onClearEntity) {
      onClearEntity(); // Clear IDs when user types something new
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-black text-[#0044B5] mb-1 uppercase tracking-wide">
        {label} {required && '*'}
      </label>
      <input
        type="text"
        required={required}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (results.length > 0) setShowDropdown(true);
        }}
        className="input-brand w-full px-4 py-3 rounded-lg bg-white"
        autoComplete="off"
      />
      {helperText && <p className="text-[10px] text-[#4A5568] mt-1">{helperText}</p>}
      
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#D8E2F0] shadow-lg rounded-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500">Buscando...</div>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="px-4 py-3 text-sm text-gray-500">No se encontraron resultados.</div>
          )}
          {!loading && results.map((item, idx) => (
            <button
              key={`${item.id}-${item.type}-${idx}`}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="font-semibold text-[#1A2340]">{item.name}</div>
              <div className="text-xs text-gray-500 uppercase">
                {item.type === 'corporate' && 'Corporativo'}
                {item.type === 'plant' && 'Planta'}
                {item.type === 'division' && 'División'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
