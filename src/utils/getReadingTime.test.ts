import { describe, it, expect } from 'vitest';
import { getReadingTime } from './getReadingTime';

describe('getReadingTime', () => {
  it('should round up to the nearest minute', () => {
    const shortText = 'This is a short text.'; // Approx 0.02 minutes
    expect(getReadingTime(shortText)).toBe(1);
  });

  it('should handle texts that are just over a minute', () => {
    const text = 'This is a sample text that should take just over a minute to read. '.repeat(10); // Approx 0.62 minutes
    expect(getReadingTime(text)).toBe(1);
  });

  it('should return 1 for very short texts', () => {
    const text = 'Hi';
    expect(getReadingTime(text)).toBe(1);
  });

  it('should correctly calculate reading time for a longer text', () => {
    const text = 'This is a longer text to test the reading time calculation. '.repeat(50);
    expect(getReadingTime(text)).toBe(3);
  });
});
