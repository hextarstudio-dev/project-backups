import React, { useState } from 'react';
import { useNavigate } from '../utils/router-types';
import Button from '../components/Button';
import { syncUserToStorage } from '../context/authUtils';
import { API_BASE, api } from '../utils/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('eidos_saved_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Wave 4: Backend now sends HttpOnly cookies, credentials: 'include' required
      const response = await fetch(api('/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Wave 4: Required for HttpOnly cookies
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user || data;
        // Wave 4: Cookies handle token, only save auth flag + user data (non-sensitive)
        localStorage.setItem('eidos_auth', 'true');
        // Sincroniza dados do usuário no localStorage de forma segura
        syncUserToStorage({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl || user.hubProfile?.avatar_url || null,
        });

        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('eidos_saved_email', email);
        } else {
          localStorage.removeItem('eidos_saved_email');
        }

        navigate(`/eidoshub/meus-produtos`);
      } else {
        alert('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-brand-neutral">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      {/* Left Column - Image/Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative p-20">
        <div className="relative z-10 text-white max-w-lg">
          <div className="mb-12">
            <img
              src="https://cdn.eidostudio.com.br/assets/site/logos/logotipo-rosa-branca-1.svg"
              alt="Eidos Studio"
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-6xl font-bold font-baloo leading-tight mb-6">
            Bem-vindo ao <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
              Eidos Hub
            </span>
            .
          </h1>
          <p className="text-xl text-brand-gray-400 font-light leading-relaxed">
            Sua área exclusiva para acessar materiais, aulas e recursos de design estratégico.
            Conecte-se à essência da sua marca.
          </p>

          <div className="mt-12 flex items-center gap-4 text-sm font-bold text-white/30 uppercase tracking-widest">
            <div className="w-12 h-[1px] bg-white/20"></div>
            <span>Área de Membros</span>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative z-20 rounded-l-[3rem] shadow-2xl">
        {/* Botão de Voltar */}
        <button
          onClick={() => window.location.href = 'https://eidostudio.com.br/'}
          className="absolute top-8 left-8 lg:left-12 flex items-center gap-3 group z-30"
          title="Voltar para o site"
        >
          <div className="w-10 h-10 rounded-full bg-brand-gray-50 border border-brand-gray-100 flex items-center justify-center text-brand-gray-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300 shadow-sm">
            <i className="fas fa-arrow-left text-sm group-hover:-translate-x-0.5 transition-transform"></i>
          </div>
          <span className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest group-hover:text-brand-primary transition-colors hidden sm:inline-block">
            Voltar ao site
          </span>
        </button>

        <div className="max-w-md w-full mt-10 md:mt-0">
          <div className="text-center mb-10 lg:hidden">
            <img
              src="https://i.ibb.co/93qZzpD2/Principal-simbolo-preta-32.png"
              alt="Eidos Studio"
              className="h-12 w-auto mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold font-baloo text-brand-neutral">Eidos Hub</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-brand-neutral font-baloo mb-1">
              Acesse sua conta
            </h2>
            <p className="text-brand-gray-500">Digite suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest ml-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-brand-gray-50 px-6 py-4 rounded-2xl border border-brand-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-neutral font-medium"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest ml-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-brand-gray-50 px-6 py-4 rounded-2xl border border-brand-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-neutral font-medium"
                placeholder="••••••••"
              />
              <div className="flex justify-between items-center mt-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-brand-gray-300 group-hover:border-brand-primary'}`}
                  >
                    {rememberMe && <i className="fas fa-check text-xs"></i>}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-brand-gray-500 group-hover:text-brand-neutral transition-colors">
                    Lembrar senha
                  </span>
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-brand-primary hover:text-brand-primary-dark"
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="mt-4 shadow-lg shadow-brand-primary/20"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-circle-notch fa-spin"></i> Acessando...
                </span>
              ) : (
                'Entrar no Hub'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-brand-gray-400 font-medium">ou</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-brand-gray-200 rounded-2xl px-6 py-4 font-medium text-brand-neutral hover:bg-brand-gray-50 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <i className="fas fa-circle-notch fa-spin text-brand-primary"></i>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="font-medium">
              {googleLoading ? 'Conectando...' : 'Entrar com Google'}
            </span>
          </button>

          <div className="mt-6 text-center text-sm text-brand-gray-400">
            Ainda não é membro?{' '}
            <a href="/registro" className="text-brand-neutral font-bold hover:underline">
              Registre-se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
