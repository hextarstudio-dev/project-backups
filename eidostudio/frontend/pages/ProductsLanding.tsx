import React, { useEffect, useMemo, useState } from 'react';
import GlowCTAButton from '../components/GlowCTAButton';
import { api } from '../utils/api';

type Product = {
  id: string;
  title: string;
  category?: string;
  image: string;
};

const BONUS_IDS = new Set(['prod_TxLD3ntDcA5JZO', 'bonus-eidos-pack']);

const fallbackProducts: Product[] = [
  {
    id: 'prod_TxLHC5q9ckSUwI',
    title: 'Eidos Pack Completo',
    category: 'Pacote',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/pacote-eidos.png',
  },
  {
    id: 'prod_TxLD3ntDcA5JZO',
    title: 'Bônus Eidos Pack',
    category: 'Bônus',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/modelo-briefing.png',
  },
  {
    id: 'prod_U27zA9t065wJaY',
    title: 'Apresentação Behance',
    category: 'Modelos',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/apresentacao-behance.png',
  },
  {
    id: 'prod_TxLD49GFquB1S2',
    title: 'Modelo de Portfólio',
    category: 'Modelos',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/modelo-portfolio.png',
  },
  {
    id: 'prod_TxLDxEYMFwGotV',
    title: 'Manual de Arquivos',
    category: 'Modelos',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/manual-arquivos.png',
  },
  {
    id: 'prod_TxLDri3sdXAp0H',
    title: 'Manual de Marca',
    category: 'Modelos',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/manual-marca.png',
  },
  {
    id: 'prod_TxLDL5oTDUNGTh',
    title: 'Proposta Comercial',
    category: 'Modelos',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/proposta-comercial.png',
  },
  {
    id: 'prod_TxLDcjRlurXW1c',
    title: 'Modelo de Contrato',
    category: 'Modelos',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/modelo-contrato.png',
  },
];

const COVER_CACHE_BUSTER = 'v=20260307-0102';
const withCoverRefresh = (url: string) =>
  url.includes('/eidoshub/products/covers/')
    ? `${url}${url.includes('?') ? '&' : '?'}${COVER_CACHE_BUSTER}`
    : url;

