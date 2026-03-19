//Cuidado-Funcional//
import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from './utils/router-types';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import AuthCallback from './pages/AuthCallback.tsx';

const About = lazy(() => import('./pages/About.tsx'));
const Portfolio = lazy(() => import('./pages/Portfolio.tsx'));
const Services = lazy(() => import('./pages/Services.tsx'));
const ProductsLanding = lazy(() => import('./pages/ProductsLanding.tsx'));
const Orcamento = lazy(() => import('./pages/Orcamento.tsx'));
const Admin = lazy(() => import('./pages/Admin.tsx'));
const Login = lazy(() => import('./pages/Login.tsx'));
const Register = lazy(() => import('./pages/Register.tsx'));
const Hub = lazy(() => import('./pages/eidoshub/index.tsx'));
import { ProjectProvider } from './context/ProjectContext.tsx';
import { ConfirmProvider } from './context/ConfirmContext.tsx';
const HUB_HOST = 'hub.eidostudio.com.br';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof window === 'undefined') return <>{children}</>;

  const isAuth = localStorage.getItem('eidos_auth') === 'true';
  const rawUser = localStorage.getItem('eidos_user');
  let user: { isAdmin?: boolean; role?: string } | null = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }
  const isAdmin = user?.role === 'admin';

  if (!isAuth || !isAdmin) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  const { pathname } = useLocation();
  const prevPathRef = React.useRef(pathname);
  const isHubHost = typeof window !== 'undefined' && window.location.hostname === HUB_HOST;

  useEffect(() => {
    // Mantém scroll ao abrir/fechar modal do portfólio apenas quando já estamos no contexto de portfólio.
    const prevPath = prevPathRef.current;
    const prevIsPortfolio = prevPath.startsWith('/portfolio');
    const nextIsPortfolio = pathname.startsWith('/portfolio');

    if (prevIsPortfolio && nextIsPortfolio) {
      prevPathRef.current = pathname;
      return;
    }

    window.scrollTo(0, 0);
    prevPathRef.current = pathname;
  }, [pathname]);

  // Rotas que não devem exibir a Navbar e o Footer públicos
  // Adicionado '/ad1m1n' para ter layout exclusivo
  const hidePublicNavRoutes = [
    '/eidoshub',
    '/hub',
    '/login',
    '/registro',
    '/ad1m1n',
    '/auth-callback',
    '/produtos',
  ];
  const shouldShowPublicNav =
    !isHubHost && !hidePublicNavRoutes.some(route => pathname.startsWith(route));

  return (
    <ConfirmProvider>
      <ProjectProvider>
        <div className="flex flex-col min-h-screen">
          {shouldShowPublicNav && <Navbar />}

          <main
            className={`flex-grow ${shouldShowPublicNav ? 'overflow-x-hidden' : 'min-h-screen'}`}
          >
            <Suspense
              fallback={
                <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-500">
                  Carregando...
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<About />} />

                {/* Rota principal do Portfólio */}
                <Route path="/portfolio" element={<Portfolio />} />

                {/* Nova rota para abrir o modal do projeto com URL amigável */}
                <Route path="/portfolio/projetos/:projectSlug" element={<Portfolio />} />

                <Route path="/servicos" element={<Services />} />
                <Route path="/produtos" element={<ProductsLanding />} />
                <Route path="/orcamento" element={<Orcamento />} />
                <Route
                  path="/ad1m1n"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />

                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
                <Route path="/eidoshub/*" element={<Hub />} />
                <Route path="/hub/*" element={<Hub />} />
                <Route path="/hub" element={<Navigate to="/hub/meus-produtos" replace />} />
                {isHubHost && <Route path="/*" element={<Hub />} />}
              </Routes>
            </Suspense>
          </main>

          {shouldShowPublicNav && <Footer />}
        </div>
      </ProjectProvider>
    </ConfirmProvider>
  );
};

export default App;
