/**
 * Movement Engine for Mega Monopoly
 * Calculates token movement based on current position, dice rolls, and game rules
 */

import boardData from '../data/boardSquares.json';

const BOARD_SIZE = boardData.boardSize;
const JAIL_POSITION = 10;
const GO_POSITION = 0;

/**
 * Calculate the destination square(s) based on current position and dice roll
 * @param {number} currentPosition - Current square position (0-39)
 * @param {number} dice1 - First regular die (1-6)
 * @param {number} dice2 - Second regular die (1-6)
 * @param {string|number} speedDie - Speed die value (1, 2, 3, "Bus", "Mr. Monopoly", "?")
 * @returns {object} Movement result with destination(s), path, and special actions
 */
export function calculateMovement(currentPosition, dice1, dice2, speedDie) {
  // Validate inputs
  if (currentPosition < 0 || currentPosition >= BOARD_SIZE) {
    throw new Error(`Invalid position: ${currentPosition}. Must be between 0 and ${BOARD_SIZE - 1}`);
  }
  if (dice1 < 1 || dice1 > 6 || dice2 < 1 || dice2 > 6) {
    throw new Error('Regular dice must be between 1 and 6');
  }

  const regularDiceTotal = dice1 + dice2;
  const isDoubles = dice1 === dice2;

  // Handle special Speed Die symbols
  if (speedDie === 'Mr. Monopoly') {
    return handleMrMonopoly(currentPosition, regularDiceTotal, isDoubles);
  } else if (speedDie === 'Bus') {
    return handleBus(currentPosition, regularDiceTotal, isDoubles);
  } else if (speedDie === '?') {
    return handleQuestionMark(currentPosition, regularDiceTotal, isDoubles);
  } else {
    // Normal movement with number on speed die
    const speedDieValue = typeof speedDie === 'number' ? speedDie : parseInt(speedDie);
    return handleNormalMovement(currentPosition, regularDiceTotal + speedDieValue, isDoubles);
  }
}

/**
 * Handle normal movement (no special symbols)
 */
function handleNormalMovement(currentPosition, totalMovement, isDoubles) {
  const destination = (currentPosition + totalMovement) % BOARD_SIZE;
  const path = generatePath(currentPosition, destination);
  const passedGO = checkPassedGO(currentPosition, destination);
  const landedSquare = getSquareInfo(destination);

  return {
    type: 'normal',
    startPosition: currentPosition,
    destination,
    path,
    passedGO,
    landedSquare,
    isDoubles,
    specialActions: passedGO ? ['collect_go'] : [],
    message: isDoubles ? 'You rolled doubles! Roll again.' : `Move ${totalMovement} spaces.`
  };
}

/**
 * Handle Mr. Monopoly symbol - move to next unowned property
 */
function handleMrMonopoly(currentPosition, regularDiceTotal, isDoubles) {
  const normalDestination = (currentPosition + regularDiceTotal) % BOARD_SIZE;
  const nextPropertyPosition = findNextProperty(normalDestination);

  const path = generatePath(currentPosition, nextPropertyPosition);
  const passedGO = checkPassedGO(currentPosition, nextPropertyPosition);
  const landedSquare = getSquareInfo(nextPropertyPosition);

  return {
    type: 'mr_monopoly',
    startPosition: currentPosition,
    destination: nextPropertyPosition,
    normalDestination,
    path,
    passedGO,
    landedSquare,
    isDoubles,
    specialActions: [
      ...(passedGO ? ['collect_go'] : []),
      'check_property_ownership'
    ],
    message: 'Mr. Monopoly! Move to the next property.',
    tip: 'If unowned, you can buy it. If owned by others, pay rent!'
  };
}

/**
 * Handle Bus symbol - choice between normal movement or next bus ticket
 */
function handleBus(currentPosition, regularDiceTotal, isDoubles) {
  const normalDestination = (currentPosition + regularDiceTotal) % BOARD_SIZE;
  const busDestination = findNextBusTicket(currentPosition);

  const normalPath = generatePath(currentPosition, normalDestination);
  const busPath = generatePath(currentPosition, busDestination);

  const normalPassedGO = checkPassedGO(currentPosition, normalDestination);
  const busPassedGO = checkPassedGO(currentPosition, busDestination);

  const normalSquare = getSquareInfo(normalDestination);
  const busSquare = getSquareInfo(busDestination);

  return {
    type: 'bus',
    startPosition: currentPosition,
    isDoubles,
    options: {
      normal: {
        destination: normalDestination,
        path: normalPath,
        passedGO: normalPassedGO,
        landedSquare: normalSquare,
        movement: regularDiceTotal
      },
      bus: {
        destination: busDestination,
        path: busPath,
        passedGO: busPassedGO,
        landedSquare: busSquare,
        movement: 'Bus'
      }
    },
    message: 'Bus! Choose: move normally or take the bus.',
    tip: 'Compare both options and choose strategically!'
  };
}

/**
 * Handle Question Mark symbol - draw chance card after moving
 */
function handleQuestionMark(currentPosition, regularDiceTotal, isDoubles) {
  const destination = (currentPosition + regularDiceTotal) % BOARD_SIZE;
  const path = generatePath(currentPosition, destination);
  const passedGO = checkPassedGO(currentPosition, destination);
  const landedSquare = getSquareInfo(destination);

  return {
    type: 'question_mark',
    startPosition: currentPosition,
    destination,
    path,
    passedGO,
    landedSquare,
    isDoubles,
    specialActions: [
      ...(passedGO ? ['collect_go'] : []),
      'draw_chance_card'
    ],
    message: `Move ${regularDiceTotal} spaces, then draw a Chance card.`,
    tip: 'Move first, then draw your card!'
  };
}

