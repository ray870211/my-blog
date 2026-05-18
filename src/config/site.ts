import type { NavigationItem } from '@/types/global';

export const SITE = {
  name: "Ray's Blog",
  shortName: 'Ray blog',
  title: "Ray's Blog - 技術分享與生活記錄",
  description: '歡迎來到我的個人部落格，分享技術心得、生活感悟和學習筆記。',
  rssDescription: '分享技術心得與生活感悟的個人部落格',
  author: 'Ray',
  locale: 'zh-TW',
  ogLocale: 'zh_TW',
  ogLocaleAlternate: 'en_US',
  url: 'https://ray0211.me',
  themeColor: '#2563eb',
  keywords: 'Ray, 程式設計, 開發, 技術分享, 軟體工程, 前端, 後端, DevOps',
} as const;

export type SocialIcon = 'github' | 'linkedin' | 'x';

export const SOCIAL: ReadonlyArray<{
  name: string;
  href: string;
  icon: SocialIcon;
}> = [
  { name: 'GitHub', href: 'https://github.com/ray870211', icon: 'github' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/ray0211/', icon: 'linkedin' },
  { name: 'X', href: 'https://x.com/_ruiii__', icon: 'x' },
];

export const SIDEBAR_NAV: ReadonlyArray<NavigationItem> = [
  { name: '關於我', href: '/about' },
  { name: 'RSS 訂閱', href: '/rss.xml', external: true },
];

export const READING_SPEED = {
  chinesePerMinute: 350,
  englishPerMinute: 225,
} as const;
