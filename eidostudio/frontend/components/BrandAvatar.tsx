import React, { useMemo } from 'react';

interface BrandAvatarProps {
  className?: string;
  name?: string; // Usado para determinar a cor deterministicamente
  size?: 'sm' | 'md' | 'lg' | 'xl';

  imageUrl?: string;
  alt?: string;
}

const BrandAvatar: React.FC<BrandAvatarProps> = ({
  className = '',
  name = 'User',
  size = 'md',
  imageUrl,
  alt,
}) => {
  // Paletas de cores oficiais da marca
  const palettes = [
    { bg: '#F23DB3', fill: '#FFFFFF' }, // Fundo Pink, Ícone Branco
    { bg: '#1A1A1A', fill: '#F23DB3' }, // Fundo Preto, Ícone Pink
    { bg: '#FFFFFF', fill: '#F23DB3' }, // Fundo Branco, Ícone Pink
    { bg: '#f25c05', fill: '#FFFFFF' }, // Fundo Laranja, Ícone Branco
    { bg: '#bf9bbf', fill: '#1A1A1A' }, // Fundo Lilás, Ícone Preto
    { bg: '#1A1A1A', fill: '#FFFFFF' }, // Fundo Preto, Ícone Branco
  ];

  // Escolhe uma paleta baseada no hash do nome (sempre a mesma cor para o mesmo nome)
  const paletteIndex = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % palettes.length;
  }, [name]);

  const colors = palettes[paletteIndex];
  const isIsotipo = Boolean(imageUrl && imageUrl.includes('isotipo-'));
  const imageClasses = isIsotipo
    ? 'w-full h-full object-contain p-2'
    : 'w-full h-full object-cover';
  const backgroundColor = isIsotipo ? '#F23DB3' : colors.bg;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center shadow-lg border border-white/10 overflow-hidden relative ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={alt || name} className={imageClasses} loading="lazy" />
      ) : (
        <svg
          viewBox="0 0 100 100"
          className="w-[65%] h-[65%]" // Ocupa 65% do container para dar respiro
          style={{ fill: colors.fill }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Caminhos extraídos e adaptados do logo original Eidos */}
          <path
            d="M72.91,32.29c2.34,10.01,1.15,21.92-2.32,32.6-6.58,20.26-20.24,34.2-35.21,29.33-8.37-2.72-13.4-10.08-14.13-19.07-5.64,4.25-12.83,6.54-20.1,4.18-14.2-4.61-16.21-22.79-11.06-38.64,4.44-13.65,14.01-24.78,26.03-23.55l-1.07,13.77c-5.52.52-9.94,6.26-12.2,13.2-2.93,9.03-1.76,18.9,5.62,21.3,4.84,1.57,8.81-.91,11.79-4.45,0-4.14.3-8.42,1.37-11.72,2.22-6.83,7.4-9.28,11.8-7.85s7.3,6.39,5.01,13.43c-1.36,4.18-4.26,8.23-7.27,11.51-.29,5.38.99,10.42,6.5,12.21,8.15,2.65,15.96-5.28,20.36-18.82,2.79-8.59,3.92-18.44,2.33-25.9l12.55-1.52h0Z"
            transform="translate(20, -10) scale(0.8)"
          />
          <path
            d="M80.46,11.99c-.02.19-.06.37-.15.54-.32.56-1.54,1.02-2.13,1.24-2.13.77-4.4,1.09-6.67,1.16l1.48.71c1.86.99,3.55,2.31,4.88,3.94.5.62,1,1.15.66,2-.45,1.17-1.86.7-2.74.41-1.09-.36-2.14-.87-3.13-1.43-1.1-.62-2.16-1.33-3.14-2.13.8,1.63,1.45,3.34,1.71,5.14.14.94.16,1.89.17,2.83,0,.67-.04,1.21-.65,1.6-1.07.68-1.85-.41-2.36-1.21s-.89-1.6-1.24-2.43c-.61-1.45-1.08-2.96-1.37-4.51-.03,0-.03.04-.03.06-.17.57-.29,1.16-.48,1.73-.62,1.89-1.57,3.59-2.82,5.13-.57.7-1.12,1.46-2.14,1.13s-.89-1.39-.79-2.24c.21-1.94,1.02-4.2,1.86-5.95.2-.42.43-.83.63-1.25-2.01,1.53-4.27,2.76-6.79,3.21-.88.16-2.07.43-2.62-.51s.37-1.77,1.02-2.36c1.38-1.26,3.02-2.22,4.69-3.04l1.57-.69c-.79-.07-1.57-.15-2.35-.29-1.93-.35-3.84-1.04-5.5-2.08-.68-.43-1.21-.91-.93-1.8.21-.68.72-.82,1.36-.92,1.15-.17,2.49-.06,3.63.08,1.53.2,3.03.57,4.49,1.05-1.63-1.53-3.01-3.3-3.93-5.36-.24-.54-.48-1.15-.66-1.71-.19-.6-.26-1.13.22-1.61.96-.97,2.19.09,2.96.75,1.46,1.24,2.77,2.78,3.84,4.36.2.3.39.62.6.92-.27-2.1-.18-4.23.36-6.28.15-.58.34-1.18.55-1.74.27-.7.49-1.31,1.35-1.39,1.02-.09,1.29.63,1.53,1.45.56,1.98.6,4.36.42,6.4-.04.49-.11.98-.17,1.47l.87-1.21c1.39-1.79,3.1-3.39,5.14-4.42.57-.29.93-.48,1.57-.19,1.39.63.47,2.23-.05,3.15-.95,1.66-2.26,3.16-3.61,4.51l-.84.76c.89-.25,1.78-.5,2.69-.63,1.83-.28,3.7-.19,5.51.15.83.16,1.44.41,1.52,1.36l.02.03v.1h0Z"
            transform="translate(20, -10) scale(0.8)"
          />
        </svg>
      )}
    </div>
  );
};

export default BrandAvatar;
