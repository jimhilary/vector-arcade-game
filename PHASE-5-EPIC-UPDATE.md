# PHASE 5: EPIC UPDATE - Ship Selection, Enemies, Power-ups & Polish

## 🎯 GOAL

Transform the game from "fun" to **LEGENDARY**! Add ship selection, enemy attacks, power-ups, sound effects, and polish to make it feel premium.

---

## 🚀 NEW FEATURES

### 1. **SHIP SELECTION SYSTEM** ⚡🛡️⚔️

Players now choose from 3 unique ships BEFORE the game starts:

#### **Ship 1: Speed Demon** ⚡
- **Abilities:**
  - ✓ 67% faster movement (thrust: 0.25 vs 0.15)
  - ✓ Max speed: 12 (vs normal 8)
  - ✓ Stronger bullets (speed: 8 vs 5)
- **Weaknesses:**
  - ✗ 1 hit = death (no defense)
- **Starting Lives:** 5
- **Best For:** Skilled players who can dodge everything

#### **Ship 2: Tank** 🛡️
- **Abilities:**
  - ✓ High defense: Takes 2 hits before losing a life
  - ✓ **IMMUNE TO ASTEROIDS** (bounces off, no damage!)
  - ✓ Can only be killed by enemy ships
- **Weaknesses:**
  - ✗ Slower bullets (speed: 4)
- **Starting Lives:** 5
- **Best For:** Beginners learning the game

#### **Ship 3: Balanced** ⚔️
- **Abilities:**
  - ✓ Balanced speed (thrust: 0.18)
  - ✓ Balanced damage (bullet speed: 6)
  - ✓ Balanced max speed: 10
- **Weaknesses:**
  - ✗ Only 3 starting lives (vs 5)
- **Starting Lives:** 3
- **Best For:** Players who want a challenge

---

### 2. **ENEMY SHIPS** 👾

**Dangerous red ships that attack the player!**

#### Behavior:
- Spawn from random edges (top/right/bottom/left)
- Move toward the center with velocity
- Designed as red triangles pointing at the player
- **Kill you instantly** (1 life lost)
- Affect **ALL ships** (even the Tank!)

#### Spawning Rules:
- Start appearing at **Level 2**
- Spawn rate increases with level:
  - Level 2-3: Every 10 seconds
  - Level 4-5: Every 7 seconds
  - Level 6+: Every 3 seconds (intense!)
- More enemies = higher difficulty!

#### Sound Effects:
- `sounds.hurt()` plays when hit by enemy

---

### 3. **POWER-UP HEARTS** 💖

**Restore your health by collecting falling hearts!**

