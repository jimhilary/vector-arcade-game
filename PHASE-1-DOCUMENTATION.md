# 🎮 VECTOR ASTEROIDS GAME - PHASE 1 DOCUMENTATION

**A Full-Stack WordPress Arcade Game**

---

## 📐 FINAL ARCHITECTURE (DO NOT SKIP)

This architecture **never changes** throughout the entire project:

```
Browser
  ↓
Theme (HTML + Canvas + JS)      ← Frontend (PHASE 1)
  ↓
WordPress AJAX / REST           ← Backend (PHASE 2)
  ↓
MySQL                           ← Database (PHASE 2)
```

### **What Each Layer Does:**

| Layer | Purpose | Phase |
|-------|---------|-------|
| **Browser** | Renders the game, handles user input | Phase 1 |
| **Theme** | Game UI, Canvas rendering, JavaScript logic | Phase 1 ✅ |
| **WordPress AJAX/REST** | Save scores, retrieve leaderboard | Phase 2 |
| **MySQL** | Store scores permanently | Phase 2 |

---

## 🗂️ THEME FILE STRUCTURE

**Location:** `wp-content/themes/vector-game/`

```
vector-game/
├── style.css           ← Theme identity + CSS styling
├── index.php           ← HTML structure (canvas, UI)
├── functions.php       ← WordPress integration (loads CSS/JS)
└── game.js             ← Game logic (frontend JavaScript)
```

---

## 📄 WHAT EACH FILE DOES

### **1. style.css** - Theme Identity & Styling

**Purpose:** 
- **WordPress theme header** (tells WordPress this is a theme)
- **CSS styling** for the game UI

**Key Sections:**
```css
/* Theme Header (REQUIRED by WordPress) */
/*
Theme Name: Vector Game
Description: A fullscreen vector arcade game...
*/

/* Fullscreen setup */
* { margin: 0; padding: 0; }
body { overflow: hidden; background: #000; }

/* Canvas styling */
#game-canvas { display: block; background: #000; cursor: crosshair; }

/* UI overlay (score, lives, level) */
.game-ui { position: fixed; top: 20px; left: 20px; color: #0f0; }

/* Game over screen */
.game-over { position: fixed; top: 50%; left: 50%; display: none; }
```

**Why It Matters:**
- WordPress **requires** the header comment to recognize themes
- CSS creates the retro arcade aesthetic (black background, green text, glowing effects)
- Fullscreen setup hides scrollbars for immersive gameplay

---

### **2. index.php** - HTML Structure

**Purpose:**
- Provides the **HTML skeleton** WordPress uses to display the page
- Contains the canvas, UI elements, and game over screen

**What's Inside:**

```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <title><?php bloginfo( 'name' ); ?> - Vector Game</title>
    <?php wp_head(); ?> ← Loads CSS/JS
</head>
<body <?php body_class(); ?>>
    
    <!-- Score/Lives/Level Display -->
    <div class="game-ui">
        <div>SCORE: <span id="score">0</span></div>
        <div>LIVES: <span id="lives">3</span></div>
        <div>LEVEL: <span id="level">1</span></div>
    </div>
    
    <!-- Canvas (where game renders) -->
    <canvas id="game-canvas"></canvas>
    
    <!-- Game Over Screen -->
    <div class="game-over" id="game-over">
        <h1>GAME OVER</h1>
        <p>Final Score: <span id="final-score">0</span></p>
        <p>Press SPACE to restart</p>
    </div>
    
    <?php wp_footer(); ?> ← Loads game.js
</body>
</html>
```

**Why It Matters:**
- `wp_head()` and `wp_footer()` are **critical** - they load all WordPress scripts and styles
- The canvas element is where the entire game renders
- UI elements are positioned with CSS (fixed position overlays)

---

### **3. functions.php** - WordPress Integration

**Purpose:**
- **Bridges** your theme with WordPress
- **Loads** CSS and JavaScript files
- **Registers** theme features

**What's Inside:**

```php
<?php
// Load CSS
function vector_game_enqueue_assets() {
    // Load style.css
    wp_enqueue_style( 'vector-game-style', get_stylesheet_uri() );
    
    // Load game.js (in footer for better performance)
    wp_enqueue_script( 
        'vector-game-js', 
        get_template_directory_uri() . '/game.js', 
        array(),  // No dependencies
        '1.0', 
        true      // Load in footer
    );
}
add_action( 'wp_enqueue_scripts', 'vector_game_enqueue_assets' );

// Theme setup
function vector_game_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'html5' );
}
add_action( 'after_setup_theme', 'vector_game_setup' );

// Disable admin bar (clean fullscreen)
add_filter( 'show_admin_bar', '__return_false' );
```

