import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RulesDisplay from '../../../src/components/RulesDisplay/RulesDisplay';

describe('RulesDisplay Component', () => {
  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      const gameRule = {
        category: 'Regular Movement',
        total: 10,
        rule: 'Move 10 spaces forward',
        tip: 'Count carefully!',
        icon: '🎲',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText(/Move 10 spaces forward/i)).toBeInTheDocument();
    });

    it('displays category with icon', () => {
      const gameRule = {
        category: 'Bus',
        total: 8,
        rule: 'Choose bus or normal movement',
        tip: 'Use the bus wisely!',
        icon: '🚌',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText('Bus')).toBeInTheDocument();
      expect(screen.getByText('🚌')).toBeInTheDocument();
    });
  });

  describe('Rule Display', () => {
    it('displays the rule text', () => {
      const gameRule = {
        category: 'Mr. Monopoly',
        total: 7,
        rule: 'Move 7 spaces, then go to next unowned property',
        tip: 'Look for properties!',
        icon: '🎩',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText(/Move 7 spaces/i)).toBeInTheDocument();
      expect(screen.getByText(/next unowned property/i)).toBeInTheDocument();
    });

    it('displays the total spaces to move', () => {
      const gameRule = {
        category: 'Regular Movement',
        total: 12,
        rule: 'Move 12 spaces',
        tip: 'Count carefully!',
        icon: '🎲',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  describe('Tip Display', () => {
    it('displays the helpful tip', () => {
      const gameRule = {
        category: 'CHANCE',
        total: 5,
        rule: 'Move 5 spaces then draw Chance',
        tip: 'Move first, then draw your Chance card!',
        icon: '❓',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText(/Move first, then draw your Chance card!/i)).toBeInTheDocument();
    });

    it('renders tip in a dedicated section', () => {
      const gameRule = {
        category: 'Regular Movement',
        total: 8,
        rule: 'Move 8 spaces',
        tip: 'Count carefully and move your piece!',
        icon: '🎲',
        isDoubles: false
      };

      const { container } = render(<RulesDisplay gameRule={gameRule} />);
      const tipSection = container.querySelector('.tip-section');
      expect(tipSection).toBeInTheDocument();
    });
  });

  describe('Doubles Indicator', () => {
    it('shows doubles indicator when isDoubles is true', () => {
      const gameRule = {
        category: 'Doubles',
        total: 10,
        rule: 'You rolled doubles! Move 10 spaces then roll again!',
        tip: 'Doubles are lucky!',
        icon: '🎲🎲',
        isDoubles: true
      };

      const { container } = render(<RulesDisplay gameRule={gameRule} />);
      const doublesIndicator = container.querySelector('.doubles-indicator');
      expect(doublesIndicator).toBeInTheDocument();
      expect(doublesIndicator.textContent).toContain('Roll Again');
    });

    it('does not show doubles indicator when isDoubles is false', () => {
      const gameRule = {
        category: 'Regular Movement',
        total: 8,
        rule: 'Move 8 spaces',
        tip: 'Count carefully!',
        icon: '🎲',
        isDoubles: false
      };

      const { container } = render(<RulesDisplay gameRule={gameRule} />);
      const doublesIndicator = container.querySelector('.doubles-indicator');
      expect(doublesIndicator).not.toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('applies category-specific styling', () => {
      const gameRule = {
        category: 'Mr. Monopoly',
        total: 7,
        rule: 'Special rule',
        tip: 'Helpful tip',
        icon: '🎩',
        isDoubles: false
      };

      const { container } = render(<RulesDisplay gameRule={gameRule} />);
      const ruleCard = container.querySelector('.rules-display');
      expect(ruleCard).toBeInTheDocument();
    });

    it('has proper sections for rule and tip', () => {
      const gameRule = {
        category: 'Bus',
        total: 6,
        rule: 'Choose your path',
        tip: 'Think strategically!',
        icon: '🚌',
        isDoubles: false
      };

      const { container } = render(<RulesDisplay gameRule={gameRule} />);
      expect(container.querySelector('.rule-section')).toBeInTheDocument();
      expect(container.querySelector('.tip-section')).toBeInTheDocument();
    });
  });

  describe('All Rule Categories', () => {
    it('handles Regular Movement correctly', () => {
      const gameRule = {
        category: 'Regular Movement',
        total: 9,
        rule: 'Move 9 spaces forward',
        tip: 'Count carefully!',
        icon: '🎲',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText('Regular Movement')).toBeInTheDocument();
    });

    it('handles Mr. Monopoly correctly', () => {
      const gameRule = {
        category: 'Mr. Monopoly',
        total: 5,
        rule: 'Go to next unowned property',
        tip: 'Look for properties!',
        icon: '🎩',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText('Mr. Monopoly')).toBeInTheDocument();
    });

    it('handles Bus correctly', () => {
      const gameRule = {
        category: 'Bus',
        total: 7,
        rule: 'Choose bus or normal',
        tip: 'Use the bus wisely!',
        icon: '🚌',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText('Bus')).toBeInTheDocument();
    });

    it('handles CHANCE correctly', () => {
      const gameRule = {
        category: 'CHANCE',
        total: 6,
        rule: 'Draw a Chance card',
        tip: 'Move first!',
        icon: '❓',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText('CHANCE')).toBeInTheDocument();
    });

    it('handles Doubles correctly', () => {
      const gameRule = {
        category: 'Doubles',
        total: 8,
        rule: 'Roll again!',
        tip: 'Lucky you!',
        icon: '🎲🎲',
        isDoubles: true
      };

      render(<RulesDisplay gameRule={gameRule} />);
      expect(screen.getByText('Doubles')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      const gameRule = {
        category: 'Regular Movement',
        total: 10,
        rule: 'Move 10 spaces',
        tip: 'Count carefully!',
        icon: '🎲',
        isDoubles: false
      };

      render(<RulesDisplay gameRule={gameRule} />);
      const heading = screen.getByRole('heading', { name: /Regular Movement/i });
      expect(heading).toBeInTheDocument();
    });

    it('has aria labels for sections', () => {
      const gameRule = {
        category: 'Bus',
        total: 7,
        rule: 'Choose your path',
        tip: 'Think wisely!',
        icon: '🚌',
        isDoubles: false
      };

      const { container } = render(<RulesDisplay gameRule={gameRule} />);
      const ruleSection = container.querySelector('[aria-label*="rule"]');
      expect(ruleSection).toBeInTheDocument();
    });
  });
});
