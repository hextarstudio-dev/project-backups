import { Course, MenuItem } from './types';
import { slugify } from '../../utils/slug';

export const menuItems: MenuItem[] = [
  { id: 'inicio', label: 'Início', icon: 'fa-home' },
  { id: 'loja', label: 'Loja', icon: 'fa-store' },
  { id: 'cursos', label: 'Meus Produtos', icon: 'fa-box-open' },
  { id: 'comunidade', label: 'Comunidade', icon: 'fa-users' },
  { id: 'suporte', label: 'Suporte', icon: 'fa-headset' },
];

const rawContentData: Course[] = [
  {
    id: 'prod_TxLDaQYotWdv1v',
    title: 'Super Briefing',
    category: 'Eidos Pack',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/modelo-briefing.png',
    progress: 0,
    author: 'Eidos Studio',
    duration: 'Vídeo + Template',
    lessons: [
      {
        id: 'sb-1',
        title: 'Como utilizar o material',
        type: 'video',
        duration: '12:00',
        url: 'https://tests.marcbuddy.com.br/video-mbento.mp4',
        description:
          'Assista a este vídeo com instruções passo a passo para utilizar e aplicar este material no seu dia a dia.',
      },
      {
        id: 'sb-2',
        title: 'Download: Super Briefing',
        type: 'pdf',
        duration: 'Arquivo',
        url: '#',
        description: 'Arquivo editável do Super Briefing para uso imediato.',
      },
    ],
  },
  {
    id: 'prod_TxLDri3sdXAp0H',
    title: 'Manual de Marca',
    category: 'Eidos Pack',
    image: 'https://placehold.co/800x1000/1a1a1a/1a1a1a',
    progress: 0,
    author: 'Eidos Studio',
    duration: 'Vídeo + Template',
    lessons: [
      {
        id: 'mm-1',
        title: 'Como utilizar o material',
        type: 'video',
        duration: '15:00',
        url: 'https://tests.marcbuddy.com.br/video-mbento.mp4',
        description:
          'Assista a este vídeo com instruções passo a passo para utilizar e aplicar este material no seu dia a dia.',
      },
      {
        id: 'mm-2',
        title: 'Download: Manual de Marca',
        type: 'pdf',
        duration: 'Arquivo',
        description: 'Template completo do Manual de Marca.',
      },
    ],
  },
  {
    id: 'prod_TxLDxEYMFwGotV',
    title: 'Manual de Arquivos',
    category: 'Eidos Pack',
    image: 'https://placehold.co/800x1000/1a1a1a/1a1a1a',
    progress: 0,
    author: 'Eidos Studio',
    duration: 'Vídeo + Guia',
    lessons: [
      {
        id: 'ma-1',
        title: 'Como utilizar o material',
        type: 'video',
        duration: '08:00',
        url: 'https://tests.marcbuddy.com.br/video-mbento.mp4',
        description:
          'Assista a este vídeo com instruções passo a passo para utilizar e aplicar este material no seu dia a dia.',
      },
      {
        id: 'ma-2',
        title: 'Download: Guia de Arquivos',
        type: 'pdf',
        duration: 'Arquivo',
        description: 'Documento guia para entrega de arquivos finais.',
      },
    ],
  },
  {
    id: 'prod_TxLDL5oTDUNGTh',
    title: 'Proposta Comercial',
    category: 'Eidos Pack',
    image: 'https://placehold.co/800x1000/1a1a1a/1a1a1a',
    progress: 0,
    author: 'Eidos Studio',
    duration: 'Vídeo + Template',
    lessons: [
      {
        id: 'pc-1',
        title: 'Como utilizar o material',
        type: 'video',
        duration: '20:00',
        url: 'https://tests.marcbuddy.com.br/video-mbento.mp4',
        description:
          'Assista a este vídeo com instruções passo a passo para utilizar e aplicar este material no seu dia a dia.',
      },
      {
        id: 'pc-2',
        title: 'Download: Proposta Comercial',
        type: 'pdf',
        duration: 'Arquivo',
        description: 'Template editável de Proposta Comercial Irresistível.',
      },
    ],
  },
  {
    id: 'prod_TxLD49GFquB1S2',
    title: 'Modelo de Portfólio',
    category: 'Eidos Pack',
    image: 'https://placehold.co/800x1000/1a1a1a/1a1a1a',
    progress: 0,
    author: 'Eidos Studio',
    duration: 'Vídeo + Template',
    lessons: [
      {
        id: 'mp-1',
        title: 'Como utilizar o material',
        type: 'video',
        duration: '18:00',
        url: 'https://tests.marcbuddy.com.br/video-mbento.mp4',
        description:
          'Assista a este vídeo com instruções passo a passo para utilizar e aplicar este material no seu dia a dia.',
      },
      {
        id: 'mp-2',
        title: 'Download: Template Portfólio',
        type: 'pdf',
        duration: 'Arquivo',
        description: 'Modelo de Portfólio em PDF interativo.',
      },
    ],
  },
  {
    id: 'prod_U27zA9t065wJaY',
    title: 'Apresentação Behance',
    category: 'Eidos Pack',
    image: 'https://placehold.co/800x1000/1a1a1a/1a1a1a',
    progress: 0,
    author: 'Eidos Studio',
    duration: 'Vídeo + Grid',
    lessons: [
      {
        id: 'ab-1',
        title: 'Como utilizar o material',
        type: 'video',
        duration: '25:00',
        url: 'https://tests.marcbuddy.com.br/video-mbento.mp4',
        description:
          'Assista a este vídeo com instruções passo a passo para utilizar e aplicar este material no seu dia a dia.',
      },
      {
        id: 'ab-2',
        title: 'Download: Grid Behance',
        type: 'pdf',
        duration: 'Arquivo',
        description: 'Arquivos base e grids para montagem de case.',
      },
    ],
  },
  {
    id: 'prod_TxLDcjRlurXW1c',
    title: 'Modelo de Contrato',
    category: 'Eidos Pack',
    image: 'https://placehold.co/800x1000/1a1a1a/1a1a1a',
    progress: 0,
    author: 'Eidos Studio',
    duration: 'Vídeo + Doc',
    lessons: [
      {
        id: 'mc-1',
        title: 'Como utilizar o material',
        type: 'video',
        duration: '10:00',
        url: 'https://tests.marcbuddy.com.br/video-mbento.mp4',
        description:
          'Assista a este vídeo com instruções passo a passo para utilizar e aplicar este material no seu dia a dia.',
      },
      {
        id: 'mc-2',
        title: 'Download: Contrato Base',
        type: 'pdf',
        duration: 'Arquivo',
        description: 'Minuta de contrato pronta para adaptação.',
      },
    ],
  },
  {
    id: 'prod_TxLHC5q9ckSUwI',
    title: 'Eidos Pack Completo',
    category: 'Eidos Pack',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/pacote-eidos.png',
    progress: 0,
    author: 'Eidos Studio',
    duration: 'Pacote Especial',
    lessons: [],
  },
  {
    id: 'prod_TxLD3ntDcA5JZO',
    title: 'Bônus Eidos Pack',
    category: 'Eidos Pack',
    image: 'https://cdn.eidostudio.com.br/eidoshub/products/covers/bonus-eidos-pack.png',
    progress: 0,
    author: 'Eidos Studio',
    duration: 'Vídeo + Ebook',
    lessons: [
      {
        id: 'be-1',
        title: 'Videoaula Estratégica',
        type: 'video',
        duration: '22:00',
        url: 'https://tests.marcbuddy.com.br/video-mbento.mp4',
        description: 'Aprenda como aplicar todo o conjunto Eidos Pack na sua rotina de negócios.',
      },
      {
        id: 'be-2',
        title: 'Download: Super Briefing (Ebook)',
        type: 'pdf',
        duration: 'Arquivo',
        description: 'Ebook bônus exclusivo com perguntas guia de alta conversão.',
      },
      {
        id: 'be-3',
        title: 'Download: Mini Pack Brandboards',
        type: 'pdf',
        duration: 'Arquivo',
        description: 'Templates de brandboards focados para redes sociais.',
      },
      {
        id: 'be-4',
        title: 'Download: Orçamento Simplificado',
        type: 'pdf',
        duration: 'Arquivo',
        description: 'Planilha prática e elegante de orçamento ágil.',
      },
    ],
  },
];

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://cdn.eidostudio.com.br';

