import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Course } from '../types';
import { authFetch } from '../../../utils/authFetch';

// Mapeamento de Stripe Product ID para Stripe Price ID
const PRODUCT_PRICE_MAP: Record<string, string> = {
  prod_TxLDaQYotWdv1v: 'price_1SzQXLAWei9ShhbquZ0BOkqC', // Briefing
  prod_TxLDri3sdXAp0H: 'price_1SzQXKAWei9ShhbqZdX5wTm6', // Manual de Marca
  prod_TxLDxEYMFwGotV: 'price_1SzQXLAWei9ShhbqLOiYdX2X', // Manual de Arquivos
  prod_TxLD49GFquB1S2: 'price_1SzQXLAWei9ShhbqWFscLg1Y', // Modelo de Portfólio
  prod_TxLDcjRlurXW1c: 'price_1SzQXLAWei9ShhbqOPTKq69P', // Modelo de Contrato
  prod_TxLDL5oTDUNGTh: 'price_1SzQXKAWei9ShhbqFzenD6GW', // Proposta Comercial
  prod_TxLHC5q9ckSUwI: 'price_1SzQaZAWei9ShhbqRhlkuu2V', // Eidos Pack
  prod_U27zA9t065wJaY: 'price_1T43kKAWei9ShhbqXNaI0lsL', // Apresentação Behance
};

const CheckoutConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // O course é passado via state do React Router vindo do CourseGrid
  const course = location.state?.course as Course;

  if (!course) {
    return <Navigate to="/eidoshub/loja" replace />;
  }

  const handleStripeCheckout = async () => {
    setIsProcessing(true);

    const user = JSON.parse(localStorage.getItem('eidos_user') || '{}');
    const userId = user.id;

    if (!userId || !user.email) {
      alert('Você precisa estar logado para comprar produtos.');
      setIsProcessing(false);
      return;
    }

    const priceId = PRODUCT_PRICE_MAP[course.id];

    if (!priceId) {
      alert('Preço não encontrado para este produto.');
      setIsProcessing(false);
      return;
    }

    try {
      const response = await authFetch('/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail: user.email,
          productId: course.id,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao criar checkout. Tente novamente.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert('Erro de conexão ao processar o checkout.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-brand-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <i className="fas fa-arrow-left"></i> Voltar para a Loja
        </button>

        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Coluna da Imagem e Info */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center justify-center bg-black/20 text-center">
              <div className="w-48 h-64 md:w-64 md:h-80 rounded-xl overflow-hidden shadow-2xl mb-8 relative">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-0 w-full px-4">
                  <span className="inline-block px-3 py-1 bg-brand-primary/90 rounded-md text-[10px] font-bold text-white uppercase tracking-widest mb-2">
                    {course.category}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white font-baloo mb-3 leading-tight">
                {course.title}
              </h2>
              <p className="text-brand-gray-400 text-sm max-w-sm">
                Ao finalizar a compra, você terá acesso imediato e vitalício a este material através
                do seu Dashboard no Eidos Hub.
              </p>
            </div>

            {/* Coluna de Ação Segura */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-6">Resumo da Aquisição</h3>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="fas fa-check text-xs"></i>
                    </div>
                    <span className="text-brand-gray-300 text-sm">
                      Acesso vitalício ao material <strong>{course.title}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="fas fa-check text-xs"></i>
                    </div>
                    <span className="text-brand-gray-300 text-sm">
                      Atualizações futuras gratuitas garantidas
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="fas fa-check text-xs"></i>
                    </div>
                    <span className="text-brand-gray-300 text-sm">
                      Acesso pela plataforma Eidos Hub integrado
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-xl p-6 border border-white/5 mb-8">
                <div className="flex items-center gap-3 mb-2 text-brand-gray-400 text-xs uppercase tracking-widest font-bold">
                  <i className="fas fa-lock"></i> Pagamento Seguro
                </div>
                <p className="text-sm text-brand-gray-500">
                  Seu pagamento será processado de forma criptografada e segura pela{' '}
                  <strong>Stripe</strong>. A Eidos Studio não armazena os dados do seu cartão.
                </p>
              </div>

              <button
                onClick={handleStripeCheckout}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${
                  isProcessing
                    ? 'bg-brand-gray-600 cursor-not-allowed'
                    : 'bg-brand-primary hover:bg-brand-primary-dark hover:shadow-brand-primary/25 hover:-translate-y-1'
                }`}
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i> Redirecionando...
                  </>
                ) : (
                  <>
                    Finalizar Compra Segura <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>

              <div className="mt-6 flex justify-center gap-4 text-brand-gray-500 text-xl">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amex"></i>
                <i className="fab fa-pix"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
