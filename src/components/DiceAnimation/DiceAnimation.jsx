import { useState, useEffect } from 'react';
import './DiceAnimation.css';

const DiceAnimation = ({ dice1, dice2, speedDie, onComplete }) => {
  const [isRolling, setIsRolling] = useState(true);
  const [isSettled, setIsSettled] = useState(false);

  // Animation duration (1.8 seconds)
  const ANIMATION_DURATION = 1800;

  useEffect(() => {
    // Start animation on mount
    setIsRolling(true);
    setIsSettled(false);

    // Complete animation after duration
    const timer = setTimeout(() => {
      setIsRolling(false);
      setIsSettled(true);

      // Call completion callback after a brief settle delay
      setTimeout(() => {
        onComplete?.();
      }, 300);
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [dice1, dice2, speedDie, onComplete]);

  // Render 3D dice face with dots
  const renderDiceFace = (value) => {
    const dotPositions = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };

    const positions = dotPositions[value] || [];

    return (
      <div className="dice-face-3d">
        {positions.map((pos, idx) => (
          <span key={idx} className={`dice-dot ${pos}`}></span>
        ))}
      </div>
    );
  };

  // Speed Die icon helper
  const getSpeedDieDisplay = (value) => {
    const displays = {
      'Bus': { icon: '🚍', label: 'Bus' },
      'Mr. Monopoly': { icon: '🎩', label: 'Mr. Monopoly' },
      '?': { icon: '❓', label: '' }
    };
    return displays[value] || { icon: null, label: value };
  };

  const speedDieDisplay = getSpeedDieDisplay(speedDie);

  return (
    <div className="dice-animation-container">
      <div className="dice-stage" role="main" aria-label="Dice rolling animation">
        {/* First Regular Die */}
        <div
          className={`dice regular-die ${isRolling ? 'rolling tumbling' : ''} ${isSettled ? 'settled' : ''}`}
          aria-label={`First die showing ${dice1}`}
        >
          <div className="dice-face">
            {renderDiceFace(dice1)}
          </div>
        </div>

        {/* Second Regular Die */}
        <div
          className={`dice regular-die ${isRolling ? 'rolling tumbling' : ''} ${isSettled ? 'settled' : ''}`}
          aria-label={`Second die showing ${dice2}`}
          style={{ animationDelay: '0.1s' }}
        >
          <div className="dice-face">
            {renderDiceFace(dice2)}
          </div>
        </div>

        {/* Speed Die */}
        <div
          className={`dice speed-die ${isRolling ? 'rolling tumbling' : ''} ${isSettled ? 'settled' : ''}`}
          aria-label={`Speed die showing ${speedDie}`}
          style={{ animationDelay: '0.2s' }}
        >
          <div className="dice-face">
            {speedDieDisplay.icon ? (
              <>
                <span className="dice-icon speed-icon">{speedDieDisplay.icon}</span>
                {speedDieDisplay.label && <span className="dice-label">{speedDieDisplay.label}</span>}
              </>
            ) : (
              renderDiceFace(parseInt(speedDie))
            )}
          </div>
        </div>
      </div>

      {/* Screen reader announcement */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {isRolling
          ? 'Rolling dice...'
          : `Dice rolled: ${dice1}, ${dice2}, and ${speedDie}`
        }
      </div>

      {/* Visual feedback */}
      {isSettled && (
        <div className="result-summary">
          <p className="result-text">
            You rolled: <strong>{dice1}</strong> + <strong>{dice2}</strong> + <strong>{speedDie}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default DiceAnimation;
