import React from 'react';

interface CommunityProps {
  onOpenSupport?: () => void;
}

const Community: React.FC<CommunityProps> = ({ onOpenSupport }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-6 border border-brand-primary/20">
          <i className="fas fa-users text-brand-primary text-2xl"></i>
        </div>
        <h2 className="text-3xl font-bold font-baloo text-white mb-3">Comunidade em construcao</h2>
        <p className="text-brand-gray-400 text-sm max-w-2xl mx-auto">
          Em breve voce podera trocar ideias com outros membros, compartilhar resultados e receber
          feedbacks estrategicos do time Eidos.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onOpenSupport?.()}
            className="px-6 py-3 rounded-full border border-white/10 text-white/70 text-xs font-bold uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all"
          >
            Falar com suporte
          </button>
          <button className="px-6 py-3 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-primary-dark transition-all">
            Quero ser avisada
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;