#### Behavior:
- Fall from the top of the screen
- Pink/magenta color with heart shape
- Restore **+1 life** when collected
- **Max lives: 5** (hearts won't spawn if at max)

#### Spawning Rules:
- Spawn every 15 seconds (900 frames)
- 40% chance when timer hits
- Also spawn occasionally after level-up (30% chance)

#### Sound Effects:
- `sounds.powerup()` plays musical tones (C-E-G chord)

---

### 4. **SOUND EFFECTS SYSTEM** 🔊

**Immersive audio using Web Audio API!**

All sounds are generated dynamically (no files needed):

| Sound | When | Frequency | Effect |
|-------|------|-----------|--------|
| **Shoot** | Fire bullet | 220 Hz | Quick beep |
| **Explode** | Asteroid destroyed | 100 Hz + 50 Hz | Double boom |
| **Level Up** | New level | 523-659-784 Hz | Musical rise |
| **Powerup** | Collect heart | 440-554-659 Hz | Happy chime |
| **Hurt** | Hit by enemy | 150 Hz | Damage sound |

#### Implementation:
```javascript
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, volume) {
    // Creates oscillator for beep sounds
    // Square wave for retro feel
}
```

---

### 5. **CUSTOM CONGRATULATION MESSAGES** 🎉

**Personalized messages on level-up!**

Instead of generic "Level Up!", the game now shows random motivational messages:

```javascript
const messages = [
    "Outstanding, Commander!",
    "jimhilary congratulates you on clearing this stage!",
    "Excellent work, Space Ace!",
    "You're unstoppable!",
    "Legend in the making!",
    "Keep dominating the asteroids!",
    "Your skills are impressive!",
    "Master of the void!"
];
```

Each level-up picks a random message to keep it fresh!

---

### 6. **MAX LIVES INCREASED TO 5** ❤️❤️❤️❤️❤️

- Previous: 3 lives max
- **Now: 5 lives max** (except Balanced ship: 3)
- More forgiving for new players
- Power-ups can restore up to max
- Lives display updates dynamically

---

## 📝 FILE CHANGES

### **1. `wp-content/themes/vector-game/index.php`**

**Added:**
- Ship selection screen HTML
- 3 ship cards with stats and descriptions
- Updated welcome screen instructions
- New mentions of hearts and enemies

**Key Elements:**
```html
<div class="ship-selection-screen" id="ship-selection-screen">
    <!-- 3 ship cards with stats -->
</div>
```

---

### **2. `wp-content/themes/vector-game/style.css`**

**Added:**
- `.ship-selection-screen` styles
- `.ship-card` hover effects
- `.ship-icon` large emoji display
- `.ship-stats` color-coded (green=good, red=bad, yellow=info)
- Responsive grid for mobile
- Glow effects on hover

**CSS Highlights:**
```css
.ship-card:hover {
    transform: translateY(-10px);  /* Lift effect */
    box-shadow: 0 10px 40px rgba(0, 255, 0, 0.3);  /* Glow */
}
```

---

### **3. `wp-content/themes/vector-game/game.js`** (MAJOR UPDATE!)

**New Game State Properties:**
```javascript
game.selectedShip: 1, 2, or 3
game.shipHitCount: For Tank's 2-hit defense
game.frameCount: Track frames for spawning
game.enemySpawnRate: 600 frames (10 sec)
game.powerupSpawnRate: 900 frames (15 sec)
game.maxLives: 5
```

**New Arrays:**
```javascript
const enemies = [];   // Enemy ships
const powerups = [];  // Hearts
```

**New Functions:**

| Function | Purpose |
|----------|---------|
| `showShipSelection()` | Display ship picker |
| `selectShip(shipNumber)` | Apply ship stats |
| `backToWelcome()` | Return to welcome |
| `createEnemy()` | Spawn enemy ship |
| `createPowerup()` | Spawn heart |
| `updateEnemies()` | Move & collide enemies |
| `updatePowerups()` | Move & collect powerups |
| `handleShipHit()` | Unified damage logic |
| `drawEnemies()` | Render red triangles |
| `drawPowerups()` | Render hearts |
| `playSound()` | Generate audio |
| `sounds.*` | All sound effects |

**Updated Functions:**
- `shootBullet()`: Now uses ship-specific bullet speed + plays sound
- `Bullet` constructor: Accepts speed parameter
- Ship-asteroid collision: Tank immunity logic
- `showLevelUpModal()`: Random messages + spawn enemies/powerups
- `gameLoop()`: Periodic enemy/powerup spawning

---

## 🎮 HOW TO PLAY (UPDATED)

### **Step 1: Choose Your Ship**
1. Click "PRESS SPACE TO START"
2. Select your preferred ship:
   - **Speed Demon** for high risk/reward
   - **Tank** for learning/survival
   - **Balanced** for a challenge

### **Step 2: Master Your Ship**
- Each ship feels different!
- Speed Demon: Fast and deadly
- Tank: Slow but unstoppable
- Balanced: Requires skill

### **Step 3: Avoid Enemies**
- Red triangular ships will hunt you
- They appear from Level 2 onwards
- More frequent at higher levels
- **1 hit = 1 life lost!**

### **Step 4: Collect Hearts**
- Pink hearts fall from the sky
- Restore +1 life (up to 5 max)
- Essential for survival!

### **Step 5: Level Up**
- Every 500 points = new level
- Custom congratulation messages
- Enemies spawn faster
- More powerups appear

---

## 🧪 TESTING CHECKLIST

### **Ship Selection**
- [ ] Welcome screen → Ship selection appears
- [ ] All 3 ships are selectable
- [ ] Ship stats display correctly
- [ ] Selected ship applies proper abilities
- [ ] "Back" button returns to welcome

### **Speed Demon Ship**
- [ ] Moves 67% faster than normal
- [ ] Bullets travel at speed 8
- [ ] Dies in 1 hit from asteroids
- [ ] Dies in 1 hit from enemies
- [ ] Starts with 5 lives

### **Tank Ship**
- [ ] Takes 2 hits before losing a life
- [ ] **Bounces off asteroids** (no damage!)
- [ ] Still dies from enemy ships
- [ ] Bullets are slower (speed 4)
- [ ] Starts with 5 lives

### **Balanced Ship**
- [ ] Normal speed and damage
- [ ] **Only 3 starting lives**
- [ ] Dies in 1 hit from anything
- [ ] Max lives is 3 (not 5)

### **Enemy Ships**
- [ ] Appear from Level 2 onwards
- [ ] Spawn from random edges
- [ ] Move toward center
- [ ] Kill player on contact
- [ ] Spawn more frequently at higher levels
- [ ] Play hurt sound when hit

### **Power-up Hearts**
- [ ] Fall from top of screen
- [ ] Restore +1 life when collected
- [ ] Don't spawn if at max lives
- [ ] Play happy sound when collected
- [ ] Spawn every ~15 seconds
- [ ] Spawn after some level-ups

### **Sound Effects**
- [ ] Shooting bullets makes sound
- [ ] Asteroids explode with sound
- [ ] Level-up plays musical rise
- [ ] Collecting hearts plays chime
- [ ] Getting hit plays hurt sound

### **Custom Messages**
- [ ] Level-up shows random messages
- [ ] "jimhilary congratulates you" appears sometimes
- [ ] Different message each time

### **Max Lives**
- [ ] Lives display shows 5 at start (or 3 for Balanced)
- [ ] Hearts can restore up to 5 (or 3)
- [ ] Lives update properly on hit

---

## 🐛 KNOWN LIMITATIONS

### **By Design:**
- No pause button yet (next phase!)
- No mobile touch controls (keyboard required)
- No fullscreen toggle yet
- No rate limiting on API yet
- Sound effects are simple beeps (retro style!)

### **Gameplay Balance:**
- Tank ship might be too powerful (asteroid immunity!)
- Enemy spawn rate might be too aggressive at high levels
- Powerup spawn rate might be too rare

---

## 🎨 FUTURE ENHANCEMENTS (Phase 6?)

### **Polish Ideas:**
- ✨ Particle effects for explosions
- ⏸️ Pause menu
- 📱 Mobile touch controls
- 🖥️ Fullscreen mode
- ⚠️ Mobile keyboard warning
- 📖 Instructions overlay (in-game)
- 🔊 More complex sounds (music?)
- 🎯 Better enemy AI (aim at player)
- 💥 Boss fights every 5 levels
- 🏆 Achievements system

### **Backend Polish:**
- 🛡️ Rate limiting (prevent spam)
- ✅ Score validation (detect cheating)
- 🔐 Better authentication
- 📊 User profiles
- 📈 Statistics dashboard

---

## 🎯 TESTING INSTRUCTIONS

### **Quick Test:**
1. Visit: `http://wp-vector-game.test/`
2. Click "START" → Choose a ship
3. Play for 2-3 minutes
4. Verify:
   - Ship abilities work
   - Enemies appear
   - Hearts spawn
   - Sounds play
   - Custom messages show

### **Full Test:**
1. Test each ship thoroughly
2. Reach Level 5+ to see enemy frequency
3. Collect multiple hearts
4. Try Tank ship asteroid immunity
5. Verify sound on each action
6. Check leaderboard still works
7. Submit score with new ship system

---

## ✅ PHASE 5 COMPLETION CHECKLIST

- [x] 3 ships with unique abilities
- [x] Enemy ships spawn and attack
- [x] Power-up hearts restore health
- [x] Sound effects system (shoot, explode, powerup, hurt, levelup)
- [x] Custom congratulation messages
- [x] Max lives increased to 5
- [x] Ship-specific defenses (Tank immunity, 2-hit system)
- [x] Periodic spawning (enemies every 3-10s, powerups every 15s)
- [x] UI for ship selection
- [x] Updated styling and animations
- [x] Responsive design for mobile
- [x] No linting errors
- [x] Documentation complete

---

## 🎊 CONGRATULATIONS!

**Your game is now LEGENDARY!** 🚀

Features implemented:
- ✅ **Phase 1:** Core game mechanics
- ✅ **Phase 2:** Backend API
- ✅ **Phase 3:** Database persistence
- ✅ **Phase 4:** Beautiful UI & leaderboard
- ✅ **Phase 5:** Ship selection, enemies, powerups, sounds!

**Next step:** Test everything and enjoy your epic asteroids game!

---

## 📚 ARCHITECTURE REMINDER

```
Browser (Frontend)
  ↓
Theme (HTML + Canvas + JS)      ← Phase 1: Game Logic
  ↓                               ← Phase 5: Ships, Enemies, Powerups, Sounds!
WordPress AJAX / REST           ← Phase 2: API Layer
  ↓
Plugin (Backend)                ← Phase 3: Database
  ↓
MySQL Database                  ← Phase 3: Persistence
```

---

**Ready to dominate the asteroids? Choose your ship and PLAY!** 🎮🚀

