# Mega Monopoly Rules Helper App

**Build Strategy**: Create a production-ready web application that helps kids (ages 5-8) learn Mega Monopoly game rules through interactive dice visualization and rule recommendations. The app should be fast, reliable, and easily adaptable for future enhancements.

---

## 🎯 Primary Goal

Build an **interactive web app** that:
1. **Deployment**: Can be launched from GitHub Pages (static hosting)
2. **Compatibility**: Works seamlessly on desktop and mobile devices
3. **Purpose**: Teaches 5-8 year old kids the rules of Mega Monopoly through visual dice rolling
4. **Future**: Serves as foundation for a dedicated mobile app if successful

---

## 🎲 Core Functionality

### User Flow
1. **Input Phase**: User enters dice values via an intuitive input interface
   - 2 regular dice (values 1-6 each)
   - 1 Monopoly Speed Die (values: 1, 2, 3, Bus, Mr. Monopoly, or "?")

2. **Animation Phase**: Engaging dice rolling animation
   - Show all 3 dice rolling simultaneously
   - Smooth animation that builds excitement
   - Dice "land" on the entered values
   - Duration: 1-2 seconds (adjustable)

3. **Results Phase**: Display game rules and recommendations
   - Show the rolled values clearly
   - Explain the relevant Mega Monopoly rule
   - Provide a friendly tip for the best move
   - Use kid-friendly language and visuals

### Input Interface Requirements

**Priority: Make input dead-simple for kids**

**Dice 1 & 2 (Regular Dice)**:
- Large, colorful number buttons (1-6)
- Show dice face icons (dots) alongside numbers
- Clear visual feedback when selected
- Label: "First Die" and "Second Die"

**Speed Die Options**:
- Large, visual buttons for each option:
  - Number buttons: 1, 2, 3
  - Special icons:
    - 🚌 Bus (with text label)
    - 🎩 Mr. Monopoly (with icon/text)
    - ❓ Question Mark (with icon)
- Each button shows the icon + label
- Clear selection highlighting

**Submit Button**:
- Large "Roll the Dice!" button
- Bright, inviting color
- Clear call-to-action

---

## 📋 Game Rules to Implement

The app must handle these Mega Monopoly scenarios:

### 1. Regular Movement (Number + Number + Number)
- **Rule**: Move the total of all three dice
- **Example**: 4 + 5 + 2 = Move 11 spaces
- **Tip**: "Count carefully and move your piece!"

### 2. Mr. Monopoly Symbol
- **Rule**: Move regular dice total, then move to next unowned property OR pay rent if owned
- **Scenarios**:
  - Unowned property: "Move and you can buy it!"
  - Owned by other player: "Move and pay rent"
  - Owned by you: "Lucky! It's your property!"
- **Tip**: "Look for properties you don't own yet!"

### 3. Bus Symbol
- **Rule**: Choose to move regular dice total OR move to next Bus Ticket space
- **Options**:
  - Use bus: Skip ahead to next bus ticket space
  - Don't use bus: Move normally
- **Tip**: "Use the bus if it helps you get to better properties!"

### 4. Question Mark (?) Symbol
- **Rule**: Draw a Chance card after moving
- **Process**: Move regular dice total → Draw Chance card
- **Tip**: "Move first, then draw your Chance card!"

### 5. Doubles Scenarios
- **Rolled Doubles**: Roll again
- **Three Doubles in a Row**: Go to Jail
- **Tip**: "Doubles are lucky, but three in a row sends you to Jail!"

### 6. Jail Scenarios
- **Landing on "Go to Jail"**: Go directly to Jail
- **Getting Out**: Pay $50, use Get Out of Jail card, or roll doubles
- **Tip**: "Try to roll doubles to get out free!"

### 7. Special Spaces
- **Go**: Collect $200
- **Free Parking**: Just visiting (or house rules)
- **Chance/Community Chest**: Draw a card
- **Tax Spaces**: Pay the amount shown

---

## 🎨 Visual Design Requirements

### Theme
- **Style**: Playful, Minimalist, Colorful
- **Target Age**: 5-8 years old
- **Inspiration**: Monopoly board game aesthetics with modern, clean UI

