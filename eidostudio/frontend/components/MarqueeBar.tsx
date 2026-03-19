import React from 'react';

const StarfishIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 md:w-5 md:h-5 text-brand-primary mx-6 inline-block align-middle mb-1"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Formato de estrela com pontas arredondadas */}
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const MarqueeBar: React.FC = () => {
  const words = ['EIDOS STUDIO', 'ESSÊNCIA', 'ESTRATÉGIA', 'DESIGN'];

  const MarqueeGroup = () => (
    <div className="flex items-center">
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <React.Fragment key={i}>
            {words.map((word, index) => (
              <React.Fragment key={`${i}-${index}`}>
                <span className="text-white font-baloo font-bold uppercase tracking-[0.2em] text-sm md:text-lg">
                  {word}
                </span>
                <StarfishIcon />
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
    </div>
  );

  return (
    <div className="w-full bg-brand-neutral overflow-hidden py-5 border-y border-white/10 relative z-20 select-none shadow-lg">
      <div className="relative w-full flex max-w-[100vw]">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee 120s linear infinite; 
          will-change: transform;
        }
        
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default MarqueeBar;
