import { useState } from 'react'
import './App.css'
import DiceInput from './components/DiceInput/DiceInput'
import DiceAnimation from './components/DiceAnimation/DiceAnimation'
import RulesDisplay from './components/RulesDisplay/RulesDisplay'
import { getGameRule } from './utils/gameRules'

function App() {
  const [currentPhase, setCurrentPhase] = useState('input'); // 'input', 'animation', 'results'
  const [diceValues, setDiceValues] = useState(null);
  const [gameRule, setGameRule] = useState(null);

  const handleRoll = (values) => {
    console.log('Dice rolled:', values);
    setDiceValues(values);

    // Calculate game rule
    const rule = getGameRule(values.dice1, values.dice2, values.speedDie);
    setGameRule(rule);

    setCurrentPhase('animation');
  };

  const handleAnimationComplete = () => {
    console.log('Animation complete');
    setCurrentPhase('results');
  };

  const handleTryAgain = () => {
    setDiceValues(null);
    setGameRule(null);
    setCurrentPhase('input');
  };

  return (
    <div className="App">
      {currentPhase === 'input' && (
        <DiceInput onRoll={handleRoll} />
      )}

      {currentPhase === 'animation' && diceValues && (
        <DiceAnimation
          dice1={diceValues.dice1}
          dice2={diceValues.dice2}
          speedDie={diceValues.speedDie}
          onComplete={handleAnimationComplete}
        />
      )}

      {currentPhase === 'results' && diceValues && gameRule && (
        <div className="results-phase">
          <RulesDisplay gameRule={gameRule} />

          <button className="try-again-button" onClick={handleTryAgain}>
            ROLL DICE AGAIN!! 🎲
          </button>
        </div>
      )}
    </div>
  )
}

export default App
