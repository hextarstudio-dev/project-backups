import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from '../utils/router-types';
import { Project, ProjectSection } from '../types';
import { useProjects } from '../context/ProjectContext.tsx';

// Hooks do React Router

const Portfolio: React.FC = () => {
  const { projects, categories } = useProjects();
  const { projectSlug } = useParams(); // Captura o slug da URL
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedImage, setExpandedImage] = useState<{
    url: string;
    isCarousel?: boolean;
    slides?: number;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const holdIntervalRef = useRef<number | null>(null);

  // Estados para o Drag-to-Scroll (Arrastar no Desktop)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // --- LÓGICA DE SLUG E URL ---

  // Helper para criar slug amigável: ID + Título sanitizado
  const createSlug = (project: Project) => {
    const cleanTitle = project.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífens
      .replace(/(^-|-$)/g, ''); // Remove hífens do começo/fim
    return `${project.id}-${cleanTitle}`;
  };

  // Efeito para sincronizar a URL com o modal aberto
  useEffect(() => {
    if (projectSlug && projects.length > 0) {
      // Tenta encontrar o projeto cujo slug gerado bate com a URL
      // Ou fallback: tenta achar apenas pelo ID no começo da string (caso o título mude)
      const foundProject =
        projects.find(p => createSlug(p) === projectSlug) ||
        projects.find(p => projectSlug.startsWith(`${p.id}-`));

      if (foundProject) {
        setSelectedProject(foundProject);
        document.body.style.overflow = 'hidden';
      }
    } else {
      setSelectedProject(null);
      document.body.style.overflow = 'unset';
    }
  }, [projectSlug, projects]);

  const openModal = (project: Project) => {
    // Em vez de setar estado, navegamos para a URL
    navigate(`/portfolio/projetos/${createSlug(project)}`);
  };

  const closeModal = () => {
    // Volta para a raiz do portfólio
    navigate('/portfolio');
  };

  // --- FIM LÓGICA DE URL ---

  // Recalcular counts dinamicamente baseado nos projetos reais
  const categoryCounts = categories.map(cat => {
    const count =
      cat.id === 'all' ? projects.length : projects.filter(p => p.category === cat.id).length;
    return { ...cat, count };
  });

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter(project => project.category === activeCategory);

  const currentMonthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
  const featuredProjects = [...projects]
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 2);

  const formatYearOnly = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.split('-')[0];
  };

  // Funções para os botões de seta (mobile/desktop)
  const scrollCarousel = (direction: 'left' | 'right', amount: number = 400) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  const startHolding = (direction: 'left' | 'right') => {
    if (holdIntervalRef.current) return;
    const speed = 18;
    holdIntervalRef.current = window.setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += direction === 'left' ? -speed : speed;
      }
    }, 16);
  };

  const stopHolding = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  // Funções para o Mouse Drag (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplicador de velocidade do scroll
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const renderSection = (section: ProjectSection) => {
    if (section.type === 'text') {
      return (
        <div key={section.id} className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-start">
            <div className="md:w-1/3">
              {section.title && (
                <div className="sticky top-10">
                  <h3 className="text-3xl font-bold text-brand-neutral mb-4 font-baloo leading-tight">
                    {section.title}
                  </h3>
                  <div className="h-1 w-12 bg-brand-primary"></div>
                </div>
              )}
            </div>
            <div className="md:w-2/3">
              <p className="text-xl md:text-2xl text-brand-gray-600 leading-relaxed font-light whitespace-pre-wrap">
                {section.content}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (section.type === 'gallery') {
      if (section.imageFormat === 'carousel') {
        const carouselImg = section.images && section.images[0];
        if (!carouselImg) return null;

        return (
          <div
            key={section.id}
            className="w-full px-4 md:px-12 py-16 flex flex-col items-center group/carousel-main"
          >
            <div
              className="w-full max-w-[1600px] cursor-pointer relative animate-in fade-in slide-in-from-bottom-4 duration-700"
              onClick={() =>
                setExpandedImage({
                  url: carouselImg.url,
                  isCarousel: true,
                  slides: section.slidesCount || 1,
                })
              }
            >
              <div className="flex justify-between items-center mb-6 px-4 min-h-[24px]">
                {section.title ? (
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-brand-primary"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gray-400">
                      {section.title}
                    </span>
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="flex items-center gap-2 text-brand-primary group-hover/carousel-main:translate-x-1 transition-transform">
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Ver Completo
                  </span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </div>
              </div>

              <div
                className="w-full rounded-2xl overflow-hidden shadow-xl bg-brand-gray-50 border border-brand-gray-100 transition-all duration-700 group-hover/carousel-main:shadow-2xl relative min-h-[240px] md:min-h-0"
                style={{ aspectRatio: `${(section.slidesCount || 1) * 1080} / 1350` }}
              >
                <img
                  src={carouselImg.url}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  alt="Carousel Preview"
                />
              </div>
            </div>
          </div>
        );
      }

      const getGridClass = () => {
        switch (section.layout) {
          case 'grid-1':
            return 'grid-cols-1';
          case 'grid-2':
            return 'grid-cols-1 md:grid-cols-2';
          case 'grid-3':
            return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
          case 'grid-4':
            return 'grid-cols-2 md:grid-cols-4';
          case 'grid-5':
            return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
          case 'grid-6':
            return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
          case 'masonry':
            return 'columns-1 md:columns-2 lg:columns-3 space-y-4';
          default:
            return 'grid-cols-1 md:grid-cols-2';
        }
      };

      const getAspectClass = () => {
        switch (section.imageFormat) {
          case 'portrait':
            return 'aspect-[4/5]'; // 1080x1350
          case 'square':
            return 'aspect-square'; // 1080x1080
          case 'landscape':
            return 'aspect-video'; // 1920x1080
          case 'web':
            return 'aspect-[135/416]';
          default:
            return 'aspect-auto';
        }
      };

      return (
        <div key={section.id} className="py-8">
          {section.title && (
            <div className="max-w-[1400px] mx-auto px-6 mb-8 text-center">
              <h3 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.3em]">
                {section.title}
              </h3>
            </div>
          )}
          <div
            className={`px-4 md:px-12 max-w-[1800px] mx-auto ${section.layout === 'masonry' ? '' : 'grid gap-4 md:gap-8'} ${section.layout !== 'masonry' ? getGridClass() : ''}`}
          >
            {section.images?.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedImage({ url: img.url })}
                className={`relative overflow-hidden rounded-xl shadow-sm bg-brand-gray-50 cursor-pointer group/img ${section.layout === 'masonry' ? 'mb-4 inline-block w-full' : ''} ${getAspectClass()}`}
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-transparent transition-all duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transform scale-50 group-hover/img:scale-100 transition-all text-brand-neutral">
                    <i className="fas fa-expand text-[10px]"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section.type === 'palette') {
      return (
        <div key={section.id} className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h3 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.3em] mb-12">
            {section.title}
          </h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {section.colors?.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg border-4 border-white mb-4 transform hover:scale-110 transition-transform duration-500"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-[10px] font-bold text-brand-neutral tracking-widest uppercase opacity-60">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* New Editorial Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-white overflow-hidden border-b border-brand-gray-100">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            {/* Title Section */}
            <div className="w-full md:w-3/5">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full border border-brand-neutral/10 bg-white text-[10px] font-bold uppercase tracking-widest text-brand-neutral shadow-sm">
                  Portfolio {new Date().getFullYear()}
                </span>
                <div className="h-[1px] w-12 bg-brand-neutral/20"></div>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold font-baloo text-brand-neutral leading-[0.9] tracking-tight">
                Nosso
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
                  Trabalho
                </span>
              </h1>
            </div>

            {/* Description Section with Badge */}
            <div className="w-full md:w-2/5 flex flex-col items-start md:items-end gap-8">
              {/* Rotating Badge - Fixed Spacing */}
              <div className="relative w-32 h-32 hidden md:flex items-center justify-center">
                <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      id="curve"
                      d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0"
                      fill="transparent"
                    />
                    <text fill="#1A1A1A" fontSize="12.5" fontWeight="bold" letterSpacing="1.8">
                      <textPath href="#curve"> EIDOS STUDIO • PORTFOLIO • </textPath>
                    </text>
                  </svg>
                </div>
                <i className="fas fa-star text-2xl text-brand-primary"></i>
              </div>

              <p className="text-brand-gray-500 text-lg leading-relaxed md:text-right font-light">
                Projetos que traduzem essência, clareza e posicionamento. Cada marca apresentada
                aqui passou por um processo profundo de
                <strong className="text-brand-neutral font-medium"> pesquisa</strong> e{' '}
                <strong className="text-brand-neutral font-medium">construção estratégica</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {featuredProjects.length > 0 && (
            <div className="mb-24">
              <div className="flex items-center justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-12 bg-brand-primary"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gray-400">
                      Destaque
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold font-baloo text-brand-neutral leading-tight">
                    Projetos de {currentMonthLabel}
                  </h2>
                </div>
                <div className="hidden md:flex items-center gap-2 text-brand-primary">
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Seleção do mês
                  </span>
                  <i className="fas fa-star text-[10px]"></i>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {featuredProjects.map(p => (
                  <div
                    key={`featured-${p.id}`}
                    className="group cursor-pointer flex flex-col w-[94%] mx-auto focus:outline-none focus:ring-2 focus:ring-brand-primary/40 rounded-2xl"
                    onClick={() => openModal(p)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(p);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Abrir projeto ${p.title}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-brand-gray-100 mb-6 shadow-sm group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] transition-shadow duration-500">
                      <img
                        src={p.coverImageUrl || p.cardImageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.22, 1, 0.36, 1) group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-brand-neutral/0 group-hover:bg-brand-neutral/20 transition-colors duration-500"></div>
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-neutral border border-white/50 shadow-sm">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-neutral shadow-sm">
                        {formatYearOnly(p.date)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl md:text-3xl font-bold font-baloo text-brand-neutral group-hover:text-brand-primary transition-colors duration-300">
                        {p.title}
                      </h3>
                      <div className="h-[1px] flex-grow bg-brand-gray-200 group-hover:bg-brand-primary/30 transition-colors"></div>
                    </div>
                    <p className="text-brand-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2">
                      {p.client}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Filter Bar Design */}
          <div className="sticky top-24 z-40 mb-20">
            <div className="max-w-fit mx-auto">
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-2 rounded-full flex gap-2 overflow-x-auto custom-scrollbar">
                {categoryCounts.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                      px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap flex items-center gap-3 border border-transparent
                      ${
                        activeCategory === cat.id
                          ? 'bg-brand-neutral text-white shadow-lg transform scale-105 border-brand-neutral'
                          : 'bg-transparent text-brand-gray-500 hover:bg-brand-gray-50 hover:text-brand-primary hover:border-brand-gray-100'
                      }
                    `}
                  >
                    {cat.name}
                    <span
                      className={`
                      h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[9px] font-mono
                      ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-brand-gray-100 text-brand-gray-400'}
                    `}
                    >
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <i className="fas fa-folder-open text-4xl mb-4 text-brand-gray-300"></i>
              <p className="text-brand-gray-400 text-lg">
                Nenhum projeto encontrado nesta categoria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
              {filteredProjects.map(p => (
                <div
                  key={p.id}
                  className="group cursor-pointer flex flex-col w-[94%] mx-auto focus:outline-none focus:ring-2 focus:ring-brand-primary/40 rounded-2xl"
                  onClick={() => openModal(p)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModal(p);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Abrir projeto ${p.title}`}
                >
                  {/* Image Wrapper */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-brand-gray-100 mb-6 isolate shadow-sm group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] transition-shadow duration-500">
                    {/* Image */}
                    <img
                      src={p.cardImageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.22, 1, 0.36, 1) group-hover:scale-110"
                    />

                    {/* Overlay - Darken on hover */}
                    <div className="absolute inset-0 bg-brand-neutral/0 group-hover:bg-brand-neutral/30 transition-colors duration-500 z-10"></div>

                    {/* Center Interaction - New "View Project" Pill */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-white/10 backdrop-blur-md border border-white/40 text-white px-8 py-3 rounded-full flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl">
                        <span className="text-xs font-bold uppercase tracking-widest">
                          Ver Projeto
                        </span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </div>
                    </div>

                    {/* Floating Badge - Top Left (Editorial Style) */}
                    <div className="absolute top-6 left-6 z-20">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-neutral border border-white/50 shadow-sm">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  {/* Text Info - Left Aligned & Editorial Hierarchy */}
                  <div className="flex flex-col items-start px-2">
                    <div className="flex items-center gap-3 mb-2 w-full">
                      <h3 className="text-xl md:text-2xl font-bold font-baloo text-brand-neutral group-hover:text-brand-primary transition-colors duration-300 leading-tight">
                        {p.title}
                      </h3>
                      <div className="h-[1px] flex-grow bg-brand-gray-200 group-hover:bg-brand-primary/30 transition-colors mt-2"></div>
                    </div>

                    <div className="flex items-center gap-2 text-brand-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      <span>{p.client}</span>
                      <span className="w-1 h-1 bg-brand-gray-300 rounded-full"></span>
                      <span>{formatYearOnly(p.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProject && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-500"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-[#0d0d0d]/90 backdrop-blur-xl"></div>

          {/* Main Modal Container - Increased Width (95vw) */}
          <div
            className="relative bg-white w-[95vw] md:max-w-[95vw] h-[95vh] overflow-hidden rounded-[1.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col animate-in zoom-in-95 duration-500 border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Improved Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-[2100] w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border border-brand-gray-100 hover:bg-brand-neutral hover:text-white transition-all group active:scale-90"
              aria-label="Fechar"
            >
              <i className="fas fa-times text-xl group-hover:rotate-90 transition-transform"></i>
            </button>

            <div className="overflow-y-auto flex-grow custom-scrollbar bg-white">
              {/* Massive Hero Image */}
              <div className="w-full h-[60vh] md:h-[75vh] relative bg-brand-gray-100">
                <img
                  src={selectedProject.coverImageUrl}
                  className="w-full h-full object-cover relative z-10"
                />
                {/* Smoother Gradient Transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
              </div>

              {/* Redesigned Info Header (Editorial Layout) */}
              <div className="relative z-30 px-6 md:px-16 -mt-32 pb-20 max-w-[1600px] mx-auto">
                <div className="flex flex-col items-start animate-in slide-in-from-bottom-8 duration-700">
                  {/* Refined Badge - Outline Style */}
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-neutral/20 bg-white/80 backdrop-blur-md shadow-sm mb-6 transition-all hover:bg-white">
                    <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-neutral">
                      {selectedProject.category}
                    </span>
                  </div>

                  {/* Huge Title with Character */}
                  <h2 className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold font-baloo text-brand-neutral leading-[0.85] tracking-tight mb-12 max-w-5xl drop-shadow-sm">
                    {selectedProject.title}
                    <span className="text-brand-primary">.</span>
                  </h2>

                  {/* Structured Data Grid with Dividers */}
                  <div className="w-full border-t border-brand-gray-200 py-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 relative">
                    {/* Decorative Line Animation */}
                    <div className="absolute top-0 left-0 w-32 h-[2px] bg-brand-neutral"></div>

                    <div className="md:border-r border-brand-gray-100 md:pr-10">
                      <h4 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <i className="fas fa-user-circle"></i> Cliente
                      </h4>
                      <p className="text-2xl font-bold text-brand-neutral">
                        {selectedProject.client}
                      </p>
                    </div>

                    <div className="md:border-r border-brand-gray-100 md:px-10">
                      <h4 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <i className="fas fa-calendar-alt"></i> Ano
                      </h4>
                      <p className="text-2xl font-bold text-brand-neutral">
                        {formatYearOnly(selectedProject.date)}
                      </p>
                    </div>

                    <div className="md:pl-10">
                      <h4 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <i className="fas fa-align-left"></i> Resumo
                      </h4>
                      <p className="text-lg text-brand-gray-600 leading-snug font-light">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Sections */}
              <div className="pb-32">{selectedProject.sections.map(s => renderSection(s))}</div>

              <div className="bg-brand-gray-50 py-32 text-center border-t border-brand-gray-100">
                <h3 className="text-2xl font-bold text-brand-neutral mb-8 font-baloo">
                  Gostou deste projeto?
                </h3>
                <button
                  onClick={closeModal}
                  className="bg-brand-neutral text-white px-16 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Ver Outros Projetos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {expandedImage && (
        <div
          className="fixed inset-0 z-[3000] bg-[#0d0d0d] flex flex-col items-center justify-center p-0 animate-in fade-in duration-500 cursor-pointer"
          onClick={() => setExpandedImage(null)}
        >
          <button
            className="absolute top-10 right-10 text-brand-neutral w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all z-[3100] group active:scale-90 shadow-2xl"
            aria-label="Fechar"
          >
            <i className="fas fa-times text-lg group-hover:rotate-90 transition-transform"></i>
          </button>

          <div
            className="w-full flex-grow flex flex-col items-center justify-center overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {expandedImage.isCarousel ? (
              <div className="w-full flex flex-col items-center">
                <div
                  ref={scrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  className={`max-w-6xl w-[94%] h-[55vh] md:h-[60vh] overflow-x-auto overflow-y-hidden rounded-lg shadow-[0_0_80px_rgba(0,0,0,0.5)] bg-black hide-scrollbar relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  style={{ scrollBehavior: 'auto' }}
                >
                  <div
                    className="h-full flex-shrink-0 select-none"
                    style={{
                      width: `calc(60vh * ${(expandedImage.slides || 1) * 1080} / 1350)`,
                    }}
                  >
                    <img
                      src={expandedImage.url}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      draggable="false"
                    />
                  </div>
                </div>

                <div className="mt-16 flex items-center gap-8">
                  <button
                    onMouseDown={() => startHolding('left')}
                    onMouseUp={stopHolding}
                    onMouseLeave={stopHolding}
                    onClick={e => {
                      e.stopPropagation();
                      scrollCarousel('left');
                    }}
                    className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all cursor-pointer"
                  >
                    <i className="fas fa-arrow-left text-sm"></i>
                  </button>

                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                      {Array.from({ length: expandedImage.slides || 1 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                      ))}
                    </div>
                    <p className="text-white/30 font-bold uppercase tracking-[0.3em] text-[9px] select-none">
                      ARRASTE OU USE AS SETAS
                    </p>
                  </div>

                  <button
                    onMouseDown={() => startHolding('right')}
                    onMouseUp={stopHolding}
                    onMouseLeave={stopHolding}
                    onClick={e => {
                      e.stopPropagation();
                      scrollCarousel('right');
                    }}
                    className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all cursor-pointer"
                  >
                    <i className="fas fa-arrow-right text-sm"></i>
                  </button>
                </div>
              </div>
            ) : (
              <img
                src={expandedImage.url}
                className="max-w-[85%] max-h-[85vh] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500 cursor-pointer"
              />
            )}
          </div>

          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </div>
      )}
    </main>
  );
};

export default Portfolio;