### Color Palette
- **Primary**: Bright Monopoly red (#E40B2E)
- **Secondary**: Monopoly green (#00A550), gold (#FFD700)
- **Accents**: Blues, purples for variety
- **Background**: Light, cheerful colors (white, cream, light blue)
- **Text**: High contrast (dark text on light backgrounds)

### Typography
- **Headers**: Large, bold, friendly fonts (e.g., Fredoka, Baloo, Comic Sans style)
- **Body**: Clear, readable sans-serif (e.g., Open Sans, Roboto)
- **Size**: Extra large for kids (minimum 18px body, 32px+ headers)
- **Line Height**: Generous spacing (1.6-1.8)

### UI Components

**Input Section**:
- Card/panel design with rounded corners
- Clear section headers
- Visual separation between dice types
- Progress indicator (Step 1 of 3, Step 2 of 3, etc.)

**Dice Animation**:
- 3D or 2D CSS/SVG animations
- Smooth rotation and tumbling effects
- Sound effects (optional, with mute button)
- Particle effects for excitement

**Results Display**:
- Card-based layout
- Large icons for rules
- Color-coded sections (rule, tip, action)
- "Try Again" button to reset

---

## 🎬 Animation Requirements

### Dice Rolling Animation
1. **Pre-roll**: All 3 dice appear in starting position
2. **Rolling Phase**:
   - Dice tumble/rotate with realistic physics
   - Slight blur for motion effect
   - Randomized rotation speeds
   - Duration: 1-2 seconds
3. **Landing Phase**:
   - Dice slow down and "settle"
   - Bounce effect when landing
   - Final values revealed clearly
4. **Post-roll**:
   - Subtle glow or highlight on dice
   - Smooth transition to results screen

### Transitions
- Fade in/out: 0.3s
- Slide animations: 0.4s with easing
- Scale effects: 0.2s for button interactions
- All animations should be smooth (60fps target)

---

## 🧪 Testing Requirements

### Test Scenarios (50+ Cases)

**Category 1: Basic Number Combinations** (15 cases)
- All numbers 1-6 combinations with Speed Die 1, 2, 3
- Examples: (1,1,1), (6,6,3), (3,4,2), etc.

**Category 2: Mr. Monopoly Scenarios** (10 cases)
- Various dice totals with Mr. Monopoly symbol
- Different property ownership situations
- Examples: (2,3,Mr.M), (5,6,Mr.M), etc.

**Category 3: Bus Scenarios** (10 cases)
- Different dice totals with Bus symbol
- Strategic vs non-strategic bus usage
- Examples: (1,2,Bus), (6,5,Bus), etc.

**Category 4: Question Mark Scenarios** (8 cases)
- Various totals with Question Mark
- Different board positions
- Examples: (3,4,?), (1,6,?), etc.

**Category 5: Doubles Scenarios** (7 cases)
- Regular doubles (roll again)
- Three doubles (go to jail)
- Examples: (3,3,1), (5,5,Bus), doubles sequences

**Category 6: Special Situations** (10+ cases)
- Landing on Jail space
- Landing on Go
- Landing on Chance/Community Chest
- Landing on owned properties
- Landing on utilities/railroads
- Tax spaces

### Test Data Format
```javascript
{
  dice1: 3,
  dice2: 4,
  speedDie: "Bus",
  scenario: "Player can choose bus or normal movement",
  expectedRule: "Move 7 spaces OR move to next Bus Ticket",
  expectedTip: "Use the bus if it gets you to better properties!"
}
```

---

## 💻 Technical Requirements

### Frontend Stack
- **Framework**: React 18+ with Vite
- **Styling**: CSS Modules or Styled Components
- **Animations**: Framer Motion or React Spring
- **State Management**: React Context or Zustand (lightweight)
- **Testing**: Vitest + React Testing Library

### Backend (Optional/Minimal)
- **Purpose**: Rule logic and recommendations
- **Stack**: Flask (Python) or Node.js
- **API**: RESTful endpoints
- **Deployment**: Can be serverless or embedded in frontend

### Deployment Strategy
- **Primary**: GitHub Pages (static build)
- **Build**: Optimized production bundle
- **Assets**: Compressed images, lazy loading
- **PWA**: Service worker for offline capability (optional)

### Performance Targets
- **Initial Load**: < 2 seconds
- **Animation FPS**: 60fps
- **Bundle Size**: < 500KB (minified + gzipped)
- **Lighthouse Score**: 90+ on all metrics

---

## ♿ Accessibility (WCAG AA)

### Mandatory Features
- **Semantic HTML**: Proper use of `<main>`, `<nav>`, `<button>`, `<section>`, `<article>`
- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full app usable without mouse
  - Tab order logical and intuitive
  - Enter/Space to activate buttons
  - Escape to cancel/go back
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Alt Text**: All images have descriptive alt attributes
- **Focus Indicators**: Clear visual focus states
- **Screen Reader**: Test with VoiceOver (Mac) or NVDA (Windows)

### Keyboard Shortcuts
- `Tab`: Navigate between elements
- `Enter/Space`: Select dice values
- `Escape`: Clear selection / Go back
- `R`: Reset (optional)

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px (portrait phones)
- **Tablet**: 768px - 1023px (tablets, landscape phones)
- **Desktop**: 1024px+ (desktops, large tablets)

### Mobile-First Approach
- Design for mobile first, enhance for larger screens
- Touch targets minimum 44x44px
- Single column layout on mobile
- Larger buttons and spacing
- Simplified navigation

### Touch Interactions
- Tap to select dice values
- Swipe to go back (optional)
- Pull to reset (optional)
- No hover states (use active states)

---

## 🔧 Development Workflow

### Phase 1: Setup & Foundation (Current)
✅ Project initialized with React + Flask
✅ TDD environment configured
✅ Launch scripts created
✅ README documentation

### Phase 2: Core UI Components (Next)
- [ ] Dice input interface
- [ ] Dice rolling animation
- [ ] Results display component
- [ ] Rule logic engine

### Phase 3: Game Rules Implementation
- [ ] All 7 rule categories
- [ ] 50+ test scenarios
- [ ] Recommendation engine
- [ ] Kid-friendly language

### Phase 4: Polish & Testing
- [ ] Animations perfected
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile device testing

### Phase 5: Deployment
- [ ] Production build
- [ ] GitHub Pages deployment
- [ ] Documentation
- [ ] User testing with kids

---

## 📦 Project Structure

```
MONOPOLY_GAME_APP/
├── src/
│   ├── components/
│   │   ├── DiceInput/           # Dice selection interface
│   │   ├── DiceAnimation/       # Animated dice rolling
│   │   ├── RulesDisplay/        # Rule explanation + tips
│   │   ├── Layout/              # Page layout
│   │   └── common/              # Buttons, cards, etc.
│   ├── hooks/
│   │   ├── useDiceRoll.js       # Dice roll logic
│   │   └── useGameRules.js      # Rules engine
│   ├── utils/
│   │   ├── gameRules.js         # All game rules
│   │   ├── recommendations.js   # Tip generation
│   │   └── animations.js        # Animation configs
│   ├── data/
│   │   └── testScenarios.js     # 50+ test cases
│   └── styles/
│       ├── colors.css           # Color palette
│       └── typography.css       # Font styles
├── backend/
│   └── api/
│       └── routes/
│           └── rules.py         # Rules API (optional)
└── tests/
    ├── unit/                    # Component tests
    ├── integration/             # Flow tests
    └── e2e/                     # Full app tests
```

---

## 🎯 Success Criteria

### Must Have (MVP)
✅ User can input all 3 dice values easily
✅ Animated dice rolling shows entered values
✅ Correct rule displayed for all combinations
✅ Kid-friendly tips provided
✅ Works on mobile and desktop
✅ Accessible (WCAG AA)
✅ Fast load time (< 2s)

### Should Have
- Sound effects (with mute)
- Vibration on mobile
- Shareable results
- Print-friendly view
- Multiple languages (future)

### Could Have
- Save favorite scenarios
- Tutorial mode
- Achievement badges
- Multiplayer suggestions
- Board position tracker

---

## 📝 Additional Notes

### No Requirements
- ❌ User registration
- ❌ Data storage/database
- ❌ User accounts
- ❌ Monetization
- ❌ Analytics (unless for debugging)

### Privacy
- No personal data collected
- No cookies (unless essential)
- No tracking
- Kid-safe environment

### Browser Support
- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari 14+, Chrome Android 90+
- **No IE11 support** (use modern JavaScript)

---

## 🚀 Next Steps

1. **Review this specification** with team/stakeholders
2. **Start with Phase 2**: Build dice input interface (TDD approach)
3. **Iterate quickly**: Get feedback early and often
4. **Test with kids**: Real user testing is critical
5. **Deploy early**: Get it on GitHub Pages ASAP
6. **Measure success**: Load time, usability, engagement

---

**Version**: 2.0 (Enhanced)
**Last Updated**: 2025-11-05
**Status**: Ready for development

