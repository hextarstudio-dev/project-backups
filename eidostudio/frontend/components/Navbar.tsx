import React, { useState, useEffect } from 'react';
import { Link, useLocation } from '../utils/router-types';
import NavMenu from './NavMenu';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Histerese para evitar flicker no ponto de transição
    // Sobe para estado "scrolled" só depois de 70px
    // Volta para estado "normal" só abaixo de 30px
    const SCROLL_UP_THRESHOLD = 70;
    const SCROLL_DOWN_THRESHOLD = 30;

    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(prev => {
        if (!prev && y > SCROLL_UP_THRESHOLD) return true;
        if (prev && y < SCROLL_DOWN_THRESHOLD) return false;
        return prev;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fecha o menu se a rota mudar
    setIsOpen(false);
  }, [location]);

  // Bloqueia o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Links da navegação
  const navLinks: Array<{ name: string; path: string; external?: boolean }> = [
    { name: 'Portfólio', path: '/portfolio' },
    { name: 'Serviços', path: '/servicos' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Orçamento', path: '/orcamento' },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 relative transition-all duration-500 ${
          isOpen
            ? 'border-none shadow-none bg-white'
            : `border-b border-brand-gray-100/80 ${
                isScrolled ? 'bg-white shadow-[0_12px_30px_rgba(15,15,15,0.08)]' : 'bg-white'
              }`
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
          <div
            className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-[70px]' : 'h-[100px]'}`}
          >
            <Link to="/" className="flex items-center z-50" onClick={() => setIsOpen(false)}>
              <img
                src={
                  isScrolled
                    ? 'https://cdn.eidostudio.com.br/assets/site/logos/isotipo-rosa-2.svg'
                    : 'https://cdn.eidostudio.com.br/assets/site/logos/logotipo-rosa-preta-1.svg'
                }
                alt="Eidos Studio"
                className={`w-auto transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12'}`}
              />
            </Link>

            {/* Desktop Links */}
            <div
              className={`hidden md:flex items-center space-x-6 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              {navLinks.map(link => {
                const isActive = !link.external && location.pathname === link.path;
                const className = `font-bold transition-all tracking-tight relative group px-3 py-2 rounded-full ${
                  isActive
                    ? 'text-brand-primary bg-brand-primary/10'
                    : 'text-brand-neutral hover:text-brand-primary hover:bg-brand-gray-50'
                } ${isScrolled ? 'text-sm' : 'text-base'}`;

                if (link.external) {
                  return (
                    <a key={link.path} href={link.path} className={className}>
                      {link.name}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-8"></span>
                    </a>
                  );
                }

                return (
                  <Link key={link.path} to={link.path} className={className}>
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-8 ${isActive ? 'w-8' : ''}`}
                    ></span>
                  </Link>
                );
              })}

              <div className="flex items-center gap-3">
                {/* CTA Button */}
                <a href="https://hub.eidostudio.com.br/hub/meus-produtos">
                  <button
                    className={`relative overflow-hidden rounded-full font-bold transition-all px-8 py-3 ${
                      isScrolled ? 'text-sm' : 'text-base'
                    } text-white bg-gradient-to-r from-brand-primary via-brand-primary to-brand-orange hover:-translate-y-0.5`}
                  >
                    Área de Membros
                  </button>
                </a>
              </div>
            </div>

            {/* Custom Toggle Button - Hidden on Desktop (md and up) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="group flex md:hidden items-center gap-3 focus:outline-none z-50"
              aria-label="Menu"
              aria-expanded={isOpen}
              aria-controls="main-mobile-menu"
            >
              <div
                className={`w-12 h-12 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 shadow-sm border ${isOpen ? 'bg-brand-primary border-brand-primary rotate-90' : 'bg-brand-gray-50 border-brand-gray-200 hover:border-brand-primary'}`}
              >
                <span
                  className={`w-5 h-0.5 bg-brand-neutral rounded-full transition-all duration-300 ${isOpen ? 'bg-white rotate-45 translate-y-2' : ''}`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-brand-neutral rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-brand-neutral rounded-full transition-all duration-300 ${isOpen ? 'bg-white -rotate-45 -translate-y-2' : ''}`}
                ></span>
              </div>
            </button>
          </div>
        </div>
        {!isOpen && (
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"></div>
        )}
      </nav>

      {/* Full Screen Menu Component */}
      <NavMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Navbar;
