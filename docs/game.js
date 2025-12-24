/**
 * VECTOR ARCADE GAME - PHASE 1 (COMPLETE)
 * 
 * A full-featured Asteroids-style game with:
 * - Ship movement (thrust, rotation, inertia)
 * - Asteroids spawning and movement
 * - Bullet shooting
 * - Collision detection
 * - Score system
 * - Lives system
 * - Game states (start, playing, game over)
 * - Screen wrapping
 */

// 🚨 CRITICAL: Verify script is loading
console.log('✅ game.js is loading...');

/* ========================================
   SUPABASE CONFIGURATION
   ======================================== */
const SUPABASE_URL = "https://teebchutupnyzcbvlowq.supabase.co";
const SUPABASE_KEY = "sb_publishable_7CAVpenNtPVMKE-WsnPPMQ_52A51sS_";

/* ========================================
   STUB FUNCTIONS (DEFINED FIRST - PREVENT CRASHES!)
   ======================================== */
// These are safe placeholders that prevent "function not defined" errors
// They will be replaced with full implementations later
window.showShipSelection = function () {
    console.log('⚠️ showShipSelection() called before initialization - waiting...');
    setTimeout(() => {
        if (typeof window.showShipSelection !== 'undefined') {
            window.showShipSelection();
        }
    }, 100);
};

window.selectShip = function () {
    console.log('⚠️ selectShip() called before initialization');
};

window.backToWelcome = function () {
    console.log('⚠️ backToWelcome() called before initialization');
};

window.startGameFromWelcome = function () {
    if (typeof window.showShipSelection === 'function') {
        window.showShipSelection();
    }
};

// Leaderboard stub (prevents "not defined" errors)
window.toggleLeaderboard = window.toggleLeaderboard || function () {
    console.warn('⚠️ Leaderboard not ready yet - waiting for initialization...');
    setTimeout(() => {
        if (typeof window.toggleLeaderboard === 'function' && window.toggleLeaderboard.toString().includes('leaderboard-panel')) {
            window.toggleLeaderboard();
        }
    }, 100);
};

// Music function stubs (will be replaced with real implementations)
// These are hoisted function declarations - safe to call before definition
function playMusic() {
    // Stub - will be replaced in DOMContentLoaded
    if (typeof window._bgMusic !== 'undefined' && window._bgMusic) {
        if (window._bgMusic.paused) {
            window._bgMusic.play().catch(() => {});
        }
    }
}

function pauseMusic() {
    // Stub - will be replaced in DOMContentLoaded
    if (typeof window._bgMusic !== 'undefined' && window._bgMusic && !window._bgMusic.paused) {
        window._bgMusic.pause();
    }
}

function stopMusic() {
    // Stub - will be replaced in DOMContentLoaded
    if (typeof window._bgMusic !== 'undefined' && window._bgMusic) {
        window._bgMusic.pause();
        window._bgMusic.currentTime = 0;
    }
}

// Make them available globally
window.playMusic = playMusic;
window.pauseMusic = pauseMusic;
window.stopMusic = stopMusic;

/* ========================================
   IN-GAME SETTINGS (DEFINED FIRST - AVAILABLE IMMEDIATELY!)
   ======================================== */

// ========================================
// ✅ SINGLE SOURCE OF TRUTH FOR PAUSE/RESUME
// ========================================
// CRITICAL: This is the ONLY function that should change game.state for pause/resume!
// All other code (ESC key, buttons, etc.) should CALL this function, not change state directly.
// NO OTHER FUNCTION should modify game.state for pause/resume!
window.togglePause = function() {
    try {
        // Use window.game (global) - it's created in DOMContentLoaded
        // DO NOT use const game = window.game; (causes TDZ errors!)
        
        // Wait for game object to be available
        if (typeof window.game === 'undefined' || !window.game) {
            console.warn('⚠️ Game object not available yet');
            // Try again after a short delay
            setTimeout(() => {
                if (typeof window.game !== 'undefined' && window.game) {
                    window.togglePause();
                }
            }, 100);
            return;
        }
        
        console.log('🔄 STATE BEFORE:', window.game.state); // Debug log
        
        const pauseButton = document.getElementById('pause-resume-btn');
        
        if (window.game.state === 'playing') {
            // Pause the game
            window.game.state = 'paused';
            console.log('⏸️ Game PAUSED - STATE NOW:', window.game.state);
            
            // 🎵 Pause background music
            if (typeof window.pauseMusic === 'function') {
                window.pauseMusic();
            }
            
            // Show settings menu when pausing
            const settingsMenu = document.getElementById('in-game-settings');
            if (settingsMenu) {
                settingsMenu.classList.add('active');
                settingsMenu.style.display = 'flex';
            }
            
            // Update button text
            if (pauseButton) {
                pauseButton.textContent = '▶️ RESUME';
                console.log('✅ Button updated to RESUME');
            }
        } else if (window.game.state === 'paused') {
            // Resume the game
            window.game.state = 'playing';
            console.log('▶️ Game RESUMED - STATE NOW:', window.game.state);
            
            // 🎵 Resume background music
            if (typeof window.playMusic === 'function') {
                window.playMusic();
            }
            
            // Hide settings menu when resuming
            if (typeof hideInGameSettings === 'function') {
                hideInGameSettings();
            }
            
            // Update button text
            if (pauseButton) {
                pauseButton.textContent = '⏸️ PAUSE';
                console.log('✅ Button updated to PAUSE');
            }
        } else {
            console.log('ℹ️ Game state is:', window.game.state, '- cannot pause/resume');
        }
    } catch (e) {
        console.error('❌ Error toggling pause:', e);
    }
};

window.showInGameSettings = function() {
    console.log('⚙️ Settings icon clicked!');
    console.log('Function showInGameSettings is being called!');
    
    // Hide welcome settings if it's showing
    const welcomeSettings = document.getElementById('welcome-settings');
    if (welcomeSettings) {
        welcomeSettings.style.display = 'none';
        console.log('✅ Welcome settings hidden');
    }
    
    // Show in-game settings
    const settingsMenu = document.getElementById('in-game-settings');
    if (!settingsMenu) {
        console.error('❌ Settings menu element not found!');
        alert('ERROR: Settings menu not found!\n\nPlease refresh the page (Ctrl+F5)');
        return;
    }
    
    console.log('✅ Settings menu element found!');
    settingsMenu.classList.add('active');
    console.log('✅ Settings menu shown! Active class added.');
    
    // Force display in case CSS isn't working
    settingsMenu.style.display = 'flex';
    console.log('✅ Settings menu display forced to flex');
    
    // Update pause/resume button text based on game state
    try {
        if (typeof window.game !== 'undefined' && window.game) {
            const pauseButton = document.getElementById('pause-resume-btn');
            if (pauseButton) {
                if (window.game.state === 'playing') {
                    pauseButton.textContent = '⏸️ PAUSE';
                    console.log('🎮 Game is playing - showing PAUSE button');
                } else if (window.game.state === 'paused') {
                    pauseButton.textContent = '▶️ RESUME';
                    console.log('⏸️ Game is paused - showing RESUME button');
                }
            }
            
            // DO NOT change window.game.state here! Only togglePause() controls pause/resume!
            // If you want to pause when opening settings, call togglePause() instead
        } else {
            console.log('ℹ️ Game not ready yet');
        }
    } catch (e) {
        console.error('❌ Error updating settings:', e);
    }
};

window.hideInGameSettings = function() {
    const settingsMenu = document.getElementById('in-game-settings');
    if (settingsMenu) {
        settingsMenu.classList.remove('active');
        settingsMenu.style.display = 'none';
        console.log('✅ Settings menu hidden!');
    }
    // DO NOTHING TO GAME STATE HERE
    // Settings menu should NOT control pause logic
    // Only togglePause() controls pause/resume!
};

// togglePause is already defined at the top - no duplicate needed!

window.quitGameWithConfirm = function() {
    const confirmed = confirm('⚠️ Are you sure you want to QUIT the game?\n\nYour current progress will be lost!');
    
    if (confirmed) {
        if (typeof hideInGameSettings === 'function') {
            hideInGameSettings();
        }
        
        // Hide welcome settings
        const welcomeSettings = document.getElementById('welcome-settings');
        if (welcomeSettings) {
            welcomeSettings.style.display = 'none';
        }
        
        // Show welcome screen
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'block';
        }
        
        // Hide game over screen
        const gameOverScreen = document.getElementById('game-over');
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
        
        // Reset game state (if game exists)
        try {
            if (typeof window.game !== 'undefined' && window.game) {
                window.game.state = 'welcome';
                window.game.score = 0;
                window.game.lives = 5;
                window.game.level = 1;
                window.game.frameCount = 0;
            }
        } catch (e) {
            console.log('Game object not available');
        }
        
        // 🔥 FIX: Reset all UI overlays when quitting
        resetUIOverlays();
        
        // 🔥 FIX: Reset all UI overlays when quitting
        resetUIOverlays();
        
        // 🎵 Stop background music when quitting
        if (typeof window.stopMusic === 'function') {
            window.stopMusic();
        }
        
        console.log('🚪 Game quit - returned to welcome screen');
    }
};

// ========================================
// CRITICAL: Define button functions IMMEDIATELY (before DOMContentLoaded)
// ========================================
// These functions MUST be available when HTML buttons try to call them!

window.showShipSelection = function() {
    console.log('🚀 showShipSelection() called');
    
    // Ensure game object exists
    if (typeof window.game === 'undefined' || !window.game) {
        console.error('❌ Game object not available! Waiting for initialization...');
        // Wait a bit and try again
        setTimeout(() => {
            if (typeof window.game !== 'undefined' && window.game) {
                window.showShipSelection();
            } else {
                alert('ERROR: Game not initialized. Please refresh the page.');
            }
        }, 100);
        return;
    }
    
    // Hide welcome screen
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
        console.log('✅ Welcome screen hidden');
    } else {
        console.error('❌ Welcome screen element not found!');
    }
    
    // Hide welcome settings if it's showing
    const welcomeSettings = document.getElementById('welcome-settings');
    if (welcomeSettings) {
        welcomeSettings.style.display = 'none';
    }
    
    // Show ship selection screen
    const shipSelectionScreen = document.getElementById('ship-selection-screen');
    if (shipSelectionScreen) {
        shipSelectionScreen.style.display = 'flex';
        console.log('✅ Ship selection screen shown');
    } else {
        console.error('❌ Ship selection screen element not found!');
        alert('ERROR: Ship selection screen not found. Please refresh the page.');
        return;
    }
    
    // Update game state
    window.game.state = 'shipselect';
    console.log('✅ Game state set to:', window.game.state);
    
    // 🎵 Stop background music on ship selection screen
    if (typeof stopMusic === 'function') {
        stopMusic();
    }
    
    // Hide game UI when on ship selection screen
    const gameUI = document.querySelector('.game-ui');
    if (gameUI) {
        gameUI.style.display = 'none';
    }
    
    // Hide mobile controls on ship selection screen
    if (typeof updateMobileControlsVisibility === 'function') {
        updateMobileControlsVisibility();
    }
    
    console.log('✅ Ship selection screen ready');
};

