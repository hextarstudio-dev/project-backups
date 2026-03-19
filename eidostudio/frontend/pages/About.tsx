import React from 'react';

const About: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Editorial Hero Section - Unique Layout for About */}
      <section className="relative pt-40 pb-24 md:pt-56 md:pb-40 bg-white overflow-hidden border-b border-brand-gray-100">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Centered Layout - Different from other pages */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-8">
              {/* Title and Description */}
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] w-12 bg-brand-neutral/20"></div>
                  <span className="px-3 py-1 rounded-full border border-brand-neutral/10 bg-white text-[10px] font-bold uppercase tracking-widest text-brand-neutral shadow-sm">
                    Nossa História
                  </span>
                  <div className="h-[1px] w-12 bg-brand-neutral/20"></div>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-bold font-baloo text-brand-neutral leading-[0.95] tracking-tight">
                  Criamos Marcas com
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
                    Propósito
                  </span>
                </h1>

                <p className="text-brand-gray-500 text-lg leading-relaxed max-w-3xl mx-auto font-light">
                  Nossa missão é criar marcas autênticas e vivas que atraem, conectam e constroem
                  comunidades reais e fiéis através de design estratégico e alma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Enhanced */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(242,61,179,0.08),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(242,92,5,0.08),transparent_50%)] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Image Column - Enhanced */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                {/* Main Image */}
                <div className="relative w-full h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                  <img
                    src="https://picsum.photos/seed/raquel/800/1000"
                    alt="Raquel Monteiro"
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-neutral/20 via-transparent to-transparent"></div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-brand-primary to-brand-orange rounded-3xl shadow-xl flex items-center justify-center text-white">
                  <div className="text-center">
                    <i className="fas fa-quote-left text-2xl mb-2"></i>
                    <p className="text-xs font-bold uppercase tracking-wider">Essência</p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-brand-orange/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-8 w-16 h-16 bg-brand-primary/20 rounded-full blur-lg"></div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full border border-brand-neutral/10 bg-white text-[10px] font-bold uppercase tracking-widest text-brand-neutral shadow-sm">
                    Nossa Filosofia
                  </span>
                  <div className="h-[1px] w-12 bg-brand-neutral/20"></div>
                </div>

                <blockquote className="text-3xl md:text-4xl font-bold text-brand-neutral mb-8 font-baloo leading-tight italic">
                  &ldquo;Uma marca não surge apenas de uma ideia comercial, mas da alma de quem a
                  cria.&rdquo;
                </blockquote>
              </div>

              <div className="space-y-6 text-brand-gray-600 leading-relaxed text-lg font-light">
                <p>
                  A Eidos nasce do desejo de criar marcas que não apenas existam no mercado, mas que
                  se destaquem nele. Marcas que expressem a essência das pessoas por trás de cada
                  projeto, gerando conexão, identificação e comunidade.
                </p>
                <p>
                  Acreditamos que marcas não precisam ser apenas corporativas. Elas podem ser
                  diversas, criativas e expressivas. Nosso compromisso é traduzir seus desejos,
                  histórias e propósitos por meio de um design de marca profissional, sensível e
                  criativo.
                </p>
                <div className="relative pl-8 border-l-4 border-brand-primary/30 py-4">
                  <p className="font-bold text-brand-neutral text-xl">
                    Damos forma à essência e a tornamos visível ao mundo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Enhanced */}
      <section className="py-24 bg-brand-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_60%,rgba(242,61,179,0.18),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(26,26,26,0.08),transparent_50%)] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full border border-brand-neutral/10 bg-white text-[10px] font-bold uppercase tracking-widest text-brand-neutral shadow-sm">
                  Valores
                </span>
                <div className="h-[1px] w-12 bg-brand-neutral/20"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-neutral mb-4 font-baloo leading-tight">
                O que guia cada
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
                  projeto
                </span>
              </h2>
              <p className="text-brand-gray-500 text-lg max-w-2xl">
                Nossos princípios fundamentam cada decisão e cada entrega que fazemos.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-brand-gray-400">
              <span className="w-10 h-[1px] bg-white/20"></span>
              Linha editorial
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white border border-brand-gray-100 rounded-3xl shadow-[0_10px_30px_rgba(15,15,15,0.08)] hover:shadow-[0_20px_50px_rgba(15,15,15,0.15)] transition-all duration-500 p-8 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-orange text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
                  <i className="fas fa-palette text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-brand-neutral mb-4 font-baloo">
                  Criatividade & Alma
                </h3>
                <p className="text-brand-gray-600 leading-relaxed">
                  Mesmo as marcas mais profissionais e minimalistas podem emanar uma essência única
                  e marcante. Buscamos a autenticidade em cada traço.
                </p>
              </div>
            </div>

            <div className="group relative bg-white border border-brand-gray-100 rounded-3xl shadow-[0_10px_30px_rgba(15,15,15,0.08)] hover:shadow-[0_20px_50px_rgba(15,15,15,0.15)] transition-all duration-500 p-8 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-orange/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-orange/20 group-hover:scale-110 transition-transform">
                  <i className="fas fa-layer-group text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-brand-neutral mb-4 font-baloo">
                  Organização & Respeito
                </h3>
                <p className="text-brand-gray-600 leading-relaxed">
                  Entregamos mais que design; entregamos um guia prático para manter a consistência
                  visual. Respeitamos a história e o tempo de cada cliente.
                </p>
              </div>
            </div>

            <div className="group relative bg-white border border-brand-gray-100 rounded-3xl shadow-[0_10px_30px_rgba(15,15,15,0.08)] hover:shadow-[0_20px_50px_rgba(15,15,15,0.15)] transition-all duration-500 p-8 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-lilac/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-lilac to-brand-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-lilac/20 group-hover:scale-110 transition-transform">
                  <i className="fas fa-hand-holding-heart text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-brand-neutral mb-4 font-baloo">
                  Acessibilidade & Confiança
                </h3>
                <p className="text-brand-gray-600 leading-relaxed">
                  Nossa comunicação é direta e leve. Construímos relações baseadas na confiança e
                  tornamos o design de alta qualidade acessível a quem sonha.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Enhanced */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(242,61,179,0.08),transparent_55%),radial-gradient(circle_at_85%_10%,rgba(242,92,5,0.08),transparent_45%)] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full border border-brand-neutral/10 bg-white text-[10px] font-bold uppercase tracking-widest text-brand-neutral shadow-sm">
                Equipe
              </span>
              <div className="h-[1px] w-12 bg-brand-neutral/20"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-neutral mb-6 font-baloo leading-tight">
              Quem Faz
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
                Acontecer
              </span>
            </h2>
            <p className="text-brand-gray-500 text-lg max-w-2xl mx-auto">
              A mente criativa e o coração estratégico por trás de cada projeto.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              {/* Enhanced Profile Card - Wider with Photo and Bio */}
              <div className="relative bg-gradient-to-br from-white via-white to-brand-primary/5 backdrop-blur-xl border border-brand-primary/10 p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,15,15,0.12)] relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-orange/10 rounded-full blur-xl"></div>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),transparent_60%)]"></div>

                <div className="relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Photo Canvas */}
                    <div className="relative">
                      <div className="relative w-full h-96 lg:h-[550px] rounded-2xl overflow-hidden shadow-xl group">
                        <img
                          src="https://picsum.photos/seed/raquel-fundadora/600/800"
                          alt="Raquel Monteiro - Fundadora Eidos Studio"
                          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-neutral/30 via-transparent to-transparent"></div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-brand-orange/20 rounded-full blur-xl"></div>
                      <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-brand-primary/20 rounded-full blur-lg"></div>
                    </div>

                    {/* Bio Section */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full border border-brand-neutral/10 bg-white text-[10px] font-bold uppercase tracking-widest text-brand-neutral shadow-sm">
                            Fundadora
                          </span>
                          <div className="h-[1px] w-12 bg-brand-neutral/20"></div>
                        </div>

                        <h3 className="text-3xl font-bold text-brand-neutral mb-4 font-baloo">
                          Raquel Monteiro
                        </h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-bold mb-6">
                          <i className="fas fa-crown text-xs"></i>
                          Estrategista de Marca & Designer
                        </div>
                      </div>

                      {/* Personal Bio Text */}
                      <div className="space-y-4 text-brand-gray-600 leading-relaxed">
                        <p className="text-lg">
                          Minha jornada com design começou muito antes de eu imaginar que poderia
                          transformar isso em profissão. Sempre fui fascinada por como as marcas
                          contam histórias e criam conexões genuínas com as pessoas.
                        </p>
                        <p>
                          A Eidos Studio nasceu do meu desejo de criar marcas que não apenas existam
                          no mercado, mas que tenham alma e propósito. Cada projeto é uma
                          oportunidade de descobrir a essência única de um negócio e traduzi-la em
                          uma identidade visual que comunique autenticidade.
                        </p>
                        <p>
                          Acredito que o design estratégico é a ponte entre o sonho de um
                          empreendedor e a realidade do mercado. Meu compromisso é construir essa
                          ponte com cuidado, respeito e muita criatividade.
                        </p>
                      </div>

                      {/* Social Links */}
                      <div className="flex gap-4 pt-6 border-t border-brand-gray-100">
                        <a
                          href="#"
                          className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-orange text-white rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-brand-primary/20 transition-all transform hover:scale-110"
                        >
                          <i className="fab fa-linkedin-in text-xl"></i>
                        </a>
                        <a
                          href="#"
                          className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-primary text-white rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-brand-orange/20 transition-all transform hover:scale-110"
                        >
                          <i className="fab fa-behance text-xl"></i>
                        </a>
                        <a
                          href="#"
                          className="w-12 h-12 bg-gradient-to-br from-brand-lilac to-brand-primary text-white rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-brand-lilac/20 transition-all transform hover:scale-110"
                        >
                          <i className="fab fa-instagram text-xl"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
