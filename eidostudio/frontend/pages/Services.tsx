import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../components/Button';
import ServiceButton from '../components/buttons/ServiceButton.tsx';
import { Link } from '../utils/router-types';
import { useProjects } from '../context/ProjectContext.tsx';

const Services: React.FC = () => {
  const { services, isLoading } = useProjects();

  const customProcessSteps = [
    {
      step: '01.',
      title: 'Imersão',
      subtitle: 'Onde tudo começa: entendendo a essência.',
      items: [
        'Coleta de informações',
        'Estudo e análise do briefing',
        'Pesquisa aprofundada',
        'Alinhamento do projeto',
        'Entendimento do problema real da marca',
      ],
    },
    {
      step: '02.',
      title: 'Estratégia',
      subtitle: 'Transformando essência em direção.',
      items: [
        'Definição dos atributos da marca',
        'Personalidade, DNA e tom de voz',
        'Missão, visão e valores',
        'Análise de concorrentes',
        'Definição de público-alvo',
        'Pontos de contato da marca',
        'Organização estratégica (mapa mental)',
      ],
    },
    {
      step: '03.',
      title: 'Ideação',
      subtitle: 'Onde tudo começa: entendendo a essência.',
      items: [
        'Coleta de informações',
        'Estudo e análise do briefing',
        'Pesquisa aprofundada',
        'Alinhamento do projeto',
        'Entendimento do problema real da marca',
      ],
    },
    {
      step: '04.',
      title: 'Implementação',
      subtitle: 'Onde tudo começa: entendendo a essência.',
      items: [
        'Coleta de informações',
        'Estudo e análise do briefing',
        'Pesquisa aprofundada',
        'Alinhamento do projeto',
        'Entendimento do problema real da marca',
      ],
    },
    {
      step: '05.',
      title: 'Entrega',
      subtitle: 'Clareza, organização e prontidão.',
      items: [
        'Coleta de informações',
        'Estudo e análise do briefing',
        'Pesquisa aprofundada',
        'Alinhamento do projeto',
        'Entendimento do problema real da marca',
      ],
    },
  ];
  const servicesSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.service-cascade-card');
      cards.forEach(card => {
        gsap.fromTo(
          card,
          { autoAlpha: 0.15, y: 60, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 36%',
              scrub: 0.6,
            },
          }
        );
      });

      const sectionEl = servicesSectionRef.current;
      if (sectionEl && cards.length > 0) {
        const getSnapProgressPoints = () => {
          const maxScroll = Math.max(1, sectionEl.scrollHeight - window.innerHeight);
          return cards.map(card => {
            const target = card.offsetTop + card.offsetHeight / 2 - window.innerHeight / 2;
            const clamped = Math.max(0, Math.min(maxScroll, target));
            return clamped / maxScroll;
          });
        };

        ScrollTrigger.create({
          trigger: sectionEl,
          start: 'top top',
          end: () => '+=' + Math.max(1, sectionEl.scrollHeight - window.innerHeight),
          invalidateOnRefresh: true,
          snap: {
            snapTo: progress => gsap.utils.snap(getSnapProgressPoints(), progress),
            duration: { min: 0.2, max: 0.55 },
            ease: 'power2.out',
          },
        });
      }
    }, servicesSectionRef);

    return () => ctx.revert();
  }, [services.length]);

  return (
    <div className="flex flex-col">
      {/* Editorial Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-white overflow-hidden border-b border-brand-gray-100">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            {/* Title Section */}
            <div className="w-full md:w-3/5">
              <div className="flex items-center gap-3 mb-5">
                <span className="px-3 py-1 rounded-full border border-brand-neutral/10 bg-white text-[10px] font-bold uppercase tracking-widest text-brand-neutral shadow-sm">
                  O que fazemos
                </span>
                <div className="h-[1px] w-12 bg-brand-neutral/20"></div>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold font-baloo text-brand-neutral leading-[0.9] tracking-tight">
                Dando Forma
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
                  à Essência
                </span>
              </h1>
            </div>

            {/* Description Section with Badge */}
            <div className="w-full md:w-2/5 flex flex-col items-start md:items-end gap-8">
              {/* Rotating Badge */}
              <div className="relative w-32 h-32 hidden md:flex items-center justify-center">
                <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      id="curve"
                      d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0"
                      fill="transparent"
                    />
                    <text fill="#1A1A1A" fontSize="12.5" fontWeight="bold" letterSpacing="2">
                      <textPath href="#curve">EIDOS STUDIO • SERVIÇOS •</textPath>
                    </text>
                  </svg>
                </div>
                <i className="fas fa-pen-nib text-2xl text-brand-primary"></i>
              </div>

              <p className="text-brand-gray-500 text-lg leading-relaxed md:text-right font-light">
                Traduzimos sua história por meio de um design de marca profissional, sensível e
                criativo, tornando-a visível ao mundo.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Solutions Section */}
      <section ref={servicesSectionRef} className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(242,92,5,0.08),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {isLoading ? (
            <div className="text-center py-20">
              <i className="fas fa-circle-notch fa-spin text-4xl text-brand-primary"></i>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <i className="fas fa-cubes text-4xl mb-4 text-brand-gray-300"></i>
              <p className="text-brand-gray-400 text-lg">Em breve novos serviços disponíveis.</p>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
              {services.map((service, index) => {
                const isReversed = index % 2 === 1;
                const isExtras =
                  service.id === 'svc-extras' || service.title?.toLowerCase() === 'extras';
                const displayDesc = isExtras
                  ? 'Oferecemos serviços complementares como ilustração, criação de agentes para diferentes canais e soluções digitais em diversos formatos (site, web app, desktop e mobile), tornando cada projeto mais completo e personalizado.'
                  : service.desc;
                const displayItems = isExtras
                  ? [
                      'Ilustração',
                      'Agentes Multicanal',
                      'Soluções Digitais (site, web app, desktop e mobile)',
                    ]
                  : service.items;

                return (
                  <section
                    key={index}
                    className="service-cascade-card relative rounded-[2rem] border border-black/20 bg-white shadow-[0_14px_45px_rgba(15,15,15,0.08)] overflow-hidden min-h-[68vh] flex items-stretch transition-all duration-700 hover:-translate-y-1 will-change-transform"
                  >
                    <div
                      className={`grid md:grid-cols-2 items-stretch ${isReversed ? 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1' : ''} ${isReversed ? 'md:translate-x-2' : 'md:-translate-x-2'} transition-transform duration-700`}
                    >
                      <div className="relative min-h-[220px] md:min-h-[300px]">
                        <img
                          src={
                            service.image ||
                            'https://placehold.co/900x700/f5f5f5/e0e0e0?text=Serviço'
                          }
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-neutral/65 via-brand-neutral/20 to-transparent"></div>
                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                          <div>
                            <h3 className="text-xl md:text-2xl font-baloo font-bold text-white leading-tight">
                              {service.title}
                            </h3>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-white/15 border border-white/25 text-white backdrop-blur">
                            Eidos Studio
                          </span>
                        </div>
                      </div>

                      <div className="p-5 md:p-7 lg:p-8 flex flex-col justify-center bg-[linear-gradient(170deg,rgba(255,255,255,1),rgba(249,249,249,1))]">
                        <p className="text-brand-gray-600 leading-relaxed text-sm md:text-base mb-6">
                          {displayDesc}
                        </p>

                        {displayItems && displayItems.length > 0 && (
                          <ul className="grid grid-cols-1 gap-2 mb-7">
                            {displayItems.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-center text-xs md:text-sm font-medium text-brand-gray-700 bg-white border border-brand-gray-100 rounded-xl px-3 py-2.5"
                              >
                                <span className="w-5 h-5 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center mr-2 flex-shrink-0">
                                  <i className="fas fa-check text-[9px]"></i>
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div>
                          <ServiceButton to="/orcamento" />
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>
      {/* The Process Section */}
      <section className="py-24 bg-brand-gray-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(242,92,5,0.12),transparent_45%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-baloo">Como Trabalhamos</h2>
              <p className="text-brand-gray-400 text-lg max-w-2xl">
                Nosso processo é organizado, criativo e baseado na confiança — cada etapa é pensada
                para gerar clareza e valor.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-brand-gray-400">
              <span className="w-10 h-[1px] bg-white/20"></span>
              Linha editorial
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
            {customProcessSteps.map((step, index) => (
              <div
                key={index}
                className={`relative p-7 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 xl:col-span-2 ${customProcessSteps.length === 5 && index === 3 ? 'xl:col-start-2' : ''} ${customProcessSteps.length === 5 && index === 4 ? 'xl:col-start-4' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl font-bold text-brand-primary font-baloo">
                    {step.step}
                  </div>
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60">
                    <i className="fas fa-arrow-right text-xs"></i>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{step.title}</h3>
                <p className="text-brand-gray-300 text-sm mb-5">{step.subtitle}</p>

                <ul className="space-y-2.5">
                  {step.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-brand-gray-200 text-sm leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-brand-primary mt-0.5">∆</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(26,26,26,0.08),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="relative p-12 md:p-16 rounded-[2.75rem] text-white shadow-[0_25px_80px_rgba(15,15,15,0.25)] overflow-hidden border border-white/10 bg-[linear-gradient(120deg,#F23DB3_0%,#F564C7_35%,#F25C05_100%)]">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/15 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_60%)]"></div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-[10px] font-bold uppercase tracking-widest mb-6">
                Pronto para elevar sua marca
              </span>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 font-baloo leading-tight">
                Sua marca merece representar quem você realmente é.
              </h3>
              <p className="mb-10 text-white/90 text-lg leading-relaxed max-w-3xl mx-auto">
                Preencha o pré-briefing e vamos construir juntos uma marca estratégica, clara e com
                presença no mercado.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/orcamento">
                  <Button variant="solid">Preencher Pré-briefing</Button>
                </Link>
                <Link to="/portfolio">
                  <Button variant="ghost" className="hover:bg-white hover:text-brand-neutral">
                    Ver portfólio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
