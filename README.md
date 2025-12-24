# 🚀 Vector Arcade Game

A mobile-friendly vector-style arcade shooter inspired by classic Asteroids, built with WordPress.

## 🎮 Features

- **Touch + Keyboard Controls** - Play on desktop or mobile
- **Multiple Ship Types** - Choose from Speed Demon, Tank, or Balanced
- **Enemy AI Ships** - Sharks that hunt and shoot at you
- **Power-ups** - Collect hearts to restore health
- **Pause / Resume** - Full game state management
- **Background Music & SFX** - Immersive audio experience
- **Persistent Leaderboard** - WordPress backend with MySQL storage
- **Level Progression** - 80 levels with increasing difficulty
- **Ship Selection** - 3 unique ships with different stats
- **Explosion Effects** - Visual feedback on destruction
- **Mobile Optimized** - Touch controls and responsive design

## 🕹️ Tech Stack

- **Frontend:** HTML5 Canvas, Vanilla JavaScript, CSS3
- **Backend:** WordPress (PHP), MySQL
- **Audio:** Web Audio API (SFX), HTMLAudioElement (Music)
- **Storage:** localStorage (game state), MySQL (scores)

## 📁 Project Structure

```
wp-content/
├── themes/
│   └── vector-game/
│       ├── style.css          # Theme styles
│       ├── index.php          # Main template
│       ├── functions.php      # Theme functions
│       ├── game.js            # Game logic (2900+ lines!)
│       └── assets/
│           └── audio.mp3      # Background music
│
└── plugins/
    └── vector-game-api/
        └── vector-game-api.php # Backend API & database
```

## 🚀 Installation

### Requirements

- WordPress 5.0+
- PHP 7.2+
- MySQL 5.5+

### Setup Steps

1. **Install WordPress** (if not already installed)

2. **Copy Theme:**
   ```
   wp-content/themes/vector-game/
   ```

3. **Copy Plugin:**
   ```
   wp-content/plugins/vector-game-api/
   ```

4. **Activate Theme:**
   - Go to `Appearance → Themes`
   - Activate "Vector Game"

5. **Activate Plugin:**
   - Go to `Plugins → Installed Plugins`
   - Activate "Vector Game API"

6. **Add Background Music (Optional):**
   - Place `audio.mp3` in `wp-content/themes/vector-game/assets/audio.mp3`

7. **Play:**
   - Visit your WordPress site homepage
   - Game loads automatically!

## 🎮 How to Play

### Controls

- **W / ↑** - Thrust forward
- **S / ↓** - Reverse thrust
- **A / ←** - Rotate left
- **D / →** - Rotate right
- **SPACE** - Fire bullets
- **ESC** - Pause/Resume

### Mobile Controls

- **Touch & Drag** - Steer and move
- **Tap** - Fire bullets
- **On-screen buttons** - Available during gameplay

### Gameplay

- Destroy asteroids to earn points
- Avoid enemy sharks and their bullets
- Collect hearts to restore health
- Level up every 500 points
- Survive to Level 80 for victory!

## 🏆 Leaderboard

Scores are saved to the database and displayed in-game with filters:
- **All Time** - All scores ever
- **Today** - Today's scores only
- **This Week** - Last 7 days

## 🛠️ Development

### Architecture

```
Browser (Frontend)
  ↓
Theme (HTML + Canvas + JS)      ← Frontend
  ↓
WordPress AJAX / REST           ← Backend API
  ↓
MySQL Database                  ← Persistence
```

### Key Files

- **`game.js`** - All game logic, physics, rendering
- **`vector-game-api.php`** - Backend API, database operations
- **`style.css`** - UI styling, responsive design
- **`index.php`** - HTML structure, UI elements

## 📱 Mobile Support

Fully playable on mobile devices with:
- Touch drag controls
- On-screen buttons
- Responsive UI
- Mobile-optimized layouts

## 🐛 Known Issues

None currently! All reported bugs have been fixed.

## 🔮 Future Enhancements

- Cloud save via WordPress user accounts
- Achievements system
- Boss fights every 10 levels
- Multiplayer mode
- Power-up shop
- Ship customization

## 📄 License

GPL v2 or later (WordPress compatible)

## 👤 Author:JIM-HILARY

Built with ❤️ and persistence.

## 🙏 Credits

- Inspired by classic Asteroids (1979)
- Built on WordPress
- Uses Web Audio API for sound effects

---

**Enjoy the game!** 🎮🚀

site link below
 https://jimhilary.github.io/vector-arcade-game/

