import React from 'react';

interface BotanicalPlantProps {
  mousePos: { x: number; y: number };
  isHovered: boolean;
  className?: string;
}

/**
 * Ilustración botánica vectorizada para el Hero de "A Limpiar el Mundo 2026".
 * Se coloca detrás de la fotografía principal y reacciona al movimiento del mouse
 * con una física de paralaje orgánico (depth layering), simbolizando la naturaleza,
 * la reforestación y el reverdecimiento de espacios públicos.
 */
export const BotanicalPlant: React.FC<BotanicalPlantProps> = ({
  mousePos,
  isHovered,
  className = ''
}) => {
  // Factores de movimiento y oscilación orgánica
  const transX = -mousePos.x * 28;
  const transY = -mousePos.y * 24;
  const rotateDeg = mousePos.x * 6;
  const swayOffset = mousePos.y * 4;

  return (
    <div
      className={`pointer-events-none select-none transition-transform ease-out ${className}`}
      style={{
        transform: `translate3d(${transX}px, ${transY}px, -15px) rotate(${rotateDeg}deg)`,
        transformOrigin: 'bottom left',
        transition: isHovered
          ? 'transform 0.15s ease-out'
          : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_16px_30px_rgba(0,148,100,0.18)] overflow-visible"
      >
        <defs>
          {/* Gradiente Hoja Principal (Monstera central) */}
          <linearGradient id="monsteraGrad" x1="60" y1="60" x2="340" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#82D8A4" />
            <stop offset="45%" stopColor="#009464" />
            <stop offset="100%" stopColor="#085237" />
          </linearGradient>

          {/* Gradiente Hoja Lateral Izquierda */}
          <linearGradient id="leafGradLeft" x1="120" y1="40" x2="220" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A3E7B8" />
            <stop offset="70%" stopColor="#009464" />
            <stop offset="100%" stopColor="#0D6846" />
          </linearGradient>

          {/* Gradiente Hoja Superior Elevada */}
          <linearGradient id="leafGradTop" x1="180" y1="10" x2="320" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C6F7DA" />
            <stop offset="50%" stopColor="#009464" />
            <stop offset="100%" stopColor="#06402A" />
          </linearGradient>

          {/* Gradiente Hojas Secundarias Silvestres */}
          <linearGradient id="leafGradSubtle" x1="40" y1="180" x2="180" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#82D8A4" />
            <stop offset="100%" stopColor="#007A50" />
          </linearGradient>

          {/* Gradiente Tallo Orgánico Principal */}
          <linearGradient id="stemGrad" x1="20" y1="380" x2="300" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06402A" />
            <stop offset="50%" stopColor="#009464" />
            <stop offset="100%" stopColor="#82D8A4" />
          </linearGradient>
        </defs>

        {/* Resplandor bio-orgánico suave de fondo */}
        <circle cx="210" cy="210" r="140" fill="#82D8A4" fillOpacity="0.12" filter="blur(28px)" />

        {/* 1. TALLO CURVO PRINCIPAL */}
        <path
          d="M 50 390 C 90 340 140 280 200 210 C 240 160 280 110 320 60"
          stroke="url(#stemGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 2. HOJA MONSTERA EMBLEMÁTICA (Grande, estilizada, con calados orgánicos) */}
        <g
          style={{
            transform: `rotate(${swayOffset * 0.8}deg)`,
            transformOrigin: '230px 180px',
            transition: 'transform 0.2s ease-out'
          }}
        >
          {/* Silueta con escotaduras botánicas tipo Monstera */}
          <path
            d="M 210 200 
               C 220 160 240 120 280 90 
               C 310 68 350 72 370 100 
               C 388 125 385 160 365 190 
               C 345 220 310 245 270 255 
               C 240 262 215 240 210 200 Z"
            fill="url(#monsteraGrad)"
            opacity="0.95"
          />
          {/* Calados/perforaciones características de hoja monstera */}
          <path
            d="M 330 110 C 315 125 305 145 315 155 C 322 162 338 152 348 138 C 355 128 345 112 330 110 Z"
            fill="#FFFFFF"
            fillOpacity="0.85"
          />
          <path
            d="M 290 140 C 275 155 270 175 280 182 C 288 188 302 178 312 165 C 318 155 305 142 290 140 Z"
            fill="#FFFFFF"
            fillOpacity="0.85"
          />
          <path
            d="M 320 185 C 305 200 300 215 310 222 C 318 226 330 218 338 208 C 342 200 332 190 320 185 Z"
            fill="#FFFFFF"
            fillOpacity="0.85"
          />
          {/* Nervadura central de la Monstera */}
          <path
            d="M 210 200 Q 275 170 365 105"
            stroke="#C6F7DA"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
          {/* Nervaduras secundarias */}
          <path d="M 250 180 Q 285 145 325 120" stroke="#C6F7DA" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
          <path d="M 270 195 Q 310 175 345 165" stroke="#C6F7DA" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
        </g>

        {/* 3. HOJA SUPERIOR ELEVADA (Alargada, tierna, apuntando hacia el cielo) */}
        <g
          style={{
            transform: `rotate(${-swayOffset * 1.2}deg)`,
            transformOrigin: '210px 200px',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <path
            d="M 200 210
               C 180 160 185 110 215 65
               C 230 40 260 25 285 35
               C 305 45 310 75 300 105
               C 285 145 250 185 200 210 Z"
            fill="url(#leafGradTop)"
            opacity="0.9"
          />
          {/* Nervadura */}
          <path
            d="M 200 210 Q 235 130 280 40"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
          <path d="M 220 160 Q 255 135 280 115" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
          <path d="M 210 130 Q 240 100 265 80" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
        </g>

        {/* 4. HOJA LATERAL DERECHA (Desplegada en abanico) */}
        <g
          style={{
            transform: `rotate(${swayOffset * 0.9}deg)`,
            transformOrigin: '170px 240px',
            transition: 'transform 0.25s ease-out'
          }}
        >
          <path
            d="M 170 240
               C 195 235 240 235 285 260
               C 315 278 325 310 310 328
               C 290 345 260 340 230 320
               C 190 295 175 265 170 240 Z"
            fill="url(#leafGradLeft)"
            opacity="0.92"
          />
          {/* Nervadura */}
          <path
            d="M 170 240 Q 240 270 305 320"
            stroke="#C6F7DA"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
        </g>

        {/* 5. HOJAS SILVESTRES COMPAÑERAS (Brote fresco en la base) */}
        <g>
          {/* Hoja izquierda baja */}
          <path
            d="M 130 280
               C 100 260 70 265 50 285
               C 35 300 40 320 60 328
               C 85 335 115 315 130 280 Z"
            fill="url(#leafGradSubtle)"
            opacity="0.88"
          />
          <path d="M 130 280 Q 85 300 55 315" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />

          {/* Hoja secundaria izquierda alta */}
          <path
            d="M 150 250
               C 120 215 95 210 75 230
               C 60 245 65 268 85 278
               C 110 288 135 275 150 250 Z"
            fill="url(#leafGradLeft)"
            opacity="0.85"
          />
          <path d="M 150 250 Q 105 245 78 250" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
        </g>

        {/* 6. DETALLES FINOS DE ROCÍO / LUZ BOTÁNICA */}
        <circle cx="295" cy="85" r="4.5" fill="#FFFFFF" fillOpacity="0.75" />
        <circle cx="340" cy="180" r="3.5" fill="#FFFFFF" fillOpacity="0.6" />
        <circle cx="230" cy="120" r="3" fill="#82D8A4" fillOpacity="0.8" />
        <circle cx="260" cy="300" r="4" fill="#FFFFFF" fillOpacity="0.7" />
      </svg>
    </div>
  );
};

/**
 * Brote botánico secundario para la esquina inferior opuesta (equilibrio visual).
 */
export const BotanicalSprout: React.FC<BotanicalPlantProps> = ({
  mousePos,
  isHovered,
  className = ''
}) => {
  // Movimiento contrapuesto sutil para efecto de profundidad estéreo
  const transX = mousePos.x * 20;
  const transY = mousePos.y * 18;
  const rotateDeg = -mousePos.x * 8;

  return (
    <div
      className={`pointer-events-none select-none transition-transform ease-out ${className}`}
      style={{
        transform: `translate3d(${transX}px, ${transY}px, -10px) rotate(${rotateDeg}deg)`,
        transformOrigin: 'top right',
        transition: isHovered
          ? 'transform 0.15s ease-out'
          : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,148,100,0.15)] overflow-visible"
      >
        <defs>
          <linearGradient id="sproutGrad1" x1="20" y1="220" x2="200" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#009464" />
            <stop offset="60%" stopColor="#82D8A4" />
            <stop offset="100%" stopColor="#C6F7DA" />
          </linearGradient>
          <linearGradient id="sproutGrad2" x1="100" y1="200" x2="220" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#085237" />
            <stop offset="100%" stopColor="#009464" />
          </linearGradient>
        </defs>

        {/* Tallo del brote */}
        <path
          d="M 210 220 Q 150 180 90 120"
          stroke="#009464"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Hoja principal del brote */}
        <path
          d="M 90 120
             C 60 90 40 60 45 35
             C 50 15 75 15 95 30
             C 120 50 125 90 90 120 Z"
          fill="url(#sproutGrad1)"
        />
        <path d="M 90 120 Q 70 65 65 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />

        {/* Hoja lateral izquierda */}
        <path
          d="M 135 155
             C 105 150 75 160 65 178
             C 55 195 72 205 92 200
             C 118 192 130 172 135 155 Z"
          fill="url(#sproutGrad2)"
        />
        <path d="M 135 155 Q 98 178 78 190" stroke="#82D8A4" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />

        {/* Hoja lateral derecha */}
        <path
          d="M 160 175
             C 165 140 185 120 205 125
             C 220 130 222 150 210 165
             C 195 182 175 185 160 175 Z"
          fill="url(#sproutGrad1)"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};

/**
 * Ilustración de Cactus Saguaro/Órgano del desierto de Chihuahua.
 * Vectorizado con estilizado botánico moderno en tonos verdes institucionales,
 * con brazos volumétricos, costillas longitudinales, sutil flor del desierto
 * y física de paralaje orgánico para asomarse detrás de la tarjeta fotográfica.
 */
export const BotanicalCactus: React.FC<BotanicalPlantProps> = ({
  mousePos,
  isHovered,
  className = ''
}) => {
  const transX = -mousePos.x * 22;
  const transY = -mousePos.y * 18;
  const rotateDeg = mousePos.x * 5;
  const swayOffset = mousePos.y * 3;

  return (
    <div
      className={`pointer-events-none select-none transition-transform ease-out ${className}`}
      style={{
        transform: `translate3d(${transX}px, ${transY}px, -15px) rotate(${rotateDeg}deg)`,
        transformOrigin: 'bottom center',
        transition: isHovered
          ? 'transform 0.15s ease-out'
          : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 340 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_20px_35px_rgba(0,148,100,0.22)] overflow-visible"
      >
        <defs>
          <linearGradient id="cactusBody" x1="80" y1="40" x2="260" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#82D8A4" />
            <stop offset="40%" stopColor="#009464" />
            <stop offset="100%" stopColor="#06402A" />
          </linearGradient>

          <linearGradient id="cactusArmLeft" x1="40" y1="120" x2="160" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A3E7B8" />
            <stop offset="60%" stopColor="#009464" />
            <stop offset="100%" stopColor="#085237" />
          </linearGradient>

          <linearGradient id="cactusArmRight" x1="160" y1="100" x2="300" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#82D8A4" />
            <stop offset="50%" stopColor="#009464" />
            <stop offset="100%" stopColor="#053321" />
          </linearGradient>

          <linearGradient id="flowerGrad" x1="160" y1="20" x2="180" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFBA00" />
            <stop offset="100%" stopColor="#FD372C" />
          </linearGradient>

          <linearGradient id="ribHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C6F7DA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#009464" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Resplandor suave ambiental */}
        <circle cx="170" cy="210" r="130" fill="#009464" fillOpacity="0.12" filter="blur(30px)" />

        {/* 1. BRAZO IZQUIERDO */}
        <g style={{ transform: `rotate(${-swayOffset * 0.5}deg)`, transformOrigin: '140px 260px' }}>
          <path
            d="M 145 280
               C 105 280 65 260 65 210
               L 65 140
               C 65 120 95 120 95 140
               L 95 200
               C 95 230 115 242 145 245
               Z"
            fill="url(#cactusArmLeft)"
          />
          <path
            d="M 80 135 L 80 205 C 80 235 98 252 135 258"
            stroke="url(#ribHighlight)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line x1="80" y1="122" x2="80" y2="114" stroke="#C6F7DA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="68" y1="126" x2="62" y2="120" stroke="#C6F7DA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="92" y1="126" x2="98" y2="120" stroke="#C6F7DA" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 2. BRAZO DERECHO (Más alto) */}
        <g style={{ transform: `rotate(${swayOffset * 0.6}deg)`, transformOrigin: '200px 230px' }}>
          <path
            d="M 195 250
               C 230 248 275 235 275 180
               L 275 105
               C 275 85 245 85 245 105
               L 245 170
               C 245 205 225 218 195 220
               Z"
            fill="url(#cactusArmRight)"
          />
          <path
            d="M 260 100 L 260 175 C 260 205 240 220 205 228"
            stroke="url(#ribHighlight)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line x1="260" y1="88" x2="260" y2="80" stroke="#C6F7DA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="248" y1="92" x2="242" y2="86" stroke="#C6F7DA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="272" y1="92" x2="278" y2="86" stroke="#C6F7DA" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 3. TRONCO PRINCIPAL SAGUARO */}
        <g>
          <path
            d="M 135 410
               L 135 75
               C 135 40 205 40 205 75
               L 205 410
               Z"
            fill="url(#cactusBody)"
          />

          <path
            d="M 170 52 L 170 410"
            stroke="url(#ribHighlight)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 152 62 L 152 410"
            stroke="#C6F7DA"
            strokeOpacity="0.45"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 188 62 L 188 410"
            stroke="#053321"
            strokeOpacity="0.5"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {[90, 130, 170, 210, 250, 290, 330, 370].map((y) => (
            <g key={y} opacity="0.85">
              <line x1="170" y1={y} x2="164" y2={y - 4} stroke="#C6F7DA" strokeWidth="2" strokeLinecap="round" />
              <line x1="170" y1={y} x2="176" y2={y - 4} stroke="#C6F7DA" strokeWidth="2" strokeLinecap="round" />
              <circle cx="170" cy={y} r="1.5" fill="#C6F7DA" />
            </g>
          ))}

          <line x1="170" y1="44" x2="170" y2="34" stroke="#C6F7DA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="156" y1="48" x2="150" y2="40" stroke="#C6F7DA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="184" y1="48" x2="190" y2="40" stroke="#C6F7DA" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 4. FLOR DEL DESIERTO EN LA CÚPULA SUPERIOR */}
        <g
          style={{
            transform: `scale(${isHovered ? 1.15 : 1})`,
            transformOrigin: '170px 42px',
            transition: 'transform 0.4s ease-out'
          }}
        >
          <circle cx="170" cy="42" r="9" fill="url(#flowerGrad)" />
          <circle cx="163" cy="39" r="6" fill="#FFBA00" opacity="0.9" />
          <circle cx="177" cy="39" r="6" fill="#FFBA00" opacity="0.9" />
          <circle cx="170" cy="33" r="6" fill="#FD372C" opacity="0.9" />
          <circle cx="170" cy="42" r="3.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
