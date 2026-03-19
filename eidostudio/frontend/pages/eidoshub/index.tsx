import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import {
  useNavigate,
  useLocation,
  useParams,
  Routes,
  Route,
  Navigate,
} from '../../utils/router-types';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Lazy load pages (carregadas sob demanda)
const CoursePlayer = lazy(() => import('./components/CoursePlayer'));
const CoursePreview = lazy(() => import('./components/CoursePreview'));
const Profile = lazy(() => import('./pages/Profile'));
const ProfileView = lazy(() => import('./pages/ProfileView'));
const Purchases = lazy(() => import('./pages/Purchases'));
const Support = lazy(() => import('./pages/Support'));
const Inicio = lazy(() => import('./pages/Inicio'));
const Products = lazy(() => import('./pages/Products'));
const Store = lazy(() => import('./pages/Store'));
const Community = lazy(() => import('./pages/Community'));
const CheckoutConfirmation = lazy(() => import('./pages/CheckoutConfirmation'));

import { applyR2Urls, contentData } from './data';
import { Course } from './types';
import {
  isTokenExpired,
  syncUserToStorage,
  getStoredUser,
  clearAuthStorage,
} from '../../context/authUtils';
import { authFetch } from '../../utils/authFetch';

const menuRouteMap: Record<string, string> = {
  inicio: 'inicio',
  loja: 'loja',
  cursos: 'meus-produtos',
  comunidade: 'comunidade',
  suporte: 'suporte',
};

type ProfileUpdatePayload = {
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
};

