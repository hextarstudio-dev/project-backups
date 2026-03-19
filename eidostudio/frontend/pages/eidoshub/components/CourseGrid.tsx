import React from 'react';
import { Course } from '../types';
import { useNavigate } from 'react-router-dom';
import BorderGlow from '../../../components/BorderGlow';

interface CourseGridProps {
  courses: Course[];
  categories: string[];
  onOpenCourse: (course: Course) => void;
  searchTerm: string;
  viewMode?: 'grid' | 'list';
}

// Mapeamento de produtos para preços do Stripe (unused in current implementation)

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  categories,
  onOpenCourse,
  searchTerm,
  viewMode = 'grid',
}) => {
  const navigate = useNavigate();

  // Filtro básico de busca
  const filteredCourses = courses.filter(
    c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePurchase = (course: Course, event: React.MouseEvent) => {
    event.stopPropagation();

    // Navega para a página de confirmação customizada passando o curso como state
    navigate(`/hub/checkout/${course.id}`, { state: { course } });
  };

  // Renderização em modo lista
  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-y-auto px-10 py-6 custom-scrollbar">
        {categories.map(category => {
          const categoryCourses = filteredCourses.filter(c => c.category === category);
          if (categoryCourses.length === 0) return null;

          return (
            <section key={category} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-brand-primary rounded-full"></div>
                <h3 className="text-xl font-bold text-white font-baloo">{category}</h3>
              </div>

              <div className="space-y-4">
                {categoryCourses.map(item => (
                  <BorderGlow
                    key={item.id}
                    borderRadius={16}
                    backgroundColor="#1a1a1a"
                    colors={['#f23db3', '#ffffff', '#ffc0e3']}
                    edgeSensitivity={20}
                    glowIntensity={1.2}
                    className="cursor-pointer"
                  >
                    <div
                      onClick={() => onOpenCourse(item)}
                      className="group bg-transparent rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                    <div className="flex gap-6 p-6">
                      {/* Thumbnail */}
                      <div className="w-32 h-40 flex-shrink-0 rounded-lg overflow-hidden relative">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                          alt={item.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h4 className="text-2xl font-bold text-white leading-tight font-baloo group-hover:text-brand-primary transition-colors">
                              {item.title}
                            </h4>
                            <span className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest flex-shrink-0">
                              {item.duration}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-brand-gray-400 text-sm mb-4 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-brand-gray-500 text-xs">
                            <span className="w-4 h-4 rounded-full bg-brand-primary flex items-center justify-center">
                              <img
                                src="https://cdn.eidostudio.com.br/assets/site/logos/isotipo-preto-2.svg"
                                alt="Eidos Studio"
                                className="w-3 h-3 object-contain"
                                loading="lazy"
                              />
                            </span>
                            {item.author}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-4">
                          {item.owned ? (
                            <button
                              onClick={_e => onOpenCourse(item)}
                              className="px-6 py-2 bg-brand-primary text-[#1a1a1a] hover:opacity-90 text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
                            >
                              Acessar Material
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={_e => onOpenCourse(item)}
                                className="text-brand-gray-500 hover:text-brand-primary transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                              >
                                Ver detalhes <i className="fas fa-arrow-right"></i>
                              </button>
                              <button
                                onClick={e => handlePurchase(item, e)}
                                className="px-6 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ml-auto"
                              >
                                Comprar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  </BorderGlow>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // Renderização em modo grid (padrão)
  return (
    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
      {categories.map(category => {
        const categoryCourses = filteredCourses.filter(c => c.category === category);
        if (categoryCourses.length === 0) return null;

        return (
          <section key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-brand-primary rounded-full"></div>
              <h3 className="text-xl font-bold text-white font-baloo">{category}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryCourses.map(item => (
                <BorderGlow
                  key={item.id}
                  borderRadius={16}
                  backgroundColor="#1a1a1a"
                  colors={['#f23db3', '#ffffff', '#ffc0e3']}
                  edgeSensitivity={20}
                  glowIntensity={1.2}
                  className="cursor-pointer hover:-translate-y-1 transition-transform duration-300"
                >
                  <div
                    onClick={() => onOpenCourse(item)}
                    className="group bg-transparent rounded-xl overflow-hidden flex flex-col h-full"
                  >
                  {/* Portrait Image Card */}
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                      alt={item.title}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-black/30 to-transparent opacity-0 group-hover:opacity-90 transition-opacity"></div>

                    {/* Content positioned at bottom of image */}
                    <div className="absolute bottom-0 left-0 w-full p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="inline-block px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest mb-3">
                        {item.duration}
                      </span>
                      <h4 className="text-xl font-bold text-white leading-tight font-baloo mb-2">
                        {item.title}
                      </h4>
                      <p className="text-white/60 text-xs font-medium flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-brand-primary flex items-center justify-center">
                          <img
                            src="https://cdn.eidostudio.com.br/assets/site/logos/isotipo-preto-2.svg"
                            alt="Eidos Studio"
                            className="w-3 h-3 object-contain"
                            loading="lazy"
                          />
                        </span>
                        {item.author}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="p-4 border-t border-white/5 flex justify-between items-center bg-[#1a1a1a]">
                    {item.owned ? (
                      <button
                        onClick={_e => onOpenCourse(item)}
                        className="w-full py-2 bg-brand-primary text-[#1a1a1a] hover:opacity-90 text-xs font-bold uppercase tracking-widest rounded-lg transition-all text-center"
                      >
                        Acessar Material
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={_e => onOpenCourse(item)}
                          className="text-brand-gray-500 hover:text-brand-primary transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                          Ver detalhes <i className="fas fa-arrow-right"></i>
                        </button>
                        <button
                          onClick={e => handlePurchase(item, e)}
                          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                        >
                          Comprar
                        </button>
                      </>
                    )}
                  </div>
                </div>
                </BorderGlow>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default CourseGrid;
