/**
 * Game Rules Engine for Mega Monopoly
 * Handles all 7 rule categories and provides kid-friendly explanations
 */

/**
 * Check if the two regular dice show the same value (doubles)
 */
export function isDoubles(dice1, dice2) {
  return dice1 === dice2;
}

/**
 * Get the game rule, tip, and total based on dice values
 * Priority: Doubles > Special Speed Die > Regular Movement
 */
export function getGameRule(dice1, dice2, speedDie) {
  // Convert string numbers to actual numbers
  const speedDieValue = (speedDie === '1' || speedDie === '2' || speedDie === '3')
    ? parseInt(speedDie)
    : speedDie;

  const total = dice1 + dice2 + (typeof speedDieValue === 'number' ? speedDieValue : 0);
  const hasDoubles = isDoubles(dice1, dice2);

  // Priority 1: Doubles (regardless of speed die)
  if (hasDoubles) {
    return getDoublesRule(dice1, dice2, speedDieValue, total);
  }

  // Priority 2: Special Speed Die symbols
  if (speedDieValue === 'Mr. Monopoly') {
    return getMrMonopolyRule(dice1, dice2, total);
  }

  if (speedDieValue === 'Bus') {
    return getBusRule(dice1, dice2, total);
  }

  if (speedDieValue === '?') {
    return getQuestionMarkRule(dice1, dice2, total);
  }

  // Priority 3: Regular Movement (all numbers)
  return getRegularMovementRule(dice1, dice2, speedDieValue, total);
}

/**
 * Category 1: Regular Movement (Number + Number + Number)
 */
function getRegularMovementRule(dice1, dice2, speedDie, total) {
  return {
    category: 'Regular Movement',
    total,
    rule: `Move ${total} spaces forward on the board.`,
    tip: 'Count carefully and move your piece! 🎯',
    icon: '🎲',
    isDoubles: false,
    details: {
      dice1,
      dice2,
      speedDie,
      action: 'move',
      spaces: total
    }
  };
}

/**
 * Category 2: Mr. Monopoly Symbol
 */
function getMrMonopolyRule(dice1, dice2, total) {
  return {
    category: 'Mr. Monopoly',
    total,
    rule: `Move ${total} spaces, then move to the next unowned property. If the property is owned by another player, pay rent. If you own it, you're lucky!`,
    tip: 'Look for properties you don\'t own yet! 🏠',
    icon: '🎩',
    isDoubles: false,
    details: {
      dice1,
      dice2,
      speedDie: 'Mr. Monopoly',
      action: 'move_and_monopoly',
      spaces: total,
      specialAction: 'next_unowned_property'
    }
  };
}

/**
 * Category 3: Bus Symbol
 */
function getBusRule(dice1, dice2, total) {
  return {
    category: 'Bus',
    total,
    rule: `You have a choice! Move ${total} spaces normally OR move to the next Bus Ticket space on the board.`,
    tip: 'Use the bus if it helps you get to better properties! 🚌',
    icon: '🚌',
    isDoubles: false,
    details: {
      dice1,
      dice2,
      speedDie: 'Bus',
      action: 'choice',
      options: [
        { type: 'normal', spaces: total },
        { type: 'bus', destination: 'next_bus_ticket' }
      ]
    }
  };
}

/**
 * Category 4: CHANCE (?) Symbol
 */
function getQuestionMarkRule(dice1, dice2, total) {
  return {
    category: 'CHANCE',
    total,
    rule: `Move ${total} spaces forward, then draw a Chance card and follow its instructions.`,
    tip: 'Move first, then draw your Chance card! 🎴',
    icon: '❓',
    isDoubles: false,
    details: {
      dice1,
      dice2,
      speedDie: '?',
      action: 'move_and_draw',
      spaces: total,
      card: 'Chance'
    }
  };
}

/**
 * Category 5: Doubles Scenarios
 */
function getDoublesRule(dice1, dice2, speedDie, total) {
  let rule = `You rolled doubles (${dice1} and ${dice2})! Move ${total} spaces, then roll again!`;
  let tip = 'Doubles are lucky, but three in a row sends you to Jail! ⚠️';
  let icon = '🎲🎲';

  // Handle special speed die with doubles
  if (speedDie === 'Mr. Monopoly') {
    rule = `Doubles with Mr. Monopoly! Move ${dice1 + dice2} spaces, go to the next unowned property, then roll again!`;
    icon = '🎩🎲';
  } else if (speedDie === 'Bus') {
    rule = `Doubles with Bus! Choose to move ${dice1 + dice2} spaces OR take the bus to the next Bus Ticket, then roll again!`;
    icon = '🚌🎲';
  } else if (speedDie === '?') {
    rule = `Doubles with CHANCE! Move ${dice1 + dice2} spaces, draw a Chance card, then roll again!`;
    icon = '❓🎲';
  }

  return {
    category: 'Doubles',
    total,
    rule,
    tip,
    icon,
    isDoubles: true,
    details: {
      dice1,
      dice2,
      speedDie,
      action: 'doubles',
      spaces: total,
      rollAgain: true,
      warning: 'Three doubles in a row = Go to Jail'
    }
  };
}

/**
 * Get all possible rule categories for reference
 */
export function getRuleCategories() {
  return [
    { id: 1, name: 'Regular Movement', icon: '🎲', description: 'Move the total of all three dice' },
    { id: 2, name: 'Mr. Monopoly', icon: '🎩', description: 'Move to next unowned property' },
    { id: 3, name: 'Bus', icon: '🚌', description: 'Choose bus or normal movement' },
    { id: 4, name: 'CHANCE', icon: '❓', description: 'Draw a Chance card' },
    { id: 5, name: 'Doubles', icon: '🎲🎲', description: 'Roll again!' },
    { id: 6, name: 'Jail', icon: '👮', description: 'Go to Jail or get out' },
    { id: 7, name: 'Special Spaces', icon: '⭐', description: 'Go, Free Parking, Tax, etc.' }
  ];
}

/**
 * Get kid-friendly explanation for a rule category
 */
export function getKidFriendlyExplanation(category) {
  const explanations = {
    'Regular Movement': 'Add up all the numbers and move that many spaces! Easy peasy! 🎯',
    'Mr. Monopoly': 'Mr. Monopoly helps you find properties! Move normally, then zoom to the next property you can buy! 🎩',
    'Bus': 'The bus is like a shortcut! You can take it to skip ahead, or walk normally. Your choice! 🚌',
    'CHANCE': 'Mystery time! Move your piece, then pick a Chance card to see what happens! ❓',
    'Doubles': 'Lucky you! When both dice match, you get to roll again! But watch out - three doubles means jail time! 🎲🎲',
    'Jail': 'Uh oh! You\'re in jail. You can pay $50, use a Get Out card, or try to roll doubles! 👮',
    'Special Spaces': 'Some board spaces are special! Follow the instructions on that space. ⭐'
  };

  return explanations[category] || 'Follow the rule for this situation! 🎲';
}