const getProductBase = (course: Course) =>
  `${R2_PUBLIC_URL}/eidoshub/products/${slugify(course.id || course.title)}`;

const fixText = (value?: string) => {
  if (!value || typeof value !== 'string') return value;
  if (!/[ÃÂ]/.test(value)) return value;
  try {
    if (typeof TextDecoder !== 'undefined') {
      const bytes = Uint8Array.from(value, char => char.charCodeAt(0));
      return new TextDecoder('utf-8').decode(bytes);
    }
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
};

const ensureDefaultLessons = (course: Course): Course => {
  // Para produtos individuais: garante vídeo de explicação + seção de download
  // (mesma experiência do Modelo de Contrato)
  if ((course.id || '').includes('pack') && !String(course.id).startsWith('prod_')) {
    return course;
  }

  const lessons = [...(course.lessons || [])];
  const hasVideo = lessons.some(l => l.type === 'video');
  const hasPdf = lessons.some(l => l.type === 'pdf');

  if (!hasVideo) {
    lessons.unshift({
      id: `${slugify(course.id || course.title)}-video-intro`,
      title: 'Como utilizar o material',
      type: 'video',
      duration: '10:00',
      description:
        'Assista esta explicação rápida para usar o material da forma correta no seu fluxo.',
    });
  }

  if (!hasPdf) {
    lessons.push({
      id: `${slugify(course.id || course.title)}-download`,
      title: `Download: ${course.title}`,
      type: 'pdf',
      duration: 'Arquivo',
      description: 'Baixe o material principal deste produto para uso imediato.',
    });
  }

  return { ...course, lessons };
};

export const attachR2Urls = (course: Course): Course => {
  const normalized = ensureDefaultLessons(course);
  const base = getProductBase(normalized);
  return {
    ...normalized,
    title: fixText(normalized.title) || normalized.title,
    category: fixText(normalized.category) || normalized.category,
    author: fixText(normalized.author) || normalized.author,
    duration: fixText(normalized.duration) || normalized.duration,
    image:
      normalized.image && normalized.image.startsWith('http')
        ? normalized.image
        : `${R2_PUBLIC_URL}/eidoshub/products/capas/${slugify(normalized.id || normalized.title)}.png`,
    lessons: normalized.lessons.map(lesson => {
      if (lesson.type === 'video') {
        return {
          ...lesson,
          title: fixText(lesson.title) || lesson.title,
          duration: fixText(lesson.duration) || lesson.duration,
          description: fixText(lesson.description) || lesson.description,
          url: lesson.url || `${base}/videos/${lesson.id}.mp4`,
        };
      }
      if (lesson.type === 'pdf') {
        return {
          ...lesson,
          title: fixText(lesson.title) || lesson.title,
          duration: fixText(lesson.duration) || lesson.duration,
          description: fixText(lesson.description) || lesson.description,
          url: lesson.url || `${base}/downloads/${lesson.id}.pdf`,
        };
      }
      return {
        ...lesson,
        title: fixText(lesson.title) || lesson.title,
        duration: fixText(lesson.duration) || lesson.duration,
        description: fixText(lesson.description) || lesson.description,
      };
    }),
  };
};

export const contentData: Course[] = rawContentData.map(attachR2Urls);
export const applyR2Urls = (courses: Course[]) => courses.map(attachR2Urls);
