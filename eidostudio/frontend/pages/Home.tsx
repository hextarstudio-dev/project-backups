import React from 'react';
import { useNavigate } from '../utils/router-types';
import { useProjects } from '../context/ProjectContext.tsx';
import Button from '../components/Button.tsx';
import KeycapButton from '../components/KeycapButton.tsx';
import DrawnButton from '../components/DrawnButton.tsx';
import MarqueeBar from '../components/MarqueeBar.tsx';
import BlurText from '../components/BlurText.tsx';
import ScrollReveal from '../components/ScrollReveal.tsx';
import { StatusBadge } from '../components/ui/status-badge.tsx';
import {
  RiCheckboxCircleFill,
  RiSparklingLine,
  RiFlashlightLine,
  RiShieldStarLine,
} from '@remixicon/react';

const Home: React.FC = () => {
  const { services, projects, isLoading } = useProjects();
  const navigate = useNavigate();

  const toProjectSlug = (project: { id: string; title: string }) => {
    const normalizedTitle = project.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return `${project.id}-${normalizedTitle}`;
  };

  const featuredProjects = [...projects]
    .sort((a, b) => {
      const aDate = a.date ? new Date(a.date).getTime() : 0;
      const bDate = b.date ? new Date(b.date).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 3);

  return (
    <div className="flex flex-col w-full relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero-custom bg-brand-primary pt-20 pb-32 md:pt-[140px] md:pb-[140px] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <BlurText
              text="Traduzimos a essência da sua marca em estratégia e forma."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-3xl md:text-5xl lg:text-[60px] font-semibold font-baloo text-white tracking-tight mb-5 max-w-5xl"
              stepDuration={0.4}
            />
            <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              Criamos marcas com propósito, clareza e posicionamento. Nada aqui é genérico — cada
              projeto nasce da pesquisa, da essência e da estratégia certa para o seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <DrawnButton
                text="Preencher Pré-Briefing"
                variant="primary"
                onClick={() => navigate('/orcamento')}
              />
              <KeycapButton
                text="Ver Nossos Projetos"
                variant="light"
                width="220px"
                onClick={() => navigate('/portfolio')}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-black/5 pointer-events-none"></div>
      </section>

      {/* Infinite Marquee Bar */}
      <MarqueeBar />

      {/* About Preview Section - New Layout + New Copy */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-8">
            <article className="rounded-3xl border border-brand-gray-100 bg-white shadow-[0_20px_45px_rgba(0,0,0,0.07)] p-7 md:p-10">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray-500 mb-4">
                Nosso posicionamento
              </p>
              <ScrollReveal delay={0.1} duration={0.8} distance={40}>
                <h2 className="text-4xl md:text-5xl font-baloo font-bold text-brand-neutral leading-[0.95] mb-5">
                  Design que organiza
                  <br />
                  percepção, valor e direção
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
                    da sua marca.
                  </span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.2} duration={0.8} distance={30}>
                <p className="text-brand-gray-600 text-base md:text-lg leading-relaxed mb-6">
                  Não criamos só uma identidade bonita. Construímos um sistema visual e estratégico
                  que ajuda sua marca a comunicar melhor, parecer mais profissional e ser lembrada
                  pelos motivos certos.
                </p>
              </ScrollReveal>
              <div className="flex flex-wrap gap-2 mb-7">
                <StatusBadge
                  leftIcon={RiCheckboxCircleFill}
                  leftLabel="Clareza"
                  rightLabel="Comunicação direta"
                  status="success"
                />
                <StatusBadge
                  leftIcon={RiShieldStarLine}
                  leftLabel="Consistência"
                  rightLabel="Padrão visual"
                  status="success"
                />
                <StatusBadge
                  leftIcon={RiSparklingLine}
                  leftLabel="Autenticidade"
                  rightLabel="Essência real"
                  status="success"
                />
                <StatusBadge
                  leftIcon={RiFlashlightLine}
                  leftLabel="Valor percebido"
                  rightLabel="Profissionalismo"
                  status="success"
                />
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/sobre')}
                className="px-10 py-4 border-none text-base"
              >
                Conheça Nossa Essência
              </Button>
            </article>

            <article className="rounded-3xl border border-brand-gray-100 bg-brand-neutral text-white shadow-[0_22px_50px_rgba(0,0,0,0.16)] p-7 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(242,61,179,0.22),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(242,92,5,0.18),transparent_40%)]"></div>
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/70 mb-5">
                  Como isso se traduz no projeto
                </p>
                <div className="space-y-4">
                  {[
                    {
                      t: '1. Diagnóstico real',
                      d: 'Entendemos contexto, metas e obstáculos antes de decidir qualquer direção visual.',
                    },
                    {
                      t: '2. Estratégia aplicada',
                      d: 'Definimos atributos, narrativa e diferenciais para orientar a construção da marca.',
                    },
                    {
                      t: '3. Sistema de marca',
                      d: 'Entregamos identidade com lógica, padrão e aplicação para crescer com consistência.',
                    },
                  ].map(item => (
                    <div
                      key={item.t}
                      className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-4"
                    >
                      <h3 className="font-bold mb-1">{item.t}</h3>
                      <p className="text-sm text-white/80 leading-relaxed">{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Grid Pattern Background - Added to match "About" section */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Atmospheric Background Blurs - Added to match "About" section */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Editorial Melhorado */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl relative">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-1 bg-brand-primary rounded-full"></div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gray-400">
                    Nossas Soluções
                  </span>
                </div>
                <ScrollReveal delay={0.1} duration={0.8} distance={50}>
                  <h2 className="text-4xl md:text-7xl font-bold font-baloo text-brand-neutral leading-[0.9]">
                    O Que{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
                      Fazemos
                    </span>
                  </h2>
                </ScrollReveal>
              </div>
            </div>

            <div className="max-w-md text-left md:text-right border-l-0 md:border-l-0 md:border-r-2 border-brand-gray-100 pl-0 md:pl-0 md:pr-6 py-1">
              <ScrollReveal delay={0.2} duration={0.8} distance={30} direction="left">
                <p className="text-brand-gray-500 text-lg leading-relaxed font-light">
                  Atuamos com empresas que desejam iniciar ou renovar sua presença no mercado com{' '}
                  <strong className="text-brand-neutral font-medium">autenticidade</strong>, alinhando
                  história e narrativa.
                </p>
              </ScrollReveal>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <i className="fas fa-circle-notch fa-spin text-3xl text-brand-primary"></i>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <p className="text-brand-gray-400 text-lg">Nenhum serviço disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 4).map((service, i) => {
                return (
                  <div
                    key={service.id || i}
                    className="group bg-brand-gray-50 rounded-3xl hover:bg-brand-neutral transition-all duration-500 transform hover:-translate-y-2 border border-brand-gray-100 h-full flex flex-col relative shadow-sm hover:shadow-2xl overflow-hidden"
                  >
                    {/* Thumb/Capa */}
                    <div className="h-48 w-full relative overflow-hidden rounded-t-3xl">
                      <div className="absolute inset-0 bg-brand-neutral/0 group-hover:bg-brand-neutral/0 transition-all z-10"></div>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Content */}
                    <div className="pt-7 px-8 pb-8 flex flex-col flex-grow relative z-10">
                      <h3 className="text-xl font-bold font-baloo mb-3 group-hover:text-white transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-brand-gray-600 text-sm mb-6 group-hover:text-white/80 transition-colors flex-grow leading-relaxed">
                        {service.desc}
                      </p>
                      <div className="mt-auto border-t border-brand-gray-200/50 group-hover:border-white/10 pt-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary group-hover:text-white flex items-center gap-2">
                          Saiba mais{' '}
                          <i className="fas fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/servicos')}>
              Ver Detalhes dos Serviços
            </Button>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-20 bg-brand-gray-50 border-y border-brand-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gray-500 mb-3">
              Prova social
            </p>
            <h2 className="text-3xl md:text-5xl font-bold font-baloo text-brand-neutral">
              Resultados que os clientes sentem na prática
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              '“A identidade ficou muito mais estratégica. Hoje eu consigo me posicionar com segurança e justificar melhor meus preços.”',
              '“A clareza da marca melhorou toda nossa comunicação. As campanhas começaram a performar com mais consistência.”',
              '“O projeto trouxe organização visual e narrativa. Finalmente a marca ficou com cara de empresa madura.”',
            ].map((text, i) => (
              <article
                key={i}
                className="rounded-2xl bg-white border border-brand-gray-100 p-6 shadow-sm"
              >
                <div className="flex gap-1 text-brand-primary mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <i key={idx} className="fas fa-star text-xs"></i>
                  ))}
                </div>
                <p className="text-brand-gray-700 leading-relaxed text-sm">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cases em destaque */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gray-500 mb-3">
                Cases
              </p>
              <h2 className="text-3xl md:text-5xl font-bold font-baloo text-brand-neutral">
                Projetos em destaque
              </h2>
            </div>
            <p className="text-sm md:text-base text-brand-gray-600 max-w-md">
              Alguns projetos seguem um fluxo claro: contexto real, decisão estratégica e resultado
              percebido no mercado.
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {featuredProjects.map(project => (
                <article
                  key={project.id}
                  onClick={() => navigate(`/portfolio/projetos/${toProjectSlug(project)}`)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/portfolio/projetos/${toProjectSlug(project)}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Abrir projeto ${project.title}`}
                  className="group cursor-pointer rounded-2xl border border-brand-gray-100 bg-white shadow-sm hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-brand-gray-100">
                    <img
                      src={project.cardImageUrl || project.coverImageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="inline-flex rounded-full border border-brand-primary/20 bg-brand-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                        {project.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gray-400">
                        {(project.date || '').split('-')[0]}
                      </span>
                    </div>

                    <h3 className="text-xl font-baloo font-bold text-brand-neutral mb-2 group-hover:text-brand-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-brand-gray-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="pt-4 border-t border-brand-gray-100 flex items-center justify-between text-xs uppercase tracking-wider font-bold">
                      <span className="text-brand-gray-500">{project.client}</span>
                      <span className="text-brand-primary group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        Ver projeto <i className="fas fa-arrow-right text-[10px]"></i>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-gray-200 bg-brand-gray-50 p-8 text-center">
              <p className="text-sm text-brand-gray-600">
                Os projetos em destaque vão aparecer aqui assim que você publicar no portfólio.
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Button variant="secondary" size="md" onClick={() => navigate('/portfolio')}>
              Ver Portfólio Completo
            </Button>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-20 bg-brand-neutral text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(242,61,179,0.25),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(242,92,5,0.2),transparent_45%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-3">
              Como trabalhamos
            </p>
            <h2 className="text-3xl md:text-5xl font-bold font-baloo">
              Processo claro, ponta a ponta
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {['Imersão', 'Estratégia', 'Direção Criativa', 'Implementação', 'Entrega'].map(
              (step, idx) => (
                <article
                  key={step}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-xs font-bold mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-sm">{step}</h3>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* Fit + FAQ */}
      <section className="py-20 bg-white border-t border-brand-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-700 mb-3">
              Para quem é
            </p>
            <ul className="space-y-2 text-sm text-brand-gray-700">
              <li className="flex gap-2">
                <i className="fas fa-check text-emerald-600 mt-1"></i>
                <span>Empresas que querem posicionamento com clareza e autenticidade.</span>
              </li>
              <li className="flex gap-2">
                <i className="fas fa-check text-emerald-600 mt-1"></i>
                <span>Negócios que buscam consistência visual e narrativa em todos os canais.</span>
              </li>
              <li className="flex gap-2">
                <i className="fas fa-check text-emerald-600 mt-1"></i>
                <span>Marcas que valorizam processo, estratégia e execução profissional.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-brand-gray-200 bg-brand-gray-50 p-6">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray-600 mb-3">
              FAQ rápido
            </p>
            <div className="space-y-3 text-sm text-brand-gray-700">
              <details className="rounded-xl border border-brand-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-bold">
                  Qual o prazo médio dos projetos?
                </summary>
                <p className="mt-2">
                  Depende do escopo, mas sempre definimos cronograma claro desde o início.
                </p>
              </details>
              <details className="rounded-xl border border-brand-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-bold">
                  Vocês trabalham com negócios iniciantes?
                </summary>
                <p className="mt-2">
                  Sim. Adaptamos a estratégia para o estágio atual da marca e seus objetivos.
                </p>
              </details>
              <details className="rounded-xl border border-brand-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-bold">Como começar?</summary>
                <p className="mt-2">
                  Preencha o pré-briefing para entendermos seu cenário e montar a melhor direção.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-white border-t border-brand-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-brand-neutral text-white p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(242,61,179,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(242,92,5,0.2),transparent_45%)]"></div>
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-bold mb-3">
                Vamos construir sua marca?
              </p>
              <h3 className="text-2xl md:text-4xl font-baloo font-bold mb-4">
                Comece com um pré-briefing e receba uma direção estratégica para seu projeto.
              </h3>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button variant="primary" size="lg" onClick={() => navigate('/orcamento')}>
                  Preencher Pré-Briefing
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/portfolio')}>
                  Ver Projetos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