**Why It Matters:**
- **Without this file**, WordPress won't load your CSS/JS
- `add_action()` hooks your functions to WordPress events
- `wp_enqueue_script()` loads JavaScript at the right time (after DOM is ready)

---

### **4. game.js** - Game Logic (The Heart)

**Purpose:**
- **All game logic** runs here
- Handles rendering, physics, collisions, scoring

**Architecture:**

```javascript
// 1. CANVAS SETUP
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 2. GAME STATE
const game = {
    score: 0,
    lives: 3,
    state: 'start',  // 'start', 'playing', 'gameover'
    level: 1
};

// 3. GAME OBJECTS
const ship = { x, y, rotation, velocity, thrust, friction, size };
const bullets = [];    // Array of Bullet objects
const asteroids = [];  // Array of Asteroid objects

// 4. CLASSES
class Bullet { constructor, update(), draw() }
class Asteroid { constructor, update(), draw() }

// 5. GAME LOGIC
function updateShip() { /* rotation, thrust, physics */ }
function shootBullet() { /* spawn bullet */ }
function updateBullets() { /* move bullets, remove dead ones */ }
function updateAsteroids() { /* move/rotate asteroids */ }
function spawnAsteroids(count) { /* create asteroids */ }
function checkCollisions() { /* bullets vs asteroids, ship vs asteroids */ }

// 6. RENDERING
function drawShip() { /* vector triangle */ }
function drawBullets() { /* green dots */ }
function drawAsteroids() { /* random vector shapes */ }
function drawUI() { /* update score/lives/level */ }
function drawStartScreen() { /* title + instructions */ }

// 7. GAME STATE MANAGEMENT
function startGame() { /* reset, spawn asteroids */ }
function gameOver() { /* show game over screen */ }
function restartGame() { /* reset and start */ }

// 8. MAIN GAME LOOP (60 FPS)
function gameLoop() {
    // Clear screen
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update game logic
    if (game.state === 'playing') {
        updateShip();
        updateBullets();
        updateAsteroids();
        checkCollisions();
    }
    
    // Draw everything
    drawGrid();
    drawAsteroids();
    drawBullets();
    drawShip();
    drawUI();
    
    // Next frame
    requestAnimationFrame(gameLoop);
}

// 9. START
gameLoop();
```

**Key Concepts:**

| Concept | Explanation |
|---------|-------------|
| **Game Loop** | Runs ~60 times per second, updates and draws everything |
| **Canvas API** | HTML5 drawing surface (`ctx.beginPath()`, `ctx.stroke()`) |
| **Vector Graphics** | Everything drawn with lines (no images) |
| **Physics** | Ship has velocity, thrust, friction, max speed |
| **Collision Detection** | Distance formula: `sqrt((x2-x1)² + (y2-y1)²)` |
| **Screen Wrapping** | Objects wrap around edges (Asteroids-style) |
| **State Machine** | Game transitions: start → playing → gameover |

---

## ✅ PHASE 1 IMPLEMENTATION CHECKLIST

### **Frontend Features (100% Complete)**

#### **🎨 Visual System**
- [x] **Vector graphics** - All objects drawn with lines
- [x] **Fullscreen canvas** - Fills entire browser window
- [x] **Retro aesthetic** - Green on black, CRT glow effects
- [x] **Background grid** - Subtle animated starfield effect
- [x] **UI overlay** - Score, lives, level display (top-left)

#### **🚀 Ship Mechanics**
- [x] **Rotation** - A/D or ←/→ keys
- [x] **Thrust** - W/↑ key with visible flame
- [x] **Inertia** - Ship continues moving (Newtonian physics)
- [x] **Friction** - Gradual slowdown (space friction)
- [x] **Max speed** - Speed cap prevents infinite acceleration
- [x] **Screen wrapping** - Ship wraps around edges
- [x] **Invulnerability** - Flicker effect after being hit (2 seconds)

#### **🪨 Asteroid System**
- [x] **Random shapes** - Each asteroid has unique 8-point shape
- [x] **3 sizes** - Large (40px), Medium (25px), Small (15px)
- [x] **Rotation** - Each asteroid rotates at different speed
- [x] **Movement** - Random velocity and direction
- [x] **Screen wrapping** - Asteroids wrap around edges
- [x] **Splitting** - Large→2 Medium→2 Small→Destroyed
- [x] **Dynamic spawning** - Spawn away from ship (safe zones)

