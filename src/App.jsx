import { useState } from 'react'
import './App.css'
import DiceInput from './components/DiceInput/DiceInput'
import DiceAnimation from './components/DiceAnimation/DiceAnimation'
import RulesDisplay from './components/RulesDisplay/RulesDisplay'
import PositionInput from './components/PositionTracker/PositionInput'
import MovementDisplay from './components/MovementDisplay/MovementDisplay'
import SpecialSquareRules from './components/SpecialSquareRules/SpecialSquareRules'
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

    // Scroll to top when transitioning to animation phase
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setCurrentPhase('animation');
  };

  const handleAnimationComplete = () => {
    console.log('Animation complete');
    // Scroll to top when transitioning to results phase
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPhase('results');
  };

  const handleTryAgain = () => {
    setDiceValues(null);
    setGameRule(null);
    setMovementResult(null);
    // Scroll to top when returning to input phase
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPhase('input');
  };

  const handlePositionChange = (position) => {
    setCurrentPosition(position);
    console.log('Position changed to:', position);
  };

  return (
    <div className="App">
      <h1 className="app-main-title">WELCOME TO MEGA MONOPOLY RULES!!</h1>
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

          {movementResult && movementResult.landedSquare && (
            <SpecialSquareRules square={movementResult.landedSquare} />
          )}

          <button className="try-again-button" onClick={handleTryAgain}>
            ROLL DICE AGAIN!! 🎲
          </button>
        </div>
      )}
    </div>
  )
}

export default App
