import React, { useState, useEffect } from 'react';
import { authFetch } from '../../../utils/authFetch';

interface PurchasesProps {
  onBack?: () => void;
}

interface PurchaseItem {
  purchase_id: string;
  purchased_at: string;
  product_title: string;
  amount_paid: number | null;
}

const Purchases: React.FC<PurchasesProps> = ({ onBack }) => {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const userStr = localStorage.getItem('eidos_user');
        if (!userStr) {
          setIsLoading(false);
          return;
        }

        const userObj = JSON.parse(userStr);
        if (!userObj.id) {
          setIsLoading(false);
          return;
        }

        const res = await authFetch(`/hub/users/${userObj.id}/purchases`);
        if (res.ok) {
          const data = await res.json();
          setPurchases(data);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-baloo text-white">
            Histórico de Acessos
          </h2>
          <p className="text-brand-gray-400 text-sm mt-2">Seus produtos e acessos ativos no Hub.</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/70 border border-white/10 hover:border-brand-primary hover:text-brand-primary transition-all"
          >
            Voltar ao Hub
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-brand-gray-500">
          Carregando...
        </div>
      ) : purchases.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {purchases.map(purchase => (
            <div
              key={purchase.purchase_id}
              className="bg-[#1a1a1a] border border-white/10 flex items-center justify-between p-6 rounded-2xl hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <i className="fas fa-box text-brand-primary text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{purchase.product_title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500">
                    Liberado em {new Date(purchase.purchased_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Preço pago */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-brand-gray-500 uppercase tracking-widest font-bold">
                    Valor pago
                  </p>
                  <p className="text-white font-bold text-sm mt-0.5">
                    {purchase.amount_paid != null && purchase.amount_paid > 0
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(purchase.amount_paid / 100)
                      : purchase.amount_paid === 0
                        ? 'Gratuito'
                        : '—'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Ativo
                </span>
                <button className="w-10 h-10 rounded-full border border-white/10 text-white/70 hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all flex items-center justify-center">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 bg-white/5 border border-white/10 rounded-3xl text-center p-6">
          <i className="fas fa-box-open text-3xl text-brand-gray-600 mb-4"></i>
          <p className="text-white font-bold mb-2">Nenhum acesso ativo</p>
          <p className="text-sm text-brand-gray-500 max-w-sm">
            Você ainda não tem nenhum pack ou acesso liberado no seu histórico.
          </p>
        </div>
      )}
    </div>
  );
};

export default Purchases;
