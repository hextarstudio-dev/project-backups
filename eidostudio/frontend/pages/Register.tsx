import React, { useState } from 'react';
import { useNavigate } from '../utils/router-types';
import Button from '../components/Button';
import { syncUserToStorage } from '../context/authUtils';
import { API_BASE, api } from '../utils/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const { name, email, password } = formData; // Destructure to send only necessary fields
      // Wave 4: Backend now sends HttpOnly cookies, credentials: 'include' required
      const response = await fetch(api('/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include', // Wave 4: Required for HttpOnly cookies
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user || data;

        // Wave 4: Cookies handle token, only save auth flag + user data (non-sensitive)
        localStorage.setItem('eidos_auth', 'true');
        // Sincroniza dados do usuário de forma segura
        syncUserToStorage({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: null,
        });

        alert('Cadastro realizado com sucesso! Bem-vindo(a) ao Hub.');
        navigate(`/eidoshub/meus-produtos`);
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao cadastrar');
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setGoogleLoading(true);
    // Redirect to Google OAuth endpoint for registration
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-brand-neutral">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      {/* Left Column - Image/Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative p-20">
        {/* Botão de Voltar */}
        <button
          onClick={() => navigate('/login')}
          className="absolute top-8 left-8 flex items-center gap-3 group z-30"
          title="Voltar para login"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-brand-primary group-hover:border-white transition-all duration-300 shadow-sm">
            <i className="fas fa-arrow-left text-sm group-hover:-translate-x-0.5 transition-transform"></i>
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-widest group-hover:text-brand-primary transition-colors">
            Voltar ao login
          </span>
        </button>

        <div className="relative z-10 text-white max-w-lg">
          <div className="mb-12">
            <img
              src="https://cdn.eidostudio.com.br/assets/site/logos/logotipo-rosa-branca-1.svg"
              alt="Eidos Studio"
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-6xl font-bold font-baloo leading-tight mb-6">
            Crie sua conta
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
              Eidos Hub
            </span>
            .
          </h1>
          <p className="text-xl text-brand-gray-400 font-light leading-relaxed">
            Junte-se à nossa comunidade de designers e acesse materiais exclusivos, aulas e recursos
            para elevar suas criações.
          </p>

          <div className="mt-12 flex items-center gap-4 text-sm font-bold text-white/30 uppercase tracking-widest">
            <div className="w-12 h-[1px] bg-white/20"></div>
            <span>Nova Conta</span>
          </div>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 relative z-20 rounded-l-[3rem] shadow-2xl">
        <div className="max-w-md w-full mt-8 md:mt-0">
          <div className="text-center mb-8 lg:hidden">
            <img
              src="https://i.ibb.co/93qZzpD2/Principal-simbolo-preta-32.png"
              alt="Eidos Studio"
              className="h-12 w-auto mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold font-baloo text-brand-neutral">Eidos Hub</h2>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-brand-neutral font-baloo mb-1">
              Crie sua conta
            </h2>
            <p className="text-brand-gray-500">Preencha os dados abaixo para começar.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest ml-1">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-brand-gray-50 px-6 py-3.5 rounded-2xl border border-brand-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-neutral font-medium"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest ml-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-brand-gray-50 px-6 py-3.5 rounded-2xl border border-brand-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-neutral font-medium"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest ml-1">
                Senha
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-brand-gray-50 px-6 py-3.5 rounded-2xl border border-brand-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-neutral font-medium"
                placeholder="••••••••••"
                minLength={8}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest ml-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-brand-gray-50 px-6 py-3.5 rounded-2xl border border-brand-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-neutral font-medium"
                placeholder="••••••••••"
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="py-3.5 shadow-lg hover:shadow-brand-primary/20"
            >
              {loading ? (
                <span className="flex items-center">
                  <i className="fas fa-circle-notch fa-spin mr-3"></i> Criando conta...
                </span>
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-brand-gray-400 font-medium">ou</span>
            </div>
          </div>

          {/* Google Register Button */}
          <button
            onClick={handleGoogleRegister}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-brand-gray-200 rounded-2xl px-6 py-3.5 font-medium text-brand-neutral hover:bg-brand-gray-50 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              {googleLoading ? 'Conectando...' : 'Registrar com Google'}
            </span>
          </button>

          <div className="mt-4 text-center text-sm text-brand-gray-400">
            Já tem uma conta?{' '}
            <a href="/login" className="text-brand-neutral font-bold hover:underline">
              Faça login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
