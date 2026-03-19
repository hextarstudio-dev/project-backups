import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from '../utils/router-types';

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ isOpen, onClose }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onClose();
  }, [location]);

  useEffect(() => {
    if (!isOpen) return;

    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const root = menuRef.current;
    const focusableElements = root
      ? Array.from(root.querySelectorAll<HTMLElement>(focusableSelector))
      : [];
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && first && last) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { name: 'Sobre', path: '/sobre', label: 'Quem Somos' },
    { name: 'Portfólio', path: '/portfolio', label: 'Cases' },
    { name: 'Serviços', path: '/servicos', label: 'Soluções' },
    { name: 'Produtos', path: '/produtos', label: 'Produtos Digitais' },
    { name: 'Contato', path: '/orcamento', label: 'Fale Conosco' },
    {
      name: 'Área de Membros',
      path: 'https://hub.eidostudio.com.br/hub/meus-produtos',
      label: 'Área Exclusiva',
      external: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      id="main-mobile-menu"
      className="fixed inset-0 z-[40] top-[70px] md:top-[100px] h-[calc(100vh-70px)] md:h-[calc(100vh-100px)] w-full overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0d0d0d]/95 backdrop-blur-xl transition-opacity duration-500"
        onClick={onClose}
      ></div>

      <div className="relative w-full h-full flex flex-col md:flex-row animate-in slide-in-from-top-4 duration-500">
        {/* Left Column: Navigation (Escuro) */}
        <div className="w-full md:w-2/3 h-full bg-brand-neutral p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative Pink Blur */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

          <nav className="flex flex-col space-y-2 relative z-10">
            {menuItems.map((item, index) => {
              const itemClass =
                'group flex items-center justify-between py-4 border-b border-white/10 hover:border-brand-primary/50 transition-all duration-300';
              const content = (
                <>
                  <div className="flex items-center gap-6">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${activeItem === item.name ? 'text-brand-primary' : 'text-brand-gray-500'}`}
                    >
                      0{index + 1}
                    </span>
                    <span
                      className={`text-4xl md:text-6xl font-bold font-baloo transition-all duration-300 transform ${activeItem === item.name ? 'translate-x-4 text-brand-primary' : 'text-white/90'}`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 transform ${activeItem === item.name ? 'bg-brand-primary border-brand-primary rotate-[-45deg]' : 'opacity-0 scale-50'}`}
                  >
                    <i className="fas fa-arrow-right text-white"></i>
                  </div>
                </>
              );

              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    onMouseEnter={() => setActiveItem(item.name)}
                    onMouseLeave={() => setActiveItem(null)}
                    className={itemClass}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onMouseEnter={() => setActiveItem(item.name)}
                  onMouseLeave={() => setActiveItem(null)}
                  className={itemClass}
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Column: Contact & Info (Cinza Escuro) */}
        <div className="hidden md:flex w-1/3 h-full bg-[#101010] border-l border-white/5 p-12 flex-col justify-between relative">
          <div className="space-y-8">
            <div>
              <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-6">
                Contato Rápido
              </h4>
              <p className="text-white text-xl font-medium mb-2">contato@eidostudio.com.br</p>
              <p className="text-brand-gray-400 text-lg">+55 11 99999-9999</p>
            </div>

            <div>
              <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-6">
                Endereço
              </h4>
              <p className="text-brand-gray-400 leading-relaxed">
                Av. Paulista, 000 - Bela Vista
                <br />
                São Paulo - SP
                <br />
                Brasil
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs">
              Siga-nos
            </h4>
            <div className="flex gap-4">
              {['instagram', 'behance', 'linkedin', 'whatsapp'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-brand-primary hover:text-white transition-all duration-300 border border-white/10 hover:scale-110 shadow-sm"
                >
                  <i className={`fab fa-${social} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Eidos Logo Watermark */}
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none translate-x-10 translate-y-10 filter grayscale">
            <img
              src="https://i.ibb.co/93qZzpD2/Principal-simbolo-preta-32.png"
              alt="Watermark"
              className="w-full h-full object-contain invert"
            />
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="md:hidden bg-[#101010] p-6 border-t border-white/10 flex justify-between items-center">
          <div className="flex gap-4">
            <a href="#" className="text-brand-gray-400 hover:text-brand-primary">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="text-brand-gray-400 hover:text-brand-primary">
              <i className="fab fa-whatsapp text-xl"></i>
            </a>
          </div>
          <Link
            to="/orcamento"
            className="text-brand-primary font-bold text-sm uppercase tracking-widest"
          >
            Iniciar Projeto <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
