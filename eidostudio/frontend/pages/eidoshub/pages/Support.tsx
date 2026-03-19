import React, { useState } from 'react';

interface SupportProps {
  onBack?: () => void;
}

const Support: React.FC<SupportProps> = ({ onBack }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setSubject('');
    setMessage('');
    window.setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-baloo text-white">Suporte</h2>
          <p className="text-brand-gray-400 text-sm mt-2">Precisa de ajuda? Fale com nosso time.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg">Canais rápidos</h3>
          <div className="text-sm text-brand-gray-400 space-y-3">
            <div className="flex items-center gap-3">
              <i className="fas fa-envelope text-brand-primary w-5"></i>
              <span>contato@eidostudio.com.br</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fab fa-whatsapp text-brand-primary w-5"></i>
              <span>WhatsApp comercial</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-clock text-brand-primary w-5"></i>
              <span>Resposta em até 24h úteis</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
              Assunto
            </label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-brand-primary/30"
              placeholder="Ex: Dúvida sobre downloads"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
              Mensagem
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-brand-primary/30 min-h-[140px]"
              placeholder="Conte detalhes para agilizar nosso retorno."
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${sent ? 'text-green-400' : 'text-brand-gray-500'}`}
            >
              {sent ? 'Mensagem enviada' : 'Suporte do Hub'}
            </span>
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-primary-dark transition-all"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Support;