const ProductsLanding: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(api('/hub/products'));
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      } catch {
        // fallback
      }
    };
    load();
  }, []);

  const regularProducts = useMemo(
    () => products.filter(p => !BONUS_IDS.has(p.id)).slice(0, 8),
    [products]
  );
  const bonusProduct = useMemo(() => products.find(p => BONUS_IDS.has(p.id)), [products]);
  const packProduct = useMemo(
    () => regularProducts.find(p => p.id === 'prod_TxLHC5q9ckSUwI'),
    [regularProducts]
  );
  const nonPackProducts = useMemo(
    () => regularProducts.filter(p => p.id !== 'prod_TxLHC5q9ckSUwI'),
    [regularProducts]
  );
  const gridProducts = useMemo(() => nonPackProducts.slice(0, 6), [nonPackProducts]);
  const heroCovers = useMemo(() => regularProducts.slice(0, 6), [regularProducts]);

  return (
    <div className="bg-white text-brand-neutral overflow-x-hidden">
      <style>{`
        @keyframes coversMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUpIn {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(242,61,179,0.22); }
          50% { box-shadow: 0 0 0 12px rgba(242,61,179,0); }
        }
        @keyframes shimmerX {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        .float-soft { animation: floatY 5s ease-in-out infinite; }
        .float-soft-delay { animation: floatY 6.5s ease-in-out infinite .7s; }
        .pulse-glow { animation: pulseGlow 2.3s ease-in-out infinite; }
        @keyframes borderMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .gradient-border {
          background: linear-gradient(120deg, rgba(242,61,179,.45), rgba(242,92,5,.35), rgba(242,61,179,.45));
          background-size: 200% 200%;
          animation: borderMove 4s linear infinite;
          padding: 1px;
          border-radius: 1rem;
        }
        .grid-noise {
          background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 12px 12px;
        }
        .faq-item .faq-answer {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height .35s ease, opacity .25s ease, padding-top .35s ease;
          padding-top: 0;
        }
        .faq-item[open] .faq-answer {
          max-height: 260px;
          opacity: 1;
          padding-top: 12px;
        }
      `}</style>
      {/* HERO */}
      <section className="relative bg-brand-neutral py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(242,61,179,0.32),transparent_42%),radial-gradient(circle_at_88%_20%,rgba(242,92,5,0.26),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.08),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:34px_34px] opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <p className="text-white/65 uppercase tracking-[0.22em] text-xs font-bold mb-5">
              Eidos Hub • Coleção Oficial
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-baloo font-bold text-white leading-[0.95] md:leading-[0.9] mb-5 md:mb-6">
              Sua marca com
              <br />
              <span className="text-brand-primary">essência, estratégia</span>
              <br />e autenticidade.
            </h1>
            <p className="text-white/80 max-w-xl mb-7 md:mb-9 text-sm sm:text-base md:text-lg">
              Na Eidos Hub, você encontra materiais estratégicos para organizar seu processo,
              comunicar melhor seu valor e elevar o padrão de entrega da sua marca.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
              <GlowCTAButton href="https://hub.eidostudio.com.br/hub/loja" text="Acessar Loja" />
              <a
                href="#colecao"
                className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 sm:px-8 py-3.5 sm:py-4 font-bold text-white hover:bg-white hover:text-brand-neutral transition-colors w-full sm:w-auto"
              >
                Ver Produtos
              </a>
            </div>

            <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-md">
              {['Estratégia de marca', 'Processos bem definidos', 'Entrega de alto nível'].map(
                it => (
                  <div
                    key={it}
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/80 text-center"
                  >
                    {it}
                  </div>
                )
              )}
            </div>
          </div>

          {/* CAPAS PASSANDO (sem 3D) */}
          <div className="relative h-[320px] sm:h-[380px] md:h-[520px] overflow-hidden rounded-2xl md:rounded-3xl border border-white/15 bg-white/5 backdrop-blur-sm">
            <div className="absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-brand-neutral to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-brand-neutral to-transparent z-10" />

            <div className="absolute inset-0 flex flex-col justify-center gap-4 md:gap-6">
              <div className="overflow-hidden">
                <div
                  className="flex w-max gap-3 md:gap-4"
                  style={{ animation: 'coversMarquee 22s linear infinite' }}
                >
                  {[...heroCovers, ...heroCovers].map((book, i) => (
                    <div
                      key={book.id + '-a-' + i}
                      className="w-[110px] sm:w-[130px] md:w-[160px] rounded-md md:rounded-lg overflow-hidden border border-white/20 shadow-[0_14px_28px_rgba(0,0,0,0.35)] bg-black/20 shrink-0"
                    >
                      <div className="aspect-[3/4]">
                        <img
                          src={withCoverRefresh(book.image)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden">
                <div
                  className="flex w-max gap-3 md:gap-4"
                  style={{ animation: 'coversMarquee 26s linear infinite reverse' }}
                >
                  {[...heroCovers, ...heroCovers].map((book, i) => (
                    <div
                      key={book.id + '-b-' + i}
                      className="w-[110px] sm:w-[130px] md:w-[160px] rounded-md md:rounded-lg overflow-hidden border border-white/15 shadow-[0_12px_24px_rgba(0,0,0,0.3)] bg-black/20 shrink-0 opacity-90"
                    >
                      <div className="aspect-[3/4]">
                        <img
                          src={withCoverRefresh(book.image)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section
        className="py-14 md:py-20 bg-[linear-gradient(180deg,#ffffff_0%,#fff9fc_100%)] relative overflow-hidden"
        style={{ animation: 'fadeUpIn .7s ease both' }}
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-brand-primary/10 blur-3xl float-soft"></div>
        <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-brand-orange/10 blur-3xl float-soft-delay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray-500 mb-3">
              Por que investir em marca profissional
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-baloo font-bold">
              Uma marca forte cria crescimento real
            </h2>
            <p className="text-brand-gray-600 max-w-3xl mx-auto mt-4 text-sm md:text-base">
              Na Eidos, atuamos com foco em estratégia, criatividade e atenção aos detalhes para
              entregar soluções alinhadas aos objetivos do negócio e à identidade de quem está por
              trás da marca.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {[
              {
                title: 'Diferenciação',
                desc: 'Uma marca bem construída destaca seu negócio da concorrência, deixando claro quem você é, o que oferece e por que deve ser escolhido.',
              },
              {
                title: 'Comunicação',
                desc: 'Uma marca bem estabelecida torna a comunicação mais clara, coerente e eficiente em campanhas, conteúdos e presença digital.',
              },
              {
                title: 'Valor percebido',
                desc: 'Marcas profissionais elevam a percepção de valor, gerando confiança, autoridade e melhor posicionamento de investimento.',
              },
              {
                title: 'Crescimento sólido',
                desc: 'Uma marca estratégica fortalece o negócio e cria base para reconhecimento e expansão no mercado.',
              },
            ].map(item => (
              <article
                key={item.title}
                className="group relative rounded-2xl border border-black/10 bg-white p-5 md:p-6 shadow-[0_12px_26px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(0,0,0,0.10)] transition-all duration-300 overflow-hidden"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-4 border border-brand-primary/25">
                  <i className="fas fa-check text-sm"></i>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-brand-gray-600 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 md:mt-10 rounded-2xl border border-brand-primary/20 bg-gradient-to-r from-brand-primary/10 to-brand-orange/10 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-primary mb-2">
                Próximo passo
              </p>
              <p className="text-brand-neutral font-bold text-lg md:text-xl">
                Escolha seu material e comece hoje com um processo mais profissional.
              </p>
              <p className="text-brand-gray-600 text-sm mt-1">Acesso imediato após compra.</p>
            </div>
            <a
              href="https://hub.eidostudio.com.br/hub/loja"
              className="inline-flex rounded-full bg-brand-neutral text-white px-6 py-3 font-bold text-sm hover:bg-black transition-colors w-fit"
            >
              Quero ver os produtos
            </a>
          </div>
        </div>
      </section>

      {/* ANTES X DEPOIS */}
      <section
        className="py-14 md:py-20 bg-brand-gray-50 border-y border-brand-gray-100"
        style={{ animation: 'fadeUpIn .72s ease both' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray-500 mb-3">
              Transformação
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-baloo font-bold">
              Antes x depois de estruturar seu processo
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <article className="rounded-2xl border border-red-200 bg-white p-5 md:p-7 shadow-[0_14px_28px_rgba(0,0,0,0.06)]">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-red-500 mb-3">
                Antes
              </p>
              <ul className="space-y-3 text-sm md:text-base text-brand-gray-700">
                <li className="flex gap-2">
                  <i className="fas fa-times text-red-500 mt-1"></i>
                  <span>Propostas confusas e baixa taxa de fechamento</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-times text-red-500 mt-1"></i>
                  <span>Cliente inseguro, pedindo desconto e atrasando decisão</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-times text-red-500 mt-1"></i>
                  <span>Entrega final sem padrão e com retrabalho constante</span>
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border border-emerald-200 bg-white p-5 md:p-7 shadow-[0_14px_28px_rgba(0,0,0,0.06)]">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-600 mb-3">
                Depois
              </p>
              <ul className="space-y-3 text-sm md:text-base text-brand-gray-700">
                <li className="flex gap-2">
                  <i className="fas fa-check text-emerald-600 mt-1"></i>
                  <span>Processo claro do briefing à entrega com mais autoridade</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check text-emerald-600 mt-1"></i>
                  <span>Apresentações mais profissionais e cliente mais confiante</span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check text-emerald-600 mt-1"></i>
                  <span>Mais previsibilidade para escalar sem perder qualidade</span>
                </li>
              </ul>
            </article>
          </div>

          <div className="text-center mt-8">
            <a
              href="https://hub.eidostudio.com.br/hub/loja"
              className="inline-flex rounded-full bg-brand-neutral text-white px-7 py-3.5 font-bold text-sm hover:bg-black transition-colors"
            >
              Quero essa evolução no meu processo
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="colecao"
        className="py-14 md:py-24 relative overflow-hidden bg-white"
        style={{ animation: 'fadeUpIn .75s ease both' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-brand-primary/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12 md:mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray-500 mb-4">
              Coleção Principal
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-baloo font-bold">
              Produtos para destravar sua entrega
            </h2>
            <p className="text-brand-gray-600 max-w-3xl mx-auto mt-4 text-sm md:text-base">
              São materiais que você consegue adaptar rápido ao seu projeto — sem começar do zero
              toda vez. A ideia é ganhar tempo no operacional e usar essa energia no que realmente
              fecha projeto.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {gridProducts.map((product, index) => (
              <article
                key={product.id}
                className="group rounded-xl sm:rounded-2xl overflow-hidden border border-black/20 bg-white shadow-[0_20px_36px_rgba(15,15,15,0.12)] hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(242,61,179,0.18)] transition-all duration-300 relative"
                style={{ animation: `fadeUpIn .55s ease both ${index * 0.05}s` }}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={withCoverRefresh(product.image)}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 sm:p-4 border-t border-black/10 bg-white">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-brand-gray-500 font-bold mb-1">
                    {product.category || 'Produto Digital'}
                  </p>
                  <h3 className="text-sm font-bold leading-tight min-h-[40px]">{product.title}</h3>
                  <a
                    href="https://hub.eidostudio.com.br/hub/loja"
                    className="mt-3 inline-flex text-xs font-bold text-brand-primary hover:text-brand-orange transition-colors"
                  >
                    Ver na loja <i className="fas fa-arrow-right ml-2 mt-[1px]"></i>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://hub.eidostudio.com.br/hub/loja"
              className="inline-flex rounded-full border border-brand-neutral px-6 py-3 font-bold text-sm text-brand-neutral hover:bg-brand-neutral hover:text-white transition-colors"
            >
              Ver coleção completa na loja
            </a>
          </div>

          {packProduct && (
            <div className="mt-8 md:mt-10">
              <article className="group rounded-2xl overflow-hidden border border-black/15 bg-white shadow-[0_16px_32px_rgba(15,15,15,0.10)] max-w-4xl mx-auto">
                <div className="grid md:grid-cols-[0.9fr_1.1fr] items-stretch">
                  <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-brand-neutral max-h-[320px] md:max-h-none">
                    <img
                      src={withCoverRefresh(packProduct.image)}
                      alt={packProduct.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 md:p-6 lg:p-7 flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-primary font-bold mb-2">
                      Produto em destaque
                    </p>
                    <h3 className="text-2xl md:text-4xl font-baloo font-bold mb-3">
                      {packProduct.title}
                    </h3>

                    <p className="text-brand-gray-600 leading-relaxed mb-4">
                      Pacote principal da Eidos Hub para quem quer ganhar velocidade, consistência e
                      elevar o padrão de entrega com materiais estratégicos prontos para uso.
                    </p>

                    <p className="text-sm font-bold text-brand-neutral mb-3">
                      Materiais inclusos no Eidos Pack:
                    </p>
                    <ul className="space-y-2 text-sm text-brand-gray-700 mb-4">
                      {nonPackProducts.map(item => (
                        <li key={item.id} className="flex items-start gap-2">
                          <i className="fas fa-check text-brand-primary mt-1"></i>
                          <span>{item.title}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="rounded-xl border border-brand-primary/25 bg-brand-primary/10 px-4 py-3 mb-6">
                      <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-primary mb-1">
                        Bônus secreto
                      </p>
                      <p className="text-sm text-brand-neutral">
                        Ao adquirir o Eidos Pack, você desbloqueia um{' '}
                        <strong>bônus secreto exclusivo</strong> para potencializar ainda mais seu
                        processo e suas entregas.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                      <a
                        href="https://hub.eidostudio.com.br/hub/loja"
                        className="inline-flex rounded-full bg-brand-neutral text-white px-6 py-3 font-bold text-sm hover:bg-black transition-colors w-fit"
                      >
                        Quero o Pack Completo
                      </a>
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                        Acesso imediato
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          )}
        </div>
      </section>

      {packProduct && (
        <section
          className="py-10 md:py-14 bg-white"
          style={{ animation: 'fadeUpIn .76s ease both' }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-3xl border border-black/15 bg-[linear-gradient(135deg,#fff7fc_0%,#ffffff_45%,#fff8f2_100%)] shadow-[0_24px_50px_rgba(242,61,179,0.18)] overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(242,61,179,0.18),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(242,92,5,0.14),transparent_35%)]" />
              <div className="relative z-10 px-6 md:px-10 py-7 md:py-9 text-center">
                <div className="inline-flex items-center rounded-full border border-brand-primary/35 bg-white/85 px-4 py-1.5 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-primary">
                    Condição exclusiva Eidos Pack
                  </span>
                </div>

                <p className="text-sm md:text-base font-bold text-brand-gray-600 uppercase tracking-[0.18em] mb-3">
                  {packProduct.title}
                </p>

                <div className="flex items-end justify-center gap-3 md:gap-4 mb-3">
                  <span className="text-lg md:text-xl font-bold text-brand-gray-500 line-through">
                    R$ 289,90
                  </span>
                  <span className="text-4xl md:text-5xl font-baloo font-bold text-brand-primary leading-none">
                    R$ 189,90
                  </span>
                </div>

                <p className="text-sm text-brand-gray-700 mb-6">
                  Economize <strong>R$ 100,00</strong> e tenha acesso imediato ao pack completo.
                </p>

                <a
                  href="https://hub.eidostudio.com.br/hub/loja"
                  className="inline-flex rounded-full bg-brand-neutral text-white px-8 py-3 font-bold text-sm uppercase tracking-wider hover:bg-black transition-colors shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                >
                  Quero garantir agora
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMO FUNCIONA */}
      <section
        className="py-14 md:py-18 bg-brand-neutral text-white relative overflow-hidden"
        style={{ animation: 'fadeUpIn .78s ease both' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(242,61,179,0.24),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(242,92,5,0.20),transparent_40%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/70 mb-3">
              Como funciona
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-baloo font-bold">
              Fluxo simples de uso
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                t: '1. Escolha o material',
                d: 'Veja o que faz sentido para o seu momento (avulso ou pack).',
              },
              {
                t: '2. Acesse no Hub',
                d: 'Após confirmar o pagamento, o conteúdo já aparece na sua conta.',
              },
              {
                t: '3. Ajuste para seu projeto',
                d: 'Troque textos, identidade e aplique no atendimento real.',
              },
            ].map((step, idx) => (
              <article
                key={step.t}
                className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-5 md:p-6 relative overflow-hidden"
                style={{ animation: `fadeUpIn .6s ease both ${idx * 0.08}s` }}
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-brand-primary via-brand-orange to-transparent"></div>
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 text-white text-xs font-bold flex items-center justify-center mb-3">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.t}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{step.d}</p>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="https://hub.eidostudio.com.br/hub/loja"
              className="inline-flex rounded-full bg-white text-brand-neutral px-7 py-3.5 font-bold text-sm hover:bg-brand-gray-100 transition-colors"
            >
              Ver produtos na loja
            </a>
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section
        className="py-14 md:py-18 bg-[linear-gradient(180deg,#fff8f2_0%,#ffffff_100%)] border-y border-brand-gray-100"
        style={{ animation: 'fadeUpIn .79s ease both' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray-500 mb-3">
              Fit do produto
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-baloo font-bold">
              Para quem é (e para quem não é)
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <article className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white p-5 md:p-7 shadow-[0_12px_24px_rgba(16,185,129,0.10)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100/80 px-3 py-1 mb-4">
                <i className="fas fa-bullseye text-emerald-700 text-xs"></i>
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-emerald-700">
                  Perfil ideal
                </p>
              </div>
              <h3 className="font-bold text-lg mb-2 text-emerald-900">É para você se...</h3>
              <p className="text-sm text-emerald-900/75 mb-4">
                Você já atende (ou está começando a atender) e quer parecer mais profissional sem
                perder agilidade.
              </p>
              <ul className="space-y-2.5 text-sm text-brand-gray-800">
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-emerald-600 mt-1"></i>
                  <span>
                    <strong>Quer fechar com mais confiança</strong> usando proposta e contrato com
                    cara de negócio sério.
                  </span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-emerald-600 mt-1"></i>
                  <span>
                    <strong>Precisa ganhar velocidade</strong> no operacional sem sacrificar
                    qualidade visual e clareza.
                  </span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check-circle text-emerald-600 mt-1"></i>
                  <span>
                    <strong>Busca padrão de entrega</strong> para reduzir retrabalho e escalar com
                    consistência.
                  </span>
                </li>
              </ul>
            </article>
            <article className="rounded-2xl border border-rose-200 bg-gradient-to-b from-rose-50/70 to-white p-5 md:p-7 shadow-[0_12px_24px_rgba(244,63,94,0.10)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-100/80 px-3 py-1 mb-4">
                <i className="fas fa-ban text-rose-700 text-xs"></i>
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-rose-700">
                  Sem fit
                </p>
              </div>
              <h3 className="font-bold text-lg mb-2 text-rose-900">Não é para você se...</h3>
              <p className="text-sm text-rose-900/75 mb-4">
                O pack foi pensado para uso profissional com aplicação prática no atendimento real.
              </p>
              <ul className="space-y-2.5 text-sm text-brand-gray-800">
                <li className="flex gap-2">
                  <i className="fas fa-times-circle text-rose-600 mt-1"></i>
                  <span>
                    <strong>Procura revenda ou compartilhamento</strong> de arquivos sem
                    autorização.
                  </span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-times-circle text-rose-600 mt-1"></i>
                  <span>
                    <strong>Não quer seguir processo nenhum</strong> e prefere continuar no
                    improviso.
                  </span>
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-times-circle text-rose-600 mt-1"></i>
                  <span>
                    <strong>Espera resultado sem adaptação</strong> ao seu contexto, público e forma
                    de atendimento.
                  </span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* O QUE VEM NO EIDOS PACK */}
      <section
        className="py-14 md:py-20 bg-white border-t border-brand-gray-100"
        style={{ animation: 'fadeUpIn .8s ease both' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray-500 mb-3">
              Eidos Pack
            </p>
            <p className="text-brand-gray-600 max-w-3xl mx-auto mt-1 text-sm md:text-base">
              Um conjunto de materiais prontos para deixar seu processo mais profissional do
              primeiro contato até a entrega final.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            <div className="rounded-2xl border border-brand-gray-200 bg-white p-5 md:p-6 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-brand-gray-500 font-bold mb-2">
                Prospecção e diagnóstico
              </p>
              <h3 className="font-bold text-lg mb-2">Briefing + alinhamento</h3>
              <p className="text-sm text-brand-gray-600">
                Modelos para conduzir reuniões com clareza e coletar informações estratégicas da
                marca.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gray-200 bg-white p-5 md:p-6 shadow-sm grid-noise">
              <p className="text-[10px] uppercase tracking-widest text-brand-gray-500 font-bold mb-2">
                Fechamento
              </p>
              <h3 className="font-bold text-lg mb-2">Proposta + contrato</h3>
              <p className="text-sm text-brand-gray-600">
                Estruturas para apresentar escopo, investimento e condições com segurança e
                autoridade.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gray-200 bg-white p-5 md:p-6 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-brand-gray-500 font-bold mb-2">
                Entrega profissional
              </p>
              <h3 className="font-bold text-lg mb-2">Manual + arquivos finais</h3>
              <p className="text-sm text-brand-gray-600">
                Materiais para fechar projetos com consistência visual, organização e menos
                retrabalho.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BONUS SECTION */}
      {bonusProduct && (
        <section
          className="py-16 md:py-20 bg-brand-gray-50"
          style={{ animation: 'fadeUpIn .8s ease both' }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl md:rounded-[2rem] border border-black/10 bg-white p-5 md:p-10 shadow-[0_20px_45px_rgba(0,0,0,0.08)] grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="max-w-[280px] mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-black/20 bg-white shadow-[0_20px_36px_rgba(15,15,15,0.12)]">
                <div className="aspect-[3/4]">
                  <img
                    src={withCoverRefresh(
                      'https://cdn.eidostudio.com.br/eidoshub/products/covers/modelo-briefing.png'
                    )}
                    alt="Super Briefing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-primary mb-3">
                  Bônus do Pack
                </p>
                <h3 className="text-2xl md:text-4xl font-baloo font-bold mb-3 md:mb-4">
                  Super Briefing (Bônus do Eidos Pack)
                </h3>
                <p className="text-brand-gray-600 leading-relaxed mb-6">
                  O bônus do Eidos Pack é o Super Briefing. Ele te ajuda a coletar informações com
                  mais profundidade e iniciar projetos com direção estratégica desde o primeiro
                  contato.
                </p>
                <a
                  href="https://hub.eidostudio.com.br/hub/loja"
                  className="inline-flex rounded-full bg-brand-neutral text-white px-6 py-3 font-bold text-sm hover:bg-black transition-colors"
                >
                  Garantir com o Eidos Pack
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GARANTIA E SEGURANÇA */}
      <section className="py-12 md:py-16 bg-white border-t border-brand-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            <article className="rounded-2xl border border-black/10 bg-brand-gray-50 p-5">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-3">
                <i className="fas fa-bolt"></i>
              </div>
              <h4 className="font-bold mb-1">Acesso imediato</h4>
              <p className="text-sm text-brand-gray-600">
                Comprou, liberou. Você já começa a aplicar no mesmo dia.
              </p>
            </article>
            <article className="rounded-2xl border border-black/10 bg-brand-gray-50 p-5">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-3">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4 className="font-bold mb-1">Compra segura</h4>
              <p className="text-sm text-brand-gray-600">
                Pagamento processado com segurança e liberação automática no Hub.
              </p>
            </article>
            <article className="rounded-2xl border border-black/10 bg-brand-gray-50 p-5">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-3">
                <i className="fas fa-sync-alt"></i>
              </div>
              <h4 className="font-bold mb-1">Atualizações incluídas</h4>
              <p className="text-sm text-brand-gray-600">
                Você acompanha melhorias e mantém seu processo sempre atualizado.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA DE DECISÃO */}
      <section className="py-12 md:py-16 bg-white border-t border-brand-gray-100 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="gradient-border">
            <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-brand-neutral text-white p-6 md:p-10 text-center shadow-[0_24px_45px_rgba(15,15,15,0.24)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(242,61,179,0.24),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(242,92,5,0.22),transparent_45%)]"></div>
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/70 mb-3">
                  Pronto para elevar seu posicionamento?
                </p>
                <h3 className="text-2xl md:text-4xl font-baloo font-bold leading-tight mb-4">
                  Comece hoje com materiais que te ajudam a vender melhor e entregar com mais
                  padrão.
                </h3>
                <p className="text-white/80 max-w-2xl mx-auto mb-7 text-sm md:text-base">
                  Escolha o produto ideal para sua fase ou garanta o pack completo para estruturar
                  todo o processo de ponta a ponta.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href="https://hub.eidostudio.com.br/hub/loja"
                    className="inline-flex rounded-full bg-white text-brand-neutral px-6 py-3 font-bold text-sm hover:bg-brand-gray-100 transition-colors justify-center"
                  >
                    Quero acessar a loja agora
                  </a>
                  <a
                    href="#colecao"
                    className="inline-flex rounded-full border border-white/40 text-white px-6 py-3 font-bold text-sm hover:bg-white/10 transition-colors justify-center"
                  >
                    Rever produtos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-20 bg-[linear-gradient(180deg,#ffffff_0%,#f8f8f8_100%)] border-t border-brand-gray-100 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray-500 mb-3">
              FAQ
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-baloo font-bold">
              Dúvidas frequentes
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            {[
              {
                q: 'Como acesso os produtos após a compra?',
                a: 'Assim que o pagamento é confirmado, o produto é liberado automaticamente na sua área de membros do Eidos Hub.',
              },
              {
                q: 'O acesso é vitalício?',
                a: 'Sim. Os materiais comprados ficam disponíveis de forma contínua na sua conta, com eventuais atualizações incluídas.',
              },
              {
                q: 'O bônus Super Briefing está incluso no Pack?',
                a: 'Sim. Ao adquirir o Eidos Pack, o Super Briefing entra como bônus automaticamente.',
              },
              {
                q: 'Posso comprar produtos individuais?',
                a: 'Pode. Além do pack completo, você pode escolher materiais avulsos conforme sua necessidade.',
              },
              {
                q: 'Esses materiais servem para quem está começando?',
                a: 'Sim. Os templates foram pensados para facilitar tanto quem está iniciando quanto quem já atende e quer profissionalizar o processo com mais rapidez.',
              },
            ].map((item, idx) => (
              <details
                key={item.q}
                className="faq-item group rounded-2xl border border-black/10 bg-brand-gray-50 p-5 md:p-6"
                style={{ animation: `fadeUpIn .5s ease both ${idx * 0.06}s` }}
              >
                <summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-bold text-brand-neutral">
                  <span>{item.q}</span>
                  <span className="text-brand-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="faq-answer text-sm md:text-base text-brand-gray-600 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* TERMS MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowTermsModal(false)}
          ></div>
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white border border-black/10 shadow-[0_25px_70px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-brand-gray-100">
              <h3 className="text-lg md:text-xl font-baloo font-bold text-brand-neutral">
                Termos e Privacidade
              </h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-9 h-9 rounded-full border border-brand-gray-200 text-brand-gray-500 hover:bg-brand-gray-50 hover:text-brand-neutral transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5 md:p-6 text-sm text-brand-gray-600 leading-relaxed space-y-4">
              <p>
                <strong className="text-brand-neutral">Uso dos materiais:</strong> Os produtos
                digitais da Eidos Hub são para uso profissional do comprador, sem revenda ou
                redistribuição não autorizada.
              </p>
              <p>
                <strong className="text-brand-neutral">Acesso:</strong> Após confirmação de
                pagamento, os materiais ficam disponíveis na área de membros vinculada à conta do
                usuário.
              </p>
              <p>
                <strong className="text-brand-neutral">Privacidade:</strong> Coletamos apenas dados
                necessários para autenticação, compra e entrega dos produtos, seguindo boas práticas
                de segurança.
              </p>
              <p>
                <strong className="text-brand-neutral">Pagamentos:</strong> O processamento é
                realizado por provedores terceiros (como Stripe). Dados de cartão não são
                armazenados diretamente pela Eidos.
              </p>
              <p>
                <strong className="text-brand-neutral">Suporte:</strong> Em caso de dúvidas sobre
                acesso, entre em contato pelos canais oficiais da Eidos Studio.
              </p>
            </div>

            <div className="px-5 md:px-6 py-4 border-t border-brand-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="inline-flex rounded-full bg-brand-neutral text-white px-5 py-2.5 text-sm font-bold hover:bg-black transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MINI FOOTER */}
      <footer className="py-7 bg-brand-neutral border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-white/70 text-xs">
            © {new Date().getFullYear()} Eidos Studio • Eidos Hub
          </p>
          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://hub.eidostudio.com.br/hub/loja"
              className="text-white/75 hover:text-white"
            >
              Loja
            </a>
            <a href="/orcamento" className="text-white/75 hover:text-white">
              Contato
            </a>
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-white/75 hover:text-white"
            >
              Termos e Privacidade
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductsLanding;
