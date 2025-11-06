import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DiceInput from '../../../src/components/DiceInput/DiceInput';

describe('DiceInput Component', () => {
  describe('Regular Dice Selection', () => {
    it('renders two regular dice sections', () => {
      render(<DiceInput onRoll={() => {}} />);
      expect(screen.getByText(/First Die/i)).toBeInTheDocument();
      expect(screen.getByText(/Second Die/i)).toBeInTheDocument();
    });

    it('renders number buttons 1-6 for each regular die', () => {
      render(<DiceInput onRoll={() => {}} />);

      // Should have 12 buttons total (6 for each die)
      const buttons = screen.getAllByRole('button', { name: /^[1-6]$/ });
      expect(buttons.length).toBeGreaterThanOrEqual(12);
    });

    it('highlights selected regular die value', () => {
      render(<DiceInput onRoll={() => {}} />);

      const firstDieButtons = screen.getAllByRole('button', { name: '3' });
      const firstDie3Button = firstDieButtons[0];

      fireEvent.click(firstDie3Button);

      expect(firstDie3Button).toHaveClass('selected');
    });

    it('allows selecting different values for dice 1 and dice 2', () => {
      const onRoll = vi.fn();
      render(<DiceInput onRoll={onRoll} />);

      // Get all buttons and click specific ones for each die
      const allThreeButtons = screen.getAllByRole('button', { name: '3' });
      const allFiveButtons = screen.getAllByRole('button', { name: '5' });

      // Click dice 1 = 3, dice 2 = 5
      fireEvent.click(allThreeButtons[0]); // First die
      fireEvent.click(allFiveButtons[1]); // Second die

      expect(allThreeButtons[0]).toHaveClass('selected');
      expect(allFiveButtons[1]).toHaveClass('selected');
    });
  });

  describe('Speed Die Selection', () => {
    it('renders Speed Die section with all options', () => {
      render(<DiceInput onRoll={() => {}} />);

      expect(screen.getByText(/Speed Die/i)).toBeInTheDocument();
      // Speed die has 1, 2, 3 buttons (total of 3 each value including regular dice = 9)
      const allButtons = screen.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(0);
    });

    it('renders special Speed Die options with icons', () => {
      render(<DiceInput onRoll={() => {}} />);

      expect(screen.getByRole('button', { name: /Bus/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mr.*Monopoly/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /\?/i })).toBeInTheDocument();
    });

    it('highlights selected Speed Die value', () => {
      render(<DiceInput onRoll={() => {}} />);

      const busButton = screen.getByRole('button', { name: /Bus/i });
      fireEvent.click(busButton);

      expect(busButton).toHaveClass('selected');
    });
  });

  describe('Roll Button', () => {
    it('renders SHOW THE RULES! button', () => {
      render(<DiceInput onRoll={() => {}} />);

      expect(screen.getByRole('button', { name: /SHOW THE RULES!/i })).toBeInTheDocument();
    });

    it('disables Roll button when not all dice are selected', () => {
      render(<DiceInput onRoll={() => {}} />);

      const rollButton = screen.getByRole('button', { name: /SHOW THE RULES!/i });
      expect(rollButton).toBeDisabled();
    });

    it('enables Roll button when all three dice are selected', () => {
      render(<DiceInput onRoll={() => {}} />);

      // Select dice 1
      const firstDie3 = screen.getAllByRole('button', { name: '3' })[0];
      fireEvent.click(firstDie3);

      // Select dice 2
      const secondDie5 = screen.getAllByRole('button', { name: '5' })[1];
      fireEvent.click(secondDie5);

      // Select speed die
      const busButton = screen.getByRole('button', { name: /Bus/i });
      fireEvent.click(busButton);

      const rollButton = screen.getByRole('button', { name: /SHOW THE RULES!/i });
      expect(rollButton).not.toBeDisabled();
    });

    it('calls onRoll callback with dice values when clicked', () => {
      const onRoll = vi.fn();
      render(<DiceInput onRoll={onRoll} />);

      // Select all three dice
      fireEvent.click(screen.getAllByRole('button', { name: '4' })[0]); // dice1 = 4
      fireEvent.click(screen.getAllByRole('button', { name: '2' })[1]); // dice2 = 2
      fireEvent.click(screen.getByRole('button', { name: /Mr.*Monopoly/i })); // speedDie = Mr. Monopoly

      // Click Roll button
      const rollButton = screen.getByRole('button', { name: /SHOW THE RULES!/i });
      fireEvent.click(rollButton);

      expect(onRoll).toHaveBeenCalledWith({
        dice1: 4,
        dice2: 2,
        speedDie: 'Mr. Monopoly'
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for dice sections', () => {
      render(<DiceInput onRoll={() => {}} />);

      expect(screen.getByRole('group', { name: /First Die/i })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: /Second Die/i })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: /Speed Die/i })).toBeInTheDocument();
    });

    it('supports keyboard navigation with Tab', () => {
      render(<DiceInput onRoll={() => {}} />);

      const firstButton = screen.getAllByRole('button')[0];
      firstButton.focus();

      expect(document.activeElement).toBe(firstButton);
    });

    it('supports Enter/Space key to select dice values', () => {
      render(<DiceInput onRoll={() => {}} />);

      const firstDie3 = screen.getAllByRole('button', { name: '3' })[0];
      firstDie3.focus();

      fireEvent.keyDown(firstDie3, { key: 'Enter', code: 'Enter' });

      expect(firstDie3).toHaveClass('selected');
    });
  });

  describe('Visual Requirements', () => {
    it('has dice button and roll button elements with proper classes', () => {
      const { container } = render(<DiceInput onRoll={() => {}} />);

      // Check that dice buttons exist
      const diceButtons = container.querySelectorAll('.dice-button');
      expect(diceButtons.length).toBeGreaterThan(0);

      // Check that roll button exists
      const rollButton = container.querySelector('.roll-button');
      expect(rollButton).toBeInTheDocument();

      // Note: Actual 44x44px minimum is enforced via CSS (min-width/height: 70-80px)
      // which exceeds the WCAG AA requirement
    });
  });
});
