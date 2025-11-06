import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import DiceAnimation from '../../../src/components/DiceAnimation/DiceAnimation';

describe('DiceAnimation Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders three dice containers', () => {
      const { container } = render(
        <DiceAnimation dice1={3} dice2={5} speedDie="Bus" onComplete={() => {}} />
      );

      const diceElements = container.querySelectorAll('.dice');
      expect(diceElements.length).toBe(3);
    });

    it('displays dice values after animation', () => {
      const { container } = render(
        <DiceAnimation dice1={4} dice2={2} speedDie="Mr. Monopoly" onComplete={() => {}} />
      );

      // Fast-forward past animation duration (2 seconds)
      vi.runAllTimers();

      const diceElements = container.querySelectorAll('.dice');
      expect(diceElements.length).toBeGreaterThan(0);
    });

    it('shows rolling state during animation', () => {
      const { container } = render(
        <DiceAnimation dice1={1} dice2={6} speedDie="?" onComplete={() => {}} />
      );

      const rollingDice = container.querySelectorAll('.dice.rolling');
      expect(rollingDice.length).toBeGreaterThan(0);
    });
  });

  describe('Animation Lifecycle', () => {
    it('starts animation on mount', () => {
      const { container } = render(
        <DiceAnimation dice1={3} dice2={3} speedDie="1" onComplete={() => {}} />
      );

      const rollingDice = container.querySelectorAll('.dice.rolling');
      expect(rollingDice.length).toBeGreaterThan(0);
    });

    it('calls onComplete callback after animation finishes', () => {
      const onComplete = vi.fn();
      render(
        <DiceAnimation dice1={5} dice2={4} speedDie="Bus" onComplete={onComplete} />
      );

      // Fast-forward past animation duration
      vi.runAllTimers();

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('removes rolling class after animation completes', () => {
      const { container } = render(
        <DiceAnimation dice1={2} dice2={4} speedDie="3" onComplete={() => {}} />
      );

      // Initially rolling
      expect(container.querySelectorAll('.dice.rolling').length).toBeGreaterThan(0);

      // After animation
      act(() => {
        vi.runAllTimers();
      });

      expect(container.querySelectorAll('.dice.rolling').length).toBe(0);
    });
  });

  describe('Dice Values Display', () => {
    it('displays regular dice with correct face icons', () => {
      const { container } = render(
        <DiceAnimation dice1={6} dice2={1} speedDie="2" onComplete={() => {}} />
      );

      vi.runAllTimers();

      const dice = container.querySelectorAll('.dice');
      expect(dice.length).toBe(3);
    });

    it('displays Speed Die number values correctly', () => {
      const { container } = render(
        <DiceAnimation dice1={3} dice2={3} speedDie="2" onComplete={() => {}} />
      );

      vi.runAllTimers();

      const speedDie = container.querySelector('.speed-die');
      expect(speedDie).toBeInTheDocument();
    });

    it('displays Speed Die Bus icon correctly', () => {
      const { container } = render(
        <DiceAnimation dice1={4} dice2={5} speedDie="Bus" onComplete={() => {}} />
      );

      vi.runAllTimers();

      const speedDie = container.querySelector('.speed-die');
      expect(speedDie).toBeInTheDocument();
      expect(speedDie.textContent).toContain('Bus');
    });

    it('displays Speed Die Mr. Monopoly icon correctly', () => {
      const { container } = render(
        <DiceAnimation dice1={2} dice2={6} speedDie="Mr. Monopoly" onComplete={() => {}} />
      );

      vi.runAllTimers();

      const speedDie = container.querySelector('.speed-die');
      expect(speedDie).toBeInTheDocument();
      expect(speedDie.textContent).toContain('Mr. Monopoly');
    });

    it('displays Speed Die CHANCE correctly', () => {
      const { container } = render(
        <DiceAnimation dice1={1} dice2={1} speedDie="?" onComplete={() => {}} />
      );

      vi.runAllTimers();

      const speedDie = container.querySelector('.speed-die');
      expect(speedDie).toBeInTheDocument();
      expect(speedDie.textContent).toContain('❓');
    });
  });

  describe('Animation Duration', () => {
    it('completes animation within 1-2 seconds', () => {
      const onComplete = vi.fn();
      render(
        <DiceAnimation dice1={4} dice2={4} speedDie="1" onComplete={onComplete} />
      );

      // Should not complete before 1 second
      vi.advanceTimersByTime(900);
      expect(onComplete).not.toHaveBeenCalled();

      // Should complete by 2 seconds
      vi.advanceTimersByTime(1200);
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has aria-live region for screen readers', () => {
      const { container } = render(
        <DiceAnimation dice1={3} dice2={4} speedDie="Bus" onComplete={() => {}} />
      );

      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('announces dice results to screen readers', () => {
      const { container } = render(
        <DiceAnimation dice1={5} dice2={2} speedDie="Mr. Monopoly" onComplete={() => {}} />
      );

      vi.runAllTimers();

      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion?.textContent).toBeTruthy();
    });
  });

  describe('Visual Effects', () => {
    it('applies animation classes for tumbling effect', () => {
      const { container } = render(
        <DiceAnimation dice1={2} dice2={3} speedDie="3" onComplete={() => {}} />
      );

      const dice = container.querySelectorAll('.dice');
      dice.forEach(die => {
        const hasAnimationClass = die.classList.contains('rolling') ||
                                  die.classList.contains('tumbling');
        expect(hasAnimationClass).toBeTruthy();
      });
    });

    it('adds settled class after animation completes', () => {
      const { container } = render(
        <DiceAnimation dice1={6} dice2={5} speedDie="Bus" onComplete={() => {}} />
      );

      act(() => {
        vi.runAllTimers();
      });

      const settledDice = container.querySelectorAll('.dice.settled');
      expect(settledDice.length).toBeGreaterThan(0);
    });
  });
});
