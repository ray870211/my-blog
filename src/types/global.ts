export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
}

export interface NavigationItem {
  name: string;
  href: string;
  external?: boolean;
}