export interface ProjectImage {
  url: string;
  alt: string;
  imageKey?: string;
}

export type GalleryLayout =
  | 'grid-1'
  | 'grid-2'
  | 'grid-3'
  | 'grid-4'
  | 'grid-5'
  | 'grid-6'
  | 'masonry';
export type ImageFormat = 'portrait' | 'square' | 'landscape' | 'carousel' | 'web';

export interface ProjectSection {
  id: string;
  type: 'text' | 'gallery' | 'palette';
  title?: string;
  content?: string;
  layout?: GalleryLayout;
  imageFormat?: ImageFormat;
  images?: ProjectImage[];
  colors?: string[]; // Array de strings hexadecimais: ["#FFFFFF", "#F23DB3", ...]
  slidesCount?: number; // Quantidade de slides para o modo carrossel (1-10)
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  date: string; // Armazena no formato YYYY-MM-DD
  description: string;
  coverImageUrl: string; // Imagem de cabeçalho (interna)
  cardImageUrl: string; // Imagem do card (grade do portfólio)
  coverImageKey?: string;
  cardImageKey?: string;
  sections: ProjectSection[];
}

export interface Service {
  id?: string;
  title: string;
  desc: string; // Backend maps description to desc for frontend compatibility
  icon: string;
  items: string[];
  image: string;
  imageKey?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  service: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}
