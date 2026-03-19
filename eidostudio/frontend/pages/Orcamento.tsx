import React, { useState } from 'react';
import { ContactForm as ContactFormType } from '../types';
import Button from '../components/Button';
import CustomDropdown from '../components/CustomDropdown';

const Orcamento: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormType>({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceError, setServiceError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceChange = (value: string) => {
    setFormData({ ...formData, service: value });
    if (value) setServiceError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.service) {
      setServiceError('Selecione o tipo de serviço para continuar.');
      const serviceField = document.getElementById('service-field');
      serviceField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setServiceError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.eidostudio.com.br/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar formulário');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        service: '',
      });
    } catch (error) {
      console.error('Erro ao enviar briefing:', error);
      alert('Erro ao enviar briefing. Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    { value: 'branding', label: 'Identidade Visual & Branding' },
    { value: 'social', label: 'Social Media' },
    { value: 'video', label: 'Edicao de Videos' },
    { value: 'web', label: 'Web Design' },
    { value: 'outro', label: 'Outro Projeto' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-brand-neutral">
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 border-b border-brand-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(242,61,179,0.08),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(242,92,5,0.08),transparent_40%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <h1 className="mt-5 text-4xl md:text-6xl font-baloo font-bold leading-[0.95]">
              Vamos tirar sua ideia do papel
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-orange">
                com direcao e identidade.
              </span>
            </h1>
            <p className="mt-5 text-brand-gray-600 text-base md:text-lg max-w-2xl leading-relaxed">
              Preencha o briefing rapido e retornamos com os proximos passos, escopo ideal e
              estimativa inicial para o seu projeto.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            {['Resposta em ate 24h uteis', 'Atendimento consultivo', 'Escopo claro e objetivo'].map(
              item => (
                <div
                  key={item}
                  className="rounded-xl border border-brand-gray-200 bg-white px-4 py-3 text-xs font-semibold text-brand-gray-600"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
              <div className="rounded-3xl border border-brand-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-brand-gray-500 mb-3">
                  Como funciona
                </p>
                <ol className="space-y-4 text-sm text-brand-gray-700">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    Voce envia os detalhes do projeto
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    Nos analisamos escopo e objetivos
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    Retorno com proposta inicial
                  </li>
                </ol>
              </div>

              <div className="rounded-3xl border border-brand-gray-200 bg-white p-6 shadow-sm space-y-4">
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-brand-gray-500">
                  Contato direto
                </p>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-brand-gray-400 font-bold mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:contato@eidostudio.com.br"
                    className="font-bold hover:text-brand-primary transition-colors"
                  >
                    contato@eidostudio.com.br
                  </a>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-brand-gray-400 font-bold mb-1">
                    WhatsApp
                  </p>
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold hover:text-brand-primary transition-colors"
                  >
                    (11) 99999-9999
                  </a>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <div className="rounded-[2rem] border border-brand-primary/15 bg-white shadow-[0_22px_50px_rgba(15,15,15,0.08)] p-6 md:p-10">
                {!submitted ? (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-baloo font-bold text-brand-neutral">
                        Briefing rapido
                      </h2>
                      <p className="text-brand-gray-500 mt-2 text-sm md:text-base">
                        Quanto melhor o contexto, mais assertiva fica a proposta.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-7">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                            Nome
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-brand-gray-50 px-5 py-3.5 rounded-xl border border-brand-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all"
                            placeholder="Seu nome"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                            E-mail
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-brand-gray-50 px-5 py-3.5 rounded-xl border border-brand-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all"
                            placeholder="voce@empresa.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                            WhatsApp
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-brand-gray-50 px-5 py-3.5 rounded-xl border border-brand-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                        <div className="space-y-2" id="service-field">
                          <CustomDropdown
                            label="Tipo de servico"
                            options={serviceOptions}
                            value={formData.service}
                            onChange={handleServiceChange}
                            placeholder="Selecione"
                          />
                          {serviceError && (
                            <p className="text-xs font-semibold text-red-600" role="alert">
                              {serviceError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-brand-gray-500">
                          Sobre o projeto
                        </label>
                        <textarea
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full bg-brand-gray-50 px-5 py-3.5 rounded-xl border border-brand-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all resize-none"
                          placeholder="Objetivo, prazo, o que ja tem pronto e o que precisa que a Eidos desenvolva..."
                        />
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          fullWidth
                          size="lg"
                          disabled={isSubmitting}
                          className="py-4 text-base bg-gradient-to-r from-brand-primary to-brand-orange hover:opacity-95 transition-opacity"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <i className="fas fa-circle-notch fa-spin mr-2"></i>Enviando
                              briefing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <i className="fas fa-paper-plane mr-2"></i>Enviar solicitacao
                            </span>
                          )}
                        </Button>
                        <p className="text-center text-xs text-brand-gray-400 mt-3">
                          Ao enviar, voce concorda em ser contatado pela equipe da Eidos.
                        </p>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center mb-6 shadow-lg shadow-green-500/25">
                      <i className="fas fa-check text-3xl"></i>
                    </div>
                    <h3 className="text-3xl font-baloo font-bold text-brand-neutral mb-3">
                      Solicitacao enviada
                    </h3>
                    <p className="text-brand-gray-600 max-w-md mx-auto mb-8">
                      Recebemos seu briefing. Em ate 24 horas uteis retornamos com os proximos
                      passos.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="px-7 py-3"
                    >
                      Enviar novo briefing
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Orcamento;
