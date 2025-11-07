/**
 * Unit tests for Movement Engine
 * Testing position-based movement calculations
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  calculateMovement,
  getPathDetails,
  isSpecialSquare,
  getBusRecommendation,
  handleGoToJail,
  validateBoardData
} from '../../src/utils/movementEngine.js';

describe('Movement Engine', () => {
  beforeAll(() => {
    // Validate board data before running tests
    const validation = validateBoardData();
    expect(validation.valid).toBe(true);
    if (!validation.valid) {
      console.error('Board data validation errors:', validation.errors);
    }
  });

  describe('Normal Movement', () => {
    it('should calculate basic movement from GO', () => {
      const result = calculateMovement(0, 3, 4, 2);
      expect(result.type).toBe('normal');
      expect(result.startPosition).toBe(0);
      expect(result.destination).toBe(9); // 0 + 3 + 4 + 2 = 9
      expect(result.passedGO).toBe(false);
      expect(result.landedSquare.name).toBe('Connecticut Avenue');
    });

    it('should handle movement wrapping around the board', () => {
      const result = calculateMovement(37, 5, 2, 1);
      expect(result.destination).toBe(5); // (37 + 8) % 40 = 5
      expect(result.passedGO).toBe(true);
      expect(result.landedSquare.name).toBe('Reading Railroad');
    });

    it('should detect doubles', () => {
      const result = calculateMovement(0, 4, 4, 2);
      expect(result.isDoubles).toBe(true);
      expect(result.message).toContain('doubles');
    });

    it('should handle landing exactly on GO', () => {
      const result = calculateMovement(30, 5, 5, 0);
      expect(result.destination).toBe(0);
      expect(result.landedSquare.name).toBe('GO');
    });

    it('should generate correct path for short movement', () => {
      const result = calculateMovement(5, 2, 3, 0);
      expect(result.path).toEqual([5, 6, 7, 8, 9, 10]);
      expect(result.path.length).toBe(6); // Start + 5 moves
    });

    it('should generate correct path for wraparound movement', () => {
      const result = calculateMovement(38, 3, 2, 0);
      expect(result.destination).toBe(3); // (38 + 5) % 40
      expect(result.path).toEqual([38, 39, 0, 1, 2, 3]);
    });
  });

  describe('Mr. Monopoly Movement', () => {
    it('should move to next property from position 0', () => {
      const result = calculateMovement(0, 3, 4, 'Mr. Monopoly');
      expect(result.type).toBe('mr_monopoly');
      expect(result.normalDestination).toBe(7); // Where they would land normally
      // Next property from position 7 is position 8 (Vermont Avenue)
      expect(result.destination).toBe(8);
      expect(result.landedSquare.type).toBe('property');
    });

    it('should find next property after Chance square', () => {
      const result = calculateMovement(5, 1, 1, 'Mr. Monopoly');
      expect(result.normalDestination).toBe(7); // Chance square
      // Next property from 7 is 8 (Vermont Avenue)
      expect(result.destination).toBe(8);
      expect(result.landedSquare.name).toBe('Vermont Avenue');
    });

    it('should wrap around board to find next property', () => {
      const result = calculateMovement(37, 2, 1, 'Mr. Monopoly');
      // Normal would be 40 % 40 = 0 (GO)
      // Next property from GO is Mediterranean Avenue (1)
      expect(result.destination).toBe(1);
      expect(result.landedSquare.name).toBe('Mediterranean Avenue');
    });

    it('should include property ownership check action', () => {
      const result = calculateMovement(0, 3, 2, 'Mr. Monopoly');
      expect(result.specialActions).toContain('check_property_ownership');
    });

    it('should handle Mr. Monopoly with doubles', () => {
      const result = calculateMovement(0, 3, 3, 'Mr. Monopoly');
      expect(result.isDoubles).toBe(true);
      expect(result.type).toBe('mr_monopoly');
    });
  });

  describe('Bus Movement', () => {
    it('should provide two movement options', () => {
      const result = calculateMovement(0, 3, 4, 'Bus');
      expect(result.type).toBe('bus');
      expect(result.options).toBeDefined();
      expect(result.options.normal).toBeDefined();
      expect(result.options.bus).toBeDefined();
    });

    it('should calculate normal option correctly', () => {
      const result = calculateMovement(0, 3, 4, 'Bus');
      expect(result.options.normal.destination).toBe(7); // 0 + 3 + 4
      expect(result.options.normal.movement).toBe(7);
    });

    it('should calculate bus option to next bus ticket square', () => {
      const result = calculateMovement(0, 3, 4, 'Bus');
      // Next bus ticket from 0 is Reading Railroad (5)
      expect(result.options.bus.destination).toBe(5);
      expect(result.options.bus.landedSquare.hasBusTicket).toBe(true);
    });

    it('should find next bus ticket from middle of board', () => {
      const result = calculateMovement(10, 2, 3, 'Bus');
      // Next bus ticket from 10 is Pennsylvania Railroad (15)
      expect(result.options.bus.destination).toBe(15);
      expect(result.options.bus.landedSquare.name).toBe('Pennsylvania Railroad');
    });

    it('should wrap around to find next bus ticket', () => {
      const result = calculateMovement(36, 1, 1, 'Bus');
      // Next bus ticket from 36 is Short Line (35) - wait, we're past it
      // So it should be Reading Railroad (5)
      expect(result.options.bus.destination).toBe(5);
    });

    it('should detect pass GO for normal option', () => {
      const result = calculateMovement(38, 3, 2, 'Bus');
      expect(result.options.normal.passedGO).toBe(true);
      expect(result.options.normal.destination).toBe(3);
    });

    it('should detect pass GO for bus option', () => {
      const result = calculateMovement(38, 1, 1, 'Bus');
      expect(result.options.bus.passedGO).toBe(true);
      expect(result.options.bus.destination).toBe(5);
    });
  });

  describe('Question Mark Movement', () => {
    it('should move normally and flag chance card draw', () => {
      const result = calculateMovement(0, 3, 4, '?');
      expect(result.type).toBe('question_mark');
      expect(result.destination).toBe(7);
      expect(result.specialActions).toContain('draw_chance_card');
    });

    it('should include collect GO action when passing GO', () => {
      const result = calculateMovement(38, 3, 2, '?');
      expect(result.passedGO).toBe(true);
      expect(result.specialActions).toContain('collect_go');
      expect(result.specialActions).toContain('draw_chance_card');
    });

    it('should provide helpful tip', () => {
      const result = calculateMovement(5, 2, 3, '?');
      expect(result.tip).toBeDefined();
      expect(result.tip).toContain('Move first');
    });
  });

  describe('Pass GO Detection', () => {
    it('should detect passing GO from position 35', () => {
      const result = calculateMovement(35, 6, 3, 0);
      expect(result.passedGO).toBe(true);
      expect(result.specialActions).toContain('collect_go');
    });

    it('should detect passing GO from position 39', () => {
      const result = calculateMovement(39, 1, 1, 0);
      expect(result.passedGO).toBe(true);
    });

    it('should not detect pass GO for movement within first half', () => {
      const result = calculateMovement(5, 3, 4, 0);
      expect(result.passedGO).toBe(false);
    });

    it('should handle landing exactly on GO', () => {
      const result = calculateMovement(35, 3, 2, 0);
      expect(result.destination).toBe(0);
      expect(result.passedGO).toBe(true);
    });
  });

  describe('Special Squares', () => {
    it('should recognize Jail as special square', () => {
      expect(isSpecialSquare(10)).toBe(true);
    });

    it('should recognize Chance as special square', () => {
      expect(isSpecialSquare(7)).toBe(true);
      expect(isSpecialSquare(22)).toBe(true);
    });

    it('should recognize Community Chest as special square', () => {
      expect(isSpecialSquare(2)).toBe(true);
    });

    it('should recognize Tax squares as special', () => {
      expect(isSpecialSquare(4)).toBe(true); // Income Tax
      expect(isSpecialSquare(38)).toBe(true); // Luxury Tax
    });

    it('should not mark regular properties as special', () => {
      expect(isSpecialSquare(1)).toBe(false); // Mediterranean
      expect(isSpecialSquare(39)).toBe(false); // Boardwalk
    });
  });

  describe('Go To Jail', () => {
    it('should move directly to jail from any position', () => {
      const result = handleGoToJail(30);
      expect(result.type).toBe('go_to_jail');
      expect(result.destination).toBe(10);
      expect(result.specialActions).toContain('in_jail');
    });

    it('should not pass GO when going to jail', () => {
      const result = handleGoToJail(35);
      expect(result.passedGO).toBe(false);
    });

    it('should provide jail instructions', () => {
      const result = handleGoToJail(30);
      expect(result.message).toContain('Go directly to Jail');
      expect(result.tip).toContain('paying $50');
    });
  });

  describe('Path Generation', () => {
    it('should generate complete path including start and end', () => {
      const result = calculateMovement(0, 2, 3, 0);
      expect(result.path[0]).toBe(0); // Start
      expect(result.path[result.path.length - 1]).toBe(5); // End
    });

    it('should generate sequential path', () => {
      const result = calculateMovement(10, 3, 2, 0);
      expect(result.path).toEqual([10, 11, 12, 13, 14, 15]);
    });

    it('should generate wraparound path correctly', () => {
      const result = calculateMovement(38, 1, 2, 0);
      expect(result.path).toEqual([38, 39, 0, 1]);
    });

    it('should provide detailed square info for path', () => {
      const result = calculateMovement(0, 1, 1, 0);
      const pathDetails = getPathDetails(result.path);
      expect(pathDetails.length).toBe(result.path.length);
      expect(pathDetails[0].name).toBe('GO');
      expect(pathDetails[pathDetails.length - 1].name).toBe('Community Chest');
    });
  });

  describe('Bus Strategic Recommendations', () => {
    it('should recommend option with higher strategic value', () => {
      // Create mock squares
      const propertySquare = { type: 'property', name: 'Park Place' };
      const taxSquare = { type: 'tax', name: 'Luxury Tax' };

      const recommendation = getBusRecommendation(propertySquare, taxSquare);
      expect(recommendation.recommendation).toBe('normal');
    });

    it('should prefer properties over special squares', () => {
      const propertySquare = { type: 'property', name: 'Boardwalk' };
      const chanceSquare = { type: 'chance', name: 'Chance' };

      const recommendation = getBusRecommendation(propertySquare, chanceSquare);
      expect(recommendation.recommendation).toBe('normal');
    });
  });

  describe('Doubles Handling', () => {
    it('should detect doubles with same regular dice', () => {
      const result = calculateMovement(0, 5, 5, 1);
      expect(result.isDoubles).toBe(true);
    });

    it('should not detect doubles with different dice', () => {
      const result = calculateMovement(0, 3, 4, 1);
      expect(result.isDoubles).toBe(false);
    });

    it('should detect doubles with Mr. Monopoly', () => {
      const result = calculateMovement(0, 6, 6, 'Mr. Monopoly');
      expect(result.isDoubles).toBe(true);
    });

    it('should detect doubles with Bus', () => {
      const result = calculateMovement(0, 2, 2, 'Bus');
      expect(result.isDoubles).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle position 39 with small roll', () => {
      const result = calculateMovement(39, 1, 1, 0);
      expect(result.destination).toBe(1);
      expect(result.passedGO).toBe(true);
    });

    it('should handle position 39 with large roll', () => {
      const result = calculateMovement(39, 6, 6, 3);
      expect(result.destination).toBe(14); // (39 + 15) % 40
      expect(result.passedGO).toBe(true);
    });

    it('should handle minimal movement from GO', () => {
      const result = calculateMovement(0, 1, 1, 1);
      expect(result.destination).toBe(3);
      expect(result.passedGO).toBe(false);
    });

    it('should throw error for invalid position', () => {
      expect(() => calculateMovement(-1, 3, 4, 1)).toThrow('Invalid position');
      expect(() => calculateMovement(40, 3, 4, 1)).toThrow('Invalid position');
    });

    it('should throw error for invalid dice values', () => {
      expect(() => calculateMovement(0, 0, 3, 1)).toThrow('must be between 1 and 6');
      expect(() => calculateMovement(0, 3, 7, 1)).toThrow('must be between 1 and 6');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle Mr. Monopoly near end of board', () => {
      const result = calculateMovement(38, 1, 1, 'Mr. Monopoly');
      // Normal destination would be 0 (GO)
      // Next property is Mediterranean (1)
      expect(result.destination).toBe(1);
      expect(result.passedGO).toBe(true);
    });

    it('should handle Bus from position near last bus ticket', () => {
      const result = calculateMovement(33, 1, 1, 'Bus');
      // Normal: 35, Bus: next bus ticket is 35 (Short Line)
      expect(result.options.normal.destination).toBe(35);
      expect(result.options.bus.destination).toBe(35);
    });

    it('should handle Question Mark with wraparound', () => {
      const result = calculateMovement(37, 4, 3, '?');
      expect(result.destination).toBe(4); // (37 + 7) % 40
      expect(result.passedGO).toBe(true);
      expect(result.specialActions).toContain('collect_go');
      expect(result.specialActions).toContain('draw_chance_card');
    });

    it('should handle multiple laps around board (edge case)', () => {
      // This would only happen with multiple rolls, but test the math
      const result = calculateMovement(0, 6, 6, 3);
      expect(result.destination).toBe(15);
      expect(result.landedSquare.name).toBe('Pennsylvania Railroad');
    });
  });

  describe('Landing Square Details', () => {
    it('should provide complete property information', () => {
      const result = calculateMovement(0, 1, 1, 1);
      expect(result.landedSquare.name).toBe('Baltic Avenue');
      expect(result.landedSquare.type).toBe('property');
      expect(result.landedSquare.price).toBe(60);
      expect(result.landedSquare.color).toBe('brown');
    });

    it('should provide railroad information', () => {
      const result = calculateMovement(0, 3, 2, 0);
      expect(result.landedSquare.name).toBe('Reading Railroad');
      expect(result.landedSquare.type).toBe('railroad');
      expect(result.landedSquare.hasBusTicket).toBe(true);
    });

    it('should provide tax information', () => {
      const result = calculateMovement(0, 2, 2, 0);
      expect(result.landedSquare.name).toBe('Income Tax');
      expect(result.landedSquare.type).toBe('tax');
      expect(result.landedSquare.amount).toBe(200);
    });

    it('should provide special square information', () => {
      const result = calculateMovement(0, 5, 5, 0);
      expect(result.landedSquare.name).toBe('Jail / Just Visiting');
      expect(result.landedSquare.type).toBe('special');
    });
  });
});
