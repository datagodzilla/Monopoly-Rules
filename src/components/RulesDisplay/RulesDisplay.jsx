import './RulesDisplay.css';

const RulesDisplay = ({ gameRule }) => {
  const { category, total, rule, tip, icon, isDoubles, details } = gameRule;

  // Speed Die detailed rules
  const getSpeedDieDetails = () => {
    if (!details || typeof details.speedDie !== 'string') return null;

    const speedDie = details.speedDie;

    if (speedDie === 'Bus') {
      return {
        title: '🚌 Speed Die: BUS Rules',
        rules: [
          '🎯 You have TWO options when you roll the Bus:',
          '   Option 1: Move the total of both regular dice normally',
          '   Option 2: Move to the next Bus Ticket space on the board',
          '💡 Strategic Choice: Use the bus to skip ahead to better properties or avoid bad spaces!',
          '🎲 The bus ticket spaces are special locations that can help you reach valuable properties faster'
        ]
      };
    } else if (speedDie === 'Mr. Monopoly') {
      return {
        title: '🎩 Speed Die: MR. MONOPOLY Rules',
        rules: [
          '🎯 When you roll Mr. Monopoly:',
          '   1. First, move the total of both regular dice',
          '   2. Then, advance to the next unowned property',
          '💰 If the property is unowned: You can buy it!',
          '💸 If another player owns it: You must pay rent',
          '🏠 If you already own it: Lucky you, nothing happens!',
          '💡 Mr. Monopoly helps you find and acquire properties faster!'
        ]
      };
    } else if (speedDie === '?') {
      return {
        title: '❓ Speed Die: CHANCE Rules',
        rules: [
          '🎯 When you roll the CHANCE (?):',
          '   1. First, move the total of both regular dice',
          '   2. Then, draw a Chance card',
          '   3. Follow the instructions on the Chance card',
          '🎴 Chance cards can give you money, move you to different spaces, or create surprises!',
          '💡 Important: Always move FIRST, then draw the card',
          '🎲 This adds extra excitement and unpredictability to your turn!'
        ]
      };
    }

    return null;
  };

  const speedDieDetails = getSpeedDieDetails();

  return (
    <div className="rules-display">
      {/* Category Header */}
      <div className="category-header">
        <span className="category-icon" aria-hidden="true">{icon}</span>
        <h2 className="category-title">{category}</h2>
      </div>

      {/* Total Spaces */}
      <div className="total-display">
        <span className="total-label">Total Movement:</span>
        <span className="total-number">{total}</span>
        <span className="total-suffix">spaces</span>
      </div>

      {/* Doubles Indicator */}
      {isDoubles && (
        <div className="doubles-indicator">
          <span className="doubles-icon">🎲🎲</span>
          <span className="doubles-text">Doubles! Roll Again!</span>
        </div>
      )}

      {/* Rule Section */}
      <div className="rule-section" aria-label="Game rule explanation">
        <h3 className="section-title">The Rule:</h3>
        <p className="rule-text">{rule}</p>
      </div>

      {/* Speed Die Detailed Rules */}
      {speedDieDetails && (
        <div className="speed-die-details" aria-label="Speed Die detailed rules">
          <h3 className="section-title speed-die-title">{speedDieDetails.title}</h3>
          <ul className="speed-die-rules-list">
            {speedDieDetails.rules.map((ruleItem, index) => (
              <li key={index} className="speed-die-rule-item">{ruleItem}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tip Section */}
      <div className="tip-section" aria-label="Helpful tip">
        <h3 className="section-title">💡 Helpful Tip:</h3>
        <p className="tip-text">{tip}</p>
      </div>
    </div>
  );
};

export default RulesDisplay;
