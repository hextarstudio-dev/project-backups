export interface Project {
  id: string;
  title: string;
  client: string;
  category_id?: string;
  category?: string; // Compatibility
  date: string;
  description: string;
  cover_image_url?: string;
  coverImageUrl?: string; // Compatibility
  card_image_url?: string;
  cardImageUrl?: string; // Compatibility
  cover_image_key?: string;
  coverImageKey?: string; // Compatibility
  card_image_key?: string;
  cardImageKey?: string; // Compatibility
  sections?: ProjectSection[];
}

export interface ProjectSection {
  id: string;
  project_id: string;
  type: 'text' | 'gallery' | 'palette';
  title?: string;
  content?: string;
  layout?: string;
  image_format?: string;
  imageFormat?: string; // Compatibility
  slides_count?: number;
  slidesCount?: number; // Compatibility
  colors?: string[];
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  section_id: string;
  url: string;
  alt: string;
  image_key?: string;
  imageKey?: string; // Compatibility
  order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url: string;
  items: string[];
}

export interface Category {
  id: string;
  name: string;
}
