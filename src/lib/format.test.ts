import { describe, expect, it } from 'vitest';

import { formatCount, formatDecimal, formatDistance, formatTime, formatVnd } from './format';

describe('formatVnd', () => {
  it('uses the locale grouping separator', () => {
    expect(formatVnd(45000, 'vi')).toBe('45.000₫');
    expect(formatVnd(45000, 'en')).toBe('45,000₫');
  });
});

describe('formatDecimal', () => {
  it('uses the locale decimal separator', () => {
    expect(formatDecimal(4.7, 'vi')).toBe('4,7');
    expect(formatDecimal(4.7, 'en')).toBe('4.7');
  });

  it('keeps one decimal place on whole numbers', () => {
    expect(formatDecimal(4, 'vi')).toBe('4,0');
    expect(formatDecimal(4, 'en')).toBe('4.0');
  });
});

describe('formatCount', () => {
  it('groups thousands by locale', () => {
    expect(formatCount(1234, 'vi')).toBe('1.234');
    expect(formatCount(1234, 'en')).toBe('1,234');
  });
});

describe('formatDistance', () => {
  it('shows kilometres from 1000 m', () => {
    expect(formatDistance(1200, 'vi')).toBe('1,2 km');
    expect(formatDistance(1200, 'en')).toBe('1.2 km');
    expect(formatDistance(1000, 'en')).toBe('1.0 km');
  });

  it('shows rounded metres below 1000 m', () => {
    expect(formatDistance(350.4, 'vi')).toBe('350 m');
    expect(formatDistance(350.4, 'en')).toBe('350 m');
  });
});

describe('formatTime', () => {
  it('keeps the 24-hour clock in vi', () => {
    expect(formatTime('22:30', 'vi')).toBe('22:30');
    expect(formatTime('7:05', 'vi')).toBe('07:05');
  });

  it('uses the 12-hour clock in en', () => {
    expect(formatTime('22:30', 'en')).toBe('10:30 PM');
    expect(formatTime('07:05', 'en')).toBe('7:05 AM');
  });

  it('treats midnight and noon as 12', () => {
    expect(formatTime('00:15', 'en')).toBe('12:15 AM');
    expect(formatTime('12:00', 'en')).toBe('12:00 PM');
  });
});