/**
 * Find the next property square from a given position
 */
function findNextProperty(fromPosition) {
  const properties = boardData.squares.filter(sq =>
    sq.type === 'property' || sq.type === 'railroad' || sq.type === 'utility'
  );

  // Start searching from the next position
  for (let i = 1; i <= BOARD_SIZE; i++) {
    const checkPosition = (fromPosition + i) % BOARD_SIZE;
    if (properties.some(p => p.id === checkPosition)) {
      return checkPosition;
    }
  }

  // Fallback (should never happen)
  return fromPosition;
}

/**
 * Find the next Bus Ticket square from current position
 */
function findNextBusTicket(fromPosition) {
  const busSquares = boardData.busTicketSquares;

  // Find the next bus ticket square
  for (let i = 1; i <= BOARD_SIZE; i++) {
    const checkPosition = (fromPosition + i) % BOARD_SIZE;
    if (busSquares.includes(checkPosition)) {
      return checkPosition;
    }
  }

  // Fallback to first bus square
  return busSquares[0];
}

/**
 * Generate the path array from start to end position
 */
function generatePath(start, end) {
  const path = [];
  let current = start;

  // Handle wraparound
  const distance = end >= start ? end - start : (BOARD_SIZE - start) + end;

  for (let i = 0; i <= distance; i++) {
    path.push(current);
    current = (current + 1) % BOARD_SIZE;
  }

  return path;
}

/**
 * Check if player passed GO during movement
 */
function checkPassedGO(start, end) {
  // If end position is less than start, we wrapped around
  if (end < start) {
    return true;
  }
  // Special case: if start is 0, we didn't pass it
  if (start === GO_POSITION) {
    return false;
  }
  return false;
}

/**
 * Get square information by position
 */
function getSquareInfo(position) {
  const square = boardData.squares.find(sq => sq.id === position);
  if (!square) {
    throw new Error(`Square not found at position ${position}`);
  }
  return square;
}

/**
 * Get all squares in the path with their information
 */
export function getPathDetails(path) {
  return path.map(position => getSquareInfo(position));
}

/**
 * Check if position is a special square that requires action
 */
export function isSpecialSquare(position) {
  const square = getSquareInfo(position);
  return square.type === 'special' ||
         square.type === 'chance' ||
         square.type === 'community_chest' ||
         square.type === 'tax';
}

/**
 * Get strategic recommendation for Bus choice
 */
export function getBusRecommendation(normalSquare, busSquare) {
  // Simple heuristic: prefer landing on unowned property or avoiding tax/jail
  const normalScore = getSquareScore(normalSquare);
  const busScore = getSquareScore(busSquare);

  if (busScore > normalScore) {
    return {
      recommendation: 'bus',
      reason: `Taking the bus to ${busSquare.name} is strategically better!`
    };
  } else if (normalScore > busScore) {
    return {
      recommendation: 'normal',
      reason: `Normal movement to ${normalSquare.name} is better!`
    };
  } else {
    return {
      recommendation: 'either',
      reason: 'Both options are similar. Your choice!'
    };
  }
}

/**
 * Score a square for strategic value (simple heuristic)
 */
function getSquareScore(square) {
  let score = 0;

  // Properties are generally good
  if (square.type === 'property') score += 5;
  if (square.type === 'railroad') score += 4;
  if (square.type === 'utility') score += 3;

  // Special squares
  if (square.name === 'GO') score += 10;
  if (square.name === 'Free Parking') score += 2;

  // Avoid these
  if (square.type === 'tax') score -= 5;
  if (square.action === 'go_to_jail') score -= 10;

  return score;
}

/**
 * Handle "Go to Jail" action
 */
export function handleGoToJail(currentPosition) {
  const path = [currentPosition, JAIL_POSITION];
  const landedSquare = getSquareInfo(JAIL_POSITION);

  return {
    type: 'go_to_jail',
    startPosition: currentPosition,
    destination: JAIL_POSITION,
    path,
    passedGO: false,
    landedSquare,
    specialActions: ['in_jail'],
    message: 'Go directly to Jail! Do not pass GO, do not collect $200.',
    tip: 'You can get out by: paying $50, using a Get Out of Jail card, or rolling doubles.'
  };
}

/**
 * Validate board data integrity
 */
export function validateBoardData() {
  const errors = [];

  // Check board size
  if (boardData.squares.length !== BOARD_SIZE) {
    errors.push(`Board should have ${BOARD_SIZE} squares, found ${boardData.squares.length}`);
  }

  // Check sequential IDs
  for (let i = 0; i < boardData.squares.length; i++) {
    if (boardData.squares[i].id !== i) {
      errors.push(`Square at index ${i} has incorrect id: ${boardData.squares[i].id}`);
    }
  }

  // Check bus ticket squares exist
  boardData.busTicketSquares.forEach(pos => {
    const square = boardData.squares.find(sq => sq.id === pos);
    if (!square) {
      errors.push(`Bus ticket square ${pos} not found`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  calculateMovement,
  getPathDetails,
  isSpecialSquare,
  getBusRecommendation,
  handleGoToJail,
  validateBoardData
};