window.selectShip = function(shipNumber) {
    console.log('🚀 selectShip() called with ship:', shipNumber);
    
    if (typeof window.game === 'undefined' || !window.game) {
        console.error('❌ Game object not available!');
        return;
    }
    
    window.game.selectedShip = shipNumber;
    
    // Reset ship hit count
    window.game.shipHitCount = 0;
    
    // This function will be defined inside DOMContentLoaded, but we'll call it if available
    // For now, just hide ship selection and show start screen
    const shipSelectionScreen = document.getElementById('ship-selection-screen');
    if (shipSelectionScreen) {
        shipSelectionScreen.style.display = 'none';
    }
    
    window.game.state = 'start';
    
    console.log('✅ Ship selected:', shipNumber);
};

window.backToWelcome = function() {
    console.log('🔙 backToWelcome() called');
    
    const shipSelectionScreen = document.getElementById('ship-selection-screen');
    if (shipSelectionScreen) {
        shipSelectionScreen.style.display = 'none';
    }
    
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'flex';
    }
    
    if (typeof window.game !== 'undefined' && window.game) {
        window.game.state = 'welcome';
    }
    
    // 🔥 FIX: Reset all UI overlays when returning to welcome
    resetUIOverlays();
    
    // 🎵 Stop background music when returning to welcome screen
    if (typeof stopMusic === 'function') {
        stopMusic();
    }
    
    // Hide game UI when on welcome screen
    const gameUI = document.querySelector('.game-ui');
    if (gameUI) {
        gameUI.style.display = 'none';
    }
    
    console.log('✅ Returned to welcome screen');
};