#### **💥 Combat System**
- [x] **Bullet shooting** - SPACE key fires bullets
- [x] **Bullet physics** - Inherit ship's direction, fast velocity
- [x] **Bullet lifetime** - Disappear after 60 frames (~1 second)
- [x] **Collision detection** - Bullets destroy asteroids
- [x] **Ship collision** - Ship loses life when hit

#### **🎯 Scoring System (In-Memory)**
- [x] **Score tracking** - Points for destroying asteroids
  - Large asteroid: **20 points**
  - Medium asteroid: **50 points**
  - Small asteroid: **100 points**
- [x] **Lives system** - Start with 3 lives
- [x] **Level progression** - Each level spawns more asteroids

#### **🎮 Game States**
- [x] **Start screen** - Title + instructions
- [x] **Playing state** - Active gameplay
- [x] **Game over state** - Final score + restart prompt
- [x] **State transitions** - SPACE key controls flow

#### **⌨️ Input Handling**
- [x] **Keyboard controls** - W/A/D or arrow keys
- [x] **Shooting** - SPACE key
- [x] **State control** - SPACE starts/restarts game
- [x] **Responsive input** - No lag or delay

---

## 🧪 TESTING INSTRUCTIONS

### **Prerequisites**
1. ✅ Laragon is running
2. ✅ WordPress is installed at `wp-vector-game.test`
3. ✅ Theme files are in `wp-content/themes/vector-game/`

### **Step 1: Activate Theme**
1. Go to: `http://wp-vector-game.test/wp-admin/`
2. Navigate: **Appearance → Themes**
3. Find **"Vector Game"** theme
4. Click **"Activate"**

### **Step 2: Open Game**
1. Visit: `http://wp-vector-game.test/`
2. Should see green start screen with title

### **Step 3: Test Features**

#### **Basic Controls:**
- [ ] Press **SPACE** → Game starts
- [ ] Press **W** or **↑** → Ship thrusts forward (orange flame appears)
- [ ] Press **A** or **←** → Ship rotates left
- [ ] Press **D** or **→** → Ship rotates right
- [ ] Press **SPACE** while playing → Bullet fires

#### **Physics:**
- [ ] Ship continues moving after thrust (inertia)
- [ ] Ship gradually slows down (friction)
- [ ] Ship wraps around screen edges
- [ ] Bullets inherit ship's direction

#### **Asteroids:**
- [ ] Asteroids appear and rotate
- [ ] Asteroids move in random directions
- [ ] Asteroids wrap around screen edges
- [ ] Large asteroids split into 2 medium when hit
- [ ] Medium asteroids split into 2 small when hit
- [ ] Small asteroids disappear when hit

#### **Scoring:**
- [ ] Score increases when asteroids destroyed
- [ ] Score displayed in top-left corner
- [ ] Lives displayed correctly (start with 3)
- [ ] Level displayed and increments

#### **Collision:**
- [ ] Bullets destroy asteroids on contact
- [ ] Ship loses life when hit by asteroid
- [ ] Ship flickers when invulnerable
- [ ] Ship respawns at center after hit
- [ ] Game over after losing all 3 lives

#### **Game States:**
- [ ] Start screen shows title and instructions
- [ ] Game transitions to playing state
- [ ] Game over screen shows final score
- [ ] Pressing SPACE restarts game

### **Step 4: Performance Check**
- [ ] Game runs smoothly (~60 FPS)
- [ ] No lag when many asteroids/bullets on screen
- [ ] No console errors (F12 → Console tab)

---

## 🐛 TROUBLESHOOTING

### **Problem: Blank Screen**

**Check:**
1. Open DevTools (F12) → Console tab
2. Look for: `🎮 VECTOR ASTEROIDS - Phase 1 Complete!`
3. If missing, check if `game.js` is loaded:
   - View Page Source → Look for `<script src="...game.js"></script>`

**Solution:**
- Clear browser cache: **Ctrl + Shift + R**
- Verify `functions.php` has `wp_enqueue_script()` call
- Check theme is activated

---

### **Problem: Controls Don't Work**

**Check:**
1. Click on canvas to give it focus
2. Open Console (F12) for JavaScript errors

**Solution:**
- Make sure keyboard events are registered
- Try refreshing page
- Check if `game.state === 'playing'`

---

### **Problem: Theme Not Showing**

**Check:**
1. Verify folder structure:
   ```
   wp-content/themes/vector-game/
   ├── style.css
   ├── index.php
   ├── functions.php
   └── game.js
   ```
2. Open `style.css` and verify header comment exists

