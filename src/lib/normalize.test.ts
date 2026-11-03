import { describe, expect, it } from 'vitest';

import { normalizeVi } from './normalize';

describe('normalizeVi', () => {
  it('lower-cases and strips diacritics', () => {
    expect(normalizeVi('Phường Võ Thị Sáu')).toBe('phuong vo thi sau');
  });

  it('maps đ to d in both cases', () => {
    expect(normalizeVi('Đường Đồng Khởi')).toBe('duong dong khoi');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeVi('  Cà phê ')).toBe('ca phe');
  });
});
