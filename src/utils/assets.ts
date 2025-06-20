/**
 * 處理靜態資源路徑，自動添加 base path
 * 用於 public/ 目錄下的檔案（favicon、圖片、字體等）
 */
export function withBaseAsset(path: string): string {
  // 如果是外部 URL，直接返回
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }
  
  // 如果已經包含 base path，直接返回
  if (typeof import.meta.env.BASE_URL === 'string' && path.startsWith(import.meta.env.BASE_URL)) {
    return path;
  }
  
  // 確保路徑以 / 開頭
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 添加 base path
  const basePath = import.meta.env.BASE_URL || '/';
  return basePath + cleanPath;
}

/**
 * 常用靜態資源的便捷函數
 */
export const assets = {
  favicon: () => withBaseAsset('/favicon.svg'),
  image: (path: string) => withBaseAsset(`/images/${path}`),
  logo: () => withBaseAsset('/logo.png'),
} as const;