**Solution:**
- All 4 files must exist
- `style.css` must have theme header
- Go to Appearance → Themes → Refresh page

---

### **Problem: Asteroids Don't Split**

**Check:**
1. Console (F12) for errors
2. Look at collision detection logic

**Solution:**
- Verify `checkCollisions()` function is running
- Check if bullets array is updating
- Ensure asteroid size logic works

---

## 📊 CURRENT LIMITATIONS (BY DESIGN)

Phase 1 is **intentionally limited** to frontend-only features:

| Feature | Status | Phase |
|---------|--------|-------|
| ❌ **Score persistence** | Not saved | Phase 2 |
| ❌ **Leaderboard** | No database | Phase 2 |
| ❌ **User accounts** | Anonymous play only | Phase 2 |
| ❌ **Multiplayer** | Single player only | Phase 3+ |
| ❌ **Sound effects** | Silent gameplay | Phase 3+ |
| ❌ **Mobile support** | Desktop only | Phase 3+ |

**Why?**
- Phase 1 focuses on **game mechanics** and **fun gameplay**
- Backend integration (database, AJAX) comes in Phase 2
- We validate the game is enjoyable **before** adding complexity

---

## 🎯 WHAT'S NEXT: PHASE 2 PREVIEW

Phase 2 will add the **backend layer**:

### **New Components:**

```
wp-content/plugins/vector-game-core/
└── vector-game-core.php
    ├── Create database table
    ├── AJAX endpoint for saving scores
    ├── Shortcode for leaderboard
    └── REST API integration
```

### **Phase 2 Features:**
1. **WordPress Plugin** - Backend game logic
2. **MySQL Table** - Store scores permanently
3. **AJAX Integration** - Save score without page reload
4. **Leaderboard** - Display top 10 scores
5. **User Integration** - Link scores to WordPress users
6. **Admin Panel** - View/manage all scores

---

## 🏆 PHASE 1 SUCCESS CRITERIA

✅ **Phase 1 is complete when:**
1. Game runs smoothly without errors
2. All controls work as expected
3. Asteroids spawn and split correctly
4. Collision detection is accurate
5. Score/lives/level system works
6. Game is **fun to play** for at least 5 minutes

---

## 📝 TECHNICAL NOTES

### **Why WordPress Theme Instead of Plugin?**

**Answer:** Themes control **visual presentation** (perfect for a game UI).
Plugins control **functionality** (perfect for backend logic).

We'll add a plugin in Phase 2 for database/AJAX.

### **Why Canvas Instead of DOM?**

**Answer:** Canvas provides:
- 60 FPS rendering
- Smooth animations
- Vector graphics
- Full control over pixels
- Better performance for games

### **Why In-Memory Scores?**

**Answer:** 
- Focus Phase 1 on **gameplay mechanics**
- Validate game is fun **before** adding database complexity
- Easier to test and iterate
- Clean separation of concerns

---

## 🎮 CONTROLS REFERENCE

| Key | Action |
|-----|--------|
| **W** or **↑** | Thrust forward |
| **A** or **←** | Rotate left |
| **D** or **→** | Rotate right |
| **SPACE** | Shoot bullet (when playing) |
| **SPACE** | Start game (when on start screen) |
| **SPACE** | Restart game (when game over) |

---

## 📚 WORDPRESS INTEGRATION EXPLAINED

### **How Theme Files Work Together:**

```
1. WordPress loads index.php
2. index.php calls wp_head()
3. wp_head() triggers 'wp_enqueue_scripts' action
4. functions.php hooks into that action
5. functions.php loads style.css and game.js
6. Browser renders HTML + CSS
7. Browser executes game.js
8. Game loop starts
```

### **Key WordPress Functions Used:**

| Function | Purpose |
|----------|---------|
| `wp_head()` | Loads CSS/JS in `<head>` |
| `wp_footer()` | Loads JS before `</body>` |
| `wp_enqueue_style()` | Register CSS file |
| `wp_enqueue_script()` | Register JS file |
| `add_action()` | Hook function to WordPress event |
| `get_stylesheet_uri()` | Get path to style.css |
| `get_template_directory_uri()` | Get theme folder URL |

---

## ✅ PHASE 1 COMPLETE!

**Congratulations!** You now have a fully playable vector arcade game running in WordPress.

**Play it at:** `http://wp-vector-game.test/`

**Ready for Phase 2?** Let's add database persistence and leaderboards! 🚀

---

**Created:** Phase 1 Documentation  
**Version:** 1.0  
**Status:** ✅ Complete  
**Next:** Phase 2 - Backend Integration

