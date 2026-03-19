import React from 'react';
import { Course } from '../types';

interface InicioProps {
  userName?: string;
  ownedCourses?: Course[];
  hubCourses?: Course[];
  onOpenCourse?: (course: Course) => void;
  onGoProducts?: (target?: 'loja' | 'meus-produtos') => void;
  onOpenSupport?: () => void;
}

const Inicio: React.FC<InicioProps> = ({
  userName,
  ownedCourses = [],
  hubCourses = [],
  onOpenCourse,
  onGoProducts,
  onOpenSupport,
}) => {
  const firstName = (userName || 'Raquel').split(' ')[0];

  // Determinar produto em destaque para o Hero
  // Ideal: último produto acessado/comprado. Fallback: primeiro da loja.
  const featuredCourse =
    ownedCourses.length > 0 ? ownedCourses[0] : hubCourses.length > 0 ? hubCourses[0] : null;

  const handleCourseClick = (course: Course) => {
    const isOwned = ownedCourses.some(c => c.id === course.id || c.title === course.title);
    onGoProducts?.(isOwned ? 'meus-produtos' : 'loja');
    onOpenCourse?.(course);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
      {/* 1. HERO SECTION */}
      {featuredCourse && (
        <div
          className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] mb-12 group cursor-pointer"
          onClick={() => handleCourseClick(featuredCourse)}
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={featuredCourse.image}
              alt={featuredCourse.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Gradients Overlay (vignette and bottom fade for text reading) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent"></div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 flex flex-col justify-end">
            <h1 className="text-4xl md:text-6xl font-bold font-baloo text-white mb-2 leading-tight">
              {featuredCourse.title}
            </h1>

            <div className="flex items-center gap-3 mb-6 text-sm text-brand-gray-300">
              <span className="px-2 py-0.5 border border-white/20 rounded-md text-xs uppercase tracking-widest font-bold">
                {featuredCourse.category}
              </span>
              {featuredCourse.duration && (
                <span className="flex items-center gap-1">
                  <i className="far fa-clock"></i> {featuredCourse.duration}
                </span>
              )}
            </div>

            <p className="text-white/80 max-w-xl text-sm md:text-base line-clamp-3 mb-8">
              {featuredCourse.description ||
                'Acesse agora este material exclusivo e eleve o padrão das suas entregas de design com a Eidos Studio.'}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleCourseClick(featuredCourse);
                }}
                className="px-8 py-3.5 bg-white text-black font-bold uppercase tracking-widest text-xs md:text-sm rounded-lg hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2"
              >
                <i className="fas fa-play ml-1"></i> Acessar Material
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onGoProducts?.('loja');
                }}
                className="px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold uppercase tracking-widest text-xs md:text-sm rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <i className="fas fa-list"></i> Ver Todos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saudação se não tiver Hero, ou só por garantia da interface antiga */}
      {!featuredCourse && (
        <div className="px-8 md:px-14 py-8">
          <h2 className="text-3xl font-bold font-baloo text-white">Bem-vinda, {firstName}</h2>
        </div>
      )}

      {/* 2. MEUS MATERIAIS CARRROSSEL */}
      {ownedCourses.length > 0 && (
        <div className="px-8 md:px-14 mb-14">
          <h3 className="text-xl font-bold text-white mb-4 pl-1">Continuar Acessando</h3>
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory custom-scrollbar-hide">
            {ownedCourses.map(course => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="snap-start shrink-0 w-64 md:w-80 cursor-pointer group"
              >
                <div className="w-full aspect-video rounded-xl overflow-hidden relative mb-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/5 group-hover:border-white/20 transition-all">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-black/50">
                      <i className="fas fa-play text-white ml-1"></i>
                    </div>
                  </div>
                  {/* Barra de Progresso simplificada na base da thumb */}
                  {course.progress > 0 && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                      <div
                        className="h-full bg-brand-primary"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <h4 className="text-white font-medium text-sm group-hover:text-brand-primary transition-colors line-clamp-1">
                  {course.title}
                </h4>
                <p className="text-brand-gray-500 text-xs mt-1 uppercase tracking-wider">
                  {course.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EXPLORE A LOJA / MAIS CONTEÚDOS */}
      <div className="px-8 md:px-14 mb-14">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white pl-1">Descubra na Eidos</h3>
          <button
            onClick={() => onGoProducts?.('loja')}
            className="text-brand-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Ver Loja Completa
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory custom-scrollbar-x">
          {hubCourses.map(course => {
            const isOwned = ownedCourses.some(oc => oc.id === course.id);
            if (isOwned && hubCourses.length > 3) return null; // Evita duplicar se ele tem muita coisa, mas mantém se loja tiver poucos itens.

            return (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="snap-start shrink-0 w-44 md:w-56 cursor-pointer group"
              >
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative mb-3 shadow-lg border border-white/5 group-hover:border-white/20 transition-all">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-1">
                      {course.category}
                    </p>
                    <h4 className="text-white font-bold text-sm leading-tight line-clamp-2">
                      {course.title}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FOOTER SUPPORT CTA */}
      <div className="px-8 md:px-14 pb-8">
        <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
              <i className="fas fa-headset text-brand-gray-300 text-xl"></i>
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">Precisa de ajuda?</h4>
              <p className="text-brand-gray-400 text-sm max-w-md">
                Nossa equipe de suporte está pronta para te auxiliar com qualquer dúvida sobre seus
                materiais e licenças.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSupport}
            className="px-6 py-3 shrink-0 border border-white/10 hover:border-brand-primary text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Falar com Suporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
