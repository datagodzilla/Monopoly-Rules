import { useState } from 'react';
import './DiceInput.css';

const DiceInput = ({ onRoll }) => {
  const [dice1, setDice1] = useState(null);
  const [dice2, setDice2] = useState(null);
  const [speedDie, setSpeedDie] = useState(null);

  const regularDiceValues = [1, 2, 3, 4, 5, 6];
  const speedDieValues = [
    { value: 1, label: '1', icon: null },
    { value: 2, label: '2', icon: null },
    { value: 3, label: '3', icon: null },
    { value: 'Bus', label: 'Bus', icon: '🚍' },
    { value: 'Mr. Monopoly', label: 'Mr. Monopoly', icon: '🎩' },
    { value: '?', label: '', icon: '❓' }
  ];

  const handleRoll = () => {
    if (dice1 !== null && dice2 !== null && speedDie !== null) {
      onRoll({ dice1, dice2, speedDie });
    }
  };

  const isRollDisabled = dice1 === null || dice2 === null || speedDie === null;

  // Render 3D dice face with dots and number
  const renderDiceFace = (value) => {
    const dots = [];

    // Define dot positions for each dice value
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
      <div className="dice-container">
        <div className="dice-face-3d">
          {positions.map((pos, idx) => (
            <span key={idx} className={`dice-dot ${pos}`}></span>
          ))}
        </div>
        <span className="dice-value-label">{value}</span>
      </div>
    );
  };

  return (
    <div className="dice-input">
      <h1 className="dice-input__main-title">WELCOME TO MEGA MONOPOLY RULES!!</h1>
      <h2 className="dice-input__subtitle">Roll the Dice!</h2>

      {/* First Regular Die */}
      <div className="dice-section" role="group" aria-label="First Die">
        <h3 className="dice-section__title">First Die</h3>
        <div className="dice-buttons">
          {regularDiceValues.map((value) => (
            <button
              key={`dice1-${value}`}
              className={`dice-button ${dice1 === value ? 'selected' : ''}`}
              onClick={() => setDice1(value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDice1(value);
                }
              }}
              aria-label={`${value}`}
              aria-pressed={dice1 === value}
            >
              {renderDiceFace(value)}
            </button>
          ))}
        </div>
      </div>

      {/* Second Regular Die */}
      <div className="dice-section" role="group" aria-label="Second Die">
        <h3 className="dice-section__title">Second Die</h3>
        <div className="dice-buttons">
          {regularDiceValues.map((value) => (
            <button
              key={`dice2-${value}`}
              className={`dice-button ${dice2 === value ? 'selected' : ''}`}
              onClick={() => setDice2(value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDice2(value);
                }
              }}
              aria-label={`${value}`}
              aria-pressed={dice2 === value}
            >
              {renderDiceFace(value)}
            </button>
          ))}
        </div>
      </div>

      {/* Speed Die */}
      <div className="dice-section" role="group" aria-label="Speed Die">
        <h3 className="dice-section__title">Speed Die</h3>
        <div className="dice-buttons speed-die-buttons">
          {speedDieValues.map((item) => (
            <button
              key={`speed-${item.value}`}
              className={`dice-button speed-die-button ${speedDie === item.value ? 'selected' : ''}`}
              onClick={() => setSpeedDie(item.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSpeedDie(item.value);
                }
              }}
              aria-label={item.label || item.value}
              aria-pressed={speedDie === item.value}
            >
              {item.icon ? (
                <>
                  <span className="dice-button__icon">{item.icon}</span>
                  {item.label && <span className="dice-button__label">{item.label}</span>}
                </>
              ) : (
                renderDiceFace(item.value)
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Roll Button */}
      <div className="roll-button-container">
        <button
          className="roll-button"
          onClick={handleRoll}
          disabled={isRollDisabled}
          aria-label="SHOW THE RULES!"
        >
          SHOW THE RULES! 🎲
        </button>
      </div>

      {/* Visual feedback for selections */}
      {!isRollDisabled && (
        <div className="selection-summary" aria-live="polite">
          <p>
            Selected: Dice 1 = {dice1}, Dice 2 = {dice2}, Speed Die = {speedDie}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiceInput;
