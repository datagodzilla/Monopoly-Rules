import { describe, it, expect } from 'vitest';
import { getGameRule, isDoubles } from '../../src/utils/gameRules';

describe('Game Rules Logic', () => {
  describe('Regular Movement (Number + Number + Number)', () => {
    it('calculates total movement for three numbers', () => {
      const result = getGameRule(4, 5, '2');
      expect(result.category).toBe('Regular Movement');
      expect(result.total).toBe(11);
      expect(result.rule).toContain('Move 11 spaces');
      expect(result.tip).toBeTruthy();
    });

    it('handles minimum values (2+3+1)', () => {
      const result = getGameRule(2, 3, '1');
      expect(result.category).toBe('Regular Movement');
      expect(result.total).toBe(6);
      expect(result.rule).toContain('Move 6 spaces');
    });

    it('handles maximum non-doubles values (6+5+3)', () => {
      const result = getGameRule(6, 5, '3');
      expect(result.category).toBe('Regular Movement');
      expect(result.total).toBe(14);
      expect(result.rule).toContain('Move 14 spaces');
    });
  });

  describe('Mr. Monopoly Symbol', () => {
    it('provides rule for Mr. Monopoly with regular dice', () => {
      const result = getGameRule(3, 4, 'Mr. Monopoly');
      expect(result.category).toBe('Mr. Monopoly');
      expect(result.total).toBe(7);
      expect(result.rule).toContain('Move 7 spaces');
      expect(result.rule).toContain('next unowned property');
      expect(result.tip).toContain('properties you don\'t own');
    });

    it('handles low total with Mr. Monopoly', () => {
      const result = getGameRule(1, 2, 'Mr. Monopoly');
      expect(result.category).toBe('Mr. Monopoly');
      expect(result.total).toBe(3);
    });

    it('handles high total with Mr. Monopoly', () => {
      const result = getGameRule(6, 5, 'Mr. Monopoly');
      expect(result.category).toBe('Mr. Monopoly');
      expect(result.total).toBe(11);
    });
  });

  describe('Bus Symbol', () => {
    it('provides bus choice rule', () => {
      const result = getGameRule(3, 4, 'Bus');
      expect(result.category).toBe('Bus');
      expect(result.total).toBe(7);
      expect(result.rule).toContain('Move 7 spaces');
      expect(result.rule).toContain('next Bus Ticket');
      expect(result.tip).toContain('bus');
    });

    it('handles low bus total', () => {
      const result = getGameRule(1, 2, 'Bus');
      expect(result.category).toBe('Bus');
      expect(result.total).toBe(3);
    });

    it('handles high bus total', () => {
      const result = getGameRule(6, 5, 'Bus');
      expect(result.category).toBe('Bus');
      expect(result.total).toBe(11);
    });
  });

  describe('CHANCE Symbol', () => {
    it('provides Chance card rule', () => {
      const result = getGameRule(3, 4, '?');
      expect(result.category).toBe('CHANCE');
      expect(result.total).toBe(7);
      expect(result.rule).toContain('Move 7 spaces');
      expect(result.rule).toContain('Chance card');
      expect(result.tip).toContain('Move first');
    });

    it('handles any total with question mark', () => {
      const result = getGameRule(1, 6, '?');
      expect(result.category).toBe('CHANCE');
      expect(result.total).toBe(7);
    });
  });

  describe('Doubles Detection', () => {
    it('detects doubles with speed die number', () => {
      expect(isDoubles(3, 3, '1')).toBe(true);
      expect(isDoubles(5, 5, '2')).toBe(true);
      expect(isDoubles(6, 6, '3')).toBe(true);
    });

    it('detects doubles with Bus', () => {
      expect(isDoubles(4, 4, 'Bus')).toBe(true);
    });

    it('detects doubles with Mr. Monopoly', () => {
      expect(isDoubles(2, 2, 'Mr. Monopoly')).toBe(true);
    });

    it('detects doubles with question mark', () => {
      expect(isDoubles(5, 5, '?')).toBe(true);
    });

    it('returns false for non-doubles', () => {
      expect(isDoubles(3, 4, '1')).toBe(false);
      expect(isDoubles(1, 6, 'Bus')).toBe(false);
      expect(isDoubles(2, 5, 'Mr. Monopoly')).toBe(false);
    });
  });

  describe('Doubles Scenarios', () => {
    it('provides doubles rule with number speed die', () => {
      const result = getGameRule(3, 3, '2');
      expect(result.category).toBe('Doubles');
      expect(result.isDoubles).toBe(true);
      expect(result.rule).toContain('roll again');
      expect(result.tip).toContain('Doubles are lucky');
    });

    it('provides doubles rule with Bus', () => {
      const result = getGameRule(5, 5, 'Bus');
      expect(result.category).toBe('Doubles');
      expect(result.isDoubles).toBe(true);
    });

    it('provides doubles rule with Mr. Monopoly', () => {
      const result = getGameRule(4, 4, 'Mr. Monopoly');
      expect(result.category).toBe('Doubles');
      expect(result.isDoubles).toBe(true);
    });

    it('warns about three doubles leading to jail', () => {
      const result = getGameRule(6, 6, '1');
      expect(result.rule).toContain('roll again');
      expect(result.tip).toContain('three in a row');
      expect(result.tip).toContain('Jail');
    });
  });

  describe('Complex Scenarios', () => {
    it('prioritizes doubles over regular movement', () => {
      const result = getGameRule(4, 4, '2');
      expect(result.category).toBe('Doubles');
      expect(result.isDoubles).toBe(true);
    });

    it('prioritizes doubles over Mr. Monopoly', () => {
      const result = getGameRule(3, 3, 'Mr. Monopoly');
      expect(result.category).toBe('Doubles');
      expect(result.isDoubles).toBe(true);
    });

    it('prioritizes doubles over Bus', () => {
      const result = getGameRule(5, 5, 'Bus');
      expect(result.category).toBe('Doubles');
      expect(result.isDoubles).toBe(true);
    });

    it('prioritizes doubles over CHANCE', () => {
      const result = getGameRule(2, 2, '?');
      expect(result.category).toBe('Doubles');
      expect(result.isDoubles).toBe(true);
    });
  });

  describe('Result Structure', () => {
    it('returns consistent structure for all rules', () => {
      const result = getGameRule(3, 4, 'Bus');

      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('rule');
      expect(result).toHaveProperty('tip');
      expect(result).toHaveProperty('isDoubles');

      expect(typeof result.category).toBe('string');
      expect(typeof result.total).toBe('number');
      expect(typeof result.rule).toBe('string');
      expect(typeof result.tip).toBe('string');
      expect(typeof result.isDoubles).toBe('boolean');
    });

    it('includes icon for categorization', () => {
      const result = getGameRule(3, 4, 'Bus');
      expect(result).toHaveProperty('icon');
      expect(typeof result.icon).toBe('string');
    });
  });
});
