/**
 * 處理內部連結的 base path
 * 類似 NuxtLink 的功能，自動處理 base path
 */
export function withBase(href: string): string {
  // 如果是外部連結（http/https）或錨點連結，直接返回
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
    return href;
  }
  
  // 如果已經包含 base path，直接返回
  if (typeof import.meta.env.BASE_URL === 'string' && href.startsWith(import.meta.env.BASE_URL)) {
    return href;
  }
  
  // 為內部連結添加 base path
  const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, ''); // 移除尾部斜線
  const cleanHref = href.startsWith('/') ? href : `/${href}`;
  
  return `${basePath}${cleanHref}`;
}

/**
 * 檢查是否為外部連結
 */
export function isExternalLink(href: string): boolean {
  return href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
}

/**
 * 檢查是否為內部連結
 */
export function isInternalLink(href: string): boolean {
  return !isExternalLink(href) && !href.startsWith('#');
}