export type ToolCategory =
  | 'pdf'
  | 'image'
  | 'calculator'
  | 'converter'
  | 'text'
  | 'dev'
  | 'color'
  | 'datetime';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Tool {
  id: string;
  name: string;
  categoryId: ToolCategory;
  categoryName: string;
  description: string;
  longDescription?: string;
  icon: string; // Lucide icon name
  badge?: string;
  keywords: string[];
  popular?: boolean;
  privacyNotice?: string;
  isComingSoon?: boolean;
}
