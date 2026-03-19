export type ContentType = 'video' | 'pdf' | 'text';

export interface Lesson {
  id: string;
  title: string;
  type: ContentType;
  url?: string;
  duration?: string;
  description?: string;
  isCompleted?: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  image: string;
  progress: number;
  owned?: boolean;
  author: string;
  duration: string;
  description?: string;
  lessons: Lesson[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}