// Wait for the page to fully load before starting
window.addEventListener('DOMContentLoaded', () => {
    
    /* ========================================
       1. CANVAS SETUP
       ======================================== */
    
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('❌ Canvas element not found! Make sure <canvas id="game-canvas"></canvas> exists in HTML.');
        return; // Exit early - can't run game without canvas
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('❌ Could not get 2D context from canvas!');
        return; // Exit early - can't render without context
    }
    
    // Make canvas fill the entire window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    
    // Resize canvas if window size changes
    window.addEventListener('resize', resizeCanvas);
    
    /* ========================================
       2. GAME STATE
       ======================================== */
    
    // 🔧 FIX: Save/restore game state from localStorage (survives refresh)
    function saveGameState() {
        try {
            if (typeof window.game !== 'undefined' && window.game) {
                localStorage.setItem('vectorGameState', JSON.stringify({
                    score: window.game.score,
                    level: window.game.level,
                    lives: window.game.lives,
                    selectedShip: window.game.selectedShip,
                    state: window.game.state
                }));
            }
        } catch (e) {
            console.warn('Could not save game state:', e);
        }
    }
    
    function loadGameState() {
        try {
            const saved = localStorage.getItem('vectorGameState');
            if (saved) {
                const state = JSON.parse(saved);
                // Only restore if we were actually playing (not welcome screen)
                if (state.state === 'playing' || state.state === 'paused') {
                    return state;
                }
            }
        } catch (e) {
            console.warn('Could not load game state:', e);
        }
        return null;
    }
    
    // CRITICAL: Make game object GLOBAL so togglePause can access it!
    const savedState = loadGameState();
    
    // 🔄 RESTORE GAME STATE: Resume from saved state if available, otherwise start fresh
    window.game = {
        score: savedState?.score ?? 0,
        level: savedState?.level ?? 1,
        lives: savedState?.lives ?? 5,
        maxLives: savedState?.maxLives ?? 5,
        selectedShip: savedState?.selectedShip ?? null,
        state: savedState?.state ?? 'welcome',  // Restore state or default to welcome
        
        // Always reset these on load (not saved)
        invulnerable: 0,  // Invulnerability timer after respawn
        lastLevelScore: savedState?.lastLevelScore ?? 0,  // Track score for level-up logic
        shipHitCount: 0,  // For Tank ship (needs 2 hits to die)
        frameCount: 0,  // Frame counter for spawning (reset on load)
        enemySpawnRate: 600,  // Frames between enemy spawns (10 seconds)
        powerupSpawnRate: 900  // Frames between powerup spawns (15 seconds)
    };
    
    if (savedState) {
        console.log('🔄 Restored game state from localStorage:', {
            state: window.game.state,
            score: window.game.score,
            level: window.game.level,
            lives: window.game.lives
        });
    } else {
        console.log('✅ Starting fresh game (no saved state)');
    }
    
    // 🔧 Auto-save game state periodically (only when playing/paused)
    setInterval(() => {
        if (typeof window.game !== 'undefined' && window.game && 
            (window.game.state === 'playing' || window.game.state === 'paused')) {
            saveGameState();
        }
    }, 2000);  // Save every 2 seconds
    
    // 🔄 RESTORE UI BASED ON SAVED STATE (resume after refresh)
    if (window.game.state === 'playing' || window.game.state === 'paused') {
        // Hide welcome & ship select screens
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        
        const shipSelectionScreen = document.getElementById('ship-selection-screen');
        if (shipSelectionScreen) {
            shipSelectionScreen.style.display = 'none';
        }
        
        // Show game UI
        const gameUI = document.querySelector('.game-ui');
        if (gameUI) {
            gameUI.style.display = 'flex';
        }
        
        // Restore pause menu if game was paused
        if (window.game.state === 'paused') {
            const inGameSettings = document.getElementById('in-game-settings');
            if (inGameSettings) {
                inGameSettings.classList.add('active');
                inGameSettings.style.display = 'flex';
            }
            
            // Update pause button text
            const pauseButton = document.getElementById('pause-resume-btn');
            if (pauseButton) {
                pauseButton.textContent = '▶️ RESUME';
            }
        }
        
        // Restore music if game was playing
        if (window.game.state === 'playing' && typeof window.playMusic === 'function') {
            window.playMusic();
        }
        
        console.log(`✅ Game resumed from saved state: ${window.game.state}`);
    } else {
        // Fresh start - show welcome screen
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'block';
        }
        
        // Hide other screens
        const shipSelectionScreen = document.getElementById('ship-selection-screen');
        if (shipSelectionScreen) {
            shipSelectionScreen.style.display = 'none';
        }
        
        const gameUI = document.querySelector('.game-ui');
        if (gameUI) {
            gameUI.style.display = 'none';
        }
        
        const gameOverScreen = document.getElementById('game-over');
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
        
        console.log('✅ Game initialized - starting at welcome screen');
    }
    
    // ❌ DO NOT CREATE ALIAS: const game = window.game;
    // This causes "Cannot access 'game' before initialization" errors!
    // Always use window.game directly!
    
    // Player ship
    const ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        rotation: -Math.PI / 2,     // Point upward (top of screen)
        velocity: { x: 0, y: 0 },
        thrust: 0.22,          // ⬆ STRONGER thrust - easier to correct movement
        rotationSpeed: 0.025,  // ⬇ MUCH SLOWER rotation - natural, not twitchy
        friction: 0.97,        // ⬇ smoother drift - feels intentional, not slippery
        size: 25,  // INCREASED from 15 to 25 - bigger ship!
        maxSpeed: 10,           // ⬆ slightly faster max speed
        angularVelocity: 0,     // 🔧 REAL angular damping (not angle corruption)
        angularFriction: 0.85,  // Angular friction for smooth rotation stop
        maxAngularSpeed: 0.04,  // 🔧 Hard cap on rotation speed (natural, not twitchy)
        angularAccel: 0.003     // 🔧 How fast ship turns toward target (natural acceleration)
    };
    
    // 🔄 RESTORE SHIP PROPERTIES IF RESUMING FROM SAVED STATE
    // (Must be AFTER ship is declared to avoid TDZ errors!)
    if ((window.game.state === 'playing' || window.game.state === 'paused') && window.game.selectedShip) {
        if (window.game.selectedShip === 1) {
            // Speed Demon
            ship.thrust = 0.25;
            ship.maxSpeed = 12;
            ship.bulletSpeed = Math.max(ship.maxSpeed * 2.5, 30);
            ship.defense = 1;
            console.log(`🚀 Restored Speed Demon ship properties`);
        } else if (window.game.selectedShip === 2) {
            // Tank
            ship.thrust = 0.15;
            ship.maxSpeed = 8;
            ship.bulletSpeed = Math.max(ship.maxSpeed * 2.5, 20);
            ship.defense = 2;
            console.log(`🚀 Restored Tank ship properties`);
        } else if (window.game.selectedShip === 3) {
            // Balanced
            ship.thrust = 0.18;
            ship.maxSpeed = 10;
            ship.bulletSpeed = Math.max(ship.maxSpeed * 2.5, 25);
            ship.defense = 1;
            console.log(`🚀 Restored Balanced ship properties`);
        }
    }
    
    // Arrays for game objects
    const bullets = [];
    const asteroids = [];
    const enemies = [];  // Enemy ships that attack
    const enemyBullets = [];  // Bullets fired by enemies!
    const powerups = [];  // Hearts for health restoration
    const explosions = [];  // Explosion particles
    
    /* ========================================
       3. KEYBOARD INPUT
       ======================================== */
    
    const keys = {};
    
    window.addEventListener('keydown', (e) => {
        // ESC key: Toggle pause/resume (SINGLE SOURCE OF TRUTH)
        if (typeof window.game !== 'undefined' && window.game &&
            (window.game.state === 'playing' || window.game.state === 'paused') && e.code === 'Escape') {
            if (typeof window.togglePause === 'function') {
                window.togglePause();
            }
            e.preventDefault();
            return; // Don't process other keys when toggling pause
        }
        
        // CRITICAL: Don't process keyboard input when paused!
        if (typeof window.game !== 'undefined' && window.game && window.game.state === 'paused') {
            return; // Block all keys when paused (except ESC handled above)
        }
        
        keys[e.code] = true;
        
        // Start from welcome screen (NO SPACE! Use buttons only)
        // REMOVED space bar shortcut to prevent accidents
        
        // Start game from START screen
        if (typeof window.game !== 'undefined' && window.game && window.game.state === 'start' && e.code === 'Space') {
            startGame();
            e.preventDefault();
        }
        
        // Restart game
        if (typeof window.game !== 'undefined' && window.game && window.game.state === 'gameover' && e.code === 'Space') {
            restartGame();
            e.preventDefault();
        }
        
        // Shoot bullet (ONLY when playing, not paused!)
        if (typeof window.game !== 'undefined' && window.game && window.game.state === 'playing' && e.code === 'Space') {
            shootBullet();
            e.preventDefault();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });
    
    // CRITICAL: Clear all keys when game is paused to prevent input lag
    // This ensures no keys are "stuck" when resuming
    function clearKeysOnPause() {
        if (typeof window.game !== 'undefined' && window.game && window.game.state === 'paused') {
            // Clear all keyboard keys
            Object.keys(keys).forEach(key => {
                keys[key] = false;
            });
            // Also stop any drag operations
            isDragging = false;
            touchId = null;
        }
    }
    
    /* ========================================
       MOBILE TOUCH CONTROLS & MOUSE DRAG
       ======================================== */
    
    // Touch/Mouse drag state
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    // 📱 TOUCH & MOUSE: Track drag vs tap to prevent accidental bullets
    let touchDragging = false;
    let touchTapped = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let mouseDragging = false;
    let mouseTapped = false;
    let mouseStartX = 0;
    let mouseStartY = 0;
    
    // Touch state for mobile controls
    const touchState = {
        left: false,
        right: false,
        thrust: false,
        reverse: false,
        shoot: false
    };
    
    // 🖱 MOUSE: Improved drag vs tap detection (prevents accidental bullets)
    canvas.addEventListener('mousedown', (e) => {
        if (typeof window.game !== 'undefined' && window.game && window.game.state === 'playing') {
            const rect = canvas.getBoundingClientRect();
            mouseStartX = e.clientX - rect.left;
            mouseStartY = e.clientY - rect.top;
            mouseX = mouseStartX;
            mouseY = mouseStartY;
            mouseDragging = false;
            mouseTapped = true;  // Potential tap
            isDragging = true;
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging && typeof window.game !== 'undefined' && window.game && window.game.state === 'playing') {
            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            // Check if mouse moved significantly (it's a drag, not a tap)
            const moveDistance = Math.sqrt(
                Math.pow(currentX - mouseStartX, 2) + 
                Math.pow(currentY - mouseStartY, 2)
            );
            
            if (moveDistance > 5) {  // 5 pixel threshold
                mouseTapped = false;  // It's definitely a drag
                mouseDragging = true;
            }
            
            mouseX = currentX;
            mouseY = currentY;
            
            // Calculate angle from ship to mouse
            const dx = mouseX - ship.x;
            const dy = mouseY - ship.y;
            const targetAngle = Math.atan2(dy, dx);
            
            // Smoothly rotate ship towards mouse (using angular acceleration)
            let angleDiff = targetAngle - ship.rotation;
            // Normalize angle difference to [-PI, PI]
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            
            // 🔧 Natural angular acceleration (not overpowering injection)
            ship.angularVelocity += angleDiff * ship.angularAccel;
            
            // 🔧 Clamp angular velocity (prevents overshooting)
            ship.angularVelocity = Math.max(
                -ship.maxAngularSpeed,
                Math.min(ship.maxAngularSpeed, ship.angularVelocity)
            );
            
            // Apply thrust towards mouse (stronger during drag)
            ship.velocity.x += Math.cos(ship.rotation) * ship.thrust * 0.7;
            ship.velocity.y += Math.sin(ship.rotation) * ship.thrust * 0.7;
        }
    });
    
    canvas.addEventListener('mouseup', (e) => {
        // Only fire bullet if it was a tap (not a drag)
        if (mouseTapped && !mouseDragging && typeof window.game !== 'undefined' && window.game && window.game.state === 'playing') {
            shootBullet();
        }
        isDragging = false;
        mouseDragging = false;
        mouseTapped = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
        mouseDragging = false;
        mouseTapped = false;
    });
    
    // 📱 TOUCH: Improved drag vs tap detection (prevents accidental bullets while swiping)
    let touchId = null;
    canvas.addEventListener('touchstart', (e) => {
        if (typeof window.game !== 'undefined' && window.game && window.game.state === 'playing') {
            e.preventDefault(); // Prevent scrolling
            const touch = e.touches[0];
            touchId = touch.identifier;
            const rect = canvas.getBoundingClientRect();
            touchStartX = touch.clientX - rect.left;
            touchStartY = touch.clientY - rect.top;
            mouseX = touchStartX;
            mouseY = touchStartY;
            touchDragging = false;
            touchTapped = true;  // Potential tap
            isDragging = true;
        }
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (isDragging && touchId !== null && typeof window.game !== 'undefined' && window.game && window.game.state === 'playing') {
            e.preventDefault(); // Prevent scrolling
            const touch = Array.from(e.touches).find(t => t.identifier === touchId);
            if (touch) {
                const rect = canvas.getBoundingClientRect();
                const currentX = touch.clientX - rect.left;
                const currentY = touch.clientY - rect.top;
                
                // Check if touch moved significantly (it's a drag, not a tap)
                const moveDistance = Math.sqrt(
                    Math.pow(currentX - touchStartX, 2) + 
                    Math.pow(currentY - touchStartY, 2)
                );
                
                if (moveDistance > 5) {  // 5 pixel threshold
                    touchTapped = false;  // It's definitely a drag
                    touchDragging = true;
                }
                
                mouseX = currentX;
                mouseY = currentY;
                
                // Calculate angle from ship to touch
                const dx = mouseX - ship.x;
                const dy = mouseY - ship.y;
                const targetAngle = Math.atan2(dy, dx);
                
                // Smoothly rotate ship towards touch (using angular acceleration)
                let angleDiff = targetAngle - ship.rotation;
                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                
                // 🔧 Natural angular acceleration (not overpowering injection)
                ship.angularVelocity += angleDiff * ship.angularAccel;
                
                // 🔧 Clamp angular velocity (prevents overshooting)
                ship.angularVelocity = Math.max(
                    -ship.maxAngularSpeed,
                    Math.min(ship.maxAngularSpeed, ship.angularVelocity)
                );
                
                // Apply thrust towards touch (stronger during drag)
                ship.velocity.x += Math.cos(ship.rotation) * ship.thrust * 0.7;
                ship.velocity.y += Math.sin(ship.rotation) * ship.thrust * 0.7;
            }
        }
    });
    
    canvas.addEventListener('touchend', (e) => {
        if (touchId !== null) {
            const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
            if (touch) {
                // Only fire bullet if it was a tap (not a drag)
                if (touchTapped && !touchDragging && typeof window.game !== 'undefined' && window.game && window.game.state === 'playing') {
                    shootBullet();
                }
                isDragging = false;
                touchDragging = false;
                touchTapped = false;
                touchId = null;
            }
        }
    });
    
    canvas.addEventListener('touchcancel', () => {
        isDragging = false;
        touchDragging = false;
        touchTapped = false;
        touchId = null;
    });
    
    // Mobile on-screen controls
    function createMobileControls() {
        // Only show on mobile devices
        if (window.innerWidth > 768) return;
        
        // SHOOT BUTTON ON LEFT (for right-handed users - they use right hand to move, left to shoot)
        const controlsHTML = `
            <div class="mobile-controls" id="mobile-controls" style="display: none;">
                <div class="mobile-controls-left">
                    <button class="mobile-btn mobile-shoot" ontouchstart="handleMobileShoot()">🔫</button>
                </div>
                <div class="mobile-controls-right">
                    <button class="mobile-btn mobile-rotate-left" ontouchstart="handleMobileInput('left', true)" ontouchend="handleMobileInput('left', false)">←</button>
                    <button class="mobile-btn mobile-thrust" ontouchstart="handleMobileInput('thrust', true)" ontouchend="handleMobileInput('thrust', false)">↑</button>
                    <button class="mobile-btn mobile-rotate-right" ontouchstart="handleMobileInput('right', true)" ontouchend="handleMobileInput('right', false)">→</button>
                    <button class="mobile-btn mobile-reverse" ontouchstart="handleMobileInput('reverse', true)" ontouchend="handleMobileInput('reverse', false)">↓</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', controlsHTML);
    }
    
    // Show/hide mobile controls based on game state
    function updateMobileControlsVisibility() {
        const mobileControls = document.getElementById('mobile-controls');
        if (!mobileControls) return;
        
        // Only show during gameplay, hide on welcome/ship-selection screens
        if (typeof window.game !== 'undefined' && window.game && 
            (window.game.state === 'playing' || window.game.state === 'paused')) {
            if (window.innerWidth <= 768) {
                mobileControls.style.display = 'flex';
            }
        } else {
            mobileControls.style.display = 'none';
        }
    }
    
    // Handle mobile input
    window.handleMobileInput = function(action, pressed) {
        if (typeof window.game === 'undefined' || !window.game || window.game.state !== 'playing') return;
        
        touchState[action] = pressed;
        
        // Map to keyboard keys
        if (action === 'left') {
            keys['KeyA'] = pressed;
            keys['ArrowLeft'] = pressed;
        } else if (action === 'right') {
            keys['KeyD'] = pressed;
            keys['ArrowRight'] = pressed;
        } else if (action === 'thrust') {
            keys['KeyW'] = pressed;
            keys['ArrowUp'] = pressed;
        } else if (action === 'reverse') {
            keys['KeyS'] = pressed;
            keys['ArrowDown'] = pressed;
        }
    };
    
    // Handle mobile shoot
    window.handleMobileShoot = function() {
        if (typeof window.game !== 'undefined' && window.game && window.game.state === 'playing') {
            shootBullet();
        }
    };
    
    // Create mobile controls after DOM loads
    createMobileControls();
    
    // Show mobile warning if on mobile
    if (window.innerWidth <= 768) {
        const mobileWarning = document.getElementById('mobile-warning');
        if (mobileWarning) {
            mobileWarning.style.display = 'block';
        }
    }
    
    /* ========================================
       4. GAME OBJECT CLASSES
       ======================================== */
    
    class Bullet {
        constructor(x, y, angle, speed = 8, shipVelocity = { x: 0, y: 0 }) {
            this.x = x;
            this.y = y;
            // 🔥 CRITICAL FIX: Bullets inherit ship velocity (physically correct!)
            // This prevents bullets from lagging behind when ship is moving fast
            this.velocity = {
                x: Math.cos(angle) * speed + shipVelocity.x,
                y: Math.sin(angle) * speed + shipVelocity.y
            };
            this.life = 60; // Disappears after 60 frames (~1 second)
        }
        
        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.life--;
            
            // 🔥 BULLETS PASS THROUGH WALLS: Remove when they leave screen
            // Bullets should NOT wrap - they exit the world (ballistic behavior)
            if (
                this.x < -20 || this.x > canvas.width + 20 ||
                this.y < -20 || this.y > canvas.height + 20
            ) {
                this.life = 0;  // Kill bullet when it leaves screen
            }
        }
        
        draw() {
            ctx.fillStyle = '#0f0';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    class Asteroid {
        constructor(x, y, size) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.size = size || 'large'; // 'large', 'medium', 'small'
            this.radius = size === 'large' ? 40 : size === 'medium' ? 25 : 15;
            
            // Random velocity
            const speed = 0.5 + Math.random() * 1.5;
            const angle = Math.random() * Math.PI * 2;
            this.velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            
            // Random rotation
            this.rotation = 0;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            
            // Random shape (8 points)
            this.points = [];
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const variance = 0.7 + Math.random() * 0.6;
                this.points.push({
                    x: Math.cos(angle) * this.radius * variance,
                    y: Math.sin(angle) * this.radius * variance
                });
            }
        }
        
        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.rotation += this.rotationSpeed;
            
            // Screen wrapping
            if (this.x < -this.radius) this.x = canvas.width + this.radius;
            if (this.x > canvas.width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = canvas.height + this.radius;
            if (this.y > canvas.height + this.radius) this.y = -this.radius;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.closePath();
            ctx.stroke();
            
            ctx.restore();
        }
    }
    
    /* ========================================
       5. GAME LOGIC FUNCTIONS
       ======================================== */
    
    function updateShip() {
        if (typeof window.game === 'undefined' || !window.game || window.game.state !== 'playing') return;
        
        // 🔒 LOCK ROTATION WHILE SHOOTING - prevents accidental spins!
        const isShooting = keys['Space'];
        
        // 🔧 REAL ANGULAR DAMPING: Use angular velocity (not angle corruption)
        // Rotate left (ONLY when not shooting)
        if (!isShooting && (keys['KeyA'] || keys['ArrowLeft'])) {
            ship.angularVelocity -= ship.rotationSpeed;
        }
        
        // Rotate right (ONLY when not shooting)
        if (!isShooting && (keys['KeyD'] || keys['ArrowRight'])) {
            ship.angularVelocity += ship.rotationSpeed;
        }
        
        // 🔧 CLAMP angular velocity (prevents overshooting, natural feel)
        ship.angularVelocity = Math.max(
            -ship.maxAngularSpeed,
            Math.min(ship.maxAngularSpeed, ship.angularVelocity)
        );
        
        // Apply angular velocity to rotation
        ship.rotation += ship.angularVelocity;
        
        // Apply angular friction (smooth rotation stop - ship can stand still!)
        ship.angularVelocity *= ship.angularFriction;
        
        // Thrust forward
        if (keys['KeyW'] || keys['ArrowUp']) {
            ship.velocity.x += Math.cos(ship.rotation) * ship.thrust;
            ship.velocity.y += Math.sin(ship.rotation) * ship.thrust;
        }
        
        // Reverse thrust (NEW!)
        if (keys['KeyS'] || keys['ArrowDown']) {
            ship.velocity.x -= Math.cos(ship.rotation) * ship.thrust * 0.5;  // 50% reverse power
            ship.velocity.y -= Math.sin(ship.rotation) * ship.thrust * 0.5;
        }
        
        // Limit max speed
        const speed = Math.sqrt(ship.velocity.x ** 2 + ship.velocity.y ** 2);
        if (speed > ship.maxSpeed) {
            ship.velocity.x = (ship.velocity.x / speed) * ship.maxSpeed;
            ship.velocity.y = (ship.velocity.y / speed) * ship.maxSpeed;
        }
        
        // Apply friction
        ship.velocity.x *= ship.friction;
        ship.velocity.y *= ship.friction;
        
        // Update position
        ship.x += ship.velocity.x;
        ship.y += ship.velocity.y;
        
        // 🔥 HARD WALLS: Ship is BLOCKED by walls (no wrapping!)
        // Bullets can pass through, but ship cannot
        const margin = ship.size;
        
        if (ship.x < margin) {
            ship.x = margin;
            ship.velocity.x = 0;  // Stop at wall
        }
        if (ship.x > canvas.width - margin) {
            ship.x = canvas.width - margin;
            ship.velocity.x = 0;  // Stop at wall
        }
        if (ship.y < margin) {
            ship.y = margin;
            ship.velocity.y = 0;  // Stop at wall
        }
        if (ship.y > canvas.height - margin) {
            ship.y = canvas.height - margin;
            ship.velocity.y = 0;  // Stop at wall
        }
        
        // Decrease invulnerability
        if (typeof window.game !== 'undefined' && window.game && window.game.invulnerable > 0) {
            window.game.invulnerable--;
        }
    }
    
    // 🔒 Lock aim at fire time (prevents touch/mouse jitter from affecting shots)
    let lastFireAngle = null;
    
    function shootBullet() {
        if (typeof window.game === 'undefined' || !window.game || window.game.state !== 'playing') return;
        
        // 🔒 Capture aim ONCE at fire time (prevents rotation drift during shot)
        const fireAngle = ship.rotation;
        lastFireAngle = fireAngle;
        
        // Calculate bullet spawn position (at ship's nose)
        const bulletX = ship.x + Math.cos(fireAngle) * ship.size;
        const bulletY = ship.y + Math.sin(fireAngle) * ship.size;
        
        // Use ship-specific bullet speed (should be ≥ 2.5× maxSpeed)
        const bulletSpeed = ship.bulletSpeed || 25;
        
        // 🔥 CRITICAL: Pass ship velocity so bullets inherit momentum
        bullets.push(new Bullet(
            bulletX,
            bulletY,
            fireAngle,
            bulletSpeed,
            ship.velocity  // Bullets inherit ship velocity!
        ));
        
        // Play shoot sound
        sounds.shoot();
    }
    
    function updateBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].update();
            
            // Remove dead bullets
            if (bullets[i].life <= 0) {
                bullets.splice(i, 1);
            }
        }
    }
    
    function updateAsteroids() {
        // 🔧 FIX: Don't update asteroids when game is paused
        if (typeof window.game === 'undefined' || !window.game || window.game.state !== 'playing') return;
        asteroids.forEach(asteroid => asteroid.update());
    }
    
    function spawnAsteroids(count) {
        for (let i = 0; i < count; i++) {
            // Spawn away from ship
            let x, y;
            do {
                x = Math.random() * canvas.width;
                y = Math.random() * canvas.height;
            } while (distance(x, y, ship.x, ship.y) < 150);
            
            asteroids.push(new Asteroid(x, y, 'large'));
        }
    }
    
    function checkCollisions() {
        if (typeof window.game === 'undefined' || !window.game || window.game.state !== 'playing') return;
        
        // Check bullet-asteroid collisions
        for (let i = bullets.length - 1; i >= 0; i--) {
            for (let j = asteroids.length - 1; j >= 0; j--) {
                if (distance(bullets[i].x, bullets[i].y, asteroids[j].x, asteroids[j].y) < asteroids[j].radius) {
                    // Hit!
                    const asteroid = asteroids[j];
                    
                    // Add score
                    if (typeof window.game !== 'undefined' && window.game) {
                        if (asteroid.size === 'large') window.game.score += 20;
                        if (asteroid.size === 'medium') window.game.score += 50;
                        if (asteroid.size === 'small') window.game.score += 100;
                    }
                    
                    // EXPLOSION EFFECT!
                    createExplosion(asteroid.x, asteroid.y, asteroid.radius);
                    
                    // Play explosion sound
                    sounds.explode();
                    
                    // Check for level-up (Phase 4)
                    checkLevelUp();
                    
                    // Split asteroid
                    if (asteroid.size === 'large') {
                        asteroids.push(new Asteroid(asteroid.x, asteroid.y, 'medium'));
                        asteroids.push(new Asteroid(asteroid.x, asteroid.y, 'medium'));
                    } else if (asteroid.size === 'medium') {
                        asteroids.push(new Asteroid(asteroid.x, asteroid.y, 'small'));
                        asteroids.push(new Asteroid(asteroid.x, asteroid.y, 'small'));
                    }
                    
                    // Remove bullet and asteroid
                    bullets.splice(i, 1);
                    asteroids.splice(j, 1);
                    break;
                }
            }
        }
        
        // Check bullet-enemy collisions (SHOOT SHARKS TO KILL THEM!)
        for (let i = bullets.length - 1; i >= 0; i--) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (distance(bullets[i].x, bullets[i].y, enemies[j].x, enemies[j].y) < enemies[j].size + 5) {
                    // Hit enemy!
                    createExplosion(enemies[j].x, enemies[j].y, enemies[j].size);
                    sounds.explode();
                    
                    // Add score for killing enemy
                    if (typeof window.game !== 'undefined' && window.game) {
                        window.game.score += 150;  // More points than asteroids!
                    }
                    checkLevelUp();
                    
                    // Remove bullet and enemy
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    break;
                }
            }
        }
        
        // Check ship-asteroid collisions
        if (typeof window.game !== 'undefined' && window.game && window.game.invulnerable <= 0) {
            for (let i = 0; i < asteroids.length; i++) {
                if (distance(ship.x, ship.y, asteroids[i].x, asteroids[i].y) < ship.size + asteroids[i].radius) {
                    // Tank ship is immune to asteroids!
                    if (window.game.selectedShip === 2) {
                        // Just bounce off
                        window.game.invulnerable = 90;  // 1.5 seconds invulnerability to prevent multiple hits
                        break;
                    }
                    
                    // Other ships take damage
                    handleShipHit();
                    break;
                }
            }
        }
        
        // Level complete - spawn more asteroids (FURTHER REDUCED for easier gameplay)
        // 🔧 FIX: Don't increment level here - checkLevelUp() handles level progression
        // This prevents double level increment and conflicts with level-up modal
        if (typeof window.game !== 'undefined' && window.game && 
            asteroids.length === 0 && window.game.state === 'playing') {
            // Just spawn asteroids for current level (level-up is handled by checkLevelUp)
            const asteroidCount = Math.min(2 + Math.floor(window.game.level / 3), 4);
            spawnAsteroids(asteroidCount);
            console.log(`✅ Spawned ${asteroidCount} asteroids for level ${window.game.level}`);
        }
    }
    
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    /* ========================================
       6. DRAWING FUNCTIONS
       ======================================== */
    
    function drawShip() {
        // Flicker when invulnerable
        if (typeof window.game !== 'undefined' && window.game && 
            window.game.invulnerable > 0 && Math.floor(window.game.invulnerable / 10) % 2 === 0) {
            return;
        }
        
        // 🎨 WALL WARNING: Yellow glow when near walls (UX polish)
        // Check BEFORE transform (use world coordinates)
        const nearWall = (
            ship.x < ship.size + 10 ||
            ship.x > canvas.width - ship.size - 10 ||
            ship.y < ship.size + 10 ||
            ship.y > canvas.height - ship.size - 10
        );
        
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.rotation);
        
        // Draw ship (triangle)
        ctx.strokeStyle = nearWall ? '#ff0' : '#0f0';  // Yellow warning near walls
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ship.size, 0);
        ctx.lineTo(-ship.size, ship.size * 0.7);
        ctx.lineTo(-ship.size * 0.5, 0);
        ctx.lineTo(-ship.size, -ship.size * 0.7);
        ctx.closePath();
        ctx.stroke();
        
        // Thrust flame
        if ((keys['KeyW'] || keys['ArrowUp']) && 
            typeof window.game !== 'undefined' && window.game && window.game.state === 'playing') {
            ctx.strokeStyle = '#f80';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-ship.size * 0.5, ship.size * 0.4);
            ctx.lineTo(-ship.size - 8, 0);
            ctx.lineTo(-ship.size * 0.5, -ship.size * 0.4);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * 📱 Visual Aim Circle - Shows where ship is aiming during drag
     * Provides visual feedback for touch/mouse users
     */
    function drawAimCircle() {
        if ((touchDragging || mouseDragging) && 
            typeof window.game !== 'undefined' && window.game && window.game.state === 'playing') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);  // Dashed line for visual effect
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);  // Reset line dash
            
            // Draw line from ship to aim point
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ship.x, ship.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
        }
    }
    
    function drawBullets() {
        bullets.forEach(bullet => bullet.draw());
    }
    
    function drawAsteroids() {
        asteroids.forEach(asteroid => asteroid.draw());
    }
    
    function drawUI() {
        if (typeof window.game !== 'undefined' && window.game) {
            const scoreEl = document.getElementById('score');
            const livesEl = document.getElementById('lives');
            const levelEl = document.getElementById('level');
            if (scoreEl) scoreEl.textContent = window.game.score;
            if (livesEl) livesEl.textContent = window.game.lives;
            if (levelEl) levelEl.textContent = window.game.level;
        }
    }
    
    function drawStartScreen() {
        ctx.fillStyle = '#0f0';
        ctx.font = '48px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('VECTOR ASTEROIDS', canvas.width / 2, canvas.height / 2 - 50);
        
        ctx.font = '24px Courier New';
        ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2 + 20);
        
        ctx.font = '16px Courier New';
        ctx.fillStyle = '#888';
        ctx.fillText('W/↑ = Thrust  |  A/← D/→ = Rotate  |  SPACE = Shoot', canvas.width / 2, canvas.height / 2 + 80);
    }
    
    /* ========================================
       7. GAME STATE MANAGEMENT
       ======================================== */
    
    function startGame() {
        if (typeof window.game === 'undefined' || !window.game) {
            console.error('❌ Cannot start game - game object not initialized');
            return;
        }
        
        window.game.state = 'playing';
        // Don't reset score/level if they were set in settings!
        if (window.game.score === 0 && window.game.level === 1) {
            window.game.score = 0;
            window.game.level = 1;
        }
        // Lives are set by ship selection, don't override
        window.game.invulnerable = 120;
        
        // 🔧 Save game state when starting
        saveGameState();
        
        // Hide welcome settings if it's showing
        const welcomeSettings = document.getElementById('welcome-settings');
        if (welcomeSettings) {
            welcomeSettings.style.display = 'none';
        }
        
        // Hide in-game settings if it's showing
        const inGameSettings = document.getElementById('in-game-settings');
        if (inGameSettings) {
            inGameSettings.classList.remove('active');
        }
        
        // Show game UI when game starts
        const gameUI = document.querySelector('.game-ui');
        if (gameUI) {
            gameUI.style.display = 'flex';
        }
        
        // Show mobile controls when game starts
        if (typeof updateMobileControlsVisibility === 'function') {
            updateMobileControlsVisibility();
        }
        
        // Reset ship
        ship.x = canvas.width / 2;
        ship.y = canvas.height / 2;
        ship.rotation = -Math.PI / 2;
        ship.velocity = { x: 0, y: 0 };
        
        // Clear everything
        asteroids.length = 0;
        bullets.length = 0;
        enemies.length = 0;
        enemyBullets.length = 0;  // Clear shark bullets!
        powerups.length = 0;
        explosions.length = 0;
        
        // Spawn asteroids based on level (REDUCED for easier gameplay)
        // Reduced: was 4 + window.game.level (max 10), now max 6 asteroids
        const asteroidCount = Math.min(2 + Math.floor(window.game.level / 3), 4);
        spawnAsteroids(asteroidCount);
        
        // 🎵 Start background music when game starts
        if (typeof window.playMusic === 'function') {
            window.playMusic();
        }
        
        // If level >= 2, spawn enemies immediately!
        if (window.game.level >= 2) {
            const enemyCount = Math.min(window.game.level - 1, 5);  // Level 2 = 1 enemy, Level 3 = 2, etc.
            for (let i = 0; i < enemyCount; i++) {
                setTimeout(() => createEnemy(), i * 1000);  // Stagger spawns by 1 second
            }
            console.log(`🦈 Spawned ${enemyCount} enemies immediately (Level ${window.game.level})!`);
        }
    }
    
    function gameOver() {
        if (typeof window.game === 'undefined' || !window.game) {
            console.error('❌ Cannot end game - game object not initialized');
            return;
        }
        
        window.game.state = 'gameover';
        
        const finalScoreEl = document.getElementById('final-score');
        const finalLevelEl = document.getElementById('final-level');
        const gameOverEl = document.getElementById('game-over');
        
        if (finalScoreEl) finalScoreEl.textContent = window.game.score;
        if (finalLevelEl) finalLevelEl.textContent = window.game.level;
        if (gameOverEl) gameOverEl.style.display = 'block';
        
        // 🎵 Stop background music on game over
        if (typeof window.stopMusic === 'function') {
            window.stopMusic();
        }
        
        // 🔧 Clear saved game state on game over
        try {
            localStorage.removeItem('vectorGameState');
        } catch (e) {
            console.warn('Could not clear game state:', e);
        }
        
        // PHASE 2: Submit score to backend
        if (typeof submitScore === 'function') {
            submitScore();
        }
    }
    
    function restartGame() {
        document.getElementById('game-over').style.display = 'none';
        startGame();
    }
    
    /* ========================================
       7.5 SCORE SUBMISSION (PHASE 2)
       ======================================== */
    
    /**
     * Submit score to WordPress backend via AJAX
     * PHASE 2: Data is sent but not stored yet
     */
    /**
     * Submit score to Supabase
     */
    async function submitScoreToSupabase(playerName, score, level) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    player_name: playerName || "Anonymous",
                    score: Number(score),
                    level: Number(level)
                })
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }
            
            console.log("✅ Score saved to Supabase");
            return true;
        } catch (e) {
            console.error("❌ Score save failed:", e);
            return false;
        }
    }
    
    function submitScore() {
        // Prompt player for their name
        const playerName = prompt('Game Over! Enter your name for the leaderboard:', 'Anonymous');
        
        // If player cancels, use Anonymous
        const finalName = playerName && playerName.trim() !== '' ? playerName.trim() : 'Anonymous';
        
        const score = (typeof window.game !== 'undefined' && window.game) ? window.game.score : 0;
        const level = (typeof window.game !== 'undefined' && window.game) ? window.game.level : 1;
        
        // Submit to Supabase
        submitScoreToSupabase(finalName, score, level)
            .then(success => {
                if (success) {
                    console.log(`✅ Score saved! ${finalName}: ${score} points (Level ${level})`);
                    // Optionally show success message
                } else {
                    alert('Failed to save score. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error submitting score:', error);
                alert('Network error while submitting score. Please check your connection.');
            });
    }
    
    /* ========================================
       8. MAIN GAME LOOP
       ======================================== */
    
    /**
     * The game loop runs at ~60fps
     * Updates game state and renders everything
     */
    function gameLoop() {
        // CRITICAL: Don't render game when UI screens are showing!
        // This prevents the game background from showing through overlays
        if (typeof window.game === 'undefined' || !window.game) {
            // Game not initialized yet, just show black screen
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(gameLoop);
            return;
        }
        
        if (window.game.state === 'welcome' || window.game.state === 'shipselect') {
            // Just show black screen - UI overlays handle the display
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(gameLoop);
            return; // Exit early - don't render anything else!
        }
        
        // Clear screen
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw background grid
        drawGrid();
        
        if (window.game.state === 'start') {
            drawStartScreen();
        } else if (window.game.state === 'paused') {
            // CRITICAL: Clear all input when paused to prevent any updates
            clearKeysOnPause();
            
            // Keep drawing but don't update (frozen game)
            drawAsteroids();
            drawExplosions();
            drawBullets();
            drawEnemies();
            drawPowerups();
            drawShip();
            drawAimCircle();  // 📱 Visual feedback (if was dragging before pause)
            drawUI(); // Also draw UI when paused
        } else if (window.game.state === 'playing') {
            // Update frame counter
            window.game.frameCount++;
            
            // Spawn enemies MORE frequently at higher levels!
            if (window.game.level >= 2) {
                // Level 2: every 8 seconds, Level 3: every 6s, Level 4: every 4s, Level 5+: every 3s
                const spawnRate = Math.max(180, 480 - (window.game.level * 60));  // 480=8s, decrease by 1s per level, min 180=3s
                if (window.game.frameCount % spawnRate === 0) {
                    createEnemy();
                    console.log(`👾 Enemy spawned! Level ${window.game.level}, Rate: ${spawnRate/60}s`);
                }
            }
            
            // Spawn powerups MORE frequently (every 8 seconds)
            if (window.game.frameCount % 480 === 0) {  // 480 frames = 8 seconds at 60fps
                if (window.game.lives < window.game.maxLives) {  // Only if not at max health
                    createPowerup();
                    console.log('💖 Heart spawned!');
                }
            }
            
            // Update
            updateShip();
            updateBullets();
            updateAsteroids();
            updateEnemies();  // Phase 5: Enemy ships
            updateEnemyBullets();  // Phase 5: Shark bullets!
            updatePowerups();  // Phase 5: Power-ups
            updateExplosions();  // Phase 5: Explosions!
            checkCollisions();
            
            // Draw (back to front)
            drawAsteroids();
            drawExplosions();  // Phase 5: Draw explosions BEHIND everything
            drawBullets();
            drawEnemyBullets();  // Phase 5: RED shark bullets!
            drawEnemies();  // Phase 5: Draw enemies
            drawPowerups();  // Phase 5: Draw powerups
            drawShip();
            drawAimCircle();  // 📱 Visual feedback for touch/mouse drag
            drawUI();
        } else if (window.game.state === 'gameover') {
            // Still draw game objects on game over screen
            drawAsteroids();
            drawBullets();
        }
        
        // Next frame
        requestAnimationFrame(gameLoop);
    }
    
    /* ========================================
       9. VISUAL EFFECTS
       ======================================== */
    
    function drawGrid() {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
        ctx.lineWidth = 1;
        
        const gridSize = 50;
        
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    /* ========================================
       9. PHASE 4 & 5: UI FUNCTIONS, SHIP SELECTION & SOUNDS
       ======================================== */
    
    // Sound Effects (Simple beep sounds using Web Audio API)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playSound(frequency, duration, volume = 0.1) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // Sound effect functions
    const sounds = {
        shoot: () => playSound(220, 0.1, 0.05),
        explode: () => {
            playSound(100, 0.3, 0.1);
            setTimeout(() => playSound(50, 0.2, 0.1), 100);
        },
        enemyShoot: () => playSound(180, 0.15, 0.05),
        powerup: () => {
            playSound(440, 0.1, 0.05);
            setTimeout(() => playSound(554, 0.1, 0.05), 100);
            setTimeout(() => playSound(659, 0.1, 0.05), 200);
        },
        levelUp: () => {
            playSound(523, 0.15, 0.08);
            setTimeout(() => playSound(659, 0.15, 0.08), 150);
            setTimeout(() => playSound(784, 0.3, 0.08), 300);
        },
        hurt: () => playSound(150, 0.3, 0.08)
    };
    
    /* ========================================
       🎵 BACKGROUND MUSIC CONTROLLER
       ======================================== */
    
    // 🎵 Background music - plays only during gameplay
    // Hosted on Internet Archive (free, no bandwidth limits, works on GitHub Pages)
    // Direct download URL: https://archive.org/download/audio_20251224/audio.mp3
    let bgMusic;
    try {
        bgMusic = new Audio('https://archive.org/download/audio_20251224/audio.mp3');
        // Add error listener for debugging
        bgMusic.addEventListener('error', function(e) {
            console.error('❌ Audio file failed to load from Internet Archive');
            console.error('URL: https://archive.org/download/audio_20251224/audio.mp3');
        });
        bgMusic.addEventListener('loadeddata', function() {
            console.log('✅ Background music loaded successfully from Internet Archive');
        });
    } catch (e) {
        console.error('Failed to create Audio object:', e);
        bgMusic = null;
    }
    
    // Only set properties if bgMusic was created successfully
    if (bgMusic) {
        bgMusic.loop = true;  // Loop the 23-minute track
        bgMusic.volume = 0.35;  // 35% volume (subtle, not overpowering)
        bgMusic.preload = 'auto';
    }
    
    // Make bgMusic globally accessible for stub functions
    window._bgMusic = bgMusic;
    
    // Track music state
    let musicEnabled = true;
    
    // Override the stub functions with real implementations
    window.playMusic = function() {
        if (!musicEnabled) return;
        if (!bgMusic) {
            console.warn('⚠️ Background music not available');
            return;
        }
        if (bgMusic.paused) {
            bgMusic.play().catch((error) => {
                // Browser blocked it or file not found - log for debugging
                console.warn('🎵 Music failed to play:', error);
                console.warn('Audio file path:', bgMusic.src);
            });
        }
    };
    
    window.pauseMusic = function() {
        if (!bgMusic.paused) {
            bgMusic.pause();
        }
    };
    
    window.stopMusic = function() {
        bgMusic.pause();
        bgMusic.currentTime = 0;  // Reset to beginning
    };
    
    // 🎵 MOBILE SAFETY: Unlock audio on first user interaction
    function unlockAudio() {
        // Resume Web Audio (for SFX)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        // Try starting music
        playMusic();
        // Remove listeners after first unlock
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('click', unlockAudio);
    }
    
    // Listen for user interaction to unlock audio
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('click', unlockAudio);
    
    /**
     * Override selectShip with full implementation (now that game/ship objects exist)
     */
    const originalSelectShip = window.selectShip;
    window.selectShip = function(shipNumber) {
        console.log('🚀 selectShip() called with ship:', shipNumber);
        
        if (typeof window.game === 'undefined' || !window.game) {
            console.error('❌ Game object not available!');
            return;
        }
        
        window.game.selectedShip = shipNumber;
        
        // Reset ship hit count
        window.game.shipHitCount = 0;
        
        // Update ship properties based on selection
        if (shipNumber === 1) {
            // Speed Demon: Fast, strong bullets, weak defense
            ship.thrust = 0.25;  // 67% faster than normal!
            ship.maxSpeed = 12;
            // 🔥 Bullet speed MUST be ≥ 2.5× maxSpeed (arcade physics rule)
            ship.bulletSpeed = Math.max(ship.maxSpeed * 2.5, 30);  // 30 (was 8)
            window.game.lives = 5;
            window.game.maxLives = 5;
            ship.defense = 1;  // 1 hit = dead
            console.log('⚡ Speed Demon selected: Thrust=0.25, MaxSpeed=12, BulletSpeed=30, Lives=5');
        } else if (shipNumber === 2) {
            // Tank: Slow bullets, high defense, immune to asteroids
            ship.thrust = 0.15;  // Normal speed
            ship.maxSpeed = 8;
            // 🔥 Bullet speed MUST be ≥ 2.5× maxSpeed (arcade physics rule)
            ship.bulletSpeed = Math.max(ship.maxSpeed * 2.5, 20);  // 20 (was 4)
            window.game.lives = 5;
            window.game.maxLives = 5;
            ship.defense = 2;  // 2 hits to die
            console.log('🛡️ Tank selected: Thrust=0.15, MaxSpeed=8, BulletSpeed=20, Defense=2, Lives=5');
        } else if (shipNumber === 3) {
            // Balanced: Normal everything, but only 3 lives
            ship.thrust = 0.18;
            ship.maxSpeed = 10;
            // 🔥 Bullet speed MUST be ≥ 2.5× maxSpeed (arcade physics rule)
            ship.bulletSpeed = Math.max(ship.maxSpeed * 2.5, 25);  // 25 (was 6)
            window.game.lives = 3;  // ONLY 3 LIVES!
            window.game.maxLives = 3;  // MAX 3!
            ship.defense = 1;
            console.log('⚔️ Balanced selected: Thrust=0.18, MaxSpeed=10, BulletSpeed=25, Lives=3 ONLY!');
        }
        
        // 🔥 ENFORCE: Bullet speed must be ≥ 2.5× maxSpeed (global rule)
        ship.bulletSpeed = Math.max(ship.maxSpeed * 2.5, ship.bulletSpeed || 25);
        
        // Hide ship selection, show start screen
        const shipSelectionScreen = document.getElementById('ship-selection-screen');
        if (shipSelectionScreen) {
            shipSelectionScreen.style.display = 'none';
        }
        window.game.state = 'start';
        
        // Update lives display
        const livesElement = document.getElementById('lives');
        if (livesElement) {
            livesElement.textContent = window.game.lives;
        }
        
        console.log('✅ Ship selected and configured');
    };
    
    /**
     * Override backToWelcome with full implementation
     */
    const originalBackToWelcome = window.backToWelcome;
    window.backToWelcome = function() {
        console.log('🔙 backToWelcome() called (full implementation)');
        
        const shipSelectionScreen = document.getElementById('ship-selection-screen');
        if (shipSelectionScreen) {
            shipSelectionScreen.style.display = 'none';
        }
        
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
        }
        
        if (typeof window.game !== 'undefined' && window.game) {
            window.game.state = 'welcome';
        }
        
        // 🎵 Stop background music when returning to welcome screen
        if (typeof stopMusic === 'function') {
            stopMusic();
        }
        
        // Hide game UI when on welcome screen
        const gameUI = document.querySelector('.game-ui');
        if (gameUI) {
            gameUI.style.display = 'none';
        }
        
        // Hide mobile controls on welcome screen
        if (typeof updateMobileControlsVisibility === 'function') {
            updateMobileControlsVisibility();
        }
        
        console.log('✅ Returned to welcome screen');
    };
    
    /**
     * Override showShipSelection with full implementation
     */
    const originalShowShipSelection = window.showShipSelection;
    window.showShipSelection = function() {
        console.log('🚀 showShipSelection() called (full implementation)');
        
        // Ensure game object exists
        if (typeof window.game === 'undefined' || !window.game) {
            console.error('❌ Game object not available! Waiting for initialization...');
            setTimeout(() => {
                if (typeof window.game !== 'undefined' && window.game) {
                    window.showShipSelection();
                } else {
                    alert('ERROR: Game not initialized. Please refresh the page.');
                }
            }, 100);
            return;
        }
        
        // Hide welcome screen
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
            console.log('✅ Welcome screen hidden');
        } else {
            console.error('❌ Welcome screen element not found!');
        }
        
        // Hide welcome settings if it's showing
        const welcomeSettings = document.getElementById('welcome-settings');
        if (welcomeSettings) {
            welcomeSettings.style.display = 'none';
        }
        
        // Show ship selection screen
        const shipSelectionScreen = document.getElementById('ship-selection-screen');
        if (shipSelectionScreen) {
            shipSelectionScreen.style.display = 'flex';
            console.log('✅ Ship selection screen shown');
        } else {
            console.error('❌ Ship selection screen element not found!');
            alert('ERROR: Ship selection screen not found. Please refresh the page.');
            return;
        }
        
        // Update game state
        window.game.state = 'shipselect';
        console.log('✅ Game state set to:', window.game.state);
        
        // 🎵 Stop background music on ship selection screen
        if (typeof stopMusic === 'function') {
            stopMusic();
        }
        
        // Hide game UI when on ship selection screen
        const gameUI = document.querySelector('.game-ui');
        if (gameUI) {
            gameUI.style.display = 'none';
        }
        
        // Hide mobile controls on ship selection screen
        if (typeof updateMobileControlsVisibility === 'function') {
            updateMobileControlsVisibility();
        }
        
        console.log('✅ Ship selection screen ready');
    };
    
    /**
     * Start game from welcome screen (now goes to ship selection)
     */
    window.startGameFromWelcome = function() {
        showShipSelection();
    };
    
    /**
     * Create explosion particles
     */
    function createExplosion(x, y, size) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 3;
            explosions.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 30 + Math.random() * 20,  // 0.5-0.8 seconds
                maxLife: 50,
                size: size / 10
            });
        }
    }
    
    /**
     * Update explosions
     */
    function updateExplosions() {
        // 🔧 FIX: Don't update explosions when game is paused
        if (typeof window.game === 'undefined' || !window.game || window.game.state !== 'playing') return;
        
        for (let i = explosions.length - 1; i >= 0; i--) {
            const exp = explosions[i];
            exp.x += exp.vx;
            exp.y += exp.vy;
            exp.vx *= 0.95;  // Friction
            exp.vy *= 0.95;
            exp.life--;
            
            if (exp.life <= 0) {
                explosions.splice(i, 1);
            }
        }
    }
    
    /**
     * Draw explosions
     */
    function drawExplosions() {
        explosions.forEach(exp => {
            const alpha = exp.life / exp.maxLife;
            const colors = ['#ff0', '#f80', '#f00'];
            const colorIndex = Math.floor((1 - alpha) * colors.length);
            
            ctx.fillStyle = colors[Math.min(colorIndex, colors.length - 1)];
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(exp.x, exp.y, exp.size * (1 + (1 - alpha)), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }
    
    /**
     * Create enemy ship
     */
    function createEnemy() {
        const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
        let x, y, vx, vy;
        
        // Spawn from random edge
        if (side === 0) { // Top
            x = Math.random() * canvas.width;
            y = -20;
            vx = (Math.random() - 0.5) * 2;
            vy = 1 + Math.random();
        } else if (side === 1) { // Right
            x = canvas.width + 20;
            y = Math.random() * canvas.height;
            vx = -(1 + Math.random());
            vy = (Math.random() - 0.5) * 2;
        } else if (side === 2) { // Bottom
            x = Math.random() * canvas.width;
            y = canvas.height + 20;
            vx = (Math.random() - 0.5) * 2;
            vy = -(1 + Math.random());
        } else { // Left
            x = -20;
            y = Math.random() * canvas.height;
            vx = 1 + Math.random();
            vy = (Math.random() - 0.5) * 2;
        }
        
        enemies.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: 20,
            hasShot: false,  // Track if this shark has already shot (ONE SHOT ONLY!)
            shootDelay: 60 + Math.random() * 60  // Random delay before shooting (1-2 seconds)
        });
    }
    
    /**
     * Create power-up (heart)
     */
    function createPowerup() {
        powerups.push({
            x: Math.random() * canvas.width,
            y: -20,
            vy: 1 + Math.random() * 0.5,
            size: 15
        });
    }
    
    /**
     * Update enemies
     */
    function updateEnemies() {
        // 🔧 FIX: Don't update enemies when game is paused
        if (typeof window.game === 'undefined' || !window.game || window.game.state !== 'playing') return;
        
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            
            // Move enemy
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
            
            // Remove if off-screen
            if (enemy.x < -50 || enemy.x > canvas.width + 50 ||
                enemy.y < -50 || enemy.y > canvas.height + 50) {
                enemies.splice(i, 1);
                continue;
            }
            
            // SHARK SHOOTING LOGIC! 🦈💥 (ONE SHOT ONLY!)
            if (!enemy.hasShot) {
                enemy.shootDelay--;
                if (enemy.shootDelay <= 0) {
                    // Shoot ONCE at player! (straight line, not tracking)
                    const angle = Math.atan2(ship.y - enemy.y, ship.x - enemy.x);
                    enemyBullets.push({
                        x: enemy.x,
                        y: enemy.y,
                        vx: Math.cos(angle) * 4,  // ⬇ SLOWER bullet speed - dodgeable, skill-based
                        vy: Math.sin(angle) * 4,
                        life: 120  // Lasts 2 seconds
                    });
                    enemy.hasShot = true;  // Mark as shot - this shark will NEVER shoot again!
                    if (sounds.shoot) sounds.shoot();  // Pew pew!
                }
            }
            
            // Check collision with player
            const dx = ship.x - enemy.x;
            const dy = ship.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < ship.size + enemy.size && 
                (typeof window.game === 'undefined' || !window.game || window.game.invulnerable === 0)) {
                handleShipHit();
                sounds.hurt();
                enemies.splice(i, 1);
            }
        }
    }
    
    /**
     * Update enemy bullets
     */
    function updateEnemyBullets() {
        // 🔧 FIX: Don't update enemy bullets when game is paused
        if (typeof window.game === 'undefined' || !window.game || window.game.state !== 'playing') return;
        
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            const bullet = enemyBullets[i];
            
            // Move bullet
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;
            
            // Remove if dead or off-screen
            if (bullet.life <= 0 ||
                bullet.x < 0 || bullet.x > canvas.width ||
                bullet.y < 0 || bullet.y > canvas.height) {
                enemyBullets.splice(i, 1);
                continue;
            }
            
            // Check collision with player
            const dx = ship.x - bullet.x;
            const dy = ship.y - bullet.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < ship.size + 3 && 
                (typeof window.game === 'undefined' || !window.game || window.game.invulnerable === 0)) {
                handleShipHit();
                sounds.hurt();
                enemyBullets.splice(i, 1);
                createExplosion(bullet.x, bullet.y, 5);
            }
        }
    }
    
    /**
     * Draw enemy bullets (RED!)
     */
    function drawEnemyBullets() {
        enemyBullets.forEach(bullet => {
            ctx.fillStyle = '#f00';
            ctx.shadowColor = '#f00';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }
    
    /**
     * Update powerups
     */
    function updatePowerups() {
        // 🔧 FIX: Don't update powerups when game is paused
        if (typeof window.game === 'undefined' || !window.game || window.game.state !== 'playing') return;
        
        for (let i = powerups.length - 1; i >= 0; i--) {
            const powerup = powerups[i];
            
            // 💖 MAGNET EFFECT: Hearts move toward player when close (feels rewarding!)
            const dx = ship.x - powerup.x;
            const dy = ship.y - powerup.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 200) {
                // Player is close - magnet effect!
                powerup.x += dx * 0.02;
                powerup.y += dy * 0.02;
            } else {
                // Too far - normal fall
                powerup.y += powerup.vy;
            }
            
            // Remove if off-screen
            if (powerup.y > canvas.height + 50) {
                powerups.splice(i, 1);
                continue;
            }
            
            // Check collision with player
            if (dist < ship.size + powerup.size) {
                // Collect powerup
                if (typeof window.game !== 'undefined' && window.game && 
                    window.game.lives < window.game.maxLives) {
                    window.game.lives++;
                    const livesEl = document.getElementById('lives');
                    if (livesEl) livesEl.textContent = window.game.lives;
                    if (typeof sounds !== 'undefined' && sounds.powerup) sounds.powerup();
                }
                powerups.splice(i, 1);
            }
        }
    }
    
    /**
     * Handle ship getting hit
     */
    function handleShipHit() {
        if (typeof window.game === 'undefined' || !window.game) {
            console.error('❌ Cannot handle ship hit - game object not initialized');
            return;
        }
        
        // 🛡️ COLLISION FORGIVENESS: Prevent double-hit deaths
        if (window.game.invulnerable > 0) return;  // Already invulnerable, ignore hit
        
        // Tank ship needs 2 hits to lose a life
        if (window.game.selectedShip === 2 && ship.defense === 2) {
            window.game.shipHitCount++;
            if (window.game.shipHitCount < 2) {
                // First hit - just flash, no life lost
                window.game.invulnerable = 90;  // 1.5 seconds invulnerability
                return;
            }
            // Second hit - lose a life
            window.game.shipHitCount = 0;
        }
        
        // Lose a life
        window.game.lives--;
        const livesEl = document.getElementById('lives');
        if (livesEl) livesEl.textContent = window.game.lives;
        
        // 🛡️ Give invulnerability after hit (1.5 seconds = 90 frames)
        window.game.invulnerable = 90;
        
        if (window.game.lives <= 0) {
            gameOver();
        } else {
            // Reset ship position
            ship.x = canvas.width / 2;
            ship.y = canvas.height / 2;
            ship.velocity.x = 0;
            ship.velocity.y = 0;
            window.game.invulnerable = 120;  // 2 seconds
        }
    }
    
    /**
     * Draw enemies (SHARK-LIKE!)
     */
    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.save();
            ctx.translate(enemy.x, enemy.y);
            
            // Calculate angle pointing at player
            const angle = Math.atan2(ship.y - enemy.y, ship.x - enemy.x);
            ctx.rotate(angle);
            
            // Draw MENACING SHARK
            ctx.strokeStyle = '#f00';
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.lineWidth = 3;
            
            // Body (elongated triangle)
            ctx.beginPath();
            ctx.moveTo(enemy.size * 1.5, 0);  // Nose (pointed front)
            ctx.lineTo(-enemy.size, enemy.size * 0.8);  // Top fin
            ctx.lineTo(-enemy.size * 1.2, 0);  // Tail
            ctx.lineTo(-enemy.size, -enemy.size * 0.8);  // Bottom fin
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Shark teeth (jagged mouth)
            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(enemy.size * 1.5, 0);
            ctx.lineTo(enemy.size * 0.8, enemy.size * 0.3);
            ctx.moveTo(enemy.size * 1.5, 0);
            ctx.lineTo(enemy.size * 0.8, -enemy.size * 0.3);
            ctx.stroke();
            
            // Eye (red glow)
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(enemy.size * 0.5, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }
    
    /**
     * Draw powerups (BIG VISIBLE HEARTS!)
     */
    function drawPowerups() {
        powerups.forEach(powerup => {
            ctx.save();
            ctx.translate(powerup.x, powerup.y);
            
            // Pulsing animation
            const pulse = 1 + Math.sin(Date.now() / 200) * 0.2;
            const size = powerup.size * pulse;
            
            // Draw BIG PINK HEART
            ctx.strokeStyle = '#ff0080';
            ctx.fillStyle = 'rgba(255, 0, 128, 0.5)';
            ctx.lineWidth = 3;
            
            // Heart shape (bigger and clearer)
            ctx.beginPath();
            ctx.arc(-size/2, -size/3, size/2, 0, Math.PI * 2);
            ctx.arc(size/2, -size/3, size/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(-size, 0);
            ctx.lineTo(0, size * 1.2);
            ctx.lineTo(size, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Glow effect
            ctx.shadowColor = '#ff0080';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#ff0080';
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.restore();
        });
    }
    
    /**
     * Pause game (ESC key)
     */
    // ❌ DELETED: pauseGame() and resumeGame() functions
    // These were conflicting with togglePause() and using wrong DOM IDs
    // Now ONLY togglePause() controls pause/resume (single source of truth)
    
    /**
     * Change ship mid-game
     */
    window.changeShip = function() {
        // Reset game
        if (typeof window.game !== 'undefined' && window.game) {
            window.game.score = 0;
            window.game.level = 1;
            window.game.frameCount = 0;
        }
        asteroids.length = 0;
        bullets.length = 0;
        enemies.length = 0;
        enemyBullets.length = 0;  // Clear shark bullets!
        powerups.length = 0;
        explosions.length = 0;
        
        // Hide settings, show ship selection
        const settings = document.getElementById('in-game-settings');
        if (settings) settings.style.display = 'none';
        
        const shipSelectionScreen = document.getElementById('ship-selection-screen');
        if (shipSelectionScreen) {
            shipSelectionScreen.style.display = 'flex';
        }
        
        if (typeof window.game !== 'undefined' && window.game) {
            window.game.state = 'shipselect';
        }
    };
    
    /**
     * Quit to main menu
     */
    window.quitGame = function() {
        // Reset everything
        if (typeof window.game !== 'undefined' && window.game) {
            window.game.score = 0;
            window.game.level = 1;
            window.game.frameCount = 0;
        }
        
        // Clear arrays if they exist
        if (typeof asteroids !== 'undefined') asteroids.length = 0;
        if (typeof bullets !== 'undefined') bullets.length = 0;
        if (typeof enemies !== 'undefined') enemies.length = 0;
        if (typeof enemyBullets !== 'undefined') enemyBullets.length = 0;
        if (typeof powerups !== 'undefined') powerups.length = 0;
        if (typeof explosions !== 'undefined') explosions.length = 0;
        
        // Hide settings, show welcome
        const settings = document.getElementById('in-game-settings');
        if (settings) settings.style.display = 'none';
        
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
        }
        
        if (typeof window.game !== 'undefined' && window.game) {
            window.game.state = 'welcome';
        }
        
        // 🎵 Stop background music when quitting
        if (typeof window.stopMusic === 'function') {
            window.stopMusic();
        }
    };
    
    /**
     * Show welcome settings menu
     */
    window.showWelcomeSettings = function() {
        document.getElementById('welcome-settings').style.display = 'flex';
    };
    
    /**
     * Hide welcome settings menu
     */
    window.hideWelcomeSettings = function() {
        document.getElementById('welcome-settings').style.display = 'none';
    };
    
    /**
     * Apply welcome settings and start
     */
    window.applyWelcomeSettings = function() {
        const levelInput = document.getElementById('start-level');
        let level = parseInt(levelInput.value) || 1;
        
        // Clamp level between 1 and 80
        level = Math.max(1, Math.min(80, level));
        
        // Set starting level
        if (typeof window.game !== 'undefined' && window.game) {
            window.game.level = level;
            window.game.lastLevelScore = (level - 1) * 500;  // Adjust score threshold
            window.game.score = window.game.lastLevelScore;
        }
        
        // Update displays
        if (typeof window.game !== 'undefined' && window.game) {
            const levelEl = document.getElementById('level');
            const scoreEl = document.getElementById('score');
            if (levelEl) levelEl.textContent = window.game.level;
            if (scoreEl) scoreEl.textContent = window.game.score;
        }
        
        // Hide settings, show ship selection
        hideWelcomeSettings();
        showShipSelection();
        
        console.log(`⚙️ Starting at Level ${level}!`);
    };
    
    /**
     * Toggle leaderboard panel
     * FIXED: Properly shows panel with display and z-index
     */
    window.toggleLeaderboard = function() {
        const panel = document.getElementById('leaderboard-panel');
        if (!panel) return;
        
        const isActive = panel.classList.contains('active');
        
        // HARD reset
        panel.classList.remove('active');
        panel.style.display = 'none';
        
        if (!isActive) {
            panel.classList.add('active');
            panel.style.display = 'flex';   // 🔥 Force display
            panel.style.zIndex = '9999';    // 🔥 Ensure above welcome screen
            loadLeaderboard('all');
        }
    };
    
    /**
     * Reset all UI overlays when returning to welcome screen
     * FIXED: Prevents panels from being stuck in hidden-but-active state
     */
    function resetUIOverlays() {
        const leaderboard = document.getElementById('leaderboard-panel');
        if (leaderboard) {
            leaderboard.classList.remove('active');
            leaderboard.style.display = 'none';
        }
        
        const inGameSettings = document.getElementById('in-game-settings');
        if (inGameSettings) {
            inGameSettings.classList.remove('active');
            inGameSettings.style.display = 'none';
        }
        
        const welcomeSettings = document.getElementById('welcome-settings');
        if (welcomeSettings) {
            welcomeSettings.style.display = 'none';
        }
        
        const levelUpModal = document.getElementById('level-up-modal');
        if (levelUpModal) {
            levelUpModal.style.display = 'none';
        }
    }
    
    /**
     * Reset all UI overlays when returning to welcome screen
     * FIXED: Prevents panels from being stuck in hidden-but-active state
     */
    function resetUIOverlays() {
        const leaderboard = document.getElementById('leaderboard-panel');
        if (leaderboard) {
            leaderboard.classList.remove('active');
            leaderboard.style.display = 'none';
        }
        
        const inGameSettings = document.getElementById('in-game-settings');
        if (inGameSettings) {
            inGameSettings.classList.remove('active');
            inGameSettings.style.display = 'none';
        }
        
        const welcomeSettings = document.getElementById('welcome-settings');
        if (welcomeSettings) {
            welcomeSettings.style.display = 'none';
        }
        
        const levelUpModal = document.getElementById('level-up-modal');
        if (levelUpModal) {
            levelUpModal.style.display = 'none';
        }
    }
    
    /**
     * Show leaderboard disabled message (fallback)
     */
    window.showLeaderboardDisabled = function() {
        toggleLeaderboard();
    };
    
    /**
     * Load leaderboard from Supabase
     * Made globally accessible for filter buttons
     */
    window.loadLeaderboard = async function(filter = 'all') {
        const listEl = document.getElementById('leaderboard-list');
        if (!listEl) return;
        
        listEl.innerHTML = '<div class="loading">Loading scores...</div>';
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        try {
            // Fetch top scores from Supabase
            const res = await fetch(
                `${SUPABASE_URL}/rest/v1/scores?select=player_name,score,level,created_at&order=score.desc&limit=20`,
                {
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`
                    }
                }
            );
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }
            
            const scores = await res.json();
            
            if (scores && scores.length > 0) {
                // Filter scores by time period if needed
                let filteredScores = filterScores(scores, filter);
                displayLeaderboard(filteredScores);
            } else {
                listEl.innerHTML = '<div class="loading">No scores yet. Be the first!</div>';
            }
        } catch (error) {
            console.error('❌ Leaderboard load failed:', error);
            listEl.innerHTML = '<div class="loading">Failed to load leaderboard. Please try again.</div>';
        }
    }
    
    /**
     * Filter scores by time period
     */
    function filterScores(scores, filter) {
        if (filter === 'all') return scores;
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        
        return scores.filter(score => {
            const scoreDate = new Date(score.created_at);
            
            if (filter === 'today') {
                return scoreDate >= today;
            } else if (filter === 'week') {
                return scoreDate >= weekAgo;
            }
            
            return true;
        });
    }
    
    /**
     * Display leaderboard entries
     */
    function displayLeaderboard(scores) {
        const listEl = document.getElementById('leaderboard-list');
        
        if (scores.length === 0) {
            listEl.innerHTML = '<div class="loading">No scores for this period.</div>';
            return;
        }
        
        let html = '';
        scores.forEach((score, index) => {
            const rank = index + 1;
            let rankClass = '';
            let medal = '';
            
            if (rank === 1) {
                rankClass = 'top-1';
                medal = '🥇';
            } else if (rank === 2) {
                rankClass = 'top-2';
                medal = '🥈';
            } else if (rank === 3) {
                rankClass = 'top-3';
                medal = '🥉';
            }
            
            html += `
                <div class="score-entry">
                    <div class="score-rank ${rankClass}">#${rank} ${medal}</div>
                    <div class="score-player">${escapeHtml(score.player_name)}</div>
                    <div class="score-value">${parseInt(score.score).toLocaleString()}</div>
                    <div class="score-level">Lv ${score.level || 1}</div>
                </div>
            `;
        });
        
        listEl.innerHTML = html;
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Check for level-up (every 500 points)
     */
    function checkLevelUp() {
        if (typeof window.game === 'undefined' || !window.game) return;
        
        const pointsPerLevel = 500;
        let newLevel = Math.floor(window.game.score / pointsPerLevel) + 1;
        
        // CAP AT LEVEL 80!
        if (newLevel > 80) {
            newLevel = 80;
            if (window.game.level === 80 && window.game.score >= 40000) {
                // VICTORY! Beat the game!
                window.game.state = 'gameover';
                
                const finalScoreEl = document.getElementById('final-score');
                const finalLevelEl = document.getElementById('final-level');
                const gameOverEl = document.getElementById('game-over');
                
                if (finalScoreEl) finalScoreEl.textContent = window.game.score;
                if (finalLevelEl) finalLevelEl.textContent = '80 (MAX - VICTORY!)';
                if (gameOverEl) gameOverEl.style.display = 'flex';
                
                // 🎵 Stop background music on victory
                if (typeof window.stopMusic === 'function') {
                    window.stopMusic();
                }
                
                alert('🏆 CONGRATULATIONS! You beat the game at Level 80! 🏆');
            }
        }
        
        if (newLevel > window.game.level && newLevel <= 80) {
            window.game.level = newLevel;
            showLevelUpModal();
            
            // Update UI
            const levelEl = document.getElementById('level');
            if (levelEl) levelEl.textContent = window.game.level;
            
            if (window.game.level === 80) {
                alert('⚠️ LEVEL 80 - FINAL LEVEL! Beat this to win!');
            }
        }
    }
    
    /**
     * Show level-up celebration modal
     */
    function showLevelUpModal() {
        if (typeof window.game === 'undefined' || !window.game) {
            console.error('❌ Cannot show level-up modal - game object not initialized');
            return;
        }
        
        // CRITICAL: PAUSE THE GAME FIRST! No cheating deaths during level-up!
        const previousState = window.game.state;
        window.game.state = 'paused';
        console.log('⏸️ Game PAUSED for level-up modal');
        
        const modal = document.getElementById('level-up-modal');
        const levelNumber = document.getElementById('level-up-number');
        const congratsMsg = document.querySelector('.congrats-message');
        
        if (levelNumber) levelNumber.textContent = window.game.level;
        
        // Custom congratulation messages
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
        
        if (congratsMsg) {
            congratsMsg.textContent = messages[Math.floor(Math.random() * messages.length)];
        }
        
        if (modal) {
            modal.classList.add('active');
        }
        
        if (typeof sounds !== 'undefined' && sounds.levelUp) {
            sounds.levelUp();
        }
        
        // Spawn enemies based on level (more enemies at higher levels)
        // Enemies spawn from level 2!
        if (window.game.level >= 2) {
            const enemyCount = Math.min(window.game.level - 1, 5);  // Level 2 = 1 enemy, Level 3 = 2, etc. Max 5
            for (let i = 0; i < enemyCount; i++) {
                setTimeout(() => {
                    if (typeof createEnemy === 'function') createEnemy();
                }, i * 2000);  // Stagger spawns
            }
        }
        
        // Spawn powerup occasionally
        if (Math.random() < 0.3) {  // 30% chance
            setTimeout(() => {
                if (typeof createPowerup === 'function') createPowerup();
            }, 1000);
        }
        
        // Hide after 3 seconds and RESUME game
        setTimeout(() => {
            if (modal) modal.classList.remove('active');
            
            // 🔧 FIX: ALWAYS resume to playing state (prevents freeze)
            // Don't check previousState - if modal showed, we should resume
            window.game.state = 'playing';
            console.log('▶️ Game RESUMED after level-up - STATE:', window.game.state);
            
            // 🔧 FIX: Ensure asteroids are spawned after level-up (prevents freeze)
            if (typeof asteroids !== 'undefined' && asteroids.length === 0) {
                const asteroidCount = Math.min(2 + Math.floor(window.game.level / 3), 4);
                if (typeof spawnAsteroids === 'function') {
                    spawnAsteroids(asteroidCount);
                    console.log(`✅ Spawned ${asteroidCount} asteroids for level ${window.game.level} after resume`);
                }
            }
            
            // 🔧 FIX: Save state after resuming
            if (typeof saveGameState === 'function') {
                saveGameState();
            }
        }, 3000);
    }
    
    /**
     * Override restart game to support new UI
     */
    window.restartGame = function() {
        document.getElementById('game-over').style.display = 'none';
        startGame();
    };
    
    // Setup filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            loadLeaderboard(filter);
        });
    });
    
    /* ========================================
       10. INITIALIZE
       ======================================== */
    
    console.log('🎮 VECTOR ASTEROIDS - Phase 1 Complete!');
    console.log('─────────────────────────────────────');
    console.log('Controls:');
    console.log('  W / ↑     = Thrust');
    console.log('  A / ←     = Rotate Left');
    console.log('  D / →     = Rotate Right');
    console.log('  SPACE     = Shoot / Start / Restart');
    console.log('─────────────────────────────────────');
    console.log('Phase 1 Features:');
    console.log('  ✓ Vector graphics');
    console.log('  ✓ Ship physics (thrust, rotation, inertia)');
    console.log('  ✓ Asteroids spawning & movement');
    console.log('  ✓ Shooting mechanics');
    console.log('  ✓ Collision detection');
    console.log('  ✓ Score system (in memory)');
    console.log('  ✓ Lives system');
    console.log('  ✓ Game states (start/play/gameover)');
    console.log('  ✓ Level progression');
    console.log('─────────────────────────────────────');
    console.log('Phase 2 Features:');
    console.log('  ✓ AJAX endpoint (WordPress plugin)');
    console.log('  ✓ Nonce security');
    console.log('  ✓ Score submission to backend');
    console.log('  ✓ Data validation & sanitization');
    console.log('─────────────────────────────────────');
    console.log('Phase 3 Features:');
    console.log('  ✓ Database table created');
    console.log('  ✓ Scores saved permanently');
    console.log('  ✓ Leaderboard API (top 10)');
    console.log('  ✓ Latest scores API');
    console.log('  ✓ Survives page refresh!');
    console.log('─────────────────────────────────────');
    console.log('Phase 4 Features:');
    console.log('  🎉 Welcome/Onboarding screen');
    console.log('  📊 Visual leaderboard panel');
    console.log('  🎯 Filter tabs (All/Today/Week)');
    console.log('  🚀 Level-up celebrations at 500 pts');
    console.log('  💎 Beautiful UI & animations');
    console.log('  👾 User-friendly controls');
    console.log('─────────────────────────────────────');
    console.log('Phase 5 Features (EPIC!):');
    console.log('  🚀 3 Ships to choose from!');
    console.log('  ⚡ Speed Demon (fast, strong, fragile)');
    console.log('  🛡️ Tank (high defense, asteroid immunity)');
    console.log('  ⚔️ Balanced (all-around, 3 lives)');
    console.log('  👾 Enemy ships attack you!');
    console.log('  💖 Power-up hearts restore health');
    console.log('  🔊 Sound effects (shoot, explode, level-up)');
    console.log('  🎯 Custom congratulation messages');
    console.log('  📈 Max lives increased to 5!');
    console.log('─────────────────────────────────────');
    console.log('Ready to play at: http://wp-vector-game.test/');
    
    // Add event listener to settings button as backup (in case onclick doesn't work)
    const settingsButton = document.querySelector('.btn-settings-mini');
    if (settingsButton) {
        settingsButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔧 Settings button clicked via event listener!');
            window.showInGameSettings();
        });
        console.log('✅ Settings button event listener attached!');
    } else {
        console.error('❌ Settings button not found!');
    }
    
    // Start the game loop
    gameLoop();
    
});

