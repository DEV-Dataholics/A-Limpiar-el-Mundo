import { useEffect, useState } from 'react';
import { API_URL } from '../config';

type ImpactRegistration = {
  id: number;
  activity_id: number;
  description: string;
  evidence_image: string;
  activity_name: string | null;
  created_at: string;
};

export default function ImpactFeedGrid() {
  const [items, setItems] = useState<ImpactRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/registrations`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 text-[#0044B5] font-antonio text-xl animate-pulse uppercase tracking-widest">Cargando muro de impacto comunitario...</div>;

  return (
    <div className="mt-16">
      <h2 className="heading-brand text-3xl md:text-5xl text-center mb-4">
        Muro de Impacto <span className="text-[#FFBA00]">Ciudadano</span>
      </h2>
      <div className="divider-gold mx-auto"></div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-[2rem] overflow-hidden bg-[#F4F6FA] border-2 border-transparent hover:border-[#FFBA00] transition-all cursor-pointer shadow-md hover:shadow-2xl">
            <img
              src={item.evidence_image ? `${API_URL}/uploads/${item.evidence_image}` : 'https://images.unsplash.com/photo-1559027615-cd26735550b4?w=400&q=80'}
              alt={item.description}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-2"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0044B5] via-[#0044B5]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 transform translate-y-4 group-hover:translate-y-0">
              <p className="font-antonio text-[#FFBA00] text-sm uppercase mb-2 tracking-widest">
                {item.activity_name || 'Acción Ciudadana'}
              </p>
              <p className="text-xs text-white font-medium line-clamp-3 leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                {item.description || 'Participación verificada en A Limpiar el Mundo.'}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-[10px] text-white/70 font-bold uppercase tracking-tighter">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <div className="w-6 h-6 bg-[#FFBA00] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#0044B5]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full border border-white/30 opacity-100 group-hover:opacity-0 transition-opacity">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-400 text-sm font-medium italic">Mostrando las participaciones más recientes de la comunidad.</p>
      </div>
    </div>
  );
}
