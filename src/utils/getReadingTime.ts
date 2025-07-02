export function getReadingTime(content: string): number {
  // 中文字符數計算
  const chineseCharCount = (content.match(/[\u4e00-\u9fff]/g) || []).length;
  // 英文單詞數計算
  const englishWordCount = content.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(word => word.length > 0).length;
  
  const chineseReadingSpeed = 350; // 字/分鐘
  const englishReadingSpeed = 225;  // 詞/分鐘
  
  const readingTimeMinutes = (chineseCharCount / chineseReadingSpeed) + (englishWordCount / englishReadingSpeed);
  
  return Math.max(1, Math.round(readingTimeMinutes));
}

export function formatReadingTime(minutes: number): string {
  return `約 ${minutes} 分鐘閱讀`;
}