/* ========================================
   INSTRUCTION PAGE NAVIGATION
   ======================================== */

let currentInstructionPage = 1;
const totalInstructionPages = 4;

function nextInstructionPage() {
    if (currentInstructionPage < totalInstructionPages) {
        // Hide current page
        document.getElementById(`instruction-page-${currentInstructionPage}`).style.display = 'none';
        
        // Show next page
        currentInstructionPage++;
        document.getElementById(`instruction-page-${currentInstructionPage}`).style.display = 'block';
        
        // Update page indicator
        document.getElementById('page-indicator').textContent = `Page ${currentInstructionPage} of ${totalInstructionPages}`;
        
        // Enable/disable buttons
        document.getElementById('btn-prev-page').disabled = false;
        if (currentInstructionPage === totalInstructionPages) {
            document.getElementById('btn-next-page').disabled = true;
        }
    }
}

function previousInstructionPage() {
    if (currentInstructionPage > 1) {
        // Hide current page
        document.getElementById(`instruction-page-${currentInstructionPage}`).style.display = 'none';
        
        // Show previous page
        currentInstructionPage--;
        document.getElementById(`instruction-page-${currentInstructionPage}`).style.display = 'block';
        
        // Update page indicator
        document.getElementById('page-indicator').textContent = `Page ${currentInstructionPage} of ${totalInstructionPages}`;
        
        // Enable/disable buttons
        document.getElementById('btn-next-page').disabled = false;
        if (currentInstructionPage === 1) {
            document.getElementById('btn-prev-page').disabled = true;
        }
    }
}

/* ========================================
   IN-GAME SETTINGS MENU (DUPLICATE - REMOVED)
   Functions are now defined at the top of the file for immediate availability
   ======================================== */

