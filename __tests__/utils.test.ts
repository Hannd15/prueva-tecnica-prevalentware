import { formatDate, formatCurrency } from '@/lib/utils';

describe('Utility functions', () => {
  describe('formatDate', () => {
    it('should format a date correctly to DD/MM/YYYY', () => {
      const date = new Date('2023-12-25T00:00:00Z');
      expect(formatDate(date)).toBe('25/12/2023');
    });

    it('should return "-" for invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('-');
    });
  });

  describe('formatCurrency', () => {
    it('should format a number as COP currency', () => {
      // Note: Intl.NumberFormat might have different whitespace characters depending on the environment
      // We can check if it contains the number and the currency symbol
      const formatted = formatCurrency(15000);
      expect(formatted).toContain('15.000');
      expect(formatted).toContain('$');
    });
  });
});
