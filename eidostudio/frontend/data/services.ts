import { ProcessStep, Service } from '../types';

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Primeiro Contato',
    description:
      'Conhecemos você e sua marca através do pré-briefing, entendendo suas necessidades reais.',
  },
  {
    step: '02',
    title: 'Reunião & Contrato',
    description:
      'Alinhamos expectativas, criamos o primeiro moodboard, apresentamos a proposta e definimos os próximos passos.',
  },
  {
    step: '03',
    title: 'Início do Projeto',
    description:
      'Iniciamos uma pesquisa profunda baseada no briefing para trazer à tona a essência da sua marca.',
  },
  {
    step: '04',
    title: 'Acompanhamento',
    description:
      'Você acompanha todo o processo, com aprovações por etapa e comunicação constante.',
  },
  {
    step: '05',
    title: 'Apresentação Final',
    description: 'Apresentamos o projeto completo, explicando cada decisão estratégica.',
  },
  {
    step: '06',
    title: 'Entrega',
    description:
      'Você recebe todos os materiais organizados, prontos para uso e alinhados com o posicionamento.',
  },
];

export const servicesData: Service[] = [];
