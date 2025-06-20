export interface BlogPost {
  title: string;
  description: string;
  date: Date;
  tags?: string[];
  draft?: boolean;
  author?: string;
  coverImage?: string;
  readingTime?: number;
}

export interface Author {
  name: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    github?: string;
    email?: string;
  };
}

export interface Tag {
  name: string;
  slug: string;
  count?: number;
}