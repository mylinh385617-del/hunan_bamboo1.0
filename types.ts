
export enum EraType {
  WARRING_STATES = '战国',
  QIN = '秦',
  WESTERN_HAN = '西汉',
  EASTERN_HAN = '东汉',
  THREE_KINGDOMS_WU = '三国吴'
}

export interface ArticleImage {
  url: string;
  caption: string;
  type: 'color' | 'infrared' | 'blackwhite';
}

export interface Article {
  id: string;
  title: string;
  author?: string;
  publishDate?: string;
  views?: number;
  content: string; // HTML content support
  summary?: string;
  images?: ArticleImage[]; // Optional separate images for gallery view
  tags?: string[]; // New: Tags for the article
  categoryId?: string; // Helper for flattening
  eraId?: string; // Helper for flattening
}

export interface CollectionCategory {
  id: string;
  name: string;
  description?: string;
  articles: Article[];
}

export interface Era {
  id: string;
  name: EraType;
  categories: CollectionCategory[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface GlobalTag {
  id: string;
  name: string;
  isSystem?: boolean; // If true, it is derived from categories and cannot be deleted
}
