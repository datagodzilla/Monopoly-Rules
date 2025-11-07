/**
 * Movement Display Component
 * Shows movement results including start, end positions, path, and special actions
 */

import './MovementDisplay.css';
import boardData from '../../data/boardSquares.json';

const MovementDisplay = ({ movementResult }) => {
  if (!movementResult) {
    return null;
  }

  const { type, startPosition, destination, path, passedGO, landedSquare, specialActions, message, tip, options } = movementResult;

  const getSquareInfo = (position) => {
    return boardData.squares.find(sq => sq.id === position);
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
    return colorMap[square?.color] || '#CCCCCC';
  };

  const renderSquareCard = (square, label, isHighlighted = false) => {
    if (!square) return null;

    return (
      <div className={`square-card ${isHighlighted ? 'highlighted' : ''}`}>
        <div className="card-label">{label}</div>
        <div
          className="square-indicator"
          style={{ backgroundColor: getSquareColor(square) }}
        >
          <div className="square-position">{square.id}</div>
        </div>
        <div className="square-name">{square.name}</div>
        <div className="square-details">
          <div className="detail-item">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{square.type}</span>
          </div>
          {square.price && (
            <div className="detail-item">
              <span className="detail-label">Price:</span>
              <span className="detail-value">${square.price}</span>
            </div>
          )}
          {square.description && (
            <div className="detail-description">{square.description}</div>
          )}
        </div>
      </div>
    );
  };

  const renderPath = () => {
    if (!path || path.length === 0) return null;

    return (
      <div className="path-visualization">
        <h4>Your Path</h4>
        <div className="path-line">
          {path.map((position, index) => {
            const square = getSquareInfo(position);
            const isStart = index === 0;
            const isEnd = index === path.length - 1;

            return (
              <div key={position} className="path-step">
                <div
                  className={`path-node ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
                  style={{
                    backgroundColor: isStart || isEnd ? getSquareColor(square) : '#ddd'
                  }}
                >
                  {position}
                </div>
                {index < path.length - 1 && <div className="path-connector" />}
              </div>
            );
          })}
        </div>
        <div className="path-summary">
          Moved <strong>{path.length - 1}</strong> spaces
        </div>
      </div>
    );
  };

  const renderBusOptions = () => {
    if (type !== 'bus' || !options) return null;

    return (
      <div className="bus-options">
        <h3 className="bus-title">🚌 Bus Choice!</h3>
        <p className="bus-message">{message}</p>

        <div className="options-container">
          <div className="option-card normal-option">
            <div className="option-header">
              <span className="option-icon">🎲</span>
              <h4>Normal Movement</h4>
            </div>
            {renderSquareCard(getSquareInfo(options.normal.destination), 'You\'ll land on', false)}
            <div className="option-info">
              <p>Move {options.normal.movement} spaces</p>
              {options.normal.passedGO && <div className="passed-go-badge">Passed GO! +$200</div>}
            </div>
          </div>

          <div className="option-divider">OR</div>

          <div className="option-card bus-option">
            <div className="option-header">
              <span className="option-icon">🚌</span>
              <h4>Take the Bus</h4>
            </div>
            {renderSquareCard(getSquareInfo(options.bus.destination), 'You\'ll land on', false)}
            <div className="option-info">
              <p>Jump to next Bus Ticket</p>
              {options.bus.passedGO && <div className="passed-go-badge">Passed GO! +$200</div>}
            </div>
          </div>
        </div>

        {tip && (
          <div className="movement-tip">
            💡 <strong>Tip:</strong> {tip}
          </div>
        )}
      </div>
    );
  };

  const renderNormalMovement = () => {
    if (type === 'bus') return null;

    const startSquare = getSquareInfo(startPosition);

    return (
      <div className="normal-movement">
        <h3 className="movement-title">
          {type === 'mr_monopoly' && '🎩 Mr. Monopoly!'}
          {type === 'question_mark' && '❓ Question Mark!'}
          {type === 'normal' && '🎲 Movement Result'}
        </h3>

        <p className="movement-message">{message}</p>

        <div className="position-display">
          {renderSquareCard(startSquare, 'Starting Position', false)}

          <div className="movement-arrow">
            <span className="arrow-icon">➔</span>
            <span className="arrow-label">Move</span>
          </div>

          {renderSquareCard(landedSquare, 'Destination', true)}
        </div>

        {renderPath()}

        {passedGO && (
          <div className="special-notice passed-go">
            <span className="notice-icon">🚀</span>
            <span className="notice-text">You passed GO! Collect $200</span>
          </div>
        )}

        {specialActions && specialActions.length > 0 && (
          <div className="special-actions">
            <h4>Special Actions:</h4>
            <ul>
              {specialActions.map((action, index) => (
                <li key={index} className="action-item">
                  {action === 'draw_chance_card' && '📜 Draw a Chance card'}
                  {action === 'check_property_ownership' && '🏠 Check property ownership'}
                  {action === 'collect_go' && '💰 Collect $200 for passing GO'}
                  {action === 'in_jail' && '🔒 You are in Jail'}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tip && (
          <div className="movement-tip">
            💡 <strong>Tip:</strong> {tip}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="movement-display">
      {type === 'bus' ? renderBusOptions() : renderNormalMovement()}
    </div>
  );
};

export default MovementDisplay;
