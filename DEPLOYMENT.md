# 🚀 Vector Arcade Game - Deployment & Setup Guide

## 📋 Table of Contents
- [GitHub Pages Deployment](#github-pages-deployment)
- [Supabase Backend Setup](#supabase-backend-setup)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Key Technologies](#key-technologies)

---

## 🌐 GitHub Pages Deployment

### Current Status
✅ **Live at:** `https://jimhilary.github.io/vector-arcade-game/`

### Deployment Details
- **Source Branch:** `main`
- **Source Folder:** `/docs`
- **Build System:** Static HTML/CSS/JS (no build step required)

### Files in `/docs` folder:
- `index.html` - Main game page
- `game.js` - All game logic (3,100+ lines)
- `style.css` - All styling
- `audio-base64.js` - Base64-encoded background music (4MB)
- `assets/audio.mp3` - Original audio file (for reference)

### How GitHub Pages Works
1. GitHub serves files from `/docs` folder
2. `index.html` is the entry point
3. All assets are static files
4. No server-side processing needed

---

## 🗄️ Supabase Backend Setup

### Database Configuration
- **URL:** `https://teebchutupnyzcbvlowq.supabase.co`
- **API Key:** `sb_publishable_7CAVpenNtPVMKE-WsnPPMQ_52A51sS_`

### Database Table: `scores`

**Schema:**
```sql
CREATE TABLE scores (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    player_name text NOT NULL,
    score integer NOT NULL,
    level integer NOT NULL,
    created_at timestamptz DEFAULT now()
);
```

### API Endpoints Used

#### Submit Score
```javascript
POST https://teebchutupnyzcbvlowq.supabase.co/rest/v1/scores
Headers:
  - apikey: sb_publishable_7CAVpenNtPVMKE-WsnPPMQ_52A51sS_
  - Authorization: Bearer sb_publishable_7CAVpenNtPVMKE-WsnPPMQ_52A51sS_
  - Content-Type: application/json
Body:
  {
    "player_name": "Player Name",
    "score": 1000,
    "level": 5
  }
```

#### Get Leaderboard
```javascript
GET https://teebchutupnyzcbvlowq.supabase.co/rest/v1/scores?select=player_name,score,level,created_at&order=score.desc&limit=20
Headers:
  - apikey: sb_publishable_7CAVpenNtPVMKE-WsnPPMQ_52A51sS_
  - Authorization: Bearer sb_publishable_7CAVpenNtPVMKE-WsnPPMQ_52A51sS_
```

### Row Level Security (RLS)
⚠️ **Currently DISABLED** for simplicity
- For production, enable RLS and create policies

---

## 💻 Local Development Setup

### Prerequisites
- Git installed
- Code editor (VS Code recommended)
- Web browser (Chrome/Firefox)
- Node.js (optional, for generating Base64 audio)

### Step 1: Clone the Repository
```bash
git clone https://github.com/jimhilary/vector-arcade-game.git
cd vector-arcade-game
```

### Step 2: Open in Browser
```bash
# Option 1: Use a local server (recommended)
# Python 3:
python -m http.server 8000

# Python 2:
python -m SimpleHTTPServer 8000

# Node.js (if you have it):
npx http-server

# Then open: http://localhost:8000/docs/
```

### Step 3: Edit Files
- **Main game logic:** `docs/game.js`
- **Styling:** `docs/style.css`
- **HTML structure:** `docs/index.html`

### Step 4: Test Changes
1. Open `http://localhost:8000/docs/` in browser
2. Test all game features
3. Check console for errors (F12)

### Step 5: Commit & Push
```bash
git add docs/game.js docs/style.css docs/index.html
git commit -m "Description of changes"
git push origin main
```

**Note:** GitHub Pages auto-deploys from `main` branch `/docs` folder

---

## 📁 Project Structure

```
vector-arcade-game/
├── docs/                          # GitHub Pages deployment folder
│   ├── index.html                 # Main game page
│   ├── game.js                    # All game logic (3,100+ lines)
│   ├── style.css                  # All styling
│   ├── audio-base64.js            # Base64-encoded audio (4MB)
│   ├── assets/
│   │   └── audio.mp3              # Original audio file
│   └── .nojekyll                  # Disable Jekyll processing
│
├── wp-content/                    # WordPress files (local dev only)
│   ├── themes/vector-game/        # WordPress theme
│   └── plugins/vector-game-api/   # WordPress plugin
│
├── generate-audio-base64.js       # Script to regenerate Base64 audio
├── .gitignore                     # Git ignore rules
├── .gitattributes                 # Git LFS config
├── README.md                      # Project overview
├── DEPLOYMENT.md                  # This file
└── PHASE-*-DOCUMENTATION.md       # Development phase docs
```

---

## 🔧 Key Technologies

### Frontend
- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript** - No frameworks
- **CSS3** - Styling with media queries
- **Web Audio API** - Sound effects
- **LocalStorage** - Game state persistence

### Backend
- **Supabase** - Database & API
- **REST API** - Score submission & leaderboard

### Audio
- **Base64 Encoding** - Background music embedded
- **Web Audio API** - Sound effects

---

## 🎮 Game Features

### Core Mechanics
- Ship movement (thrust, rotation, inertia)
- Asteroid destruction
- Enemy ships (sharks) with AI
- Power-up hearts
- Bullet physics
- Collision detection

### UI Features
- Welcome/onboarding screen
- Ship selection (3 types)
- In-game settings menu
- Leaderboard panel
- Level-up celebrations
- Mobile controls

### Game States
- `welcome` - Welcome screen
- `shipselect` - Ship selection
- `start` - Ready to start
- `playing` - Active gameplay
- `paused` - Game paused
- `gameover` - Game over screen

---

## 🐛 Troubleshooting

### Audio Not Playing
- Check browser console for errors
- Verify `audio-base64.js` is loaded
- Check Network tab for failed requests

### Leaderboard Not Loading
- Verify Supabase API key is correct
- Check browser console for CORS errors
- Ensure RLS is disabled (or policies are set)

### Mobile Controls Not Working
- Check touch event handlers
- Verify mobile controls are visible
- Test on actual device (not just emulator)

---

## 📝 Important Notes

### Base64 Audio
- File size: ~4MB
- Regenerate if audio file changes:
  ```bash
  node generate-audio-base64.js
  ```

### LocalStorage
- Game state persists across refreshes
- Cleared on game over or quit
- Only saves when `playing` or `paused`

### Supabase Keys
⚠️ **Security Note:** API keys are in client-side code
- For production, consider using environment variables
- Or implement a proxy server

---

## 🚀 Quick Start Commands

```bash
# Clone project
git clone https://github.com/jimhilary/vector-arcade-game.git
cd vector-arcade-game

# Start local server
python -m http.server 8000

# Open browser
# http://localhost:8000/docs/

# Make changes, then:
git add .
git commit -m "Your changes"
git push origin main
```

---

## 📞 Support

For issues or questions:
1. Check browser console (F12)
2. Review this documentation
3. Check GitHub Issues
4. Review phase documentation files

---

**Last Updated:** December 2024
**Version:** 1.0
**Status:** ✅ Production Ready

