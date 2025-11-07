import { useState } from 'react'
import './App.css'
import DiceInput from './components/DiceInput/DiceInput'
import DiceAnimation from './components/DiceAnimation/DiceAnimation'
import RulesDisplay from './components/RulesDisplay/RulesDisplay'
import PositionInput from './components/PositionTracker/PositionInput'
import MovementDisplay from './components/MovementDisplay/MovementDisplay'
import { getGameRule } from './utils/gameRules'
import { calculateMovement } from './utils/movementEngine'

function App() {
  const [currentPhase, setCurrentPhase] = useState('input'); // 'input', 'animation', 'results'
  const [diceValues, setDiceValues] = useState(null);
  const [gameRule, setGameRule] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [movementResult, setMovementResult] = useState(null);

  const handleRoll = (values) => {
    console.log('Dice rolled:', values);
    setDiceValues(values);

    // Calculate game rule
    const rule = getGameRule(values.dice1, values.dice2, values.speedDie);
    setGameRule(rule);

    // Calculate movement if position is set
    if (currentPosition !== null) {
      try {
        const movement = calculateMovement(
          currentPosition,
          values.dice1,
          values.dice2,
          values.speedDie
        );
        setMovementResult(movement);
        console.log('Movement calculated:', movement);
      } catch (error) {
        console.error('Error calculating movement:', error);
        setMovementResult(null);
      }
    } else {
      setMovementResult(null);
    }

    setCurrentPhase('animation');
  };

  const handleAnimationComplete = () => {
    console.log('Animation complete');
    setCurrentPhase('results');
  };

  const handleTryAgain = () => {
    setDiceValues(null);
    setGameRule(null);
    setMovementResult(null);
    setCurrentPhase('input');
  };

  const handlePositionChange = (position) => {
    setCurrentPosition(position);
    console.log('Position changed to:', position);
  };

  return (
    <div className="App">
      {currentPhase === 'input' && (
        <>
          <PositionInput
            currentPosition={currentPosition}
            onPositionChange={handlePositionChange}
          />
          <DiceInput onRoll={handleRoll} />
        </>
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
          {movementResult && (
            <MovementDisplay movementResult={movementResult} />
          )}

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
