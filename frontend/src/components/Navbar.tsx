import { Link } from 'react-router-dom';

export default function Navbar() {
  const uwchLogo = '/logo-uwch-35.png';
  const alemLogo = '/logo-a-limpiar-el-mundo.png';

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-[#D8E2F0]">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group transition-transform hover:scale-105">
            <img src={uwchLogo} alt="United Way Chihuahua - 35 Aniversario" className="h-10 sm:h-12 object-contain" />
            <div className="h-8 w-[2px] bg-[#0044B5]/20 mx-1 hidden sm:block"></div>
            <img src={alemLogo} alt="A Limpiar el Mundo" className="h-9 sm:h-11 object-contain" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/#actividades" className="text-slate-700 hover:text-[#0044B5] font-bold text-sm uppercase tracking-widest transition-colors">
            Actividades
          </a>
          <a href="/#causas" className="text-slate-700 hover:text-[#0044B5] font-bold text-sm uppercase tracking-widest transition-colors">
            Causa
          </a>
          <a href="/#impacto" className="text-slate-700 hover:text-[#0044B5] font-bold text-sm uppercase tracking-widest transition-colors">
            Impacto
          </a>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <Link to="/login" className="text-[#0044B5] hover:text-[#21296B] font-bold text-sm uppercase tracking-widest transition-colors">
            Ingresar
          </Link>
          <Link to="/register" className="btn-brand-gold px-6 py-2.5 text-sm rounded-full shadow-sm hover:scale-105 transition-transform">
            Únete
          </Link>
        </nav>

        {/* Mobile Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/login" className="text-[#0044B5] font-bold text-xs uppercase tracking-wider px-2 py-1">
            Ingresar
          </Link>
          <Link to="/register" className="btn-brand-gold px-4 py-2 text-xs rounded-full">
            Únete
          </Link>
        </div>
      </div>
    </header>
  );
}