const Hub: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const routeUserId = params?.userId as string | undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('Raquel Monteiro');
  const [userEmail, setUserEmail] = useState('raquel@eidosstudio.com.br');

  // List of internal routes that should NOT be treated as userId
  const RESERVED_ROUTES = [
    'inicio',
    'loja',
    'meus-produtos',
    'comunidade',
    'suporte',
    'perfil',
    'historico',
    'undefined',
  ];

  // Ensure we don't accidentally use the string "undefined" or a reserved route name
  const validRouteUserId =
    routeUserId && !RESERVED_ROUTES.includes(routeUserId) ? routeUserId : null;
  const [userId, setUserId] = useState<string | null>(validRouteUserId || null);

  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const [profileFields, setProfileFields] = useState({ phone: '', company: '', role: '' });
  const [hubCourses, setHubCourses] = useState<Course[]>(contentData);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Filtra produtos disponíveis na loja (exclui bônus que só vem com o pack)
  const storeCourses = useMemo(
    () => hubCourses.filter(course => course.id !== 'prod_TxLD3ntDcA5JZO'),
    [hubCourses]
  );
  const categories = useMemo(
    () => Array.from(new Set(storeCourses.map(c => c.category))),
    [storeCourses]
  );
  const ownedCourses = useMemo(
    () => hubCourses.filter(course => course.owned),
    [hubCourses]
  );
  const ownedCategories = useMemo(
    () => Array.from(new Set(ownedCourses.map(c => c.category))),
    [ownedCourses]
  );

  const pathSegment = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  }, [location.pathname]);
  const isProfileEditRoute = useMemo(
    () => location.pathname.includes('/perfil/editar'),
    [location.pathname]
  );
  const isProfileRoute = useMemo(() => location.pathname.includes('/perfil'), [location.pathname]);

  const activeMenu = useMemo(() => {
    if (pathSegment === 'loja') return 'loja';
    if (pathSegment === 'meus-produtos') return 'cursos';
    if (pathSegment === 'comunidade') return 'comunidade';
    if (pathSegment === 'suporte') return 'suporte';
    if (pathSegment === 'inicio') return 'inicio';
    return '';
  }, [pathSegment]);

  const isProductsRoute = pathSegment === 'meus-produtos' || pathSegment === 'loja';

  const headerTitle = useMemo(() => {
    if (isProfileEditRoute) return 'Editar Perfil';
    if (isProfileRoute) return 'Meu Perfil';
    if (pathSegment === 'historico') return 'Historico de Compras';
    if (pathSegment === 'loja') return 'Loja';
    if (pathSegment === 'suporte') return 'Suporte';
    if (pathSegment === 'comunidade') return 'Comunidade';
    return undefined;
  }, [pathSegment, isProfileEditRoute, isProfileRoute]);

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('eidos_auth');
    // Verifica se a sessão existe E se o token ainda é válido (não expirou)
    if (!auth || isTokenExpired()) {
      clearAuthStorage();
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const loadHubProducts = async () => {
      try {
        const userObj = getStoredUser();
        const fetchPath = userObj?.id ? `/hub/products?userId=${userObj.id}` : '/hub/products';

        const response = await authFetch(fetchPath);
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && Array.isArray(data) && data.length) {
          // Mescla as informações do backend (id, cover) com as aulas (lessons) mockadas no frontend
          const mergedData = data.map((apiProduct: Partial<Course>) => {
            const localProduct = contentData.find(
              c => c.id === apiProduct.id || c.title === apiProduct.title
            );
            return {
              ...apiProduct,
              lessons:
                apiProduct.lessons && apiProduct.lessons.length > 0
                  ? apiProduct.lessons
                  : localProduct?.lessons || [],
            };
          });
          setHubCourses(applyR2Urls(mergedData as Course[]));
        }
      } catch (error) {
        console.error('Hub load error:', error);
      }
    };
    loadHubProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (routeUserId && routeUserId !== userId) {
      setUserId(routeUserId);
    }
  }, [routeUserId, userId]);

  useEffect(() => {
    const parsed = getStoredUser();
    if (!parsed) return;
    if (parsed?.name) setUserName(String(parsed.name));
    if (parsed?.email) setUserEmail(String(parsed.email));

    const storedId = parsed?.id as string | undefined;
    const isValidStoredId = storedId && !RESERVED_ROUTES.includes(storedId);

    if (isValidStoredId && !routeUserId) {
      setUserId(storedId);
    }
    if (parsed?.avatarUrl !== undefined)
      setUserAvatarUrl((parsed.avatarUrl as string | null) || null);
  }, [routeUserId]);

  useEffect(() => {
    // If we land on /eidoshub with no sub-path, redirect to meus-produtos
    if (location.pathname === '/eidoshub' || location.pathname === '/eidoshub/') {
      navigate('/eidoshub/meus-produtos', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    const loadUserProfile = async () => {
      try {
        if (!userId) return;
        const response = await authFetch(`/hub/users/${userId}`);
        if (!response.ok) return;
        const profile = await response.json();
        if (!isMounted) return;
        if (profile?.name) setUserName(profile.name);
        if (profile?.email) setUserEmail(profile.email);
        setUserAvatarUrl(profile?.avatarUrl || null);
        setProfileFields({
          phone: profile?.phone || '',
          company: profile?.company || '',
          role: profile?.role || '',
        });
        // Sincroniza o perfil atualizado da API no localStorage via merge seguro
        syncUserToStorage({
          name: profile?.name,
          email: profile?.email,
          avatarUrl: profile?.avatarUrl || null,
        });
      } catch (error) {
        console.error('Hub profile load error:', error);
      }
    };
    loadUserProfile();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!isProductsRoute && selectedCourse) {
      setSelectedCourse(null);
      setActiveLessonId(null);
    }
  }, [isProductsRoute, selectedCourse]);

  const navigateTo = (segment: string) => {
    if (!userId) return;
    navigate(`/eidoshub/${segment}`);
  };

  const clearPlayer = () => {
    setSelectedCourse(null);
    setActiveLessonId(null);
  };

  const handleLogout = async () => {
    try {
      // Wave 4: Call backend to clear HttpOnly cookies
      await authFetch('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue even if API call fails
    } finally {
      // Clear localStorage
      clearAuthStorage();
      navigate('/login');
    }
  };

  const openCourse = (course: Course) => {
    if (!isProductsRoute) {
      navigateTo('meus-produtos');
    }
    setSelectedCourse(course);
    if (course.lessons.length > 0) {
      setActiveLessonId(course.lessons[0].id);
    }
    setIsSidebarCollapsed(true);
  };

  const handleProfileUpdated = (payload: ProfileUpdatePayload) => {
    if (payload.name) setUserName(payload.name);
    if (payload.email) setUserEmail(payload.email);
    if (Object.prototype.hasOwnProperty.call(payload, 'avatarUrl')) {
      setUserAvatarUrl(payload.avatarUrl || null);
    }
    setProfileFields(prev => ({
      phone: payload.phone !== undefined ? payload.phone || '' : prev.phone,
      company: payload.company !== undefined ? payload.company || '' : prev.company,
      role: payload.role !== undefined ? payload.role || '' : prev.role,
    }));
    // Sincroniza apenas os campos alterados no localStorage, sem sobrescrever o restante
    const storageUpdate: Record<string, unknown> = {};
    if (payload.name) storageUpdate.name = payload.name;
    if (payload.email) storageUpdate.email = payload.email;
    if (Object.prototype.hasOwnProperty.call(payload, 'avatarUrl')) {
      storageUpdate.avatarUrl = payload.avatarUrl || null;
    }
    syncUserToStorage(storageUpdate);
  };

  const goHome = () => {
    clearPlayer();
    navigateTo('inicio');
  };
  const openProfile = () => {
    clearPlayer();
    navigateTo('perfil');
  };
  const openPurchases = () => {
    clearPlayer();
    navigateTo('historico');
  };
  const openSupport = () => {
    clearPlayer();
    navigateTo('suporte');
  };

  const handleMenuNavigate = (menuId: string) => {
    const segment = menuRouteMap[menuId] || 'inicio';
    clearPlayer();
    navigateTo(segment);
  };

  const indexRedirect = userId ? `/eidoshub/meus-produtos` : '/login';

  // If not authenticated, prevent rendering (check after all hooks)
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeMenu={activeMenu}
        onNavigate={handleMenuNavigate}
        onLogoClick={goHome}
        onLogout={handleLogout}
        hasActiveCourse={!!selectedCourse}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0f0f0f] text-white">
        {selectedCourse ? (
          <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-sm text-gray-400">Carregando...</div></div>}>
            {selectedCourse.owned ? (
              <CoursePlayer
                course={selectedCourse}
                activeLessonId={activeLessonId}
                setActiveLessonId={setActiveLessonId}
                onClose={() => {
                  setSelectedCourse(null);
                  setActiveLessonId(null);
                }}
                onLogout={handleLogout}
                userName={userName}
                userAvatarUrl={userAvatarUrl || undefined}
                userId={userId}
              />
            ) : (
              <CoursePreview
                course={selectedCourse}
                onClose={() => {
                  setSelectedCourse(null);
                  setActiveLessonId(null);
                }}
              />
            )}
          </Suspense>
        ) : (
          <>
            <Header
              title={headerTitle}
              showSearch={isProductsRoute}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onLogout={handleLogout}
              onOpenProfile={openProfile}
              onOpenPurchases={openPurchases}
              onOpenSupport={openSupport}
              userName={userName}
              userEmail={userEmail}
              userAvatarUrl={userAvatarUrl || undefined}
              userId={userId}
            />

            <Suspense fallback={<div className="flex items-center justify-center h-full p-8"><div className="text-sm text-gray-400">Carregando...</div></div>}>
              <Routes>
                {/* Rota de Checkout Customizado */}
                <Route path="checkout/:productId" element={<CheckoutConfirmation />} />
                <Route index element={<Navigate to={indexRedirect} replace />} />
              <Route
                path="inicio"
                element={
                  <Inicio
                    userName={userName}
                    ownedCourses={ownedCourses}
                    hubCourses={hubCourses}
                    onOpenCourse={openCourse}
                    onGoProducts={() => navigateTo('meus-produtos')}
                    onOpenSupport={openSupport}
                  />
                }
              />
              <Route
                path="loja"
                element={
                  <Store
                    courses={storeCourses}
                    categories={categories}
                    searchTerm={searchTerm}
                    onOpenCourse={openCourse}
                  />
                }
              />
              <Route
                path="meus-produtos"
                element={
                  <Products
                    courses={ownedCourses}
                    categories={ownedCategories}
                    searchTerm={searchTerm}
                    onOpenCourse={openCourse}
                    emptyTitle="Nenhum produto adquirido ainda"
                    emptyDescription="Quando voce comprar um pack, ele vai aparecer aqui."
                    emptyActionLabel="Ir para a Loja"
                    onEmptyAction={() => navigateTo('loja')}
                  />
                }
              />
              <Route path="comunidade" element={<Community onOpenSupport={openSupport} />} />
              <Route path="suporte" element={<Support onBack={goHome} />} />
              <Route
                path="perfil"
                element={
                  <ProfileView
                    onEdit={() => navigateTo('perfil/editar')}
                    userName={userName}
                    userEmail={userEmail}
                    avatarUrl={userAvatarUrl}
                    profileFields={profileFields}
                  />
                }
              />
              <Route
                path="perfil/editar"
                element={
                  <Profile
                    onBack={() => navigateTo('perfil')}
                    backLabel="Voltar ao perfil"
                    userId={userId}
                    userName={userName}
                    userEmail={userEmail}
                    avatarUrl={userAvatarUrl}
                    profileFields={profileFields}
                    onProfileUpdated={handleProfileUpdated}
                  />
                }
              />
              <Route path="historico" element={<Purchases onBack={goHome} />} />
              </Routes>
            </Suspense>
          </>
        )}
      </main>
    </div>
  );
};

export default Hub;
