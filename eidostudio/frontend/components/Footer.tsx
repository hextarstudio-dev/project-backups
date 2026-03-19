import React from 'react';
import { Link } from '../utils/router-types';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-neutral pt-24 pb-12 text-white border-t border-white/10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Coluna 1: Logo & Sobre */}
          <div className="flex flex-col items-start">
            <Link
              to="/"
              className="inline-block mb-10 transform hover:scale-105 transition-all duration-500"
            >
              <img
                src="https://cdn.eidostudio.com.br/assets/site/logos/isotipo-rosa-1.png"
                alt="Eidos Studio"
                className="w-16 h-auto object-contain"
              />
            </Link>
            <p className="text-brand-gray-400 text-base leading-relaxed mb-8 max-w-xs font-light">
              <span className="text-brand-primary font-bold">Eidos Studio</span> — essência, origem
              e estratégia em forma de marca.
            </p>
            <div className="flex space-x-4 mt-auto">
              <a
                href="https://instagram.com/eidostudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-brand-primary transition-all border border-white/10"
              >
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a
                href="https://behance.net/eidostudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-brand-primary transition-all border border-white/10"
              >
                <i className="fab fa-behance text-lg"></i>
              </a>
              <a
                href="https://linkedin.com/company/eidostudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-brand-primary transition-all border border-white/10"
              >
                <i className="fab fa-linkedin text-lg"></i>
              </a>
            </div>
          </div>

          {/* Coluna 2: Explorar */}
          <div>
            <h4 className="font-bold text-xl text-white mb-8 font-baloo">Explorar</h4>
            <ul className="space-y-6">
              <li>
                <Link
                  to="/sobre"
                  className="text-brand-gray-400 hover:text-brand-primary text-base transition-colors block"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-brand-gray-400 hover:text-brand-primary text-base transition-colors block"
                >
                  Portfólio
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos"
                  className="text-brand-gray-400 hover:text-brand-primary text-base transition-colors block"
                >
                  O Que Fazemos
                </Link>
              </li>
              <li>
                <Link
                  to="/orcamento"
                  className="text-brand-gray-400 hover:text-brand-primary text-base transition-colors block"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Soluções */}
          <div>
            <h4 className="font-bold text-xl text-white mb-8 font-baloo">Soluções</h4>
            <ul className="space-y-6">
              <li>
                <Link
                  to="/servicos"
                  className="text-brand-gray-400 hover:text-brand-primary text-base transition-colors block"
                >
                  Identidade Visual & Branding
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos"
                  className="text-brand-gray-400 hover:text-brand-primary text-base transition-colors block"
                >
                  Social Media
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos"
                  className="text-brand-gray-400 hover:text-brand-primary text-base transition-colors block"
                >
                  Edição de Vídeos
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos"
                  className="text-brand-gray-400 hover:text-brand-primary text-base transition-colors block"
                >
                  Web Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div>
            <h4 className="font-bold text-xl text-white mb-8 font-baloo">Contato</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all flex-shrink-0 border border-white/10 mt-1">
                  <i className="fas fa-envelope text-sm"></i>
                </div>
                <div className="flex flex-col justify-center h-full pt-1">
                  <span className="text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1">
                    E-mail
                  </span>
                  <a
                    href="mailto:contato@eidostudio.com.br"
                    className="text-brand-gray-400 group-hover:text-white transition-colors text-sm"
                  >
                    contato@eidostudio.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all flex-shrink-0 border border-white/10 mt-1">
                  <i className="fas fa-phone text-sm"></i>
                </div>
                <div className="flex flex-col justify-center h-full pt-1">
                  <span className="text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1">
                    Telefone
                  </span>
                  <a
                    href="tel:+5511999999999"
                    className="text-brand-gray-400 group-hover:text-white transition-colors text-sm"
                  >
                    (11) 99999-9999
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all flex-shrink-0 border border-white/10 mt-1">
                  <i className="fas fa-location-dot text-sm"></i>
                </div>
                <div className="flex flex-col justify-center h-full pt-1">
                  <span className="text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1">
                    Localização
                  </span>
                  <span className="text-brand-gray-400 group-hover:text-white transition-colors text-sm">
                    Rio de Janeiro, Brasil
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-gray-500 space-y-4 md:space-y-0">
          <p>
            © {new Date().getFullYear()}{' '}
            <span className="font-bold uppercase tracking-wider">Eidos Studio</span>. Todos os
            direitos reservados.
          </p>
          <div className="flex space-x-8 font-medium">
            <Link to="/produtos" className="hover:text-brand-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="/produtos" className="hover:text-brand-primary transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
