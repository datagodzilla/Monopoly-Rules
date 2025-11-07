/**
 * Position Input Component
 * Allows users to select their current position on the Monopoly board
 */

import { useState } from 'react';
import './PositionInput.css';
import boardData from '../../data/boardSquares.json';

const PositionInput = ({ currentPosition, onPositionChange, showVisual = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMode, setInputMode] = useState('dropdown'); // 'dropdown' or 'visual'

  const squares = boardData.squares;

  const handlePositionSelect = (position) => {
    onPositionChange(position);
  };

  const handleClear = () => {
    onPositionChange(null);
  };

  const getSquareColor = (square) => {
    const colorMap = {
      brown: '#8B4513',
      lightblue: '#87CEEB',
      pink: '#FF1493',
      orange: '#FFA500',
      red: '#FF0000',
      yellow: '#FFFF00',
      green: '#00A550',
      darkblue: '#0000FF'
    };
    return colorMap[square.color] || '#CCCCCC';
  };

  const getSquareIcon = (square) => {
    if (square.type === 'special') {
      if (square.name === 'GO') return '🚀';
      if (square.name === 'Jail / Just Visiting') return '🔒';
      if (square.name === 'Free Parking') return '🅿️';
      if (square.name === 'Go To Jail') return '👮';
    }
    if (square.type === 'chance') return '❓';
    if (square.type === 'community_chest') return '📦';
    if (square.type === 'tax') return '💰';
    if (square.type === 'railroad') return '🚂';
    if (square.type === 'utility') return '⚡';
    if (square.type === 'property') return '🏠';
    return '';
  };

  return (
    <div className="position-input">
      <div className="position-header">
        <button
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="position-content"
        >
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
          Track Your Position (Optional)
        </button>
        {currentPosition !== null && (
          <div className="current-position-badge">
            Position: {currentPosition} - {squares[currentPosition].name}
          </div>
        )}
      </div>

      {isExpanded && (
        <div id="position-content" className="position-content">
          <div className="input-mode-selector">
            <button
              className={`mode-button ${inputMode === 'dropdown' ? 'active' : ''}`}
              onClick={() => setInputMode('dropdown')}
              aria-pressed={inputMode === 'dropdown'}
            >
              Dropdown List
            </button>
            {showVisual && (
              <button
                className={`mode-button ${inputMode === 'visual' ? 'active' : ''}`}
                onClick={() => setInputMode('visual')}
                aria-pressed={inputMode === 'visual'}
              >
                Visual Board
              </button>
            )}
          </div>

          {inputMode === 'dropdown' ? (
            <div className="dropdown-mode">
              <label htmlFor="position-select" className="select-label">
                Select your current square:
              </label>
              <select
                id="position-select"
                className="position-select"
                value={currentPosition !== null ? currentPosition : ''}
                onChange={(e) => handlePositionSelect(parseInt(e.target.value))}
                aria-label="Current board position"
              >
                <option value="">-- Select Position --</option>
                {squares.map((square) => (
                  <option key={square.id} value={square.id}>
                    {square.id} - {getSquareIcon(square)} {square.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="visual-mode">
              <div className="square-grid">
                {squares.map((square) => (
                  <button
                    key={square.id}
                    className={`square-button ${currentPosition === square.id ? 'selected' : ''}`}
                    onClick={() => handlePositionSelect(square.id)}
                    style={{
                      borderColor: square.color ? getSquareColor(square) : '#CCCCCC',
                      borderWidth: '3px'
                    }}
                    aria-label={`Position ${square.id}: ${square.name}`}
                    aria-pressed={currentPosition === square.id}
                  >
                    <div className="square-number">{square.id}</div>
                    <div className="square-icon">{getSquareIcon(square)}</div>
                    <div className="square-name">{square.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentPosition !== null && (
            <div className="selected-position-details">
              <div className="detail-card">
                <h4>Current Position</h4>
                <div className="detail-row">
                  <span className="label">Square:</span>
                  <span className="value">{squares[currentPosition].name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Number:</span>
                  <span className="value">{currentPosition}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Type:</span>
                  <span className="value">{squares[currentPosition].type}</span>
                </div>
                {squares[currentPosition].price && (
                  <div className="detail-row">
                    <span className="label">Price:</span>
                    <span className="value">${squares[currentPosition].price}</span>
                  </div>
                )}
              </div>
              <button
                className="clear-button"
                onClick={handleClear}
                aria-label="Clear position selection"
              >
                Clear Position
              </button>
            </div>
          )}

          <div className="position-tips">
            <p className="tip-text">
              💡 <strong>Tip:</strong> Select your current position to see where you'll land after rolling the dice!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionInput;
